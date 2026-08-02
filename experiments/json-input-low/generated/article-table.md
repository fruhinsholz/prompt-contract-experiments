<!-- generated:json-input-low-table manifest:experiments/json-input-low/manifest.json source_runs:publication_clean_control_gemini_36_flash_s100,publication_clean_gemini_36_flash_s100,publication_clean_control_openai_gpt56_s100,publication_clean_openai_gpt56_s100 hash:5ea55d2d38eace6cd6f11a505e2a99e360f842e8d14da6030e74c8088fd18b1d -->

Publication-clean LOW boundary probe. Counts are generated from fixed-grid `n=100` runs. The table compares the no-added-context control, the `$100k` retrieved-context condition, and deterministic runtime enforcement. It intentionally reports raw counts instead of fold multipliers.

Operational rule: `LOW iff refund_claim_amount_usd <= 100`.
Prompt format: `prose_same_block`.

## gemini-3.6-flash

| Amount | Expected | No-context LOW | No-context errors | $100k-context LOW | $100k-context errors | Runtime errors |
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

## gpt-5.6

| Amount | Expected | No-context LOW | No-context errors | $100k-context LOW | $100k-context errors | Runtime errors |
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

Caption: `No-context` is the same refund classifier without retrieved context. `$100k-context` adds a separate enterprise contract note. `Runtime errors` are derived by applying the code-owned rule to the same amount grid, not by making another model call. Generated from `experiments/json-input-low/manifest.json`.

<!-- /generated:json-input-low-table -->
