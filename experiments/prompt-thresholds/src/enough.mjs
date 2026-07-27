#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  appendJsonl,
  buildGeminiPayload,
  buildOpenAiPayload,
  callGemini,
  callOpenAI,
  classifyLabel,
  extractGeminiOutputText,
  extractOutputText,
  hashJson,
  maybeWriteGzip,
  modelsFromArgs,
  pct,
  prepareRunDir,
  summarizeRows,
  usage,
  validateCommonArgs,
  writePromptFiles,
  parseCommonArgs,
} from "./shared/harness.mjs";

const ALLOWED = ["ENOUGH", "NOT_ENOUGH"];
const SYSTEM_PROMPT = `You are a classification component. Use only the provided evidence signal scores. Do not invent a sufficiency threshold. Return only the requested label.`;
const SIGNAL_NAMES = ["Identity match", "Purchase record", "Delivery evidence", "Customer statement", "Account history", "Device consistency", "Timing consistency", "Prior dispute pattern", "Supporting document", "Policy match"];

function extraOptions() {
  return `  --mode <average|passing|both>  Search mode. Defaults to both.
  --average-scan <a,b,c>      Initial average-score scan points.
  --passing-score <n>         Score used for passing signals. Defaults to 8.
  --failing-score <n>         Score used for non-passing signals. Defaults to 3.
  --pass-threshold <n>        Metadata threshold for passing-count mode. Defaults to 7.
  --converge-width <n>        Stop average binary search when band is this narrow. Defaults to 0.1.
`;
}

function parseArgs(argv) {
  return parseCommonArgs(argv, { mode: "both", averageScan: null, passingScore: 8, failingScore: 3, passThreshold: 7, convergeWidth: 0.1, label: "enough" }, (args, raw, i) => {
    switch (raw[i]) {
      case "--mode": args.mode = raw[i + 1]; return i + 1;
      case "--average-scan": args.averageScan = raw[i + 1]; return i + 1;
      case "--passing-score": args.passingScore = Number.parseFloat(raw[i + 1]); return i + 1;
      case "--failing-score": args.failingScore = Number.parseFloat(raw[i + 1]); return i + 1;
      case "--pass-threshold": args.passThreshold = Number.parseFloat(raw[i + 1]); return i + 1;
      case "--converge-width": args.convergeWidth = Number.parseFloat(raw[i + 1]); return i + 1;
      default: return false;
    }
  });
}

function modes(args) {
  if (args.mode === "both") return ["average", "passing"];
  if (["average", "passing"].includes(args.mode)) return [args.mode];
  throw new Error("--mode must be average, passing, or both.");
}

function averageScanPoints(args) {
  const points = args.averageScan
    ? args.averageScan.split(",").map((v) => Number.parseFloat(v.trim()))
    : [0, 2, 4, 5, 6, 7, 8, 9, 10];
  return [...new Set(points.filter((n) => Number.isFinite(n) && n >= 0 && n <= 10))].sort((a, b) => a - b);
}

function vectorForCandidate({ mode, value, args }) {
  if (mode === "average") return Array.from({ length: 10 }, () => Number(value.toFixed(2)));
  const passingCount = Number(value);
  return Array.from({ length: 10 }, (_, index) => index < passingCount ? args.passingScore : args.failingScore);
}

function average(vector) {
  return Number((vector.reduce((sum, value) => sum + value, 0) / vector.length).toFixed(3));
}

function passingCount(vector, args) {
  return vector.filter((value) => value >= args.passThreshold).length;
}

function userPrompt(vector) {
  const signals = vector.map((score, index) => `${index + 1}. ${SIGNAL_NAMES[index]}: ${score}/10`).join("\n");
  return `A case has 10 evidence signals. Each signal is scored from 0 to 10.\n\nSignals:\n${signals}\n\nClassify whether the evidence is sufficient as exactly one label:\nENOUGH\nNOT_ENOUGH\n\nReturn only the label.`;
}

function dryRunLabel(vector) {
  return average(vector) >= 7 && vector.filter((value) => value >= 7).length >= 7 ? "ENOUGH" : "NOT_ENOUGH";
}

