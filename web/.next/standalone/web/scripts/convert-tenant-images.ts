#!/usr/bin/env node
/**
 * PNG → WebP conversion pipeline for a tenant's image assets.
 *
 * - Walks `sites/<slug>/images/**\/*.png` and writes a `.webp` sibling.
 * - For `hero/` and `blog/` buckets, also emits responsive width
 *   variants at 480, 960, 1920 (suffixed `-w480.webp` etc.).
 * - Rewrites `sites/<slug>/images.json` so every `src` points at the
 *   `.webp` version, keeping the original PNG as `fallbackSrc`.
 *
 * Idempotent — re-running on an already-converted tenant is a no-op.
 *
 * Usage:
 *   tsx scripts/convert-tenant-images.ts <slug>
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '../..')

// Sharp is transitively installed via Next.js — if it's absent we bail.
// Dynamic import rather than top-level so a missing `sharp` exits with a
// clear error instead of an unhandled module-resolution crash.
let sharp: typeof import('sharp').default
try {
  sharp = (await import('sharp')).default
} catch (err) {
  console.error(
    '[convert-tenant-images] `sharp` is not available. Install it as a dev dep or run with Next.js present.',
    err instanceof Error ? err.message : err,
  )
  process.exit(2)
}

interface Asset {
  src: string
  alt: string
  width?: number
  height?: number
  fallbackSrc?: string
  [k: string]: unknown
}

interface Manifest {
  tenant?: string
  basePath?: string
  fallback?: string
  totalImages?: number
  images: Record<string, Record<string, Asset>>
  [k: string]: unknown
}

const RESPONSIVE_BUCKETS = new Set(['hero', 'blog', 'brand'])
const RESPONSIVE_WIDTHS = [480, 960, 1920]

async function convertOne(absolutePngPath: string): Promise<boolean> {
  const webpPath = absolutePngPath.replace(/\.png$/i, '.webp')
  if (fs.existsSync(webpPath)) return false
  await sharp(absolutePngPath).webp({ quality: 82 }).toFile(webpPath)
  return true
}

async function convertResponsive(absolutePngPath: string): Promise<void> {
  for (const w of RESPONSIVE_WIDTHS) {
    const outPath = absolutePngPath.replace(/\.png$/i, `-w${w}.webp`)
    if (fs.existsSync(outPath)) continue
    await sharp(absolutePngPath).resize({ width: w }).webp({ quality: 82 }).toFile(outPath)
  }
}

function toWebpUrl(src: string): string {
  return src.replace(/\.png$/i, '.webp')
}

async function main() {
  const slug = process.argv[2]
  if (!slug) {
    console.error('Usage: tsx scripts/convert-tenant-images.ts <slug>')
    process.exit(2)
  }

  const siteDir = path.join(PROJECT_ROOT, 'sites', slug)
  const imagesRoot = path.join(siteDir, 'images')
  const manifestPath = path.join(siteDir, 'images.json')
  if (!fs.existsSync(manifestPath)) {
    console.error(`[convert-tenant-images] no images.json for ${slug}`)
    process.exit(2)
  }
  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  let convertedCount = 0
  let responsiveCount = 0

  for (const [bucket, group] of Object.entries(manifest.images)) {
    const isResponsive = RESPONSIVE_BUCKETS.has(bucket)
    for (const [name, asset] of Object.entries(group)) {
      const publicSrc = asset.src
      if (!publicSrc || !publicSrc.toLowerCase().endsWith('.png')) continue
      // Translate `/sites/<slug>/images/foo/bar.png` → absolute FS path.
      const rel = publicSrc.replace(new RegExp(`^/?sites/${slug}/images/`), '')
      const absPath = path.join(imagesRoot, rel)
      if (!fs.existsSync(absPath)) {
        console.warn(`[convert-tenant-images] missing on disk: ${absPath}`)
        continue
      }
      const didConvert = await convertOne(absPath)
      if (didConvert) convertedCount++
      if (isResponsive) {
        await convertResponsive(absPath)
        responsiveCount += RESPONSIVE_WIDTHS.length
      }
      // Mutate manifest: point `src` at `.webp`, keep PNG as fallback.
      group[name] = {
        ...asset,
        src: toWebpUrl(publicSrc),
        fallbackSrc: publicSrc,
      }
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8')
  console.log(
    `[convert-tenant-images] ${slug}: converted ${convertedCount} PNG → WebP, generated ${responsiveCount} responsive variants, manifest rewritten.`,
  )
  console.log(
    '[convert-tenant-images] Remember: `cd web && npm run generate:tenant-data` to re-bundle.',
  )
}

main().catch((err) => {
  console.error('[convert-tenant-images] failed:', err instanceof Error ? err.stack : err)
  process.exit(1)
})
