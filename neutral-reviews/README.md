# Neutral External Reviews

## Three-judge convention

In this repository, a **three-judge review** means one completed review from each
of three distinct provider families:

1. OpenAI
2. Google Gemini
3. Anthropic Claude

Multiple roles or sessions using the same provider do not count as independent
judges. They may be described as a same-model panel, but not as a three-judge
independent review.

Every review record must preserve the requested model, the resolved model, and
the model identifier reported by the provider API. A panel is complete only
when all required responses pass the manifest's output validation. A transport-
level success with truncated or malformed required JSON does not count.

Percentile ranges are reviewer estimates, not measured corpus ranks. Aggregate
scores summarize the panel but do not create statistical precision beyond the
individual reviews.

