# Debugging & Logging Runbook

When something breaks, this is the playbook. The codebase has **one
structured logger** (`lib/obs/logger.ts`, re-exported as `@/lib/logger`) plus
three external pipes (Sentry / Axiom / Analytics Engine). The sections
below cover day-to-day debugging. For the architectural setup, see
[`OBSERVABILITY.md`](./OBSERVABILITY.md).

## 1. The structured logger

All runtime code logs via `@/lib/logger` (a shim around `@/lib/obs/logger`).
Every entry is a single line:

- **Dev:** ANSI-colored pretty text with request-id + path abbreviation.
- **Prod:** ECS-aligned JSON with dotted field names.

### Canonical fields (ECS)

| Field | Example | Who sets |
|-------|---------|----------|
| `@timestamp` | `"2026-04-19T23:59:00.123Z"` | logger |
| `log.level` | `"info"` / `"warn"` / `"error"` / `"debug"` | logger |
| `message` | `"Lead accepted"` | caller |
| `service.name` | `"paragu-ai-builder"` | logger |
| `service.version` | `"abc123"` | logger (from `NEXT_PUBLIC_APP_VERSION` or `NEXT_PUBLIC_COMMIT_SHA`) |
| `trace.id` | `"f1e2d3…"` | middleware (upstream-aware) |
| `span.id` | `"a1b2c3d4e5f6…"` | middleware (if upstream sent W3C traceparent) |
| `http.method` | `"POST"` | `withRequestLog` |
| `url.path` | `"/api/leads"` | `withRequestLog` |
| `http.status` | `201` | caller |
| `http.duration` | `137` | `createPerformanceTracker.finish()` |
| `client.ip` | `"1.2.3.4"` | `createRequestLogger` |
| `user.id` | `"u-…"` | caller |
| `event.action` | `"compose.finish"` | caller |
| `labels.business_id`, `labels.business_type`, `labels.business_slug`, `labels.site_slug`, `labels.locale`, `labels.vertical` | — | caller |
| `error.{name,message,stack}` | — | logger (stack only in dev) |

**Backwards compatibility:** legacy keys (`requestId`, `businessId`, `siteSlug`,
`method`, `path`, `duration`, …) still work and are automatically mirrored
under their ECS names at emit time.

### Writing logs

```typescript
import { logger } from '@/lib/logger'

logger.info('Lead accepted', {
  'labels.site_slug': data.siteSlug,
  leadId,
})

// Legacy shape — still supported, gets aliased automatically.
logger.info('Lead accepted', { siteSlug: data.siteSlug, leadId })

// Errors
try {
  await critical()
} catch (err) {
  logger.error('Critical path failed', err instanceof Error ? err : new Error(String(err)))
  throw err
}

// Sampled hot-path debug
logger.debug('Cache check', { key }, { sample: 0.01 })
```

### What NOT to log

- Email addresses — the redactor scrubs them, but don't rely on it.
- Tokens / API keys / passwords — any key matching `token|apikey|password|secret|auth`
  is masked before emit (see `lib/obs/redact.ts`).
- Full lead / business records — pass IDs, not objects.
- Freeform user-submitted strings without length caps — sanitiseContext
  truncates >1KB but avoid the pattern anyway.

## 2. Request-ID correlation

Middleware inspects every request in this order:
1. `x-request-id` header (validated: non-trivial, ≤128 chars)
2. `x-correlation-id` header
3. W3C `traceparent` header (extracts trace-id + parent span-id)
4. generate UUIDv4

The chosen ID is:
- written to `x-request-id` and `traceparent` on the response (so the client
  can report it, and any downstream hop sees a valid trace chain),
- seeded into `AsyncLocalStorage` so every `logger.*` call inside the request
  scope picks up `trace.id` automatically (no manual threading),
- echoed in JSON response bodies as `requestId` on success and `{"requestId": …}`
  on 5xx (from `withRequestLog`).

**Ask users who hit errors for the `x-request-id`** they see in the network
tab or the error page — one ID traces the full server + client lifecycle
through Sentry + Axiom.

## 3. Reading production logs

### Live tail (fastest for active debugging)

```bash
cd web
npx wrangler tail --format=pretty
npx wrangler tail --search "lead.accepted"
npx wrangler tail --search "trace.id=<uuid>"
```

### Durable history

| Sink | Source | Retention | Query |
|------|--------|-----------|-------|
| **Axiom** (if Logpush configured) | All stdout | 30d hot | APL saved queries — see `OBSERVABILITY.md` §2 |
| **Sentry** | Unhandled exceptions only | 30d free / 90d paid | Sentry UI; group by fingerprint, trace, release |
| **Supabase `generation_logs`** | `recordGenerationEvent()` calls | forever | SQL via Supabase dashboard |
| **Cloudflare dashboard** | stdout (last 3 days) | 3d | Workers → Logs tab |

## 4. Sentry (error tracking)

Enabled automatically when `NEXT_PUBLIC_SENTRY_DSN` is set.

- **Server errors** → captured by `onRequestError` in `instrumentation.ts` +
  the `withRequestLog` wrapper. Tagged with route + method.
