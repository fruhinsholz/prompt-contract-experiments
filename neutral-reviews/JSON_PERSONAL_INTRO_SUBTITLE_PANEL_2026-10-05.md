# JSON Personal-intro Subtitle Draft Review

Date: 2026-10-05

## Version reviewed

The review covers Version 3 at `json-legibility-is-not-control-personal-intro/index.md`, blog source commit `d81c18a`.

The only editorial change since the preceding panel is the subtitle:

> A preregistered experiment with Jev tests an engineering assumption: if the choice descriptions stay identical, should renaming JSON keys change what the application does?

## Protocol

Three independent provider families received the revised article alone, each in a separate request:

- OpenAI, requested `gpt-5.6`, reported `gpt-5.6-sol`;
- Google, requested and reported `gemini-3.6-flash`;
- Anthropic, resolved and reported `claude-sonnet-5-5`.

The prompt, scoring dimensions, and output schema are unchanged from the preceding standalone panel. No request included another article, prior scores, author discussion, repository history, or a target verdict. All three responses passed JSON validation on the first run.

## Scores

| Judge | Technical precision | Raw novelty | Framing novelty | Practitioner interest | Accessibility | Overall | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|
| OpenAI | 8.4 | 4.8 | 8.0 | 8.7 | 8.8 | **8.3** | Minor revisions |
| Gemini | 9.2 | 6.5 | 8.8 | 9.0 | 9.5 | **8.8** | Ready |
| Anthropic | 6.8 | 3.8 | 5.2 | 6.6 | 8.0 | **6.3** | Major revisions |
| **Mean** | **8.13** | **5.03** | **7.33** | **8.10** | **8.77** | **7.80** |  |

## Descriptive comparison with the preceding panel

These are separate stochastic review runs, not paired reviewer measurements. The deltas do not estimate the causal effect of the subtitle change.

| Dimension | Previous panel | Current panel | Delta |
|---|---:|---:|---:|
| Technical precision | 7.70 | 8.13 | +0.43 |
| Raw novelty | 4.67 | 5.03 | +0.36 |
| Framing novelty | 7.17 | 7.33 | +0.16 |
| Practitioner interest | 8.00 | 8.10 | +0.10 |
| Accessibility | 8.60 | 8.77 | +0.17 |
| Overall | 7.50 | 7.80 | +0.30 |

Per-judge overall scores changed as follows:

- OpenAI: 8.0 to 8.3;
- Gemini: 8.8 to 8.8;
- Anthropic: 5.7 to 6.3.

## Interpretation

The subtitle is accepted as a clearer statement of the engineering question. No judge objected to its length or readability. Accessibility remains the strongest and most stable dimension across the panel.

The change does not alter the persistent methodological disagreement. OpenAI and Anthropic still emphasize that the 120 matched pairs are repeated calls over two selected states, so the bootstrap interval is conditional on the frozen stimuli rather than evidence of generalization to new states, tasks, models, or schemas. Both also note that `impeded` and `prevented` are semantically different, not strict synonyms. Gemini accepts the current qualifications and rates the article ready.

Anthropic's overall score increased from 5.7 to 6.3, while its verdict remains major revisions. Its criticism is now less focused on the wording around matched pairs and more focused on external validity, semantic control, and the breadth of the final engineering recommendation.

## Editorial verdict

Keep the new subtitle. It is more concrete than the previous abstract formulation, aligns with the personal opening, and did not introduce a new concern. The higher panel mean is directionally encouraging but should not be attributed to one sentence with confidence.

The remaining decision is methodological rather than stylistic: either add a concise scope sentence next to the bootstrap interval, or accept that one reviewer will continue to score the article lower because the experiment estimates repeated-call behavior for selected states rather than population-level behavior across arbitrary schemas.

## Artifacts

- Manifest: `neutral-reviews/manifests/json-personal-intro-subtitle-standalone-tri-provider-2026-10-05.json`
- Results: `neutral-reviews/results/2026-10-06T040319-494Z-json-personal-intro-subtitle-standalone-tri-provider-2026-10-05/`
- Blog source commit: `d81c18a`
