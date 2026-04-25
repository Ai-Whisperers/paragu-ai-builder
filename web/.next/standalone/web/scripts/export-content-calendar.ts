#!/usr/bin/env node
/**
 * Export a tenant's docs/CONTENT_CALENDAR.yml into a Buffer-compatible
 * JSON payload at `sites/<slug>/dist/social/calendar.json` — ready to
 * be consumed by social schedulers (Buffer, Later, etc.) or by an
 * internal scheduling script.
 *
 * For each post, emits:
 *   { id, scheduledAt, timezone, platforms, image: {src, alt}, captions, hashtags }
 *
 * Image refs like "social.villaMorra" are resolved through the tenant's
 * images.json so the output contains real `src` URLs + alt.
 *
 * Usage:
 *   tsx scripts/export-content-calendar.ts nexa-paraguay
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '../..')

interface RawPost {
  id: string
  date: string
  platform?: string
  platforms?: string[]
  image: string
  caption_es?: string
  caption_en?: string
  caption_nl?: string
  caption_de?: string
  caption_pt?: string
  hashtags?: string[]
}

interface RawCalendar {
  tenant: string
  defaults?: {
    timezone?: string
    platforms?: string[]
  }
  posts: RawPost[]
}

interface ImageAsset {
  src: string
  alt: string
  altByLocale?: Record<string, string>
}

interface ImagesManifest {
  images: Record<string, Record<string, ImageAsset>>
}

interface ExportedPost {
  id: string
  scheduledAt: string
  timezone: string
  platforms: string[]
  image: { src: string; alt: string; key: string }
  captions: Record<string, string>
  hashtags: string[]
}

interface ExportedCalendar {
  tenant: string
  generatedAt: string
  source: string
  count: number
  posts: ExportedPost[]
}

function resolveImage(
  manifest: ImagesManifest,
  key: string,
): ImageAsset | null {
  const [bucket, name] = key.split('.')
  if (!bucket || !name) return null
  return manifest.images[bucket]?.[name] ?? null
}

function exportCalendar(slug: string): void {
  const calendarPath = path.join(PROJECT_ROOT, 'sites', slug, 'docs', 'CONTENT_CALENDAR.yml')
  const manifestPath = path.join(PROJECT_ROOT, 'sites', slug, 'images.json')
  const outDir = path.join(PROJECT_ROOT, 'sites', slug, 'dist', 'social')
  const outPath = path.join(outDir, 'calendar.json')

  if (!fs.existsSync(calendarPath)) {
    throw new Error(`[export-content-calendar] No CONTENT_CALENDAR.yml for tenant "${slug}" (looked in ${calendarPath})`)
  }
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`[export-content-calendar] No images.json for tenant "${slug}"`)
  }

  const raw = parseYaml(fs.readFileSync(calendarPath, 'utf-8')) as RawCalendar
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as ImagesManifest

  const defaultTz = raw.defaults?.timezone || 'America/Asuncion'
  const defaultPlatforms = raw.defaults?.platforms || []

  const posts: ExportedPost[] = raw.posts.map((p) => {
    const asset = resolveImage(manifest, p.image)
    if (!asset) {
      throw new Error(`[export-content-calendar] post ${p.id} references unknown image "${p.image}"`)
    }
    const captions: Record<string, string> = {}
    if (p.caption_es) captions.es = p.caption_es
    if (p.caption_en) captions.en = p.caption_en
    if (p.caption_nl) captions.nl = p.caption_nl
    if (p.caption_de) captions.de = p.caption_de
    if (p.caption_pt) captions.pt = p.caption_pt
    const platforms = p.platforms ?? (p.platform ? [p.platform] : defaultPlatforms)

    return {
      id: p.id,
      scheduledAt: new Date(p.date).toISOString(),
      timezone: defaultTz,
      platforms,
      image: { src: asset.src, alt: asset.alt, key: p.image },
      captions,
      hashtags: p.hashtags ?? [],
    }
  })

  const exported: ExportedCalendar = {
    tenant: raw.tenant,
    generatedAt: new Date().toISOString(),
    source: 'sites/' + slug + '/docs/CONTENT_CALENDAR.yml',
    count: posts.length,
    posts,
  }

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(exported, null, 2) + '\n')
  console.log(`[export-content-calendar] wrote ${outPath}`)
  console.log(`[export-content-calendar] ${posts.length} posts exported`)
}

const slug = process.argv[2]
if (!slug) {
  console.error('usage: tsx scripts/export-content-calendar.ts <tenant-slug>')
  process.exit(1)
}
exportCalendar(slug)
