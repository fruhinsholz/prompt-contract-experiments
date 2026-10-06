# JSON Production Article Web-Researched Jev Grade and Percentile Panel

Date: 2026-10-05

## Article reviewed

The panel reviewed the published article, **JSON Legibility Is Not Control: When Schema Names Move a Routing Boundary**, at blog source commit `672aa99e0c9c2319674e8eb649254b15604e6194`.

The supplied article body was the same body used in the preceding production-article panel. Reviewers were instructed to ignore the draft route and status fields in the source frontmatter.

## Protocol

Three independent provider families first researched Jev from current official TypeSafe sources and then evaluated the article with the same dimensions, reference class, percentile anchors, and output schema as the preceding production-article panel:

- OpenAI, requested `gpt-5.6`, reported `gpt-5.6-sol`;
- Google, requested and reported `gemini-3.6-flash`;
- Anthropic, resolved and reported `claude-sonnet-5-5`.

Prior reviews, scores, author discussion, repository history, and other article versions were excluded. Product statements were to be distinguished from independently demonstrated facts. All final responses passed JSON validation.

Web use was verified from provider response metadata rather than accepted from reviewer self-report:

- OpenAI executed three native `web_search` calls restricted to `typesafe.ai` and its subdomains.
- Anthropic executed two native `web_search_20250305` calls restricted to `typesafe.ai` and its subdomains.
- Gemini's first combined response contained no grounding metadata and was excluded. A provider-only retry used Gemini URL Context; both `https://typesafe.ai/` and `https://typesafe.ai/blog/introducing-system-one-models-and-jev` returned `URL_RETRIEVAL_STATUS_SUCCESS`.

The fixed comparison class remained English-language, evidence-backed practitioner essays about production AI systems, written for experienced engineers and published on serious independent or company engineering blogs during roughly the preceding three years. Peer-reviewed papers, preprints, marketing, announcements, news commentary, and basic tutorials were excluded.

Percentiles are informed editorial estimates, not measured corpus ranks.

## Results

| Judge | Overall | Percentile | Plausible range | Verdict |
|---|---:|---:|---:|---|
| OpenAI | 8.4 | 86 | 79-91 | Minor revisions |
| Gemini | 9.1 | 92 | 85-96 | Ready |
| Anthropic | 6.4 | 68 | 52-80 | Minor revisions |
| **Mean** | **8.0** | **82.0** | - |  |
| **Median** | **8.4** | **86** | - |  |

The union of the three plausible ranges is **52nd to 96th percentile**. The point estimates are more polarized than in the preceding panel, but the panel mean percentile is effectively unchanged.

## Comparison with the preceding panel

| Judge | Previous overall | Web-researched overall | Previous percentile | Web-researched percentile |
|---|---:|---:|---:|---:|
| OpenAI | 8.2 | 8.4 | 82 | 86 |
| Gemini | 8.8 | 9.1 | 91 | 92 |
| Anthropic | 6.7 | 6.4 | 72 | 68 |
| **Mean** | **7.9** | **8.0** | **81.7** | **82.0** |

These are independent stochastic evaluations, so score movements are not causal estimates of the effect of web research.

## Dimension scores

| Judge | Technical precision | Empirical rigor | Raw novelty | Framing novelty | Practitioner interest | Narrative | Accessibility | Practical value | Claim calibration |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| OpenAI | 8.6 | 8.3 | 6.8 | 8.5 | 8.7 | 8.8 | 8.7 | 8.8 | 8.9 |
| Gemini | 9.2 | 9.4 | 6.8 | 9.0 | 9.1 | 9.0 | 9.2 | 9.3 | 9.5 |
| Anthropic | 7.0 | 6.5 | 4.0 | 5.5 | 6.5 | 7.5 | 7.5 | 6.0 | 6.5 |
| **Mean** | **8.27** | **8.07** | **5.87** | **7.67** | **8.10** | **8.43** | **8.47** | **8.03** | **8.30** |

## Effect of researching Jev

The research strengthened the relevance of the experiment for all three judges. They agreed that Jev is intentionally positioned as a typed probabilistic decision primitive for classification, routing, scoring, and threshold-based application behavior. They also agreed that TypeSafe's calibration and consistency statements are vendor claims, not guarantees of semantic invariance under renamed model-visible labels.

The research did not resolve the main editorial disagreement:

- **Gemini** treated the article as a direct and unusually rigorous test of the gap between TypeSafe's structural contract and semantic stability, placing it at the 92nd percentile.
- **OpenAI** credited the product fit and practical importance but retained the distinction between a model-visible wording change and a harmless enum rename, placing it at the 86th percentile.
- **Anthropic** found the result less surprising after reading TypeSafe's own documentation about literal question wording, model jaggedness, and choice-order sensitivity. It also continued to penalize the two-state repeated-call inference and lack of an opaque-key or cross-model control, placing the article at the 68th percentile.

## Panel interpretation

The most defensible summary remains **about the 82nd percentile** among comparable evidence-backed practitioner essays, now with a panel mean score of **8.0/10**.

The strongest comparative advantage remains methodological discipline combined with an operationally appropriate test bed. Jev is designed for exactly the kind of typed probabilistic routing boundary used in the experiment.

The largest comparative limit remains inferential reach: one returned Jev version, one task, six selected state texts, two boundary-adjacent primary states, and two key families that are not strict synonyms. Official product context makes the question more relevant, but it does not turn the intervention into a semantically neutral identifier rename.

## Artifacts

- Current manifest: `neutral-reviews/manifests/json-production-article-jev-web-researched-grade-percentile-tri-provider-2026-10-05.json`
- Initial tri-provider run, including the exact OpenAI and Anthropic manifest snapshot: `neutral-reviews/results/2026-10-06T051947-180Z-json-production-article-jev-web-researched-grade-percentile-tri-provider-2026-10/`
- Gemini URL Context validated retry: `neutral-reviews/results/2026-10-06T052332-073Z-json-production-article-jev-web-researched-grade-percentile-gemini-url-context-r/`
- Dry validation: `neutral-reviews/results/2026-10-06T051935-198Z-json-production-article-jev-web-researched-grade-percentile-tri-provider-2026-10/`
- Blog source commit: `672aa99e0c9c2319674e8eb649254b15604e6194`
