# JSON Article Three-Version Comparison

Date: 2026-09-30  
Panel: OpenAI GPT-5.6, Google Gemini 3.6 Flash, Anthropic Claude Sonnet 5.5  
Run: `results/2026-10-01T030157-203Z-json-three-version-comparison-tri-provider-2026-09-30/`

## Versions

- **A, concise:** `json-legibility-is-not-control-revised`
- **B, narrative:** `json-legibility-is-not-control-narrative`
- **C, editorial:** `json-legibility-is-not-control-editorial`

All judges received the same technical appendix and the same repository audit packet at public evidence commit `6a79286`. They received no prior scores, chronology, target verdict, or author discussion.

## Overall Scores

| Judge | A: concise | B: narrative | C: editorial | Ranking | Winner |
|---|---:|---:|---:|---|---|
| OpenAI GPT-5.6 | 8.4 | 8.1 | 8.7 | C, A, B | C |
| Gemini 3.6 Flash | 9.1 | 8.4 | 9.0 | A, C, B | A |
| Claude Sonnet 5.5 | 7.5 | 7.1 | 7.8 | C, A, B | C |
| **Panel mean** | **8.33** | **7.87** | **8.50** | **C, A, B** | **C** |

## Mean Criterion Scores

| Criterion | A: concise | B: narrative | C: editorial |
|---|---:|---:|---:|
| Empirical rigor | 8.30 | 8.20 | **8.60** |
| Technical precision | 8.63 | 8.17 | **8.90** |
| Narrative force | 8.10 | 7.97 | **8.17** |
| Practical value | 8.47 | 8.30 | **8.57** |
| Originality | 7.63 | 7.53 | **7.73** |
| Calibration of claims | 8.10 | 7.60 | **8.93** |
| Publication readiness | 8.30 | 7.63 | **8.70** |
| Readability | **8.63** | 8.07 | 8.57 |
| Opening effectiveness | **8.30** | 7.37 | 8.20 |
| Appendix integration | 8.80 | 8.47 | **8.97** |

## Panel Verdict

Use **Version C, the editorial draft, as the public-version basis**.

Two of three judges selected C. Its mean score was highest, and it led the panel on empirical rigor, technical precision, practical value, originality, claim calibration, publication readiness, narrative force, and appendix integration. Its main advantage is not added polish. It places the selection caveat beside the headline routing result, says the observed review rates are not production-traffic estimates, states what was held fixed, and discloses the fictional opening immediately.

Version A remains the strongest source for the opening. Gemini selected it outright, and the panel gave it the highest mean scores for readability and opening effectiveness. Its enum-handle comparison is more direct and technically grounded than either fictional vignette.

Version B ranked last for every judge. Its delayed disclosure after the apparent deployment consequence creates avoidable ambiguity, and the longer fictional incident adds narrative length without adding evidence.

## Highest-Value Revision

The shared unresolved issue is provenance of stimulus selection. The public version should say early that earlier archived pilots and calibration work informed the selection of:

- the two key families,
- the boundary states,
- and the success criterion.

The 720-call run should therefore be described as a **preregistered prospective confirmation on a developed test bed**, not as an independent first discovery.

The best next draft is a narrow hybrid:

1. Keep C's body, caveats, fixed-variable definition, and immediate separation between fiction and evidence.
2. Consider restoring A's enum-handle opening or its conceptual core.
3. Add the early provenance sentence above.
4. Preserve the statement that Jev's documented interface exposes no temperature control and that no temperature parameter was sent, while ensuring the evidence packet makes the runner behavior directly auditable.

## Evidence Consistency

All judges found all three articles consistent with the shared evidence. They agreed that the experiment supports a controlled existence result for one Jev version, one task, two deliberately constructed key families, six states, and an experimental threshold. It does not estimate production prevalence, establish score calibration, show a mechanism inside Jev, or prove that arbitrary identifier renames generally produce the same effect.

Percentile ranges in the individual reviews are reviewer estimates, not measured corpus ranks.
