/**
 * Image manifest loader — reads from the auto-generated tenant-data module
 * (see `scripts/generate-tenant-data.ts`).
 *
 * Each tenant can ship a `sites/<slug>/images.json` manifest that groups
 * image assets into buckets (brand, hero, whyParaguay, process, team,
 * office, trust, blog, testimonials, programs, ads, email, social, press).
 * This loader exposes synchronous lookups by the composer, section
 * components, and metadata helpers so they can reference assets by a
 * stable `bucket.assetName` key instead of hard-coding paths.
 *
 * Safe to import from both Node (VPS standalone) and Edge Runtime
 * (Cloudflare Pages / Workers) — no filesystem or dynamic require calls.
 */
import { IMAGES_MANIFESTS } from './generated/tenant-data'

export interface ImageAsset {
  src: string
  alt: string
  width?: number
  height?: number
  /** Legacy PNG source kept when a `.webp` conversion is present. */
  fallbackSrc?: string
}

export interface ImagesManifest {
  tenant: string
  basePath?: string
  fallback?: string
  totalImages?: number
  images: Record<string, Record<string, ImageAsset>>
}

/**
 * Parse a raw JSON manifest (from the generated bundle or an inline source)
 * into the typed `ImagesManifest` shape. Returns `null` when the input is
 * missing or malformed — callers should degrade gracefully.
 */
function parseManifest(raw: unknown): ImagesManifest | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const images = obj.images
  if (!images || typeof images !== 'object') return null
  return {
    tenant: typeof obj.tenant === 'string' ? obj.tenant : '',
    basePath: typeof obj.basePath === 'string' ? obj.basePath : undefined,
    fallback: typeof obj.fallback === 'string' ? obj.fallback : undefined,
    totalImages: typeof obj.totalImages === 'number' ? obj.totalImages : undefined,
    images: images as Record<string, Record<string, ImageAsset>>,
  }
}

/**
 * Load the images manifest for a tenant from the generated bundle. Returns
 * `null` when no manifest was shipped.
 */
export function loadImagesManifest(slug: string): ImagesManifest | null {
  const raw = (IMAGES_MANIFESTS as Record<string, unknown>)[slug]
  if (!raw) return null
  return parseManifest(raw)
}

/** Split a "bucket.assetName" key. Returns `null` if malformed. */
function splitKey(key: string): [string, string] | null {
  const dot = key.indexOf('.')
  if (dot <= 0 || dot === key.length - 1) return null
  return [key.slice(0, dot), key.slice(dot + 1)]
}

/**
 * Resolve a manifest key ("bucket.assetName") to the full `ImageAsset`.
 * Returns `null` when the manifest is missing, the bucket is missing, or
 * the asset isn't declared.
 */
export function resolveImage(
  manifest: ImagesManifest | null,
  key: string,
): ImageAsset | null {
  if (!manifest) return null
  const parts = splitKey(key)
  if (!parts) return null
  const [bucket, name] = parts
  const group = manifest.images[bucket]
  if (!group) return null
  const asset = group[name]
  if (!asset || typeof asset.src !== 'string') return null
  return asset
}

/** Convenience: resolve the `.src` for a key, or `null` on miss. */
export function resolveImageSrc(
  manifest: ImagesManifest | null,
  key: string,
): string | null {
  const hit = resolveImage(manifest, key)
  return hit ? hit.src : null
}

const LOCALE_TO_HERO_KEY: Record<string, string> = {
  nl: 'localizedNl',
  en: 'localizedEn',
  de: 'localizedDe',
  es: 'localizedEs',
  pt: 'localizedPt',
}

/**
 * Pick a locale-aware hero image from the manifest. Falls back to
 * `hero.home` when no localized variant is declared for this locale.
 */
export function resolveLocalizedHero(
  manifest: ImagesManifest | null,
  locale: string,
): ImageAsset | null {
  if (!manifest) return null
  const localizedKey = LOCALE_TO_HERO_KEY[locale]
  if (localizedKey) {
    const localized = resolveImage(manifest, `hero.${localizedKey}`)
    if (localized) return localized
  }
  return resolveImage(manifest, 'hero.home')
}
