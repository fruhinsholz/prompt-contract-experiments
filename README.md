# Prompt Contract Experiments

This repository is the source of truth for prompt-contract drift experiments, scripts, raw results, generated reports, and result images. It is intentionally separate from the blog. Blog prose should link here for experiment detail instead of carrying graphs or extended result tables.

Related article: [Prompt Edits Are Architecture Changes](https://blog.meursault.ai/draft/prompt-edits-are-architecture-changes/).

## What Is Here

- `experiments/prompt-drift/`: a small harness for testing whether the same user prompt changes classification when the governing contract changes.
- `experiments/prompt-thresholds/`: threshold test beds for vague consequence-bearing labels such as `LOW` and `ENOUGH`.
- `experiments/prompt-thresholds/low-retrieved-context/`: article-grade `LOW` experiment guide.
- `experiments/prompt-thresholds/enough-evidence-sufficiency/`: article-grade `ENOUGH` experiment guide.
- `experiments/**/results/`: raw JSONL calls, metadata, summaries, and analyses.
- `images/results/price-vs-iteration/`: generated scatter plots showing sampled refund amount versus iteration, grouped by run and context.
- `images/results/enough-thresholds/`: generated SVG summaries for the `ENOUGH` two-phase probe.
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
npm run thresholds:low -- --models gpt-4.1-mini,gpt-4.1 --samples 10 --epochs 10 --max 20000 --max-calls 1000 --gzip-jsonl
```

Gemini:

```bash
export GEMINI_API_KEY="..."
npm run thresholds:low -- --provider gemini --models gemini-3.5-flash-lite,gemini-3.6-flash --contexts all --samples 10 --epochs 10 --max 20000 --max-output-tokens 256 --reasoning-effort none --max-calls 2000 --gzip-jsonl
```

Publication clean runs should use the retrieved-context test bed and a distinct label. Keep older comparison runs in the repository, but cite only the clean run artifacts in article prose or appendix material:

```bash
npm run thresholds:low:retrieved-context -- --models gpt-4.1-mini,gpt-4.1 --contexts all --samples 10 --refine-samples 30 --epochs 10 --max 20000 --max-calls 2000 --gzip-jsonl --label publication-clean-openai
npm run thresholds:low:retrieved-context -- --models gpt-5.5,gpt-5.6 --contexts all --samples 10 --refine-samples 30 --epochs 10 --max 20000 --max-output-tokens 1024 --max-calls 2000 --gzip-jsonl --label publication-clean-openai-gpt55-gpt56-max1024
npm run thresholds:enough -- --models gpt-5.5,gpt-5.6 --mode contract --samples 10 --epochs 7 --converge-width 0.25 --max-output-tokens 1024 --max-calls 400 --gzip-jsonl --label publication-clean-openai-gpt55-gpt56-enough-max1024
npm run thresholds:low:retrieved-context -- --provider gemini --models gemini-3.5-flash-lite,gemini-3.6-flash --contexts all --samples 10 --refine-samples 30 --epochs 10 --max 20000 --max-output-tokens 256 --reasoning-effort none --max-calls 2500 --gzip-jsonl --label publication-clean-gemini
```

The GPT 5.x clean runs use `--max-output-tokens 1024` because these models may spend output budget on internal reasoning before returning a one-label answer. A lower `256` budget produced a truncated exploratory attempt and is not the published GPT 5.x run.

Claude CLI on Bee:

```bash
CLAUDE_MAX_BUDGET_USD=0.08 npm run thresholds:low -- --provider claude-cli --models claude-sonnet-5,claude-opus-4-8 --samples 1 --epochs 3 --scan 100,300,500 --max-calls 12 --reasoning-effort low --gzip-jsonl
```

## Experiments And Results

The repository is meant to be cited as a whole, not copied into the article. Use the README and linked docs to reconstruct what was run, how it was run, and which artifacts support the claim.

- Start here for the article-grade experiments: [docs/experiments.md](docs/experiments.md).
- Raw calls are the durable evidence: `experiments/**/results/**/calls.jsonl` and `calls.jsonl.gz`.
- Each run keeps its local contract: `fixture.json`, `system-prompt.txt`, `user-template.txt`, and `metadata.json`.
- Generated summaries are convenience views: `summary.csv`, `summary.md`, and `analysis.md`.
- Result figures are generated artifacts, not hand-edited evidence. Rebuild them with `npm run results:graphs`.
- The full result index is [docs/results.md](docs/results.md).
- The price-versus-iteration figure index is [docs/price-vs-iteration.md](docs/price-vs-iteration.md).

### Price Versus Iteration

These charts plot refund amount against chronological iteration. Each chart groups only runs that belong together: same run directory and same context, with models plotted together when the run compares models under the same fixture. They are useful for spotting convergence, divergence, and unstable boundary behavior without turning the article into a model benchmark.

Every generated figure should include a concise visual description: what is visible, which experiment or context it belongs to, and what the reader should notice. A filename, model name, or raw chart alone is not enough context.

Regenerate figures after adding or changing tracked results:

```bash
npm run results:graphs
```

### Image Viewer

Open the generated image browser locally:

```bash
npm run viewer
```

Then visit `http://127.0.0.1:4177/`. The viewer lists generated files by model, test context, and generation time. Click an item to preview it, use `Open full` for the large image, and copy either the filename or the rendered image from the open view. SVG images are copied as PNG when the browser permits clipboard image writes. Keep the browser URL on `localhost` when using copy actions; remote LAN HTTP pages may not receive clipboard permissions.

For a LAN-visible viewer on Bee, bind the server to all interfaces and set a basic-auth password:

```bash
VIEWER_PASSWORD=password npm run viewer:lan
```

Then visit `http://10.0.0.73:4177/` from the internal network and log in with `viewer` / `password`. The password is intentionally a local runtime setting, not a repository secret.

New LOW runs use bounded probability band search by default, so the useful interpretation is interval contraction plus endpoint `P(LOW)` estimates, not a complete list of scanned prices or a single exact threshold.

Recommended article citation: link to this repository or to [docs/price-vs-iteration.md](docs/price-vs-iteration.md). Do not duplicate the graph set in the article unless a specific figure becomes necessary for the argument.

## Evidence Rule

Do not treat these as benchmark results. The claim being tested is narrower: when the prompt leaves an operational threshold implicit, models can supply different hidden boundaries. The replacement pattern is to externalize the threshold or policy, version it, log it, and enforce it deterministically.
