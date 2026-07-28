# Experiment Map

This page is the short map for the article-supporting experiments. It tells a reader where the experiment lives, what it asks the model, what it reads, what it writes, and which result summary to inspect first.

## Article-Grade Experiments

| Experiment | What It Probes | Prompted Label | Reads | Writes | Result Summary |
| --- | --- | --- | --- | --- | --- |
| [`LOW` retrieved context](../experiments/prompt-thresholds/low-retrieved-context/) | Whether retrieved context moves the model's implicit dollar threshold for `LOW`. | `LOW` / `NOT_LOW` | `experiments/prompt-thresholds/specs/low.md`, `experiments/prompt-thresholds/retrieved-context-test-prompt.md`, provider API keys from environment | `experiments/prompt-thresholds/results/*-low/`, `threshold-bands.json`, `summary.csv`, `calls.jsonl`, `images/results/price-vs-iteration/` | [`retrieved-context-publication-clean-2026-07-28.md`](../experiments/prompt-thresholds/retrieved-context-publication-clean-2026-07-28.md) |
| [`ENOUGH` evidence sufficiency](../experiments/prompt-thresholds/enough-evidence-sufficiency/) | Whether a vague sufficiency label exposes repeatable but unowned boundaries around evidence count and evidence quality. | `ENOUGH` / `NOT_ENOUGH` | `experiments/prompt-thresholds/specs/enough.md`, provider API keys from environment | `experiments/prompt-thresholds/results/*-enough/`, `enough-thresholds.json`, `summary.csv`, `calls.jsonl`, `images/results/enough-thresholds/` | [`docs/enough-thresholds.md`](enough-thresholds.md) |
| [Prompt drift shell contract](../experiments/prompt-drift/) | Whether the same user prompt changes classification when the governing contract changes. | `3` / `4` | `experiments/prompt-drift/scenarios/*.json`, provider API keys from environment | `experiments/prompt-drift/results/*.jsonl`, generated reports | [`experiments/prompt-drift/README.md`](../experiments/prompt-drift/README.md) |

## How To Read A Run Directory

Every article-grade threshold run writes a timestamped directory under `experiments/prompt-thresholds/results/`.

- `metadata.json`: command line, provider, models, search settings, sample counts, commit hash, and output files.
- `fixture.json`: structured test case definitions used by the script.
- `system-prompt.txt`: exact system prompt sent to the model.
- `user-template.txt`: exact user prompt template sent to the model.
- `calls.jsonl`: one raw record per model call, including request payload, parsed label, raw output, usage, latency, candidate kind, and provider-returned model fields when available.
- `calls.jsonl.gz`: compressed copy when `--gzip-jsonl` was used.
- `summary.csv` and `summary.md`: generated summaries from the JSONL records.
- `threshold-bands.json` / `threshold-bands.md`: generated `LOW` boundary summaries when the run uses the bounded search.
- `enough-thresholds.json` / `enough-thresholds.md`: generated `ENOUGH` boundary summaries when the run uses the two-phase probe.

## Rebuild Generated Views

```bash
npm run check
```

This validates the scripts and regenerates committed figures, publication summaries, and the local image viewer.

