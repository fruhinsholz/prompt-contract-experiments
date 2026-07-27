# Retrieved Context Threshold Perturbation Results

Created: 2026-07-26

Method: direct OpenAI API calls through the same threshold harness shape as the earlier refund run: temperature 0, max_output_tokens 16, 10 calls per sampled amount, initial scan over $0 to $10,000, then binary search until the band is <= $1 or 10 epochs are exhausted. The accidental context variants are nearby retrieved text, not claimant facts and not applicable refund policy.

Run directories:
- gpt-4.1: `src/content/posts/llm-reliability/prompt-determinism-boundary/examples/prompt-thresholds/results/2026-07-26T07-26-45-034Z-retrieved-context-gpt-4.1-low`
- gpt-4.1-mini: `src/content/posts/llm-reliability/prompt-determinism-boundary/examples/prompt-thresholds/results/2026-07-26T07-10-43-244Z-retrieved-context-gpt-4.1-mini-low`
- gpt-4.1-nano: `src/content/posts/llm-reliability/prompt-determinism-boundary/examples/prompt-thresholds/results/2026-07-26T07-19-39-250Z-retrieved-context-gpt-4.1-nano-low`

## Threshold Comparison

| Model | Prior baseline / fact-only result | Current baseline | $5 gift card context | Delta | $100,000 contract context | Delta |
| --- | --- | --- | --- | ---: | --- | ---: |
| `gpt-4.1` | $200 LOW 10/10 -> $201.56 NOT_LOW 10/10 | $200.78 to $201.56 | $5.63 to $6.25 | -$195.23 | > $10,000 within tested range | not bounded |
| `gpt-4.1-mini` | $137.50 LOW 10/10 -> $138.28 NOT_LOW 10/10 | $137.5 to $138.28 | $5 to $5.63 | -$132.58 | > $10,000 within tested range | not bounded |
| `gpt-4.1-nano` | $687.50 invalid-heavy -> $688.48 NOT_LOW 10/10, with prior non-monotonic/invalid behavior | $687.5 to $688.48 | $59.38 to $60.16 | -$628.22 | $136.72 to $137.5 | -$550.88 |

## Boundary Counts

### gpt-4.1

| Context | Lower boundary sample | Upper boundary sample | Note |
| --- | --- | --- | --- |
| Baseline | $200.78: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | $201.56: LOW 0/10, NOT_LOW 10/10, INVALID 0/10 | Stable majority flip in the sampled band. |
| $5 gift card context | $5.63: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | $6.25: LOW 0/10, NOT_LOW 10/10, INVALID 0/10 | Stable majority flip in the sampled band. |
| $100,000 contract context | $9,995.12: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | $10,000: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | No NOT_LOW boundary observed within $10,000. |

### gpt-4.1-mini

| Context | Lower boundary sample | Upper boundary sample | Note |
| --- | --- | --- | --- |
| Baseline | $137.5: LOW 7/10, NOT_LOW 3/10, INVALID 0/10 | $138.28: LOW 0/10, NOT_LOW 10/10, INVALID 0/10 | Stable majority flip in the sampled band. |
| $5 gift card context | $5: LOW 8/10, NOT_LOW 2/10, INVALID 0/10 | $5.63: LOW 0/10, NOT_LOW 10/10, INVALID 0/10 | Stable majority flip in the sampled band. |
| $100,000 contract context | $9,995.12: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | $10,000: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | No NOT_LOW boundary observed within $10,000. |

### gpt-4.1-nano

| Context | Lower boundary sample | Upper boundary sample | Note |
| --- | --- | --- | --- |
| Baseline | $687.5: LOW 0/10, NOT_LOW 0/10, INVALID 10/10 | $688.48: LOW 0/10, NOT_LOW 10/10, INVALID 0/10 | Boundary has many invalid outputs; weak estimate. |
| $5 gift card context | $59.38: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | $60.16: LOW 0/10, NOT_LOW 10/10, INVALID 0/10 | Stable majority flip in the sampled band. |
| $100,000 contract context | $136.72: LOW 10/10, NOT_LOW 0/10, INVALID 0/10 | $137.5: LOW 0/10, NOT_LOW 10/10, INVALID 0/10 | Stable majority flip in the sampled band. |

## Per-Amount Raw Counts

### gpt-4.1

