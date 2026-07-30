# Prompt Threshold Map

Use this skill after a prompt-contract audit, or when reviewing a codebase, prompt set, agent workflow, product policy, or retrieval stack for the exact words, candidate context, and numeric thresholds that define a consequence-bearing model boundary.

## Goal

Turn vague prompt labels and nearby numeric gates into a small drift bench: exact label, product case, controlled consequence, candidate inputs or context snippets, expected outcomes, explicit threshold if one exists, implicit threshold if it does not, smallest drift test, and deterministic boundary candidate.

## Procedure

1. Search prompts, system messages, policy text, tool-routing instructions, schemas, validators, evals, search/ranking code, and agent workflows.
2. Extract exact judgment words or phrases, including labels such as `low`, `enough`, `high-confidence`, `clear`, `stable`, `private`, `ambiguous`, `explicit`, `safe`, `urgent`, `important`, `similar`, and `relevant`.
3. Search nearby code and configuration for numeric gates, enums, score bands, similarity cutoffs, approval flags, retention horizons, deletion modes, and classifier thresholds.
4. For each label, map the product case it controls. Prefer concrete cases such as memory write, context retrieval, deletion, publication, escalation, refusal, approval, spending, routing, or user-visible state.
5. Add a few representative cases before judging the boundary: one input or context item that should pass, one that should fail, and one ambiguous case when possible.
6. Distinguish explicit thresholds from implicit thresholds:
   - Explicit threshold: a number, enum, schema field, state transition, allowlist, or rule exists outside the model.
   - Implicit threshold: the model decides the boundary from wording alone.
7. Suggest the smallest confirmation test: hold the case constant and vary only one scalar, context note, prompt word, retrieved document, model version, evidence count, similarity score, or policy example.
8. Suggest a deterministic boundary only when the consequence is material. Prefer code, schemas, pinned thresholds, allowlists, state machines, validators, and audit logs.

## Output Format

Return a concise table or bullet list with these fields:

- Exact label or phrase
- Location
- Product case
- Controlled consequence
- Candidate cases or context
- Expected outcome
- Explicit threshold or implicit boundary
- Why it can drift
- Smallest confirmation test
- Possible deterministic boundary
- Confidence: low, medium, or high

## Review Rules

- Quote exact labels, not long private prompt passages.
- Do not publish private prompts or secrets in the output.
- Do not treat every adjective as a finding. Only include labels tied to a system action, durable state, external side effect, user-visible state, privacy, security, refusal, approval, routing, deletion, escalation, money, or publication.
- Include numeric thresholds even when they are already deterministic, because the map should show where product behavior actually changes.
- Mark thresholds as `explicit` when code owns them and `implicit` when model judgment owns them.
- Treat findings as a map for testing, not proof of a bug.
