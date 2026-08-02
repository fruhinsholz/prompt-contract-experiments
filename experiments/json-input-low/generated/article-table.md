<!-- generated:json-input-low-table manifest:experiments/json-input-low/manifest.json source_runs:publication_clean_gift_card_gemini_36_flash_s100,publication_clean_gift_card_openai_gpt56_s100,publication_clean_control_gemini_36_flash_s100,publication_clean_control_openai_gpt56_s100,publication_clean_gemini_36_flash_s100,publication_clean_openai_gpt56_s100 hash:dae2dbd77e2140f2f8dfd21c4bd5fc60f5e12cc781da18415e2fc403b1aebc42 -->

Publication-clean LOW boundary probe. Counts are generated from fixed-grid `n=100` runs. The table compares prompt-only classification under retrieved context with deterministic runtime enforcement. It intentionally reports raw counts instead of fold multipliers.

Operational rule: `LOW iff refund_claim_amount_usd <= 100`.
Default prompt format: `prose_same_block`.

## $5 gift-card context - explicit $100 JSON rule

### gemini-3.6-flash - Typed JSON with explicit $100 rule

| Amount | Expected | Control LOW | Control errors | Context LOW | Context errors | Runtime errors |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| $0 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $5 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $25 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $49 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $50 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $51 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $75 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $100 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $101 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $150 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $250 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $500 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $1,000 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |

### gpt-5.6 - Typed JSON with explicit $100 rule

| Amount | Expected | Control LOW | Control errors | Context LOW | Context errors | Runtime errors |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| $0 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $5 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $25 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $49 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $50 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $51 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $75 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $100 | `LOW` | n/a | n/a | 100/100 | 0/100 (0.0%) | 0/100 |
| $101 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $150 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $250 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $500 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |
| $1,000 | `NOT_LOW` | n/a | n/a | 0/100 | 0/100 (0.0%) | 0/100 |

## $5 gift-card context - prose classifier

### gemini-3.6-flash - Prose prompt

| Amount | Expected | Control LOW | Control errors | Context LOW | Context errors | Runtime errors |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| $0 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $5 | `LOW` | 100/100 | 0/100 (0.0%) | 90/100 | 10/100 (10.0%) | 0/100 |
| $25 | `LOW` | 100/100 | 0/100 (0.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $49 | `LOW` | 100/100 | 0/100 (0.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $50 | `LOW` | 100/100 | 0/100 (0.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $51 | `LOW` | 1/100 | 99/100 (99.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $75 | `LOW` | 100/100 | 0/100 (0.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $100 | `LOW` | 93/100 | 7/100 (7.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $101 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $150 | `NOT_LOW` | 28/100 | 28/100 (28.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $250 | `NOT_LOW` | 7/100 | 8/100 (8.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $500 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $1,000 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 0/100 | 0/100 (0.0%) | 0/100 |

### gpt-5.6 - Prose prompt

| Amount | Expected | Control LOW | Control errors | Context LOW | Context errors | Runtime errors |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| $0 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $5 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $25 | `LOW` | 100/100 | 0/100 (0.0%) | 1/100 | 99/100 (99.0%) | 0/100 |
| $49 | `LOW` | 100/100 | 0/100 (0.0%) | 2/100 | 98/100 (98.0%) | 0/100 |
| $50 | `LOW` | 100/100 | 0/100 (0.0%) | 1/100 | 99/100 (99.0%) | 0/100 |
| $51 | `LOW` | 3/100 | 97/100 (97.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $75 | `LOW` | 100/100 | 0/100 (0.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $100 | `LOW` | 99/100 | 1/100 (1.0%) | 0/100 | 100/100 (100.0%) | 0/100 |
| $101 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $150 | `NOT_LOW` | 80/100 | 80/100 (80.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $250 | `NOT_LOW` | 91/100 | 91/100 (91.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $500 | `NOT_LOW` | 40/100 | 40/100 (40.0%) | 0/100 | 0/100 (0.0%) | 0/100 |
| $1,000 | `NOT_LOW` | 14/100 | 14/100 (14.0%) | 0/100 | 0/100 (0.0%) | 0/100 |

## $100k retrieved context - prose classifier

### gemini-3.6-flash - Prose prompt

| Amount | Expected | Control LOW | Control errors | Context LOW | Context errors | Runtime errors |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| $0 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $5 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $25 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $49 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $50 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $51 | `LOW` | 1/100 | 99/100 (99.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $75 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $100 | `LOW` | 93/100 | 7/100 (7.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $101 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 98/100 | 98/100 (98.0%) | 0/100 |
| $150 | `NOT_LOW` | 28/100 | 28/100 (28.0%) | 100/100 | 100/100 (100.0%) | 0/100 |
| $250 | `NOT_LOW` | 7/100 | 8/100 (8.0%) | 100/100 | 100/100 (100.0%) | 0/100 |
| $500 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 100/100 | 100/100 (100.0%) | 0/100 |
| $1,000 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 100/100 | 100/100 (100.0%) | 0/100 |

### gpt-5.6 - Prose prompt

| Amount | Expected | Control LOW | Control errors | Context LOW | Context errors | Runtime errors |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| $0 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $5 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $25 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $49 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $50 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $51 | `LOW` | 3/100 | 97/100 (97.0%) | 98/100 | 2/100 (2.0%) | 0/100 |
| $75 | `LOW` | 100/100 | 0/100 (0.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $100 | `LOW` | 99/100 | 1/100 (1.0%) | 100/100 | 0/100 (0.0%) | 0/100 |
| $101 | `NOT_LOW` | 0/100 | 0/100 (0.0%) | 90/100 | 90/100 (90.0%) | 0/100 |
| $150 | `NOT_LOW` | 80/100 | 80/100 (80.0%) | 100/100 | 100/100 (100.0%) | 0/100 |
| $250 | `NOT_LOW` | 91/100 | 91/100 (91.0%) | 100/100 | 100/100 (100.0%) | 0/100 |
| $500 | `NOT_LOW` | 40/100 | 40/100 (40.0%) | 100/100 | 100/100 (100.0%) | 0/100 |
| $1,000 | `NOT_LOW` | 14/100 | 14/100 (14.0%) | 99/100 | 99/100 (99.0%) | 0/100 |

Caption: `Control` is the matched no-added-context run when available. `Context` is the retrieved-context condition named by the section. `Runtime errors` are derived by applying the code-owned rule to the same amount grid, not by making another model call. Generated from `experiments/json-input-low/manifest.json`.

<!-- /generated:json-input-low-table -->
