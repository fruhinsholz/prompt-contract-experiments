#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  appendJsonl,
  buildClaudeCliPayload,
  buildGeminiPayload,
  buildOpenAiPayload,
  callClaudeCli,
  callGemini,
  callOpenAI,
  extractClaudeCliOutputText,
  extractGeminiOutputText,
  classifyLabel,
  extractOutputText,
  formatMoney,
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

const ALLOWED = ["LOW", "NOT_LOW"];
const SYSTEM_PROMPT = `You are a classification component. Use only the facts in the case. Do not infer social, moral, or hardship considerations unless they are explicitly part of the case. Return only the requested label.`;

const CONTEXTS = {
  fact_only: "",
  retrieved_5_gift_card: "Retrieved context:\nA separate product launch note says that a $5 gift card is offered to the first subscriber of a new policy.",
  retrieved_100000_contract: "Retrieved context:\nA separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period.",
};

function extraOptions() {
  return `  --min <n>                   Lower dollar bound for binary search. Defaults to 0.
  --max <n>                   Upper dollar bound for binary search. Defaults to 20000.
  --scan <a,b,c>              Legacy fixed scan points. If supplied, scan first, then refine.
  --converge-width <n>        Stop binary search when the band is this narrow. Defaults to 25.
  --contexts <list|all>       Context variants. Defaults to all.
`;
}

function parseArgs(argv) {
  return parseCommonArgs(argv, { min: 0, max: 20000, scan: null, convergeWidth: 25, contexts: "all", label: "retrieved-context-low" }, (args, raw, i) => {
    switch (raw[i]) {
      case "--min": args.min = Number.parseFloat(raw[i + 1]); return i + 1;
      case "--max": args.max = Number.parseFloat(raw[i + 1]); return i + 1;
      case "--scan": args.scan = raw[i + 1]; return i + 1;
      case "--converge-width": args.convergeWidth = Number.parseFloat(raw[i + 1]); return i + 1;
      case "--contexts": args.contexts = raw[i + 1]; return i + 1;
      default: return false;
    }
  });
}

function contextIds(args) {
  if (args.contexts === "all") return Object.keys(CONTEXTS);
  const ids = args.contexts.split(",").map((id) => id.trim()).filter(Boolean);
  for (const id of ids) if (!Object.hasOwn(CONTEXTS, id)) throw new Error("Unknown context: " + id);
  return ids;
}

function scanPoints(args) {
  const points = args.scan
    ? args.scan.split(",").map((v) => Number.parseFloat(v.trim()))
    : [0, 10, 25, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500, 2500, 5000, 10000];
  return [...new Set(points.filter((n) => Number.isFinite(n) && n >= args.min && n <= args.max))].sort((a, b) => a - b);
}

function userPrompt(amount, contextId) {
  const context = CONTEXTS[contextId];
  return `${context ? `${context}\n\n` : ""}Case:\nA customer submitted a refund claim for $${formatMoney(amount)} for a consumer purchase.\n\nClassify the claim amount as exactly one label:\nLOW\nNOT_LOW\n\nReturn only the label.`;
}

function dryRunLabel(amount) {
  return amount <= 100 ? "LOW" : "NOT_LOW";
}

