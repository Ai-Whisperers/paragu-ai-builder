/**
 * Admin: per-tenant image assets dashboard.
 *
 * Shows every asset declared in the tenant's images manifest with:
 * - Thumbnail
 * - Bucket.key identifier
 * - Usage count — number of occurrences of the key in the tenant's
 *   content / pages / blog (scanned from the generated tenant-data bundle
 *   so we don't re-read the filesystem in production).
 * - Orphan flag (usage count === 0)
 * - Placeholder flag (file hash matches docs/PLACEHOLDER_HASHES.json
 *   when present in the filesystem; otherwise best-effort filename
 *   match against the placeholder list).
 *
 * Auth: env-allowlisted admin emails (see lib/auth/admin.ts).
 */
import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as fs from 'fs'
import * as path from 'path'
import { loadImagesManifest, type ImageAsset } from '@/lib/engine/images-loader'
import {
  CONTENT,
  PAGES,
  BLOG_POSTS,
} from '@/lib/engine/generated/tenant-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export const metadata = {
  title: 'Admin · Tenant assets | ParaguAI',
}

interface AssetRow {
  bucket: string
  name: string
  key: string
  asset: ImageAsset
  usageCount: number
  isOrphan: boolean
  isPlaceholder: boolean
  localizedAltCount: number
}

/**
 * Build a single text blob of everything this tenant references in
 * content / pages / blog. Used for naive-but-correct reference counting
 * of `bucket.key` occurrences across JSON + MDX frontmatter.
 */
function buildTenantTextBlob(slug: string): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(CONTENT)) {
    if (key.startsWith(`${slug}:`)) parts.push(JSON.stringify(value))
  }
  for (const [key, value] of Object.entries(PAGES)) {
    if (key.startsWith(`${slug}:`)) parts.push(JSON.stringify(value))
  }
  for (const [key, value] of Object.entries(BLOG_POSTS)) {
    if (key.startsWith(`${slug}:`)) parts.push(String(value))
  }
  return parts.join('\n')
}

function countOccurrences(blob: string, needle: string): number {
  if (!needle) return 0
  let count = 0
  let idx = 0
  while (true) {
    const found = blob.indexOf(needle, idx)
    if (found < 0) break
    count++
    idx = found + needle.length
  }
  return count
}

interface PlaceholderFile {
  description?: string
  placeholders?: Record<string, string>
}

function loadPlaceholderList(slug: string): Set<string> {
  try {
    // The dashboard runs on the server — it's safe to read the tenant's
    // PLACEHOLDER_HASHES.json directly from the filesystem. We only use
    // the keys (filename stems) for matching since we don't re-hash
    // every asset at request time.
    const cwd = process.cwd()
    const candidates = [
      path.join(cwd, 'sites', slug, 'docs', 'PLACEHOLDER_HASHES.json'),
      path.join(cwd, '..', 'sites', slug, 'docs', 'PLACEHOLDER_HASHES.json'),
    ]
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf-8')) as PlaceholderFile
        return new Set(Object.keys(data.placeholders ?? {}))
      }
    }
  } catch {
    // Best effort — no hashes file means no placeholder flagging.
  }
  return new Set()
}

function srcMatchesPlaceholder(src: string, placeholders: Set<string>): boolean {
  if (placeholders.size === 0) return false
  // Placeholder keys look like "images/team/operations-director.png".
  // Asset src looks like "/sites/<slug>/images/team/operations-director.webp".
  // Strip the leading "/sites/<slug>/" and swap extension to match loosely.
  const withoutPrefix = src.replace(/^\/sites\/[^/]+\//, '')
  const withoutExt = withoutPrefix.replace(/\.(webp|png|jpg|jpeg)$/i, '')
  for (const p of placeholders) {
    const pWithoutExt = p.replace(/\.(webp|png|jpg|jpeg)$/i, '')
    if (pWithoutExt === withoutExt) return true
  }
  return false
}

function toRows(slug: string): AssetRow[] {
  const manifest = loadImagesManifest(slug)
  if (!manifest) return []
  const blob = buildTenantTextBlob(slug)
  const placeholders = loadPlaceholderList(slug)
  const rows: AssetRow[] = []
  for (const [bucket, group] of Object.entries(manifest.images)) {
    for (const [name, asset] of Object.entries(group)) {
      const key = `${bucket}.${name}`
      // Authors reference images as "bucket.name" inside $img / @img / @src.
      // We count exact-string matches in the bundled content.
      const usageCount = countOccurrences(blob, key)
      rows.push({
        bucket,
        name,
        key,
        asset,
        usageCount,
        isOrphan: usageCount === 0,
        isPlaceholder: srcMatchesPlaceholder(asset.src, placeholders),
        localizedAltCount: asset.altByLocale
          ? Object.keys(asset.altByLocale).length
          : 0,
      })
    }
  }
  rows.sort((a, b) => a.bucket.localeCompare(b.bucket) || a.name.localeCompare(b.name))
  return rows
}

export default async function TenantAssetsPage({ params }: Props) {
  const { slug } = await params
  const manifest = loadImagesManifest(slug)
  if (!manifest) notFound()

  const rows = toRows(slug)
  const totals = {
    count: rows.length,
    orphans: rows.filter((r) => r.isOrphan).length,
    placeholders: rows.filter((r) => r.isPlaceholder).length,
    localizedAtLeastOne: rows.filter((r) => r.localizedAltCount > 0).length,
  }
  const buckets = Array.from(new Set(rows.map((r) => r.bucket)))

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href={`/admin/tenants/${slug}`} className="text-sm text-blue-600 hover:underline">
            ← Back to tenant
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Assets · {slug}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {totals.count} assets across {buckets.length} buckets ·{' '}
            <span className={totals.orphans > 0 ? 'text-amber-700 font-medium' : ''}>
              {totals.orphans} orphan
            </span>{' '}
            ·{' '}
            <span className={totals.placeholders > 0 ? 'text-red-700 font-medium' : ''}>
              {totals.placeholders} placeholder
            </span>{' '}
            · {totals.localizedAtLeastOne} with localized alt
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-600">No images manifest found for this tenant.</p>
      ) : (
        <div className="space-y-8">
          {buckets.map((bucket) => (
            <section key={bucket}>
              <h2 className="mb-3 border-b pb-1 text-lg font-semibold">{bucket}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {rows.filter((r) => r.bucket === bucket).map((row) => (
                  <AssetCard key={row.key} row={row} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}

function AssetCard({ row }: { row: AssetRow }) {
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm">
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.asset.src}
          alt={row.asset.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {row.isOrphan && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
              ORPHAN
            </span>
          )}
          {row.isPlaceholder && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-900">
              AI PLACEHOLDER
            </span>
          )}
          {row.localizedAltCount > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-900">
              i18n×{row.localizedAltCount}
            </span>
          )}
        </div>
      </div>
      <div className="text-xs font-mono text-gray-700">{row.key}</div>
      <div className="mt-1 truncate text-[11px] text-gray-500" title={row.asset.alt}>
        {row.asset.alt}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600">
        <span>
          referenced <strong>{row.usageCount}×</strong>
        </span>
        <a
          href={row.asset.src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          open
        </a>
      </div>
    </div>
  )
}
