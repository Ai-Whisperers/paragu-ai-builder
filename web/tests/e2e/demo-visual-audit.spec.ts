import { test, expect } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const ALL_PAGES = [
  { slug: 'demo-peluqueria', label: 'Peluquería', type: 'demo' },
  { slug: 'demo-salon-belleza', label: 'Salón de Belleza', type: 'demo' },
  { slug: 'demo-spa', label: 'Spa', type: 'demo' },
  { slug: 'demo-barberia', label: 'Barbería', type: 'demo' },
  { slug: 'demo-restaurant', label: 'Restaurante', type: 'demo' },
  { slug: 'demo-clinica-integral', label: 'Clínica Integral', type: 'demo' },
  { slug: 'demo-taller-mecanico', label: 'Taller Mecánico', type: 'demo' },
  { slug: 'demo-ferreteria', label: 'Ferretería', type: 'demo' },
  { slug: 'demo-farmacia', label: 'Farmacia', type: 'demo' },
  { slug: 'demo-electricista', label: 'Electricista', type: 'demo' },
  { slug: 'demo-plomero', label: 'Plomero', type: 'demo' },
  { slug: 'demo-inmobiliaria', label: 'Inmobiliaria', type: 'demo' },
  { slug: 'demo-veterinaria', label: 'Veterinaria', type: 'demo' },
  { slug: 'nexa-paraguay', label: 'Nexa Paraguay', type: 'real' },
  { slug: 'nexa-propiedades', label: 'Nexa Propiedades', type: 'real' },
  { slug: 'dayah-litworks', label: 'Dayah Litworks', type: 'real' },
  { slug: 'de-abasto-a-casa', label: 'De Abasto a Casa', type: 'real' },
]

interface AuditResult {
  slug: string
  status: number | null
  h1Count: number
  sectionCount: number
  hasWhatsappFloat: boolean
  hasFooter: boolean
  bodyLength: number
  imagesLoaded: number
  imagesBroken: number
  issues: string[]
}

const results: AuditResult[] = []

test.describe('Full visual audit', () => {
  for (const { slug, label } of ALL_PAGES) {
    test(`[${label}] full page audit`, async ({ page }) => {
      const result: AuditResult = {
        slug, status: null, h1Count: 0, sectionCount: 0,
        hasWhatsappFloat: false, hasFooter: false, bodyLength: 0,
        imagesLoaded: 0, imagesBroken: 0, issues: [],
      }

      const errors: string[] = []
      page.on('pageerror', (err) => errors.push(err.message))

      const response = await page.goto(`/s/es/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })
      result.status = response?.status() ?? null

      if (result.status === 404) result.issues.push('PAGE_404')
      if (result.status === 500) result.issues.push('PAGE_500')

      result.h1Count = await page.locator('h1').count()
      if (result.h1Count === 0) result.issues.push('NO_H1')

      result.sectionCount = await page.locator('section').count()
      if (result.sectionCount === 0) result.issues.push('NO_SECTIONS')

      result.hasWhatsappFloat = await page.locator('[class*="whatsapp-float"], a[href*="wa.me"], [aria-label*="WhatsApp"]').count() > 0
      result.hasFooter = await page.locator('footer, section:last-of-type').count() > 0

      result.bodyLength = (await page.locator('body').innerText()).length
      if (result.bodyLength < 100) result.issues.push('BODY_TOO_SHORT')

      const images = page.locator('img')
      const imgCount = await images.count()
      for (let i = 0; i < imgCount; i++) {
        const img = images.nth(i)
        const src = await img.getAttribute('src')
        if (src && !src.startsWith('data:')) {
          const isBroken = await img.evaluate((el) => {
            const imgEl = el as HTMLImageElement
            return !imgEl.complete || imgEl.naturalWidth === 0
          })
          if (isBroken) result.imagesBroken++
          else result.imagesLoaded++
        }
      }
      if (result.imagesBroken > 0) result.issues.push(`${result.imagesBroken}_BROKEN_IMAGES`)

      if (errors.length > 0) {
        const relevant = errors.filter((e) => !e.includes('favicon') && !e.includes('ResizeObserver'))
        if (relevant.length > 0) result.issues.push(`JS_ERRORS: ${relevant.slice(0, 3).join('; ')}`)
      }

      results.push(result)

      // Screenshot at desktop
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.screenshot({ path: `tests/e2e/__screenshots__/${slug}-desktop.png`, fullPage: true })

      // Screenshot at mobile
      await page.setViewportSize({ width: 375, height: 812 })
      await page.screenshot({ path: `tests/e2e/__screenshots__/${slug}-mobile.png`, fullPage: true })

      // Assert basics
      expect(result.status).not.toBe(404)
      expect(result.h1Count).toBeGreaterThanOrEqual(1)
    })
  }
})

test.afterAll(() => {
  const outDir = resolve('tests/e2e/__audit__')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'audit-results.json'), JSON.stringify(results, null, 2))

  const demos = results.filter((r) => !r.slug.startsWith('nexa-') && r.slug !== 'dayah-litworks' && r.slug !== 'de-abasto-a-casa')
  const real = results.filter((r) => r.slug.startsWith('nexa-') || r.slug === 'dayah-litworks' || r.slug === 'de-abasto-a-casa')

  const summary = {
    total: results.length,
    passed: results.filter((r) => r.issues.length === 0).length,
    withIssues: results.filter((r) => r.issues.length > 0).length,
    demoCount: demos.length,
    demoIssues: demos.filter((r) => r.issues.length > 0).length,
    realCount: real.length,
    realIssues: real.filter((r) => r.issues.length > 0).length,
    avgDemoSections: Math.round(demos.reduce((s, r) => s + r.sectionCount, 0) / demos.length),
    avgRealSections: Math.round(real.reduce((s, r) => s + r.sectionCount, 0) / real.length),
    avgDemoH1: Math.round(demos.reduce((s, r) => s + r.h1Count, 0) / demos.length),
    avgRealH1: Math.round(real.reduce((s, r) => s + r.h1Count, 0) / real.length),
    commonIssues: groupBy(results.flatMap((r) => r.issues)),
  }
  writeFileSync(resolve(outDir, 'audit-summary.json'), JSON.stringify(summary, null, 2))
})

function groupBy(items: string[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {})
}
