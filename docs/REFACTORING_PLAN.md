# Paragu-AI Builder: Full Refactoring Plan

> Generated: April 2026
> Scope: Security, sections, admin, lib, data layer
> Strategy: 10 batches, each independently shippable with green build

## Current State

| Metric | Count |
|---|---|
| `src/registry/` files | 1,968 |
| `web/components/sections/` files | 107 |
| `web/app/admin/` files | 29 |
| `web/lib/` modules | ~100 |
| Total TSX/TS files in `web/` | ~800 |
| Admin pages missing auth | 14 |

---

## Batch 1: Security + Admin Layout Foundation

**Why first:** 14 admin pages have zero auth but use service-role DB keys. This is a live vulnerability.

### Tasks

1.1. Create `web/app/admin/layout.tsx`
- Server component that calls `requireAdmin()`
- Provides consistent `<main>` wrapper (`min-h-screen bg-gray-50`)
- Shared header slot (breadcrumb + back link pattern)
- This single file gates ALL admin sub-pages

1.2. Remove inline auth calls from pages that already have `requireAdmin()`
- `leads/page.tsx`, `inbox/page.tsx`, `inbox/[id]/page.tsx`, `tenants/page.tsx`, `tenants/[slug]/page.tsx`, `tenants/[slug]/assets/page.tsx`, `demo-requests/page.tsx`
- The layout handles it now; remove the per-page call

1.3. Verify middleware covers `/admin/*` routes
- Read `web/middleware.ts`, confirm matcher includes admin paths
- If not, add it

### Files changed
- `web/app/admin/layout.tsx` (NEW)
- `web/middleware.ts` (possible edit)
- 7 admin pages (remove redundant `requireAdmin()`)

### Verification
- `npm run typecheck`
- `npm run build`
- Manual: visit `/admin/commerce/...` unauthenticated → should redirect

---

## Batch 2: Shared Admin Utilities + UI Shell

**Why:** Every admin page re-implements `ago()`, `fmtDate()`, stat cards, page wrappers, and commerce sub-nav.

### Tasks

2.1. Create `web/lib/admin/utils.ts`
- `ago(iso: string): string` — relative time
- `fmtDate(iso: string): string` — date display
- `fmtDateTime(iso: string): string` — datetime display
- `TYPE_LABELS` — business type label map (consolidate from 2 sources)
- `STATUS_COLORS`, `STATUS_LABELS`, `STATUS_ORDER` — inbox/leads status maps
- `CLOSE_REASON_LABELS` — inbox close reasons
- `formatGs(n: number): string` — PYG formatter (shared with sections)

2.2. Create `web/components/admin/admin-page-shell.tsx`
- Shared page wrapper: `<main>` + `<header>` with title + optional back link
- Props: `title, subtitle?, breadcrumbs?, backHref?, maxWidth?`
- Replace per-page `<main className="min-h-screen...">` wrappers

2.3. Create `web/components/admin/stat-card.tsx`
- Single stat card: label + value + icon + optional trend
- Replace 5+ local `StatCard` implementations

2.4. Create `web/components/admin/commerce-nav.tsx`
- Shared commerce sub-navigation (7 links)
- Props: `businessId, activeTab`
- Replace 3 identical copy-pasted nav blocks

2.5. Create `web/components/admin/admin-table.tsx`
- Shared table wrapper: overflow-x-auto + rounded + border + pagination
- Props: `columns, data, page, totalPages, onPageChange`
- Replace 7 local table implementations

### Files changed
- `web/lib/admin/utils.ts` (NEW)
- `web/components/admin/admin-page-shell.tsx` (NEW)
- `web/components/admin/stat-card.tsx` (NEW)
- `web/components/admin/commerce-nav.tsx` (NEW)
- `web/components/admin/admin-table.tsx` (NEW)

### Verification
- `npm run typecheck`
- `npm run build`
- No behavioral changes yet — these are new shared modules

---

## Batch 3: Migrate Admin Pages to Shared Components

**Why:** Now that shared admin components exist, migrate pages to use them.

### Tasks

3.1. Migrate commerce pages to use `AdminPageShell` + `CommerceNav`
- `admin/commerce/[businessId]/products/page.tsx`
- `admin/commerce/[businessId]/reviews/page.tsx`
- `admin/commerce/[businessId]/search-analytics/page.tsx`
- Replace inline `<nav>` blocks with `<CommerceNav>`

