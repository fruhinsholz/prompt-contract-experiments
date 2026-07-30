# Prompt Contract Experiments

This repository contains the reproducible evidence behind [Prompt Edits Are Architecture Changes](https://blog.fruhinsholz.com/draft/prompt-edits-are-architecture-changes/). The article argues that prompts can hide operational contracts: when model judgment controls a consequence-bearing value, the boundary should be externalized, pinned, versioned, and enforced outside the model.

The repository is intentionally narrow. It is not a benchmark suite and it is not a general prompt-bias archive. It keeps only the experiments used by the article, the scripts needed to reproduce them, the latest clean result sets, generated result images, and a downloadable skill for finding similar contract-shaped risks in your own codebase.

The article uses two kinds of examples. First, the `LOW` refund experiment shows that a vague label can hide a dollar threshold. The same refund case is classified under three context conditions: fact only, nearby context mentioning a `$5` gift card, and nearby context mentioning a `$100,000` contract. The tested case does not change, but the observed transition band for `LOW` moves.

Second, the `ENOUGH` evidence experiment shows the same pattern for sufficiency judgment. A prompt asks whether ten scored evidence rows are enough. The experiment probes how many strong rows are needed, then how strong those rows must be. The point is not to recover the model's true rule. The point is that a production sufficiency rule should be owned by code and policy, not implied by the word `ENOUGH`.

## Experiments

- [LOW Retrieved Context](experiments/low-retrieved-context/): refund amount classification with fact-only, `$5` gift-card, and `$100,000` contract context variants.
- [ENOUGH Evidence Sufficiency](experiments/enough-evidence-sufficiency/): two-phase probe for minimum evidence count and minimum active-row score.
- [Prompt Contract Audit Skill](skills/prompt-contract-audit/): a reusable skill for finding possible hidden prompt contracts in a codebase.

## Repository Layout

```text
README.md
experiments/
  low-retrieved-context/
    README.md
    results/
  enough-evidence-sufficiency/
    README.md
    results/
specs/
  low.md
  low-retrieved-context.md
  enough.md
src/
  low-retrieved-context.mjs
  enough.mjs
  shared/harness.mjs
scripts/
images/results/
skills/prompt-contract-audit/
docs/
```

## Setup

Use Node.js 20 or newer.

```bash
npm install
npm run check
```

Live runs need `OPENAI_API_KEY` or `GEMINI_API_KEY` in the environment. Do not commit secrets.

## Reproduce The Article Runs

LOW retrieved context:

```bash
npm run thresholds:low:retrieved-context -- --models gpt-4.1-mini,gpt-4.1 --contexts all --samples 10 --refine-samples 30 --epochs 10 --max 20000 --max-calls 2000 --gzip-jsonl --label publication-clean-openai
npm run thresholds:low:retrieved-context -- --models gpt-5.5,gpt-5.6 --contexts all --samples 10 --refine-samples 30 --epochs 10 --max 20000 --max-output-tokens 1024 --max-calls 2000 --gzip-jsonl --label publication-clean-openai-gpt55-gpt56-max1024
npm run thresholds:low:retrieved-context -- --provider gemini --models gemini-3.5-flash-lite,gemini-3.6-flash --contexts all --samples 10 --refine-samples 30 --epochs 10 --max 20000 --max-output-tokens 256 --reasoning-effort none --max-calls 2500 --gzip-jsonl --label publication-clean-gemini
```

ENOUGH evidence sufficiency:

```bash
npm run thresholds:enough -- --models gpt-4.1-mini,gpt-4.1 --mode contract --samples 10 --epochs 7 --max-calls 400 --gzip-jsonl --label publication-clean-openai-enough
npm run thresholds:enough -- --models gpt-5.5,gpt-5.6 --mode contract --samples 10 --epochs 7 --converge-width 0.25 --max-output-tokens 1024 --max-calls 400 --gzip-jsonl --label publication-clean-openai-gpt55-gpt56-enough-max1024
npm run thresholds:enough -- --provider gemini --models gemini-3.5-flash-lite,gemini-3.6-flash --mode contract --samples 10 --epochs 7 --max-output-tokens 256 --reasoning-effort none --max-calls 400 --gzip-jsonl --label publication-clean-gemini-enough
```

Regenerate figures and publication summaries:

```bash
npm run results:graphs
```

## Evidence Rule

Treat these results as probes of hidden operational boundaries, not model rankings. The raw calls in each experiment's `results/` directory are the durable evidence. Generated summaries and images are convenience views over those calls.
