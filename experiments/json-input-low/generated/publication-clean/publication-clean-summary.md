# Publication-Clean LOW Boundary Probe

This artifact compares model-owned classification with runtime-owned enforcement on the same fixed amount grid. The runtime-enforced condition is deterministic and derived from the same cases; it does not spend additional model calls.

Threshold: LOW iff refund_claim_amount_usd <= $100.
Context: retrieved_100000_contract.
Prompt format: prose_same_block.

## gemini-3.6-flash

| Amount | Prompt LOW | Prompt errors | Prompt error rate | Runtime errors |
| ---: | ---: | ---: | ---: | ---: |
| $0 | 100/100 | 0/100 | 0.0% | 0/100 |
| $5 | 100/100 | 0/100 | 0.0% | 0/100 |
| $25 | 100/100 | 0/100 | 0.0% | 0/100 |
| $49 | 100/100 | 0/100 | 0.0% | 0/100 |
| $50 | 100/100 | 0/100 | 0.0% | 0/100 |
| $51 | 100/100 | 0/100 | 0.0% | 0/100 |
| $75 | 100/100 | 0/100 | 0.0% | 0/100 |
| $100 | 100/100 | 0/100 | 0.0% | 0/100 |
| $101 | 98/100 | 98/100 | 98.0% | 0/100 |
| $150 | 100/100 | 100/100 | 100.0% | 0/100 |
| $250 | 100/100 | 100/100 | 100.0% | 0/100 |
| $500 | 100/100 | 100/100 | 100.0% | 0/100 |
| $1,000 | 100/100 | 100/100 | 100.0% | 0/100 |

## gpt-5.6

| Amount | Prompt LOW | Prompt errors | Prompt error rate | Runtime errors |
| ---: | ---: | ---: | ---: | ---: |
| $0 | 100/100 | 0/100 | 0.0% | 0/100 |
| $5 | 100/100 | 0/100 | 0.0% | 0/100 |
| $25 | 100/100 | 0/100 | 0.0% | 0/100 |
| $49 | 100/100 | 0/100 | 0.0% | 0/100 |
| $50 | 100/100 | 0/100 | 0.0% | 0/100 |
| $51 | 98/100 | 2/100 | 2.0% | 0/100 |
| $75 | 100/100 | 0/100 | 0.0% | 0/100 |
| $100 | 100/100 | 0/100 | 0.0% | 0/100 |
| $101 | 90/100 | 90/100 | 90.0% | 0/100 |
| $150 | 100/100 | 100/100 | 100.0% | 0/100 |
| $250 | 100/100 | 100/100 | 100.0% | 0/100 |
| $500 | 100/100 | 100/100 | 100.0% | 0/100 |
| $1,000 | 99/100 | 99/100 | 99.0% | 0/100 |

## Method

- The model receives the normal prose prompt and the retrieved $100,000 contract context.
- The expected operational rule is evaluated independently as `LOW iff amount <= 100`.
- The runtime-enforced condition represents code-owned enforcement over the same amount values, not a second LLM condition.
- The intended article claim is not a model ranking; it is that a consequence-bearing threshold should be owned by runtime code rather than prompt interpretation.

## Provenance

- experiments/json-input-low/results/2026-08-02T17-21-15-563Z-publication-clean-openai-gpt56-s100-json-input-low/metadata.json sha256=bee93bd39e39d232c56c871c6af542a01daefb5ef59922aff0770e5ba5794fda
- experiments/json-input-low/results/2026-08-02T17-21-15-563Z-publication-clean-openai-gpt56-s100-json-input-low/summary.csv sha256=d047bb3b230c3bdf8d4c74f08ca6f48393d1a13fe36bf47e656bb9628e1bf63a
- experiments/json-input-low/results/2026-08-02T17-21-15-563Z-publication-clean-openai-gpt56-s100-json-input-low/calls.jsonl sha256=e22e3b20c570e9a36aad9b96df3f08e4766853ba21cc699d4e8ddd20875addc3
- experiments/json-input-low/results/2026-08-02T17-24-22-436Z-publication-clean-gemini-36-flash-s100-json-input-low/metadata.json sha256=b6434e7c0d77e7e01712b5896ff8d6c9a8ed282d25696cce6c161fe34ac0f2e8
- experiments/json-input-low/results/2026-08-02T17-24-22-436Z-publication-clean-gemini-36-flash-s100-json-input-low/summary.csv sha256=0d93a90ffe2bcdd52600af01be83b1c927f3c2378dcb4aebde9fb2baa20259f9
- experiments/json-input-low/results/2026-08-02T17-24-22-436Z-publication-clean-gemini-36-flash-s100-json-input-low/calls.jsonl sha256=b163c86a8edc0b3b5c248210ba1c4ae19f19aebd2b7c6f7f11f892afd4e1864c
