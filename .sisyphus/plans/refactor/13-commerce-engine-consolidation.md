# Plan: Consolidate Commerce Engine Sub-modules

## Current State

The commerce engine is spread across 15+ files in `web/lib/commerce/`:

```
web/lib/commerce/
├── business-content.ts        # BusinessContent type
├── compute-totals.ts          # Cart total + discount computation
├── currency.ts                # PYG/USD display, conversion rates
├── email-templates.ts         # Order confirmation, shipping, etc.
├── price-parser.ts            # Parse price strings
├── seed-catalog.ts            # Demo catalog seeding logic (admin API)
└── ...
```

### Key Issues

1. **Redundant price formatting**: `compute-totals.ts:formatCents`, `currency.ts:formatDisplay`, `price-parser.ts:formatPyg` all do the same thing with slight differences.

2. **Scattered product type definitions**: `ProductItem` in `product-catalog-section.tsx`, product types in `business-content.ts`, and database row types in the Supabase generated types — all slightly different shapes.

3. **Seed-catalog couples API logic with business logic**: `seed-catalog.ts` is used by an admin API route (`/api/admin/commerce/[businessId]/seed-catalog`) but lives in `lib/commerce/` when it should be either in `lib/` or the API route.

4. **Email templates live in commerce but are consumed by API routes**: `email-templates.ts` is imported by booking routes, not just commerce routes. It should be in `lib/email/` or similar.

## Proposed Reorganization

### New Structure

```
web/lib/commerce/
├── types.ts                   # All shared commerce types
├── cart.ts                    # Cart computation (from compute-totals.ts)
├── pricing.ts                 # Price display (from currency.ts + price-parser.ts)
├── email.ts                   # Email templates (from email-templates.ts)
├── seed.ts                    # Demo seeding (from seed-catalog.ts — OPTIONAL move)
└── index.ts                   # Barrel exports
```

### Step 1: Unify Product Types

```typescript
// web/lib/commerce/types.ts
export interface CommerceProduct {
  id: string
  name: string
  description?: string
  price: number          // Always cents/int for PYG, float for USD
  priceOriginal?: number
  currency: 'PYG' | 'USD'
  imageUrl?: string
  category?: string
  available?: boolean
  stockCount?: number
  slug?: string
}
```

Then update the section component types to reference this:

```typescript
// components/sections/commerce/product-catalog-section.tsx
import type { CommerceProduct } from '@/lib/commerce/types'
export type ProductItem = CommerceProduct  // or extend
```

### Step 2: Extract email templates

Move order/booking email templates to `web/lib/email/templates.ts`:

```typescript
// web/lib/email/templates.ts
export function orderConfirmationEmail(order: Order) { ... }
export function bookingConfirmationEmail(booking: Booking) { ... }
export function shippingUpdateEmail(order: Order) { ... }
```

### Step 3: Move seed-catalog

`seed-catalog.ts` is only used by one API route. Move it there:

```
web/app/api/admin/commerce/[businessId]/seed-catalog/
├── route.ts                  # API handler
├── seed.ts                   # Seeding logic (moved from lib/commerce/seed-catalog.ts)
```

## Files to Touch

| File | Change |
|---|---|
| `web/lib/commerce/types.ts` | NEW — unified product/order types |
| `web/lib/commerce/cart.ts` | Extract from compute-totals.ts |
| `web/lib/commerce/pricing.ts` | Extract from currency.ts + price-parser.ts |
| `web/lib/email/templates.ts` | NEW — email template consolidation |
| `web/lib/commerce/email-templates.ts` | Deprecate — delegate to lib/email/templates.ts |
| `web/lib/commerce/compute-totals.ts` | Remove — replaced by cart.ts |
| `web/lib/commerce/currency.ts` | Remove — replaced by pricing.ts |
| `web/lib/commerce/price-parser.ts` | Remove — replaced by pricing.ts |
| `web/lib/commerce/seed-catalog.ts` | Move to API route directory |
| `web/app/api/admin/commerce/[businessId]/seed-catalog/seed.ts` | NEW |
| `web/app/api/admin/commerce/[businessId]/seed-catalog/route.ts` | Update import path |

## Migration

1. Create new files first (additive — no breakage)
2. Update import paths one caller at a time
3. Once all callers migrated, delete old files
4. Critical path: `compute-totals` is used by checkout API → test thoroughly

## Effort & Risk

- **Effort**: Medium (3-4 hours)
- **Risk**: Medium — commerce handles real payments. Changes must be verified against checkout flow.
- **Success criteria**: Checkout, cart, order confirmation all work identically after refactor.