async function runOne({ args, runDir, model, contextId, amount, epoch, candidateKind, sampleIndex }) {
  const user = userPrompt(amount, contextId);
  const metadata = { testbed: "low", context_id: contextId, amount: String(amount), epoch: String(epoch) };
  const payload = args.provider === "claude-cli" ? buildClaudeCliPayload({
    model,
    system: SYSTEM_PROMPT,
    user,
    maxOutputTokens: args.maxOutputTokens,
    reasoningEffort: args.reasoningEffort,
    metadata,
  }) : args.provider === "gemini" ? buildGeminiPayload({
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
    testbed: "low",
    model,
    contextId,
    amount,
    epoch,
    candidateKind,
    sampleIndex,
    temperature: args.temperature,
    maxOutputTokens: args.maxOutputTokens,
    seed: Number.isInteger(args.seed) ? args.seed : null,
    fixtureHash: hashJson({ contextId, amount, user }),
    request: payload,
  };

  if (args.dryRun) {
    const outputText = dryRunLabel(amount);
    const parsed = classifyLabel(outputText, ALLOWED);
    const row = { ...base, dryRun: true, outputText, ...parsed, responseModel: model, usage: null, latencyMs: 0 };
    await appendJsonl(path.join(runDir, "calls.jsonl"), row);
    return row;
  }

  try {
    const { json, latencyMs } = args.provider === "claude-cli"
      ? await callClaudeCli({ payload })
      : args.provider === "gemini"
        ? await callGemini({ apiKey: process.env.GEMINI_API_KEY, payload })
        : await callOpenAI({ apiKey: process.env.OPENAI_API_KEY, payload });
    const outputText = args.provider === "claude-cli"
      ? extractClaudeCliOutputText(json)
      : args.provider === "gemini"
        ? extractGeminiOutputText(json)
        : extractOutputText(json);
    const outputTokens = json.usage?.output_tokens ?? 0;
    const reasoningTokens = json.usage?.output_tokens_details?.reasoning_tokens ?? json.usageMetadata?.thoughtsTokenCount ?? 0;
    const outputTruncated = json.status === "incomplete" && json.incomplete_details?.reason === "max_output_tokens"
      || json.candidates?.some((candidate) => candidate.finishReason === "MAX_TOKENS")
      || outputText.trim() === "" && outputTokens >= args.maxOutputTokens && reasoningTokens >= args.maxOutputTokens;
    const parsed = classifyLabel(outputText, ALLOWED);
    const claudeModel = Object.values(json.modelUsage ?? {})[0];
    const row = {
      ...base,
      outputText,
      ...parsed,
      responseId: json.id ?? null,
      responseModel: json.model ?? json.modelVersion ?? claudeModel?.canonicalModel ?? model,
      systemFingerprint: json.system_fingerprint ?? null,
      usage: json.usage ?? json.usageMetadata ?? null,
      costUsd: json.total_cost_usd ?? claudeModel?.costUSD ?? null,
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
  const low = count(rows, "LOW");
  const notLow = count(rows, "NOT_LOW");
  const invalid = count(rows, "INVALID");
  if (invalid > low && invalid > notLow) return "INVALID";
  return notLow > low ? "NOT_LOW" : "LOW";
}

function summarizeBand(rows, lowAmount, highAmount) {
  return {
    low: lowAmount,
    high: highAmount,
    width: Number((highAmount - lowAmount).toFixed(2)),
    samplesPerState: rows.length ? Math.max(...rows.map((row) => row.sampleIndex + 1)) : 0,
    lowLabel: majority(rows.filter((row) => row.amount === lowAmount)),
    highLabel: majority(rows.filter((row) => row.amount === highAmount)),
  };
}

function findInitialBand(byAmount) {
  const points = [...byAmount.keys()].sort((a, b) => a - b);
  for (let i = 1; i < points.length; i += 1) {
    const previous = byAmount.get(points[i - 1]);
    const current = byAmount.get(points[i]);
    if (majority(previous) === "LOW" && majority(current) === "NOT_LOW") return { low: points[i - 1], high: points[i] };
  }
  const firstNotLow = points.find((point) => majority(byAmount.get(point)) === "NOT_LOW");
  if (firstNotLow !== undefined) return { low: points[0], high: firstNotLow };
  return { low: points.at(-2) ?? points[0], high: points.at(-1) ?? points[0] };
}

async function runLegacyScanSearch(ctx) {
  const rows = [];
  const byAmount = new Map();
  for (const amount of ctx.fixture.scanPoints) {
    const sampled = await sampleCandidate(ctx, { amount, epoch: 0, candidateKind: "initial_scan" });
    byAmount.set(amount, sampled);
    rows.push(...sampled);
  }

  let band = findInitialBand(byAmount);
  for (let epoch = 1; epoch <= ctx.args.epochs && band.high - band.low > ctx.args.convergeWidth; epoch += 1) {
    const amount = Number(((band.low + band.high) / 2).toFixed(2));
    const sampled = await sampleCandidate(ctx, { amount, epoch, candidateKind: "binary_midpoint" });
    rows.push(...sampled);
    if (majority(sampled) === "NOT_LOW") band = { ...band, high: amount };
    else band = { ...band, low: amount };
  }
  return { rows, band: summarizeBand(rows, band.low, band.high) };
}

async function runAdaptiveBandSearch(ctx) {
  const rows = [];
  const sampledByAmount = new Map();
  const sample = async (amount, epoch, candidateKind) => {
    const key = Number(amount.toFixed(2));
    if (sampledByAmount.has(key)) return sampledByAmount.get(key);
    const sampled = await sampleCandidate(ctx, { amount: key, epoch, candidateKind });
    sampledByAmount.set(key, sampled);
    rows.push(...sampled);
    return sampled;
  };

  const minRows = await sample(ctx.args.min, 0, "boundary_low");
  const maxRows = await sample(ctx.args.max, 0, "boundary_high");
  const minLabel = majority(minRows);
  const maxLabel = majority(maxRows);
  if (minLabel === maxLabel) {
    return { rows, band: { low: ctx.args.min, high: ctx.args.max, width: ctx.args.max - ctx.args.min, samplesPerState: ctx.args.samples, lowLabel: minLabel, highLabel: maxLabel, unbracketed: true } };
  }

  let band = minLabel === "LOW"
    ? { low: ctx.args.min, high: ctx.args.max }
    : { low: ctx.args.max, high: ctx.args.min };

  for (let epoch = 1; epoch <= ctx.args.epochs && Math.abs(band.high - band.low) > ctx.args.convergeWidth; epoch += 1) {
    const amount = Number(((band.low + band.high) / 2).toFixed(2));
    const sampled = await sample(amount, epoch, "binary_midpoint");
    if (majority(sampled) === "NOT_LOW") band = { ...band, high: amount };
    else band = { ...band, low: amount };
  }
  const low = Math.min(band.low, band.high);
  const high = Math.max(band.low, band.high);
  return { rows, band: summarizeBand(rows, low, high) };
}

function renderCsv(groups) {
  const lines = ["model,response_models,context_id,amount,total,low,not_low,invalid,output_truncated,low_pct,not_low_pct,errors"];
  for (const g of groups.sort((a, b) => `${a.model}:${a.contextId}:${Number(a.amount)}`.localeCompare(`${b.model}:${b.contextId}:${Number(b.amount)}`, undefined, { numeric: true }))) {
    lines.push([g.model, g.modelVersions.join(" "), g.contextId, g.amount, g.total, g.counts.LOW, g.counts.NOT_LOW, g.counts.INVALID, g.outputTruncations, pct(g.counts.LOW, g.total), pct(g.counts.NOT_LOW, g.total), g.errors].join(","));
  }
  return `${lines.join("\n")}\n`;
}

function renderMarkdown(groups, metadata) {
  const lines = ["# Low Threshold Summary", "", `Created: ${metadata.createdAt}`, `Commit: ${metadata.commitHash}`, "", "| Model | Response model/version | Context | Amount | Total | LOW | NOT_LOW | Invalid | Truncated |", "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |"];
  for (const g of groups.sort((a, b) => `${a.model}:${a.contextId}:${Number(a.amount)}`.localeCompare(`${b.model}:${b.contextId}:${Number(b.amount)}`, undefined, { numeric: true }))) {
    lines.push(`| \`${g.model}\` | \`${g.modelVersions.join(", ") || g.model}\` | \`${g.contextId}\` | ${g.amount} | ${g.total} | ${g.counts.LOW} (${pct(g.counts.LOW, g.total)}) | ${g.counts.NOT_LOW} (${pct(g.counts.NOT_LOW, g.total)}) | ${g.counts.INVALID} | ${g.outputTruncations} |`);
  }
  return `${lines.join("\n")}\n`;
}

function renderBandsMarkdown(bands, metadata) {
  const lines = ["# Low Threshold Bands", "", `Created: ${metadata.createdAt}`, `Commit: ${metadata.commitHash}`, "", "| Model | Context | Lower observed bound | Upper observed bound | Width | Lower label | Upper label | Notes |", "| --- | --- | ---: | ---: | ---: | --- | --- | --- |"];
  for (const item of bands.sort((a, b) => `${a.model}:${a.contextId}`.localeCompare(`${b.model}:${b.contextId}`, undefined, { numeric: true }))) {
    const note = item.lowLabel === "INVALID" || item.highLabel === "INVALID"
      ? "Samples failed or did not return allowed labels."
      : item.unbracketed ? "No LOW/NOT_LOW bracket inside the tested range." : "Estimated band, not an exact threshold.";
    lines.push(`| \`${item.model}\` | \`${item.contextId}\` | ${item.low} | ${item.high} | ${item.width} | ${item.lowLabel} | ${item.highLabel} | ${note} |`);
  }
  return `${lines.join("\n")}\n`;
}

function renderAnalysis() {
  return `# Low Analysis

Both labels can be defensible because the prompt asks the model to resolve \`low\` without a dollar threshold. A consumer refund amount can be small relative to enterprise spend and still large relative to a household budget. The retrieved-context variants are perturbation probes, not claimant facts and not business-policy changes. They test whether nearby accidental context from memory, RAG, prior turns, or assembled context can move the implicit dollar boundary while the refund case itself stays unchanged.

Deterministic replacement policy: define the boundary outside the model, for example \`LOW iff amount_usd <= 100\`, version that threshold, log the version used for each decision, and let the model classify only facts that do not determine the approval boundary.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage({ command: "src/.../prompt-thresholds/src/low-retrieved-context.mjs", description: "Tests whether accidental retrieved context moves the implicit flip point for LOW in a refund amount classifier.", extraOptions: extraOptions() }));
    return;
  }
  validateCommonArgs(args);
  if (args.max <= args.min) throw new Error("--max must be greater than --min.");

  const fixture = { contexts: Object.fromEntries(contextIds(args).map((id) => [id, CONTEXTS[id]])), scanPoints: args.scan ? scanPoints(args) : null, min: args.min, max: args.max, searchMethod: args.scan ? "fixed_scan_then_binary_refinement" : "bounded_binary_band_search" };
  const { runDir, metadata } = await prepareRunDir({
    testbed: "low",
    label: args.label,
    args,
    prompts: ["system-prompt.txt", "user-template.txt"],
    fixture,
    search: { range: { min: args.min, max: args.max, initialScan: fixture.scanPoints }, convergenceRule: `${fixture.searchMethod} stops after ${args.epochs} epochs or when high-low <= ${args.convergeWidth}` },
    extraResultFiles: { thresholdBandsJson: "threshold-bands.json", thresholdBandsMarkdown: "threshold-bands.md" },
  });
  await writePromptFiles(runDir, { "system-prompt.txt": SYSTEM_PROMPT, "user-template.txt": userPrompt("X", "fact_only") });

  const allRows = [];
  const bandSummaries = [];
  let callCount = 0;
  for (const model of modelsFromArgs(args)) {
    for (const contextId of contextIds(args)) {
      const searchCtx = { args, runDir, model, contextId, callCount, fixture };
      const result = args.scan ? await runLegacyScanSearch(searchCtx) : await runAdaptiveBandSearch(searchCtx);
      callCount = searchCtx.callCount;
      allRows.push(...result.rows);
      bandSummaries.push({ model, contextId, searchMethod: fixture.searchMethod, ...result.band });
    }
  }

  const groups = summarizeRows(allRows, ALLOWED, ["model", "contextId", "amount"]);
  await writeFile(path.join(runDir, "summary.csv"), renderCsv(groups), "utf8");
  await writeFile(path.join(runDir, "summary.md"), renderMarkdown(groups, metadata), "utf8");
  await writeFile(path.join(runDir, "threshold-bands.json"), `${JSON.stringify(bandSummaries, null, 2)}\n`, "utf8");
  await writeFile(path.join(runDir, "threshold-bands.md"), renderBandsMarkdown(bandSummaries, metadata), "utf8");
  await writeFile(path.join(runDir, "analysis.md"), renderAnalysis(), "utf8");
  if (args.gzipJsonl) await maybeWriteGzip(runDir);
  console.log(`Wrote ${path.relative(process.cwd(), runDir)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
