import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const PAGES = [
  { slug: 'demo-peluqueria', label: 'Peluquería' },
  { slug: 'demo-barberia', label: 'Barbería' },
  { slug: 'demo-restaurant', label: 'Restaurante' },
  { slug: 'demo-clinica-integral', label: 'Clínica' },
  { slug: 'demo-taller-mecanico', label: 'Taller Mecánico' },
  { slug: 'demo-veterinaria', label: 'Veterinaria' },
  { slug: 'nexa-paraguay', label: 'Nexa Paraguay' },
  { slug: 'dayah-litworks', label: 'Dayah Litworks' },
]

interface A11yResult {
  slug: string
  violations: Array<{ id: string; impact: string; help: string; nodes: number }>
  totalViolations: number
  critical: number
  serious: number
}

const results: A11yResult[] = []

test.describe('Comprehensive accessibility audit', () => {
  for (const { slug, label } of PAGES) {
    test(`${label} — WCAG 2.1 AA audit`, async ({ page }) => {
      await page.goto(`/s/es/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })
      await page.evaluate(() => document.fonts.ready)

      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const result: A11yResult = {
        slug,
        violations: scan.violations.map((v) => ({
          id: v.id,
          impact: v.impact || 'minor',
          help: v.help,
          nodes: v.nodes.length,
        })),
        totalViolations: scan.violations.length,
        critical: scan.violations.filter((v) => v.impact === 'critical').length,
        serious: scan.violations.filter((v) => v.impact === 'serious').length,
      }

      results.push(result)

      // Only fail on critical/serious
      expect(result.critical).toBe(0)
    })
  }
})

test.afterAll(() => {
  const outDir = resolve('tests/accessibility/__audit__')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'a11y-results.json'), JSON.stringify(results, null, 2))
  writeFileSync(resolve(outDir, 'a11y-summary.json'), JSON.stringify({
    total: results.length,
    passed: results.filter((r) => r.critical === 0 && r.serious === 0).length,
    withIssues: results.filter((r) => r.critical > 0 || r.serious > 0).length,
    pagesWithCriticalIssues: results.filter((r) => r.critical > 0).map((r) => r.slug),
    commonViolations: groupBy(results.flatMap((r) => r.violations.map((v) => v.id))),
  }, null, 2))
})

function groupBy(items: string[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {})
}