3.2. Migrate remaining commerce pages to `AdminPageShell`
- `orders/page.tsx`, `orders/[id]/page.tsx`, `products/[id]/page.tsx`
- `products/new/page.tsx`, `products/import/page.tsx`
- `reconciliation/page.tsx`, `discounts/page.tsx`, `shipping/page.tsx`
- `payments/page.tsx`

3.3. Migrate billing, content, tenant, demo-requests pages
- `billing/[businessId]/subscription/page.tsx`
- `billing/[businessId]/commission/page.tsx`
- `content/[businessId]/page.tsx`
- `tenants/page.tsx`, `tenants/[slug]/page.tsx`, `tenants/[slug]/assets/page.tsx`
- `demo-requests/page.tsx`

3.4. Migrate admin root, inbox, leads pages
- `admin/page.tsx`
- `inbox/page.tsx`, `inbox/[id]/page.tsx`
- `leads/page.tsx`
- Replace local `ago()`, `fmtDate()`, `StatCard` with shared imports

3.5. Decompose `leads-dashboard-client.tsx` (1440 lines → ~5 files)
- Extract to `web/components/admin/leads/`:
  - `leads-filters.tsx` — filter bar + search
  - `leads-table.tsx` — table + pagination
  - `lead-detail-sheet.tsx` — side panel detail view
  - `leads-bulk-actions.tsx` — bulk operations bar
  - `leads-export.ts` — CSV export logic
- Keep `leads-dashboard-client.tsx` as orchestrator (~300 lines)

### Files changed
- ~29 admin pages (refactored to use shared components)
- 5-6 new files in `web/components/admin/leads/`

### Verification
- `npm run typecheck`
- `npm run build`
- Manual: verify admin pages still render correctly

---

## Batch 4: Section Component Foundation + Calculator Factory

**Why:** The 10 calculator sections share ~95% of their code. This is the single biggest section-level win.

### Tasks

4.1. Create `web/types/sections.ts`
- Shared interfaces: `FAQItem`, `TestimonialItem`, `MenuItem`, `PricingTier`, `ProcessStep`, `TrustBadge`, `CalculatorInput`, `CalculatorResult`
- Shared section props base: `BaseSectionProps { title?, subtitle?, className? }`

4.2. Create `web/lib/format-gs.ts`
- Single `formatGs(n: number): string` function
- Replace 10 copy-pasted implementations in calc sections

4.3. Create `web/components/sections/calculator-base.tsx`
- `CalculatorSectionWrapper` component:
  - Section wrapper with `py-16 bg-[var(--surface)]` + Container + Heading
  - Input area (left) + Result area (right) layout
  - Disclaimer slot
  - CTA button slot (WhatsApp link)
- `CalculatorRow` component: label + input with PYG formatting
- `CalculatorResultCard` component: result display with highlight

4.4. Refactor 10 calculator sections to use the factory
- `calc-aguinaldo-section.tsx` → keeps only the aguinaldo formula + specific inputs
- `calc-costo-empleado-section.tsx` → formula + inputs only
- `calc-finiquito-section.tsx` → formula + inputs only
- `calc-ips-section.tsx` → formula + inputs only
- `calc-ire-section.tsx` → formula + inputs only
- `calc-irp-section.tsx` → formula + inputs only
- `calc-iva-section.tsx` → formula + inputs only
- `calc-resimple-qualifier-section.tsx` → formula + inputs only
- `savings-calculator-section.tsx` → formula + inputs only
- `tax-savings-calculator-section.tsx` → formula + inputs only
- Each drops from ~150-290 lines to ~40-60 lines

4.5. Update section aliases if any calc section names change

### Files changed
- `web/types/sections.ts` (NEW)
- `web/lib/format-gs.ts` (NEW)
- `web/components/sections/calculator-base.tsx` (NEW)
- 10 calculator sections (refactored, each ~80% smaller)

### Verification
- `npm run typecheck`
- `npm run build`
- Manual: visit a site with calc-irp section, verify calculator still works

---

## Batch 5: Section Merges (FAQ, Trust, Pricing, Process)

**Why:** These section families share 55-70% of their code with only presentation differences.

### Tasks

