# Workflow

This repo contains two article-grade experiments: [LOW Retrieved Context](../experiments/low-retrieved-context/) and [ENOUGH Evidence Sufficiency](../experiments/enough-evidence-sufficiency/). Keep the main path small: source code, prompt specs, latest clean result directories, generated figures, and the prompt-contract audit skill.

## Running

```bash
npm install
npm run check
```

Live provider runs need `OPENAI_API_KEY` or `GEMINI_API_KEY` in the environment. Do not commit secrets.

## Results

Each experiment stores its own clean runs under its local `results/` directory. A run directory contains raw `calls.jsonl`, metadata, exact prompts, fixture data, summaries, and threshold files. Raw calls are the evidence. Markdown, CSV, and SVG files are generated views over that evidence.

## Figures

Regenerate figures and publication summaries with:

```bash
npm run results:graphs
```

LOW figures are written to `images/results/price-vs-iteration/`. ENOUGH figures are written to `images/results/enough-thresholds/`.

## Citation

For article or appendix numbers, cite only the latest clean run directories listed in each experiment README. Do not mix in exploratory historical runs.