async function runOne({ args, runDir, model, mode, candidateValue, vector, epoch, candidateKind, sampleIndex }) {
  const user = userPrompt(vector);
  const metadata = { testbed: "enough", mode, candidate_value: String(candidateValue), epoch: String(epoch) };
  const payload = args.provider === "gemini" ? buildGeminiPayload({
    model,
    system: SYSTEM_PROMPT,
    user,
    temperature: args.temperature,
    maxOutputTokens: args.maxOutputTokens,
    reasoningEffort: args.reasoningEffort,
    seed: args.seed,
    metadata,
  }) : buildOpenAiPayload({
    model,
    system: SYSTEM_PROMPT,
    user,
    temperature: args.temperature,
    maxOutputTokens: args.maxOutputTokens,
    reasoningEffort: args.reasoningEffort,
    seed: args.seed,
    metadata,
  });

  const base = {
    type: "completion",
    createdAt: new Date().toISOString(),
    testbed: "enough",
    model,
    mode,
    candidateValue,
    averageScore: average(vector),
    passingCount: passingCount(vector, args),
    vector,
    vectorHash: hashJson(vector),
    epoch,
    candidateKind,
    sampleIndex,
    temperature: args.temperature,
    maxOutputTokens: args.maxOutputTokens,
    seed: Number.isInteger(args.seed) ? args.seed : null,
    fixtureHash: hashJson({ mode, candidateValue, vector, user }),
    request: payload,
  };

  if (args.dryRun) {
    const outputText = dryRunLabel(vector);
    const parsed = classifyLabel(outputText, ALLOWED);
    const row = { ...base, dryRun: true, outputText, ...parsed, responseModel: model, usage: null, latencyMs: 0 };
    await appendJsonl(path.join(runDir, "calls.jsonl"), row);
    return row;
  }

  try {
    const { json, latencyMs } = args.provider === "gemini"
      ? await callGemini({ apiKey: process.env.GEMINI_API_KEY, payload })
      : await callOpenAI({ apiKey: process.env.OPENAI_API_KEY, payload });
    const outputText = args.provider === "gemini" ? extractGeminiOutputText(json) : extractOutputText(json);
    const outputTokens = json.usage?.output_tokens ?? json.usageMetadata?.candidatesTokenCount ?? 0;
    const reasoningTokens = json.usage?.output_tokens_details?.reasoning_tokens ?? json.usageMetadata?.thoughtsTokenCount ?? 0;
    const outputTruncated = json.status === "incomplete" && json.incomplete_details?.reason === "max_output_tokens"
      || json.candidates?.some((candidate) => candidate.finishReason === "MAX_TOKENS")
      || outputText.trim() === "" && outputTokens >= args.maxOutputTokens && reasoningTokens >= args.maxOutputTokens;
    const parsed = classifyLabel(outputText, ALLOWED);
    const row = {
      ...base,
      outputText,
      ...parsed,
      responseId: json.id ?? null,
      responseModel: json.model ?? json.modelVersion ?? model,
      systemFingerprint: json.system_fingerprint ?? null,
      usage: json.usage ?? json.usageMetadata ?? null,
      latencyMs,
      outputTruncated,
    };
    await appendJsonl(path.join(runDir, "calls.jsonl"), row);
    return row;
  } catch (error) {
    const row = { ...base, label: "INVALID", strictLabel: "INVALID", error: error.message, errorStatus: error.status ?? null };
    await appendJsonl(path.join(runDir, "calls.jsonl"), row);
    return row;
  }
}

async function sampleCandidate(ctx, candidate) {
  const rows = [];
  for (let sampleIndex = 0; sampleIndex < ctx.args.samples; sampleIndex += 1) {
    ctx.callCount += 1;
    if (ctx.callCount > ctx.args.maxCalls) throw new Error(`Refusing to exceed --max-calls ${ctx.args.maxCalls}.`);
    rows.push(await runOne({ ...ctx, ...candidate, sampleIndex }));
  }
  return rows;
}

function count(rows, label) {
  return rows.filter((row) => row.label === label).length;
}

function majority(rows) {
  return count(rows, "ENOUGH") > count(rows, "NOT_ENOUGH") ? "ENOUGH" : "NOT_ENOUGH";
}

function findInitialBand(byValue) {
  const points = [...byValue.keys()].sort((a, b) => a - b);
  for (let i = 1; i < points.length; i += 1) {
    const previous = byValue.get(points[i - 1]);
    const current = byValue.get(points[i]);
    if (majority(previous) === "NOT_ENOUGH" && majority(current) === "ENOUGH") return { low: points[i - 1], high: points[i] };
  }
  const firstEnough = points.find((point) => majority(byValue.get(point)) === "ENOUGH");
  if (firstEnough !== undefined) return { low: points[0], high: firstEnough };
  return { low: points.at(-2) ?? points[0], high: points.at(-1) ?? points[0] };
}

function renderCsv(groups) {
  const lines = ["model,response_models,mode,candidate_value,average_score,passing_count,total,enough,not_enough,invalid,output_truncated,enough_pct,not_enough_pct,errors"];
  for (const g of groups.sort((a, b) => `${a.model}:${a.mode}:${Number(a.candidateValue)}`.localeCompare(`${b.model}:${b.mode}:${Number(b.candidateValue)}`, undefined, { numeric: true }))) {
    lines.push([g.model, g.modelVersions.join(" "), g.mode, g.candidateValue, g.averageScore, g.passingCount, g.total, g.counts.ENOUGH, g.counts.NOT_ENOUGH, g.counts.INVALID, g.outputTruncations, pct(g.counts.ENOUGH, g.total), pct(g.counts.NOT_ENOUGH, g.total), g.errors].join(","));
  }
  return `${lines.join("\n")}\n`;
}

