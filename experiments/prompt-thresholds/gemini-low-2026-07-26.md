# Gemini LOW Smoke Test - 2026-07-26

This is a low-budget cross-vendor smoke test for the `low` fixture. It is not primary article evidence and should not be treated as a vendor benchmark. The run uses one sample per candidate state, three search epochs, and a hard cap of 12 calls.

## Harness update

Commit `00b663b` adds Gemini `thinkingConfig.thinkingLevel` support to the threshold harness. The first Gemini attempt showed that leaving Gemini 3 thinking at its default could consume the response budget and produce truncated labels. The final committed run uses `--reasoning-effort minimal`, which maps to Gemini `thinkingLevel: "minimal"`.

Google documentation says Gemini 3 models support `thinkingLevel` values such as `minimal`, `low`, `medium`, and `high`; `minimal` minimizes latency and cost but does not guarantee that thinking is fully off.

## Command

```bash
set -a
. ~/.config/us-blog/gemini.env
set +a

npm run thresholds:low -- \
  --provider gemini \
  --models gemini-3.5-flash-lite,gemini-3.6-flash \
  --samples 1 \
  --epochs 3 \
  --scan 100,300,500 \
  --max-calls 12 \
  --max-output-tokens 128 \
  --reasoning-effort minimal \
  --label gemini-minimal-thinking-20260726 \
  --gzip-jsonl
```

## Final run

Result directory:

`results/2026-07-26T20-54-32-292Z-gemini-minimal-thinking-20260726-low/`

Commit recorded by the result metadata:

`00b663b96a4cd96a95fceaec12cf4095856632d9`

Observed labels:

| Model | Amounts returning LOW | Amounts returning NOT_LOW | Caveat |
| --- | ---: | ---: | --- |
| `gemini-3.5-flash-lite` | `$100`, `$150`, `$175` | `$200`, `$300`, `$500` | The `$175` call returned a long explanation that contained `LOW`; the harness counted it as `LOW` but marked it truncated in the summary. |
| `gemini-3.6-flash` | none | `$100`, `$300`, `$500` | Clean labels, sparse run only. |

Token totals for the final committed run: 738 input tokens, 144 output tokens, 0 thought tokens reported. Using Google paid-tier list prices available on 2026-07-26, the final run is approximately `$0.0007` before any free-tier effect.

## Editorial use

Use this only as a process check: the ambiguous boundary changes outside the OpenAI API path too. Do not present it as a rigorous Anthropic/OpenAI/Gemini comparison. The sample count is intentionally tiny for cost control, and the Flash-Lite long answer shows that provider-specific output discipline is itself part of the operational boundary.