- **Client errors** → captured by each error boundary (`app/error.tsx`,
  `app/global-error.tsx`, `app/[business]/error.tsx`, `app/s/[locale]/[site]/error.tsx`)
  and tagged with `boundary`.
- **Manual captures** → `import { captureException, captureMessage } from '@/lib/obs/sentry'`.

Warnings do not ship to Sentry — only errors. Warn-level rate spikes are an
Axiom / log-pipeline concern.

## 5. Metrics (Analytics Engine)

Custom time-series metrics emitted via `metrics.{inc,timing,observe}` from
`@/lib/obs/metrics`. See `OBSERVABILITY.md` §3 for the schema and queries.
In dev without a `METRICS` binding, writes are no-ops (logged at debug).

## 6. Endpoints

| Endpoint | Auth | Use when |
|----------|------|----------|
| `GET /api/health` | public | quick "is it up" — env vars present |
| `GET /api/health?deep=1` | public | also pings Supabase (+50–200ms) |
| `GET /api/diagnostics` | admin user | env flags, catalog sizes, last 25 generation_logs rows |

All return `requestId` in the body + response header so every interaction is
traceable.

## 7. Error boundaries (client)

| File | Scope |
|------|-------|
| `app/error.tsx` | Catches render errors in the normal route tree |
| `app/global-error.tsx` | Catches errors in the root layout itself |
| `app/[business]/error.tsx` | Scoped to flat-pattern tenant pages |
| `app/s/[locale]/[site]/error.tsx` | Scoped to vertical tenant pages |
| `components/ui/error-boundary.tsx` | Reusable component boundary |

Each logs to `logger.error` + emits to Sentry with the error `digest`. The
digest is shown to the user so they can report it.

## 8. Multi-tenant safety

Every per-business query must go through `scopedQueries(supabase, businessId)`
from `@/lib/supabase/scoped`. The helper:

- Injects `.eq('business_id', businessId)` on select/update/delete/count/exists.
- Injects `business_id` into insert payloads.
- Strips `business_id` from update payloads to prevent cross-tenant moves.
- Logs slow queries (>`SLOW_QUERY_THRESHOLD_MS`, default 1s) as warn.
- Logs every query error with table + operation + businessId context.

`tests/unit/scoped-query-audit.test.ts` fails the build if a raw
`.from('<tenant_table>')` call appears anywhere except `scoped.ts` itself
(with an explicit allowlist for the admin diagnostics endpoint).

## 9. Common failure modes

| Symptom | Likely cause | First look |
|---------|--------------|-----------|
| 500 from `/api/generate` | Business data missing fields | `BusinessData validation failed` warn with issue paths |
| Tenant page renders 404 | `composeSitePage` threw | `TenantPage composition failed` error in logs |
| Lead form "all_destinations_failed" | No configured adapter succeeded | `All lead destinations failed` error with per-adapter breakdown |
| Slow page load | Supabase query slow | `Slow scoped query` warn — includes table + duration |
| Unknown section ID | Registry / section-registry mismatch | `Unknown section type` warn |
| Sentry getting spammed | Warn-level events capture enabled somewhere | Only `logger.error` + explicit `captureException` should reach Sentry |

## 10. Useful env vars

| Var | Default | Effect |
|-----|---------|--------|
| `LOG_LEVEL` | `info` (prod) / `debug` (dev) | Minimum level logged |
| `LOG_FORMAT` | `json` (prod) / `pretty` (dev) | Output format |
| `SLOW_REQUEST_THRESHOLD_MS` | `1000` | `perf.finish` warns above this |
| `SLOW_QUERY_THRESHOLD_MS` | `1000` | `scopedQueries` warns above this |
| `NEXT_PUBLIC_SENTRY_DSN` | — | Enables Sentry when set |
| `SENTRY_TRACES_SAMPLE_RATE` | `0.1` | Server performance traces |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | `0.1` | Browser performance traces |
| `NEXT_PUBLIC_APP_VERSION` | `unknown` | Echoed in `service.version` + Sentry release |
| `NEXT_PUBLIC_COMMIT_SHA` | `unknown` | Same as above, preferred |
| `SERVICE_NAME` | `paragu-ai-builder` | `service.name` in log entries |

## 11. Testing changes

```bash
cd web
npm run test          # unit + integration (no coverage gate)
npm run test:ci       # unit + integration + coverage gate
npm run test:e2e      # Playwright (needs dev server)
npm run test:all      # ci + e2e
```

CI (`.github/workflows/test.yml`) runs `test:ci` on every PR and fails the
build on test or coverage failure.

## 12. When in doubt

1. Get the `x-request-id` from the user-facing error / logs.
2. `wrangler tail --search trace.id=<id>` for live trace, or Axiom query for
   history (see `OBSERVABILITY.md` §2).
3. If there's a stack trace, Sentry has the grouped error with all sessions.
4. If it's in the generation pipeline, run `npm run generate:site <slug>`
   locally to reproduce.
5. If nothing reproduces, `/api/diagnostics` (admin) dumps the relevant
   runtime state: env var presence, catalog, last 25 generation_logs rows.
