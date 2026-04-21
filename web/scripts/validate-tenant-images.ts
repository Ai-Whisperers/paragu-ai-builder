#!/usr/bin/env node
/**
 * Cross-platform tenant images validator (Node, replaces the
 * PowerShell-only `scripts/validate-nexa-images.ps1`).
 *
 * For a given tenant slug:
 *   1. Parse `sites/<slug>/images.json`.
 *   2. For every `src` (and `fallbackSrc` if present) under
 *      `/sites/<slug>/images/`, assert the file exists on disk.
 *   3. Walk `sites/<slug>/images/**\/*.{png,webp,jpg,jpeg}` and assert
 *      every file is indexed in the manifest — catches orphans.
 *   4. When `site.json.isLiveProduction === true` AND the tenant is NOT
 *      flagged as a demo, hard-block if any SHA-256 recorded in
 *      `docs/PLACEHOLDER_HASHES.json` still matches a file on disk
 *      (AI placeholder portraits must be swapped for real photos
 *      before launch — see DEMO_CONTENT.md / TESTIMONIALS_GATING.md).
 *      Demo mode is signalled by any of: `is_demo: true`,
 *      `demoMode.enabled: true`, or `demoMode.aiPlaceholdersAllowed: true`.
 *
 * Exit codes:
 *   0 — all checks passed
 *   2 — validation failure (missing files, orphans, placeholder gate)
 *   3 — usage / I/O problem
 *
 * Usage:
 *   tsx scripts/validate-tenant-images.ts <slug>
 */
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '../..')

interface Asset {
  src?: string
  fallbackSrc?: string
  [k: string]: unknown
}

interface Manifest {
  basePath?: string
  images: Record<string, Record<string, Asset>>
  [k: string]: unknown
}

interface SiteJson {
  isLiveProduction?: boolean
  is_demo?: boolean
  demoMode?: { enabled?: boolean; aiPlaceholdersAllowed?: boolean }
  [k: string]: unknown
}

interface PlaceholderRegistry {
  /** map of relative path → expected SHA-256 */
  placeholders: Record<string, string>
  description?: string
}

function collectSrcs(m: Manifest): string[] {
  const out = new Set<string>()
  for (const bucket of Object.values(m.images || {})) {
    for (const asset of Object.values(bucket || {})) {
      if (asset?.src && typeof asset.src === 'string') out.add(asset.src)
      if (asset?.fallbackSrc && typeof asset.fallbackSrc === 'string') out.add(asset.fallbackSrc)
    }
  }
  return [...out]
}

function walkFiles(dir: string, ext: Set<string>): string[] {
  const out: string[] = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(abs, ext))
    } else if (entry.isFile()) {
      const e = path.extname(entry.name).toLowerCase()
      if (ext.has(e)) out.push(abs)
    }
  }
  return out
}

function sha256(file: string): string {
  const buf = fs.readFileSync(file)
  return crypto.createHash('sha256').update(buf).digest('hex')
}

