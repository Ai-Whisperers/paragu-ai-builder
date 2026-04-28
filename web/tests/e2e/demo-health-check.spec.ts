import { test, expect } from '@playwright/test'

const DEMO_SLUGS = [
  'demo-peluqueria', 'demo-salon-belleza', 'demo-spa', 'demo-barberia',
  'demo-unas', 'demo-restaurant', 'demo-clinica-integral', 'demo-odontologia',
  'demo-psicologia', 'demo-panaderia', 'demo-taller-mecanico', 'demo-ferreteria',
  'demo-farmacia', 'demo-electricista', 'demo-plomero', 'demo-inmobiliaria',
  'demo-contador', 'demo-carniceria', 'demo-gomeria', 'demo-lavadero',
  'demo-parrilla', 'demo-cafeteria', 'demo-bodega', 'demo-cerrajero',
  'demo-veterinaria', 'demo-herreria', 'demo-depilacion', 'demo-maquillaje',
]

const REAL_TENANTS = [
  { slug: 'nexa-paraguay', locale: 'es' },
  { slug: 'nexa-propiedades', locale: 'es' },
  { slug: 'dayah-litworks', locale: 'es' },
  { slug: 'de-abasto-a-casa', locale: 'es' },
]

test.describe('Demo site health check', () => {
  for (const slug of DEMO_SLUGS) {
    test(`${slug} — loads without 404`, async ({ page }) => {
      const response = await page.goto(`/s/es/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })
      expect(response?.status()).not.toBe(404)
      expect(response?.status()).not.toBe(500)

      const h1 = page.locator('h1')
      const h1Count = await h1.count()
      expect(h1Count).toBeGreaterThanOrEqual(1)

      const bodyText = await page.locator('body').innerText()
      expect(bodyText.length).toBeGreaterThan(50)
    })

    test(`${slug} — has visible hero section`, async ({ page }) => {
      await page.goto(`/s/es/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })

      const heroSection = page.locator('section').first()
      await expect(heroSection).toBeVisible()

      const heroText = await heroSection.innerText()
      expect(heroText.length).toBeGreaterThan(20)
    })
  }
})

test.describe('Real tenant health check', () => {
  for (const { slug, locale } of REAL_TENANTS) {
    test(`${slug} — loads successfully`, async ({ page }) => {
      const response = await page.goto(`/s/${locale}/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })
      expect(response?.status()).not.toBe(404)
      expect(response?.status()).not.toBe(500)
    })

    test(`${slug} — has no console errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(`/s/${locale}/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })

      expect(errors.filter((e) => !e.includes('favicon') && !e.includes('analytics'))).toEqual([])
    })

    test(`${slug} — header nav links are visible and clickable`, async ({ page }) => {
      await page.goto(`/s/${locale}/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })

      const navLinks = page.locator('header a, header nav a')
      const count = await navLinks.count()
      expect(count).toBeGreaterThanOrEqual(2)

      const firstLink = navLinks.first()
      await expect(firstLink).toBeVisible()
    })
  }
})

test.describe('Cross-demo analysis', () => {
  test('all demo pages return 200, not 404', async ({ page }) => {
    const results: Array<{ slug: string; status: number }> = []
    for (const slug of DEMO_SLUGS) {
      const response = await page.goto(`/s/es/${slug}`, { waitUntil: 'domcontentloaded', timeout: 10000 })
      results.push({ slug, status: response?.status() ?? 0 })
    }
    const notFound = results.filter((r) => r.status === 404 || r.status === 500)
    expect(notFound).toEqual([])
  })

  test('all real tenants have working page navigation', async ({ page }) => {
    for (const { slug, locale } of REAL_TENANTS) {
      await page.goto(`/s/${locale}/${slug}`, { waitUntil: 'networkidle', timeout: 15000 })
      const navItems = page.locator('header nav a, header a[href^="/s/"]')
      const count = await navItems.count()
      if (count > 0) {
        const href = await navItems.first().getAttribute('href')
        if (href && href !== '#') {
          await page.goto(href.startsWith('/') ? href : `/${href}`, { waitUntil: 'domcontentloaded', timeout: 10000 })
          expect(page.url()).toContain(href.replace(/^https?:\/\/[^/]+/, ''))
        }
      }
    }
  })
})
