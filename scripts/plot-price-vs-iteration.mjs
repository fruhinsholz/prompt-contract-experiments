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
  INVALID: "#e5e7eb",
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
    .filter((runDir) => existsSync(path.join(runDir, "threshold-bands.json")))
    .sort();
}

function groupRows(rows, runName) {
  const groups = new Map();
  for (const row of rows) {
    if (row.type !== "completion" || row.testbed !== "low" || !Number.isFinite(row.amount)) continue;
    const contextId = row.contextId ?? "unknown_context";
    const key = `${runName}\t${row.model}\t${contextId}`;
    if (!groups.has(key)) groups.set(key, { runName, model: row.model, contextId, rows: [] });
    groups.get(key).rows.push(row);
  }
  return [...groups.values()];
}

function buildSvg(group) {
  const rows = group.rows
    .slice()
    .sort((a, b) => a.epoch - b.epoch || a.amount - b.amount || a.sampleIndex - b.sampleIndex || String(a.createdAt).localeCompare(String(b.createdAt)));

  const epochs = [...new Set(rows.map((row) => row.epoch))].sort((a, b) => a - b);
  const epochIndex = new Map(epochs.map((epoch, index) => [epoch, index]));
  const maxEpochIndex = Math.max(1, epochs.length - 1);
  const amounts = rows.map((row) => Math.max(1, row.amount));
  const minAmount = Math.max(1, Math.min(...amounts));
  const maxAmount = Math.max(...amounts, minAmount + 1);
  const logMin = Math.log10(minAmount);
  const logMax = Math.log10(maxAmount);
  const pad = Math.max(0.08, (logMax - logMin) * 0.08);

  const width = 920;
  const height = 520;
  const left = 92;
  const right = 34;
  const top = 72;
  const bottom = 76;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const x = (epoch) => left + (epochIndex.get(epoch) / maxEpochIndex) * plotW;
  const y = (amount) => top + (1 - ((Math.log10(Math.max(1, amount)) - logMin + pad) / (logMax - logMin + pad * 2))) * plotH;

  const yTicks = logTicks(minAmount, maxAmount);
  const xTicks = epochs;

  const grid = [
    ...yTicks.map((tick) => `<line x1="${left}" y1="${y(tick).toFixed(1)}" x2="${width - right}" y2="${y(tick).toFixed(1)}" stroke="#e5e7eb"/><text x="${left - 10}" y="${y(tick) + 4}" text-anchor="end" font-size="11" fill="#475569">${escapeXml(money(tick))}</text>`),
    ...xTicks.map((tick) => `<line x1="${x(tick).toFixed(1)}" y1="${top}" x2="${x(tick).toFixed(1)}" y2="${height - bottom}" stroke="#f3f4f6"/><text x="${x(tick).toFixed(1)}" y="${height - bottom + 22}" text-anchor="middle" font-size="11" fill="#64748b">${escapeXml(tick)}</text>`),
  ].join("\n");

  const byEpoch = new Map();
  for (const row of rows) {
    if (!byEpoch.has(row.epoch)) byEpoch.set(row.epoch, []);
    byEpoch.get(row.epoch).push(row);
  }

  const spark = [];
  for (const [epoch, epochRows] of byEpoch.entries()) {
    const sorted = epochRows.slice().sort((a, b) => a.sampleIndex - b.sampleIndex || a.amount - b.amount);
    const center = (sorted.length - 1) / 2;
    for (const [index, row] of sorted.entries()) {
      const jitter = sorted.length <= 1 ? 0 : (index - center) * Math.min(4.8, 42 / sorted.length);
      const fill = LABEL_COLORS[row.label] ?? LABEL_COLORS.INVALID;
      const title = `${group.model}, ${group.contextId}, epoch ${row.epoch}, sample ${row.sampleIndex + 1}, ${money(row.amount)}, ${row.label}`;
      spark.push(`<circle cx="${(x(epoch) + jitter).toFixed(1)}" cy="${y(row.amount).toFixed(1)}" r="3.5" fill="${fill}" opacity="0.86"><title>${escapeXml(title)}</title></circle>`);
    }
  }

  const linePoints = epochs.map((epoch) => {
    const epochRows = byEpoch.get(epoch);
    const amount = epochRows[0]?.amount ?? 1;
    return `${x(epoch).toFixed(1)},${y(amount).toFixed(1)}`;
  }).join(" ");

  const labelLegend = [
    ["LOW", LABEL_COLORS.LOW],
    ["NOT_LOW", LABEL_COLORS.NOT_LOW],
    ["failed", LABEL_COLORS.INVALID],
  ].map(([label, color], index) => {
    const lx = width - right - 220 + index * 78;
    const ly = 42;
    return `<circle cx="${lx}" cy="${ly}" r="5" fill="${color}"/><text x="${lx + 10}" y="${ly + 4}" font-size="12" fill="#334155">${escapeXml(label)}</text>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">${escapeXml(group.runName)} binary discovery trace</title>
<desc id="desc">Epoch-by-epoch binary threshold discovery for ${escapeXml(group.model)} and ${escapeXml(group.contextId)}. The y-axis is log-scaled refund amount. Green marks LOW, red marks NOT_LOW, and light gray marks invalid output.</desc>
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="${left}" y="28" font-size="19" font-weight="700" fill="#0f172a">${escapeXml(group.model)} binary discovery</text>
<text x="${left}" y="50" font-size="12" fill="#475569">Run: ${escapeXml(group.runName)}. Context: ${escapeXml(group.contextId)}. Y-axis is logarithmic dollars.</text>
${labelLegend}
<rect x="${left}" y="${top}" width="${plotW}" height="${plotH}" fill="#ffffff"/>
${grid}
<polyline points="${linePoints}" fill="none" stroke="#94a3b8" stroke-width="1.4" opacity="0.55"/>
${spark.join("\n")}
<text x="${left + plotW / 2}" y="${height - 36}" text-anchor="middle" font-size="12" fill="#334155">Binary-search epoch</text>
<text transform="translate(26 ${top + plotH / 2}) rotate(-90)" text-anchor="middle" font-size="12" fill="#334155">Refund amount, log scale</text>
</svg>\n`;
}

function logTicks(min, max) {
  const start = Math.floor(Math.log10(Math.max(1, min)));
  const end = Math.ceil(Math.log10(Math.max(1, max)));
  const ticks = [];
  for (let exponent = start; exponent <= end; exponent += 1) {
    for (const multiplier of [1, 2, 5]) {
      const value = multiplier * 10 ** exponent;
      if (value >= min && value <= max) ticks.push(value);
    }
  }
  return [...new Set(ticks)].sort((a, b) => a - b);
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
    const fileName = `${slug(group.runName)}__${slug(group.model)}__${slug(group.contextId)}.svg`;
    await writeFile(path.join(OUT_DIR, fileName), buildSvg(group), "utf8");
    written.push({ ...group, fileName });
  }

  const lines = ["# Binary Discovery Traces", ""];
  lines.push("Each SVG is generated from raw LOW test-bed JSONL. X is binary-search epoch, Y is refund amount on a log scale. Each epoch contains repeated samples at the tested amount.");
  lines.push("");
  for (const item of written.sort((a, b) => a.fileName.localeCompare(b.fileName))) {
    lines.push(`- [${item.runName} / ${item.model} / ${item.contextId}](../images/results/price-vs-iteration/${item.fileName})`);
  }
  await writeFile(INDEX_FILE, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote ${written.length} binary-discovery SVGs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
