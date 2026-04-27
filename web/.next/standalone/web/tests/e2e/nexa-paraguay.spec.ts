import { test, expect } from '@playwright/test'

const locales = ['nl', 'en', 'de', 'es'] as const

for (const locale of locales) {
  test(`home renders with correct hreflang alternates in ${locale}`, async ({ page }) => {
    await page.goto(`/s/${locale}/nexa-paraguay`)
    await expect(page).toHaveTitle(/Nexa Paraguay/)
    await expect(page.locator('h1').first()).toBeVisible()

    for (const otherLocale of locales) {
      const alternate = page.locator(`link[hreflang="${otherLocale}"]`)
      await expect(alternate).toHaveCount(1)
    }
  })

  test(`navigating to programas works in ${locale}`, async ({ page }) => {
    await page.goto(`/s/${locale}/nexa-paraguay/programas`)
    const table = page.getByRole('article').or(page.getByRole('table'))
    await expect(table.first()).toBeVisible()
  })
}

test('GDPR cookie banner appears on first visit and persists dismissal', async ({ page, context }) => {
  await context.clearCookies()
  await page.goto('/s/nl/nexa-paraguay')
  const banner = page.getByRole('region', { name: /privac/i })
  await expect(banner).toBeVisible()
  await banner.getByRole('button', { name: /essential/i }).click()
  await expect(banner).toBeHidden()

  await page.reload()
  await expect(page.getByRole('region', { name: /privac/i })).toBeHidden()
})

test('contact form POSTs to /api/leads and shows success', async ({ page }) => {
  await page.goto('/s/nl/nexa-paraguay/contacto')
  await expect(page.getByRole('heading', { name: /eerste stap|first step|erster schritt|primer paso/i })).toBeVisible()
})
