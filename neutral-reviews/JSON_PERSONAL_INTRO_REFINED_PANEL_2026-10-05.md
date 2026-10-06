# JSON Personal-intro Refined Draft Review

Date: 2026-10-05

## Version reviewed

The review covers the refined Version 3 at `json-legibility-is-not-control-personal-intro/index.md`, blog source commit `8d62b96`.

Relative to the preceding Version 3 review, this revision:

- replaces `JSON choice names` with `JSON choice keys`;
- introduces Jev briefly in the opening;
- removes repeated Jev setup from the next section;
- simplifies the pseudocode and evidence-repository transition;
- clarifies the 120 matched comparisons and explains block resampling in plain language;
- simplifies the conclusion around model-visible JSON keys as prompt tokens.

## Protocol

Three independent provider families received the revised article alone, each in a separate request:

- OpenAI, requested `gpt-5.6`, reported `gpt-5.6-sol`;
- Google, requested and reported `gemini-3.6-flash`;
- Anthropic, resolved and reported `claude-sonnet-5-5`.

No request included another article, prior scores, author discussion, repository history, or a target verdict. The criteria were technical precision, raw novelty, novelty of framing, serious practitioner interest, accessibility, and overall quality. Scores are out of 10. All three responses passed the manifest's JSON validation on the first run.

## Scores

| Judge | Technical precision | Raw novelty | Framing novelty | Practitioner interest | Accessibility | Overall | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|
| OpenAI | 8.5 | 5.3 | 8.1 | 8.7 | 8.8 | 8.3 | Minor revisions |
| Gemini | 8.8 | 5.5 | 8.2 | 8.5 | 9.0 | 8.3 | Ready |
| Anthropic | 6.3 | 4.2 | 5.8 | 6.6 | 7.6 | 6.2 | Major revisions |
| **Mean** | **7.87** | **5.00** | **7.37** | **7.93** | **8.47** | **7.60** |  |

## Change from the preceding Version 3 standalone panel

Because these are separate stochastic review runs, the deltas are descriptive rather than a controlled comparison.

| Dimension | Previous Version 3 | Refined Version 3 | Delta |
|---|---:|---:|---:|
| Technical precision | 7.70 | 7.87 | +0.17 |
| Raw novelty | 4.90 | 5.00 | +0.10 |
| Novelty of framing | 7.13 | 7.37 | +0.23 |
| Serious practitioner interest | 7.93 | 7.93 | 0.00 |
| Accessibility | 8.33 | 8.47 | +0.13 |
| Overall | 7.47 | 7.60 | +0.13 |

## Shared assessment

OpenAI and Gemini found the revision clear, disciplined, practically useful, and accessible. Both credited the preregistered paired design, balanced ordering, guardrails, scope limits, and the operational recommendation to treat model-facing labels as versioned prompt language.

All three judges agreed that the underlying broad phenomenon, prompt wording affects model behavior, is not highly novel. The stronger contribution is the operational framing and the quantified routing consequence.

Recurring limitations were:

- one proprietary model and one task;
- two key families that are not strict synonyms;
- two deliberately selected near-threshold primary states;
- insufficient self-contained detail about the exact primary stimuli and their selection;
- no neutral or opaque-key control and no cross-model replication.

## Main disagreement

Anthropic treated the repeated calls as evidence about model sampling noise on two fixed stimuli, not as broad evidence across independent cases. It therefore judged the bootstrap intervals and headline routing rate as more precise and general than the design warrants. OpenAI raised the same issue more mildly and asked for a clearer definition of the experimental unit and dependence assumptions. Gemini accepted the current inference and returned `ready`.

This is the highest-value unresolved editorial issue. The article already limits its scope, but it should make one point even more explicit if revised again: the interval quantifies uncertainty over the frozen block schedule and repeated model calls for these selected states. It does not estimate variation across arbitrary states, tasks, or models.

## Editorial interpretation

The requested prose changes improved the panel mean slightly, especially framing novelty, technical precision, and accessibility. The improvement is not decisive because this was not a paired comparison and Anthropic's harsher methodological reading dominated the spread.

The revised introduction and simplified conclusion should be kept. The next useful change would not be another stylistic rewrite. It would be a short clarification of the experimental unit and the scope of the bootstrap interval, plus one exact primary-state example if length permits.

## Artifacts

- Manifest: `neutral-reviews/manifests/json-personal-intro-refined-standalone-tri-provider-2026-10-05.json`
- Results: `neutral-reviews/results/2026-10-06T030207-741Z-json-personal-intro-refined-standalone-tri-provider-2026-10-05/`
- Blog source commit: `8d62b96`