function main() {
  const slug = process.argv[2]
  if (!slug) {
    console.error('Usage: tsx scripts/validate-tenant-images.ts <slug>')
    process.exit(3)
  }

  const siteDir = path.join(PROJECT_ROOT, 'sites', slug)
  const imagesRoot = path.join(siteDir, 'images')
  const manifestPath = path.join(siteDir, 'images.json')
  const sitePath = path.join(siteDir, 'site.json')
  const hashesPath = path.join(siteDir, 'docs', 'PLACEHOLDER_HASHES.json')

  if (!fs.existsSync(manifestPath)) {
    console.error(`[validate-tenant-images] missing images.json: ${manifestPath}`)
    process.exit(3)
  }

  let manifest: Manifest
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  } catch (err) {
    console.error('[validate-tenant-images] images.json parse failed:', err instanceof Error ? err.message : err)
    process.exit(3)
  }

  const refs = collectSrcs(manifest)
  const webPrefix = `/sites/${slug}/images/`
  const missing: string[] = []
  const indexed = new Set<string>()

  for (const ref of refs) {
    if (!ref.startsWith(webPrefix)) continue
    const rel = ref.slice(webPrefix.length)
    const abs = path.join(imagesRoot, rel)
    indexed.add(path.resolve(abs))
    if (!fs.existsSync(abs)) missing.push(ref)
  }

  // Orphan detection — files under images/ that the manifest doesn't mention.
  const exts = new Set(['.png', '.webp', '.jpg', '.jpeg'])
  const onDisk = walkFiles(imagesRoot, exts).map((p) => path.resolve(p))
  // Responsive width variants (`foo-w480.webp`) are derivatives of the
  // base asset and aren't indexed explicitly — ignore them in the orphan
  // check when a base version IS indexed.
  const orphans = onDisk.filter((abs) => {
    if (indexed.has(abs)) return false
    const m = abs.match(/-w(480|960|1920)\.webp$/)
    if (m) {
      const base = abs.replace(/-w(480|960|1920)\.webp$/, '.webp')
      if (indexed.has(base)) return false
    }
    // `.webp` files when a `.png` twin is indexed (fallbackSrc path):
    // The converter wrote both, so skipping the `.webp` when only the
    // `.png` is recorded is fine — but our converter always records
    // both, so this is only for tenants that predate D1.
    const png = abs.replace(/\.webp$/, '.png')
    if (indexed.has(png)) return false
    return true
  })

  // Placeholder-swap gate: only enforced when site.json signals production
  // AND the tenant is NOT in demo mode. Demo tenants intentionally ship
  // AI-generated portraits and copy to prospects while real content is
  // being gathered — blocking those would defeat the demo's purpose.
  let placeholderBlocked = false
  const placeholderMatches: string[] = []
  if (fs.existsSync(sitePath)) {
    const site: SiteJson = JSON.parse(fs.readFileSync(sitePath, 'utf-8'))
    const demoAllowsPlaceholders =
      site.is_demo === true ||
      site.demoMode?.enabled === true ||
      site.demoMode?.aiPlaceholdersAllowed === true
    if (
      site.isLiveProduction === true &&
      !demoAllowsPlaceholders &&
      fs.existsSync(hashesPath)
    ) {
      try {
        const reg: PlaceholderRegistry = JSON.parse(fs.readFileSync(hashesPath, 'utf-8'))
        for (const [relPath, expected] of Object.entries(reg.placeholders || {})) {
          const abs = path.join(siteDir, relPath)
          if (!fs.existsSync(abs)) continue
          const actual = sha256(abs)
          if (actual === expected) placeholderMatches.push(relPath)
        }
        if (placeholderMatches.length > 0) placeholderBlocked = true
      } catch (err) {
        console.error(
          '[validate-tenant-images] PLACEHOLDER_HASHES.json parse failed:',
          err instanceof Error ? err.message : err,
        )
      }
    }
  }

  console.log(`images.json JSON: OK`)
  console.log(`Referenced image paths: ${refs.length}`)
  console.log(`Missing on disk: ${missing.length}`)
  console.log(`Orphan files under images/: ${orphans.length}`)
  if (placeholderBlocked) {
    console.log(`Placeholder matches vs production gate: ${placeholderMatches.length}`)
  }

  if (missing.length > 0) {
    console.error('Missing:')
    for (const m of missing) console.error('  ' + m)
  }
  if (orphans.length > 0) {
    console.error('Orphans (on disk but not in manifest):')
    for (const o of orphans) console.error('  ' + path.relative(PROJECT_ROOT, o))
  }
  if (placeholderBlocked) {
    console.error(
      '\nAI placeholder portraits still present; swap for real photos before production launch. Files:',
    )
    for (const m of placeholderMatches) console.error('  ' + m)
  }

  if (missing.length > 0 || orphans.length > 0 || placeholderBlocked) {
    process.exit(2)
  }
  process.exit(0)
}

main()
