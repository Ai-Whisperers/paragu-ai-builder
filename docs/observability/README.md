# Observability

This repo follows the convention of **one file per signal type** — logging, tracing, metrics. Plus this README for cross-cutting concerns (secrets, rollout, future work).

| Signal | File | What it covers |
|---|---|---|
| Logs | [`logging.md`](./logging.md) | Structured logger, ECS field names, Axiom/Logpush, R2 cold archive, stdout fallback, query recipes, alerts |
| Traces | [`tracing.md`](./tracing.md) | Sentry errors + performance + session replay, request-id / W3C traceparent correlation, error boundaries |
| Metrics | [`metrics.md`](./metrics.md) | Cloudflare Analytics Engine, custom metrics, extending the `MetricName` union |

See also:
- [`/ARCHITECTURE.md § observability`](../../ARCHITECTURE.md#observability) — the architectural view
- [`web/lib/obs/*`](../../web/lib/obs/) — source (logger, redact, context, request-id, sentry, metrics)
- Legacy monolith: [`docs/archive/2026-04/OBSERVABILITY.md`](../archive/2026-04/OBSERVABILITY.md) — the single-file predecessor

---

## Secrets needed in production

```bash
# Sentry — required for error tracking
NEXT_PUBLIC_SENTRY_DSN

# Sampling (optional — sensible defaults)
SENTRY_TRACES_SAMPLE_RATE                   # server perf (default 0.1)
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE       # browser perf (default 0.1)
NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_RATE     # replay (default 0.1)

# Logger level / format
LOG_LEVEL=info                              # debug | info | warn | error
LOG_FORMAT=json                             # json (prod) | pretty (dev)
SLOW_REQUEST_THRESHOLD_MS=1000
SLOW_QUERY_THRESHOLD_MS=1000

# Cloudflare Analytics Engine / R2 / Logpush — only if using the CLI directly
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

Set via `npx wrangler secret put <NAME>` for production, or in `web/.env.local` for development.

---

## Activation status

| Phase | Status | Blocker |
|---|---|---|
| A — logger, redaction, AsyncLocalStorage, request-id, ECS field names, lint rule, error boundaries | shipped | — |
| B — Sentry (server + browser + API wrapper + error boundaries) | code-complete | `NEXT_PUBLIC_SENTRY_DSN` secret not yet set (vendor signup required) |
| C — Axiom Logpush | config-documented | Axiom account + Logpush job creation in Cloudflare dashboard |
| D — Analytics Engine metrics | shipped | — |

### Activating in production

```bash
cd web
npx wrangler secret put NEXT_PUBLIC_SENTRY_DSN
npx wrangler secret put SENTRY_TRACES_SAMPLE_RATE                # optional
npx wrangler secret put NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE    # optional

# Verify the deploy picked up observability
curl -s https://paragu-ai.com/api/health?deep=1 | jq .checks
```

Expected `checks[].detail` for observability:
```
sentry=on metrics=on logs=json:info
```

`off` values mean that pipeline is inactive — not broken, just disabled.

---

## Future work

- **OpenTelemetry spans.** We emit trace-ids but not spans. Sentry performance gives basic spans now; proper distributed tracing would adopt `@opentelemetry/api` + a Workers-compatible exporter.
- **Session replay for errors only.** Currently 10% session sampling; could drop to 0% sessions + 100% error replays for cost.
- **Log-based SLO dashboards.** Once Axiom is in place, define formal SLOs (e.g. 99.9% of `/api/leads` in <500 ms) and build alerting off the error budget.
- **PII audit cron.** Scheduled query against Axiom hunting for `redacted:email` matches — they indicate the redactor is catching leaks that shouldn't exist upstream. Zero is the target.
- **Runbooks folder.** One file per pageable alert under [`docs/runbooks/`](../runbooks/) — defined as alerts are set up.

---

_Last reviewed: April 2026._
