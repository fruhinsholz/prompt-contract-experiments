#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const RESULTS_ROOT = path.join(ROOT, "experiments/prompt-thresholds/results");
const OUT_DIR = path.join(ROOT, "images/results/price-vs-iteration");
const INDEX_FILE = path.join(ROOT, "docs/price-vs-iteration.md");

const LABEL_COLORS = {
  LOW: "#0f766e",
  NOT_LOW: "#be123c",
  INVALID: "#64748b",
};

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

async function readJsonl(file) {
  const raw = await readFile(file, "utf8");
  return raw.split(/\r?\n/).filter((line) => line.trim()).map((line) => JSON.parse(line));
}

async function findRunDirs() {
  if (!existsSync(RESULTS_ROOT)) return [];
  const entries = await readdir(RESULTS_ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(RESULTS_ROOT, entry.name))
    .sort();
}

function groupRows(rows, runName) {
  const groups = new Map();
  for (const row of rows) {
    if (row.type !== "completion" || row.testbed !== "low" || !Number.isFinite(row.amount)) continue;
    const contextId = row.contextId ?? "unknown_context";
    const key = `${runName}\t${contextId}`;
    if (!groups.has(key)) groups.set(key, { runName, contextId, rows: [] });
    groups.get(key).rows.push(row);
  }
  return [...groups.values()];
}

function modelOffsets(models) {
  const step = models.length <= 1 ? 0 : 0.16;
  const center = (models.length - 1) / 2;
  return new Map(models.map((model, index) => [model, (index - center) * step]));
}

