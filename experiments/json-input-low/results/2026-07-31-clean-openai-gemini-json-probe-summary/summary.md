# Clean JSON Probe Summary

Private supplementary probe for Prompt Edits. This summary consolidates the OpenAI and Gemini JSON-format runs without changing the blog article.

## Runs

| Run | Provider | Model | Context test | Contexts | Formats | Amounts | Samples/cell | Calls |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| `gemini_100k_s30` | Gemini | `gemini-3.5-flash-lite` | $100k | 2 | 4 | 9 | 30 | 2160 |
| `openai_100k_s30` | OpenAI | `gpt-4.1-mini` | $100k | 2 | 4 | 9 | 30 | 2160 |
| `gemini_5_s10` | Gemini | `gemini-3.5-flash-lite` | $5 | 2 | 4 | 9 | 10 | 720 |
| `openai_5_s10` | OpenAI | `gpt-4.1-mini` | $5 | 2 | 4 | 9 | 10 | 720 |

## Highest Tested Claim With Majority LOW

| Provider | Context test | Format | Baseline none | With retrieved context |
| --- | --- | --- | ---: | ---: |
| Gemini | $100k | `prose_same_block` | $100 | $10,000 |
| Gemini | $100k | `json_flat` | $500 | $20,000 |
| Gemini | $100k | `json_typed` | $20,000 | $20,000 |
| Gemini | $100k | `json_typed_boundary_rule` | $100 | $20,000 |
| OpenAI | $100k | `prose_same_block` | $100 | $20,000 |
| OpenAI | $100k | `json_flat` | $500 | $20,000 |
| OpenAI | $100k | `json_typed` | $500 | $20,000 |
| OpenAI | $100k | `json_typed_boundary_rule` | $100 | $100 |
| Gemini | $5 | `prose_same_block` | $150 | $5 |
| Gemini | $5 | `json_flat` | $500 | $5 |
| Gemini | $5 | `json_typed` | $20,000 | $5 |
| Gemini | $5 | `json_typed_boundary_rule` | $100 | $100 |
| OpenAI | $5 | `prose_same_block` | $100 | $5 |
| OpenAI | $5 | `json_flat` | $1,000 | $5 |
| OpenAI | $5 | `json_typed` | $500 | $50 |
| OpenAI | $5 | `json_typed_boundary_rule` | $100 | $100 |

## P(LOW | amount), $100k Context

### Gemini

| Format | $5 | $50 | $100 | $150 | $500 | $1k | $5k | $10k | $20k |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `prose_same_block` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 25/30 (83.3%) | 30/30 (100.0%) | 30/30 (100.0%) | 1/30 (3.3%) |
| `json_flat` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) |
| `json_typed` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) |
| `json_typed_boundary_rule` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 30/30 (100.0%) |

### OpenAI

| Format | $5 | $50 | $100 | $150 | $500 | $1k | $5k | $10k | $20k |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `prose_same_block` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) |
| `json_flat` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) |
| `json_typed` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) |
| `json_typed_boundary_rule` | 30/30 (100.0%) | 30/30 (100.0%) | 30/30 (100.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 0/30 (0.0%) | 0/30 (0.0%) |

## P(LOW | amount), $5 Context

### Gemini

| Format | $5 | $50 | $100 | $150 | $500 | $1k | $5k | $10k | $20k |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `prose_same_block` | 10/10 (100.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |
| `json_flat` | 10/10 (100.0%) | 1/10 (10.0%) | 3/10 (30.0%) | 5/10 (50.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |
| `json_typed` | 10/10 (100.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |
| `json_typed_boundary_rule` | 10/10 (100.0%) | 10/10 (100.0%) | 10/10 (100.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |

### OpenAI

| Format | $5 | $50 | $100 | $150 | $500 | $1k | $5k | $10k | $20k |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `prose_same_block` | 10/10 (100.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |
| `json_flat` | 10/10 (100.0%) | 1/10 (10.0%) | 0/10 (0.0%) | 1/10 (10.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |
| `json_typed` | 10/10 (100.0%) | 8/10 (80.0%) | 2/10 (20.0%) | 4/10 (40.0%) | 4/10 (40.0%) | 1/10 (10.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |
| `json_typed_boundary_rule` | 10/10 (100.0%) | 10/10 (100.0%) | 10/10 (100.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) | 0/10 (0.0%) |

## Data Notes

- Total calls: 5,760.
- Gemini had 3 transient API 503 errors across 2,880 calls; these remain in raw data and summaries as invalid/error rows rather than being rewritten.
- Some JSON-format prompts returned JSON objects such as `{ "label": "LOW" }`; the existing harness records those as `strictLabel=INVALID` but extracts the loose label for the aggregate `LOW` / `NOT_LOW` counts.

## Article Candidate

Short version to consider for the article if we decide to use this probe:

> We also tested the same cases as flat JSON and typed JSON. The result was not that JSON was useless. It was that JSON was not an enforcement boundary. The model still interpreted the fields together.

| Input shape | OpenAI $100k result | Gemini $100k result | Readout |
| --- | ---: | ---: | --- |
| Prose | $20,000 | $10,000 | The implicit boundary still moves under retrieved context. |
| JSON flat | $20,000 | $20,000 | The implicit boundary still moves under retrieved context. |
| JSON typed | $20,000 | $20,000 | The implicit boundary still moves under retrieved context. |
| JSON typed + boundary rule | $100 | $20,000 | Explicit rule stabilizes OpenAI; Gemini shows a non-monotone anomaly at $20k. |

## Interpretation

- The $100k context is the article-relevant test: prose, flat JSON, and typed JSON still classify high claim amounts as LOW.
- The $5 context is a smaller check in the opposite direction: the implicit boundary can move down as well as up.
- Structured input changes presentation and sometimes the shape of the failure, but it does not enforce the boundary.
- The strongest article claim remains: externalize, version, and enforce consequence-bearing boundaries outside model judgment.
