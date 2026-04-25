import { describe, it, expect } from 'vitest'
import { composeSitePage } from '@/lib/engine/compose-site'

describe('compose-site integration', () => {
  const locales = ['es', 'nl', 'en', 'de'] as const

  for (const locale of locales) {
    it(`composes Nexa Paraguay home in ${locale}`, () => {
      const page = composeSitePage({ siteSlug: 'nexa-paraguay', locale, pageSlug: 'home' })
      expect(page.locale).toBe(locale)
      expect(page.sections.length).toBeGreaterThan(3)
      expect(page.meta.title).toBeTruthy()
      expect(page.meta.description).toBeTruthy()
      expect(page.theme.cssString).toContain('--primary')
      expect(page.theme.cssString).toContain('#1B2A4A')
    })
  }

  it('throws on unknown locale for the site', () => {
    expect(() =>
      // @ts-expect-error — intentional invalid
      composeSitePage({ siteSlug: 'nexa-paraguay', locale: 'fr', pageSlug: 'home' }),
    ).toThrow(/not enabled/i)
  })

  it('throws on unknown page', () => {
    expect(() =>
      composeSitePage({ siteSlug: 'nexa-paraguay', locale: 'es', pageSlug: 'no-such-page' }),
    ).toThrow(/not found/i)
  })

  it('resolves $ref across pages', () => {
    const contact = composeSitePage({ siteSlug: 'nexa-paraguay', locale: 'es', pageSlug: 'contacto' })
    expect(contact.sections.some((s) => s.id === 'contact')).toBe(true)
    expect(contact.sections.some((s) => s.id === 'booking-embed')).toBe(true)
  })

  it('programs-comparison tiers survive composition', () => {
    const home = composeSitePage({ siteSlug: 'nexa-paraguay', locale: 'en', pageSlug: 'home' })
    const programs = home.sections.find((s) => s.id === 'programs-comparison')
    expect(programs).toBeTruthy()
    const tiers = (programs!.props as { tiers: unknown[] }).tiers
    expect(Array.isArray(tiers)).toBe(true)
    expect(tiers.length).toBe(4)
  })
})
