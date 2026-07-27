# Low Threshold Bands

Created: 2026-07-27T03:57:19.402Z
Commit: 2fe5ae5f03048782fc7a9c2758a3155b2c814301

| Model | Context | Lower observed bound | Upper observed bound | Width | Lower label | Upper label | Notes |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| `gemini-3.5-flash-lite` | `fact_only` | 312.5 | 332.03 | 19.53 | LOW | NOT_LOW | Estimated band, not an exact threshold. |
| `gemini-3.5-flash-lite` | `retrieved_5_gift_card` | 39.06 | 58.59 | 19.53 | LOW | NOT_LOW | Estimated band, not an exact threshold. |
| `gemini-3.5-flash-lite` | `retrieved_100000_contract` | 12480.47 | 12500 | 19.53 | LOW | NOT_LOW | Estimated band, not an exact threshold. |
| `gemini-3.6-flash` | `fact_only` | 78.13 | 97.66 | 19.53 | LOW | NOT_LOW | Estimated band, not an exact threshold. |
| `gemini-3.6-flash` | `retrieved_5_gift_card` | 0 | 19.53 | 19.53 | LOW | NOT_LOW | Estimated band, not an exact threshold. |
| `gemini-3.6-flash` | `retrieved_100000_contract` | 0 | 20000 | 20000 | LOW | LOW | No LOW/NOT_LOW bracket inside the tested range. |
