#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [repoArg, outputArg] = process.argv.slice(2);
if (!repoArg || !outputArg) {
  throw new Error("Usage: build_json_prospective_audit_packet.mjs <article-experiments-repo> <output-file>");
}

const repo = path.resolve(repoArg);
const output = path.resolve(outputArg);
const articleRoot = "articles/json-legibility-is-not-control";
const currentRoot = `${articleRoot}/current`;
const resultRoot = `${currentRoot}/results/2026-09-30T01-45-19-321Z-jev-jev-latest-prospective-routing-boundary`;
const includedFiles = [
  `${articleRoot}/README.md`,
  `${currentRoot}/README.md`,
  `${currentRoot}/PREREGISTRATION.md`,
  `${currentRoot}/stimuli.v1.json`,
  `${currentRoot}/src/run-prospective-routing-boundary.mjs`,
  `${currentRoot}/src/analyze-prospective-routing-boundary.mjs`,
  `${resultRoot}/run.json`,
  `${resultRoot}/summary.json`,
  `${resultRoot}/summary.md`,
  `${resultRoot}/analysis.json`,
  `${resultRoot}/analysis.md`,
];

function git(...args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
}

function read(relativePath) {
  return readFileSync(path.join(repo, relativePath), "utf8");
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function csv(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const commit = git("rev-parse", "HEAD");
const status = git("status", "--porcelain");
if (status) throw new Error("The public audit repository must be clean before packet generation.");

const trackedFiles = git("ls-files").split("\n").filter(Boolean);
const inventory = trackedFiles.map((relativePath) => {
  const content = readFileSync(path.join(repo, relativePath));
  return `${sha256(content)}  ${relativePath}`;
});

const callsPath = `${resultRoot}/calls.jsonl`;
const calls = read(callsPath).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
if (calls.length !== 720) throw new Error(`Expected 720 primary calls, found ${calls.length}.`);

const rawHeader = [
  "block", "block_order", "execution_index", "job_id", "state", "family",
  "semantic_order", "response_model", "semantic_selection", "p_full",
  "p_partial", "p_none", "review_score", "application_branch",
  "request_attempts", "latency_ms", "input_tokens", "output_tokens",
];
const rawRows = calls.map((call) => [
  call.block,
  call.blockOrder,
  call.executionIndex,
  call.jobId,
  call.state,
  call.family,
  call.semanticOrder?.join("|"),
  call.responseModel,
  call.semanticSelection,
  call.semanticProbabilities?.full,
  call.semanticProbabilities?.partial,
  call.semanticProbabilities?.none,
  call.reviewScore,
  call.applicationBranch,
  call.requestAttempts,
  call.latencyMs,
  call.usage?.input_tokens,
  call.usage?.output_tokens,
].map(csv).join(","));

const parts = [
  "# Repository audit packet: JSON Legibility Is Not Control, prospective experiment",
  "",
  `Public repository commit: \`${commit}\``,
  `Tracked files: ${trackedFiles.length}`,
  "Working tree at packet generation: clean",
  "",
  "This is a bounded, reproducible text projection of the public Git repository. It includes the complete files needed to inspect the article's prospective 720-call result, plus a compact lossless table of every field used by the primary analysis and operational audit. The full raw provider envelopes remain in the public repository and are covered by the tracked-file SHA-256 inventory below.",
  "",
  "The archive of earlier test-bed development is intentionally excluded from the evidence projection because the article's estimates and frozen success decision use only the prospective experiment. Its presence remains visible in the repository inventory. Prior editorial reviews are excluded to avoid anchoring.",
  "",
];

for (const relativePath of includedFiles) {
  parts.push(`## Repository file: ${relativePath}`, "", read(relativePath).trimEnd(), "");
}

parts.push(
  `## Compact raw records derived from ${callsPath}`,
  "",
  "These rows preserve the paired block, execution order, state, key family, semantic order, returned model, semantic selection and probabilities, review score, deterministic route, attempts, latency, and token counts for every accepted call.",
  "",
  "```csv",
  rawHeader.join(","),
  ...rawRows,
  "```",
  "",
  "## Full tracked-file SHA-256 inventory",
  "",
  "```text",
  ...inventory,
  "```",
  "",
);

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `${parts.join("\n")}\n`, "utf8");
console.log(`Wrote ${output} (${calls.length} compact raw records, ${trackedFiles.length} tracked files).`);