5.1. Merge FAQ variants into `faq-section.tsx` with `variant` prop
- `faq-section.tsx` → accepts `variant: 'simple' | 'categorized' | 'enhanced' | 'chatbot'`
- Delete `enhanced-faq-section.tsx` (merge logic in)
- Delete `faq-categorized-section.tsx` (merge logic in)
- Delete `faq-chatbot-section.tsx` (merge logic in)
- Update `renderer.tsx` imports
- Update `section-registry.ts` aliases: `enhanced-faq → faq`, `faq-categorized → faq`

5.2. Merge trust variants into `trust-signals-section.tsx`
- `trust-signals-section.tsx` already has a variant system — absorb the other two
- Delete `trust-badges-section.tsx` (merge as variant)
- Delete `trust-badges.tsx` (merge as variant)
- Keep `trust-signals-logos-section.tsx` (different shape — logo strip)
- Update `renderer.tsx` imports
- Update `section-registry.ts` aliases: `trust-badges → trust-signals`

5.3. Merge `pricing-table-section` + `membership-plans-section`
- Unified `PricingTableSection` with `features: string[] | Array<{text, included}>`
- Delete `membership-plans-section.tsx`
- Update `renderer.tsx` + `section-registry.ts`
- Add alias: `membership-plans → pricing-table`

5.4. Deprecate `process-section.tsx` for `process-timeline-section.tsx`
- `process-timeline-section` is a full superset with variants
- Delete `process-section.tsx`
- Update `renderer.tsx` + add alias: `process → process-timeline`

5.5. Merge `compare-plans-matrix-section` into `programs-comparison-section`
- `programs-comparison` is a superset with locale support
- Delete `compare-plans-matrix-section.tsx`
- Add variant to programs-comparison for matrix mode
- Update `renderer.tsx` + aliases

5.6. Merge `photo-gallery-section` into `gallery-section.tsx`
- `gallery-section` has lightbox + categories (superset)
- Delete `photo-gallery-section.tsx`
- Add variant for simple grid mode
- Update `renderer.tsx` + aliases

5.7. Delete dead files
- `huevo-del-dia-section.tsx` (empty)
- `nutritional-info-section.tsx` (empty)

5.8. Inline thin wrappers
- `before-after-section.tsx` → inline into renderer (it just wraps portfolio/before-after)
- `emergency-indicator-section.tsx` → inline into renderer (wraps location/emergency-indicator)
- `quote-form-section.tsx` → inline into renderer (wraps location/quote-form)

### Files changed
- ~20 section files (deleted or merged)
- `renderer.tsx` (updated imports + aliases)
- `section-registry.ts` (updated aliases)

### Verification
- `npm run typecheck`
- `npm run build`
- Manual: visit sites using faq, trust-signals, pricing, process sections

---

## Batch 6: Section Merges Part 2 (Schedule, Testimonials, Forms, Menus)

### Tasks

6.1. Merge `class-schedule-section` into `weekly-schedule-section`
- Add `variant: 'full' | 'simple'` to weekly-schedule
- Delete `class-schedule-section.tsx`
- Update renderer + aliases

6.2. Merge `google-reviews-widget-section` into `testimonials-section`
- Add `variant: 'cards' | 'widget'` to testimonials
- Delete `google-reviews-widget-section.tsx`
- Update renderer + aliases

6.3. Merge `multi-step-form-section` into `intake-wizard-section`
- `intake-wizard` is the richer version
- Delete `multi-step-form-section.tsx`
- Update renderer + aliases

6.4. Merge `menu-categorized-priced-section` logic into generalized menu
- Extract shared `MenuSection` base from `sushi-menu-sections.tsx`'s `FullMenuSection`
- Make `menu-categorized-priced-section` use the shared base
- Keep both files but with shared internal component

### Files changed
- 5-6 section files
- `renderer.tsx`, `section-registry.ts`

### Verification
- `npm run typecheck`
- `npm run build`

---

## Batch 7: Lib Layer Cleanup

### Tasks

7.1. Consolidate currency formatting into `web/lib/currency/`
- Create `web/lib/currency/format.ts` — canonical `formatPyg()`, `formatPrice()`, `formatDisplay()`
- Create `web/lib/currency/convert.ts` — `convertPygAmount()` from `commerce/currency.ts`
- Move `web/lib/commerce/currency-server.ts` → `web/lib/currency/server.ts`
- Update all imports (in sections, commerce, stores, admin)
- Delete `web/lib/commerce/currency.ts`
- Delete `web/lib/commerce/price-parser.ts` (merge formatPyg into canonical)

