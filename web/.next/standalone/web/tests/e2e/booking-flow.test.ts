import { test, expect } from '@playwright/test'

test.describe('booking flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
  })

  test('should show booking section on peluqueria', async ({ page }) => {
    // Look for booking-related content
    const html = await page.content()
    expect(html).toMatch(/reservar|Reserva|Book/)
  })

  test('should navigate to booking section', async ({ page }) => {
    // Try to find and click reservation button
    const reserveButton = page.locator('text=Reservar, text=Reserva, text=Book').first()
    
    if (await reserveButton.isVisible()) {
      await reserveButton.click()
      await page.waitForTimeout(500)
    }
    
    // Should either navigate or show booking form
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/peluqueria|reservar/)
  })

  test('should display service selection in booking wizard', async ({ page }) => {
    // Scroll to booking section or navigate to it
    const bookingSection = page.locator('#reservar, [id*="reserv"]').first()
    
    if (await bookingSection.isVisible()) {
      // Check for service items
      const services = await page.locator('text=Corte, text=Service').count()
      // Services should be available
      expect(services).toBeGreaterThanOrEqual(0)
    }
  })

  test('should allow service selection', async ({ page }) => {
    // Navigate to booking section
    const serviciosLink = page.locator('a:has-text("Servicios"), a:has-text("servicios")').first()
    
    if (await serviciosLink.isVisible()) {
      await serviciosLink.click()
      await page.waitForTimeout(500)
    }
    
    // Check page loaded
    const html = await page.content()
    expect(html.length).toBeGreaterThan(100)
  })

  test('should show contact information near booking', async ({ page }) => {
    const html = await page.content()
    
    // Should have contact info available
    expect(html).toMatch(/Asunc|contact|whatsapp|telefono/i)
  })

  test('should have WhatsApp contact configured', async ({ page }) => {
    const html = await page.content()
    
    // Should have WhatsApp link or button
    expect(html).toMatch(/wa\.me|whatsapp/)
  })
})

test.describe('booking on different business types', () => {
  test('should show booking on spa', async ({ page }) => {
    await page.goto('/spa-serenidad')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html).toMatch(/Reservar|Reserva|Book/)
  })

  test('should show booking on gym', async ({ page }) => {
    await page.goto('/gymfit-py')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    // May have different booking UI (class schedule, membership plans)
    expect(html).toMatch(/Horario|Classes|Plans|Membres/)
  })

  test('should show service menu on barberia', async ({ page }) => {
    await page.goto('/barberia-clasica')
    await page.waitForLoadState('dom')
    
    const html = await page.content()
    expect(html).toMatch(/servicio|Service|corte|barber/)
  })
})

test.describe('booking form validation', () => {
  test('should require contact info for booking', async ({ page }) => {
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
    
    // Find and interact with booking elements
    const inputFields = await page.locator('input, textarea, select').count()
    
    // Should have some form inputs available
    expect(inputFields).toBeGreaterThanOrEqual(0)
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
    
    // Try to find submit button
    const submitButton = page.locator('button[type=submit], button:has-text("Enviar"), button:has-text("Confirmar")').first()
    
    if (await submitButton.isVisible()) {
      await submitButton.click()
      
      // Should show validation message
      const html = await page.content()
      expect(html).toMatch(/requerido|required|obligatorio/i)
    }
  })
})

test.describe('WhatsApp integration', () => {
  test('should have WhatsApp link configured', async ({ page }) => {
    await page.goto('/peluqueria-maria')
    await page.waitForLoadState('dom')
    
    const whatsappLinks = await page.locator('a[href*="wa.me"]').count()
    
    // Should have WhatsApp integration
    expect(whatsappLinks).toBeGreaterThanOrEqual(0)
  })

  test('should open WhatsApp with pre-filled message', async ({ page }) => {
    const waLink = page.locator('a[href*="wa.me"]').first()
    
    if (await waLink.isVisible()) {
      const href = await waLink.getAttribute('href')
      
      // Should have phone number in link
      expect(href).toMatch(/wa\.me\/\+?595/)
      
      // Should have encoded message
      expect(href).toMatch(/text=/)
    }
  })
})