/**
 * One-off: take full-page screenshots of every Nexa Paraguay page
 * across every locale against the local dev server.
 *
 *   npx tsx scripts/screenshot-nexa.ts
 *
 * Output: /tmp/nexa-screenshots/<timestamp>/<locale>-<page>.png
 */
import { chromium, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const SITE = 'nexa-paraguay'
const LOCALES = ['es', 'en', 'nl', 'de'] as const
const PAGES: Array<{ slug: string; label: string }> = [
  { slug: '', label: 'home' },
  { slug: 'programas', label: 'programas' },
  { slug: 'por-que-paraguay', label: 'por-que-paraguay' },
  { slug: 'proceso', label: 'proceso' },
  { slug: 'sobre', label: 'sobre' },
  { slug: 'faq', label: 'faq' },
  { slug: 'blog', label: 'blog' },
  { slug: 'contacto', label: 'contacto' },
  { slug: 'privacidad', label: 'privacidad' },
]

async function freezeAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0.001ms !important;
        transition-delay: 0ms !important;
      }
    `,
  })
  // Nudge every IntersectionObserver-based reveal into its final state
  await page.evaluate(() => {
    document
      .querySelectorAll('.animate-on-scroll')
      .forEach((el) => el.classList.add('is-visible'))
  })
}

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const outDir = resolve('/tmp/nexa-screenshots', stamp)
  await mkdir(outDir, { recursive: true })
  console.log(`[screenshots] output → ${outDir}`)

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })

  const results: Array<{ file: string; bytes: number; locale: string; page: string }> = []
  const failed: Array<{ locale: string; page: string; error: string }> = []

  for (const locale of LOCALES) {
    for (const p of PAGES) {
      const url = p.slug
        ? `${BASE}/s/${locale}/${SITE}/${p.slug}`
        : `${BASE}/s/${locale}/${SITE}`
      const fileName = `${locale}-${p.label}.png`
      const filePath = resolve(outDir, fileName)
      const page = await context.newPage()
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
        if (!resp || !resp.ok()) {
          throw new Error(`HTTP ${resp?.status()}`)
        }
        await freezeAnimations(page)
        // Give images / lazy content one more tick
        await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
        await page.screenshot({ path: filePath, fullPage: true })
        const stats = await (await import('node:fs/promises')).stat(filePath)
        results.push({ file: fileName, bytes: stats.size, locale, page: p.label })
        console.log(`  ✓ ${locale}/${p.label} → ${fileName} (${Math.round(stats.size / 1024)} KB)`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        failed.push({ locale, page: p.label, error: msg })
        console.error(`  ✗ ${locale}/${p.label} → ${msg}`)
      } finally {
        await page.close()
      }
    }
  }

  await browser.close()

  console.log('')
  console.log(`[screenshots] ${results.length} OK, ${failed.length} failed`)
  console.log(`[screenshots] output dir: ${outDir}`)
  if (failed.length > 0) {
    console.log('[screenshots] failures:')
    for (const f of failed) {
      console.log(`  - ${f.locale}/${f.page}: ${f.error}`)
    }
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error('[screenshots] fatal:', err)
  process.exit(1)
})