function buildSvg(group) {
  const models = [...new Set(group.rows.map((row) => row.model))].sort();
  const offsets = modelOffsets(models);
  const rows = group.rows
    .slice()
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)) || a.model.localeCompare(b.model) || a.sampleIndex - b.sampleIndex);

  const indexed = rows.map((row, index) => ({ ...row, iteration: index + 1 + (offsets.get(row.model) ?? 0) }));
  const maxIteration = Math.max(1, rows.length);
  const amounts = indexed.map((row) => row.amount);
  const minAmount = Math.min(...amounts, 0);
  const maxAmount = Math.max(...amounts, 1);
  const padAmount = Math.max(1, (maxAmount - minAmount) * 0.08);

  const width = 980;
  const height = 560;
  const left = 86;
  const right = 26;
  const top = 70;
  const bottom = 84;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  const x = (value) => left + ((value - 1) / Math.max(1, maxIteration - 1)) * plotW;
  const y = (value) => top + (1 - ((value - minAmount + padAmount) / (maxAmount - minAmount + padAmount * 2))) * plotH;

  const yTicks = niceTicks(minAmount, maxAmount, 5);
  const xTicks = niceTicks(1, maxIteration, 6).map((value) => Math.round(value));
  const seenXTicks = [...new Set(xTicks.filter((value) => value >= 1 && value <= maxIteration))];

  const grid = [
    ...yTicks.map((tick) => `<line x1="${left}" y1="${y(tick)}" x2="${width - right}" y2="${y(tick)}" stroke="#e2e8f0"/><text x="${left - 10}" y="${y(tick) + 4}" text-anchor="end" font-size="11" fill="#475569">${escapeXml(money(tick))}</text>`),
    ...seenXTicks.map((tick) => `<line x1="${x(tick)}" y1="${top}" x2="${x(tick)}" y2="${height - bottom}" stroke="#f1f5f9"/><text x="${x(tick)}" y="${height - bottom + 22}" text-anchor="middle" font-size="11" fill="#64748b">${tick}</text>`),
  ].join("\n");

  const modelIndex = new Map(models.map((model, index) => [model, index]));
  const points = indexed.map((row) => {
    const radius = 4 + (modelIndex.get(row.model) % 3);
    const fill = LABEL_COLORS[row.label] ?? LABEL_COLORS.INVALID;
    const stroke = modelStroke(modelIndex.get(row.model));
    const title = `${row.model} / ${group.contextId} / iteration ${Math.round(row.iteration)} / ${money(row.amount)} / ${row.label}`;
    return `<circle cx="${x(row.iteration).toFixed(1)}" cy="${y(row.amount).toFixed(1)}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" opacity="0.82"><title>${escapeXml(title)}</title></circle>`;
  }).join("\n");

  const modelLegend = models.map((model, index) => {
    const lx = left + index * 178;
    const ly = height - 28;
    return `<circle cx="${lx}" cy="${ly - 4}" r="${4 + (index % 3)}" fill="#ffffff" stroke="${modelStroke(index)}" stroke-width="2"/><text x="${lx + 12}" y="${ly}" font-size="12" fill="#334155">${escapeXml(model)}</text>`;
  }).join("\n");

  const labelLegend = Object.entries(LABEL_COLORS).map(([label, color], index) => {
    const lx = width - right - 236 + index * 82;
    const ly = 42;
    return `<circle cx="${lx}" cy="${ly}" r="5" fill="${color}"/><text x="${lx + 10}" y="${ly + 4}" font-size="12" fill="#334155">${escapeXml(label)}</text>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">${escapeXml(group.runName)} price versus iteration</title>
<desc id="desc">Scatter plot of refund amount against chronological iteration for ${escapeXml(group.contextId)}.</desc>
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="${left}" y="28" font-size="19" font-weight="700" fill="#0f172a">${escapeXml(group.runName)}</text>
<text x="${left}" y="50" font-size="12" fill="#475569">Context: ${escapeXml(group.contextId)}. Y-axis is refund amount. X-axis is chronological iteration.</text>
${labelLegend}
<rect x="${left}" y="${top}" width="${plotW}" height="${plotH}" fill="#ffffff" stroke="#cbd5e1"/>
${grid}
${points}
<text x="${left + plotW / 2}" y="${height - 42}" text-anchor="middle" font-size="12" fill="#334155">Iteration</text>
<text transform="translate(24 ${top + plotH / 2}) rotate(-90)" text-anchor="middle" font-size="12" fill="#334155">Refund amount</text>
${modelLegend}
</svg>
`;
}

function modelStroke(index) {
  const colors = ["#1d4ed8", "#7c3aed", "#ea580c", "#0f766e", "#be123c", "#334155"];
  return colors[index % colors.length];
}

function niceTicks(min, max, count) {
  if (min === max) return [min];
  const span = niceNumber(max - min, false);
  const step = niceNumber(span / Math.max(1, count - 1), true);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Number(value.toFixed(6)));
  }
  return ticks;
}

function niceNumber(value, round) {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;
  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;
  return niceFraction * Math.pow(10, exponent);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(INDEX_FILE), { recursive: true });

  const groups = [];
  for (const runDir of await findRunDirs()) {
    const callsFile = path.join(runDir, "calls.jsonl");
    if (!existsSync(callsFile)) continue;
    groups.push(...groupRows(await readJsonl(callsFile), path.basename(runDir)));
  }

  const written = [];
  for (const group of groups.filter((item) => item.rows.length > 0)) {
    const fileName = `${slug(group.runName)}__${slug(group.contextId)}.svg`;
    await writeFile(path.join(OUT_DIR, fileName), buildSvg(group), "utf8");
    written.push({ ...group, fileName, models: [...new Set(group.rows.map((row) => row.model))].sort() });
  }

  const lines = ["# Price Versus Iteration", ""];
  lines.push("Each SVG is generated from raw LOW test-bed JSONL. Runs are grouped by run directory and context, with comparable models kept together.");
  lines.push("");
  for (const item of written.sort((a, b) => a.fileName.localeCompare(b.fileName))) {
    lines.push(`- [${item.runName} / ${item.contextId}](../images/results/price-vs-iteration/${item.fileName}) - models: ${item.models.map((model) => `\`${model}\``).join(", ")}`);
  }
  await writeFile(INDEX_FILE, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${written.length} price-versus-iteration SVGs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
