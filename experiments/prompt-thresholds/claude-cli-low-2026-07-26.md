# Claude CLI Low-Effort LOW Test, 2026-07-26

This run adds a low-cost Anthropic check through the authenticated Claude CLI on `eric-bee`. It uses the same `LOW` refund classifier fixture as the OpenAI threshold runs.

## Protocol

- Provider path: `claude-cli`
- Requested effort: `low`
- Context: `fact_only`
- Samples per state: `1`
- Temperature: `0`
- Per-call budget cap: `CLAUDE_MAX_BUDGET_USD=0.08` on the pinned run
- Total pinned-run cost reported by Claude CLI: `$0.023489`

Primary pinned command:

```bash
CLAUDE_MAX_BUDGET_USD=0.08 THRESHOLD_REQUEST_TIMEOUT_MS=60000 npm run thresholds:low -- --provider claude-cli --models claude-sonnet-5,claude-opus-4-8 --samples 1 --epochs 3 --scan 100,300,500 --max-calls 12 --reasoning-effort low --label claude-cli-pinned-low-20260726 --gzip-jsonl
```

## Result

The CLI accepted the requested model names, but low effort did not consistently execute on the requested model. The raw records preserve both the requested model and the response model reported by Claude CLI.

| Requested model | Response models observed | Majority flip band in this sparse run |
| --- | --- | --- |
| `claude-sonnet-5` | `claude-haiku-4-5` | `LOW` at `$175`, `NOT_LOW` at `$200` |
| `claude-opus-4-8` | `claude-opus-4-8` for `$100`; `claude-haiku-4-5` for later calls | `LOW` at `$400`, `NOT_LOW` at `$425`; non-monotonic `LOW` again at `$500` in the initial scan |

## Interpretation

This is useful as a cost-bounded Claude CLI smoke test, not as a clean Sonnet-versus-Opus comparison. The most important observation is operational: at `low` effort, Claude Code may route or account calls through a cheaper response model even when a higher model is requested. For article evidence, the run still supports the boundary claim because the same underspecified prompt produced implicit dollar thresholds, but the model-routing caveat must be disclosed if the result is cited.

The cleaner next run, if needed, should use the Anthropic API directly or a Claude CLI mode that guarantees the served model, then repeat the same fixture with more than one sample per state.
