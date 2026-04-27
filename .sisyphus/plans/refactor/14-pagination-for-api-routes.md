# Plan: Add Pagination to Unbounded Database Queries

## Current State

Several API routes query Supabase without limits or pagination:

```typescript
// app/api/analytics/track/route.ts:154
.select('id')           // No limit — could return millions of rows

// app/api/generate/route.ts:33
.select('*')            // No limit — all businesses

// app/api/storefront/[site]/checkout/route.ts:59
.select('response_status, response_body, body_hash')  // No limit
```

### Risk

As the platform grows, these queries will:
- Return more data with every request
- Consume more memory (entire result set in memory)
- Take longer to complete
- Eventually hit Supabase's row limit and fail silently

## Proposed Solution

### Step 1: Create Paginated Query Helper

```typescript
// web/lib/supabase/queries.ts
import { postgrest } from '@/lib/supabase/client'

interface PaginationParams {
  page?: number
  pageSize?: number
}

interface PaginatedResult<T> {
  data: T[]
  total: number | null
  page: number
  pageSize: number
  totalPages: number
}

export async function paginatedQuery<T>(
  query: ReturnType<typeof postgrest.from>,
  params: PaginationParams = {},
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20))
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .range(from, to)
    .select('*', { count: 'exact' })

  if (error) throw error

  return {
    data: (data ?? []) as T[],
    total: count,
    page,
    pageSize,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
  }
}
```

### Step 2: Fix Specific Routes

#### `app/api/analytics/track/route.ts`

This route checks if an analytics event exists before inserting. The query doesn't need pagination — it checks existence with a single row:

```typescript
// Before:
const { data: existing } = await supabase.from('analytics_events')
  .select('id')
  .eq('event_name', eventName)
  .eq('tenant', tenant)

// After:
const { data: existing } = await supabase.from('analytics_events')
  .select('id')
  .eq('event_name', eventName)
  .eq('tenant', tenant)
  .limit(1)
```

#### `app/api/generate/route.ts`

This route fetches all businesses. It's used by admin to generate preview sites — no pagination needed but should have a limit:

```typescript
// Before:
const { data: businesses } = await supabase.from('businesses').select('*')

// After:
const { data: businesses } = await supabase.from('businesses').select('*').limit(100)
```

#### `app/api/storefront/[site]/checkout/route.ts`

This checks for duplicate payment attempts. It only needs the most recent one:

```typescript
// Before:
.select('response_status, response_body, body_hash')

// After:
.select('response_status, response_body, body_hash')
.order('created_at', { ascending: false })
.limit(1)
```

### Step 3: Add Middleware Warning for Unpaginated Queries

Add a development-mode warning when a query runs without `.range()` or `.limit()`:

```typescript
// web/lib/supabase/client.ts
export function createQueryWarning(query: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    if (!query.range && !query.limit) {
      logger.warn('Unpaginated Supabase query detected', { table: query.from })
    }
  }
}
```

## Files to Touch

| File | Change |
|---|---|
| `web/lib/supabase/queries.ts` | NEW |
| `web/app/api/analytics/track/route.ts` | Add `.limit(1)` to existence checks |
| `web/app/api/generate/route.ts` | Add `.limit(100)` |
| `web/app/api/storefront/[site]/checkout/route.ts` | Add `.limit(1)` + ordering |

## Effort & Risk

- **Effort**: Small (30 min - 1 hour)
- **Risk**: Low — adding limits doesn't change behavior for normal use cases
- **Impact**: Prevents performance degradation as tenant data grows
