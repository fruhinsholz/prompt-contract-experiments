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
  const contextGroups = new Map();
  const modelGroups = new Map();
  for (const row of rows) {
    if (row.type !== "completion" || row.testbed !== "low" || !Number.isFinite(row.amount)) continue;
    const contextId = row.contextId ?? "unknown_context";
    const contextKey = `${runName}\t${row.model}\t${contextId}`;
    if (!contextGroups.has(contextKey)) contextGroups.set(contextKey, { runName, model: row.model, contextId, rows: [] });
    contextGroups.get(contextKey).rows.push(row);

    const modelKey = `${runName}\t${row.model}`;
    if (!modelGroups.has(modelKey)) modelGroups.set(modelKey, { runName, model: row.model, contextId: "all_contexts", rows: [] });
    modelGroups.get(modelKey).rows.push(row);
  }
  return [
    ...contextGroups.values(),
    ...[...modelGroups.values()].filter((group) => new Set(group.rows.map((row) => row.contextId ?? "unknown_context")).size > 1),
  ];
}

function buildSvg(group) {
  const rows = group.rows
    .slice()
    .sort(compareTraceRows);

  const xGroups = buildXGroups(rows);
  const maxXIndex = Math.max(1, xGroups.length - 1);
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
  const bottom = 102;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const x = (xIndex) => left + (xIndex / maxXIndex) * plotW;
  const y = (amount) => top + (1 - ((Math.log10(Math.max(1, amount)) - logMin + pad) / (logMax - logMin + pad * 2))) * plotH;

  const yTicks = logTicks(minAmount, maxAmount);
  const xTickGroups = xGroups.length <= 14 ? xGroups : xGroups.filter((_, index) => index === 0 || index === xGroups.length - 1 || index % Math.ceil(xGroups.length / 12) === 0);
  const experimentBands = buildExperimentBands(xGroups);

  const grid = [
    ...yTicks.map((tick) => `<line x1="${left}" y1="${y(tick).toFixed(1)}" x2="${width - right}" y2="${y(tick).toFixed(1)}" stroke="#e5e7eb"/><text x="${left - 10}" y="${y(tick) + 4}" text-anchor="end" font-size="11" fill="#475569">${escapeXml(money(tick))}</text>`),
    ...xTickGroups.map((group) => `<line x1="${x(group.xIndex).toFixed(1)}" y1="${top}" x2="${x(group.xIndex).toFixed(1)}" y2="${height - bottom}" stroke="#f3f4f6"/><text x="${x(group.xIndex).toFixed(1)}" y="${height - bottom + 22}" text-anchor="middle" font-size="11" fill="#64748b">${escapeXml(group.label)}</text>`),
    ...experimentBands.slice(1).map((band) => `<line x1="${x(band.start - 0.5).toFixed(1)}" y1="${top}" x2="${x(band.start - 0.5).toFixed(1)}" y2="${height - bottom}" stroke="#cbd5e1" stroke-dasharray="4 5"/>`),
  ].join("\n");

  const bandLabels = experimentBands.map((band) => {
    const center = (band.start + band.end) / 2;
    return `<text x="${x(center).toFixed(1)}" y="${height - bottom + 44}" text-anchor="middle" font-size="10" fill="#64748b">${escapeXml(experimentLabel(band))}</text>`;
  }).join("\n");

  const spark = [];
  for (const xGroup of xGroups) {
    const sorted = xGroup.rows.slice().sort((a, b) => a.sampleIndex - b.sampleIndex || a.amount - b.amount || String(a.createdAt).localeCompare(String(b.createdAt)));
    const center = (sorted.length - 1) / 2;
    for (const [index, row] of sorted.entries()) {
      const jitter = sorted.length <= 1 ? 0 : (index - center) * Math.min(4.8, 42 / sorted.length);
      const fill = LABEL_COLORS[row.label] ?? LABEL_COLORS.INVALID;
      const title = `${group.model}, ${group.contextId}, ${xGroup.label}, epoch ${row.epoch}, sample ${row.sampleIndex + 1}, ${money(row.amount)}, ${row.label}`;
      spark.push(`<circle cx="${(x(xGroup.xIndex) + jitter).toFixed(1)}" cy="${y(row.amount).toFixed(1)}" r="3.5" fill="${fill}" opacity="0.86"><title>${escapeXml(title)}</title></circle>`);
    }
  }

  const traceLines = buildTraceLineSegments(xGroups)
    .map((segment) => {
      const points = segment.map((xGroup) => {
        const amount = xGroup.rows[0]?.amount ?? 1;
        return `${x(xGroup.xIndex).toFixed(1)},${y(amount).toFixed(1)}`;
      }).join(" ");
      return `<polyline points="${points}" fill="none" stroke="#94a3b8" stroke-width="1.4" opacity="0.55"/>`;
    })
    .join("\n");

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
<desc id="desc">Chronological binary threshold discovery for ${escapeXml(group.model)} and ${escapeXml(group.contextId)}. Independent contexts and probe phases are separated visually; lines are drawn only across comparable binary-search points. The y-axis is log-scaled refund amount. Green marks LOW, red marks NOT_LOW, and light gray marks invalid output.</desc>
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="${left}" y="28" font-size="19" font-weight="700" fill="#0f172a">${escapeXml(group.model)} binary discovery</text>
<text x="${left}" y="50" font-size="12" fill="#475569">Run: ${escapeXml(group.runName)}. Context: ${escapeXml(group.contextId)}. Y-axis is logarithmic dollars.</text>
${labelLegend}
<rect x="${left}" y="${top}" width="${plotW}" height="${plotH}" fill="#ffffff"/>
${grid}
${traceLines}
${spark.join("\n")}
${bandLabels}
<text x="${left + plotW / 2}" y="${height - 36}" text-anchor="middle" font-size="12" fill="#334155">Chronological scenario/epoch trace</text>
<text transform="translate(26 ${top + plotH / 2}) rotate(-90)" text-anchor="middle" font-size="12" fill="#334155">Refund amount, log scale</text>
</svg>\n`;
}

function compareTraceRows(a, b) {
  return String(a.createdAt).localeCompare(String(b.createdAt))
    || a.epoch - b.epoch
    || a.amount - b.amount
    || a.sampleIndex - b.sampleIndex;
}

function buildXGroups(rows) {
  const groups = [];
  for (const row of rows) {
    const key = `${row.contextId ?? ""}\t${row.epoch}\t${row.amount}\t${row.candidateKind ?? ""}`;
    let group = groups.at(-1);
    if (group?.key !== key) group = null;
    if (!group) {
      group = {
        key,
        xIndex: groups.length,
        epoch: row.epoch,
        amount: row.amount,
        contextId: row.contextId ?? "unknown_context",
        rows: [],
      };
      group.label = `t${group.xIndex}`;
      groups.push(group);
    }
    group.rows.push(row);
  }
  return groups;
}

function buildExperimentBands(groups) {
  const bands = [];
  for (const group of groups) {
    const previous = bands.at(-1);
    const phase = experimentPhase(group);
    if (previous?.contextId === group.contextId && previous?.phase === phase) {
      previous.end = group.xIndex;
    } else {
      bands.push({ contextId: group.contextId, phase, start: group.xIndex, end: group.xIndex });
    }
  }
  return bands;
}

function buildTraceLineSegments(groups) {
  const segments = [];
  let current = [];
  for (const group of groups) {
    const previous = current.at(-1);
    const comparable = group.rows[0]?.candidateKind === "binary_midpoint"
      && previous?.rows[0]?.candidateKind === "binary_midpoint"
      && previous.contextId === group.contextId;
    if (comparable) {
      current.push(group);
    } else {
      if (current.length > 1) segments.push(current);
      current = group.rows[0]?.candidateKind === "binary_midpoint" ? [group] : [];
    }
  }
  if (current.length > 1) segments.push(current);
  return segments;
}

function experimentPhase(group) {
  const kind = group.rows[0]?.candidateKind ?? "unknown";
  if (kind === "boundary_low" || kind === "boundary_high") return "boundary probes";
  if (kind === "binary_midpoint") return "binary search";
  return kind.replaceAll("_", " ");
}

function experimentLabel(band) {
  return shortContextLabel(band.contextId) + " / " + band.phase;
}

function shortContextLabel(contextId) {
  return String(contextId)
    .replace("retrieved_100000_contract", "100k contract")
    .replace("retrieved_5_gift_card", "5 gift card")
    .replace("fact_only", "fact only");
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
  lines.push("Each SVG is generated from raw LOW test-bed JSONL. X is chronological trace position, Y is refund amount on a log scale. Independent contexts and probe phases are separated visually. Lines are drawn only across comparable binary-search midpoint probes, never between unrelated boundary checks or different contexts.");
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
