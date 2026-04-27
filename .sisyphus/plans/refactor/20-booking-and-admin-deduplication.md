# Plan: Consolidate Booking Implementations and Admin Dashboard

## 20a. Booking Implementations

### Current State

Three separate booking components:

| Component | File | Lines | Purpose |
|---|---|---|---|
| `BookingSection` | `booking-section.tsx` | ~200 | Full Calendly/cal.com embed |
| `BookingEmbedSection` | `booking-embed-section.tsx` | 161 | Embed with fallback UI |
| `BookingWizardSection` | `booking-wizard-section.tsx` | ~300 | Multi-step WhatsApp-based booking |

### The Problem

- `BookingSection` and `BookingEmbedSection` overlap ~70% — both embed Calendly/cal.com iframes with fallback to WhatsApp
- `BookingWizardSection` is a completely different approach (WhatsApp-only form) but does the same thing
- Tenants pick one via the section lineup in their page config, but all three share the same Supabase `bookings` table
- Adding a new booking feature means updating all three

### Proposed Solution

**Keep all three** — they serve different use cases:
- `BookingEmbedSection` = lightweight inline embed (most tenants)
- `BookingSection` = full-page booking experience (complex scheduling)
- `BookingWizardSection` = WhatsApp-only (simple businesses without calendars)

**But consolidate the shared booking logic**:

```typescript
// web/lib/booking/types.ts — shared booking types
export interface BookingService { name: string; duration: number; price?: number }
export interface BookingSlot { start: string; end: string; available: boolean }

// web/lib/booking/availability.ts — shared slot generation
export function generateSlots(date: Date, duration: number, bookedTimes: string[]): BookingSlot[]

// web/lib/booking/whatsapp.ts — shared WhatsApp message templates
export function bookingWhatsAppMessage(service: string, date: string, time: string): string
```

Then each component imports from `@/lib/booking/` instead of duplicating the logic.

### Files to Touch

| File | Change |
|---|---|
| `web/lib/booking/types.ts` | NEW |
| `web/lib/booking/availability.ts` | Extract from all 3 components |
| `web/lib/booking/whatsapp.ts` | NEW |
| All 3 booking section files | Delegate shared logic to lib/booking |

## 20b. Admin Dashboard

### Current State

The admin dashboard at `app/dashboard/[slug]/` has:

| Page | Lines | Status |
|---|---|---|
| `page.tsx` | 188 | Monolithic overview |
| `contenido/page.tsx` | 34 | Content editor (wrapper) |
| `configuracion/page.tsx` | ~100 | Settings |
| `onboarding/page.tsx` | ~100 | Setup wizard |
| `productos/page.tsx` | ~200 | Product management |
| `pedidos/page.tsx` | ~200 | Order management |
| `reservas/page.tsx` | 131 | Booking management |
| `descuentos/page.tsx` | ~100 | Discount management |

### The Problem

- `page.tsx` (188 lines) has the dashboard overview with hardcoded link lists, inline styles, and no pagination
- No shared dashboard layout — each page repeats the same sidebar/nav structure
- Pages use `force-dynamic` (already noted in other plans)
- Commerce pages are split across two locations: `app/admin/commerce/` and `app/dashboard/[slug]/`

### Proposed: Shared Dashboard Components

```typescript
// web/components/dashboard/dashboard-layout.tsx
export function DashboardLayout({ children, slug, title }: DashboardLayoutProps) {
  // Shared sidebar + header + breadcrumbs
}

// web/components/dashboard/stats-card.tsx
export function StatsCard({ label, value, icon, trend }: StatsCardProps) {}

// web/components/dashboard/data-table.tsx  
export function DataTable<T>({ columns, data, pagination }: DataTableProps<T>) {}
```

### Files to Touch

| File | Change |
|---|---|
| `web/components/dashboard/dashboard-layout.tsx` | NEW |
| `web/components/dashboard/stats-card.tsx` | NEW |
| `web/components/dashboard/data-table.tsx` | NEW |
| `web/app/dashboard/[slug]/page.tsx` | Use dashboard components |
| `web/app/dashboard/[slug]/layout.tsx` | Use dashboard layout |

## Effort & Risk

- **Booking consolidation**: Small (1-2 hours), low risk
- **Admin dashboard**: Medium (2-3 hours), low risk
- **Total**: ~4-5 hours
