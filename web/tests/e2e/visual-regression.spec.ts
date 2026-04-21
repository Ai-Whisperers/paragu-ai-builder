/**
 * Visual regression baselines for the 6 real tenants.
 *
 * Run with:
 *   npx playwright test tests/e2e/visual-regression.spec.ts              # compare
 *   npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots
 *
 * Baselines live in tests/e2e/__screenshots__/. Regenerate them whenever
 * intentional design changes ship.
 */

import { test, expect } from '@playwright/test'

const TENANTS = [
  { slug: 'nexa-paraguay', path: '/s/es/nexa-paraguay', label: 'nexa-paraguay-es' },
  { slug: 'nexa-paraguay', path: '/s/en/nexa-paraguay', label: 'nexa-paraguay-en' },
  { slug: 'nexa-propiedades', path: '/s/es/nexa-propiedades', label: 'nexa-propiedades' },
  { slug: 'dayah-litworks', path: '/dayah-litworks', label: 'dayah-litworks' },
  { slug: 'de-abasto-a-casa', path: '/de-abasto-a-casa', label: 'de-abasto-a-casa' },
] as const

for (const t of TENANTS) {
  test(`${t.label} — homepage visual baseline`, async ({ page }) => {
    await page.goto(t.path, { waitUntil: 'networkidle' })

    // Wait for hero + fonts.
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)

    // Hide any runtime-variable UI (analytics scripts, cookie banners that
    // haven't dismissed, relative dates).
    await page.addStyleTag({
      content: `
        [data-testid="cookie-banner"], .cookie-banner { display: none !important; }
        [data-testid="timestamp"], time { visibility: hidden !important; }
      `,
    })

    await expect(page).toHaveScreenshot(`${t.label}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    })
  })
}
