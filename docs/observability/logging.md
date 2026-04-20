# Logging

All application logs flow through the structured logger in [`web/lib/obs/logger.ts`](../../web/lib/obs/logger.ts). It emits **ECS-aligned JSON** (Elastic Common Schema field names) in production and pretty-prints in development.

**Why ECS?** Portability to external sinks — Axiom, Elastic, Datadog, and Splunk all understand ECS natively without custom parsing.

---

## Field conventions

Every log line carries these fields (automatically, via `withRequestLog` + AsyncLocalStorage):

| Field | Purpose |
|---|---|
| `@timestamp` | ISO 8601 UTC |
| `log.level` | `debug` \| `info` \| `warn` \| `error` |
| `message` | The log line text |
| `trace.id` | Correlation id (from upstream `traceparent` / `x-request-id` or fresh) |
| `labels.business_id` | Tenant identifier (when in request context) |
| `labels.business_type` | Business-type id |
| `labels.site_slug` | Tenant slug |
| `http.method`, `http.duration`, `http.status_code` | Request shape |
| `url.path` | Request path |
| `error.message`, `error.stack` | On errors |

Log fields NOT in ECS are namespaced under the `labels.` prefix to keep search engines happy.

## Redaction

PII must never ship to logs. [`web/lib/obs/redact.ts`](../../web/lib/obs/redact.ts) sanitises fields with an allowlist + pattern matchers (email, JWT, bearer token, credit card). The logger runs every payload through `redact()` before emission.

If you see `redacted:email` in an Axiom search result, the redactor is catching leaks — they indicate code upstream is logging a raw email. Fix the upstream log call; the redactor is a safety net, not a primary defence.

## Usage

```ts
import { logger } from '@/lib/logger'

logger.info('Lead accepted', { labels: { site_slug: 'nexa-paraguay' } })
logger.warn('Integration adapter retry', { adapter: 'hubspot', attempt: 2 })
logger.error('Composition failed', { error: err })
```

Never use `console.*` — ESLint enforces. See [CLAUDE.md § Error Handling](../../CLAUDE.md#error-handling-mandatory).

---

## Log sinks

Workers `console.log` output is retained for ~3 days. For durable, searchable logs you want a sink. Three options.

### Option A — Axiom (recommended)

Axiom is a Workers-native log sink with ECS-compatible search. Free tier: 0.5 GB/day ingest + 30-day hot retention.

**Setup:**

1. Create an Axiom account and a dataset named `paragu-ai-builder-logs`.
2. Cloudflare dashboard → **Analytics & Logs → Logpush → Create job**:
   - Destination: **Axiom** (native integration) — pick your dataset
   - Dataset to push: **Workers trace events**
   - Fields: select all
3. Apply filter (optional, saves quota):

   ```
   Outcome in ["ok", "exception", "exceededCpu"]
   ```

Every `logger.info` / `warn` / `error` line becomes a structured row in Axiom, queryable with APL.

#### Saved queries

Pin these to an Axiom dashboard.

**Errors in the last hour by route:**
```apl
['paragu-ai-builder-logs']
| where ['log.level'] == 'error'
| where _time > ago(1h)
| summarize count() by ['url.path']
| sort by count_ desc
```

**Slow requests (>1 s) in the last 24 h:**
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

**Trace a single request end-to-end** (see [tracing.md](./tracing.md) for how `trace.id` propagates):
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

Recommended starter set:

| Name | Query | Threshold | Channel |
|---|---|---|---|
| Error rate spike | `count() where log.level == 'error'` | >20 per 5 min | Slack + email |
| Lead ingestion down | `count() where message == 'Lead accepted'` | =0 for 30 min | Slack + email |
| Slow request burst | `count() where message == 'Slow request detected'` | >50 per 5 min | Slack |
| Integration failure rate | `count() where message == 'Integration adapter failed'` | >10 per hour | Slack |

### Option B — R2 cold archive

If you only need retention (e.g. compliance) and don't plan to query often:

1. Create an R2 bucket `paragu-ai-builder-logs`.
2. Logpush → Create job → Destination: **R2** → point to the bucket.
3. Query with the Cloudflare SQL API or `wrangler r2 object get` + jq.

**Cost:** ~$0.015/GB/month storage + $0 egress. Tradeoff: no search UI, no alerting.

### Option C — stdout only (default)

Out of the box:

```bash
cd web
npx wrangler tail --format=pretty
npx wrangler tail --search "lead.accepted"
npx wrangler tail --search "trace.id=<uuid>"
```

Good for active debugging, useless for historical queries. Move to Axiom or R2 when the first incident costs you more than an hour of log diving.

---

_Last reviewed: April 2026. Cross-refs: [tracing.md](./tracing.md) (request-id correlation), [metrics.md](./metrics.md) (counters & time-series)._
