#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const RESULTS_DIR = path.join(ROOT, "results");
const FIGURES_DIR = path.join(ROOT, "figures");
const TRACKED_RETRIEVED_RUNS = new Set([
  "2026-07-26T07-10-43-244Z-retrieved-context-gpt-4.1-mini-low",
  "2026-07-26T07-19-39-250Z-retrieved-context-gpt-4.1-nano-low",
  "2026-07-26T07-26-45-034Z-retrieved-context-gpt-4.1-low",
]);

const CONTEXT_LABELS = new Map([
  ["fact_only", "fact only"],
  ["retrieved_5_gift_card", "$5 gift card"],
  ["retrieved_100000_contract", "$100k contract"],
]);

const CONTEXT_ORDER = ["fact_only", "retrieved_5_gift_card", "retrieved_100000_contract"];
const MODEL_ORDER = ["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano"];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function money(value) {
  return "$" + Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function colorForLowPct(pct) {
  if (!Number.isFinite(pct)) return "#f1f5f9";
  if (pct >= 0.95) return "#0f766e";
  if (pct >= 0.65) return "#14b8a6";
  if (pct >= 0.35) return "#facc15";
  if (pct > 0.05) return "#fb923c";
  return "#be123c";
}

async function readJsonl(file) {
  const text = await readFile(file, "utf8");
  return text.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
}

function summarizeCalls(rows) {
  const grouped = new Map();
  for (const row of rows) {
    if (row.testbed !== "low") continue;
    const key = [row.model, row.contextId, row.amount].join("\t");
    if (!grouped.has(key)) {
      grouped.set(key, { model: row.model, contextId: row.contextId, amount: row.amount, low: 0, notLow: 0, invalid: 0, total: 0 });
    }
    const item = grouped.get(key);
    item.total += 1;
    if (row.label === "LOW") item.low += 1;
    else if (row.label === "NOT_LOW") item.notLow += 1;
    else item.invalid += 1;
  }
  return [...grouped.values()];
}

function rowSort(a, b) {
  const modelDelta = MODEL_ORDER.indexOf(a.model) - MODEL_ORDER.indexOf(b.model);
  if (modelDelta !== 0) return modelDelta;
  return CONTEXT_ORDER.indexOf(a.contextId) - CONTEXT_ORDER.indexOf(b.contextId);
}

function buildHeatmap(summary) {
  const amounts = [...new Set(summary.map((row) => row.amount))].sort((a, b) => a - b);
  const rowKeys = [...new Set(summary.map((row) => `${row.model}\t${row.contextId}`))]
    .map((key) => {
      const [model, contextId] = key.split("\t");
      return { model, contextId };
    })
    .sort(rowSort);

  const byKey = new Map(summary.map((row) => [`${row.model}\t${row.contextId}\t${row.amount}`, row]));
  const left = 190;
  const top = 58;
  const cell = 24;
  const rowGap = 8;
  const width = left + amounts.length * cell + 28;
  const height = top + rowKeys.length * (cell + rowGap) + 78;

  const cells = [];
  for (const [yIndex, row] of rowKeys.entries()) {
    const y = top + yIndex * (cell + rowGap);
    cells.push(`<text x="14" y="${y + 16}" font-size="12" fill="#334155">${escapeXml(row.model)} / ${escapeXml(CONTEXT_LABELS.get(row.contextId) ?? row.contextId)}</text>`);
    for (const [xIndex, amount] of amounts.entries()) {
      const item = byKey.get(`${row.model}\t${row.contextId}\t${amount}`);
      const lowPct = item ? item.low / item.total : NaN;
      const title = item
        ? `${row.model}, ${CONTEXT_LABELS.get(row.contextId) ?? row.contextId}, ${money(amount)}: LOW ${item.low}/${item.total}, NOT_LOW ${item.notLow}/${item.total}, INVALID ${item.invalid}/${item.total}`
        : `${row.model}, ${CONTEXT_LABELS.get(row.contextId) ?? row.contextId}, ${money(amount)}: not sampled`;
      cells.push(`<rect x="${left + xIndex * cell}" y="${y}" width="21" height="21" rx="3" fill="${colorForLowPct(lowPct)}"><title>${escapeXml(title)}</title></rect>`);
    }
  }

  const amountLabels = amounts.map((amount, index) => {
    const x = left + index * cell + 11;
    return `<text transform="translate(${x} 48) rotate(-55)" text-anchor="end" font-size="10" fill="#475569">${escapeXml(money(amount))}</text>`;
  }).join("\n");

  const legend = [
    ["mostly LOW", "#0f766e"],
    ["mixed", "#facc15"],
    ["mostly NOT_LOW", "#be123c"],
    ["not sampled", "#f1f5f9"],
  ].map(([label, fill], index) => {
    const x = left + index * 112;
    const y = height - 34;
    return `<rect x="${x}" y="${y}" width="18" height="18" rx="3" fill="${fill}"/><text x="${x + 26}" y="${y + 13}" font-size="12" fill="#475569">${label}</text>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">LOW / NOT_LOW classification by model and retrieved context</title>
<desc id="desc">Heatmap showing the share of LOW labels at each sampled refund amount for each tracked model and retrieved context.</desc>
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="14" y="24" font-size="18" font-weight="700" fill="#0f172a">LOW label share by amount, model, and retrieved context</text>
<text x="14" y="44" font-size="12" fill="#475569">Each cell aggregates 10 direct API calls at temperature 0 from tracked 2026-07-26 runs.</text>
${amountLabels}
${cells.join("\n")}
${legend}
</svg>\n`;
}

function thresholdRows(summary) {
  const rows = [];
  for (const model of MODEL_ORDER) {
    for (const contextId of CONTEXT_ORDER) {
      const samples = summary
        .filter((row) => row.model === model && row.contextId === contextId)
        .sort((a, b) => a.amount - b.amount);
      if (samples.length === 0) continue;
      const firstNotLow = samples.find((row) => row.notLow > row.low);
      rows.push({
        model,
        contextId,
        threshold: firstNotLow?.amount ?? 10000,
        unbounded: !firstNotLow,
      });
    }
  }
  return rows;
}

function buildThresholdChart(summary) {
  const rows = thresholdRows(summary);
  const left = 176;
  const top = 58;
  const barH = 18;
  const gap = 10;
  const plotW = 420;
  const width = left + plotW + 170;
  const height = top + rows.length * (barH + gap) + 62;
  const max = 10000;
  const bars = rows.map((row, index) => {
    const y = top + index * (barH + gap);
    const barW = Math.max(2, (Math.min(row.threshold, max) / max) * plotW);
    const fill = row.contextId === "fact_only" ? "#2563eb" : row.contextId === "retrieved_5_gift_card" ? "#be123c" : "#0f766e";
    const label = `${row.model} / ${CONTEXT_LABELS.get(row.contextId)}`;
    const value = row.unbounded ? `> ${money(max)}` : money(row.threshold);
    return `<text x="14" y="${y + 14}" font-size="12" fill="#334155">${escapeXml(label)}</text>
<rect x="${left}" y="${y}" width="${barW.toFixed(1)}" height="${barH}" rx="3" fill="${fill}"><title>${escapeXml(label)}: first majority NOT_LOW at ${value}</title></rect>
<text x="${left + barW + 8}" y="${y + 14}" font-size="12" fill="#334155">${escapeXml(value)}</text>`;
  }).join("\n");

  const ticks = [0, 2500, 5000, 7500, 10000].map((tick) => {
    const x = left + (tick / max) * plotW;
    return `<line x1="${x}" y1="${top - 8}" x2="${x}" y2="${height - 42}" stroke="#e2e8f0"/>
<text x="${x}" y="${height - 20}" font-size="10" text-anchor="middle" fill="#64748b">${escapeXml(money(tick))}</text>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Estimated NOT_LOW boundary by model and context</title>
<desc id="desc">Bar chart showing the first sampled refund amount where NOT_LOW became the majority label.</desc>
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="14" y="24" font-size="18" font-weight="700" fill="#0f172a">First majority NOT_LOW amount</text>
<text x="14" y="44" font-size="12" fill="#475569">Bars summarize tracked retrieved-context runs. Values above $10,000 stayed LOW through the tested range.</text>
${ticks}
${bars}
</svg>\n`;
}

async function main() {
  const runDirs = (await readdir(RESULTS_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && TRACKED_RETRIEVED_RUNS.has(entry.name))
    .map((entry) => path.join(RESULTS_DIR, entry.name));

  const allRows = [];
  for (const runDir of runDirs) {
    allRows.push(...await readJsonl(path.join(runDir, "calls.jsonl")));
  }

  const summary = summarizeCalls(allRows);
  await mkdir(FIGURES_DIR, { recursive: true });
  await writeFile(path.join(FIGURES_DIR, "low-label-heatmap.svg"), buildHeatmap(summary));
  await writeFile(path.join(FIGURES_DIR, "low-threshold-estimates.svg"), buildThresholdChart(summary));
  console.log(`Wrote ${summary.length} summarized rows from ${runDirs.length} tracked runs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
