# Retrieved Context Threshold Test Prompt

Run the retrieved-context threshold perturbation tests for the `Prompt Edits Are Architecture Changes` article.

Goal: measure whether accidental retrieved context, not a claimant fact and not an applicable policy instruction, shifts the implicit threshold at which the model classifies a refund amount as `LOW` vs `NOT_LOW`.

Use the same harness and empirical method as the previous threshold test:

- Same model set as the previous threshold run.
- Same API parameters as the previous threshold run.
- Same baseline prompt as the previous threshold run.
- Binary search / dichotomy over dollar amounts.
- 10 runs per sampled amount.
- Return only the model label in each model call.
- Estimate the transition region for each prompt variant.
- Compare each variant to the existing baseline/fact-only threshold results.
- Preserve raw run outputs and summary tables in the article's canonical examples/sources structure.

Important narrative constraint: this is not a bias test and not a test of a new business policy. Treat `Retrieved context:` as a plausible artifact of modern systems where memory, RAG, prior turns, or assembled workflow context can add nearby text that the application does not fully control. The extra text must be plausible and adjacent, but it must not state a rule for the refund decision and must not describe the claimant.

Suggested command from the article root:

```bash
cd src/content/posts/llm-reliability/prompt-determinism-boundary/examples/prompt-thresholds
npm run thresholds:low -- --models gpt-4.1-mini,gpt-4.1 --contexts gift_card_anchor,enterprise_contract_anchor --samples 10 --epochs 10 --max-calls 1000
```

Baseline prompt:

```text
Case:
A customer submitted a refund claim for $X for a consumer purchase.

Classify the claim amount as exactly one label:
LOW
NOT_LOW

Return only the label.
```

Variant 1, low anchor accidental context:

```text
Retrieved context:
A separate product launch note says that a $5 gift card is offered to the first subscriber of a new policy.

Case:
A customer submitted a refund claim for $X for a consumer purchase.

Classify the claim amount as exactly one label:
LOW
NOT_LOW

Return only the label.
```

Variant 2, high scale accidental context:

```text
Retrieved context:
A separate enterprise account note says that contracts above $100,000 require executive review during the seasonal sales period.

Case:
A customer submitted a refund claim for $X for a consumer purchase.

Classify the claim amount as exactly one label:
LOW
NOT_LOW

Return only the label.
```

Expected output:

1. A concise table with baseline threshold, `$5 gift card` context threshold, `$100,000 contract` context threshold, and deltas.
2. Raw per-amount counts such as `LOW 7/10`, `NOT_LOW 3/10`.
3. Notes on whether the perturbation appears stable, weak, absent, or model-dependent.
4. A short editorial note explaining whether the result strengthens the article's claim that prompt context can hide an operational contract drift risk.

Do not optimize the prompt to maximize movement. The point is to test whether plausible accidental context moves the boundary under the same minimal classifier prompt.
