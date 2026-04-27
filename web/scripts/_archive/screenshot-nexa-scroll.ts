/**
 * Capture nav-bar behavior at several scroll positions + viewport-only
 * snapshots to spot issues the full-page screenshots gloss over.
 *
 *   npx tsx scripts/screenshot-nexa-scroll.ts
 *
 * Output: /tmp/nexa-screenshots/<stamp>/
 */
import { chromium, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const SITE = 'nexa-paraguay'

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
  await page.evaluate(() => {
    document
      .querySelectorAll('.animate-on-scroll')
      .forEach((el) => el.classList.add('is-visible'))
  })
}

async function shot(page: Page, file: string) {
  await page.screenshot({ path: file, fullPage: false })
  console.log(`  ✓ ${file}`)
}

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const outDir = resolve('/tmp/nexa-screenshots', `scroll-${stamp}`)
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })

  // Nav-bar behavior on ES home at different scroll positions
  const scenarios: Array<{ path: string; locale: string; label: string; scrolls: number[] }> = [
    { path: '', locale: 'es', label: 'home', scrolls: [0, 250, 800, 2000] },
    { path: 'programas', locale: 'es', label: 'programas', scrolls: [0, 500, 1500] },
    { path: 'sobre', locale: 'es', label: 'sobre', scrolls: [0, 600, 1400] },
    { path: 'proceso', locale: 'es', label: 'proceso', scrolls: [0, 500] },
  ]

  for (const sc of scenarios) {
    const url = sc.path
      ? `${BASE}/s/${sc.locale}/${SITE}/${sc.path}`
      : `${BASE}/s/${sc.locale}/${SITE}`
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    await freezeAnimations(page)
    for (const y of sc.scrolls) {
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
      await page.waitForTimeout(150)
      await shot(page, resolve(outDir, `${sc.locale}-${sc.label}-scroll${y}.png`))
    }
    await page.close()
  }

  // Mobile viewport check on home (Pixel 7-ish 412×915)
  const mobile = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
  })
  const mpage = await mobile.newPage()
  await mpage.goto(`${BASE}/s/es/${SITE}`, { waitUntil: 'networkidle', timeout: 60_000 })
  await freezeAnimations(mpage)
  await mpage.screenshot({ path: resolve(outDir, 'mobile-es-home-top.png'), fullPage: false })
  await mpage.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }))
  await mpage.waitForTimeout(150)
  await mpage.screenshot({ path: resolve(outDir, 'mobile-es-home-scrolled.png'), fullPage: false })
  // Open mobile menu
  await mpage.evaluate(() => {
    const btn = document.querySelector('button[aria-label*="menu" i]') as HTMLButtonElement | null
    btn?.click()
  })
  await mpage.waitForTimeout(200)
  await mpage.screenshot({ path: resolve(outDir, 'mobile-es-home-menu.png'), fullPage: false })
  await mpage.close()
  await mobile.close()

  // Team section hover-reveal verification
  const page = await context.newPage()
  await page.goto(`${BASE}/s/es/${SITE}/sobre`, { waitUntil: 'networkidle', timeout: 60_000 })
  await freezeAnimations(page)
  // Scroll the team section into view
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find((h) =>
      h.textContent?.toLowerCase().includes('equipo')
    )
    el?.scrollIntoView({ block: 'center' })
  })
  await page.waitForTimeout(200)
  await shot(page, resolve(outDir, 'team-default.png'))
  // Hover first team card
  await page.evaluate(() => {
    const firstCard = document.querySelector('section#equipo .group') as HTMLElement | null
    if (firstCard) {
      // Trigger hover state
      const event = new MouseEvent('mouseenter', { bubbles: true })
      firstCard.dispatchEvent(event)
    }
  })
  // Force :hover-equivalent via focus-within — the card uses focus-within too
  await page.evaluate(() => {
    const firstCard = document.querySelector('section#equipo .group') as HTMLElement | null
    // Add a helper class that mirrors the hover styles, since headless can't do :hover
    firstCard?.classList.add('group-hover-force')
  })
  await shot(page, resolve(outDir, 'team-hover-first.png'))
  await page.close()

  await browser.close()
  console.log(`\nOutput: ${outDir}`)
}

main().catch((err) => {
  console.error('fatal:', err)
  process.exit(1)
})
