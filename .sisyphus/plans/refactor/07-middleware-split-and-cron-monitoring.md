# Plan: Split Middleware + Add Cron Job Monitoring

## Part A: Split Middleware into Focused Modules

### Current State

`web/middleware.ts` is 303 lines handling 4 concerns:

1. **Correlation ID / tracing** (lines 1-60) — x-request-id, W3C traceparent
2. **Rate limiting** (lines 60-120) — Upstash Redis, optional
3. **Session refresh** (lines 120-200) — Supabase SSR auth refresh
4. **Admin route protection** (lines 200-303) — redirect unauthenticated users

### The Problem

- All 4 concerns run on EVERY request, even for public static assets
- Rate limiting depends on Upstash Redis (optional dependency) — mixed into required logic
- Session refresh runs on every page load, even public pages
- Hard to test — need to mock 4 different systems
- Adding a 5th concern means touching the same file

### Proposed Solution

#### Architecture: Middleware Chain

```typescript
// middleware.ts — orchestrator only
import { chain } from '@/lib/middleware/chain'
import { correlationMiddleware } from '@/lib/middleware/correlation'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { authMiddleware } from '@/lib/middleware/auth'

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

const middleware = chain([
  correlationMiddleware,
  rateLimitMiddleware,
  authMiddleware,
])

export { middleware as default }
```

#### New Files

**`web/lib/middleware/chain.ts`** — Chain utility:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Middleware = (req: NextRequest, next: () => Promise<NextResponse>) => Promise<NextResponse>

export function chain(middleware: Middleware[]) {
  return async function(request: NextRequest): Promise<NextResponse> {
    let index = 0
    const next = async (): Promise<NextResponse> => {
      if (index < middleware.length) {
        return middleware[index++](request, next)
      }
      return NextResponse.next()
    }
    return next()
  }
}
```

**`web/lib/middleware/correlation.ts`** — Extract from middleware.ts lines 1-60
**`web/lib/middleware/rate-limit.ts`** — Extract from middleware.ts lines 60-120
**`web/lib/middleware/auth.ts`** — Extract from middleware.ts lines 120-303

#### Conditional Rate Limiting

Move Upstash Redis to an optional import so it doesn't block startup when not configured:

```typescript
let redis: Redis | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const { Redis } = await import('@upstash/redis')
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch {
  // Redis not configured — rate limiting disabled
}
```

## Part B: Cron Job Monitoring

### Current State

17 cron endpoints in `web/app/api/cron/` — zero observability:

- No success/failure tracking
- No timeout protection
- No deduplication (same cron can run concurrently)
- No alerting on failures
- No execution time tracking

### Proposed Solution: Cron Wrapper

```typescript
// web/lib/cron-utils.ts
import { logger } from '@/lib/logger'

interface CronResult {
  ok: boolean
  processed?: number
  skipped?: number
  errors?: number
  durationMs: number
}

export async function runCron(
  name: string,
  handler: () => Promise<CronResult>,
  options?: { timeout?: number },
): Promise<CronResult> {
  const start = performance.now()
  const timeout = options?.timeout ?? 30_000

  try {
    const result = await Promise.race([
      handler(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Cron "${name}" timed out after ${timeout}ms`)), timeout),
      ),
    ])

    const duration = Math.round(performance.now() - start)
    logger.info(`Cron "${name}" completed`, {
      cron: name,
      durationMs: duration,
      processed: result.processed,
      skipped: result.skipped,
      errors: result.errors,
    })

    return { ...result, durationMs: duration }
  } catch (err) {
    const duration = Math.round(performance.now() - start)
    logger.error(`Cron "${name}" failed`, {
      cron: name,
      durationMs: duration,
      error: err instanceof Error ? err.message : String(err),
    })
    return { ok: false, durationMs: duration }
  }
}
```

### Usage in cron routes

```typescript
// app/api/cron/daily-digest/route.ts
import { runCron } from '@/lib/cron-utils'

export async function POST(request: Request) {
  const result = await runCron('daily-digest', async () => {
    // existing logic
    return { ok: true, processed: 42 }
  })
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
```

### Files to Touch

| File | Change |
|---|---|
| `web/middleware.ts` | SPLIT — reduce to orchestrator |
| `web/lib/middleware/chain.ts` | NEW |
| `web/lib/middleware/correlation.ts` | NEW |
| `web/lib/middleware/rate-limit.ts` | NEW |
| `web/lib/middleware/auth.ts` | NEW |
| `web/lib/cron-utils.ts` | NEW |
| `web/app/api/cron/*/route.ts` (17 files) | Wrap with `runCron` |

## Effort & Risk

- **Middleware split**: Small (1-2 hours), low risk
- **Cron monitoring**: Small (1-2 hours), low risk
- **Total**: ~3-4 hours

## Success Criteria

- [ ] Middleware.ts is <30 lines (orchestrator only)
- [ ] Each middleware module is <100 lines with one responsibility
- [ ] All 17 cron jobs log start/completion/duration
- [ ] Failed cron jobs log with error context
- [ ] Timeout-protected cron jobs don't hang forever
