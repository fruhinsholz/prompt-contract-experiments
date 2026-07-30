# Workflow

This repo contains two article-grade experiments: [LOW Retrieved Context](../experiments/low-retrieved-context/) and [ENOUGH Evidence Sufficiency](../experiments/enough-evidence-sufficiency/). Keep the main path small: source code, prompt specs, current clean result directories, generated figures, and the prompt-contract audit skill.

Use [docs/experiments.md](experiments.md) as the public evidence map. It lists the current clean run directories, the raw evidence files, figure indexes, reproduction paths, and limits.

## Running

```bash
npm install
npm run check
```

Live provider runs need `OPENAI_API_KEY` or `GEMINI_API_KEY` in the environment. Do not commit secrets.

## Results

Each experiment stores its clean runs under its local `results/` directory. A run directory contains raw `calls.jsonl`, metadata, exact prompts, fixture data, summaries, and threshold files. Raw calls are the evidence. Markdown, CSV, and SVG files are generated views over that evidence.

Current article citations should use only the run directories listed in [docs/experiments.md](experiments.md) and the experiment READMEs.

## Figures

Regenerate figures and publication summaries with:

```bash
npm run results:graphs
```

LOW figures are written to `images/results/price-vs-iteration/`. ENOUGH figures are written to `images/results/enough-thresholds/`.

## Citation

For article or appendix numbers, cite only the current clean result directories listed in [docs/experiments.md](experiments.md) and each experiment README. Do not mix in exploratory runs.