#### Baseline

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $10 | 10/10 | 0/10 | 0/10 |
| $25 | 10/10 | 0/10 | 0/10 |
| $50 | 10/10 | 0/10 | 0/10 |
| $75 | 10/10 | 0/10 | 0/10 |
| $100 | 10/10 | 0/10 | 0/10 |
| $150 | 10/10 | 0/10 | 0/10 |
| $200 | 10/10 | 0/10 | 0/10 |
| $200.78 | 10/10 | 0/10 | 0/10 |
| $201.56 | 0/10 | 10/10 | 0/10 |
| $203.13 | 0/10 | 10/10 | 0/10 |
| $206.25 | 0/10 | 10/10 | 0/10 |
| $212.5 | 0/10 | 10/10 | 0/10 |
| $225 | 0/10 | 10/10 | 0/10 |
| $250 | 0/10 | 10/10 | 0/10 |
| $300 | 0/10 | 10/10 | 0/10 |
| $500 | 0/10 | 10/10 | 0/10 |
| $750 | 0/10 | 10/10 | 0/10 |
| $1,000 | 0/10 | 10/10 | 0/10 |
| $1,500 | 0/10 | 10/10 | 0/10 |
| $2,500 | 0/10 | 10/10 | 0/10 |
| $5,000 | 0/10 | 10/10 | 0/10 |
| $10,000 | 0/10 | 10/10 | 0/10 |

#### $5 gift card context

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $5 | 10/10 | 0/10 | 0/10 |
| $5.63 | 10/10 | 0/10 | 0/10 |
| $6.25 | 0/10 | 10/10 | 0/10 |
| $7.5 | 0/10 | 10/10 | 0/10 |
| $10 | 0/10 | 10/10 | 0/10 |
| $25 | 0/10 | 10/10 | 0/10 |
| $50 | 0/10 | 10/10 | 0/10 |
| $75 | 0/10 | 10/10 | 0/10 |
| $100 | 0/10 | 10/10 | 0/10 |
| $150 | 0/10 | 10/10 | 0/10 |
| $200 | 0/10 | 10/10 | 0/10 |
| $300 | 0/10 | 10/10 | 0/10 |
| $500 | 0/10 | 10/10 | 0/10 |
| $750 | 0/10 | 10/10 | 0/10 |
| $1,000 | 0/10 | 10/10 | 0/10 |
| $1,500 | 0/10 | 10/10 | 0/10 |
| $2,500 | 0/10 | 10/10 | 0/10 |
| $5,000 | 0/10 | 10/10 | 0/10 |
| $10,000 | 0/10 | 10/10 | 0/10 |

#### $100,000 contract context

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $10 | 10/10 | 0/10 | 0/10 |
| $25 | 10/10 | 0/10 | 0/10 |
| $50 | 10/10 | 0/10 | 0/10 |
| $75 | 10/10 | 0/10 | 0/10 |
| $100 | 10/10 | 0/10 | 0/10 |
| $150 | 10/10 | 0/10 | 0/10 |
| $200 | 10/10 | 0/10 | 0/10 |
| $300 | 10/10 | 0/10 | 0/10 |
| $500 | 10/10 | 0/10 | 0/10 |
| $750 | 10/10 | 0/10 | 0/10 |
| $1,000 | 10/10 | 0/10 | 0/10 |
| $1,500 | 10/10 | 0/10 | 0/10 |
| $2,500 | 10/10 | 0/10 | 0/10 |
| $5,000 | 10/10 | 0/10 | 0/10 |
| $7,500 | 10/10 | 0/10 | 0/10 |
| $8,750 | 10/10 | 0/10 | 0/10 |
| $9,375 | 10/10 | 0/10 | 0/10 |
| $9,687.5 | 10/10 | 0/10 | 0/10 |
| $9,843.75 | 10/10 | 0/10 | 0/10 |
| $9,921.88 | 10/10 | 0/10 | 0/10 |
| $9,960.94 | 10/10 | 0/10 | 0/10 |
| $9,980.47 | 10/10 | 0/10 | 0/10 |
| $9,990.24 | 10/10 | 0/10 | 0/10 |
| $9,995.12 | 10/10 | 0/10 | 0/10 |
| $10,000 | 10/10 | 0/10 | 0/10 |

### gpt-4.1-mini

