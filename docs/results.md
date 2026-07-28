# Results Index

Start with [docs/experiments.md](experiments.md) when you need the map from experiment purpose to input files, output files, summaries, and images.

## Prompt Drift

- `experiments/prompt-drift/results/2026-07-25T21-22-07-247Z-smoke-shell_quote_contract.jsonl`: dry-run smoke fixture for the shell quote contract scenario.

## Prompt Thresholds

- `experiments/prompt-thresholds/results/`: timestamped LOW and ENOUGH runs with raw JSONL, summaries, analysis files, and metadata.
- `experiments/prompt-thresholds/low-retrieved-context/`: guide for the article-grade `LOW` retrieved-context experiment.
- `experiments/prompt-thresholds/enough-evidence-sufficiency/`: guide for the article-grade `ENOUGH` evidence sufficiency experiment.
- `experiments/prompt-thresholds/retrieved-context-publication-clean-2026-07-28.md`: clean publication summary for the LOW retrieved-context article numbers. Use this instead of older exploratory runs when citing final article or appendix values.
- `experiments/prompt-thresholds/retrieved-context-publication-clean-2026-07-28.csv`: machine-readable version of the same clean publication summary.
- `experiments/prompt-thresholds/figures/`: compact SVG summaries for retrieved-context LOW threshold behavior.
- `images/results/price-vs-iteration/`: scatter plots generated from LOW raw calls.
- `docs/enough-thresholds.md`: generated index for ENOUGH threshold images.

## Reading The Graphs

For price-versus-iteration charts, the y-axis is refund amount in dollars and the x-axis is chronological iteration within each model/context/run. New LOW runs use bounded binary band search by default: the run samples `$0` and `$20,000`, then repeatedly samples midpoints. A clean run shows interval contraction. A divergent or unstable run keeps jumping or labels similar prices differently. Older runs may show an initial fixed grid scan followed by local binary refinement.
