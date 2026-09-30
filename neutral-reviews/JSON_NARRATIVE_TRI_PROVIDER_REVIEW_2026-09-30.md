# JSON Narrative Article: Tri-Provider Review and Version Comparison

Date: 2026-09-30

## Protocol

Two separate panels were sent directly to OpenAI, Google, and Anthropic APIs.
Every call was fresh and received no conversation history, prior score, target
verdict, or other reviewer's output.

The standalone panel received only:

- the narrative main article;
- the shared technical appendix;
- the bounded repository projection at public evidence commit `6a79286`.

The comparison panel received only:

- Article A, the previous concise main article;
- Article B, the new narrative main article;
- the shared technical appendix;
- the same bounded repository projection.

| Provider | Requested model | Reported model |
|---|---|---|
| OpenAI | `gpt-5.6` | `gpt-5.6-sol` |
| Google | `gemini-3.6-flash` | `gemini-3.6-flash` |
| Anthropic | `latest` | `claude-sonnet-5-5` |

All six responses passed the required JSON validation.

## Standalone Narrative Review

| Provider | Overall | Verdict | Opening clearly disclosed | Opening improves article |
|---|---:|---|---|---|
| OpenAI | 8.3 | Publish with revisions | Yes | Yes |
| Google | 9.1 | Publish | Yes | Yes |
| Anthropic | 7.1 | Publish with revisions | Yes | Yes |
| **Mean** | **8.17** | **Publish with revisions** | **3/3 yes** | **3/3 yes** |

### Mean dimension scores

| Dimension | Mean |
|---|---:|
| Empirical rigor | 8.07 |
| Technical precision | 8.27 |
| Narrative force | 8.43 |
| Practical value | 8.03 |
| Originality | 7.37 |
| Calibration of claims | 8.23 |
| Publication readiness | 7.83 |
| Main-article readability | 8.67 |
| Repository auditability | 8.60 |

All three judges found the hypothetical opening clearly disclosed and useful.
The disagreement concerned the rest of the package's calibration, not whether the
scene was deceptive.

Shared strengths:

- exact agreement between the article's headline numbers and the evidence packet;
- a readable connection between model-visible vocabulary and deterministic routing;
- a main article that stands alone while preserving detailed methods in the appendix;
- complete, commit-pinned auditability of the prospective run.

Shared or repeated revision requests:

1. Disclose more clearly that earlier pilots and calibration informed the selected
   states and key families. Describe the 720-call run as prospectively frozen
   confirmation of developed materials, not as untouched discovery.
2. State more prominently that the two key families are different semantic framings,
   not strict synonyms, and that the study lacks a neutral, near-synonym, cosmetic,
   or A/A rename control.
3. Narrow any generalization from this Jev scored-choice interface to typed output
   or schema renames in general.
4. Fix the technical appendix link, which still points to the previous `-revised`
   article slug.

## Previous Version Versus Narrative Version

Article A is the previous concise version. Article B is the narrative version.

| Provider | A overall | B overall | Winner | Recommended public basis |
|---|---:|---:|---|---|
| OpenAI | 8.6 | 8.4 | A | Hybrid |
| Google | 8.9 | 8.5 | A | A |
| Anthropic | 7.8 | 7.9 | B | Hybrid |
| **Mean** | **8.43** | **8.27** | **A, 2/3** | **Hybrid, 2/3** |

### Mean comparison scores

| Dimension | Previous A | Narrative B |
|---|---:|---:|
| Empirical rigor | 8.60 | 8.60 |
| Technical precision | 8.63 | 8.60 |
| Narrative force | 7.90 | 8.23 |
| Practical value | 8.40 | 8.47 |
| Originality | 7.93 | 7.97 |
| Calibration of claims | 8.53 | 8.30 |
| Publication readiness | 8.43 | 8.17 |
| Readability | 8.87 | 8.33 |
| Opening effectiveness | 8.27 | 7.80 |
| Appendix integration | 8.90 | 8.67 |

The comparison panel preferred the previous version by a small mean margin of
`0.17` points. The narrative version improved narrative force by `0.33` points
and practical value by `0.07`, but lost `0.54` on readability, `0.47` on opening
effectiveness, `0.23` on claim calibration, and `0.26` on publication readiness.

OpenAI and Google preferred the previous version because it reaches the thesis
faster, avoids a momentary production-incident reading, and does not repeat the
schema contrast. Anthropic gave the narrative version a `0.1` advantage because
the operational scene is more memorable, while still recommending that it be
shortened and made more faithful to the study's actual development history.

## Editorial Conclusion

The evidence supports a hybrid rather than publishing the narrative draft
unchanged:

- keep the previous article's concise structure;
- retain a much shorter version of the hypothetical scene;
- disclose the fiction before any production-style consequence;
- remove the duplicated enum analogy and schema presentation;
- replace the claim that the scene "led me" to the experiment with an accurate
  statement that it illustrates the operational risk tested after earlier
  development;
- state near the `45.8%` to `70.8%` result that the primary states were selected
  near the routing threshold and the shift is not a production-traffic estimate.

## Canonical Artifacts

Standalone manifest:

- `neutral-reviews/manifests/json-narrative-article-repository-tri-provider-2026-09-30.json`

Standalone responses:

- `neutral-reviews/results/2026-09-30T144618-939Z-json-narrative-article-repository-tri-provider-2026-09-30/`

Comparison manifest:

- `neutral-reviews/manifests/json-previous-vs-narrative-tri-provider-2026-09-30.json`

Comparison responses:

- `neutral-reviews/results/2026-09-30T145049-051Z-json-previous-vs-narrative-tri-provider-2026-09-30/`
