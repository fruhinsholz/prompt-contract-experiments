# Low Analysis

Both labels can be defensible because the prompt asks the model to resolve `low` without a dollar threshold. A consumer refund amount can be small relative to enterprise spend and still large relative to another operational scale. If context variants are enabled, retrieved context should be treated as a perturbation test, not as the primary fixture, because it introduces nearby text that is plausible in an assembled prompt but is neither claimant fact nor refund policy.

Deterministic replacement policy: define the boundary outside the model, for example `LOW iff amount_usd <= 100`, version that threshold, log the version used for each decision, and let the model classify only facts that do not determine the approval boundary.
