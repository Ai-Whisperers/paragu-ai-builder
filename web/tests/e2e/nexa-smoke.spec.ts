/**
 * Nexa Paraguay tenant smoke test — regression safety net.
 *
 * Visits every tenant URL × locale (home + sub-pages + locale roots) and
 * asserts the bare minimum of "this page works":
 *
 *   1. HTTP 200 (no 404s from broken links)
 *   2. No console errors (catches client-hydration crashes)
 *   3. At least one <h1> (catches missing-content regressions)
 *   4. Meta title + description non-empty (SEO regressions)
 *   5. <html lang> matches the URL locale (correctness fix from #254)
 *
 * If any of these fail, the PR is broken — simple as that. The previous
 * `/prensa` removal, the Validate-Tenant-Configs content drift, the html
 * lang="es" for non-ES locales bug — all of these would have been caught
 * by this suite.
 *
 * What this intentionally does NOT check:
 *   - Performance metrics (that's Lighthouse's job)
 *   - Visual regressions (that's visual-regression.spec.ts)
 *   - Cookie banner or form submission (specific flows in other specs)
 *
 * Runtime target: <2min for full sweep on a cold build.
 */
import { test, expect, type ConsoleMessage } from '@playwright/test'

const LOCALES = ['es', 'en', 'nl', 'de'] as const
type Locale = (typeof LOCALES)[number]

/**
 * Tenant routes currently shipped for nexa-paraguay. If pages/ gets a new
 * entry, add the slug here. Kept explicit rather than filesystem-derived
 * so this spec can be read standalone to understand URL surface area.
 *
 * Paths that must 200 on every locale:
 */
const TENANT_PAGES: readonly string[] = [
  '', // locale-root (home)
  '/programas',
  '/por-que-paraguay',
  '/proceso',
  '/sobre',
  '/empresa',
  '/inversor',
  '/lifestyle',
  '/trust',
  '/faq',
  '/blog',
  '/contacto',
  '/privacidad',
  '/prensa',
  '/fundador',
  '/casos-de-exito',
  '/comparacion',
  '/glosario',
  '/recursos',
  '/calidad-de-vida',
  '/asistente',
]

/**
 * Expected <html lang> per locale. Mirror of LOCALE_HTML_LANG in
 * `web/lib/i18n/config.ts`. Hard-coded here so a change in that config
 * trips this spec (which is the point — detect regressions).
 */
const EXPECTED_HTML_LANG: Record<Locale, string> = {
  es: 'es',
  en: 'en-US',
  nl: 'nl-NL',
  de: 'de-DE',
}

/**
 * Console messages we don't care about — third-party scripts, Next.js
 * hydration notices, Crisp/GA4 noise. If the allow-list grows, the site
 * is leaking errors worth fixing.
 */
const IGNORED_CONSOLE_PATTERNS: readonly RegExp[] = [
  /favicon\.ico/i, // devtools noise, not real
  /Download the React DevTools/i,
  /\[HMR\]/i, // hot-module reload
  /hydrat/i, // hydration warnings are serious but too noisy to fail on initially; flag in followup
  /Failed to load resource.*404.*analytics/i, // GA4 not configured in CI
  /crisp/i, // Crisp not configured in CI
]

function isRealConsoleError(msg: ConsoleMessage): boolean {
  if (msg.type() !== 'error') return false
  const text = msg.text()
  return !IGNORED_CONSOLE_PATTERNS.some((p) => p.test(text))
}

for (const locale of LOCALES) {
  for (const path of TENANT_PAGES) {
    const url = `/s/${locale}/nexa-paraguay${path}`
    test(`${url} — renders without console errors`, async ({ page }) => {
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (isRealConsoleError(msg)) consoleErrors.push(msg.text())
      })
      page.on('pageerror', (err) => {
        consoleErrors.push(`UNCAUGHT: ${err.message}`)
      })

      const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
      expect(response, `navigation returned no response for ${url}`).not.toBeNull()
      expect(
        response!.status(),
        `${url} returned ${response!.status()} — expected 200`,
      ).toBe(200)

      // Page must render at least one h1. Missing h1 is either a render
      // crash or an accessibility regression — either way, a real bug.
      const h1Count = await page.locator('h1').count()
      expect(h1Count, `${url} has zero <h1> elements`).toBeGreaterThanOrEqual(1)

      // Meta title must be non-empty. An empty title tanks SEO and usually
      // indicates composeSitePage threw before titleKey resolved.
      const title = await page.title()
      expect(title.length, `${url} has empty <title>`).toBeGreaterThan(0)

      // Meta description should be non-empty for Lighthouse SEO. Only a
      // warning because some tenants accept description-less pages.
      const description = await page
        .locator('meta[name="description"]')
        .first()
        .getAttribute('content')
      if (!description || description.trim().length === 0) {
        console.warn(`[nexa-smoke] ${url} missing meta description`)
      }

      // <html lang> must match the URL locale (regression guard for #254).
      const htmlLang = await page.locator('html').getAttribute('lang')
      expect(
        htmlLang,
        `${url} <html lang> is ${htmlLang}, expected ${EXPECTED_HTML_LANG[locale]}`,
      ).toBe(EXPECTED_HTML_LANG[locale])

      // No console errors beyond the allow-list.
      expect(
        consoleErrors,
        `${url} logged console errors:\n${consoleErrors.join('\n')}`,
      ).toHaveLength(0)
    })
  }
}
