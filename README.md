# Prompt Contract Experiments

This repository is the source of truth for prompt-contract drift experiments, scripts, raw results, generated reports, and result images. It is intentionally separate from the blog. Blog prose should link here for experiment detail instead of carrying graphs or extended result tables.

## What Is Here

- `experiments/prompt-drift/`: a small harness for testing whether the same user prompt changes classification when the governing contract changes.
- `experiments/prompt-thresholds/`: threshold test beds for vague consequence-bearing labels such as `LOW` and `ENOUGH`.
- `experiments/**/results/`: raw JSONL calls, metadata, summaries, and analyses.
- `images/results/price-vs-iteration/`: generated scatter plots showing sampled refund amount versus iteration, grouped by run and context.
- `docs/workflow.md`: how to run, record, and publish new experiments.
- `docs/results.md`: compact index of the currently tracked result sets.

## Quick Start

```bash
npm run check
```

The check uses dry runs where possible and regenerates committed SVG figures from tracked results. Live provider runs require API keys in the environment.

## Live Runs

OpenAI:

```bash
export OPENAI_API_KEY="..."
npm run thresholds:low -- --models gpt-4.1-mini,gpt-4.1 --samples 10 --epochs 10 --max-calls 1000 --gzip-jsonl
```

Gemini:

```bash
export GEMINI_API_KEY="..."
npm run thresholds:low -- --provider gemini --models gemini-3.5-flash-lite,gemini-3.6-flash --contexts all --samples 10 --epochs 10 --max-output-tokens 256 --reasoning-effort none --max-calls 2000 --gzip-jsonl
```

Claude CLI on Bee:

```bash
CLAUDE_MAX_BUDGET_USD=0.08 npm run thresholds:low -- --provider claude-cli --models claude-sonnet-5,claude-opus-4-8 --samples 1 --epochs 3 --scan 100,300,500 --max-calls 12 --reasoning-effort low --gzip-jsonl
```

## Experiments And Results

The repository is meant to be cited as a whole, not copied into the article. Use the README and linked docs to reconstruct what was run, how it was run, and which artifacts support the claim.

- Raw calls are the durable evidence: `experiments/**/results/**/calls.jsonl` and `calls.jsonl.gz`.
- Each run keeps its local contract: `fixture.json`, `system-prompt.txt`, `user-template.txt`, and `metadata.json`.
- Generated summaries are convenience views: `summary.csv`, `summary.md`, and `analysis.md`.
- Result figures are generated artifacts, not hand-edited evidence. Rebuild them with `npm run results:graphs`.
- The full result index is [docs/results.md](docs/results.md).
- The price-versus-iteration figure index is [docs/price-vs-iteration.md](docs/price-vs-iteration.md).

### Price Versus Iteration

These charts plot refund amount against chronological iteration. Each chart groups only runs that belong together: same run directory and same context, with models plotted together when the run compares models under the same fixture. They are useful for spotting convergence, divergence, and unstable boundary behavior without turning the article into a model benchmark.

Regenerate figures after adding or changing tracked results:

```bash
npm run results:graphs
```

Recommended article citation: link to this repository or to [docs/price-vs-iteration.md](docs/price-vs-iteration.md). Do not duplicate the graph set in the article unless a specific figure becomes necessary for the argument.

## Evidence Rule

Do not treat these as benchmark results. The claim being tested is narrower: when the prompt leaves an operational threshold implicit, models can supply different hidden boundaries. The replacement pattern is to externalize the threshold or policy, version it, log it, and enforce it deterministically.
