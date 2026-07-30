# Prompt Contract Audit Skill

This folder contains a reusable skill for finding possible hidden operational contracts in prompts and agent code. It is meant to help you discover candidates for review, not to prove bugs automatically.

## What It Looks For

The skill looks for places where model judgment may control a consequence-bearing boundary through vague language, such as:

- thresholds: `low`, `large`, `too expensive`, `urgent`
- sufficiency labels: `enough`, `adequate`, `ready`, `complete`
- safety or permission labels: `safe`, `allowed`, `sensitive`, `private`
- escalation or routing labels: `needs review`, `important`, `high risk`

## How To Run It

Use the skill instructions in [SKILL.md](SKILL.md) with your agent or copy the checklist into a code-review workflow. Point it at a repository and ask for prompt-contract candidates.

Example request:

```text
Use the prompt-contract-audit skill on this repository. Find places where a prompt or agent instruction may hide a threshold, sufficiency rule, safety boundary, routing rule, or spending boundary. Return candidates only, with evidence and suggested tests.
```

## What You Get

The expected output is a review list. Each candidate should include:

- file and line reference
- the vague label or judgment being delegated
- the consequence controlled by that judgment
- why it might be a hidden contract
- a deterministic replacement shape, if one is appropriate
- a small experiment or test that would confirm or reject the concern

## Caveats

Findings are possibilities, not confirmed defects. Vague language is not automatically wrong. A candidate matters when the model's interpretation changes what the system does, touches, publishes, refuses, escalates, deletes, or spends.
