#!/usr/bin/env node
import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(new URL("../..", import.meta.url).pathname);
const DEFAULT_SCENARIO = path.join(ROOT, "experiments/prompt-drift/scenarios/shell-quote-contract.json");
const RESULTS_DIR = path.join(ROOT, "experiments/prompt-drift/results");
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

function usage() {
  return `Usage: node experiments/prompt-drift/run.mjs [options]

Options:
  --scenario <path>          Scenario JSON file.
  --models <a,b,c>           Comma-separated model names. Required unless DRIFT_MODELS is set.
  --runs <n>                 Repetitions per model and variant. Defaults to scenario.defaultRuns or 1.
  --temperature <n>          Sampling temperature. Default: scenario.temperature or 0.
  --max-output-tokens <n>    Response budget. Default: scenario.maxOutputTokens or 32.
  --label <name>             Label for the output file name.
  --dry-run                  Print planned requests without calling the API.
  --help                     Show this help.

Environment:
  OPENAI_API_KEY             Required for live runs.
  DRIFT_MODELS               Comma-separated model names if --models is omitted.`;
}

function parseArgs(argv) {
  const args = {
    scenario: DEFAULT_SCENARIO,
    models: process.env.DRIFT_MODELS ?? "",
    runs: null,
    temperature: null,
    maxOutputTokens: null,
    label: "run",
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--scenario":
        args.scenario = argv[++i];
        break;
      case "--models":
        args.models = argv[++i];
        break;
      case "--runs":
        args.runs = Number.parseInt(argv[++i], 10);
        break;
      case "--temperature":
        args.temperature = Number.parseFloat(argv[++i]);
        break;
      case "--max-output-tokens":
        args.maxOutputTokens = Number.parseInt(argv[++i], 10);
        break;
      case "--label":
        args.label = argv[++i];
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function sanitizeLabel(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "run";
}

function requireNumber(name, value, min) {
  if (!Number.isFinite(value) || value < min) {
    throw new Error(`${name} must be a number >= ${min}`);
  }
}

function validateScenario(scenario) {
  for (const key of ["id", "description", "user"]) {
    if (typeof scenario[key] !== "string" || scenario[key].trim() === "") {
      throw new Error(`Scenario is missing string field: ${key}`);
    }
  }
  if (!Array.isArray(scenario.variants) || scenario.variants.length === 0) {
    throw new Error("Scenario must include at least one variant.");
  }
  for (const variant of scenario.variants) {
    if (typeof variant.id !== "string" || typeof variant.system !== "string") {
      throw new Error("Each variant must include string fields: id, system.");
    }
  }
}

function extractOutputText(responseJson) {
  if (typeof responseJson.output_text === "string") return responseJson.output_text;

  const chunks = [];
  for (const item of responseJson.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string") chunks.push(content.text);
      if (typeof content.value === "string") chunks.push(content.value);
    }
  }
  return chunks.join("\n");
}

function classify(text) {
  const raw = String(text ?? "").trim();
  const withoutFence = raw
    .replace(/^```(?:text|json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const strict = withoutFence.match(/^[`"']?([34])[`"']?\.?$/);
  const loose = withoutFence.match(/\b([34])\b/);

  return {
    label: strict?.[1] ?? loose?.[1] ?? "other",
    strictLabel: strict?.[1] ?? "other",
    normalizedText: withoutFence,
  };
}

function buildPayload({ model, scenario, variant, temperature, maxOutputTokens }) {
  const payload = {
    model,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: variant.system }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: scenario.user }],
      },
    ],
    max_output_tokens: maxOutputTokens,
    metadata: {
      experiment: "prompt-drift",
      scenario_id: scenario.id,
      variant_id: variant.id,
    },
  };

  if (Number.isFinite(temperature)) payload.temperature = temperature;
  return payload;
}

async function callOpenAI({ apiKey, payload }) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { rawText: text };
  }

  if (!response.ok) {
    const message = json?.error?.message ?? response.statusText;
    const error = new Error(`OpenAI API error ${response.status}: ${message}`);
    error.status = response.status;
    error.responseJson = json;
    throw error;
  }

  return json;
}

async function appendJsonl(file, value) {
  await appendFile(file, `${JSON.stringify(value)}\n`, "utf8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const scenarioPath = path.resolve(args.scenario);
  const scenario = JSON.parse(await readFile(scenarioPath, "utf8"));
  validateScenario(scenario);

  const models = args.models.split(",").map((model) => model.trim()).filter(Boolean);
  if (models.length === 0) throw new Error("Pass --models or set DRIFT_MODELS.");

  const runs = args.runs ?? scenario.defaultRuns ?? 1;
  const temperature = args.temperature ?? scenario.temperature ?? 0;
  const maxOutputTokens = args.maxOutputTokens ?? scenario.maxOutputTokens ?? 32;
  requireNumber("--runs", runs, 1);
  requireNumber("--temperature", temperature, 0);
  requireNumber("--max-output-tokens", maxOutputTokens, 1);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!args.dryRun && !apiKey) throw new Error("OPENAI_API_KEY is required for live runs.");

  await mkdir(RESULTS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const resultFile = path.join(RESULTS_DIR, `${stamp}-${sanitizeLabel(args.label)}-${sanitizeLabel(scenario.id)}.jsonl`);

  await appendJsonl(resultFile, {
    type: "run_start",
    createdAt: new Date().toISOString(),
    scenario: { id: scenario.id, description: scenario.description, path: path.relative(ROOT, scenarioPath) },
    models,
    variants: scenario.variants.map((variant) => variant.id),
    runs,
    temperature,
    maxOutputTokens,
    dryRun: args.dryRun,
  });

  let planned = 0;
  let completed = 0;

  for (const model of models) {
    for (const variant of scenario.variants) {
      for (let runIndex = 0; runIndex < runs; runIndex += 1) {
        planned += 1;
        const payload = buildPayload({ model, scenario, variant, temperature, maxOutputTokens });
        const rowBase = {
          type: "completion",
          createdAt: new Date().toISOString(),
          scenarioId: scenario.id,
          variantId: variant.id,
          model,
          runIndex,
          temperature,
          maxOutputTokens,
          request: payload,
        };

        if (args.dryRun) {
          const dryText = variant.dryRunOutput ?? scenario.dryRunOutput ?? "other";
          const parsed = classify(dryText);
          await appendJsonl(resultFile, { ...rowBase, outputText: dryText, label: parsed.label, strictLabel: parsed.strictLabel, response: { dryRun: true } });
          completed += 1;
          continue;
        }

        try {
          const responseJson = await callOpenAI({ apiKey, payload });
          const outputText = extractOutputText(responseJson);
          const parsed = classify(outputText);
          await appendJsonl(resultFile, {
            ...rowBase,
            responseId: responseJson.id,
            outputText,
            normalizedText: parsed.normalizedText,
            label: parsed.label,
            strictLabel: parsed.strictLabel,
            usage: responseJson.usage,
            response: responseJson,
          });
        } catch (error) {
          await appendJsonl(resultFile, {
            ...rowBase,
            label: "other",
            strictLabel: "other",
            error: { message: error.message, status: error.status, responseJson: error.responseJson },
          });
        }

        completed += 1;
        process.stderr.write(`completed ${completed}\n`);
        await sleep(100);
      }
    }
  }

  await appendJsonl(resultFile, { type: "run_end", createdAt: new Date().toISOString(), planned, completed });
  console.log(path.relative(ROOT, resultFile));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