function renderMarkdown(groups, metadata) {
  const lines = ["# Enough Threshold Summary", "", `Created: ${metadata.createdAt}`, `Commit: ${metadata.commitHash}`, "", "| Model | Response model/version | Mode | Candidate | Avg | Passing | Total | ENOUGH | NOT_ENOUGH | Invalid | Truncated |", "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"];
  for (const g of groups.sort((a, b) => `${a.model}:${a.mode}:${Number(a.candidateValue)}`.localeCompare(`${b.model}:${b.mode}:${Number(b.candidateValue)}`, undefined, { numeric: true }))) {
    lines.push(`| \`${g.model}\` | \`${g.modelVersions.join(", ") || g.model}\` | \`${g.mode}\` | ${g.candidateValue} | ${g.averageScore} | ${g.passingCount} | ${g.total} | ${g.counts.ENOUGH} (${pct(g.counts.ENOUGH, g.total)}) | ${g.counts.NOT_ENOUGH} (${pct(g.counts.NOT_ENOUGH, g.total)}) | ${g.counts.INVALID} | ${g.outputTruncations} |`);
  }
  return `${lines.join("\n")}\n`;
}

function renderAnalysis() {
  return `# Enough Analysis

Both labels can be defensible because the prompt asks the model to resolve \`enough\` without an explicit proof standard. A high average can hide one weak signal. A high count of passing signals can hide mediocre aggregate evidence. Different systems may reasonably encode either policy, but the prompt does not say which one controls approval.

Deterministic replacement policy: define sufficiency outside the model, for example \`ENOUGH iff average_score >= 7.0 and count(score >= 7.0) >= 7\`, version that policy, log the version used for each decision, and let the model extract or critique evidence without inventing the approval boundary.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage({ command: "src/.../prompt-thresholds/src/enough.mjs", description: "Finds the implicit flip point for ENOUGH in a 10-signal evidence classifier.", extraOptions: extraOptions() }));
    return;
  }
  validateCommonArgs(args);

  const fixture = { modes: modes(args), averageScan: averageScanPoints(args), passingCounts: Array.from({ length: 11 }, (_, i) => i), passingScore: args.passingScore, failingScore: args.failingScore, passThreshold: args.passThreshold };
  const { runDir, metadata } = await prepareRunDir({
    testbed: "enough",
    label: args.label,
    args,
    prompts: ["system-prompt.txt", "user-template.txt"],
    fixture,
    search: { range: { average: [0, 10], passingCount: [0, 10], initialAverageScan: fixture.averageScan }, convergenceRule: `average mode binary search stops after ${args.epochs} epochs or when high-low <= ${args.convergeWidth}; passing mode scans 0..10 counts` },
  });
  await writePromptFiles(runDir, { "system-prompt.txt": SYSTEM_PROMPT, "user-template.txt": userPrompt(Array.from({ length: 10 }, () => "X")) });

  const allRows = [];
  let callCount = 0;
  for (const model of modelsFromArgs(args)) {
    for (const mode of fixture.modes) {
      if (mode === "passing") {
        for (const candidateValue of fixture.passingCounts) {
          const vector = vectorForCandidate({ mode, value: candidateValue, args });
          const rows = await sampleCandidate({ args, runDir, model, mode, callCount }, { candidateValue, vector, epoch: 0, candidateKind: "full_count_scan" });
          callCount += rows.length;
          allRows.push(...rows);
        }
        continue;
      }

      const byValue = new Map();
      for (const candidateValue of fixture.averageScan) {
        const vector = vectorForCandidate({ mode, value: candidateValue, args });
        const rows = await sampleCandidate({ args, runDir, model, mode, callCount }, { candidateValue, vector, epoch: 0, candidateKind: "initial_average_scan" });
        callCount += rows.length;
        byValue.set(candidateValue, rows);
        allRows.push(...rows);
      }
      let band = findInitialBand(byValue);
      for (let epoch = 1; epoch <= args.epochs && band.high - band.low > args.convergeWidth; epoch += 1) {
        const candidateValue = Number(((band.low + band.high) / 2).toFixed(3));
        const vector = vectorForCandidate({ mode, value: candidateValue, args });
        const rows = await sampleCandidate({ args, runDir, model, mode, callCount }, { candidateValue, vector, epoch, candidateKind: "binary_average_midpoint" });
        callCount += rows.length;
        allRows.push(...rows);
        if (majority(rows) === "ENOUGH") band = { ...band, high: candidateValue };
        else band = { ...band, low: candidateValue };
      }
    }
  }

  const groups = summarizeRows(allRows, ALLOWED, ["model", "mode", "candidateValue", "averageScore", "passingCount"]);
  await writeFile(path.join(runDir, "summary.csv"), renderCsv(groups), "utf8");
  await writeFile(path.join(runDir, "summary.md"), renderMarkdown(groups, metadata), "utf8");
  await writeFile(path.join(runDir, "analysis.md"), renderAnalysis(), "utf8");
  if (args.gzipJsonl) await maybeWriteGzip(runDir);
  console.log(`Wrote ${path.relative(process.cwd(), runDir)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
