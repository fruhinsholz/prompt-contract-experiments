# Experiment Workflow

## 1. Choose The Test Bed

Use `prompt-drift` when the variable is the governing contract. Use `prompt-thresholds` when the variable is an implicit scalar or sufficiency policy hidden inside a word such as `LOW` or `ENOUGH`.

## 2. Run A Dry Check

```bash
npm run check
```

This validates the command paths and regenerates figures without requiring provider credentials.

## 3. Run Live Calls

Keep provider keys in environment variables only. Do not commit `.env` files.

```bash
export OPENAI_API_KEY="..."
npm run thresholds:low -- --models gpt-4.1-mini,gpt-4.1 --samples 10 --epochs 10 --max 20000 --max-calls 1000 --gzip-jsonl --label <short-label>
```

## 4. Inspect The Run

Each run directory contains:

```text
metadata.json
fixture.json
system-prompt.txt
user-template.txt
calls.jsonl
calls.jsonl.gz
summary.csv
summary.md
threshold-bands.json
threshold-bands.md
analysis.md
```

The raw JSONL is the canonical result. For LOW threshold runs, `threshold-bands.*` is the compact interpretation: an estimated empirical band inside the tested range, not an exact threshold. Reports and figures must be generated from the raw records.

## 5. Regenerate Figures

```bash
npm run results:graphs
```

The price-versus-iteration figures are written to `images/results/price-vs-iteration/`.

## 6. Commit And Push

```bash
git status --short
git add .
git commit -m "Add <experiment> results"
git push
```

Committed raw results are the durable record. Blog prose should link to this repository or a specific commit, not become the source of truth or duplicate the graph set.
