# Observability Reference

> Logging, metrics, tracing, and error monitoring.

## Architecture

```
App → Structured Logger → Console (dev) / Cloudflare (prod)
App → Sentry → Error monitoring dashboard
App → Analytics Events → Supabase → Admin dashboard
```

## Key Files

| File | Purpose |
|------|---------|
| `web/lib/obs/logger.ts` | ECS-aligned structured logger |
| `web/lib/obs/sentry.ts` | Sentry error reporting |
| `web/obs/metrics.ts` | Custom metrics |
| `web/lib/analytics/events.ts` | Business analytics events |

## Logging

ECS-aligned structured logger with levels:
- `error` - System failures (logged to Sentry)
- `warn` - Non-critical issues
- `info` - Business events (order created, lead converted)
- `debug` - Development details (disabled in prod)

## Sentry

Production error tracking:
- Captures unhandled exceptions
- Captures `logger.error()` calls
- Context: business_id, request_id, session
- Release tracking via deploy metadata

## Metrics

Tracked via Cloudflare Analytics Engine:
- Route request counts
- Section render times
- Payment status distribution
- Lead import volume

## Admin Dashboard

Viewable at `/admin/observability`:
- Error rate over time
- Slow route identification
- Business activity logs
- Integration health checks

---

_Last updated: April 24, 2026_
