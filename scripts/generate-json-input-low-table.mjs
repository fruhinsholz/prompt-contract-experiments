#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const MANIFEST_PATH = "experiments/json-input-low/manifest.json";

const CONTEXT_LABELS = new Map([
  ["fact_only", "No added context"],
  ["retrieved_100000_contract", "$100k retrieved context"],
]);

function rel(...parts) {
  return path.join(ROOT, ...parts);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(rel(relativePath), "utf8"));
}

async function hashFile(relativePath) {
  const data = await readFile(rel(relativePath));
  return createHash("sha256").update(data).digest("hex");
}

function hashJson(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = lines.shift().split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function money(value) {
  return "$" + Number(value).toLocaleString("en-US");
}

async function fileInfo(relativePath) {
  const info = await stat(rel(relativePath));
  return {
    path: relativePath,
    bytes: info.size,
    sha256: await hashFile(relativePath),
  };
}

function runtimeLabel(amount, thresholdUsd) {
  return Number(amount) <= thresholdUsd ? "LOW" : "NOT_LOW";
}

function promptErrorCount(row, thresholdUsd) {
  const expected = runtimeLabel(row.amount, thresholdUsd);
  const low = Number(row.low);
  const notLow = Number(row.not_low);
  const invalid = Number(row.invalid);
  return expected === "LOW" ? notLow + invalid : low + invalid;
}

function rowKey(row) {
  return `${row.model}\u0000${row.context_id}\u0000${row.format_id}\u0000${row.amount}`;
}

function runSummaryIndex(rows) {
  return new Map(rows.map((row) => [rowKey(row), row]));
}

function buildTableRows({ manifest, config, runIndexes }) {
  const thresholdUsd = config.threshold_usd;
  const tableRows = [];
  for (const rowSpec of config.rows) {
    const controlIndex = runIndexes.get(rowSpec.control_run_id);
    const contextIndex = runIndexes.get(rowSpec.context_run_id);
    if (!controlIndex) throw new Error(`Missing control run index: ${rowSpec.control_run_id}`);
    if (!contextIndex) throw new Error(`Missing context run index: ${rowSpec.context_run_id}`);
    for (const amount of config.amounts) {
      const control = controlIndex.byCell.get(`${rowSpec.model}\u0000fact_only\u0000${config.format_id}\u0000${amount}`);
      const context = contextIndex.byCell.get(`${rowSpec.model}\u0000retrieved_100000_contract\u0000${config.format_id}\u0000${amount}`);
      if (!control) throw new Error(`Missing control row for ${rowSpec.model} amount ${amount}`);
      if (!context) throw new Error(`Missing context row for ${rowSpec.model} amount ${amount}`);
      const total = Number(context.total);
      const expected = runtimeLabel(amount, thresholdUsd);
      tableRows.push({
        model: rowSpec.model,
        provider: rowSpec.provider,
        amount,
        threshold_usd: thresholdUsd,
        expected_label: expected,
        control: {
          run_id: rowSpec.control_run_id,
          low: Number(control.low),
          not_low: Number(control.not_low),
          invalid: Number(control.invalid),
          total: Number(control.total),
          error_count: promptErrorCount(control, thresholdUsd),
        },
        retrieved_context: {
          run_id: rowSpec.context_run_id,
          low: Number(context.low),
          not_low: Number(context.not_low),
          invalid: Number(context.invalid),
          total,
          error_count: promptErrorCount(context, thresholdUsd),
        },
        runtime_enforced: {
          low: expected === "LOW" ? total : 0,
          not_low: expected === "NOT_LOW" ? total : 0,
          invalid: 0,
          total,
          error_count: 0,
        },
      });
    }
  }
  return tableRows.sort((a, b) => `${a.model}:${a.amount}`.localeCompare(`${b.model}:${b.amount}`, undefined, { numeric: true }));
}

function renderMarkdown({ config, tableRows, provenanceHash }) {
  const sourceRunIds = [...new Set(tableRows.flatMap((row) => [row.control.run_id, row.retrieved_context.run_id]))];
  const lines = [
    `<!-- generated:json-input-low-table manifest:${MANIFEST_PATH} source_runs:${sourceRunIds.join(",")} hash:${provenanceHash} -->`,
    "",
    "Publication-clean LOW boundary probe. Counts are generated from fixed-grid `n=100` runs. The table compares the no-added-context control, the `$100k` retrieved-context condition, and deterministic runtime enforcement. It intentionally reports raw counts instead of fold multipliers.",
    "",
    `Operational rule: \`LOW iff refund_claim_amount_usd <= ${config.threshold_usd}\`.`,
    `Prompt format: \`${config.format_id}\`.`,
    "",
  ];
  for (const model of [...new Set(tableRows.map((row) => row.model))].sort()) {
    lines.push(`## ${model}`, "", "| Amount | Expected | No-context LOW | No-context errors | $100k-context LOW | $100k-context errors | Runtime errors |", "| ---: | --- | ---: | ---: | ---: | ---: | ---: |");
    for (const row of tableRows.filter((item) => item.model === model).sort((a, b) => a.amount - b.amount)) {
      const cRate = row.control.error_count / row.control.total;
      const kRate = row.retrieved_context.error_count / row.retrieved_context.total;
      lines.push(`| ${money(row.amount)} | \`${row.expected_label}\` | ${row.control.low}/${row.control.total} | ${row.control.error_count}/${row.control.total} (${pct(cRate)}) | ${row.retrieved_context.low}/${row.retrieved_context.total} | ${row.retrieved_context.error_count}/${row.retrieved_context.total} (${pct(kRate)}) | ${row.runtime_enforced.error_count}/${row.runtime_enforced.total} |`);
    }
    lines.push("");
  }
  lines.push("Caption: `No-context` is the same refund classifier without retrieved context. `$100k-context` adds a separate enterprise contract note. `Runtime errors` are derived by applying the code-owned rule to the same amount grid, not by making another model call. Generated from `" + MANIFEST_PATH + "`.");
  lines.push("");
  lines.push(`<!-- /generated:json-input-low-table -->`);
  return `${lines.join("\n")}\n`;
}

async function main() {
  const check = process.argv.includes("--check");
  const manifest = await readJson(MANIFEST_PATH);
  const config = manifest.publication_clean_table;
  if (!config) throw new Error("manifest.publication_clean_table is required.");
  const runsById = new Map(manifest.runs.map((run) => [run.id, run]));
  const runIds = [...new Set(config.rows.flatMap((row) => [row.control_run_id, row.context_run_id]))];
  const runIndexes = new Map();
  for (const runId of runIds) {
    const run = runsById.get(runId);
    if (!run) throw new Error(`Missing run: ${runId}`);
    if (run.status !== "current") throw new Error(`Publication-clean source run is not current: ${runId}`);
    const summaryPath = path.join(run.run_dir, "summary.csv");
    runIndexes.set(runId, {
      run,
      summaryPath,
      metadataPath: path.join(run.run_dir, "metadata.json"),
      callsPath: path.join(run.run_dir, "calls.jsonl"),
      byCell: runSummaryIndex(parseCsv(await readFile(rel(summaryPath), "utf8"))),
    });
  }

  const tableRows = buildTableRows({ manifest, config, runIndexes });
  const manifestHash = await hashFile(MANIFEST_PATH);
  const sourceFiles = [];
  for (const runId of runIds) {
    const runIndex = runIndexes.get(runId);
    sourceFiles.push(
      { run_id: runId, ...(await fileInfo(runIndex.summaryPath)) },
      { run_id: runId, ...(await fileInfo(runIndex.metadataPath)) },
      { run_id: runId, ...(await fileInfo(runIndex.callsPath)) },
    );
  }
  const output = {
    schema_version: "json-input-low.article-table.v2",
    manifest_path: MANIFEST_PATH,
    manifest_sha256: manifestHash,
    source_run_ids: runIds,
    source_run_dirs: runIds.map((runId) => runsById.get(runId).run_dir),
    source_files: sourceFiles,
    contexts: Object.fromEntries((config.contexts ?? []).map((id) => [id, CONTEXT_LABELS.get(id) ?? id])),
    threshold_usd: config.threshold_usd,
    format_id: config.format_id,
    provenance_hash: hashJson({ manifestHash, runIds, sourceFiles, tableRows }),
    table_rows: tableRows,
  };
  const markdown = renderMarkdown({ config, tableRows, provenanceHash: output.provenance_hash });
  const jsonText = `${JSON.stringify(output, null, 2)}\n`;

  const markdownPath = config.outputs.markdown;
  const jsonPath = config.outputs.json;
  if (check) {
    const currentMarkdown = await readFile(rel(markdownPath), "utf8");
    const currentJson = await readFile(rel(jsonPath), "utf8");
    if (currentMarkdown !== markdown || currentJson !== jsonText) {
      throw new Error("Generated JSON input LOW table is stale. Run npm run results:json-input-low:table.");
    }
    console.log("JSON input LOW generated table is current.");
    return;
  }

  await mkdir(path.dirname(rel(markdownPath)), { recursive: true });
  await writeFile(rel(markdownPath), markdown, "utf8");
  await writeFile(rel(jsonPath), jsonText, "utf8");
  console.log(`Wrote ${markdownPath} and ${jsonPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
