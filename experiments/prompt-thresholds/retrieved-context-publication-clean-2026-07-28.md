# Retrieved Context Publication Clean Results

Created from the clean publication runs only. Older exploratory and method-comparison runs remain in the repository, but should not be cited for article numbers unless explicitly labeled as historical context.

Method: bounded probability band search over `$0..$20,000`, 10 samples per search point, 30 samples at final band endpoints, target boundary `P(LOW) = 50%`. The reported value is an empirical transition band, not an exact threshold.

## Runs

- `2026-07-28T00-02-02-696Z-publication-clean-openai-low`: provider `openai`, 760 calls, commit `d6a77c0`.
- `2026-07-28T00-13-22-919Z-publication-clean-gemini-low`: provider `gemini`, 860 calls, commit `d6a77c0`.

## Threshold Bands

| Context | Model | Provider | Estimated band | Midpoint | Lower P(LOW) | Upper P(LOW) | Width | Note |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Fact only | `gpt-4.1` | `openai` | $156.25 to $175.78 | $166.02 | 70.0% | 26.7% | $19.53 | Estimated probability band. |
| Fact only | `gpt-4.1-mini` | `openai` | $156.25 to $175.78 | $166.02 | 53.3% | 3.3% | $19.53 | Estimated probability band. |
| Fact only | `gemini-3.5-flash-lite` | `gemini` | $78.13 to $97.66 | $87.9 | 80.0% | 23.3% | $19.53 | Estimated probability band. |
| Fact only | `gemini-3.6-flash` | `gemini` | $39.06 to $58.59 | $48.83 | 90.0% | 30.0% | $19.53 | Estimated probability band. |
| $5 gift card context | `gpt-4.1` | `openai` | $0 to $19.53 | $9.77 | 100.0% | 50.0% | $19.53 | Estimated probability band. |
| $5 gift card context | `gpt-4.1-mini` | `openai` | $0 to $19.53 | $9.77 | 100.0% | 13.3% | $19.53 | Estimated probability band. |
| $5 gift card context | `gemini-3.5-flash-lite` | `gemini` | $39.06 to $58.59 | $48.83 | 63.3% | 0.0% | $19.53 | Estimated probability band. |
| $5 gift card context | `gemini-3.6-flash` | `gemini` | $0 to $19.53 | $9.77 | 100.0% | 0.0% | $19.53 | Estimated probability band. |
| $100k contract context | `gpt-4.1` | `openai` | >$20,000 in tested range |  | 100.0% | 100.0% | $20,000 | No crossing inside tested range. |
| $100k contract context | `gpt-4.1-mini` | `openai` | >$20,000 in tested range |  | 100.0% | 100.0% | $20,000 | No crossing inside tested range. |
| $100k contract context | `gemini-3.5-flash-lite` | `gemini` | $10,585.94 to $10,605.47 | $10,595.71 | 83.3% | 33.3% | $19.53 | Estimated probability band. |
| $100k contract context | `gemini-3.6-flash` | `gemini` | >$20,000 in tested range |  | 100.0% | 73.3% | $20,000 | No crossing inside tested range. |

## Article Use

Use this table for article or appendix numbers. Do not mix it with the old scan/refinement runs when stating final values.
