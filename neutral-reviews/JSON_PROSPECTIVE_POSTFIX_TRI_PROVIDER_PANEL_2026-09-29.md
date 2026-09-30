# JSON Prospective Article and Repository Review After Provenance Fix

Date: 2026-09-29

Article: `JSON Legibility Is Not Control: When Schema Names Move a Routing Boundary`

## Panel

The corrected main article, technical appendix, shared rubric, and bounded
projection of public evidence commit `6a79286` were sent directly to three
provider APIs. Earlier scores and reviews were excluded from the packet.

| Provider | Requested model | Reported model | Overall | Verdict | Estimated percentile |
|---|---|---|---:|---|---|
| OpenAI | `gpt-5.6` | `gpt-5.6-sol` | 8.5 | publish with revisions | 90th-96th |
| Google | `gemini-3.6-flash` | `gemini-3.6-flash` | 9.4 | publish | 96th-99th |
| Anthropic | `latest` | `claude-sonnet-5-5` | 7.5 | publish with revisions | 80th-90th |
| **Mean** | | | **8.47** | **publish with revisions** | estimates span 80th-99th |

All three responses passed JSON validation. Percentiles are reviewer estimates,
not measured corpus ranks.

## Mean dimension scores

| Dimension | Mean |
|---|---:|
| Empirical rigor | 8.53 |
| Technical precision | 8.53 |
| Narrative force | 8.53 |
| Practical value | 8.33 |
| Originality | 7.37 |
| Calibration of claims | 8.50 |
| Publication readiness | 8.43 |
| Main-article readability | 8.77 |
| Repository auditability | 9.00 |

## Effect of the provenance fix

The mean overall score rose from 8.3 to 8.47. Each provider increased its score:

- OpenAI: 8.4 to 8.5
- Gemini: 9.3 to 9.4
- Anthropic: 7.3 to 7.5

The earlier blocking audit concern is resolved. All three judges found the exact
executed runner in the public repository, with SHA-256 `a4076332...` matching
`run.json`. Repository auditability is now the panel's strongest mean dimension
at 9.00.

## Consensus

All three judges accepted the central numerical results and found the repository
consistent with the article. None found a contradicted central estimate, count,
interval, guardrail result, or model-version statement.

The package's strongest shared qualities are its prospective frozen run, balanced
paired design, complete records, source hashes, reproducible analysis, careful
qualification of matched transitions, readable main article, and properly scoped
technical appendix.

The shared remaining limitation is selection history and external validity. The
key-family contrast, threshold-adjacent states, and success boundary were developed
after earlier pilots on the same Jev interface. The prospective run confirms that
frozen contrast; it does not estimate the prevalence of schema-name effects across
renames, tasks, providers, or production traffic.

## Highest-value remaining revisions

1. Disclose earlier exploratory development more prominently in the main article
   and appendix. Describe the run as a prospective confirmation on frozen,
   pilot-informed materials.
2. Add or explicitly defer a neutral calibration contrast, such as near-synonyms,
   opaque keys, or a within-family relabel, to contextualize the `+6.88 pp` shift.
3. Report robustness context: `P(none) = 0` in all 720 calls, threshold sensitivity,
   selected-key rates, semantic-order or execution-time diagnostics, and the high
   within-condition spread near the experimental boundary.
4. Tighten the title and analogy: the routing threshold remained fixed; the scores
   and resulting routes moved across it. Clarify that ordinary enum renames are not
   always behavior-preserving at wire or storage boundaries.

## Panel disagreement

Gemini considered the package publication-ready and found no methodological
concerns. OpenAI and Claude recommended revisions, primarily because the article
does not foreground the pilot-informed selection history and because no neutral
rename control establishes how unusual the measured shift is. The disagreement is
about calibration and generality, not about the integrity of the reported numbers.

## Canonical artifacts

- Manifest: `neutral-reviews/manifests/json-prospective-article-repository-postfix-tri-provider-2026-09-29.json`
- Packet: `neutral-reviews/packets/json-legibility-control-prospective-audit-6a79286.md`
- Responses: `neutral-reviews/results/2026-09-30T023634-296Z-json-prospective-article-repository-postfix-tri-provider-2026-09-29/`