7.2. Extract `apiCall<T>` to `web/lib/stores/api-call.ts`
- Move shared fetch helper from `cart-store.ts` and `wishlist-store.ts`
- Import from both stores

7.3. Create `web/lib/stores/create-local-storage-store.ts`
- Generic factory for `useSyncExternalStore` + localStorage pattern
- Refactor `wishlist.ts`, `recently-viewed.ts`, `recent-searches.ts` to use it
- Each drops from ~100 lines to ~30 lines

7.4. Extract shared `gtag` to `web/lib/analytics/gtag-shared.ts`
- `declare global { Window.gtag }` + `gtag()` wrapper
- Import from `commerce-events.ts` and `marketing-events.ts`

7.5. Unify Supabase admin client
- Add `timeoutFetch` to `web/lib/supabase/admin.ts`
- Deprecate `createClient('service_role')` path in `server.ts`
- Update all call sites to use `createAdminClient()` consistently

7.6. Reduce per-function `createAdminClient()` calls in commerce modules
- Create thin repository pattern: `createProductsRepo(supabase)` etc.
- Update `products.ts`, `cart.ts`, `payment-credentials.ts`, `reviews.ts`, `shipping-zones.ts`, `discounts-admin.ts`

### Files changed
- `web/lib/currency/` (NEW directory, 3 files)
- `web/lib/stores/api-call.ts` (NEW)
- `web/lib/stores/create-local-storage-store.ts` (NEW)
- `web/lib/analytics/gtag-shared.ts` (NEW)
- `web/lib/supabase/admin.ts` (edit)
- ~15 files updated for imports

### Verification
- `npm run typecheck`
- `npm run build`
- `npm run test:unit` (if available)

---

## Batch 8: Registry Stub Elimination

**Why:** 1,914 stub files (7.9 MB) are near-identical JSON with no functional differentiation. They bloat the repo and slow builds.

### Tasks

8.1. Generate `src/registry/catalog.json`
- Script to extract id, nameEs, nameEn, verticalId, subVertical, extends, seo, hero from all 1,914 stubs
- Validate it produces identical data at runtime

8.2. Update registry resolver
- Modify `web/lib/engine/static-config.ts` (or wherever registry files are loaded)
- Add fallback: check `catalog.json` when a `.type.json` file doesn't exist on disk
- Ensure extends chain resolution still works

8.3. Update `web/lib/tokens/resolver.ts`
- When a stub type references a non-existent token file, fall back to vertical defaults
- Use `src/verticals/{verticalId}/defaults.tokens.json`

8.4. Delete 1,914 stub `.type.json` files
- Keep the 53 base registry files
- `git rm src/registry/ice_sculpture_artist.type.json` etc.
- Verify build still works after deletion

8.5. Update `REGISTRY_MAP` generation
- Ensure the static config generator reads from both remaining files + catalog
- Regenerate `web/lib/engine/static-config.ts`

### Files changed
- `src/registry/catalog.json` (NEW)
- `web/lib/engine/static-config.ts` or related loader (edit)
- `web/lib/tokens/resolver.ts` (edit)
- 1,914 stub files (DELETED)

### Verification
- `npm run typecheck`
- `npm run build`
- Manual: visit several business type sites, verify they render with correct tokens + sections
- Verify `REGISTRY_MAP` has all 1,968 entries still

---

## Batch 9: Token + Schema + Content Consolidation

### Tasks

9.1. Consolidate near-identical beauty tokens
- Group: `peluqueria`, `barberia`, `salon_belleza`, `estetica`, `maquillaje`, `depilacion`, `unas`, `pestanas`, `tatuajes`
- Create `src/tokens/beauty-base.tokens.json` with shared typography + layout
- Each specific file keeps only palette overrides (color, accent)
- Other token families: food (`restaurant`, `sushi_bar`, `kaiten_zushi`, `meal_prep`, `panaderia`), health (`gimnasio`, `spa`, `pilates`, `yoga`)

9.2. Move per-type schema extensions into verticals
- `src/schemas/peluqueria.schema.json` → merge into `src/verticals/beauty/schema.json` (which already exists)
- Same for other types: only keep standalone schemas for truly unique types (contador, inmobiliaria, relocation, meal_prep)
- Delete ~15 per-type schema files

