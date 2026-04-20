# Observability setup

This doc covers **Phases B–D** of the observability architecture — the pieces
that depend on external services (Sentry, Axiom, Cloudflare Logpush, Analytics
Engine). The in-process logger (`lib/obs/logger.ts`), redaction, request-id
correlation, and error boundaries were all delivered in Phase A and work with
zero configuration.

See also:
- `docs/DEBUGGING.md` — day-to-day runbook for reading logs, using
  `/api/health` and `/api/diagnostics`.
- `lib/obs/*` — the structured-logging primitives.
- `CLAUDE.md` — overall architecture.

---

## 1. Sentry (errors + client RUM)

**Why Sentry and not just logs?** Error grouping, deduplication, release
tracking, source-map unwinding, assignee + alert routing. Logs tell you a
thing happened; Sentry tells you "this is error #47, here are the 200 sessions
affected, introduced in release `abc123`, assigned to Maya."

### Setup

1. Create a Sentry project (Next.js template).
2. Add to environment (both local `.env.local` and production secrets):

   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://<public-key>@<org>.ingest.sentry.io/<project>
   SENTRY_TRACES_SAMPLE_RATE=0.1                 # server performance traces
   NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1     # browser performance traces
   NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_RATE=0.1   # session replay (10% default)
   ```

3. Deploy. `instrumentation.ts` boots Sentry server-side on the first request;
   `instrumentation-client.ts` boots it in the browser. Without a DSN, both
   are no-ops — no change to local dev.

### What gets captured

| Source | Mechanism |
|--------|-----------|
| Server render errors | `onRequestError` hook in `instrumentation.ts` |
| Unhandled API route errors | `withRequestLog` catches + `captureException` with route tag |
| Client render errors | `app/error.tsx`, `app/global-error.tsx`, `[business]/error.tsx`, `s/[locale]/[site]/error.tsx` all call `captureException` |
| Manual captures | `import { captureException } from '@/lib/obs/sentry'` |

**Warn/info logs do NOT ship to Sentry** — they stay in the log pipeline (see
§2). Only unhandled exceptions and explicitly captured events do.

### Cost

Free tier: 5 000 errors + 10 000 performance transactions + 50 replays per
month. At current volume that's plenty of headroom.

---

## 2. Axiom via Cloudflare Logpush (structured logs)

**Why a log sink?** Workers `console.log` output is retained for ~3 days. If
you want to answer "show me all errors in the last 7 days grouped by route"
you need a durable searchable sink.

### Option A: Axiom (recommended — simplest, free tier)

Axiom is a Workers-native log sink with ECS-compatible search. Free tier:
0.5 GB/day ingest + 30-day hot retention.

#### Setup

1. Create an Axiom account and a dataset named `paragu-ai-builder-logs`.
2. In the Cloudflare dashboard → Analytics & Logs → Logpush → Create job:
   - Destination: **Axiom** (native integration, pick your dataset)
   - Dataset to push: **Workers trace events**
   - Fields: select all (default)
3. Apply filter (optional, saves quota):

   ```
   Outcome in ["ok", "exception", "exceededCpu"]
   ```

That's it — every `logger.info` / `warn` / `error` line your Workers emit
becomes a structured row in Axiom, queryable with APL.

#### Saved queries

Drop these into Axiom as saved queries and pin them to a dashboard.

**Errors in the last hour by route:**

```apl
['paragu-ai-builder-logs']
| where ['log.level'] == 'error'
| where _time > ago(1h)
| summarize count() by ['url.path']
| sort by count_ desc
```

**Slow requests (>1s) in the last 24h:**

```apl
['paragu-ai-builder-logs']
| where message == 'Slow request detected'
| where _time > ago(24h)
| project _time, ['url.path'], ['http.duration'], ['trace.id']
| sort by ['http.duration'] desc
```

**Failed lead submissions by adapter:**

```apl
['paragu-ai-builder-logs']
| where message == 'Integration adapter failed'
| where _time > ago(24h)
| summarize failures=count() by adapter
| sort by failures desc
```

**Trace a single request end-to-end:**

```apl
['paragu-ai-builder-logs']
| where ['trace.id'] == 'REPLACE-WITH-REQUEST-ID'
| sort by _time asc
```

**Per-business compose latency p95:**

```apl
['paragu-ai-builder-logs']
| where message == 'Composition completed'
| where _time > ago(24h)
| summarize p95=percentile(durationMs, 95) by ['labels.business_type']
| sort by p95 desc
```

#### Alerts

Axiom supports alerts on saved queries. Recommended starter set:

| Name | Query | Threshold | Channel |
|------|-------|-----------|---------|
| Error rate spike | `count() where log.level == 'error'` | >20 per 5min | Slack + email |
| Lead ingestion down | `count() where message == 'Lead accepted'` | =0 for 30min | Slack + email |
| Slow request burst | `count() where message == 'Slow request detected'` | >50 per 5min | Slack |
| Integration failure rate | `count() where message == 'Integration adapter failed'` | >10 per hour | Slack |

### Option B: R2 cold archive (cheap, less searchable)

If you only need log retention (e.g. for compliance) and don't plan to query
often, skip Axiom and push straight to R2:

1. Create an R2 bucket `paragu-ai-builder-logs`.
2. Logpush → Create job → Destination: **R2** → point to the bucket.
3. Query with the Cloudflare SQL API or via `wrangler r2 object get` + jq.

**Cost:** ~$0.015/GB/month storage + $0 egress. Tradeoff: no search UI, no
alerting — you'll write your own queries.

### Option C: stdout-only (default, do-nothing)

Out of the box, you can still tail logs live with `wrangler tail`:

```bash
cd web
npx wrangler tail --format=pretty
npx wrangler tail --search "lead.accepted"
npx wrangler tail --search "trace.id=<uuid>"
```

Good for active debugging, useless for historical queries. Move to Axiom or
R2 when the first incident costs you more than an hour of log diving.

---

## 3. Analytics Engine (metrics)

Custom time-series metrics via the Workers binding. See
`lib/obs/metrics.ts` for the writer, `wrangler.toml` for the binding.

### What we emit today

| Metric | Dimensions | Values | When |
|--------|------------|--------|------|
| `lead.submitted` | siteSlug, source | 1 | Every /api/leads POST |
| `lead.accepted` | siteSlug | 1 | Lead persisted or forwarded OK |
| `lead.rejected` | siteSlug, reason | 1 | All destinations failed |
| `integration.call` | siteSlug, adapter, outcome | 1 | Per adapter attempt |
| `compose.duration` | businessType, pageType (flat) / siteSlug, vertical, locale, pageSlug (vertical) | duration_ms | Every composition |

### Querying

```sql
-- Top 10 tenants by inbound leads in the last 24h
SELECT index1 AS metric, blob1 AS site, count() AS total
FROM paragu_ai_metrics
WHERE timestamp > now() - INTERVAL '1' DAY
  AND blob1 LIKE 'siteSlug=%'
  AND index1 = 'lead.submitted'
