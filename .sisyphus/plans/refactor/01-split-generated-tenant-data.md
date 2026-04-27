# Plan: Split Monolithic `tenant-data.ts` Into Per-Tenant Chunks

## Current State

- **File**: `web/lib/engine/generated/tenant-data.ts`
- **Size**: ~221K lines, ~1.3MB of generated TypeScript
- **Generator**: `web/scripts/generate-tenant-data.ts` (walks `sites/*` + `src/verticals/*`, emits one giant module)
- **Consumers**: `web/lib/engine/site-loader.ts` does `CONTENT[\`${siteSlug}:${locale}\`]` lookups
- **Regenerated**: Every `npm run build` via the `npm run generate:tenant-data` prebuild step

### Impact

- Every deploy rebuilds the entire 1.3MB file even if only one tenant's content changes
- The bundled output includes ALL tenant data in every serverless function's cold start
- Build time is wasted on tenants that haven't changed
- The file is too large for IDE LSP to handle comfortably

## Proposed Solution: Per-Tenant Chunks with Dynamic Import

Emit one file per tenant per locale instead of one monolithic file. Each chunk is lazily imported when a request for that tenant+locale arrives.

### Trade-offs

| Approach | Pro | Con |
|---|---|---|
| **Split per tenant** (chosen) | Fast cold start, incremental builds, clear ownership | Slightly more complex loader |
| **Keep monolithic** | Simple, works | Slow builds, bloated bundles |
| **Per-request DB fetch** | No generated file at all | Adds latency, couples to Supabase at render time |

## Implementation Steps

### Step 1: Modify `generate-tenant-data.ts`

Current structure (one file):
```typescript
const CONTENT: Record<string, unknown> = {
  "nexa-paraguay:es": { ... },
  "nexa-paraguay:en": { ... },
  // ... all tenants + locales
}
```

New structure (one file per tenant per locale in `generated/tenants/`):
```
generated/tenants/
  nexa-paraguay.es.ts
  nexa-paraguay.en.ts
  nexa-paraguay.nl.ts
  nexa-paraguay.de.ts
  granja-cabral.es.ts
  ...
  verticals/
    relocation.es.ts
    ...
```

Each file exports a single default:
```typescript
// generated/tenants/nexa-paraguay.es.ts
export default { /* site content */ } as Record<string, unknown>
```

### Step 2: Add Dynamic Loader in `site-loader.ts`

Replace the static `CONTENT[...]` lookup with a dynamic import:

```typescript
// Cache for loaded chunks (module-level, survives HMR)
const contentCache = new Map<string, Record<string, unknown>>()

export async function loadSiteContentAsync(
  siteSlug: string,
  locale: Locale,
): Promise<Record<string, unknown>> {
  const key = `${siteSlug}:${locale}`
  const cached = contentCache.get(key)
  if (cached) return cached

  try {
    const mod = await import(`./generated/tenants/${siteSlug}.${locale}.ts`)
    contentCache.set(key, mod.default)
    return mod.default
  } catch {
    // Fall back to vertical content
    return loadVerticalContentAsync(siteSlug, locale)
  }
}
```

### Step 3: Keep Sync Fallback for SSR/Static Generation

The existing sync `loadSiteContent()` function stays for SSG path (static page generation at build time). The async version is used for SSR/ISR paths.

```typescript
// Keep existing for backward compat
export function loadSiteContent(siteSlug: string, locale: Locale): Record<string, unknown> {
  return CONTENT[`${siteSlug}:${locale}`] ?? {}
}
```

### Step 4: Update Build Script

```bash
# web/package.json
"scripts": {
  "generate:tenant-data": "tsx scripts/generate-tenant-data.ts",
  "build": "npm run generate:tenant-data && npm run generate:renderer && npm run copy:tenant-images && next build"
}
```

No change to the build pipeline — the generation script still runs at the same point.

## Migration Strategy

1. First deploy: Keep monolithic file + also emit per-tenant chunks
2. Second deploy: Switch loader to prefer chunks, keep monolithic as fallback
3. Third deploy: Remove monolithic file

## Files to Touch

| File | Change |
|---|---|
| `web/scripts/generate-tenant-data.ts` | Emit per-tenant files instead of one big file |
| `web/lib/engine/site-loader.ts` | Add `loadSiteContentAsync()`, keep sync fallback |
| `web/lib/engine/compose-site.ts` | Optionally switch to async loading for SSR paths |
| `web/lib/engine/generated/` | New `tenants/` subdirectory |

## Rollback Plan

1. Revert to old generator script
2. Restore `site-loader.ts` to use `CONTENT[...]` directly
3. Rebuild and deploy

## Effort & Risk

- **Effort**: Medium (2-4 hours)
- **Risk**: Low — async loader with sync fallback means no breaking change
- **Build Time Reduction**: Estimated 30-50% (from ~24s down to ~12-16s)
- **Cold Start Improvement**: Estimated 40-60% smaller initial bundle

## Success Criteria

- [ ] `npm run generate:tenant-data` produces `generated/tenants/*.ts` files
- [ ] `npm run build` completes in <18s (currently ~24s)
- [ ] All tenant sites render correctly (200 status)
- [ ] Content edits to one tenant don't rebuild all tenants
