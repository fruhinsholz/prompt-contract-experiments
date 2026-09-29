# JSON vs Operational Contract: Tri-provider Review

Date: 2026-09-29

## Panel

| Provider | Requested model | Provider-reported model | JSON article | Operational Contract |
|---|---|---|---:|---:|
| OpenAI | `gpt-5.6` | `gpt-5.6-sol` | 8.5 | 6.4 |
| Google | `gemini-3.6-flash` | `gemini-3.6-flash` | 9.0 | 6.2 |
| Anthropic | `latest` | `claude-sonnet-5-5` | 7.8 | 6.2 |
| **Mean** | | | **8.4** | **6.3** |

An earlier Anthropic response hit the 5,000-token limit and contained truncated,
invalid JSON. It is excluded. The final panel is a clean rerun with an 8,000-
token limit and required JSON validation for every provider.

## Consensus

All three providers selected the JSON article as the stronger essay with high
confidence.

The JSON article received one `publish` verdict and two
`publish_with_revisions` verdicts. A defensible synthesis is:

- score: **8.4/10**;
- status: **publishable with revisions**;
- estimated standing: approximately the **top 10-20%** of serious practitioner
  essays, with reviewer ranges spanning roughly the 80th to 97th percentiles;
- strongest dimension: calibration of claims, panel mean **9.2**;
- weakest dimensions: originality **7.9** and narrative force **8.0**.

The previous 8.8/10 result came from three role-separated OpenAI instances. It
is useful as a same-model editorial panel, but it is superseded as the
independent-review score.

## Main remaining issues

1. The evidence covers one proprietary model, one task family, four selected
   boundary states, and a small number of key families.
2. The main key-family contrast is a plausible semantic reframing, not a pure
   synonym or symbol-only rename.
3. The bootstrap estimand, pairing mechanics, and inferential unit need clearer specification given
   only four state clusters.
4. The article can be shortened and should foreground the existence result more
   directly.
5. Broader replication and a labeled or production-like case set would be the
   highest-value evidence extension, but are not required for the narrow
   existence claim.

The public experiment repository was already available, but the reviewed draft
still described its audit commit as internal. That stale sentence was corrected
before the final panel. The public audit surface is linked at commit `22f3810`.

## Audit sources

- Final validated tri-provider run:
  `neutral-reviews/results/2026-09-29T153544-671Z-json-vs-operational-contract-tri-provider-final-2026-09-29/`
- Manifest:
  `neutral-reviews/manifests/json-vs-operational-contract-tri-provider-2026-09-29.json`
