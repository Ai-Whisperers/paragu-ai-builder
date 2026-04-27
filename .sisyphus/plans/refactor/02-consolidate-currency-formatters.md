# Plan: Consolidate 9+ Redundant Format/Currency Functions Into One Module

## Current State

There are 9+ separate format/currency functions scattered across the codebase:

| Function | File | Purpose |
|---|---|---|
| `formatGs()` | `web/lib/format-gs.ts` | Format PYG with dots (Gs 1.000.000) |
| `formatPyg()` | `web/lib/commerce/price-parser.ts` | Same thing, slightly different |
| `formatCents()` | `web/lib/commerce/compute-totals.ts` | Cents → display string, locale-aware |
| `formatDisplay()` | `web/lib/commerce/currency.ts` | Format with Intl.NumberFormat |
| `formatBancardAmount()` | `web/lib/payments/bancard/client.ts` | Bancard-specific amount format |
| `formatReminderDate()` | `web/lib/reminders/scheduler.ts` | Date formatting for reminder messages |
| Inline `toLocaleDateString` | `web/lib/commerce/email-templates.ts:276` | Date in email templates |
| Inline `toLocaleTimeString` | `web/lib/commerce/email-templates.ts:282` | Time in email templates |
| Inline `Intl.NumberFormat` | `web/lib/integrations/analytics/ga4.ts` | Analytics number formatting |

### The Problem

- Inconsistent formatting: `formatGs` uses dots, `formatPyg` might use commas
- Import confusion: engineers import the wrong one
- Each has slightly different edge case handling
- No single source of truth for Paraguay locale formatting (es-PY)

## Proposed Solution

Create a single `web/lib/format.ts` module that exports all format functions from one place, with the existing modules re-exporting or delegating to it.

## Implementation

### New file: `web/lib/format.ts`

```typescript
import { logger } from '@/lib/logger'

// ---- Currency ----

/**
 * Format PYG with dots and "Gs" prefix.
 * 1000000 → "Gs 1.000.000"
 */
export function formatGs(n: number): string {
  if (!Number.isFinite(n)) {
    logger.warn('formatGs received non-finite number', { value: n })
    return 'Gs 0'
  }
  const parts = Math.round(n).toString().split('')
  const withDots: string[] = []
  for (let i = parts.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) withDots.unshift('.')
    withDots.unshift(parts[i])
  }
  return `Gs ${withDots.join('')}`
}

/**
 * Format PYG using Intl.NumberFormat with es-PY locale.
 */
export function formatPyg(value: number): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Format cents to display string. Handles PYG and USD.
 */
export function formatCents(cents: number, currency = 'PYG'): string {
  const amount = currency === 'PYG' ? cents : cents / 100
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency,
    ...(currency === 'PYG' ? { minimumFractionDigits: 0 } : {}),
  }).format(amount)
}

// ---- Date ----

export function formatShortDate(date: Date | string, locale = 'es-PY'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTime(time: string, locale = 'es-PY'): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ---- Numbers ----

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}
```

### Update existing modules to delegate

```typescript
// web/lib/format-gs.ts — re-export for backward compat
export { formatGs } from './format'

// web/lib/commerce/price-parser.ts — replace inline implementation
import { formatPyg } from '@/lib/format'
```

### Remove or deprecate duplicates

- `web/lib/commerce/compute-totals.ts` → use `formatCents` from `@/lib/format`
- `web/lib/commerce/currency.ts` → use `formatPyg` or `formatCents`
- `web/lib/payments/bancard/client.ts` → delegate to `formatCents`
- `web/lib/reminders/scheduler.ts` → delegate to `formatShortDate`
- `web/lib/commerce/email-templates.ts:276-282` → use `formatShortDate` + `formatTime`

## Files to Touch

| File | Change |
|---|---|
| `web/lib/format.ts` | NEW — single source of truth |
| `web/lib/format-gs.ts` | Re-export from format.ts |
| `web/lib/commerce/price-parser.ts` | Remove `formatPyg`, import from lib/format |
| `web/lib/commerce/compute-totals.ts` | Remove `formatCents`, import from lib/format |
| `web/lib/commerce/currency.ts` | Remove `formatDisplay`, import from lib/format |
| `web/lib/commerce/email-templates.ts` | Use `formatShortDate`/`formatTime` |
| `web/lib/reminders/scheduler.ts` | Use `formatShortDate` |
| `web/lib/payments/bancard/client.ts` | Use `formatCents` |

## Migration

1. Create `format.ts` with all functions
2. Add re-exports to existing modules for backward compat
3. Update callers one at a time (grep for each function name)
4. Remove inline implementations after all callers migrated

## Effort & Risk

- **Effort**: Small (1-2 hours)
- **Risk**: Low — re-exports mean no breaking changes during migration
- **Impact**: Eliminates 9 scattered implementations, 4 files simplified