9.3. Merge stub content files into parent content
- 7 content files for stub types (cerrajero, electricista, plomero, etc.)
- Merge into their parent type's content file under a `subTypes` key
- Or move into vertical copy defaults

### Files changed
- `src/tokens/` (~15 files refactored, ~5 new base files)
- `src/schemas/` (~15 files deleted, content merged to verticals)
- `src/content/` (~7 files merged into parents)
- `src/verticals/` (schema.json + copy/es.json updated for some verticals)

### Verification
- `npm run typecheck`
- `npm run build`
- Verify token resolution works for all business types

---

## Batch 10: Final Cleanup + Documentation

### Tasks

10.1. Remove unused exports
- Run `npx ts-prune` or equivalent to find dead exports
- Clean up unused imports across the codebase

10.2. Consistent naming audit
- `web/lib/stores/wishlist.ts` → `wishlist-local.ts`
- `web/lib/stores/wishlist-store.ts` → `wishlist-server.ts`
- Any other confusing names

10.3. Update `AGENTS.md` and `CLAUDE.md`
- Reflect new admin layout pattern
- Document calculator factory pattern
- Update file counts and structure
- Document the registry catalog system

10.4. Update `section-registry.ts`
- Clean up the aliases map (remove ones that are no longer needed after merges)
- Ensure all merged sections have proper aliases for backward compat

10.5. Performance check
- Run `npm run build` and compare output size to baseline
- Verify no bundle size regressions

### Files changed
- Various (cleanup)
- `AGENTS.md`, `CLAUDE.md` (docs)

### Verification
- `npm run typecheck`
- `npm run build`
- `npm run lint`
- `npm run test:unit` (if available)

---

## Dependency Graph

```
Batch 1 (Security)
  └── Batch 2 (Admin Shared Utils)
       └── Batch 3 (Admin Page Migration)

Batch 4 (Section Foundation + Calculator Factory)
  └── Batch 5 (Section Merges: FAQ, Trust, Pricing, Process)
       └── Batch 6 (Section Merges: Schedule, Testimonials, Forms)

Batch 7 (Lib Layer Cleanup) — independent, can run parallel to 4-6

Batch 8 (Registry Stub Elimination) — independent, can run parallel to 3-7
  └── Batch 9 (Token/Schema/Content Consolidation)

Batch 10 (Final Cleanup) — last, depends on all above
```

## Estimated Impact

| Metric | Before | After |
|---|---|---|
| Admin auth gaps | 14 pages | 0 |
| `src/registry/` files | 1,968 | ~54 + 1 catalog |
| `src/` disk usage | 9.6 MB | ~2.0 MB |
| Section components | 107 | ~85 |
| Section LOC | ~18,500 | ~15,500 |
| `leads-dashboard-client.tsx` | 1,440 lines | ~300 (orchestrator) |
| Currency modules | 3 | 1 |
| Copy-pasted `formatGs()` | 10 copies | 1 |
| Copy-pasted `apiCall<T>` | 2 copies | 1 |
| localStorage store boilerplate | ~270 lines | ~90 lines |
| Admin shared patterns | 0 shared | 5 shared components |

## Risk Mitigation

- **Each batch is independently committable** — if a batch causes issues, revert just that batch
- **Section merges use aliases** in `section-registry.ts` — old section names keep working
- **Registry stub elimination** preserves all 1,968 entries in a catalog file — no data loss
- **Admin layout** is additive first, migration second — existing pages work during transition
- **Run `npm run build` after every batch** — catch breakages immediately

## Batch Duration Estimates

| Batch | Effort | Risk |
|---|---|---|
| 1. Security | 1-2 hours | Low |
| 2. Admin Shared Utils | 2-3 hours | Low |
| 3. Admin Page Migration | 4-6 hours | Medium |
| 4. Calculator Factory | 3-4 hours | Medium |
| 5. Section Merges Part 1 | 4-6 hours | Medium |
| 6. Section Merges Part 2 | 2-3 hours | Low |
| 7. Lib Layer Cleanup | 3-4 hours | Low |
| 8. Registry Stubs | 3-4 hours | Medium |
| 9. Token/Schema/Content | 2-3 hours | Low |
| 10. Final Cleanup | 1-2 hours | Low |
| **Total** | **25-37 hours** | |
