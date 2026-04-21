# Request-log middleware audit · 2026-04-21

> Closes part of BUG_HUNT_500 #392. Tracks which API routes still need
> `withRequestLog` wrapping. Update as routes are migrated.

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

Total API routes: ~50.

| Status | Count |
|---|---|
| ✅ Wrapped | every route in the original audit |
| ⚠️ Unwrapped | 1 (new since the original audit — see below) |

## Unwrapped routes (audit list)

Verify with: `find web/app/api -name 'route.ts' | xargs grep -L withRequestLog`

| Route | Lines | Methods | Why it matters |
|---|---:|---|---|
| `app/api/leads/[id]/generate-preview/route.ts` | 254 | POST | Added since original audit by a parallel agent. Writes to disk (`sites/preview-<id>/`); has zero auth check — anyone with a lead UUID can trigger preview generation. Wrap + `checkAdmin` in a follow-up. |

## Recently wrapped

| Route | Wrapped in |
|---|---|
| `app/api/activity/route.ts` | PR #131 |
| `app/api/leads/[id]/notes/route.ts` | PR #140 — also added `checkAdmin` to all 4 methods + replaced hardcoded `createdBy: 'admin'` with the authenticated user's email |
| `app/api/leads/bulk-update/route.ts` | PR #143 — also tightened `auth.getUser()` (any authenticated Supabase user) → `checkAdmin()` (env-allowlist admin only). Cleaned up duplicate manual requestId / perf instrumentation that the wrapper provides. |
| `app/api/admin/daily-metrics/route.ts` | PR #144 — also fixed broken auth: previous check was `if (!authHeader?.startsWith('Bearer '))` which validated NOTHING (any literal `Bearer foo` passed). Now `checkAdmin()`. Plus module-scoped Supabase client cache per ADR 0006. |
| `app/api/reminders/route.ts` | This PR — also added `checkAdmin` to all 4 methods (was completely unauthenticated). Dropped dead `ReminderScheduler` import that was never invoked. |
| `app/api/analytics/track/route.ts` | This PR — POST stays public (browsers fire it). GET fixed: previous check was the same broken `Bearer foo` pattern that gave anyone access to the analytics dump. Now `checkAdmin()`. |

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
