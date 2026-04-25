#!/usr/bin/env node
/**
 * Tenant-data codegen.
 *
 * Walks every tenant under `sites/*` and every vertical under `src/verticals/*`,
 * and emits a single TypeScript module at `web/lib/engine/generated/tenant-data.ts`
 * that re-exports the JSON as a set of object literals.
 *
 * Motivation: Cloudflare Pages / Workers Edge Runtime has no `fs`, no
 * `process.cwd()`, no dynamic `require()`. By bundling tenant data into a
 * module that's imported at build time, every loader becomes a synchronous
 * object lookup — no runtime filesystem dependency — so the same code runs
 * identically on Node (VPS) and Edge (Cloudflare).
 *
 * The tenant JSON files under `sites/*` and `src/verticals/*` remain the
 * source of truth. This script is idempotent — re-running with no data
 * changes produces a byte-identical file (keys are sorted; values are
 * `JSON.stringify`'d with stable whitespace).
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, '../..')
const SITES_DIR = path.join(PROJECT_ROOT, 'sites')
const VERTICALS_DIR = path.join(PROJECT_ROOT, 'src/verticals')
const BASE_TOKENS_PATH = path.join(PROJECT_ROOT, 'src/tokens/base.tokens.json')
const OUT_DIR = path.join(PROJECT_ROOT, 'web/lib/engine/generated')
const OUT_FILE = path.join(OUT_DIR, 'tenant-data.ts')

type JsonRecord = Record<string, unknown>

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
}

function isDir(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory()
  } catch {
    return false
  }
}

function listSubdirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .sort()
}

/** Sort object keys recursively so output is stable across runs. */
function sortKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => sortKeys(v)) as unknown as T
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    const sorted: JsonRecord = {}
    for (const k of Object.keys(value as JsonRecord).sort()) {
      sorted[k] = sortKeys((value as JsonRecord)[k])
    }
    return sorted as unknown as T
  }
  return value
}

