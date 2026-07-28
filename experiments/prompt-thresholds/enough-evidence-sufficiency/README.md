# ENOUGH Evidence Sufficiency

This is the article-grade experiment for the `ENOUGH` evidence label.

![ENOUGH threshold result screenshot](../../../images/results/enough-thresholds/2026-07-28t03-26-10-470z-publication-clean-openai-enough-enough.svg)

More images: [ENOUGH threshold figure index](../../../docs/enough-thresholds.md).

## Why We Run It

- The article claim is that `ENOUGH` can hide a sufficiency policy inside model judgment.
- The experiment does not recover the model's real rule.
- It probes one observable surface of an opaque rule by varying evidence count and active evidence score.
- A different prompt or retrieved context could move the observed boundary.
- The architectural point is that a production sufficiency rule should live in code and policy, not inside the model's interpretation of `ENOUGH`.

## Method

- Script: `experiments/prompt-thresholds/src/enough.mjs`.
- Prompt spec: `experiments/prompt-thresholds/specs/enough.md`.
- Labels: `ENOUGH` or `NOT_ENOUGH`.
- Mode: `contract`.
- Phase 1: binary-search the minimum number of strong evidence rows.
- Phase 1 fixture: active rows score `10`, inactive rows score `1`.
- Phase 2: binary-search the minimum active-row score using the count found in phase 1.
- Samples: 10 samples per candidate.
- Candidate row order is rotated across samples to reduce fixed-position bias.
- The result is a measured boundary under this fixture, not a discovered invariant.

## What It Reads

- Prompt template and evidence-category definitions from `specs/enough.md`.
- Provider API keys from the shell environment.
- CLI options for provider, model list, samples, epoch count, convergence width, output cap, and max-call guard.

## What It Writes

- Raw calls: `experiments/prompt-thresholds/results/<timestamp>-<label>-enough/calls.jsonl`.
- Optional compressed calls: `calls.jsonl.gz`.
- Run metadata: `metadata.json`.
- Exact prompts: `system-prompt.txt` and `user-template.txt`.
- Generated summaries: `summary.csv`, `summary.md`, `analysis.md`.
- Boundary summaries: `enough-thresholds.json`, `enough-thresholds.md`.
- Generated images: `images/results/enough-thresholds/`.

## Clean Publication Result

- OpenAI clean run: `experiments/prompt-thresholds/results/2026-07-28T03-26-10-470Z-publication-clean-openai-enough-enough/`.
- Gemini clean run: `experiments/prompt-thresholds/results/2026-07-28T03-20-39-966Z-publication-clean-gemini-enough-enough/`.
- `gpt-4.1`: 4 strong rows; active score `8.875-9.016`.
- `gpt-4.1-mini`: 6 strong rows; active score `7.891-8.032`.
- `gemini-3.5-flash-lite`: 6 strong rows; active score `9.719-9.86`.
- `gemini-3.6-flash`: 6 strong rows; active score `7.891-8.032`.

## Reproduce

```bash
npm run thresholds:enough -- --models gpt-4.1-mini,gpt-4.1 --mode contract --samples 10 --epochs 7 --max-calls 400 --gzip-jsonl --label publication-clean-openai-enough
npm run thresholds:enough -- --provider gemini --models gemini-3.5-flash-lite,gemini-3.6-flash --mode contract --samples 10 --epochs 7 --max-output-tokens 256 --reasoning-effort none --max-calls 400 --gzip-jsonl --label publication-clean-gemini-enough
npm run results:enough-thresholds
```

