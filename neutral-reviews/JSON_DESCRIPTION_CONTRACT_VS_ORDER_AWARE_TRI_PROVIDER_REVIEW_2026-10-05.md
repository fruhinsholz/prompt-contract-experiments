# JSON Description Contract vs Order-Aware Draft

Date: 2026-10-05

Blog source commit: `0cb264fae1253124f55ce2a182091f914e0ebc41`

## Protocol

The panel used three provider families:

- OpenAI `gpt-5.6`, reported as `gpt-5.6-sol`
- Google `gemini-3.6-flash`
- Anthropic `latest`, resolved and reported as `claude-sonnet-5-5`

Each provider received Article A alone, Article B alone, and then both articles in a separate comparison request. No request included prior scores, other reviewers' opinions, author discussion, or conversation history. All nine responses passed required JSON validation.

Article A is the unchanged description-contract draft. Article B preserves the primary experiment and adds the retrospective serialization-order analysis, an investigation-based opening, and order-aware engineering guidance.

## Standalone Scores

| Judge | Article A | Verdict | Article B | Verdict | Delta B - A |
|---|---:|---|---:|---|---:|
| OpenAI | 8.7 | Publish | 8.6 | Publish | -0.1 |
| Gemini | 8.7 | Publish | 9.2 | Publish | +0.5 |
| Claude | 6.8 | Publish with revisions | 6.9 | Publish with revisions | +0.1 |
| **Mean** | **8.07** | | **8.23** | | **+0.17** |

### Standalone mean by dimension

| Dimension | Article A | Article B | Delta B - A |
|---|---:|---:|---:|
| Empirical rigor | 8.07 | 8.17 | +0.10 |
| Technical precision | 8.20 | 8.57 | +0.37 |
| Narrative force | 8.47 | 8.33 | -0.14 |
| Practical value | 8.17 | 8.67 | +0.50 |
| Originality | 7.63 | 7.73 | +0.10 |
| Calibration of claims | 8.60 | 8.77 | +0.17 |
| Publication readiness | 8.00 | 7.97 | -0.03 |
| Main-article readability | 8.60 | 8.80 | +0.20 |
| Auditability from article alone | 6.53 | 6.73 | +0.20 |

The independent standalone results slightly favor Article B. Its largest gains are practical value and technical precision. Article A retains a small narrative-force advantage.

Two standalone judges identified the same unsupported formulation in Article B: the opening says serialization order moved the score "even more," but the article compares a variance share and score ranges with a paired mean key-family contrast. Those are not directly commensurate effect estimates.

## Direct Comparison

| Judge | A | B | Winner | Order finding effect | Confidence |
|---|---:|---:|---|---|---|
| OpenAI | 8.9 | 9.0 | **B** | Mixed | Medium |
| Gemini | 9.3 | 8.9 | **A** | Dilutes | High |
| Claude | 7.7 | 7.9 | **B** | Improves | Medium |
| **Mean** | **8.63** | **8.60** | **B, 2 of 3** | | |

The direct-comparison mean is effectively tied, while the preference vote is **2 to 1 for Article B**.

### Convergent tradeoff

- Article A has the cleaner single thesis, sharper rhetorical economy, and stronger closing line.
- Article B is more transparent about the experimental structure: each state-family cell combines six serializations repeated ten times, and order accounts for most observed score variance in the four primary cells.
- Article B gives practitioners broader and more actionable guidance, but it gives a retrospective finding enough prominence to compete with the preregistered result.
- All three comparison judges agree that the order finding is technically material. They disagree about whether it belongs this prominently in the reader-facing essay.

## Decision

Article B is the better evidence-complete basis, but its current opening overstates the comparison between the order effect and the key-family effect. The panel does not support publishing Article A unchanged while omitting the order result. It supports retaining the order disclosure while restoring tighter hierarchy between the preregistered primary result and the retrospective secondary result.

## Audit Artifacts

- Standalone A manifest: `neutral-reviews/manifests/json-description-contract-standalone-tri-provider-2026-10-05.json`
- Standalone B manifest: `neutral-reviews/manifests/json-order-aware-standalone-tri-provider-2026-10-05.json`
- Direct comparison manifest: `neutral-reviews/manifests/json-description-contract-vs-order-aware-tri-provider-2026-10-05.json`
- Standalone A results: `neutral-reviews/results/2026-10-06T013641-896Z-json-description-contract-standalone-tri-provider-2026-10-05/`
- Standalone B results: `neutral-reviews/results/2026-10-06T013647-539Z-json-order-aware-standalone-tri-provider-2026-10-05/`
- Direct comparison results: `neutral-reviews/results/2026-10-06T013839-435Z-json-description-contract-vs-order-aware-tri-provider-2026-10-05/`
