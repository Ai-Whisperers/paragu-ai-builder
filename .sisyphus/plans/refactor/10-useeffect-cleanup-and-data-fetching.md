# Plan: Fix useEffect Memory Leaks and Standardize Data Fetching

## Current State

5+ components have `useEffect` calls without cleanup that can cause:

- Memory leaks (setting state on unmounted components)
- Race conditions (stale responses overwriting fresh ones)
- Double-fetches (React StrictMode in dev)

### Affected Components

| Component | Issue | Risk |
|---|---|---|
| `countdown-timer-section.tsx:42` | `setInterval` without cleanup | Timer continues after unmount |
| `property-listings-section.tsx:126` | `fetch()` without AbortController | Stale data, state update after unmount |
| `mattress-quiz-section.tsx:145` | Side effect without cleanup | Analytics events on unmounted component |
| `open-hours-status-section.tsx:46` | Polling without cleanup | Memory leak |
| `referral-section.tsx:24` | `useEffect` without return | Low risk (static) |

## Proposed Solution

### Fix 1: Generic useAsyncEffect Hook

```typescript
// web/lib/hooks/use-async-effect.ts
import { useEffect, useRef } from 'react'

/**
 * Safe async useEffect with AbortController support.
 * Prevents state updates on unmounted components and race conditions.
 */
export function useAsyncEffect(
  effect: (signal: AbortSignal) => Promise<void | (() => void)>,
  deps: unknown[] = [],
): void {
  const destroyRef = useRef<(() => void) | void>()

  useEffect(() => {
    const controller = new AbortController()

    effect(controller.signal).then((cleanup) => {
      destroyRef.current = cleanup
    })

    return () => {
      controller.abort()
      destroyRef.current?.()
    }
  }, deps)
}
```

### Fix 2: useInterval Hook

```typescript
// web/lib/hooks/use-interval.ts
import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delayMs: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delayMs === null) return
    const id = setInterval(() => savedCallback.current(), delayMs)
    return () => clearInterval(id)
  }, [delayMs])
}
```

### Fix 3: Use SWR or TanStack Query for Data Fetching

For data-fetching effects (`property-listings-section`), replace raw `fetch` + `useEffect` with `swr`:

```bash
npm install swr
```

```typescript
import useSWR from 'swr'

// Before:
const [apiProperties, setApiProperties] = useState(null)
useEffect(() => {
  fetch(`/api/properties?siteSlug=${slug}`)
    .then(res => res.json())
    .then(data => setApiProperties(data))
}, [slug])

// After:
const { data: apiProperties, error } = useSWR(
  fetchFromApi ? `/api/properties?siteSlug=${fetchFromApi.siteSlug}` : null,
)
```

### Per-Component Fixes

#### `countdown-timer-section.tsx`

```typescript
// Before:
useEffect(() => {
  const timer = setInterval(() => setTimeLeft(calculate()), 1000)
  // Missing cleanup!
})

// After:
useEffect(() => {
  const timer = setInterval(() => setTimeLeft(calculate()), 1000)
  return () => clearInterval(timer)
}, [])
```

#### `property-listings-section.tsx`

```typescript
// Before:
useEffect(() => {
  fetch(url).then(r => r.json()).then(setData)
}, [slug])

// After:
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
    .then(r => r.json())
    .then(data => controller.signal.aborted || setData(data))
    .catch(err => controller.signal.aborted || setError(err))
  return () => controller.abort()
}, [slug])
```

#### `open-hours-status-section.tsx`

```typescript
// Before:
useEffect(() => {
  const interval = setInterval(checkStatus, 60000)
  // Missing cleanup!
})

// After:
import { useInterval } from '@/lib/hooks/use-interval'
useInterval(checkStatus, 60000)
```

## Files to Touch

| File | Change |
|---|---|
| `web/lib/hooks/use-async-effect.ts` | NEW |
| `web/lib/hooks/use-interval.ts` | NEW |
| `web/components/sections/calculators/countdown-timer-section.tsx` | Add cleanup |
| `web/components/sections/specialty/property-listings-section.tsx` | Add AbortController |
| `web/components/sections/specialty/mattress-quiz-section.tsx` | Add cleanup |
| `web/components/sections/specialty/open-hours-status-section.tsx` | Use useInterval |
| `web/components/sections/specialty/referral-section.tsx` | Add cleanup |

## Effort & Risk

- **Effort**: Small (1-2 hours)
- **Risk**: Low — all changes are additive (adding cleanup)
- **Note**: `referral-section.tsx` may not actually have a leak — needs verification

## Success Criteria

- [ ] All `useEffect` calls have cleanup where needed
- [ ] `property-listings` fetch is abortable and won't update state after unmount
- [ ] `countdown-timer` and `open-hours-status` intervals are properly cleaned up
- [ ] No regressions in any of the 5 components