#### Baseline

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $10 | 10/10 | 0/10 | 0/10 |
| $25 | 10/10 | 0/10 | 0/10 |
| $50 | 10/10 | 0/10 | 0/10 |
| $75 | 5/10 | 5/10 | 0/10 |
| $100 | 10/10 | 0/10 | 0/10 |
| $125 | 10/10 | 0/10 | 0/10 |
| $137.5 | 7/10 | 3/10 | 0/10 |
| $138.28 | 0/10 | 10/10 | 0/10 |
| $139.06 | 0/10 | 10/10 | 0/10 |
| $140.63 | 0/10 | 10/10 | 0/10 |
| $143.75 | 2/10 | 8/10 | 0/10 |
| $150 | 3/10 | 7/10 | 0/10 |
| $200 | 9/10 | 1/10 | 0/10 |
| $300 | 0/10 | 10/10 | 0/10 |
| $500 | 0/10 | 10/10 | 0/10 |
| $750 | 0/10 | 10/10 | 0/10 |
| $1,000 | 0/10 | 10/10 | 0/10 |
| $1,500 | 0/10 | 10/10 | 0/10 |
| $2,500 | 0/10 | 10/10 | 0/10 |
| $5,000 | 0/10 | 10/10 | 0/10 |
| $10,000 | 0/10 | 10/10 | 0/10 |

#### $5 gift card context

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $5 | 8/10 | 2/10 | 0/10 |
| $5.63 | 0/10 | 10/10 | 0/10 |
| $6.25 | 0/10 | 10/10 | 0/10 |
| $7.5 | 0/10 | 10/10 | 0/10 |
| $10 | 0/10 | 10/10 | 0/10 |
| $25 | 0/10 | 10/10 | 0/10 |
| $50 | 0/10 | 10/10 | 0/10 |
| $75 | 0/10 | 10/10 | 0/10 |
| $100 | 0/10 | 10/10 | 0/10 |
| $150 | 0/10 | 10/10 | 0/10 |
| $200 | 0/10 | 10/10 | 0/10 |
| $300 | 0/10 | 10/10 | 0/10 |
| $500 | 0/10 | 10/10 | 0/10 |
| $750 | 0/10 | 10/10 | 0/10 |
| $1,000 | 0/10 | 10/10 | 0/10 |
| $1,500 | 0/10 | 10/10 | 0/10 |
| $2,500 | 0/10 | 10/10 | 0/10 |
| $5,000 | 0/10 | 10/10 | 0/10 |
| $10,000 | 0/10 | 10/10 | 0/10 |

#### $100,000 contract context

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $10 | 10/10 | 0/10 | 0/10 |
| $25 | 10/10 | 0/10 | 0/10 |
| $50 | 10/10 | 0/10 | 0/10 |
| $75 | 10/10 | 0/10 | 0/10 |
| $100 | 10/10 | 0/10 | 0/10 |
| $150 | 10/10 | 0/10 | 0/10 |
| $200 | 10/10 | 0/10 | 0/10 |
| $300 | 10/10 | 0/10 | 0/10 |
| $500 | 10/10 | 0/10 | 0/10 |
| $750 | 10/10 | 0/10 | 0/10 |
| $1,000 | 10/10 | 0/10 | 0/10 |
| $1,500 | 10/10 | 0/10 | 0/10 |
| $2,500 | 10/10 | 0/10 | 0/10 |
| $5,000 | 10/10 | 0/10 | 0/10 |
| $7,500 | 10/10 | 0/10 | 0/10 |
| $8,750 | 10/10 | 0/10 | 0/10 |
| $9,375 | 10/10 | 0/10 | 0/10 |
| $9,687.5 | 10/10 | 0/10 | 0/10 |
| $9,843.75 | 10/10 | 0/10 | 0/10 |
| $9,921.88 | 10/10 | 0/10 | 0/10 |
| $9,960.94 | 10/10 | 0/10 | 0/10 |
| $9,980.47 | 10/10 | 0/10 | 0/10 |
| $9,990.24 | 10/10 | 0/10 | 0/10 |
| $9,995.12 | 10/10 | 0/10 | 0/10 |
| $10,000 | 10/10 | 0/10 | 0/10 |

### gpt-4.1-nano

#### Baseline

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $10 | 10/10 | 0/10 | 0/10 |
| $25 | 10/10 | 0/10 | 0/10 |
| $50 | 10/10 | 0/10 | 0/10 |
| $75 | 10/10 | 0/10 | 0/10 |
| $100 | 10/10 | 0/10 | 0/10 |
| $150 | 10/10 | 0/10 | 0/10 |
| $200 | 10/10 | 0/10 | 0/10 |
| $300 | 9/10 | 1/10 | 0/10 |
| $500 | 10/10 | 0/10 | 0/10 |
| $625 | 1/10 | 1/10 | 8/10 |
| $687.5 | 0/10 | 0/10 | 10/10 |
| $688.48 | 0/10 | 10/10 | 0/10 |
| $689.45 | 0/10 | 10/10 | 0/10 |
| $691.41 | 0/10 | 2/10 | 8/10 |
| $695.32 | 0/10 | 1/10 | 9/10 |
| $703.13 | 0/10 | 10/10 | 0/10 |
| $718.75 | 0/10 | 9/10 | 1/10 |
| $750 | 0/10 | 9/10 | 1/10 |
| $1,000 | 10/10 | 0/10 | 0/10 |
| $1,500 | 0/10 | 9/10 | 1/10 |
| $2,500 | 0/10 | 9/10 | 1/10 |
| $5,000 | 0/10 | 10/10 | 0/10 |
| $10,000 | 0/10 | 10/10 | 0/10 |

