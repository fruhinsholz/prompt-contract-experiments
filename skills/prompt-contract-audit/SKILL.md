# Prompt Contract Audit

Use this skill when reviewing a codebase, prompt set, agent workflow, or product policy for hidden operational contracts delegated to model judgment.

## Goal

Find candidate places where a prompt, instruction, or agent workflow asks a model to decide a consequence-bearing boundary that should probably be externalized, pinned, versioned, tested, or enforced deterministically.

## Procedure

1. Search for prompts, system messages, policy text, tool-routing instructions, schemas, evals, and agent workflows.
2. Look for vague labels that can hide thresholds, sufficiency rules, safety boundaries, routing rules, permission rules, publication rules, deletion rules, or spending rules.
3. For each candidate, identify the consequence controlled by the label.
4. Separate candidates from confirmed bugs. Do not claim a defect unless there is direct behavioral evidence.
5. Suggest the smallest test that would expose drift: vary the scalar, count, context, retrieved note, model version, or policy wording while holding the actual case constant.
6. Suggest a deterministic replacement only when the consequence is material.

## Output Format

Return a concise review table or bullet list with these fields:

- Location
- Vague label or judgment
- Controlled consequence
- Why it might hide a contract
- Evidence observed
- Suggested confirmation test
- Possible deterministic boundary
- Confidence: low, medium, or high

## Review Rules

- Treat findings as candidates, not confirmed bugs.
- Do not penalize ordinary writing style where no system action depends on the model's interpretation.
- Prioritize boundaries that affect money, deletion, publication, privacy, security, escalation, refusal, approvals, user-visible state, or external side effects.
- Prefer concrete tests over broad recommendations.
- Prefer code, schemas, policy files, allowlists, thresholds, and state machines for consequence-bearing boundaries.
