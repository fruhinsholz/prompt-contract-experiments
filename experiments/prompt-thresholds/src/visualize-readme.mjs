#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const RESULTS_DIR = path.join(ROOT, "results");
const FIGURES_DIR = path.join(ROOT, "figures");
const INDEX_FILE = path.join(ROOT, "supporting-graphs.md");

const CONTEXT_LABELS = new Map([
  ["fact_only", "fact only"],
  ["gift_card_anchor", "$5 gift card anchor"],
  ["enterprise_contract_anchor", "$100k contract anchor"],
  ["retrieved_5_gift_card", "$5 gift card context"],
  ["retrieved_100000_contract", "$100k contract context"],
]);

const CONTEXT_ORDER = [
  "fact_only",
  "gift_card_anchor",
  "retrieved_5_gift_card",
  "enterprise_contract_anchor",
  "retrieved_100000_contract",
];

const MODEL_ORDER = [
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "claude-sonnet-4-20250514",
  "sonnet",
  "gemini-2.5-flash",
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "run";
}

function money(value) {
  return "$" + Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function shortMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  if (number >= 1000) return `$${Number((number / 1000).toFixed(1))}k`;
  return money(number);
}

function modelRank(model) {
  const index = MODEL_ORDER.indexOf(model);
  return index === -1 ? MODEL_ORDER.length : index;
}

