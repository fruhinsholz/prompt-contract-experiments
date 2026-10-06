# JSON Production Article Grade and Percentile Panel

Date: 2026-10-05

## Article reviewed

The panel reviewed the published article, **JSON Legibility Is Not Control: When Schema Names Move a Routing Boundary**, at blog source commit `672aa99e0c9c2319674e8eb649254b15604e6194`.

The supplied article body was byte-identical to the production article body. Only the source frontmatter's route and draft-status fields differed, and reviewers were instructed to ignore those metadata fields.

## Protocol

Three independent provider families received the article alone in separate requests:

- OpenAI, requested `gpt-5.6`, reported `gpt-5.6-sol`;
- Google, requested and reported `gemini-3.6-flash`;
- Anthropic, resolved and reported `claude-sonnet-5-5`.

All three received the same scoring dimensions, percentile definition, calibration anchors, and output schema. Prior reviews, scores, author discussion, repository history, and other article versions were excluded. All three responses passed JSON validation on the first run.

The fixed comparison class was English-language, evidence-backed practitioner essays about production AI systems, written for experienced engineers and published on serious independent or company engineering blogs during roughly the preceding three years. Peer-reviewed papers, preprints, marketing, announcements, news commentary, and basic tutorials were excluded.

Percentiles are informed editorial estimates, not measured corpus ranks.

## Results

| Judge | Overall | Percentile | Plausible range | Verdict |
|---|---:|---:|---:|---|
| OpenAI | 8.2 | 82 | 74-88 | Ready |
| Gemini | 8.8 | 91 | 84-96 | Ready |
| Anthropic | 6.7 | 72 | 60-82 | Minor revisions |
| **Mean** | **7.9** | **81.7** | - |  |
| **Median** | **8.2** | **82** | - |  |

The union of the three plausible ranges is **60th to 96th percentile**. The broad union reflects genuine judgment uncertainty, especially about how heavily to penalize narrow external validity and the semantic difference between the key families.

## Dimension scores

| Judge | Technical precision | Empirical rigor | Raw novelty | Framing novelty | Practitioner interest | Narrative | Accessibility | Practical value | Claim calibration |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| OpenAI | 8.6 | 8.4 | 5.2 | 7.8 | 8.3 | 8.7 | 8.6 | 8.4 | 8.8 |
| Gemini | 9.0 | 9.2 | 6.0 | 8.2 | 8.5 | 9.0 | 9.0 | 8.5 | 9.5 |
| Anthropic | 7.4 | 6.9 | 4.6 | 6.0 | 6.5 | 6.8 | 7.4 | 6.3 | 6.9 |
| **Mean** | **8.33** | **8.17** | **5.27** | **7.33** | **7.77** | **8.17** | **8.33** | **7.73** | **8.40** |

## Panel interpretation

The defensible single summary is **about the 82nd percentile** among comparable evidence-backed practitioner essays, with a panel mean score of **7.9/10**.

The strongest comparative advantage is methodological discipline. All three judges emphasized the prospective design, matched comparisons, balanced ordering, guardrails, transition counts, uncertainty intervals, public artifacts, and unusually careful claim boundaries.

The largest comparative limit is external validity. The result covers one proprietary model version, one task, six fixed state texts, two deliberately boundary-adjacent primary states, and one pair of key families that the article itself acknowledges are not strict synonyms.

The main disagreement is how much that limit should reduce the rating:

- Gemini treats the article's prospective evidence and calibration as exceptional for practitioner writing and places it at the 91st percentile.
- OpenAI considers it clearly above average but not exceptional because the underlying result is narrow and unsurprising, placing it at the 82nd percentile.
- Anthropic gives strong credit for transparency but treats the intervention as semantic wording sensitivity rather than a pure rename and questions inference from repeated calls over two selected primary states, placing it at the 72nd percentile.

## Shared cautions

Across the panel, the recurring cautions were:

1. The key families are semantically different, so the experiment is not a pure identifier-only rename.
2. The bootstrap interval quantifies repeated-call variability on the fixed test bed, not generalization to unseen cases, tasks, models, or production traffic.
3. The 45.8% to 70.8% routing result applies to two states deliberately selected near the threshold and should not be read as a production prevalence estimate.
4. The finding is an existence demonstration. It does not estimate how often model-facing schema renames matter across systems.

## Artifacts

- Manifest: `neutral-reviews/manifests/json-production-article-grade-percentile-tri-provider-2026-10-05.json`
- Dry validation: `neutral-reviews/results/2026-10-06T051037-295Z-json-production-article-grade-percentile-tri-provider-2026-10-05/`
- Validated responses: `neutral-reviews/results/2026-10-06T051045-743Z-json-production-article-grade-percentile-tri-provider-2026-10-05/`
- Blog source commit: `672aa99e0c9c2319674e8eb649254b15604e6194`
