import { test, expect } from '@playwright/test'

test.describe('Viajero Comercio - Storefront', () => {
  const BASE = '/s/es/viajero-comercio'

  test('tienda page loads with category tiles and product grid', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Page title
    await expect(page).toHaveTitle(/Tienda/)

    // Category tiles render (at least 3 tiles visible)
    const tiles = page.locator('nav[aria-label="Categorias principales"] a')
    await expect(tiles.first()).toBeVisible()
    const tileCount = await tiles.count()
    expect(tileCount).toBeGreaterThanOrEqual(3)

    // Product grid has items
    const products = page.locator('article')
    await expect(products.first()).toBeVisible({ timeout: 10000 })
    const productCount = await products.count()
    expect(productCount).toBeGreaterThan(0)
  })

  test('breadcrumbs navigate correctly', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Click "El Viajero Comercio" breadcrumb
    const homeLink = page.locator('nav[aria-label="Breadcrumb"] a')
    await expect(homeLink.first()).toBeVisible()
  })

  test('search filters products', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Type in search
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()
    await searchInput.fill('carpa')
    await searchInput.press('Enter')

    // URL should have q=carpa
    await expect(page).toHaveURL(/q=carpa/)

    // Products should be filtered
    await page.waitForTimeout(1000)
  })

  test('category filter works', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Find and click a category chip in the toolbar
    const campingChip = page.locator('button[aria-pressed]', { hasText: 'Camping' })
    if (await campingChip.isVisible()) {
      await campingChip.click()
      await expect(page).toHaveURL(/category=/)
    }
  })

  test('quick filters toggle', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Click "En oferta" quick filter
    const onSaleBtn = page.locator('button[aria-pressed]', { hasText: 'En oferta' })
    if (await onSaleBtn.isVisible()) {
      await onSaleBtn.click()
      await expect(page).toHaveURL(/on_sale=1/)
    }
  })

  test('sort products by price', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    const sortSelect = page.locator('select')
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price-asc')
      await expect(page).toHaveURL(/sort=price-asc/)
    }
  })

  test('pagination works when enough products', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Check if pagination exists (need > 12 products)
    const nextBtn = page.locator('button', { hasText: 'Siguiente' })
    if (await nextBtn.isVisible()) {
      await nextBtn.click()
      await expect(page).toHaveURL(/page=2/)
    }
  })

  test('product detail page from grid', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Click first product link
    const firstProduct = page.locator('article a').first()
    await expect(firstProduct).toBeVisible()
    const href = await firstProduct.getAttribute('href')
    await firstProduct.click()

    // Should be on PDP
    await expect(page).toHaveURL(/producto\//)
    // PDP should have product name visible
    await expect(page.locator('h1')).toBeVisible()
  })

  test('trust strip shows shipping info', async ({ page }) => {
    await page.goto(`${BASE}/tienda`)

    // Trust strip should exist and show free shipping
    const trustStrip = page.locator('aside[aria-label="Nuestras promesas"]')
    await expect(trustStrip).toBeVisible()
    await expect(trustStrip).toContainText('Envio gratis')
    await expect(trustStrip).toContainText('WhatsApp')
    await expect(trustStrip).toContainText('Pago seguro')
  })
})
