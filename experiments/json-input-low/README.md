# JSON Input LOW

Private exploratory experiment for the Prompt Edits article work.

This test asks a narrow question: if the same `LOW` refund classifier receives retrieved context and case data in different prompt formats, does JSON reduce or remove the observed movement of the implicit dollar boundary?

The current script is intentionally narrow:

- one fixed amount grid,
- prose and JSON variants side by side,
- no adaptive binary search in this experiment,
- enough samples in the clean run to compare format behavior at identical amounts.

## Formats

- `prose_same_block`: the original style, where retrieved context and case prose sit close together.
- `prose_separated`: retrieved context, case data, and task separated by delimiters.
- `json_flat`: a simple JSON object with retrieved context and refund amount in separate fields.
- `json_typed`: nested JSON with explicit input roles and an output schema.
- `json_typed_boundary_rule`: JSON plus an explicit deterministic threshold policy.

The last variant is a control. If it still drifts, something is badly wrong. If it does not drift, that does not weaken the article thesis: an explicit external rule is the recommended boundary.

## Current Clean Readout

The current clean OpenAI run is [results/2026-07-31T15-06-21-856Z-clean-openai-gpt55-gpt56-fixed-grid-json-s30-json-input-low/](results/2026-07-31T15-06-21-856Z-clean-openai-gpt55-gpt56-fixed-grid-json-s30-json-input-low/).

We also tested the same case by separating the prompt and the retrieved context in untyped and typed JSON formats. The table includes the no-retrieved-context baseline because the movement only makes sense relative to that control.

| Model | Test | Format | No retrieved context | With retrieved context |
| --- | --- | --- | ---: | ---: |
| `gpt-5.5` | `$100k contract` | Prose same block | `$500` | `$20,000` |
| `gpt-5.5` | `$100k contract` | Prose separated | `$5,000` | `$20,000` |
| `gpt-5.5` | `$100k contract` | Raw JSON | `$1,000` | `$5,000` |
| `gpt-5.5` | `$100k contract` | Typed JSON | `$1,000` | `$20,000` |
| `gpt-5.5` | `$100k contract` | Typed JSON + pinned rule | `$100` | `$100` |
| `gpt-5.5` | `$5 gift card` | Prose same block | `$500` | `$100` |
| `gpt-5.5` | `$5 gift card` | Prose separated | `$5,000` | `$250` |
| `gpt-5.5` | `$5 gift card` | Raw JSON | `$1,000` | `$100` |
| `gpt-5.5` | `$5 gift card` | Typed JSON | `$1,000` | `$100` |
| `gpt-5.5` | `$5 gift card` | Typed JSON + pinned rule | `$100` | `$100` |
| `gpt-5.6` | `$100k contract` | Prose same block | `$500` | `$20,000` |
| `gpt-5.6` | `$100k contract` | Prose separated | `$500` | `$20,000` |
| `gpt-5.6` | `$100k contract` | Raw JSON | `$150` | `$20,000` |
| `gpt-5.6` | `$100k contract` | Typed JSON | `$500` | `$20,000` |
| `gpt-5.6` | `$100k contract` | Typed JSON + pinned rule | `$100` | `$100` |
| `gpt-5.6` | `$5 gift card` | Prose same block | `$500` | none |
| `gpt-5.6` | `$5 gift card` | Prose separated | `$500` | `$50` |
| `gpt-5.6` | `$5 gift card` | Raw JSON | `$150` | `$50` |
| `gpt-5.6` | `$5 gift card` | Typed JSON | `$500` | `$25` |
| `gpt-5.6` | `$5 gift card` | Typed JSON + pinned rule | `$100` | `$100` |

Caption: highest tested claim amount classified as `LOW` by majority vote on a fixed amount grid. "No retrieved context" is the same prompt format with the retrieved note absent. `none` means no tested amount had majority `LOW`, including `$25`. Raw JSON separates fields without typed structure. Typed JSON separates the retrieved note and case data into explicit typed objects. Typed JSON + pinned rule adds an explicit `$100` policy boundary to the payload. Full prompts, raw calls, and `P(LOW | amount)` tables are in the run directory.

The exact method name for this experiment is `fixed amount grid`. It is not an adaptive binary search. The clean run used `25,50,75,100,150,250,500,1000,5000,10000,20000`. These amounts came from the earlier threshold-search work as a practical probe grid around the expected `$100` boundary and the observed drift range, but this script itself does not do binary search.

## Conclusion

