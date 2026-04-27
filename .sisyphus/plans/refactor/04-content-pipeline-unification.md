# Plan: Unify the Two Parallel Content Pipelines

## Current State

There are two content composition pipelines that do essentially the same work:

### Pipeline A: Compose Pipeline (legacy)
- **Entry**: `composePage()` / `composePageForType()` in `web/lib/engine/compose.ts`
- **Data source**: `src/registry/*.type.json` + `src/content/*.content.json` + `src/tokens/*.tokens.json`
- **Used by**: Demo routes (`/demo/[rubro]`, `/p/[rubro]`), lead preview generation
- **Builder pattern**: `section-builders.ts` maps each section type to a builder function
- **Output**: `ComposedPage` with `sections: ComposedSection[]`

### Pipeline B: Site Pipeline (primary)
- **Entry**: `composeSitePage()` in `web/lib/engine/compose-site.ts`
- **Data source**: `sites/*/site.json` + `sites/*/pages/*.json` + `sites/*/content/*.json` + `src/verticals/*/copy/*.json`
- **Used by**: All production tenant sites at `/s/[locale]/[site]/...`
- **Builder pattern**: `resolveRef()` + `normalizeSectionProps()` + `injectCommerceSiteContext()`
- **Output**: `ResolvedPage` with `sections: PageSection[]`

### The Problem

- Pipeline A has 30+ registered section builders (in `section-builders.ts`)
- Pipeline B has 0 section builders — it resolves content refs and passes raw props to components
- The same component is reached through different props depending on which pipeline rendered it
- New sections must be wired into BOTH pipelines (SECTION_MAP + section-registry + builders + content refs)
- Pipeline B's `normalizeSectionProps()` has a growing switch statement duplicating builder logic

## Root Cause

Pipeline B was added later and bypassed the builder abstraction entirely. It was faster to build, but now both exist with inconsistent behavior.

## Proposed Solution: Pipeline B Delegates to Pipeline A Builders

Make Pipeline B's section resolution call the same builders from Pipeline A when a builder exists, with content refs as fallback.

### Implementation

```typescript
// In compose-site.ts, during section resolution:

import { buildSectionData, type SectionType } from './compose'

// Map site section IDs to compose section types
function idToSectionType(id: string): SectionType | null {
  // Use same SECTION_MAP from compose.ts
  return SECTION_MAP[id] ?? null
}

function resolveSection(id: string, contentRef: string, ctx: CopyContext, business: BusinessData): Record<string, unknown> {
  // Try builder first (Pipeline A)
  const type = idToSectionType(id)
  if (type) {
    const builderContent = loadContentForBuilder(business.type)
    const builderData = buildSectionData(type, business, builderContent, ctx.placeholders, [], {} as RegistryType)
    if (builderData) return builderData
  }

  // Fall back to content ref resolution (current Pipeline B behavior)
  const resolved = resolveRef(contentRef, ctx)
  const filled = fillDeep(resolved, ctx.placeholders)
  return normalizeSectionProps(id, filled)
}
```

### Benefits

- Single source of truth for section data construction
- New sections only need a builder (already the convention for Pipeline A)
- Content refs still work as overrides for edge cases
- Eliminates the growing `normalizeSectionProps` switch

### What to Keep

- `resolveRef()` for content lookups (merges site + vertical content)
- `normalizeSectionProps()` for legacy field name normalization (can be removed over time)
- The `site.json` → page → section config structure (that's the correct tenant model)

### What to Deprecate

- `buildSectionData()` dispatcher in compose.ts → replace with direct builder calls
- The compose pipeline's own rendering (demo routes can call compose-site internally)
- `normalizeSectionProps()` cases that duplicate builder logic

## Files to Touch

| File | Change |
|---|---|
| `web/lib/engine/compose-site.ts` | Add `tryBuilderFirst` logic in section resolution |
| `web/lib/engine/compose.ts` | Export `SECTION_MAP`, `buildSectionData` if not already |
| `web/lib/engine/section-builders.ts` | Ensure all 50+ sections have builders (many missing) |
| `web/lib/engine/section-registry.ts` | MAYBE simplify alias resolution |

## Migration

1. Add builder fallback to Pipeline B (safe — existing behavior unchanged when no builder exists)
2. Add missing builders for sections that currently have none (20+ sections)
3. Once all sections have builders, remove `normalizeSectionProps` cases that are now handled by builders
4. Optionally: make demo routes use Pipeline B internally

## Effort & Risk

- **Effort**: Medium (4-6 hours for core + builders for all sections)
- **Risk**: Medium — builders may produce slightly different props than content refs; needs visual QA
- **Impact**: Eliminates dual-maintenance of section data construction
