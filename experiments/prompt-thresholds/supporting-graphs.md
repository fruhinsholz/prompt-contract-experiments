# Prompt Threshold Supporting Graphs

These graphs are supporting artifacts for inspecting the experiments. They are not intended as article figures.

## Heatmap

- [Row-normalized LOW threshold estimates](figures/low-threshold-heatmap.svg)

Rows are cases or retrieved-context anchors. Columns are model agents. Color is normalized per row so horizontal comparison is meaningful inside a case; the numbers in cells are absolute estimated band midpoints.

## Latest Bands

| Case | Model | Estimated midpoint | Band | Width | Run |
| --- | --- | ---: | --- | ---: | --- |
| fact only | `gpt-4.1` | $166.01 | $156.25 to $175.78 | $19.53 | `2026-07-28T00-02-02-696Z-publication-clean-openai-low` |
| fact only | `gpt-4.1-mini` | $166.01 | $156.25 to $175.78 | $19.53 | `2026-07-28T00-02-02-696Z-publication-clean-openai-low` |
| fact only | `gemini-3.5-flash-lite` | $87.89 | $78.13 to $97.66 | $19.53 | `2026-07-28T00-13-22-919Z-publication-clean-gemini-low` |
| fact only | `gemini-3.6-flash` | $48.83 | $39.06 to $58.59 | $19.53 | `2026-07-28T00-13-22-919Z-publication-clean-gemini-low` |
| fact only | `sonnet` | failed | $0 to $20,000 | $20,000 | `2026-07-27T04-07-02-428Z-bounded-retrieved-claude-sonnet-20260726-low` |
| $5 gift card context | `gpt-4.1` | $9.77 | $0 to $19.53 | $19.53 | `2026-07-28T00-02-02-696Z-publication-clean-openai-low` |
| $5 gift card context | `gpt-4.1-mini` | $9.77 | $0 to $19.53 | $19.53 | `2026-07-28T00-02-02-696Z-publication-clean-openai-low` |
| $5 gift card context | `gemini-3.5-flash-lite` | $48.83 | $39.06 to $58.59 | $19.53 | `2026-07-28T00-13-22-919Z-publication-clean-gemini-low` |
| $5 gift card context | `gemini-3.6-flash` | $9.77 | $0 to $19.53 | $19.53 | `2026-07-28T00-13-22-919Z-publication-clean-gemini-low` |
| $5 gift card context | `sonnet` | failed | $0 to $20,000 | $20,000 | `2026-07-27T04-07-02-428Z-bounded-retrieved-claude-sonnet-20260726-low` |
| $100k contract context | `gpt-4.1` | unbracketed | $0 to $20,000 | $20,000 | `2026-07-28T00-02-02-696Z-publication-clean-openai-low` |
| $100k contract context | `gpt-4.1-mini` | unbracketed | $0 to $20,000 | $20,000 | `2026-07-28T00-02-02-696Z-publication-clean-openai-low` |
| $100k contract context | `gemini-3.5-flash-lite` | $10,595.7 | $10,585.94 to $10,605.47 | $19.53 | `2026-07-28T00-13-22-919Z-publication-clean-gemini-low` |
| $100k contract context | `gemini-3.6-flash` | unbracketed | $0 to $20,000 | $20,000 | `2026-07-28T00-13-22-919Z-publication-clean-gemini-low` |
| $100k contract context | `sonnet` | failed | $0 to $20,000 | $20,000 | `2026-07-27T04-07-02-428Z-bounded-retrieved-claude-sonnet-20260726-low` |
