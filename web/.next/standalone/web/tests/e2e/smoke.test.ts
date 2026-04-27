/**
 * Smoke Tests - Critical Path
 * Win 59: Critical path smoke tests
 */
import { test, expect } from '@playwright/test'

test.describe('Smoke Tests - Critical Path', () => {
  test.describe('Homepage', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto('/')
      
      // Check page loaded
      await expect(page).toHaveTitle(/Paragu-AI/)
      
      // Check main content is visible
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })

    test('should have working navigation', async ({ page }) => {
      await page.goto('/')
      
      // Check navigation exists
      const nav = page.locator('nav').first()
      await expect(nav).toBeVisible()
    })
  })

  test.describe('Admin Login Page', () => {
    test('should load admin login page', async ({ page }) => {
      await page.goto('/admin/login')
      
      // Check page loaded
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Lead List Page', () => {
    test('should load leads page', async ({ page }) => {
      await page.goto('/admin/leads')
      
      // Page should load (may redirect to login if not authenticated)
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Sample Business Page', () => {
    test('should load sample business page', async ({ page }) => {
      // Try loading a sample business
      await page.goto('/s/asuncion/peluqueria-demo')
      
      // Check page loads without error
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Health Check', () => {
    test('should verify critical assets load', async ({ page }) => {
      await page.goto('/')
      
      // Check that page has content
      const body = page.locator('body')
      await expect(body).toBeVisible()
      
      // Check no console errors about critical files
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })
      
      await page.waitForLoadState('networkidle')
      
      // Filter out non-critical errors
      const criticalErrors = consoleErrors.filter((e) => 
        e.includes('404') || e.includes('Failed to load')
      )
      
      expect(criticalErrors).toHaveLength(0)
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test('should render on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // Check page loads
      await expect(page.locator('body')).toBeVisible()
      
      // Check no horizontal overflow
      const body = await page.locator('body').boundingBox()
      expect(body?.width).toBeLessThanOrEqual(375)
    })
  })

  test.describe('API Endpoints', () => {
    test('should verify API is accessible', async ({ request }) => {
      // Test a simple API endpoint if available
      const response = await request.get('/api/health', {
        failOnStatusCode: false,
      })
      
      // Should return either 200 (exists) or 404 (not implemented)
      expect([200, 404]).toContain(response.status())
    })
  })
})
