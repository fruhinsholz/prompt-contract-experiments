# JSON Prospective Article and Repository Review

Date: 2026-09-29

Article: `JSON Legibility Is Not Control: When Schema Names Move a Routing Boundary`

## Panel

The same main article, technical appendix, rubric, output schema, and bounded
projection of public evidence commit `f2d2515` were sent directly to three
provider APIs. Earlier editorial reviews were excluded from the packet.

| Provider | Requested model | Reported model | Overall | Verdict | Estimated percentile |
|---|---|---|---:|---|---|
| OpenAI | `gpt-5.6` | `gpt-5.6-sol` | 8.4 | publish with revisions | 86th-94th |
| Google | `gemini-3.6-flash` | `gemini-3.6-flash` | 9.3 | publish | 95th-99th |
| Anthropic | `latest` | `claude-sonnet-5-5` | 7.3 | publish with revisions | 72nd-86th |
| **Mean** | | | **8.3** | **publish with revisions** | estimates span 72nd-99th |

All three responses passed JSON validation. Percentiles are reviewer estimates,
not measured corpus ranks.

## Mean dimension scores

| Dimension | Mean |
|---|---:|
| Empirical rigor | 8.4 |
| Technical precision | 8.4 |
| Narrative force | 8.6 |
| Practical value | 8.4 |
| Originality | 7.4 |
| Calibration of claims | 8.6 |
| Publication readiness | 8.1 |
| Main-article readability | 8.8 |
| Repository auditability | 8.3 |

## Consensus

All three reviewers accepted the numerical center of the article. The packet
supports the `+6.88 pp` score shift, its `[+5.63, +8.13]` complete-block interval,
the `45.8%` to `70.8%` routing change, the `33` versus `3` paired transitions,
and `240/240` correct guardrail routes.

The strongest shared qualities were the prospective paired design, clear
separation between schema validity and routing behavior, practical engineering
advice, readable main article, and detailed appendix.

The shared evidential limit is narrow external validity: one Jev version, one
task, two primary state texts, one selected pair of non-synonymous key families,
and one experimental threshold. The result is a controlled existence result,
not a prevalence estimate or an estimate over production traffic.

## Highest-value issue found by repository audit

OpenAI and Claude independently identified a provenance mismatch:

- `run.json` records runner SHA-256 `a4076332...`;
- the runner published under `current/src/run-prospective-routing-boundary.mjs`
  hashes to `50f96eef...`.

The recorded hash matches the original private-repository runner
`src/refined-choice-key-phase-a.mjs`. The public repository contains a cleaned,
relocated version rather than the exact executed source at the expected current
path. The empirical outputs remain internally consistent, but the public audit
surface does not yet prove exact code-level re-execution from that path.

The judges also flagged stale `draftPublishedAt` metadata that predates the run,
mutable `tree/main` evidence links, and an inaccurate appendix statement that
`run.json` contains payloads and per-call timestamps. Those details live in
`calls.jsonl`, while `run.json` contains the planned schedule, run-level metadata,
and source hashes.

## Other material revisions recommended

1. State more prominently that the comparison is a bundled lexical-framing
   intervention, not a synonym substitution or ordinary refactor-like rename.
2. Disclose that earlier test-bed development informed the families, boundary
   states, expected direction, and success threshold, while remaining excluded
   from the prospective estimate and frozen decision.
3. Report that `P(none)` was zero in all 720 calls and add robustness context by
   semantic order, execution time, threshold, or a later replication.
4. Pin article and appendix evidence links to commit `f2d2515`.
5. Preserve or publish the exact executed runner and reconcile all provenance
   metadata before treating the package as publication-final.

## Canonical artifacts

- Manifest: `neutral-reviews/manifests/json-prospective-article-repository-tri-provider-2026-09-29.json`
- Packet: `neutral-reviews/packets/json-legibility-control-prospective-audit-f2d2515.md`
- Responses: `neutral-reviews/results/2026-09-30T022007-428Z-json-prospective-article-repository-tri-provider-2026-09-29/`
