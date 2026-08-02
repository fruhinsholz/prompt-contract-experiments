<!-- generated:json-input-low-table manifest:experiments/json-input-low/manifest.json source_runs:openai_gpt55_gpt56_fixed_grid_s30,gemini_100k_dense_s30,gemini_5_s10 hash:89f6ca5b8c3819cc135d953f3dfa131583480ecbeaef37882c40f521c88b4e3d -->

Highest tested claim amount classified as `LOW` by majority vote, compared with the no-context LOW boundary.

| Model | Test | No added context | Prose context | Raw JSON context | Typed JSON context | $100 LOW rule |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `gpt-5.5` | $100k contract | ~$1,000 | $20,000 ↑ 20x | $5,000 ↑ 5x | $20,000 ↑ 20x | $100 ↓ 0.1x |
| `gpt-5.6` | $100k contract | ~$100 | $20,000 ↑ 200x | $20,000 ↑ 200x | $20,000 ↑ 200x | $100 → 1x |
| `gemini-3.5-flash-lite` | $100k contract | ~$90 | $18,000 ↑ 200x | $50,000 ↑ 560x | $50,000 ↑ 560x | $20,000 ↑ 220x |
| `gpt-5.5` | $5 gift card | ~$1,000 | $100 ↓ 0.1x | $100 ↓ 0.1x | $100 ↓ 0.1x | $100 ↓ 0.1x |
| `gpt-5.6` | $5 gift card | ~$100 | < $100 | $50 ↓ 0.5x | $25 ↓ 0.25x | $100 → 1x |
| `gemini-3.5-flash-lite` | $5 gift card | ~$90 | $5 ↓ 0.06x | $5 ↓ 0.06x | $5 ↓ 0.06x | $100 ↑ 1.1x |

Caption: highest tested claim amount classified as `LOW` by majority vote with retrieved context present. The `No added context` column comes from the LOW retrieved-context threshold runs; the other columns come from the manifest-declared JSON input runs. Generated from `experiments/json-input-low/manifest.json`. `< $100` means no tested amount, including `$100`, received a majority `LOW` classification.

<!-- /generated:json-input-low-table -->
