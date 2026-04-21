# Request-log middleware audit · 2026-04-21

> **Status:** ✅ Closed (#392). Every API route on Main is wrapped.
> Doc retained as the catalog of wrapped routes + the pattern for adding
> new ones. If you add an API route, add it to the table below.

## Why this matters

`withRequestLog` (defined in `web/lib/api/with-request-log.ts`) gives
every request:

- a request-scoped logger (`log.requestId`, contextual `trace.id` /
  `span.id` / `http.method` / `url.path`)
- a perf tracker
- automatic `x-request-id` response header (so logs can be correlated
  with a complaint or an Axiom search)
- structured 500 fallback if the handler throws

Routes that bypass the wrapper:
- silently swallow exceptions or return Next.js defaults
- have no `x-request-id` header → impossible to correlate with logs
- log without trace context → harder to follow flows

## Status

Every API route on Main is wrapped. Verify any time with:

```sh
find web/app/api -name 'route.ts' | xargs grep -L withRequestLog
# expect: empty
```

If a new route shows up there, wrap it (pattern below) and add a row
to the "Wrapped routes" table.

## Wrapped routes (notes on the original 5 from the audit)

| Route | Wrapped in | Notes |
|---|---|---|
| `app/api/activity/route.ts` | PR #131 | First wrap, established the smoke-test pattern. |
| `app/api/leads/[id]/notes/route.ts` | PR #140 | Added `checkAdmin` to all 4 methods (was completely unauth) + replaced hardcoded `createdBy: 'admin'` with the authenticated user's email. |
| `app/api/leads/bulk-update/route.ts` | PR #143 | Tightened `auth.getUser()` → `checkAdmin()`: was accepting any signed-in Supabase user (incl. tenant customers) to bulk-mutate leads. |
| `app/api/admin/daily-metrics/route.ts` | PR #144 | Fixed broken `if (!authHeader?.startsWith('Bearer '))` check (validated nothing) → `checkAdmin()`. Plus module-scoped Supabase client cache per ADR 0006. |
| `app/api/reminders/route.ts` | PR #145 | All 4 methods unauth → `checkAdmin()`. Dropped dead `ReminderScheduler` instance. |
| `app/api/analytics/track/route.ts` | PR #145 | POST stays public (browser ingest). GET had the same broken `Bearer <anything>` pattern → `checkAdmin()`. |

## Hidden security finds during the audit

The wrap-every-route exercise surfaced 3 real broken-auth bugs that
the original audit didn't flag:

1. **`bulk-update`** — accepted any signed-in Supabase user (any
   tenant customer could bulk-mutate the leads table). Fixed PR #143.
2. **`admin/daily-metrics`** — accepted any literal `Authorization:
   Bearer foo` (validated NOTHING). Fixed PR #144.
3. **`analytics/track` GET** — same broken Bearer pattern, exposed
   the analytics_events dump. Fixed PR #145.

Wrap-for-observability ended up doubling as a security audit. Worth
running similar passes on any future "every route does X" sweeps.

## Wrapping pattern

```ts
// before
export async function GET() {
  return NextResponse.json({ ok: true })
}

// after
export const GET = withRequestLog(async () => {
  return NextResponse.json({ ok: true })
})

// for dynamic routes:
export const GET = withRequestLog<{ id: string }>(async (req, ctx, { id }) => {
  ctx.log.info('Fetched', { id })
  return NextResponse.json({ id })
})
```

`ctx` gives you `log`, `perf`, `requestId`. Replace any inline
`logger.info(...)` calls with `ctx.log.info(...)` so they inherit the
request's trace context.

## Verification

After wrapping a route, add a smoke test that asserts
`response.headers.get('x-request-id')` is truthy. See
`web/tests/integration/api-activity.test.ts` for the pattern.
