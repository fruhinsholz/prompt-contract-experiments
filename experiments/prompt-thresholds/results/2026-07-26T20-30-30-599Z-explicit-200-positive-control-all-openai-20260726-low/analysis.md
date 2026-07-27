# Explicit 200 Positive Control Analysis

This positive control pins the LOW boundary in the prompt: LOW iff amount_usd <= 200, otherwise NOT_LOW. Across the tracked OpenAI models and sampled amounts, every completion matched the pinned deterministic rule. This validates the harness and examples; it does not make the vague prompt reliable.