function formatValue(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

// ---------- discover site data ----------

interface DiscoveredSite {
  slug: string
  site: JsonRecord | null
  tokens: JsonRecord | null
  pages: Record<string, JsonRecord>
  content: Record<string, JsonRecord>
  blog: Record<string, Record<string, string>> // locale -> slug -> raw MDX
  images: JsonRecord | null
  testimonials: JsonRecord | null // tenant testimonials (sites/<slug>/testimonials.json)
}

function discoverSites(): DiscoveredSite[] {
  const slugs = listSubdirs(SITES_DIR).filter((s) => !s.startsWith('_') && !s.startsWith('.'))
  const result: DiscoveredSite[] = []
  for (const slug of slugs) {
    const siteDir = path.join(SITES_DIR, slug)
    const sitePath = path.join(siteDir, 'site.json')
    if (!fs.existsSync(sitePath)) continue // e.g. shared-images asset bucket

    const site = readJson<JsonRecord>(sitePath)

    const tokensPath = path.join(siteDir, 'tokens.json')
    const tokens = fs.existsSync(tokensPath) ? readJson<JsonRecord>(tokensPath) : null

    const pages: Record<string, JsonRecord> = {}
    const pagesDir = path.join(siteDir, 'pages')
    // Recurse one level so `pages/producto/titanium.json` becomes the
    // slug `producto/titanium`. Page slugs use forward slashes to match
    // tenant URLs (buildLocaleUrl turns them into path segments).
    for (const f of listJsonFiles(pagesDir)) {
      const pageSlug = f.replace(/\.json$/, '')
      pages[pageSlug] = readJson<JsonRecord>(path.join(pagesDir, f))
    }
    if (isDir(pagesDir)) {
      for (const sub of listSubdirs(pagesDir)) {
        const subDir = path.join(pagesDir, sub)
        for (const f of listJsonFiles(subDir)) {
          const pageSlug = `${sub}/${f.replace(/\.json$/, '')}`
          pages[pageSlug] = readJson<JsonRecord>(path.join(subDir, f))
        }
      }
    }

    const content: Record<string, JsonRecord> = {}
    const contentDir = path.join(siteDir, 'content')
    for (const f of listJsonFiles(contentDir)) {
      const locale = f.replace(/\.json$/, '')
      content[locale] = readJson<JsonRecord>(path.join(contentDir, f))
    }

    const blog: Record<string, Record<string, string>> = {}
    const blogDir = path.join(siteDir, 'blog')
    if (isDir(blogDir)) {
      for (const locale of listSubdirs(blogDir)) {
        const localeDir = path.join(blogDir, locale)
        const entries: Record<string, string> = {}
        for (const f of listMdxFiles(localeDir)) {
          const postSlug = f.replace(/\.mdx$/, '')
          entries[postSlug] = fs.readFileSync(path.join(localeDir, f), 'utf-8')
        }
        if (Object.keys(entries).length > 0) blog[locale] = entries
      }
    }

    const imagesPath = path.join(siteDir, 'images.json')
    const images = fs.existsSync(imagesPath) ? readJson<JsonRecord>(imagesPath) : null

    const testimonialsPath = path.join(siteDir, 'testimonials.json')
    const testimonials = fs.existsSync(testimonialsPath)
      ? readJson<JsonRecord>(testimonialsPath)
      : null

    result.push({ slug, site, tokens, pages, content, blog, images, testimonials })
  }
  return result
}

// ---------- discover vertical data ----------

interface DiscoveredVertical {
  id: string
  vertical: JsonRecord | null
  tokens: JsonRecord | null
  copy: Record<string, JsonRecord>
  schema: JsonRecord | null
  starterKits: string[]
}

function discoverVerticals(): DiscoveredVertical[] {
  const ids = listSubdirs(VERTICALS_DIR)
  const result: DiscoveredVertical[] = []
  for (const id of ids) {
    const vDir = path.join(VERTICALS_DIR, id)
    const vPath = path.join(vDir, 'vertical.json')
    if (!fs.existsSync(vPath)) continue
    const vertical = readJson<JsonRecord>(vPath)

    const tokensPath = path.join(vDir, 'defaults.tokens.json')
    const tokens = fs.existsSync(tokensPath) ? readJson<JsonRecord>(tokensPath) : null

    const schemaPath = path.join(vDir, 'schema.json')
    const schema = fs.existsSync(schemaPath) ? readJson<JsonRecord>(schemaPath) : null

    const copy: Record<string, JsonRecord> = {}
    const copyDir = path.join(vDir, 'copy')
    for (const f of listJsonFiles(copyDir)) {
      const locale = f.replace(/\.json$/, '')
      copy[locale] = readJson<JsonRecord>(path.join(copyDir, f))
    }

    const starterKits: string[] = []
    const kitsDir = path.join(vDir, 'starter-kits')
    if (isDir(kitsDir)) {
      for (const f of fs.readdirSync(kitsDir)) {
        if (f.endsWith('.pages.json')) starterKits.push(f.replace(/\.pages\.json$/, ''))
      }
      starterKits.sort()
    }

    result.push({ id, vertical, tokens, copy, schema, starterKits })
  }
  return result
}

// ---------- emit module ----------

function emitRecord(
  identifier: string,
  typeAnnotation: string,
  entries: Array<{ key: string; value: unknown }>,
): string {
  const lines: string[] = []
  lines.push(`export const ${identifier}: ${typeAnnotation} = {`)
  for (const { key, value } of entries.sort((a, b) => a.key.localeCompare(b.key))) {
    lines.push(`  ${JSON.stringify(key)}: ${indent(formatValue(value), 2)},`)
  }
  lines.push('}')
  return lines.join('\n')
}

function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line, i) => (i === 0 ? line : pad + line))
    .join('\n')
}

