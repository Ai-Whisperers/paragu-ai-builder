# Paragu-AI Builder: Next Steps & Future Work

> Updated: April 2026 refactoring sprint — ALL batches complete
> See docs/REFACTORING_PLAN.md for the full batch plan

## Completed Batches

| Batch | What | Status |
|---|---|---|
| 1 | Admin layout + auth gate for 14 unprotected pages | Done |
| 2 | Admin shared utils (ago, fmtDate, TYPE_LABELS) + UI shell components | Done |
| 3 | Migrated admin pages to shared utils (8 pages deduped) | Done |
| 4 | Calculator factory — shared formatGs + BaseCalculatorSectionProps (10 files) | Done |
| 5 | Section merges: process, membership-plans, trust-badges, compare-plans-matrix | Done |
| 6 | Section merges: class-schedule → weekly-schedule | Done |
| 7 | Lib cleanup: shared apiCall, shared gtag, localStorage store factory | Done |
| 8 | Registry stub elimination: 1,906 files deleted, generator reads from catalog | Done |
| 9 | Schema consolidation: 21 per-type schemas → 8 vertical schema.json files | Done |
| Cleanup | Deleted dead sections, fixed pre-existing TS errors | Done |

## Remaining Work

### Decompose leads-dashboard-client.tsx (1,440 lines)
Split into focused modules under `web/components/admin/leads/`:
- `leads-filters.tsx` — filter bar + search
- `leads-table.tsx` — table + pagination
- `lead-detail-sheet.tsx` — side panel detail view
- `leads-bulk-actions.tsx` — bulk operations bar
- Keep `leads-dashboard-client.tsx` as orchestrator (~300 lines)

**Effort:** 3-4 hours

### Wire AdminPageShell/CommerceNav into commerce pages
The shared admin UI components exist but the 12 commerce pages still use inline wrappers. Mechanical migration:
- Replace `<main className="min-h-screen bg-gray-50">` with `<AdminPageShell>`
- Replace inline `<nav>` blocks with `<CommerceNav>`

**Effort:** 2-3 hours

### Token consolidation (beauty types)
9 beauty-adjacent tokens (peluqueria, barberia, salon_belleza, estetica, etc.) share near-identical structures. Create `beauty-base.tokens.json` and have each override only the palette.

**Effort:** 1-2 hours

## Impact Summary

| Metric | Before | After |
|---|---|---|
| Admin auth gaps | 14 unprotected pages | 0 |
| `src/registry/` files | 1,968 | 63 (61 base + catalog + index) |
| `src/schemas/` files | 23 | 2 (base + registry) |
| Section dead code | 3 empty files + 1 dead file | 0 |
| Copy-pasted `formatGs()` | 10 copies | 1 |
| Copy-pasted `apiCall<T>()` | 2 copies | 1 |
| Copy-pasted `gtag()` wrapper | 2 copies | 1 |
| LocalStorage store boilerplate | ~270 lines across 3 files | ~90 lines (factory) |
| Duplicated admin utilities | ago/fmtDate in 5+ files | 1 shared module |

## Files Created

| File | Purpose |
|---|---|
| `web/app/admin/layout.tsx` | Admin auth gate |
| `web/lib/admin/utils.ts` | Shared admin utilities |
| `web/components/admin/admin-page-shell.tsx` | Shared page wrapper |
| `web/components/admin/stat-card.tsx` | Stat display card |
| `web/components/admin/commerce-nav.tsx` | Commerce sub-navigation |
| `web/components/admin/admin-table.tsx` | Table + Pagination |
| `web/lib/format-gs.ts` | Canonical PYG formatter |
| `web/types/sections.ts` | Shared section types |
| `web/lib/stores/api-call.ts` | Shared fetch helper |
| `web/lib/stores/create-local-storage-store.ts` | localStorage factory |
| `web/lib/analytics/gtag-shared.ts` | Shared gtag + Window type |
| `src/registry/stub-catalog.json` | 1,906 stub type definitions |

## Files Deleted

| File/Category | Count | Reason |
|---|---|---|
| `compare-plans-matrix-section.tsx` | 1 | Dead code |
| `huevo-del-dia-section.tsx` | 1 | Empty |
| `nutritional-info-section.tsx` | 1 | Empty |
| Registry stub `.type.json` files | 1,906 | Moved to catalog |
| Per-type `.schema.json` files | 21 | Merged into verticals |

## Section Routing Changes (renderer.tsx)

| Section ID | Before | After |
|---|---|---|
| `process` | `ProcessSection` | `ProcessTimelineSection` |
| `membership-plans` | `MembershipPlansSection` | `PricingTableSection` |
| `trust-badges` | `TrustBadgesSection` | `TrustSignalsSection` |
| `class-schedule` | `ClassScheduleSection` | `WeeklySchedule` |

## Architecture Observations for Future Work

1. **Section renderer eager imports** — 50+ sections imported at top of `renderer.tsx`. Consider dynamic imports.
2. **No admin sidebar** — flat page list, no shared nav. Adding a sidebar would improve UX.
3. **Inbox + Leads overlap** — both read `leads` table, similar pipelines. Could unify into single CRM with tabs.
4. **Supabase client per-function** — commerce modules create admin client 12x per file. Use repository pattern.
5. **No section tests** — 107 sections with zero test coverage. Add basic render tests.
6. **photo-gallery-section.tsx** has hardcoded data — should merge into gallery-section
7. **multi-step-form-section.tsx** and **google-reviews-widget-section.tsx** not in renderer — may be dead code
8. **savings-calculator NumberField/ResultRow** — reusable UI primitives trapped in a section file
