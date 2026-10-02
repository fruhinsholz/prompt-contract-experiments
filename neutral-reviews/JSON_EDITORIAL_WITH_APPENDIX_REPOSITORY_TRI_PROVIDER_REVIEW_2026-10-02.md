# JSON Editorial Article, Technical Appendix, and Repository: Tri-Provider Review

Date: 2026-10-02

## Scope

Three independent provider families reviewed the same package without prior scores, author discussion, or other reviewers' opinions:

- main article: `JSON Legibility Is Not Control: When Schema Names Move a Routing Boundary`;
- technical appendix;
- prospective repository audit packet at public commit `6a79286`;
- historical repository audit packet at public commit `22f3810`, including the exploratory opaque `A/B/C` control.

The rubric covered empirical rigor, technical precision, narrative force, practical value, originality, calibration of claims, publication readiness, main-article readability, and auditability.

OpenAI's first response was complete in substance but invalid JSON because the final structure was truncated. Under the panel protocol it was excluded and replaced by an independent OpenAI retry using the same manifest. Gemini and Claude passed validation on the first run.

## Scores

| Judge | Resolved model | Score | Verdict | Estimated percentile |
|---|---|---:|---|---|
| OpenAI | `gpt-5.6-sol` | 8.5 | Publish with revisions | 86th-94th |
| Google | `gemini-3.6-flash` | 9.4 | Publish | 95th-98th |
| Anthropic | `claude-sonnet-5-5` | 7.5 | Publish with revisions | 78th-90th |
| **Mean** | | **8.47** | **Publish with revisions** | |

## Mean Dimension Scores

| Dimension | Mean |
|---|---:|
| Empirical rigor | 8.23 |
| Technical precision | 8.73 |
| Narrative force | 8.53 |
| Practical value | 8.33 |
| Originality | 8.20 |
| Calibration of claims | 8.17 |
| Publication readiness | 8.27 |
| Main-article readability | 8.77 |
| Auditability | 9.17 |

## Consensus

All three judges found that the repository supports the headline numerical results. They accepted the central existence claim that model-visible key framing can move a downstream routing boundary in this interface. They also agreed that the main-article/appendix split is effective or mostly effective and that the audit trail is unusually strong.

The most important cross-provider issue is the exploration-to-confirmation history. OpenAI and Claude judged that the article does not disclose prominently enough that the exact `work_impediment` versus `duty_prevention` contrast had already produced a favorable result in the earlier 600-call exploratory run, and that the primary states were selected near the routing threshold. They therefore describe the 720-call run as an exploration-informed, prospectively frozen confirmation rather than an independently selected prospective discovery.

Gemini gave an unqualified publish verdict and found no unsupported claims. Its suggested revisions were additive: a payload diagram, an explicit note that uncalibrated model scores still have operational consequences when thresholded, and a code example separating model-visible keys from internal enums.

## Highest-Value Revisions

1. Reframe `A Clean Prospective Test` as a prospectively frozen, exploration-informed confirmation and summarize the selection lineage in the article and appendix.
2. State more plainly that the tested change is a plausible non-synonymous framing change, not a strict-synonym rename, and ensure the opening vocabulary-cleanup scenario does not imply otherwise.
3. Tighten the reproducibility account by distinguishing deterministic re-analysis of preserved calls from live behavioral replication against a mutable provider alias.
4. Consider order-specific and time/block sensitivity analyses, plus a same-input repeat-variance baseline, if a stronger methodological claim is desired.
5. Verify or snapshot external Jev documentation relied upon by the article, and clarify the exploratory singular/plural prevention-key difference.

## Panel Verdict

**8.47/10. Publish with revisions.**

The package is numerically supported, readable, practically relevant, and highly auditable. The remaining publication risk is primarily editorial calibration around selection history and the meaning of “prospective,” not a failure of the primary result.

## Artifacts

- Manifest: `neutral-reviews/manifests/json-editorial-with-appendix-repository-tri-provider-2026-10-02.json`
- Initial panel run: `neutral-reviews/results/2026-10-02T074904-475Z-json-editorial-with-appendix-repository-tri-provider-2026-10-02/`
- Valid OpenAI retry: `neutral-reviews/results/2026-10-02T075234-285Z-json-editorial-with-appendix-repository-openai-valid-retry-2026-10-02/`

