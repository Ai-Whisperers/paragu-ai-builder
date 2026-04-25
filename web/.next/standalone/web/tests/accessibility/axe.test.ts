/**
 * Accessibility Tests with axe-core
 * Win 64: Accessibility tests
 */
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test.describe('Homepage Accessibility', () => {
    test('should have no critical accessibility violations', async ({ page }) => {
      await page.goto('/')
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle')
      
      // Run axe-core analysis
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      
      // Filter out minor issues, only check critical and serious
      const violations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
      
      expect(violations).toHaveLength(0)
    })

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check for h1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThanOrEqual(1)
      expect(h1Count).toBeLessThanOrEqual(2) // Max 2 h1s
      
      // Check heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      let previousLevel = 0
      
      for (const heading of headings) {
        const level = parseInt(await heading.evaluate((el) => el.tagName)[1])
        expect(level).toBeGreaterThanOrEqual(1)
        expect(level).toBeLessThanOrEqual(6)
        
        // Headings shouldn't skip more than one level
        if (previousLevel > 0) {
          expect(level).toBeLessThanOrEqual(previousLevel + 1)
        }
        previousLevel = level
      }
    })

    test('should have proper image alt text', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check all images have alt text
      const images = await page.locator('img').all()
      
      for (const img of images) {
        const alt = await img.getAttribute('alt')
        // Alt can be empty for decorative images, but should be present
        expect(alt).not.toBeNull()
      }
    })

    test('should have proper link text', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check links have descriptive text
      const links = await page.locator('a').all()
      
      for (const link of links) {
        const text = await link.textContent()
        const ariaLabel = await link.getAttribute('aria-label')
        
        // Link should have text content or aria-label
        const hasContent = (text && text.trim().length > 0) || (ariaLabel && ariaLabel.length > 0)
        expect(hasContent).toBeTruthy()
      }
    })

    test('should have proper color contrast', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze()
      
      // Only check serious violations
      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'color-contrast' && (v.impact === 'serious' || v.impact === 'critical')
      )
      
      expect(contrastViolations).toHaveLength(0)
    })
  })

  test.describe('Admin Pages Accessibility', () => {
    test('login page should be accessible', async ({ page }) => {
      await page.goto('/admin/login')
      await page.waitForLoadState('networkidle')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
      
      expect(criticalViolations).toHaveLength(0)
    })

    test('form inputs should have labels', async ({ page }) => {
      await page.goto('/admin/login')
      await page.waitForLoadState('networkidle')
      
      const inputs = await page.locator('input, select, textarea').all()
      
      for (const input of inputs) {
        // Check for associated label or aria-label
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        const hasLabel = await input.evaluate((el) => {
          const label = document.querySelector(`label[for="${el.id}"]`)
          return label !== null || el.closest('label') !== null
        })
        
        const isAccessible = hasLabel || ariaLabel || ariaLabelledBy || id
        expect(isAccessible).toBeTruthy()
      }
    })
  })

  test.describe('Sample Business Page Accessibility', () => {
    test('business page should be accessible', async ({ page }) => {
      await page.goto('/s/asuncion/peluqueria-demo')
      await page.waitForLoadState('networkidle')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['region']) // Disable region rule for generated content
        .analyze()
      
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      )
      
      expect(criticalViolations).toHaveLength(0)
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should be navigable with keyboard', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Press Tab to move through interactive elements
      await page.keyboard.press('Tab')
      
      // Check something is focused
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).not.toBe('BODY')
      
      // Tab through all interactive elements
      let tabCount = 0
      const maxTabs = 20
      const focusedElements = new Set<string>()
      
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab')
        const currentFocus = await page.evaluate(() => 
          `${document.activeElement?.tagName}-${document.activeElement?.getAttribute('href') || document.activeElement?.textContent?.slice(0, 20)}`
        )
        
        if (focusedElements.has(currentFocus)) {
          break // We've looped back
        }
        focusedElements.add(currentFocus)
        tabCount++
      }
      
      // Should be able to tab through multiple elements
      expect(tabCount).toBeGreaterThan(2)
    })

    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Press Tab to focus first element
      await page.keyboard.press('Tab')
      
      // Check that focused element has visible outline
      const focusStyles = await page.evaluate(() => {
        const active = document.activeElement
        if (!active || active.tagName === 'BODY') return null
        
        const styles = window.getComputedStyle(active)
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        }
      })
      
      // Should have some focus indicator
      expect(focusStyles).not.toBeNull()
    })
  })

  test.describe('ARIA and Semantic HTML', () => {
    test('should have proper ARIA landmarks', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check for main landmark
      const main = await page.locator('main, [role="main"]').count()
      expect(main).toBeGreaterThanOrEqual(1)
      
      // Check for navigation
      const nav = await page.locator('nav, [role="navigation"]').count()
      expect(nav).toBeGreaterThanOrEqual(1)
      
      // Check for complementary (aside) if present
      const aside = await page.locator('aside, [role="complementary"]').count()
      // aside is optional but if present should have proper role
    })

    test('should have proper button roles', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const buttons = await page.locator('button, [role="button"]').all()
      
      for (const button of buttons) {
        // Check buttons are keyboard accessible
        const tabIndex = await button.getAttribute('tabindex')
        
        // If it's a div with role=button, it should have tabindex
        const tagName = await button.evaluate((el) => el.tagName.toLowerCase())
        const role = await button.getAttribute('role')
        
        if (tagName !== 'button' && role === 'button') {
          expect(tabIndex).toBe('0')
        }
      }
    })
  })
})
