# Plan: Add Request Validation Middleware for All API Routes

## Current State

~50 API route files in `web/app/api/` handle booking, commerce, leads, cron, webhooks, storefront, and admin operations.

### The Problem

- Most POST/PUT handlers do `const body = await req.json()` without any schema validation
- A malformed payload crashes the handler (500 error, unhelpful for debugging)
- TypeScript types exist but aren't enforced at runtime — `as any` casts paper over mismatches
- No consistent error response format across routes
- Rate limiting exists in middleware but is optional (Upstash Redis dependency)

### Example of the problem

```typescript
// app/api/onboarding/submit/route.ts
export async function POST(request: NextRequest) {
  const { name, email, phone, businessType } = await request.json()
  // If any of these are undefined, the query will fail silently or throw
  const { data, error } = await supabase.from('leads').insert({ name, email, phone, business_type: businessType })
}
```

## Proposed Solution: Zod Validation Wrapper

Use Zod schemas to validate every API route's input, with a consistent error response format.

### 1. Create `web/lib/api-utils.ts`

```typescript
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export type ApiResponse<T = unknown> = 
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string }

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status })
}

export function error(message: string, status = 400, code?: string): NextResponse {
  logger.warn('API error', { message, status, code })
  return NextResponse.json({ ok: false, error: message, code }, { status })
}

export function validationError(errors: z.ZodError): NextResponse {
  return error(
    errors.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '),
    422,
    'VALIDATION_ERROR',
  )
}

export function notFound(message = 'Not found'): NextResponse {
  return error(message, 404, 'NOT_FOUND')
}

export function serverError(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : 'Internal server error'
  logger.error('API unhandled error', { error: message })
  return NextResponse.json({ ok: false, error: message, code: 'INTERNAL_ERROR' }, { status: 500 })
}
```

### 2. Create `web/lib/api-validate.ts`

```typescript
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { validationError, serverError, success } from './api-utils'

type Handler<T> = (body: T, req: NextRequest) => Promise<Response> | Response

export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: Handler<T>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    try {
      const raw = await req.json()
      const parsed = schema.safeParse(raw)
      if (!parsed.success) return validationError(parsed.error)
      return handler(parsed.data, req)
    } catch (err) {
      if (err instanceof SyntaxError) {
        return NextResponse.json({ ok: false, error: 'Invalid JSON body', code: 'PARSE_ERROR' }, { status: 400 })
      }
      return serverError(err)
    }
  }
}
```

### 3. Example Usage

**Before:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()
    if (!name || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    // handle...
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

**After:**
```typescript
const LeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  businessType: z.string().optional(),
})

export const POST = withValidation(LeadSchema, async (body) => {
  const { data } = await supabase.from('leads').insert(body)
  return success(data, 201)
})
```

### 4. Prioritized Route List (by criticality)

| Priority | Routes | Reason |
|---|---|---|
| P0 | `storefront/*` (checkout, cart, orders) | Payments, customer data |
| P0 | `booking/*` (create, availability) | Business-critical |
| P0 | `webhooks/*` (bancard, pagopar) | Payment processing |
| P1 | `admin/commerce/*` (products, discounts, shipping) | Admin operations |
| P1 | `admin/leads/*` | Lead management |
| P1 | `onboarding/*` | User signup |
| P1 | `data-request/*` | GDPR/data requests |
| P2 | `newsletter/*`, `reminders/*` | Marketing |
| P2 | `whatsapp/*` | Integration setup |

### 5. Consistent Error Response Format

```json
// Success
{ "ok": true, "data": { ... } }

// Validation error
{ "ok": false, "error": "email: Invalid email", "code": "VALIDATION_ERROR" }

// Auth error
{ "ok": false, "error": "Unauthorized", "code": "UNAUTHORIZED" }

// Not found
{ "ok": false, "error": "Booking not found", "code": "NOT_FOUND" }

// Server error
{ "ok": false, "error": "Internal server error", "code": "INTERNAL_ERROR" }
```

## Files to Touch

| File | Change |
|---|---|
| `web/lib/api-utils.ts` | NEW — response helpers |
| `web/lib/api-validate.ts` | NEW — Zod validation wrapper |
| `web/lib/api-validate.test.ts` | NEW — tests |
| `web/app/api/storefront/[site]/checkout/route.ts` | P0 — add validation |
| `web/app/api/storefront/[site]/cart/route.ts` | P0 |
| `web/app/api/booking/create/route.ts` | P0 |
| `web/app/api/webhooks/bancard/route.ts` | P0 |
| `web/app/api/webhooks/pagopar/route.ts` | P0 |
| `web/app/api/onboarding/submit/route.ts` | P1 |
| `web/app/api/admin/commerce/[businessId]/products/route.ts` | P1 |
| `web/app/api/admin/leads/bulk/route.ts` | P1 |
| `web/app/api/data-request/route.ts` | P1 |
| `web/app/api/whatsapp/connect/route.ts` | P2 |

## Rollback

1. Revert to the old handler pattern for any route that has issues
2. The `withValidation` wrapper is a pure addition — removing it leaves the handler unchanged

## Effort & Risk

- **Effort**: Medium (utilities: 1h, P0 routes: 2h, P1 routes: 2h, P2 routes: 1h = ~6h total)
- **Risk**: Low — wrapper pattern doesn't change behavior, just adds validation
- **Dependency**: Zod (`npm install zod`)

## Success Criteria

- [ ] All P0 routes have Zod validation
- [ ] All API responses use the `{ ok, data/error, code }` format
- [ ] Malformed JSON body returns 400, not 500
- [ ] Build passes with `npm install zod`
