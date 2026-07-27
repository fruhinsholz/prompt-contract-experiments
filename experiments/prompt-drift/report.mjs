#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(new URL("../..", import.meta.url).pathname);
const RESULTS_DIR = path.join(ROOT, "experiments/prompt-drift/results");

function usage() {
  return `Usage: node experiments/prompt-drift/report.mjs [result.jsonl] [--out report.md]

If no result file is provided, the newest JSONL file in experiments/prompt-drift/results is used.`;
}

function parseArgs(argv) {
  const args = { file: null, out: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--out") args.out = argv[++i];
    else if (!args.file) args.file = arg;
    else throw new Error(`Unexpected argument: ${arg}`);
  }
  return args;
}

async function newestResultFile() {
  if (!existsSync(RESULTS_DIR)) throw new Error(`Missing results directory: ${RESULTS_DIR}`);
  const files = (await readdir(RESULTS_DIR)).filter((name) => name.endsWith(".jsonl")).map((name) => path.join(RESULTS_DIR, name)).sort();
  if (files.length === 0) throw new Error("No JSONL result files found.");
  return files.at(-1);
}

function pct(n, total) {
  if (!total) return "0.0%";
  return `${((n / total) * 100).toFixed(1)}%`;
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function parseJsonl(raw) {
  return raw.split(/\r?\n/).filter((line) => line.trim()).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`Invalid JSONL at line ${index + 1}: ${error.message}`);
    }
  });
}

function summarize(rows) {
  const groups = new Map();
  const metadata = { scenarioId: null, createdAt: null };

  for (const row of rows) {
    if (row.type === "run_start") {
      metadata.scenarioId = row.scenario?.id ?? metadata.scenarioId;
      metadata.createdAt = row.createdAt ?? metadata.createdAt;
      continue;
    }
    if (row.type !== "completion") continue;

    const key = `${row.scenarioId}|||${row.model}|||${row.variantId}`;
    if (!groups.has(key)) {
      groups.set(key, {
        scenarioId: row.scenarioId,
        model: row.model,
        variantId: row.variantId,
        counts: new Map(),
        strictCounts: new Map(),
        total: 0,
        errors: 0,
        examples: [],
      });
    }

    const group = groups.get(key);
    group.total += 1;
    increment(group.counts, row.label ?? "other");
    increment(group.strictCounts, row.strictLabel ?? "other");
    if (row.error) group.errors += 1;
    if (group.examples.length < 3 && row.outputText) {
      group.examples.push({ label: row.label, strictLabel: row.strictLabel, outputText: row.outputText });
    }
  }

  return { groups: [...groups.values()], metadata };
}

function renderMarkdown(file, rows, summary) {
  const { groups, metadata } = summary;
  const lines = [];
  lines.push("# Prompt Drift Report", "");
  lines.push(`Source: \`${path.relative(ROOT, file)}\``);
  if (metadata.createdAt) lines.push(`Created: ${metadata.createdAt}`);
  if (metadata.scenarioId) lines.push(`Scenario: \`${metadata.scenarioId}\``);
  lines.push(`Rows: ${rows.filter((row) => row.type === "completion").length}`, "");
  lines.push("## Distribution", "");
  lines.push("| Scenario | Model | Variant | Total | 3 | 4 | Other | Strict 3 | Strict 4 | Strict other | Errors |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");

  for (const group of groups.sort((a, b) => `${a.model}:${a.variantId}`.localeCompare(`${b.model}:${b.variantId}`))) {
    const three = group.counts.get("3") ?? 0;
    const four = group.counts.get("4") ?? 0;
    const other = group.total - three - four;
    const strictThree = group.strictCounts.get("3") ?? 0;
    const strictFour = group.strictCounts.get("4") ?? 0;
    const strictOther = group.total - strictThree - strictFour;
    lines.push(`| \`${group.scenarioId}\` | \`${group.model}\` | \`${group.variantId}\` | ${group.total} | ${three} (${pct(three, group.total)}) | ${four} (${pct(four, group.total)}) | ${other} (${pct(other, group.total)}) | ${strictThree} (${pct(strictThree, group.total)}) | ${strictFour} (${pct(strictFour, group.total)}) | ${strictOther} (${pct(strictOther, group.total)}) | ${group.errors} |`);
  }

  lines.push("", "## Sample Outputs");
  for (const group of groups) {
    lines.push("", `### ${group.model} / ${group.variantId}`);
    for (const example of group.examples) {
      const text = String(example.outputText).replace(/\s+/g, " ").slice(0, 300);
      lines.push(`- label=${example.label}, strict=${example.strictLabel}: \`${text}\``);
    }
  }

  return `${lines.join("\n")}\n`;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(usage());
  process.exit(0);
}

const file = path.resolve(args.file ?? (await newestResultFile()));
const rows = parseJsonl(await readFile(file, "utf8"));
const markdown = renderMarkdown(file, rows, summarize(rows));

if (args.out) await writeFile(path.resolve(args.out), markdown, "utf8");
else process.stdout.write(markdown);
