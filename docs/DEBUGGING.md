# Debugging & Logging Runbook

When something breaks in Paragu-AI Builder, this is the playbook for finding out
what happened, why, and how to reproduce it. The codebase has **one structured
logger** (`web/lib/logger.ts`) and a handful of observability surfaces — this
doc covers all of them.

## 1. The structured logger

All runtime code logs through `logger` from `@/lib/logger`. Every entry is
either a pretty line (dev) or a single JSON object (prod) containing:

| Field | Notes |
|-------|-------|
| `timestamp` | ISO 8601 |
| `level` | `debug` / `info` / `warn` / `error` |
| `message` | Human-readable headline |
| `context` | Arbitrary structured fields — `requestId`, `businessId`, `siteSlug`, `action`, `duration`, etc. |
| `error` | `{ name, message, stack }` on error-level entries |

### Log levels

- **debug** — noisy tracing (query timings under threshold, cache hits, etc.)
- **info** — normal flow (request accepted, composition completed)
- **warn** — recoverable issue (fallback used, slow query, 4xx from upstream)
- **error** — unrecoverable (exception, 5xx, all destinations failed)

Default level: `debug` in dev, `info` in prod. Override with `LOG_LEVEL=debug`.

### Format

- Dev: ANSI-colored pretty lines.
- Prod (Cloudflare Workers): JSON, one entry per line.
- Force either with `LOG_FORMAT=pretty` or `LOG_FORMAT=json`.

### Request correlation

`middleware.ts` assigns every request a UUID and injects it as the
`x-request-id` request header. API routes call `createRequestLogger(request)`
which threads the ID into every log entry and echoes it on the response
(`x-request-id` response header + `requestId` field in JSON bodies).

**Ask users who hit errors for the `x-request-id` they see in the network tab
or the error page — one ID traces the full lifecycle.**

## 2. Reading production logs

Prod runs on Cloudflare Workers. Two ways to read logs:

### Live tail (fastest for active debugging)

```bash
cd web
npx wrangler tail                     # all logs
npx wrangler tail --format=pretty     # colored
npx wrangler tail --search "businessSlug=nexa-paraguay"
npx wrangler tail --search requestId=<uuid>
```

### Durable storage

For anything older than a few minutes:

1. **Cloudflare dashboard** → Workers → `paragu-ai-builder` → Logs tab.
2. **Supabase `generation_logs` table** (queryable SQL) — written for any
   step that calls `recordGenerationEvent()` from
   `web/lib/generation/log-event.ts`. Use when debugging the generation
   pipeline specifically.

## 3. Health & diagnostics endpoints

| Endpoint | Auth | Use when |
|----------|------|----------|
| `GET /api/health` | public | quick "is it up" — env vars present |
| `GET /api/health?deep=1` | public | also pings Supabase (adds ~50–200ms) |
| `GET /api/diagnostics` | admin user | snapshot of env flags, catalog sizes, last 25 generation_logs rows |

All three return `requestId` in the body and response header so any weirdness
is traceable.

## 4. Reproducing a bug locally

1. Grab the `requestId` from the user-facing error or prod logs.
2. `npx wrangler tail --search requestId=<id>` to see the full request trace.
3. If the failure is in the generation pipeline:
   - Note the `businessSlug` and `pageType` from the log entries.
   - Run `npm run generate:site <slug>` to reproduce composition locally.
   - `--sections`, `--theme`, `--meta` flags narrow output.
4. If the failure is in a lead-form adapter:
   - Check which adapter failed (`adapter` field in the warn log).
   - Adapter contract tests: `npm run test -- integrations/adapter-contracts`.

## 5. Error boundaries

- `app/error.tsx` — catches render errors in the normal route tree.
- `app/global-error.tsx` — catches errors in the root layout itself.
- `app/[business]/error.tsx` — scoped to flat-pattern tenant pages.
- `app/s/[locale]/[site]/error.tsx` — scoped to vertical tenant pages.

Each logs to `logger.error` with the error `digest` so the stack in the log can
be correlated with the digest shown to the user. Users should be asked to
include the digest when reporting.

## 6. Multi-tenant safety

Every per-business query must go through `scopedQueries(supabase, businessId)`
from `web/lib/supabase/scoped.ts`. The helper:

- Injects `.eq('business_id', businessId)` on select/update/delete/count/exists.
- Injects `business_id` into insert payloads.
- Strips `business_id` from update payloads to prevent cross-tenant moves.
- Logs slow queries (`>SLOW_QUERY_THRESHOLD_MS`, default 1s) as warn.
- Logs every query error with table + operation + businessId context.

The test `tests/unit/scoped-query-audit.test.ts` fails the build if a raw
`.from('<tenant_table>')` call appears anywhere except `scoped.ts` itself.

## 7. Common failure modes

| Symptom | Likely cause | First look |
|---------|--------------|-----------|
| 500 from `/api/generate` | Business data missing fields | Look for `BusinessData validation failed` warn with issue paths |
| Tenant page renders 404 | `composeSitePage` threw | Search `TenantPage composition failed` in logs |
| Lead form "all_destinations_failed" | No configured adapter succeeded | `All lead destinations failed` error has per-adapter breakdown |
| Slow page load | Supabase query slow | Search `Slow scoped query` warn — includes table + duration |
| Unknown section ID | Registry / section-registry mismatch | `Unknown section type` or `No component bound for section` warn |

## 8. Useful env vars

| Var | Default | Effect |
|-----|---------|--------|
| `LOG_LEVEL` | `info` (prod) / `debug` (dev) | Minimum level logged |
| `LOG_FORMAT` | `json` (prod) / `pretty` (dev) | Output format |
| `SLOW_REQUEST_THRESHOLD_MS` | `1000` | `createPerformanceTracker.finish` warns above this |
| `SLOW_QUERY_THRESHOLD_MS` | `1000` | scopedQueries warns above this |
| `NEXT_PUBLIC_APP_VERSION` | `unknown` | Echoed in /api/health |
| `NEXT_PUBLIC_COMMIT_SHA` | `unknown` | Echoed in /api/health |

## 9. Testing changes

```bash
cd web
npm run test          # unit + integration (no coverage gate)
npm run test:ci       # unit + integration + coverage gate (fails <75%)
npm run test:e2e      # Playwright (needs dev server)
npm run test:all      # ci + e2e
```

CI (`.github/workflows/test.yml`) runs `test:ci` on every PR and fails the
build on test or coverage failure.
