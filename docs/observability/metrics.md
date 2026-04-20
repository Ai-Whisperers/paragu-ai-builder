# Metrics

Custom time-series metrics via the Cloudflare **Analytics Engine** Workers binding. See [`web/lib/obs/metrics.ts`](../../web/lib/obs/metrics.ts) for the writer and [`web/wrangler.toml`](../../web/wrangler.toml) for the binding.

---

## What we emit today

| Metric | Dimensions | Value | When |
|---|---|---|---|
| `lead.submitted` | `siteSlug`, `source` | 1 | Every `/api/leads` POST |
| `lead.accepted` | `siteSlug` | 1 | Lead persisted or forwarded successfully |
| `lead.rejected` | `siteSlug`, `reason` | 1 | All destinations failed |
| `integration.call` | `siteSlug`, `adapter`, `outcome` | 1 | Per adapter attempt (HubSpot / Calendly / Mailchimp / GA4 / …) |
| `compose.duration` | `businessType` / `siteSlug` / `vertical` / `locale` / `pageSlug` | `duration_ms` | Every composition |

Metric names are enumerated in the `MetricName` union in [`web/lib/obs/metrics.ts`](../../web/lib/obs/metrics.ts) — the writer is binding-agnostic so it falls back to a no-op when the Analytics Engine binding isn't present (local dev, preview deploys without the binding).

Each emission also writes the active `trace.id` into its dimension row, so you can join metrics rows to logs + Sentry events via [tracing.md](./tracing.md).

---

## Querying

Analytics Engine exposes a SQL API. Examples:

**Top 10 tenants by inbound leads in the last 24 h:**

```sql
SELECT index1 AS metric, blob1 AS site, count() AS total
FROM paragu_ai_metrics
WHERE timestamp > now() - INTERVAL '1' DAY
  AND blob1 LIKE 'siteSlug=%'
  AND index1 = 'lead.submitted'
GROUP BY site
ORDER BY total DESC
LIMIT 10
```

**p50/p95 compose duration by business type:**

```sql
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

`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are listed in [README.md § secrets](./README.md#secrets-needed-in-production).

---

## Cost

Analytics Engine writes are **~$0.25/million**. At current volume this is effectively free ($1–2/month at 10 k writes/day).

The Workers Analytics Engine free tier includes 10 million writes/day and 10 billion reads/day. We're nowhere near either.

---

## Extending

To add a new metric:

1. Add its name to the `MetricName` union in [`web/lib/obs/metrics.ts`](../../web/lib/obs/metrics.ts).
2. Call `metrics.inc('my.metric', { dim: 'value' })` at the emit point.
3. Add a row to the table at the top of this doc so readers know it exists.

Avoid high-cardinality dimensions (user IDs, request IDs). Analytics Engine handles cardinality fine, but unique dimension values bloat query cost. Use tenant slug, business type, locale — stable enumerated values.

---

## Dimensions vs labels

- **Dimensions** (Analytics Engine `blob1..blob20`, `index1`) — queryable, pivotable. For filters + `GROUP BY`.
- **Labels** (on log lines, see [logging.md](./logging.md)) — same intent, just on the log stream side.

A good rule: whatever you filter on in dashboards → dimension. Whatever you read when debugging one request → label.

---

## Future metrics to consider

- `site.render` — every page render, with `siteSlug` + `pageSlug` + `locale` dimensions (currently implicit in `compose.duration`)
- `auth.signin.success|failure` — admin login
- `subscription.paused|skipped|canceled` — from the customer portal (see [`docs/reference/API.md`](../reference/API.md))
- `webhook.received` — per inbound webhook (Calendly, WhatsApp, HubSpot) with signature-valid dimension

Add only what will power a dashboard or alert. Unused metrics are a cost + maintenance burden.

---

_Last reviewed: April 2026. Cross-refs: [logging.md](./logging.md), [tracing.md](./tracing.md), [`docs/reference/API.md`](../reference/API.md)._
