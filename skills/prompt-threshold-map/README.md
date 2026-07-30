# Prompt Threshold Map Skill

This is the practical follow-up to `prompt-contract-audit`.

The audit skill can find a hidden boundary in a prompt. This skill helps build a small test bench around that boundary so you can see what value moves, what consequence changes, and whether the value should be owned by runtime code, policy, config, or tests instead of by model judgment.

## The Core Test

Look for this shape:

```text
vague judgment + consequence-bearing action + missing deterministic representation
```

The important question is not whether a word is vague. The question is whether the word lets the model infer a value that the runtime later treats as authority.

Examples of values that can become unowned:

- how similar two items must be before one is called a duplicate
- how close a retrieved memory must be before it enters the prompt
- how much evidence is enough before a decision is allowed
- how stable a preference must be before it is saved
- how private a fact must be before it is blocked from memory
- how severe a case must be before it escalates

## What "Unowned Value" Means

An unowned value is a product value that affects behavior but is not pinned by code, config, schema, policy, tests, or a deterministic check.

If a prompt says:

```text
Include relevant context.
```

then `relevant` may hide a product value:

```text
How close must a context item be before it is injected into the model prompt?
```

If the system uses:

```text
inject context when vector_score >= 0.45
```

then the value is at least explicit. It can be reviewed, tested, changed in a pull request, and compared across model or embedding changes. The number may still be wrong, but the boundary is now visible.

## Runtime Versus Model Judgment

This skill is about the whole agentic system, not only the final language model.

In a retrieval or memory system, a backend may select context before the final model answers:

```text
user message -> retrieval/runtime -> selected context -> final prompt -> model answer
```

The final model does not necessarily know which candidate context was rejected. It only sees what the runtime injected. That selection can still shape the answer, tool call, memory write, refusal, routing decision, or user-visible claim.

So the audit question is:

```text
Who owns the boundary that decides what enters the prompt?
```

If the answer is only "the model decides what is relevant", the value is probably unowned. If the answer is "a documented threshold, enum, allowlist, state transition, or validator decides", the value is owned by the system.

## Concrete Retrieval Example

Suppose the user asks:

```text
Find where my internal prompts let the model influence a durable decision.
```

The runtime has candidate context items:

```text
A. Notes about hidden operational contracts, unowned values, and consequence-bearing judgment.
B. Notes about an unrelated blog editor UI.
C. Notes about influencer marketing and public figures.
D. Rules for memory capture: high-confidence, stable, non-sensitive facts may be saved.
```

Expected outcomes:

```text
A -> inject
B -> reject
C -> reject
D -> inject
```

If the runtime uses semantic scores, the bench may record:

```text
A score 0.61 -> inject
B score 0.39 -> reject
C score 0.44 -> reject when threshold is 0.45
D score 0.58 -> inject
```

Here the boundary is not "semantic vectors are risky". The boundary is:

```text
How close is close enough to inject context into the final prompt?
```

That value is consequence-bearing because injected context can change what the model says or does. A false positive can contaminate the answer. A false negative can remove essential context.

## Minimal Bench Format

Use a small table first. Avoid building a large eval suite before the boundary is clear.

```text
Label: relevant
Product case: memory or context retrieval
Consequence: context enters the final prompt
Candidate A: should inject
Candidate B: should reject
Candidate C: ambiguous
Explicit boundary: vector_score >= 0.45, if present
Implicit boundary: model or retriever decides "relevant" from wording alone
Drift test: keep the user request fixed, vary one candidate context item or model version
Failure mode: wrong context enters the prompt, or necessary context is missing
Deterministic boundary: documented threshold plus false-positive and false-negative tests
```

## How To Use It

1. Start with a finding from `prompt-contract-audit`.
2. Name the vague label exactly.
3. Name the action it controls.
4. Collect three cases: should pass, should fail, ambiguous.
5. Run the same request while varying only one factor: prompt word, candidate context, model version, score threshold, evidence count, or policy example.
6. Record what changes: injected context, classification, tool call, memory write, refusal, routing, ranking, escalation, or user-visible claim.
7. If the consequence matters, move the value into code, config, policy, schema, tests, or a state machine.

## Output Shape

```text
Exact label: relevant
Location: retrieval instruction or prompt assembly policy
Product case: context selection
Controlled consequence: selected context is injected into the final prompt
Candidate cases: A should inject, B should reject, C is ambiguous
Observed movement: C flips when threshold or prompt wording changes
Explicit threshold: vector_score >= 0.45, if present
Unowned value: relevance sufficient for prompt injection
Failure mode: context contamination or missing context
Suggested boundary: pinned threshold, typed retrieval source rules, and regression cases
Confidence: medium
```

## Keep Private Prompts Private

Quote exact labels and short instructions, not full private prompts. A useful public output can say:

```text
The label `relevant` controls context injection.
```

It does not need to publish the entire prompt stack.
