# `low` Test Bed Spec

Input: a refund claim amount in USD.

System prompt:

```text
You are a classification component. Use only the facts in the case. Do not infer social, moral, or hardship considerations unless they are explicitly part of the case. Return only the requested label.
```

User prompt template:

```text
Case:
A customer submitted a refund claim for $X for a consumer purchase.

Classify the claim amount as exactly one label:
LOW
NOT_LOW

Return only the label.
```

Primary fixture: `fact_only`.

Optional retrieved-context perturbation fixtures:

- `gift_card_anchor`: prepends a separate product launch note saying a $5 gift card is offered to the first subscriber of a new policy.
- `enterprise_contract_anchor`: prepends a separate enterprise account note saying contracts above $100,000 require executive review during the seasonal sales period.

These fragments are not claimant facts and not refund policy. They represent plausible assembled context from RAG, memory, prior turns, or workflow state.

Default search: initial scan across `0..10000`, then binary search inside the first majority flip band.

Default deterministic replacement policy for analysis: `LOW iff amount_usd <= 100`.