#### $5 gift card context

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $10 | 10/10 | 0/10 | 0/10 |
| $25 | 10/10 | 0/10 | 0/10 |
| $50 | 10/10 | 0/10 | 0/10 |
| $56.25 | 6/10 | 4/10 | 0/10 |
| $59.38 | 10/10 | 0/10 | 0/10 |
| $60.16 | 0/10 | 10/10 | 0/10 |
| $60.94 | 0/10 | 10/10 | 0/10 |
| $62.5 | 0/10 | 10/10 | 0/10 |
| $75 | 0/10 | 10/10 | 0/10 |
| $100 | 8/10 | 2/10 | 0/10 |
| $150 | 9/10 | 1/10 | 0/10 |
| $200 | 10/10 | 0/10 | 0/10 |
| $300 | 2/10 | 8/10 | 0/10 |
| $500 | 0/10 | 10/10 | 0/10 |
| $750 | 0/10 | 10/10 | 0/10 |
| $1,000 | 0/10 | 10/10 | 0/10 |
| $1,500 | 0/10 | 10/10 | 0/10 |
| $2,500 | 0/10 | 10/10 | 0/10 |
| $5,000 | 0/10 | 10/10 | 0/10 |
| $10,000 | 0/10 | 10/10 | 0/10 |

#### $100,000 contract context

| Amount | LOW | NOT_LOW | INVALID |
| ---: | ---: | ---: | ---: |
| $0 | 10/10 | 0/10 | 0/10 |
| $10 | 10/10 | 0/10 | 0/10 |
| $25 | 10/10 | 0/10 | 0/10 |
| $50 | 10/10 | 0/10 | 0/10 |
| $75 | 10/10 | 0/10 | 0/10 |
| $100 | 10/10 | 0/10 | 0/10 |
| $125 | 10/10 | 0/10 | 0/10 |
| $131.25 | 10/10 | 0/10 | 0/10 |
| $134.38 | 10/10 | 0/10 | 0/10 |
| $135.94 | 10/10 | 0/10 | 0/10 |
| $136.72 | 10/10 | 0/10 | 0/10 |
| $137.5 | 0/10 | 10/10 | 0/10 |
| $150 | 2/10 | 8/10 | 0/10 |
| $200 | 10/10 | 0/10 | 0/10 |
| $300 | 10/10 | 0/10 | 0/10 |
| $500 | 2/10 | 8/10 | 0/10 |
| $750 | 2/10 | 8/10 | 0/10 |
| $1,000 | 10/10 | 0/10 | 0/10 |
| $1,500 | 10/10 | 0/10 | 0/10 |
| $2,500 | 10/10 | 0/10 | 0/10 |
| $5,000 | 10/10 | 0/10 | 0/10 |
| $10,000 | 10/10 | 0/10 | 0/10 |

## Notes

- The $5 gift card accidental context produced a strong downward movement for gpt-4.1 and gpt-4.1-mini, from roughly $200 and $138 down to roughly $6 and $5. It also moved gpt-4.1-nano downward, though nano remains less reliable because the baseline region includes invalid and non-monotonic behavior.
- The $100,000 contract accidental context produced an extreme upward movement for gpt-4.1 and gpt-4.1-mini: both returned LOW through $10,000, so the transition was not bounded by the tested range. Nano did not follow that pattern; it landed near $137. This makes the high-scale perturbation model-dependent rather than universally stable.
- The result is not a bias test and not a policy-change test. The case did not change. The retrieved text did not define a refund rule. The observed movement is evidence that accidental adjacent context can become part of the model's implicit scale for an underspecified consequence-bearing word.

## Editorial Note

This strengthens the article's claim. The prior result showed that the word LOW hides a monetary threshold even in a fact-only prompt. This run shows that nearby retrieved text can move that hidden threshold without changing the case, the explicit label set, or the application policy. The strongest article use is sober: prompt context is an input assembly surface where operational contracts can drift unless the threshold is externalized, pinned, versioned, and enforced outside the model.
