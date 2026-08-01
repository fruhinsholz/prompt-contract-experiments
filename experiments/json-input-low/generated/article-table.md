<!-- generated:json-input-low-table manifest:experiments/json-input-low/manifest.json source_runs:openai_gpt55_gpt56_fixed_grid_s30,gemini_100k_dense_s30,gemini_5_s10 hash:15e8f209dd226cf04903ea94faa219ef4bcfcc996ad19d0c3765572ef628ee6c -->

Highest tested claim amount classified as `LOW` by majority vote.

| Provider | Model | Test | Prose | Raw JSON | Typed JSON | Typed JSON + enforcement |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| OpenAI | `gpt-5.5` | $100k contract | $20,000 | $5,000 | $20,000 | $100 |
| OpenAI | `gpt-5.6` | $100k contract | $20,000 | $20,000 | $20,000 | $100 |
| Gemini | `gemini-3.5-flash-lite` | $100k contract | $18,000 | $50,000 | $50,000 | $20,000 |
| OpenAI | `gpt-5.5` | $5 gift card | $100 | $100 | $100 | $100 |
| OpenAI | `gpt-5.6` | $5 gift card | none | $50 | $25 | $100 |
| Gemini | `gemini-3.5-flash-lite` | $5 gift card | $5 | $5 | $5 | $100 |

Caption: highest tested claim amount classified as `LOW` by majority vote with retrieved context present. Generated from `experiments/json-input-low/manifest.json`. `none` means no tested amount had majority `LOW`.

<!-- /generated:json-input-low-table -->
