# JSON Personal-intro Matched-pairs Draft Review

Date: 2026-10-05

## Version reviewed

The review covers Version 3 at `json-legibility-is-not-control-personal-intro/index.md`, blog source commit `df86c97`.

Relative to the preceding review, this revision:

- defines the design once as two matched comparisons per block and 120 matched pairs in total;
- refers back to `those 120 matched pairs` for the mean-score result;
- uses `those same 120 matched pairs` for the routing transitions;
- removes the informal explanation of bootstrap resampling;
- replaces `primary states` with `these two states` in the production-impact limitation;
- bolds the final operational recommendation.

## Protocol

Three independent provider families received the revised article alone, each in a separate request:

- OpenAI, requested `gpt-5.6`, reported `gpt-5.6-sol`;
- Google, requested and reported `gemini-3.6-flash`;
- Anthropic, resolved and reported `claude-sonnet-5-5`.

No request included another article, prior scores, author discussion, repository history, or a target verdict. The prompt and scoring criteria were identical to the preceding standalone panel. All three responses passed JSON validation on the first run.

## Scores

| Judge | Technical precision | Raw novelty | Framing novelty | Practitioner interest | Accessibility | Overall | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|
| OpenAI | 8.1 | 4.0 | 7.7 | 8.5 | 8.8 | 8.0 | Minor revisions |
| Gemini | 9.2 | 6.5 | 8.8 | 9.0 | 9.2 | 8.8 | Ready |
| Anthropic | 5.8 | 3.5 | 5.0 | 6.5 | 7.8 | 5.7 | Major revisions |
| **Mean** | **7.70** | **4.67** | **7.17** | **8.00** | **8.60** | **7.50** |  |

## Descriptive change from the preceding panel

These are separate stochastic review runs, not paired reviewer measurements. The deltas should not be treated as precise effects of the prose edit.

| Dimension | Previous panel | Current panel | Delta |
|---|---:|---:|---:|
| Technical precision | 7.87 | 7.70 | -0.17 |
| Raw novelty | 5.00 | 4.67 | -0.33 |
| Framing novelty | 7.37 | 7.17 | -0.20 |
| Practitioner interest | 7.93 | 8.00 | +0.07 |
| Accessibility | 8.47 | 8.60 | +0.13 |
| Overall | 7.60 | 7.50 | -0.10 |

Per-judge overall scores changed as follows:

- OpenAI: 8.3 to 8.0;
- Gemini: 8.3 to 8.8;
- Anthropic: 6.2 to 5.7.

## Interpretation

The wording change succeeded at its narrow editorial purpose. The article now defines the 120 pairs once and makes clear that the score result and routing transitions use the same observations. No judge identified the duplicated wording itself as confusing.

It did not resolve the methodological disagreement. Anthropic's objection is not that the prose fails to explain the arithmetic. It is that 120 repeated call pairs arise from only two fixed near-boundary stimuli. In its reading, the complete-block intervals quantify run-level variability for those selected stimuli but do not support generalization across arbitrary states, tasks, models, or schema changes. OpenAI makes a milder version of the same point and also asks for exact stimuli and selection history in the article. Gemini accepts the current scope limitations and rates the article ready.

Anthropic's 5.7 should not be interpreted as evidence that the revision made the article worse. Its underlying methodological position is stable across both panels, and the separate calls are stochastic. The useful signal is the persistent cross-panel disagreement: two judges accept the bounded behavioral claim, while one treats the title, terminology, and statistical emphasis as materially broader than the design supports.

## Highest-value next decision

Further wording changes around `120` are unlikely to improve the disagreement. The next substantive editorial choice is whether to add one explicit sentence after the bootstrap result:

> This interval quantifies variation across repeated calls and the frozen block schedule for these two selected states; it does not estimate variation across other states, tasks, models, or schema changes.

That sentence would directly answer the valid scope concern without discarding the paired estimate. It would not satisfy Anthropic's larger demand for additional controls or cross-model replication, and it should not be presented as doing so.

## Artifacts

- Manifest: `neutral-reviews/manifests/json-personal-intro-matched-pairs-standalone-tri-provider-2026-10-05.json`
- Results: `neutral-reviews/results/2026-10-06T032455-285Z-json-personal-intro-matched-pairs-standalone-tri-provider-2026-10-05/`
- Blog source commit: `df86c97`
