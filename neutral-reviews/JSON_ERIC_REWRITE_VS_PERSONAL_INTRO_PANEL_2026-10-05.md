# JSON Eric-style Rewrite vs Personal-intro Revision

Date: 2026-10-05

## Versions

- Version 1: concise Eric-style rewrite at `json-legibility-is-not-control-eric-style-rewrite/index.md`
- Version 2: personal opening plus explicit serialization-order result at `json-legibility-is-not-control-order-aware/index.md`
- Version 3: Version 1 with only its two-paragraph opening replaced by the four-paragraph personal introduction at `json-legibility-is-not-control-personal-intro/index.md`

The body after the introduction is byte-for-byte identical between Versions 1 and 3. Version 2 was preserved but was not part of this requested panel.

## Protocol

Three independent provider families reviewed the articles:

- OpenAI, requested `gpt-5.6`, reported `gpt-5.6-sol`
- Google, requested and reported `gemini-3.6-flash`
- Anthropic, resolved and reported `claude-sonnet-5-5`

Each provider first received Version 3 alone. No standalone request included another article, prior scores, author discussion, or repository history. Each provider then received Versions 1 and 3 together in a separate request and selected a preferred version under the same six criteria.

The criteria were technical precision, raw novelty, novelty of framing, serious practitioner interest, accessibility, and overall quality. Scores are out of 10. All six responses passed the manifest's JSON validation on the first run.

## Version 3 Standalone Scores

| Judge | Technical precision | Raw novelty | Framing novelty | Practitioner interest | Accessibility | Overall |
|---|---:|---:|---:|---:|---:|---:|
| OpenAI | 8.3 | 5.4 | 8.1 | 8.8 | 8.7 | 8.2 |
| Gemini | 8.0 | 4.5 | 7.5 | 8.0 | 8.5 | 7.5 |
| Anthropic | 6.8 | 4.8 | 5.8 | 7.0 | 7.8 | 6.7 |
| **Mean** | **7.70** | **4.90** | **7.13** | **7.93** | **8.33** | **7.47** |

All three judges returned `publish_after_minor_revisions`.

The recurring strengths were the preregistered design, randomized and order-balanced blocks, guardrails, transparent scope limits, and the practical distinction between valid structure and stable model behavior.

The recurring weaknesses were independent of the new introduction: one model and task, two non-synonymous key families, two fixed primary states repeatedly sampled, limited generalizability of the bootstrap interval, and no same-schema repeatability baseline in the article.

## Direct Comparison

In the comparison manifest, Article A was Version 1 and Article B was Version 3.

| Judge | Version 1 overall | Version 3 overall | Preferred version | Confidence | Recommended basis |
|---|---:|---:|---|---|---|
| OpenAI | 8.7 | 8.9 | Version 3 | Medium | Version 3 |
| Gemini | 8.2 | 7.8 | Version 1 | High | Version 1 |
| Anthropic | 7.0 | 7.4 | Version 3 | Medium | Version 3 |
| **Mean** | **7.97** | **8.03** | **Version 3, 2 to 1** |  |  |

### Direct-comparison mean scores

| Dimension | Version 1 | Version 3 | Version 3 minus Version 1 |
|---|---:|---:|---:|
| Technical precision | 8.43 | 8.40 | -0.03 |
| Raw novelty | 6.20 | 6.20 | 0.00 |
| Novelty of framing | 7.50 | 7.47 | -0.03 |
| Serious practitioner interest | 8.17 | 8.13 | -0.03 |
| Accessibility | 7.93 | 8.20 | +0.27 |
| Overall | 7.97 | 8.03 | +0.07 |

The numerical result is effectively a tie. The preference vote favored Version 3 because OpenAI and Anthropic found the personal opening more concrete, accessible, and relevant to an engineer scanning for the operational consequence. Gemini preferred Version 1 because it establishes the controlled variables before presenting the 45.8% to 70.8% routing change.

## Interpretation

Version 3 is the marginal winner, not a decisive one.

Its advantage is concentrated in accessibility. Its cost is that the headline routing numbers appear before Jev, the task, and the distinction between the 6.88-point score shift and the threshold-amplified 25-point routing shift have been introduced.

The highest-value editorial adjustment, if another revision is made, is to preserve Version 3's personal opening while placing the **6.88-point score shift** beside the **45.8% to 70.8% routing change** and tightening the repeated explanation in `Why the rename looked safe`. This keeps the concrete hook while reducing the risk that the selected-boundary routing result is read as the underlying model-score effect or as a production estimate.

The standalone scores for Version 3 should not be compared mechanically with the earlier standalone Version 1 means. They were separate stochastic review runs, and the direct comparison is the controlled evidence for choosing between the introductions.

## Artifacts

- Version 3 standalone manifest: `neutral-reviews/manifests/json-personal-intro-c-standalone-tri-provider-2026-10-05.json`
- Version 1 vs Version 3 manifest: `neutral-reviews/manifests/json-eric-rewrite-vs-personal-intro-tri-provider-2026-10-05.json`
- Version 3 standalone run: `neutral-reviews/results/2026-10-06T020231-920Z-json-personal-intro-c-standalone-tri-provider-2026-10-05/`
- Version 1 vs Version 3 run: `neutral-reviews/results/2026-10-06T020347-085Z-json-eric-rewrite-vs-personal-intro-tri-provider-2026-10-05/`
- Blog source commit: `7250161`