function generate(): string {
  const sites = discoverSites()
  const verticals = discoverVerticals()
  const baseTokens = fs.existsSync(BASE_TOKENS_PATH)
    ? readJson<JsonRecord>(BASE_TOKENS_PATH)
    : null

  const sitesEntries: Array<{ key: string; value: unknown }> = []
  const tokensEntries: Array<{ key: string; value: unknown }> = []
  const pagesEntries: Array<{ key: string; value: unknown }> = []
  const contentEntries: Array<{ key: string; value: unknown }> = []
  const blogEntries: Array<{ key: string; value: unknown }> = []
  const imagesEntries: Array<{ key: string; value: unknown }> = []
  const testimonialsEntries: Array<{ key: string; value: unknown }> = []
  const siteSlugs: string[] = []

  for (const s of sites) {
    siteSlugs.push(s.slug)
    if (s.site) sitesEntries.push({ key: s.slug, value: sortKeys(s.site) })
    if (s.tokens) tokensEntries.push({ key: s.slug, value: sortKeys(s.tokens) })
    if (s.images) imagesEntries.push({ key: s.slug, value: sortKeys(s.images) })
    if (s.testimonials) testimonialsEntries.push({ key: s.slug, value: sortKeys(s.testimonials) })
    for (const [pageSlug, page] of Object.entries(s.pages)) {
      pagesEntries.push({ key: `${s.slug}:${pageSlug}`, value: sortKeys(page) })
    }
    for (const [locale, content] of Object.entries(s.content)) {
      contentEntries.push({ key: `${s.slug}:${locale}`, value: sortKeys(content) })
    }
    for (const [locale, posts] of Object.entries(s.blog)) {
      for (const [postSlug, raw] of Object.entries(posts)) {
        blogEntries.push({ key: `${s.slug}:${locale}:${postSlug}`, value: raw })
      }
    }
  }

  const verticalEntries: Array<{ key: string; value: unknown }> = []
  const verticalTokensEntries: Array<{ key: string; value: unknown }> = []
  const verticalSchemaEntries: Array<{ key: string; value: unknown }> = []
  const verticalCopyEntries: Array<{ key: string; value: unknown }> = []
  const verticalStarterKits: Array<{ key: string; value: unknown }> = []

  for (const v of verticals) {
    if (v.vertical) verticalEntries.push({ key: v.id, value: sortKeys(v.vertical) })
    if (v.tokens) verticalTokensEntries.push({ key: v.id, value: sortKeys(v.tokens) })
    if (v.schema) verticalSchemaEntries.push({ key: v.id, value: sortKeys(v.schema) })
    verticalStarterKits.push({ key: v.id, value: v.starterKits })
    for (const [locale, copy] of Object.entries(v.copy)) {
      verticalCopyEntries.push({ key: `${v.id}:${locale}`, value: sortKeys(copy) })
    }
  }

  const header = [
    '/**',
    ' * AUTO-GENERATED by scripts/generate-tenant-data.ts — do not edit.',
    ' *',
    ' * This module bundles the JSON under `sites/*` and `src/verticals/*` at',
    ' * build time so the engine loaders can look up tenant data via synchronous',
    ' * imports instead of `fs.readFileSync`. That lets the same code run on',
    ' * both Node (VPS standalone) and Edge Runtime (Cloudflare Pages / Workers).',
    ' *',
    ' * Regenerate with `npm run generate:tenant-data`. The prebuild hook does',
    ' * this automatically on every `npm run build`.',
    ' */',
    '',
    'export type JsonRecord = Record<string, unknown>',
    '',
  ].join('\n')

  const body = [
    `/** Counts: sites=${siteSlugs.length}, pages=${pagesEntries.length}, content=${contentEntries.length}, blog=${blogEntries.length}, images=${imagesEntries.length}, verticals=${verticalEntries.length}. */`,
    `export const SITE_SLUGS: readonly string[] = ${formatValue([...siteSlugs].sort())} as const`,
    '',
    `export const BASE_TOKENS: JsonRecord = ${formatValue(sortKeys(baseTokens ?? {}))}`,
    '',
    emitRecord('SITES', 'Record<string, JsonRecord>', sitesEntries),
    '',
    emitRecord('TENANT_TOKENS', 'Record<string, JsonRecord>', tokensEntries),
    '',
    emitRecord('PAGES', 'Record<string, JsonRecord>', pagesEntries),
    '',
    emitRecord('CONTENT', 'Record<string, JsonRecord>', contentEntries),
    '',
    emitRecord('BLOG_POSTS', 'Record<string, string>', blogEntries),
    '',
    emitRecord('IMAGES_MANIFESTS', 'Record<string, JsonRecord>', imagesEntries),
    '',
    emitRecord('TESTIMONIALS_DATA', 'Record<string, JsonRecord>', testimonialsEntries),
    '',
    emitRecord('VERTICALS', 'Record<string, JsonRecord>', verticalEntries),
    '',
    emitRecord('VERTICAL_TOKENS', 'Record<string, JsonRecord>', verticalTokensEntries),
    '',
    emitRecord('VERTICAL_SCHEMAS', 'Record<string, JsonRecord>', verticalSchemaEntries),
    '',
    emitRecord('VERTICAL_COPY', 'Record<string, JsonRecord>', verticalCopyEntries),
    '',
    emitRecord('VERTICAL_STARTER_KITS', 'Record<string, readonly string[]>', verticalStarterKits),
    '',
  ].join('\n')

  return header + body
}

// ---------- main ----------

fs.mkdirSync(OUT_DIR, { recursive: true })
const output = generate()
fs.writeFileSync(OUT_FILE, output, 'utf-8')

const lines = output.split('\n').length
const bytes = Buffer.byteLength(output, 'utf-8')
const kb = (bytes / 1024).toFixed(1)
console.log(`[tenant-data] wrote ${OUT_FILE}`)
console.log(`[tenant-data] ${lines.toLocaleString()} lines, ${kb} KB`)
