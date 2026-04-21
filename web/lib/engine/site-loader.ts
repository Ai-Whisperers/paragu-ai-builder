/**
 * Tenant data loader — reads from the auto-generated tenant-data module
 * (see `scripts/generate-tenant-data.ts`).
 *
 * Every function here is a synchronous object lookup; no filesystem calls,
 * no `process.cwd()`, no dynamic `require()`. That keeps the loader safe
 * to import from both Node (VPS standalone) and Edge Runtime (Cloudflare
 * Pages / Workers), with identical behavior in both.
 *
 * To add / change tenant data, edit the source JSON under `sites/*` and
 * `src/verticals/*` and re-run `npm run generate:tenant-data`. The
 * `prebuild` hook does this automatically on every `npm run build`.
 */
import type { Locale } from '@/lib/i18n/config'
import type {
  SiteDefinition,
  PageDefinition,
  VerticalDefinition,
} from './site-types'
import {
  CONTENT,
  IMAGES_MANIFESTS,
  PAGES,
  SITES,
  TENANT_TOKENS,
  TESTIMONIALS_DATA,
  VERTICALS,
  VERTICAL_COPY,
  VERTICAL_SCHEMAS,
  VERTICAL_STARTER_KITS,
  VERTICAL_TOKENS,
} from './generated/tenant-data'
import { SITES as CANONICAL_SITES } from './static-sites'

/**
 * Canonical site slugs — the subset intentionally exposed via
 * `generateStaticParams` and routing. Full tenant data is still available
 * via `loadSite(slug)` for any slug in `sites/`, but this narrow list
 * keeps demo-only sites out of the SSG catalog.
 */
export function listSiteSlugs(): string[] {
  return Object.keys(CANONICAL_SITES)
}

export function loadSite(slug: string): SiteDefinition {
  const raw = SITES[slug]
  if (!raw) {
    throw new Error(`[site-loader] Site not found: ${slug}`)
  }
  return { ...(raw as Omit<SiteDefinition, 'slug'>), slug }
}

export function loadPage(siteSlug: string, pageSlug: string): PageDefinition | null {
  const raw = PAGES[`${siteSlug}:${pageSlug}`]
  return (raw as unknown as PageDefinition | undefined) ?? null
}

export function listPageSlugs(siteSlug: string): string[] {
  const prefix = `${siteSlug}:`
  const slugs: string[] = []
  for (const key of Object.keys(PAGES)) {
    if (key.startsWith(prefix)) slugs.push(key.slice(prefix.length))
  }
  return slugs.sort()
}

export function loadSiteContent(
  siteSlug: string,
  locale: Locale,
): Record<string, unknown> {
  return (CONTENT[`${siteSlug}:${locale}`] as Record<string, unknown> | undefined) ?? {}
}

export function loadVertical(verticalId: string): VerticalDefinition {
  const raw = VERTICALS[verticalId] as
    | {
        id: string
        name: string
        features: Record<string, boolean>
        allowedSections?: string[]
      }
    | undefined
  if (!raw) {
    return {
      id: verticalId,
      name: verticalId,
      features: {},
      schema: {},
      starterKits: [],
    }
  }
  const schema = (VERTICAL_SCHEMAS[verticalId] as Record<string, unknown> | undefined) ?? {}
  const starterKits = VERTICAL_STARTER_KITS[verticalId]
    ? [...VERTICAL_STARTER_KITS[verticalId]]
    : []
  return { ...raw, schema, starterKits }
}

export function loadVerticalCopy(
  verticalId: string,
  locale: Locale,
): Record<string, unknown> {
  return (VERTICAL_COPY[`${verticalId}:${locale}`] as Record<string, unknown> | undefined) ?? {}
}

export function loadVerticalTokens(verticalId: string): Record<string, unknown> {
  return (VERTICAL_TOKENS[verticalId] as Record<string, unknown> | undefined) ?? {}
}

export function loadSiteTokens(siteSlug: string): Record<string, unknown> {
  return (TENANT_TOKENS[siteSlug] as Record<string, unknown> | undefined) ?? {}
}

/**
 * Returns the raw images manifest (as emitted into the generated bundle)
 * for a tenant, or `null` when the tenant didn't ship one. Parsing into
 * the typed `ImagesManifest` shape is the caller's responsibility — see
 * `lib/engine/images-loader.ts` for the typed helpers.
 */
export function loadSiteImagesManifest(
  siteSlug: string,
): Record<string, unknown> | null {
  const raw = (IMAGES_MANIFESTS as Record<string, unknown>)[siteSlug]
  return (raw as Record<string, unknown> | undefined) ?? null
}

/**
 * Returns the raw testimonials payload (`testimonials.json`) for a
 * tenant — shape-agnostic; the common shape is
 * `{ testimonials: { title, subtitle, items: [...], stats? } }`.
 * Returns `null` when the tenant didn't ship one.
 */
export function loadSiteTestimonials(
  siteSlug: string,
): Record<string, unknown> | null {
  const raw = (TESTIMONIALS_DATA as Record<string, unknown>)[siteSlug]
  return (raw as Record<string, unknown> | undefined) ?? null
}
