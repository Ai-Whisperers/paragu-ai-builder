import { test, expect } from '@playwright/test'

const locales = ['nl', 'en', 'de', 'es'] as const

test('every tenant page emits hreflang for every declared locale', async ({ page }) => {
  for (const locale of locales) {
    await page.goto(`/s/${locale}/nexa-paraguay`)
    for (const other of locales) {
      const link = page.locator(`link[hreflang="${other}"]`)
      await expect(link, `locale=${locale} missing hreflang=${other}`).toHaveCount(1)
    }
    const xDefault = page.locator('link[hreflang="x-default"]')
    await expect(xDefault).toHaveCount(1)
  }
})

test('sitemap.xml returns valid XML with hreflang alternates', async ({ request }) => {
  const res = await request.get('/s/nl/nexa-paraguay/sitemap.xml')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toContain('<urlset')
  expect(body).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
  expect(body).toContain('hreflang="nl"')
  expect(body).toContain('hreflang="en"')
  expect(body).toContain('hreflang="de"')
  expect(body).toContain('hreflang="es"')
})

test('robots.txt references the sitemap', async ({ request }) => {
  const res = await request.get('/s/nl/nexa-paraguay/robots.txt')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toContain('Sitemap:')
  expect(body).toContain('/sitemap.xml')
})
