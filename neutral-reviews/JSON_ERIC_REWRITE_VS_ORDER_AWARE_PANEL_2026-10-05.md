# JSON Eric-style Rewrite vs Order-aware Revision

Date: 2026-10-05

## Versions

- Article A: concise Eric-style rewrite at `json-legibility-is-not-control-eric-style-rewrite/index.md`
- Article B: new personal opening plus explicit serialization-order result at `json-legibility-is-not-control-order-aware/index.md`

The original Article A source was preserved. Article B was evaluated as a separate draft.

## Protocol

Three independent provider families reviewed the articles:

- OpenAI, requested `gpt-5.6`, reported `gpt-5.6-sol`
- Google, requested and reported `gemini-3.6-flash`
- Anthropic, resolved and reported `claude-sonnet-5-5`

Each provider first received Article A alone, then Article B alone in a separate request. No standalone request included the other article, prior scores, author discussion, or repository history. Each provider then received both articles together in a third request and selected a preferred version under the same six criteria.

The criteria were technical precision, raw novelty, novelty of framing, serious practitioner interest, accessibility, and overall quality. Scores are out of 10.

Initial Anthropic standalone responses for A and B contained malformed JSON and were excluded. Anthropic-only retries with unchanged manifests produced valid JSON and are the responses reported below.

## Standalone Scores

### Article A

| Judge | Technical precision | Raw novelty | Framing novelty | Practitioner interest | Accessibility | Overall |
|---|---:|---:|---:|---:|---:|---:|
| OpenAI | 8.2 | 6.4 | 8.0 | 8.8 | 8.7 | 8.2 |
| Gemini | 9.2 | 7.5 | 8.8 | 9.0 | 9.0 | 8.9 |
| Anthropic | 6.8 | 4.5 | 6.0 | 7.0 | 7.8 | 6.7 |
| **Mean** | **8.07** | **6.13** | **7.60** | **8.27** | **8.50** | **7.93** |

### Article B

| Judge | Technical precision | Raw novelty | Framing novelty | Practitioner interest | Accessibility | Overall |
|---|---:|---:|---:|---:|---:|---:|
| OpenAI | 7.8 | 4.6 | 7.7 | 8.6 | 8.8 | 7.9 |
| Gemini | 9.0 | 6.0 | 8.5 | 8.5 | 9.5 | 8.5 |
| Anthropic | 6.5 | 4.5 | 6.0 | 7.0 | 8.0 | 6.5 |
| **Mean** | **7.77** | **5.03** | **7.40** | **8.03** | **8.77** | **7.63** |

### Mean Difference, B minus A

| Dimension | Difference |
|---|---:|
| Technical precision | -0.30 |
| Raw novelty | -1.10 |
| Novelty of framing | -0.20 |
| Serious practitioner interest | -0.23 |
| Accessibility | +0.27 |
| Overall | -0.30 |

The standalone panel favored A overall. B's only mean advantage was accessibility. The recurring concern was that the order result was a secondary, post hoc analysis with less methodological support in the article than the preregistered key-family result.

## Direct Comparison

| Judge | A overall | B overall | Preferred version | Confidence | Recommended basis |
|---|---:|---:|---|---|---|
| OpenAI | 8.8 | 8.3 | A | Medium | A |
| Gemini | 8.3 | 9.1 | B | High | B |
| Anthropic | 7.4 | 8.0 | B | Medium | B |

Direct preference was **B by 2 judges to 1**.

- OpenAI preferred A because its central claim remained tightly matched to the preregistered comparison. It recommended using B's opening and mentioning order only as explicitly exploratory unless the appendix gains the full analysis.
- Gemini preferred B because serialization order is operationally important and makes the warning more actionable. It preferred A's more methodologically immediate opening.
- Anthropic preferred B because omitting the large order effect would hide an important property of the run. It required labeling the analysis exploratory and reporting order-stratified effects and interactions.

## Editorial Interpretation

The two protocols answer different questions:

- Standalone grading rewards A's tighter claim-evidence alignment.
- Side-by-side preference rewards B's additional practitioner value and more concrete opening.

The best next version is therefore not B unchanged. It is a hybrid based on B's disclosure of the order effect, with A's methodological discipline:

1. Keep the new personal opening, or compress it slightly.
2. Label the order analysis explicitly as exploratory and post hoc.
3. Add order-stratified key-family effects and a family-by-order interaction analysis to the technical appendix or evidence repository.
4. Keep the preregistered rename result as the headline claim and the order effect as a secondary result.
5. Avoid implying that the current one-factor variance decomposition proves a causal order effect without addressing block, execution-time, and interaction checks.

## Artifacts

- A standalone manifest: `neutral-reviews/manifests/json-eric-rewrite-a-standalone-tri-provider-2026-10-05.json`
- B standalone manifest: `neutral-reviews/manifests/json-order-aware-b-standalone-tri-provider-2026-10-05.json`
- Direct comparison manifest: `neutral-reviews/manifests/json-eric-rewrite-vs-order-aware-tri-provider-2026-10-05.json`
- A primary run: `neutral-reviews/results/2026-10-06T013503-148Z-json-eric-rewrite-a-standalone-tri-provider-2026-10-05/`
- A Anthropic valid retry: `neutral-reviews/results/2026-10-06T013745-627Z-json-eric-rewrite-a-standalone-tri-provider-2026-10-05/`
- B primary run: `neutral-reviews/results/2026-10-06T013608-927Z-json-order-aware-b-standalone-tri-provider-2026-10-05/`
- B Anthropic valid retry: `neutral-reviews/results/2026-10-06T013834-685Z-json-order-aware-b-standalone-tri-provider-2026-10-05/`
- Direct comparison run: `neutral-reviews/results/2026-10-06T013946-542Z-json-eric-rewrite-vs-order-aware-tri-provider-2026-10-05/`
