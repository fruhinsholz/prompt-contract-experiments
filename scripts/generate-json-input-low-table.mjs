#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const MANIFEST_PATH = "experiments/json-input-low/manifest.json";

const FORMAT_LABELS = new Map([
  ["prose_same_block", "Prose"],
  ["prose_separated", "Prose separated"],
  ["json_flat", "Raw JSON"],
  ["json_typed", "Typed JSON"],
  ["json_typed_boundary_rule", "Typed JSON + enforcement"],
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
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function money(value) {
  if (value === null) return "none";
  return "$" + Number(value).toLocaleString("en-US");
}

function cellKey({ model, format_id, context_id }) {
  return `${model}\u0000${format_id}\u0000${context_id}`;
}

function highestMajorityLow(rows) {
  const lowAmounts = rows
    .filter((row) => Number(row.low) > Number(row.not_low))
    .map((row) => Number(row.amount))
    .filter(Number.isFinite);
  return lowAmounts.length ? Math.max(...lowAmounts) : null;
}

function buildIndexes(summaryRows) {
  const byCell = new Map();
  for (const row of summaryRows) {
    const key = cellKey(row);
    if (!byCell.has(key)) byCell.set(key, []);
    byCell.get(key).push(row);
  }
  return byCell;
}

async function fileInfo(relativePath) {
  const info = await stat(rel(relativePath));
  return {
    path: relativePath,
    bytes: info.size,
    sha256: await hashFile(relativePath),
  };
}

function renderMarkdown({ manifest, tableRows, provenanceHash }) {
  const articleTable = manifest.article_table;
  const sourceRunIds = [...new Set(tableRows.map((row) => row.run_id))];
  const lines = [
    `<!-- generated:json-input-low-table manifest:${MANIFEST_PATH} source_runs:${sourceRunIds.join(",")} hash:${provenanceHash} -->`,
    "",
    "Highest tested claim amount classified as `LOW` by majority vote.",
    "",
    "| Provider | Model | Test | Prose | Raw JSON | Typed JSON | Typed JSON + enforcement |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: |",
  ];
  for (const row of tableRows) {
    const values = articleTable.formats.map((formatId) => money(row.values[formatId] ?? null));
    lines.push(`| ${row.provider} | \`${row.model}\` | ${row.test_label} | ${values.join(" | ")} |`);
  }
  lines.push("");
  lines.push(`Caption: highest tested claim amount classified as \`LOW\` by majority vote with retrieved context present. Generated from \`${MANIFEST_PATH}\`. \`none\` means no tested amount had majority \`LOW\`.`);
  lines.push("");
  lines.push(`<!-- /generated:json-input-low-table -->`);
  return `${lines.join("\n")}\n`;
}

async function main() {
  const check = process.argv.includes("--check");
  const manifest = await readJson(MANIFEST_PATH);
  const articleTable = manifest.article_table;
  const runsById = new Map(manifest.runs.map((run) => [run.id, run]));
  const runIndexes = new Map();
  const sourceRunIds = [...new Set(articleTable.rows.map((row) => row.run_id))];
  for (const runId of sourceRunIds) {
    const run = runsById.get(runId);
    if (!run) throw new Error(`Missing source run: ${runId}`);
    if (run.status !== "current") throw new Error(`Article source run is not current: ${runId}`);
    const summaryPath = path.join(run.run_dir, "summary.csv");
    runIndexes.set(runId, {
      run,
      summaryPath,
      metadataPath: path.join(run.run_dir, "metadata.json"),
      callsPath: path.join(run.run_dir, "calls.jsonl"),
      byCell: buildIndexes(parseCsv(await readFile(rel(summaryPath), "utf8"))),
    });
  }

  const tableRows = [];
  for (const rowSpec of articleTable.rows) {
    const runIndex = runIndexes.get(rowSpec.run_id);
    const values = {};
    for (const formatId of articleTable.formats) {
      const rows = runIndex.byCell.get(cellKey({ model: rowSpec.model, format_id: formatId, context_id: rowSpec.context_id })) ?? [];
      values[formatId] = highestMajorityLow(rows);
    }
    tableRows.push({
      ...rowSpec,
      values,
      format_labels: Object.fromEntries(articleTable.formats.map((formatId) => [formatId, FORMAT_LABELS.get(formatId) ?? formatId])),
    });
  }

  const manifestHash = await hashFile(MANIFEST_PATH);
  const sourceFiles = [];
  for (const runId of sourceRunIds) {
    const runIndex = runIndexes.get(runId);
    sourceFiles.push(
      { run_id: runId, ...(await fileInfo(runIndex.summaryPath)) },
      { run_id: runId, ...(await fileInfo(runIndex.metadataPath)) },
      { run_id: runId, ...(await fileInfo(runIndex.callsPath)) },
    );
  }
  const output = {
    schema_version: "json-input-low.article-table.v1",
    manifest_path: MANIFEST_PATH,
    manifest_sha256: manifestHash,
    source_run_ids: sourceRunIds,
    source_run_dirs: sourceRunIds.map((runId) => runsById.get(runId).run_dir),
    source_files: sourceFiles,
    provenance_hash: hashJson({ manifestHash, sourceRunIds, sourceFiles, tableRows }),
    table_rows: tableRows,
  };
  const markdown = renderMarkdown({ manifest, tableRows, provenanceHash: output.provenance_hash });
  const jsonText = `${JSON.stringify(output, null, 2)}\n`;

  const markdownPath = articleTable.outputs.markdown;
  const jsonPath = articleTable.outputs.json;
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
