# JSON Input LOW

Private exploratory experiment for the Prompt Edits article work.

This test asks a narrow question: if the same `LOW` refund classifier receives retrieved context and case data in different prompt formats, does JSON reduce or remove the observed movement of the implicit dollar boundary?

The current script is intentionally small:

- one fixed amount grid,
- a small sample count by default,
- prose and JSON variants side by side,
- no article-facing claim until a larger run validates the pattern.

## Formats

- `prose_same_block`: the original style, where retrieved context and case prose sit close together.
- `prose_separated`: retrieved context, case data, and task separated by delimiters.
- `json_flat`: a simple JSON object with retrieved context and refund amount in separate fields.
- `json_typed`: nested JSON with explicit input roles and an output schema.
- `json_typed_boundary_rule`: JSON plus an explicit deterministic threshold policy.

The last variant is a control. If it still drifts, something is badly wrong. If it does not drift, that does not weaken the article thesis: an explicit external rule is the recommended boundary.

## Current Clean Readout

Clean OpenAI and Gemini runs are consolidated in [results/2026-07-31-clean-openai-gemini-json-probe-summary/summary.md](results/2026-07-31-clean-openai-gemini-json-probe-summary/summary.md).

We also tested the same case by separating the prompt and the retrieved context in untyped and typed JSON formats. The model still interpreted the fields together.

| Model | Test | Prose | Raw JSON | Typed JSON | Typed JSON + enforcement |
| --- | --- | ---: | ---: | ---: | ---: |
| `gpt-4.1-mini` | `$100k contract` | `$20,000` | `$20,000` | `$20,000` | `$100` |
| `gemini-3.5-flash-lite` | `$100k contract` | `$10,000` | `$20,000` | `$20,000` | `$20,000` anomaly |
| `gpt-4.1-mini` | `$5 gift card` | `$5` | `$5` | `$50` | `$100` |
| `gemini-3.5-flash-lite` | `$5 gift card` | `$5` | `$5` | `$5` | `$100` |

Caption: highest tested claim amount classified as `LOW` by majority vote. Raw JSON separates fields without typed structure. Typed JSON separates the retrieved note and case data into explicit typed objects. Typed JSON + enforcement adds an explicit `$100` policy boundary to the payload. Full prompts, raw calls, and `P(LOW | amount)` tables are in the clean summary.

## Run

```bash
npm run thresholds:low:json-input -- --provider gemini --models gemini-3.5-flash-lite --contexts all --formats all --samples 3 --reasoning-effort none --max-output-tokens 128 --max-calls 1000 --gzip-jsonl --label exploratory-gemini
```

For a first cheaper pass, use only the two most relevant contexts:

```bash
npm run thresholds:low:json-input -- --provider gemini --models gemini-3.5-flash-lite --contexts fact_only,retrieved_100000_contract --formats prose_same_block,json_flat,json_typed,json_typed_boundary_rule --samples 2 --reasoning-effort none --max-output-tokens 128 --max-calls 300 --label smoke-gemini
```

If API keys are not loaded but the local Claude CLI is authenticated:

```bash
npm run thresholds:low:json-input -- --provider claude-cli --models sonnet --contexts fact_only,retrieved_100000_contract --formats all --samples 2 --amounts 50,100,150,500,1000,5000,10000,20000 --max-output-tokens 128 --max-calls 250 --label exploratory-claude-json-vs-prose
```
