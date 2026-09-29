#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const [repoArg, outputArg] = process.argv.slice(2);
if (!repoArg || !outputArg) {
  throw new Error("Usage: build_json_article_audit_packet.mjs <article-experiments-repo> <output-file>");
}

const repo = path.resolve(repoArg);
const output = path.resolve(outputArg);
const articleRoot = "articles/json-legibility-is-not-control";
const experimentRoot = `${articleRoot}/experiments/choice-label-contamination`;
const primaryResult = `${experimentRoot}/results/2026-09-29T02-06-01-709Z-jev-jev-latest-key-framing-followup`;
const includedFiles = [
  `${articleRoot}/README.md`,
  `${articleRoot}/PROVENANCE.md`,
  `${experimentRoot}/README.md`,
  `${experimentRoot}/KEY_FRAMING_FOLLOWUP_PREREGISTRATION.md`,
  `${experimentRoot}/BLIND_NATURAL_CHOICE_FAMILIES_RESULTS.md`,
  `${experimentRoot}/refined-stimuli.v6-key-framing-followup.json`,
  `${articleRoot}/src/refined-choice-key-phase-a.mjs`,
  `${articleRoot}/src/analyze-key-framing-followup.mjs`,
  `${primaryResult}/run.json`,
  `${primaryResult}/key-framing-analysis.md`,
  `${experimentRoot}/RISK_SENSITIVITY_ANALYSIS.md`,
  `${experimentRoot}/BLOCKING_LANGUAGE_RESULTS.md`,
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

const callsPath = `${primaryResult}/calls.jsonl`;
const calls = read(callsPath).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
if (calls.length !== 600) throw new Error(`Expected 600 primary calls, found ${calls.length}.`);

const rawHeader = [
  "block",
  "block_order",
  "state",
  "family",
  "response_model",
  "semantic_selection",
  "p_full",
  "p_partial",
  "p_none",
  "review_score",
  "application_branch",
  "request_attempts",
];
const rawRows = calls.map((call) => [
  call.block,
  call.blockOrder,
  call.state,
  call.family,
  call.responseModel,
  call.semanticSelection,
  call.semanticProbabilities?.full,
  call.semanticProbabilities?.partial,
  call.semanticProbabilities?.none,
  call.reviewScore,
  call.applicationBranch,
  call.requestAttempts,
].map(csv).join(","));

const parts = [
  "# Repository audit packet: JSON Legibility Is Not Control",
  "",
  `Public repository commit: \`${commit}\``,
  `Tracked files: ${trackedFiles.length}`,
  "Working tree at packet generation: clean",
  "",
  "This is a bounded, reproducible text projection of the public Git repository. It includes the complete files needed to inspect the article's primary 600-call result, plus a compact lossless table of every analytically relevant field from the raw response records. Provider request/response envelopes and unrelated earlier experiments remain in the public repository and are covered by the full tracked-file SHA-256 inventory below.",
  "",
  "Prior editorial reviews are intentionally excluded so the new judges are not anchored by earlier scores.",
  "",
];

for (const relativePath of includedFiles) {
  const content = read(relativePath).trimEnd();
  parts.push(`## Repository file: ${relativePath}`, "", content, "");
}

parts.push(
  `## Compact raw records derived from ${callsPath}`,
  "",
  "The rows below preserve all fields used by the primary analysis: paired block and within-block order, state, key family, returned model, semantic selection, mapped probabilities, review score, deterministic branch, and request-attempt count.",
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