GROUP BY site
ORDER BY total DESC
LIMIT 10

-- p50/p95 compose duration by business type
SELECT blob1 AS type,
       quantileWeighted(0.5)(double1, _sample_interval) AS p50,
       quantileWeighted(0.95)(double1, _sample_interval) AS p95
FROM paragu_ai_metrics
WHERE index1 = 'compose.duration'
  AND timestamp > now() - INTERVAL '1' HOUR
GROUP BY type
```

Run via:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --data "SELECT ..."
```

### Cost

Analytics Engine writes are ~$0.25/million. At current volume this is
effectively free ($1–2/month at 10 k writes/day).

### Extending

To add a new metric:

1. Add its name to the `MetricName` union in `lib/obs/metrics.ts`.
2. Call `metrics.inc('my.metric', { dim: 'value' })` at the emit point.
3. Document it in the table above.

---

## 4. Secrets needed in production

```bash
# Required for Sentry
NEXT_PUBLIC_SENTRY_DSN

# Optional — default 10% sampling is fine
SENTRY_TRACES_SAMPLE_RATE
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_RATE

# Required for log-level control
LOG_LEVEL=info          # debug | info | warn | error
LOG_FORMAT=json         # json | pretty
SLOW_REQUEST_THRESHOLD_MS=1000
SLOW_QUERY_THRESHOLD_MS=1000

# Optional — only if using Cloudflare API from scripts
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

Set via `npx wrangler secret put <NAME>` for production, or in `.env.local`
for development.

---

## 5. Rollout checklist

- [x] Phase A — structured logger, redaction, AsyncLocalStorage, request-id
      propagation, ECS field names, lint rule, error boundaries
- [x] Phase B — Sentry wired (server + browser + API route wrapper + error
      boundaries). **Set `NEXT_PUBLIC_SENTRY_DSN` secret to activate.**
- [x] Phase C — Logpush config documented. **Execute Axiom signup + Logpush
      job creation in the Cloudflare dashboard.**
- [x] Phase D — Analytics Engine binding + wrapper + emit at lead / compose
      / integration paths. Query templates documented.

### Activating in production

```bash
cd web
# Set the DSN (once, interactive)
npx wrangler secret put NEXT_PUBLIC_SENTRY_DSN

# Optional sampling overrides
npx wrangler secret put SENTRY_TRACES_SAMPLE_RATE
npx wrangler secret put NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE

# Verify the deploy picked up observability config
curl -s https://paragu-ai.com/api/health?deep=1 | jq .checks
```

Expected `checks[].detail` for observability:
```
sentry=on metrics=on logs=json:info
```

Any `off` values mean that pipeline is inactive — not broken, just disabled.

Anything below the rollout checklist is future-state.

## 6. Future work

- **OpenTelemetry spans.** We're emitting trace-ids but not spans. Sentry
  performance gives basic spans now; for proper distributed tracing we'd
  adopt `@opentelemetry/api` + a Workers-compatible exporter.
- **Session replay for errors only.** Currently set to 10% session sampling;
  could drop to 0% sessions + 100% error replays for cost.
- **Log-based SLO dashboards.** Once Axiom is in place, define formal SLOs
  (e.g. 99.9% of /api/leads in <500ms) and build alerting off the error
  budget.
- **PII audit cron.** Run a scheduled query against Axiom hunting for
  `redacted:email` matches — they indicate the redactor is catching leaks
  that shouldn't exist upstream. Zero is the target.
