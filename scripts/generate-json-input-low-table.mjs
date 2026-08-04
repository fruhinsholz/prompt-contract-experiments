#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const MANIFEST_PATH = "experiments/json-input-low/manifest.json";

const CONTEXT_LABELS = new Map([
  ["fact_only", "No added context"],
  ["retrieved_5_gift_card", "$5 gift-card context"],
  ["retrieved_100000_contract", "$100k retrieved context"],
]);

const FORMAT_LABELS = new Map([
  ["prose_same_block", "Prose prompt"],
  ["json_typed_boundary_rule", "Typed JSON with explicit $100 rule"],
]);

const CONTEXT_SHORT_LABELS = new Map([
  ["retrieved_5_gift_card", "Context added $5"],
  ["retrieved_100000_contract", "Context added $100k"],
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

function money(value) {
  return "$" + Number(value).toLocaleString("en-US");
}

function resultLabel({ count, total }) {
  if (count === null || total === null) return "Not run";
  if (count !== 0 && count !== total) return "Some";
  return count === 0 ? "None" : "All";
}

function labelClass(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function renderResult({ kind, count, total }) {
  const value = count === null || total === null
    ? "n/a"
    : `${count}/${total}`;
  if (kind !== "errors") return `<span class="json-low-value">${value}</span>`;
  const label = resultLabel({ count, total });
  const emphasis = count && count > 0 ? " json-low-result--warning" : "";
  return `<span class="json-low-result${emphasis}"><span class="json-low-result__value">${value}</span><span class="json-low-result__label json-low-result__label--${labelClass(label)}">${label}</span></span>`;
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
    const controlIndex = rowSpec.control_run_id ? runIndexes.get(rowSpec.control_run_id) : null;
    const contextIndex = runIndexes.get(rowSpec.context_run_id);
    const controlContextId = rowSpec.control_context_id ?? "fact_only";
    const contextId = rowSpec.context_id ?? "retrieved_100000_contract";
    const formatId = rowSpec.format_id ?? config.format_id;
    if (rowSpec.control_run_id && !controlIndex) throw new Error(`Missing control run index: ${rowSpec.control_run_id}`);
    if (!contextIndex) throw new Error(`Missing context run index: ${rowSpec.context_run_id}`);
    for (const amount of config.amounts) {
      const control = controlIndex?.byCell.get(`${rowSpec.model}\u0000${controlContextId}\u0000${formatId}\u0000${amount}`) ?? null;
      const context = contextIndex.byCell.get(`${rowSpec.model}\u0000${contextId}\u0000${formatId}\u0000${amount}`);
      if (rowSpec.control_run_id && !control) throw new Error(`Missing control row for ${rowSpec.model} ${formatId} ${controlContextId} amount ${amount}`);
      if (!context) throw new Error(`Missing context row for ${rowSpec.model} ${formatId} ${contextId} amount ${amount}`);
      const total = Number(context.total);
      const expected = runtimeLabel(amount, thresholdUsd);
      tableRows.push({
        model: rowSpec.model,
        provider: rowSpec.provider,
        section_id: rowSpec.section_id ?? contextId,
        section_label: rowSpec.section_label ?? CONTEXT_LABELS.get(contextId) ?? contextId,
        format_id: formatId,
        format_label: FORMAT_LABELS.get(formatId) ?? formatId,
        amount,
        threshold_usd: thresholdUsd,
        expected_label: expected,
        control: control ? {
          run_id: rowSpec.control_run_id,
          context_id: controlContextId,
          low: Number(control.low),
          not_low: Number(control.not_low),
          invalid: Number(control.invalid),
          total: Number(control.total),
          error_count: promptErrorCount(control, thresholdUsd),
        } : null,
        retrieved_context: {
          run_id: rowSpec.context_run_id,
          context_id: contextId,
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
  return tableRows.sort((a, b) => `${a.section_id}:${a.model}:${a.format_id}:${a.amount}`.localeCompare(`${b.section_id}:${b.model}:${b.format_id}:${b.amount}`, undefined, { numeric: true }));
}

function experimentDescription(sectionId) {
  const descriptions = new Map([
    ["retrieved_100000_contract_prose", "Prose classifier with retrieved context saying contracts above $100,000 require executive review. This tests whether nearby business context moves the LOW boundary even though the refund rule is unchanged."],
    ["retrieved_5_gift_card_prose", "Prose classifier with retrieved context saying this account usually treats $5 gift cards as low-value gestures. This tests whether a nearby small-value reference pulls the boundary downward."],
    ["retrieved_5_gift_card_explicit_rule", "Typed JSON prompt with the $100 rule stated explicitly, plus the same $5 gift-card context. This tests whether JSON improves steering while still leaving enforcement inside model behavior."],
  ]);
  return descriptions.get(sectionId) ?? "Generated publication-clean LOW boundary experiment.";
}

function experimentTakeaway(sectionId) {
  const takeaways = new Map([
    ["retrieved_100000_contract_prose", "Read this as upward drift: once the prompt sees a nearby $100,000 business threshold, many amounts above the intended $100 boundary start looking LOW. The model is not failing to read the number; it is borrowing scale from context."],
    ["retrieved_5_gift_card_prose", "Read this as downward drift: the same classifier sees $5 as the nearby example of low value, so ordinary refund amounts like $25, $50, or $100 stop looking LOW. The boundary moved because the context changed, not because the rule changed."],
    ["retrieved_5_gift_card_explicit_rule", "Read this as improved prompt-side compliance, not as an enforcement boundary: the $5 context is still present, and the explicit $100 rule keeps the model aligned on this grid. The important part is that the rule is now inspectable and can also be enforced deterministically outside the model."],
  ]);
  return takeaways.get(sectionId) ?? "The deterministic check is the stable boundary.";
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderExplorerCell(metric) {
  if (!metric) return "";
  return renderResult(metric);
}

function renderColumnGuide() {
  return [
    `<dl class="json-low-column-guide">`,
    `<div><dt>Reference rule</dt><dd>The fixed rule used for evaluation: <code>LOW iff amount &lt;= $100</code>.</dd></div>`,
    `<div><dt>Baseline prompt</dt><dd>The same classifier for the same amount grid without the selected retrieved context.</dd></div>`,
    `<div><dt>Selected context</dt><dd>The selected experimental context added to the classifier.</dd></div>`,
    `<div><dt>LOW answers</dt><dd>How often the model answered <code>LOW</code> out of <code>n=100</code>.</dd></div>`,
    `<div><dt>Policy mismatches</dt><dd>How often the model-owned answer crossed the system-owned policy boundary. Non-zero values are bold because they are the trust-boundary failure.</dd></div>`,
    `<div><dt>Deterministic check</dt><dd>The same amount grid checked by code instead of model interpretation. This is the control condition: the $100 rule is enforced outside the model.</dd></div>`,
    `</dl>`,
    `<p class="json-low-note">These counts are not expected to form a smooth dose-response curve. The point is narrower: nearby context can move a consequence-bearing boundary at all. Occasional divergences between LOW-answer counts and policy-mismatch counts are shown rather than smoothed away; once interpretation owns the boundary, the system cannot guarantee a clean explanation for every cell.</p>`,
  ].join("\n");
}

function renderExplorerTable(experiment) {
  const contextHeader = htmlEscape(experiment.context_label_short ?? "Selected context");
  const lines = [
    `<div class="json-low-table" data-json-low-table>`,
    `<table>`,
    `<thead>`,
    `<tr><th scope="col" rowspan="3">Amount</th><th scope="col" rowspan="3">Reference rule</th><th scope="colgroup" colspan="5">GPT-5.6</th><th scope="colgroup" colspan="5">Gemini 3.6 Flash</th></tr>`,
    `<tr><th scope="colgroup" colspan="2">Baseline prompt</th><th scope="colgroup" colspan="2">${contextHeader}</th><th scope="colgroup">Deterministic check</th><th scope="colgroup" colspan="2">Baseline prompt</th><th scope="colgroup" colspan="2">${contextHeader}</th><th scope="colgroup">Deterministic check</th></tr>`,
    `<tr><th scope="col">LOW answers</th><th scope="col">Policy mismatches</th><th scope="col">LOW answers</th><th scope="col">Policy mismatches</th><th scope="col">Policy mismatches</th><th scope="col">LOW answers</th><th scope="col">Policy mismatches</th><th scope="col">LOW answers</th><th scope="col">Policy mismatches</th><th scope="col">Policy mismatches</th></tr>`,
    `</thead>`,
    `<tbody>`,
  ];
  for (const row of experiment.rows) {
    const modelCells = row.models.map((model) => [
      renderExplorerCell(model.control_low),
      renderExplorerCell(model.control_errors),
      renderExplorerCell(model.context_low),
      renderExplorerCell(model.context_errors),
      renderExplorerCell(model.runtime_errors),
    ].map((cell) => `<td>${cell}</td>`).join("")).join("");
    lines.push(`<tr><th scope="row">${htmlEscape(money(row.amount))}</th><td><code>${htmlEscape(row.expected_label)}</code></td>${modelCells}</tr>`);
  }
  lines.push(`</tbody>`, `</table>`, `</div>`);
  return lines.join("\n");
}

function buildExperiments({ config, tableRows }) {
  const modelLabels = new Map([
    ["gpt-5.6", "GPT-5.6"],
    ["gemini-3.6-flash", "Gemini 3.6 Flash"],
  ]);
  const experiments = [];
  for (const sectionId of [...new Set(config.rows.map((row) => row.section_id ?? row.context_id))]) {
    const sectionRows = tableRows.filter((row) => row.section_id === sectionId);
    const models = [...new Set(config.rows
      .filter((row) => (row.section_id ?? row.context_id) === sectionId)
      .map((row) => row.model))];
    const amounts = [...new Set(sectionRows.map((row) => row.amount))].sort((a, b) => a - b);
    const byModelAmount = new Map(sectionRows.map((row) => [`${row.model}\u0000${row.amount}`, row]));
    experiments.push({
      id: sectionId,
      label: sectionRows[0].section_label,
      description: experimentDescription(sectionId),
      takeaway: experimentTakeaway(sectionId),
      format_label: sectionRows[0].format_label,
      context_label_short: CONTEXT_SHORT_LABELS.get(sectionRows[0].retrieved_context.context_id) ?? "Selected context",
      rows: amounts.map((amount) => {
        const firstRow = sectionRows.find((row) => row.amount === amount);
        return {
          amount,
          expected_label: firstRow.expected_label,
          models: models.map((model) => {
            const row = byModelAmount.get(`${model}\u0000${amount}`);
            return {
              id: model,
              label: modelLabels.get(model) ?? model,
              control_low: {
                kind: "low",
                count: row.control?.low ?? null,
                total: row.control?.total ?? null,
              },
              control_errors: {
                kind: "errors",
                count: row.control?.error_count ?? null,
                total: row.control?.total ?? null,
              },
              context_low: {
                kind: "low",
                count: row.retrieved_context.low,
                total: row.retrieved_context.total,
              },
              context_errors: {
                kind: "errors",
                count: row.retrieved_context.error_count,
                total: row.retrieved_context.total,
              },
              runtime_errors: {
                kind: "errors",
                count: row.runtime_enforced.error_count,
                total: row.runtime_enforced.total,
              },
            };
          }),
        };
      }),
    });
  }
  return experiments;
}

function safeJsonScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function renderMarkdown({ config, tableRows, provenanceHash }) {
  const sourceRunIds = [...new Set(tableRows.flatMap((row) => [row.control?.run_id, row.retrieved_context.run_id]).filter(Boolean))];
  const experiments = buildExperiments({ config, tableRows });
  const selectedExperiment = experiments[0];
  const explorerData = {
    schema_version: "json-input-low.article-explorer.v1",
    threshold_usd: config.threshold_usd,
    default_experiment_id: selectedExperiment.id,
    source_runs: sourceRunIds,
    provenance_hash: provenanceHash,
    experiments,
  };
  const lines = [
    `<!-- generated:json-input-low-table manifest:${MANIFEST_PATH} source_runs:${sourceRunIds.join(",")} hash:${provenanceHash} -->`,
    "",
    `<section class="json-low-explorer" data-json-low-explorer>`,
    `<p class="json-low-kicker">Publication-clean LOW boundary probe. Counts are generated from fixed-grid <code>n=100</code> runs.</p>`,
    `<p>Operational rule: <code>LOW iff refund_claim_amount_usd &lt;= ${config.threshold_usd}</code>.</p>`,
    `<div class="json-low-controls">`,
    `<label for="json-low-experiment">Experiment</label>`,
    `<select id="json-low-experiment" data-json-low-experiment>`,
    ...experiments.map((experiment) => `<option value="${htmlEscape(experiment.id)}"${experiment.id === selectedExperiment.id ? " selected" : ""}>${htmlEscape(experiment.label)}</option>`),
    `</select>`,
    `</div>`,
    `<p class="json-low-description" data-json-low-description>${htmlEscape(selectedExperiment.description)}</p>`,
    `<p class="json-low-takeaway" data-json-low-takeaway>${htmlEscape(selectedExperiment.takeaway)}</p>`,
    renderColumnGuide(),
    renderExplorerTable(selectedExperiment),
    `<p class="json-low-caption">Each value keeps the raw count out of <code>n=100</code>. Read this as improved prompt-side compliance, not as an enforcement boundary: explicit prose or JSON rules are still interpreted by the model. In this table, only the deterministic check guarantees <code>LOW iff refund_claim_amount_usd &lt;= 100</code>. Full prompts, raw calls, and generated data are in <a href="https://github.com/fruhinsholz/prompt-contract-experiments/tree/main/experiments/json-input-low" target="_blank" rel="noopener noreferrer"><code>experiments/json-input-low</code></a>.</p>`,
    `<script type="application/json" data-json-low-data>${safeJsonScript(explorerData)}</script>`,
    `</section>`,
    "",
    `<!-- /generated:json-input-low-table -->`,
  ];
  return `${lines.join("\n")}\n`;
}

async function main() {
  const check = process.argv.includes("--check");
  const manifest = await readJson(MANIFEST_PATH);
  const config = manifest.publication_clean_table;
  if (!config) throw new Error("manifest.publication_clean_table is required.");
  const runsById = new Map(manifest.runs.map((run) => [run.id, run]));
  const runIds = [...new Set(config.rows.flatMap((row) => [row.control_run_id, row.context_run_id]).filter(Boolean))];
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
    schema_version: "json-input-low.article-table.v3",
    manifest_path: MANIFEST_PATH,
    manifest_sha256: manifestHash,
    source_run_ids: runIds,
    source_run_dirs: runIds.map((runId) => runsById.get(runId).run_dir),
    source_files: sourceFiles,
    contexts: Object.fromEntries((config.contexts ?? []).map((id) => [id, CONTEXT_LABELS.get(id) ?? id])),
    threshold_usd: config.threshold_usd,
    format_id: config.format_id,
    formats: [...new Set(tableRows.map((row) => row.format_id))],
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
