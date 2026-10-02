# JSON Editorial Full-Package Percentile Review

Date: 2026-10-02

## Scope

Three independent provider families received the same complete publication
package:

- the main article at source commit `06a2f109867605dc0ff5958582680169cd3c1a35`;
- the technical deep dive;
- the prospective public-repository packet at commit `6a79286`;
- the historical exploratory packet, including the opaque A/B/C control.

Prior reviews and scores were excluded. Reviewers were instructed not to use or
infer anything about the author or submitter.

The fixed comparison class was English-language, evidence-backed practitioner
essays about production AI systems, written for experienced engineers and
published on serious independent or company engineering blogs during roughly
the preceding three years. Peer-reviewed papers, preprints, marketing,
announcements, news commentary, and basic tutorials were excluded.

Percentiles are informed estimates, not measured corpus ranks.

## Results

| Judge | Complete package | Plausible range | Main article | Empirical and audit quality |
|---|---:|---:|---:|---:|
| OpenAI GPT-5.6-sol | 90 | 85-94 | 87 | 94 |
| Gemini 3.6 Flash | 95 | 92-98 | 91 | 97 |
| Claude Sonnet 5.5 | 86 | 78-92 | 78 | 91 |
| **Mean** | **90.3** | - | **85.3** | **94.0** |
| **Median** | **90** | - | **87** | **94** |

## Panel interpretation

- The most defensible single summary is **around the 90th percentile** for the
  complete package.
- Individual estimates span the **86th to 95th percentiles**. The union of the
  judges' plausible ranges is **78th to 98th**, showing that the absolute rank
  is uncertain even though all three judges place the package well above the
  reference-class median.
- The main article alone is estimated around the **85th-87th percentile**.
- Empirical discipline and auditability are the clearest comparative advantage,
  with a unanimous central estimate above the **90th percentile** and a panel
  median of **94**.

## Shared rationale

All three judges identified prospective design discipline, raw evidence,
provenance, and traceability from article claims to repository artifacts as the
package's strongest comparative advantage.

All three also identified the same main comparative limit: narrow external
validity. The central result is an existence demonstration on one proprietary
model interface and one task, using selected threshold-adjacent states and two
semantically distinct key families informed by prior exploration.

## Artifacts

- Manifest:
  `neutral-reviews/manifests/json-editorial-full-package-percentile-tri-provider-2026-10-02.json`
- Validated responses:
  `neutral-reviews/results/2026-10-02T085819-679Z-json-editorial-full-package-percentile-tri-provider-2026-10-02/`
- Dry validation:
  `neutral-reviews/results/2026-10-02T085808-844Z-json-editorial-full-package-percentile-tri-provider-2026-10-02/`