function contextRank(contextId) {
  const index = CONTEXT_ORDER.indexOf(contextId);
  return index === -1 ? CONTEXT_ORDER.length : index;
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function findBandFiles() {
  if (!existsSync(RESULTS_DIR)) return [];
  const entries = await readdir(RESULTS_DIR, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const runDir = path.join(RESULTS_DIR, entry.name);
    const file = path.join(runDir, "threshold-bands.json");
    if (!existsSync(file)) continue;
    files.push({ runName: entry.name, file });
  }
  return files.sort((a, b) => a.runName.localeCompare(b.runName));
}

function estimatedValue(band) {
  if (band.lowLabel === "INVALID" || band.highLabel === "INVALID") return null;
  if (band.unbracketed) return null;
  if (!Number.isFinite(band.low) || !Number.isFinite(band.high)) return null;
  return Number(((band.low + band.high) / 2).toFixed(2));
}

async function collectBands() {
  const bands = [];
  for (const { runName, file } of await findBandFiles()) {
    for (const band of await readJson(file)) {
      const value = estimatedValue(band);
      bands.push({
        runName,
        model: band.model,
        contextId: band.contextId,
        low: band.low,
        high: band.high,
        width: band.width,
        lowLabel: band.lowLabel,
        highLabel: band.highLabel,
        unbracketed: Boolean(band.unbracketed),
        value,
      });
    }
  }
  return bands;
}

function latestByCaseAndModel(bands) {
  const byKey = new Map();
  for (const band of bands) {
    const key = `${band.contextId}\t${band.model}`;
    const previous = byKey.get(key);
    if (!previous || band.runName.localeCompare(previous.runName) > 0) byKey.set(key, band);
  }
  return [...byKey.values()];
}

function colorForRowValue(value, min, max) {
  if (!Number.isFinite(value)) return "#e5e7eb";
  if (max <= min) return "#facc15";
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  if (t < 0.5) return interpolateHex("#0f766e", "#facc15", t / 0.5);
  return interpolateHex("#facc15", "#be123c", (t - 0.5) / 0.5);
}

function interpolateHex(a, b, t) {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const channel = (from, to) => Math.round(from + (to - from) * t).toString(16).padStart(2, "0");
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
}

function textColor(fill) {
  const r = parseInt(fill.slice(1, 3), 16);
  const g = parseInt(fill.slice(3, 5), 16);
  const b = parseInt(fill.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.48 ? "#ffffff" : "#111827";
}

function buildThresholdHeatmap(bands) {
  const latest = latestByCaseAndModel(bands);
  const cases = [...new Set(latest.map((band) => band.contextId))]
    .sort((a, b) => contextRank(a) - contextRank(b) || a.localeCompare(b));
  const models = [...new Set(latest.map((band) => band.model))]
    .sort((a, b) => modelRank(a) - modelRank(b) || a.localeCompare(b));
  const byKey = new Map(latest.map((band) => [`${band.contextId}\t${band.model}`, band]));

  const left = 210;
  const top = 92;
  const cellW = 132;
  const cellH = 34;
  const rowGap = 12;
  const width = Math.max(left + models.length * cellW + 28, 820);
  const height = top + cases.length * (cellH + rowGap) + 92;

  const modelLabels = models.map((model, index) => {
    const x = left + index * cellW + cellW / 2;
    return `<text transform="translate(${x} 78) rotate(-36)" text-anchor="end" font-size="12" fill="#334155">${escapeXml(model)}</text>`;
  }).join("\n");

  const rows = [];
  for (const [rowIndex, contextId] of cases.entries()) {
    const y = top + rowIndex * (cellH + rowGap);
    const rowBands = models.map((model) => byKey.get(`${contextId}\t${model}`)).filter(Boolean);
    const rowValues = rowBands.map((band) => band.value).filter(Number.isFinite);
    const min = Math.min(...rowValues);
    const max = Math.max(...rowValues);
    rows.push(`<text x="16" y="${y + 22}" font-size="13" fill="#334155">${escapeXml(CONTEXT_LABELS.get(contextId) ?? contextId)}</text>`);
    rows.push(`<line x1="${left}" y1="${y - 6}" x2="${width - 28}" y2="${y - 6}" stroke="#e5e7eb"/>`);
    for (const [colIndex, model] of models.entries()) {
      const x = left + colIndex * cellW;
      const band = byKey.get(`${contextId}\t${model}`);
      const fill = band ? colorForRowValue(band.value, min, max) : "#e5e7eb";
      const failed = band?.lowLabel === "INVALID" || band?.highLabel === "INVALID";
      const label = failed ? "failed" : band?.unbracketed ? "unbracketed" : band ? shortMoney(band.value) : "";
      const range = band ? `${money(band.low)} to ${money(band.high)}` : "not sampled";
      const title = band
        ? `${model}, ${CONTEXT_LABELS.get(contextId) ?? contextId}: estimated ${label}; band ${range}; width ${money(band.width)}; run ${band.runName}`
        : `${model}, ${CONTEXT_LABELS.get(contextId) ?? contextId}: not sampled`;
      rows.push(`<rect x="${x}" y="${y}" width="${cellW - 10}" height="${cellH}" rx="0" fill="${fill}"><title>${escapeXml(title)}</title></rect>`);
      rows.push(`<text x="${x + (cellW - 10) / 2}" y="${y + 22}" text-anchor="middle" font-size="12" fill="${textColor(fill)}">${escapeXml(label)}</text>`);
    }
  }

  const legendY = height - 42;
  const legend = [
    ["row low estimate", "#0f766e"],
    ["row middle", "#facc15"],
    ["row high estimate", "#be123c"],
    ["missing or failed", "#e5e7eb"],
  ].map(([label, fill], index) => {
    const x = left + index * 144;
    return `<rect x="${x}" y="${legendY}" width="18" height="18" rx="0" fill="${fill}"/><text x="${x + 26}" y="${legendY + 13}" font-size="12" fill="#475569">${escapeXml(label)}</text>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">Row-normalized LOW threshold estimate heatmap</title>
<desc id="desc">Rows are cases or retrieved-context anchors. Columns are model agents. Each cell shows the absolute estimated LOW boundary, while color is normalized only within that row.</desc>
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="16" y="28" font-size="18" font-weight="700" fill="#0f172a">LOW threshold estimates by case and model</text>
<text x="16" y="50" font-size="12" fill="#475569">Color normalized per row; values shown in cells remain absolute estimated band midpoints.</text>
${modelLabels}
${rows.join("\n")}
${legend}
</svg>\n`;
}

function renderIndex(bands) {
  const latest = latestByCaseAndModel(bands);
  const lines = [
    "# Prompt Threshold Supporting Graphs",
    "",
    "These graphs are supporting artifacts for inspecting the experiments. They are not intended as article figures.",
    "",
    "## Heatmap",
    "",
    "- [Row-normalized LOW threshold estimates](figures/low-threshold-heatmap.svg)",
    "",
    "Rows are cases or retrieved-context anchors. Columns are model agents. Color is normalized per row so horizontal comparison is meaningful inside a case; the numbers in cells are absolute estimated band midpoints.",
    "",
    "## Latest Bands",
    "",
    "| Case | Model | Estimated midpoint | Band | Width | Run |",
    "| --- | --- | ---: | --- | ---: | --- |",
  ];
  for (const band of latest.sort((a, b) => contextRank(a.contextId) - contextRank(b.contextId) || modelRank(a.model) - modelRank(b.model) || a.runName.localeCompare(b.runName))) {
    const caseLabel = CONTEXT_LABELS.get(band.contextId) ?? band.contextId;
    const failed = band.lowLabel === "INVALID" || band.highLabel === "INVALID";
    const estimate = failed ? "failed" : band.unbracketed ? "unbracketed" : money(band.value);
    lines.push(`| ${caseLabel} | \`${band.model}\` | ${estimate} | ${money(band.low)} to ${money(band.high)} | ${money(band.width)} | \`${band.runName}\` |`);
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const bands = await collectBands();
  await mkdir(FIGURES_DIR, { recursive: true });
  await writeFile(path.join(FIGURES_DIR, "low-threshold-heatmap.svg"), buildThresholdHeatmap(bands), "utf8");
  await writeFile(INDEX_FILE, renderIndex(bands), "utf8");
  console.log(`Wrote threshold heatmap from ${bands.length} threshold bands.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