JSON changed the surface form of the prompt, but it did not remove the hidden-boundary problem. In the `$100k contract` case, raw JSON and typed JSON still let retrieved context move the implicit `LOW` boundary upward, often to the highest tested amount. In the `$5 gift card` case, the same mechanism can also move the boundary downward.

The important result is not that JSON confused the model. The retrieved context continued to influence the decision boundary whether the instruction was written as prose, raw JSON, or typed JSON. JSON made the input more structured and legible, but it did not isolate the policy value before inference.

The only OpenAI format that consistently restored the intended `$100` boundary was `json_typed_boundary_rule`, which explicitly pinned the policy value inside the payload. That is not evidence that JSON itself enforces control. It is evidence for the article recommendation: consequence-bearing thresholds should be explicit, versioned, and enforced outside ordinary model interpretation.

Do not read this probe as a model ranking. The useful claim is narrower: structured JSON input can make the prompt more legible, but legibility did not become control before the first inference.

## Concrete Input Example

These are the exact user prompt bodies generated for one comparable cell:

- context: `retrieved_100000_contract`
- amount: `$1,000`
- retrieved context: `A separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period.`

The system prompt is the same for every format:

```text
You are a classification component. Use only the facts in the case. Do not infer social, moral, or hardship considerations unless they are explicitly part of the case. Return only the requested label.
```

### `prose_same_block`

```text
Retrieved context:
A separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period.

Case:
A customer submitted a refund claim for $1,000 for a consumer purchase.

Classify the claim amount as exactly one label:
LOW
NOT_LOW

Return only the label.
```

### `prose_separated`

```text
Retrieved context:
A separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period.

---

Case data:
Refund claim amount: $1,000
Purchase type: consumer purchase

---

Task:
Classify the claim amount as exactly one label:
LOW
NOT_LOW

Return only the label.
```

### `json_flat`

```json
{
  "retrieved_context": "A separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period.",
  "refund_claim_amount_usd": 1000,
  "purchase_type": "consumer_purchase",
  "task": "Classify the claim amount as exactly one label: LOW or NOT_LOW. Return only the label."
}
```

### `json_typed`

```json
{
  "inputs": {
    "retrieved_context": {
      "kind": "separate_retrieved_note",
      "text": "A separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period."
    },
    "case": {
      "refund_claim_amount_usd": 1000,
      "purchase_type": "consumer_purchase"
    }
  },
  "output_schema": {
    "label": {
      "enum": [
        "LOW",
        "NOT_LOW"
      ]
    }
  },
  "instruction": "Classify only the case refund amount. Return only the label."
}
```

### `json_typed_boundary_rule`

```json
{
  "policy": {
    "decision_threshold_usd": 100,
    "rule": "LOW iff refund_claim_amount_usd <= decision_threshold_usd; otherwise NOT_LOW."
  },
  "inputs": {
    "retrieved_context": {
      "kind": "separate_retrieved_note",
      "text": "A separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period."
    },
    "case": {
      "refund_claim_amount_usd": 1000,
      "purchase_type": "consumer_purchase"
    }
  },
  "output_schema": {
    "label": {
      "enum": [
        "LOW",
        "NOT_LOW"
      ]
    }
  },
  "instruction": "Use only decision_threshold_usd as the approval boundary. Do not infer thresholds from retrieved_context."
}
```

## Run

```bash
npm run thresholds:low:json-input -- --provider openai --models gpt-5.5,gpt-5.6 --contexts all --formats all --amounts 25,50,75,100,150,250,500,1000,5000,10000,20000 --samples 30 --max-output-tokens 1024 --max-calls 11000 --concurrency 8 --gzip-jsonl --label clean-openai-gpt55-gpt56-fixed-grid-json-s30
```

For a first cheaper pass, use only the two most relevant contexts:

```bash
npm run thresholds:low:json-input -- --provider openai --models gpt-5.5,gpt-5.6 --contexts fact_only,retrieved_100000_contract --formats prose_same_block,json_typed_boundary_rule --amounts 100,200 --samples 1 --max-output-tokens 1024 --max-calls 50 --concurrency 4 --label micro-smoke-openai-gpt55-gpt56-json-max1024-s1
```

If API keys are not loaded but the local Claude CLI is authenticated:

```bash
npm run thresholds:low:json-input -- --provider claude-cli --models sonnet --contexts fact_only,retrieved_100000_contract --formats all --samples 2 --amounts 50,100,150,500,1000,5000,10000,20000 --max-output-tokens 128 --max-calls 250 --label exploratory-claude-json-vs-prose
```
