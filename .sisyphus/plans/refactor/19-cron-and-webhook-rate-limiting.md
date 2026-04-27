# Plan: Add Rate Limiting and Idempotency for Webhooks and Cron Jobs

## Current State

### Webhooks — No Protection

- `webhooks/bancard/route.ts` — Bancard payment callbacks
- `webhooks/pagopar/route.ts` — Pagopar payment callbacks
- Both accept POST requests from external services
- No IP allowlisting
- No signature verification
- No idempotency key handling
- No rate limiting

### Cron Jobs — No Concurrency Protection

- 17 cron endpoints, all accessible via POST
- No API key or secret check
- Can be triggered by anyone who knows the URL
- No deduplication (same cron runs if Vercel sends it twice)

## Proposed Fixes

### 1. Add Webhook IP Allowlisting

```typescript
// web/lib/webhooks/ip-allowlist.ts
const ALLOWED_IPS = new Set([
  '52.67.8.186',  // Bancard
  '54.232.121.26', // Bancard
  '18.229.200.0/24', // Pagopar
])

export function isAllowedIP(ip: string): boolean {
  if (ALLOWED_IPS.has(ip)) return true
  // Check CIDR ranges
  for (const allowed of ALLOWED_IPS) {
    if (allowed.includes('/') && ipInCIDR(ip, allowed)) return true
  }
  return false
}
```

### 2. Add Webhook Rate Limiting

Using the same Upstash Redis client from middleware (if configured):

```typescript
// web/lib/webhooks/rate-limit.ts
import { Redis } from '@upstash/redis'

let redis: Redis | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch {}

export async function webhookRateLimit(key: string, maxRequests = 10, windowMs = 60000): Promise<boolean> {
  if (!redis) return true // Allow if Redis not configured
  const current = await redis.incr(key)
  if (current === 1) await redis.expire(key, windowMs / 1000)
  return current <= maxRequests
}
```

### 3. Add Cron API Key Check

```typescript
// web/lib/cron-auth.ts
export function isAuthenticatedCron(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const expected = process.env.CRON_SECRET
  if (!expected) {
    logger.warn('CRON_SECRET not set — cron endpoints are unprotected')
    return true
  }
  return authHeader === `Bearer ${expected}`
}
```

Usage in every cron route:

```typescript
// app/api/cron/daily-digest/route.ts
import { isAuthenticatedCron } from '@/lib/cron-auth'
import { runCron } from '@/lib/cron-utils'

export async function POST(request: Request) {
  if (!isAuthenticatedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ...
}
```

### 4. Add Webhook Idempotency

Create the `webhook_events` table and add a helper:

```typescript
// lib/webhooks/idempotency.ts
export async function deduplicateWebhook(
  idempotencyKey: string,
  handler: () => Promise<Response>,
): Promise<Response> {
  const supabase = createAdminClient()
  
  // Check if already processed
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('response')
    .eq('idempotency_key', idempotencyKey)
    .single()
  
  if (existing) {
    logger.info('Duplicate webhook — returning cached response', { idempotencyKey })
    return NextResponse.json(existing.response, { status: 200 })
  }
  
  const response = await handler()
  
  // Record as processed
  await supabase.from('webhook_events').insert({
    idempotency_key: idempotencyKey,
    response: await response.clone().json(),
  })
  
  return response
}
```

## Files to Touch

| File | Change |
|---|---|
| `web/lib/webhooks/ip-allowlist.ts` | NEW |
| `web/lib/webhooks/rate-limit.ts` | NEW |
| `web/lib/webhooks/idempotency.ts` | NEW |
| `web/lib/cron-auth.ts` | NEW |
| `web/app/api/webhooks/bancard/route.ts` | Add IP check + idempotency |
| `web/app/api/webhooks/pagopar/route.ts` | Add IP check + idempotency |
| All 17 cron routes | Add auth check wrapper |
| `supabase/migrations/XXX_webhook_events.sql` | NEW |

## Effort & Risk

- **Effort**: Medium (2-3 hours)
- **Risk**: Low — all additions, no changes to existing logic
- **Critical**: Payment webhooks have no security today — this is the most important security fix
