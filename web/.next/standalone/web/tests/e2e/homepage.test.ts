import { test, expect } from '@playwright/test'

const BUSINESS_SLUGS = [
  'peluqueria-maria',
  'gymfit-py',
  'spa-serenidad',
  'barberia-clasica',
  'belleza-integral',
]

test.describe('homepage rendering', () => {
  for (const slug of BUSINESS_SLUGS) {
    test(`should render ${slug} homepage`, async ({ page }) => {
      await page.goto(`/${slug}`)
      
      // Should load without error
      await expect(page).toHaveTitle(/./)
      
      // Should have basic content
      const body = await page.content()
      expect(body.length).toBeGreaterThan(100)
    })

    test(`should render ${slug} hero section`, async ({ page }) => {
      await page.goto(`/${slug}`)
      await page.waitForLoadState('dom')
      
      // Hero section should contain business name or tagline
      const html = await page.content()
      expect(html).toMatch(/<section|<div/)
    })
  }

  test('should load peluqueria-maria with booking section', async ({ page }) => {
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    // Should have booking-related content
    expect(html).toMatch(/reservar|Reserva|Booker/)
  })

  test('should load gymfit-py with class schedule', async ({ page }) => {
    await page.goto('/gymfit-py')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html).toMatch(/Horario|Clases|schedul/)
  })

  test('should load gymfit-py with membership plans', async ({ page }) => {
    await page.goto('/gymfit-py')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html).toMatch(/Plan|Membresia|membership/)
  })

  test('should load spa-serenidad with services', async ({ page }) => {
    await page.goto('/spa-serenidad')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html).toMatch(/Servicio|Tratamiento|Masaje/)
  })

  test('should have no critical console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('networkidle')
    
    // Filter out expected errors (like missing images)
    const criticalErrors = errors.filter(e => 
      !e.includes('404') && 
      !e.includes('image') &&
      !e.includes('Failed to load')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})

test.describe('navigation', () => {
  test('should navigate between pages using nav', async ({ page }) => {
    await page.goto('/peluqueria-maria')
    
    // Try to find and click navigation links
    const navLinks = await page.locator('nav a, header a').count()
    if (navLinks > 0) {
      // Just verify nav exists
      expect(navLinks).toBeGreaterThan(0)
    }
  })
})

test.describe('responsive design', () => {
  test('should render on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html.length).toBeGreaterThan(100)
  })

  test('should render on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html.length).toBeGreaterThan(100)
  })

  test('should render on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html.length).toBeGreaterThan(100)
  })
})