# Gemini LOW Comparable Run - 2026-07-26

This run checks the `low` fixture outside the OpenAI API path with the same sampling depth used for the primary OpenAI confirmation runs. It is suitable as secondary cross-vendor evidence for the article, not as a model-quality benchmark.

## Command

```bash
npm run thresholds:low -- \
  --provider gemini \
  --models gemini-3.5-flash-lite,gemini-3.6-flash \
  --contexts all \
  --samples 10 \
  --epochs 10 \
  --max-output-tokens 256 \
  --reasoning-effort none \
  --max-calls 2000 \
  --label gemini-clean-low-20260726 \
  --gzip-jsonl
```

Result directory:

```text
src/content/posts/llm-reliability/prompt-determinism-boundary/examples/prompt-thresholds/results/2026-07-26T22-11-38-225Z-gemini-clean-low-20260726-low
```

## Run Quality

- Total completions: 1,340
- Invalid labels: 0
- Truncated outputs: 0
- API errors: 0
- Prompt tokens: 139,400
- Candidate output tokens: 3,064
- Thought tokens reported: 0
- Requested and response models matched for all rows.

## Observed Boundaries

| Model | Context | First majority NOT_LOW | First 10/10 NOT_LOW | Notes |
| --- | --- | ---: | ---: | --- |
| `gemini-3.5-flash-lite` | fact only | $80.47 | $300 | Noisy around the baseline edge. |
| `gemini-3.5-flash-lite` | $5 gift-card context | $10 | $25 | Context compressed the boundary sharply. |
| `gemini-3.5-flash-lite` | $100,000 contract-review context | none through $10,000 | none through $10,000 | Mostly stayed LOW; sparse high-amount NOT_LOW rows were non-monotone. |
| `gemini-3.6-flash` | fact only | $53.91 | $62.50 | Lower baseline than Flash-Lite. |
| `gemini-3.6-flash` | $5 gift-card context | $5.63 | $6.25 | Context compressed the boundary to the first few dollars. |
| `gemini-3.6-flash` | $100,000 contract-review context | $9,921.88 | $9,921.88 | Non-monotone: $9,921.88 was 10/10 NOT_LOW, but $10,000 was 10/10 LOW. |

## Editorial Use

The clean Gemini run supports the cross-vendor claim more strongly than the earlier smoke test: with comparable sampling, another provider path still produced different defensible boundaries for the underspecified label `LOW`, and retrieved context moved those boundaries.

Use it as secondary evidence. Do not present it as a vendor ranking or as proof that a specific Gemini threshold is stable. The important observation is that the consequence-bearing scalar was missing from the prompt, so provider-specific interpretation filled it in.
