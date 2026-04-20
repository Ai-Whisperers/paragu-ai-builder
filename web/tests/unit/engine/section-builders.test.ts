import { describe, it, expect } from 'vitest'
import { SECTION_BUILDERS } from '@/lib/engine/section-builders'
import type {
  BusinessData,
  ContentTemplate,
  RegistryType,
  SectionType,
} from '@/lib/engine/compose'

const baseBusiness: BusinessData = {
  name: 'Test Business',
  slug: 'test-business',
  type: 'peluqueria',
  city: 'Asuncion',
  phone: '+595981234567',
  whatsapp: '+595981234567',
}

const baseContent: ContentTemplate = {
  hero: { headline: 'Welcome {{businessName}}', subheadline: 'Sub', ctaPrimary: 'Book', ctaSecondary: 'Browse' },
  servicesPage: { title: 'Services' },
  galleryPage: { title: 'Gallery' },
  teamPage: { title: 'Team' },
  contactPage: { title: 'Contact' },
  faq: [],
  footer: { columns: [], quickLinks: [], copyright: '' },
  whatsapp: { defaultMessage: 'Hi!' },
}

const baseRegistry: RegistryType = {
  id: 'peluqueria',
  nameEs: 'Peluqueria',
  tokens: 'peluqueria',
  pages: { homepage: { sections: [], requiredSections: [] } },
  features: { onlineBooking: { enabled: true } },
  nav: { items: ['Home'] },
} as unknown as RegistryType

const ctx = {
  business: baseBusiness,
  content: baseContent,
  templateData: { businessName: 'Test Business', city: 'Asuncion', neighborhood: '', year: 2026 },
  navItems: [{ label: 'Home', href: '/test-business/home' }],
  registry: baseRegistry,
  pageType: 'homepage',
}

describe('SECTION_BUILDERS registry', () => {
  it('covers every declared SectionType', () => {
    const declaredSectionTypes: SectionType[] = [
      'header',
      'hero',
      'services',
      'booking',
      'portfolio',
      'beforeAfter',
      'classSchedule',
      'membershipPlans',
      'roomBooking',
      'eventVenues',
      'quoteForm',
      'emergencyIndicator',
      'productCatalog',
      'gallery',
      'team',
      'testimonials',
      'contact',
      'faq',
      'ctaBanner',
      'footer',
      'whatsappFloat',
      'features',
      'pricing',
      'process',
      'savingsCalculator',
      'omakase',
      'sakeMenu',
      'conveyorBelt',
    ]
    for (const type of declaredSectionTypes) {
      expect(SECTION_BUILDERS[type], `missing builder for ${type}`).toBeTypeOf('function')
    }
  })

  it('header builder includes business name and CTA href', () => {
    const data = SECTION_BUILDERS.header(ctx)
    expect(data?.businessName).toBe('Test Business')
    expect(data?.ctaHref).toBe('#contacto')
  })

  it('hero builder fills template placeholders', () => {
    const data = SECTION_BUILDERS.hero(ctx)
    expect(data?.headline).toBe('Welcome Test Business')
    expect(data?.ctaPrimaryText).toBe('Book')
  })

  it('booking builder returns null when onlineBooking is disabled', () => {
    const data = SECTION_BUILDERS.booking({
      ...ctx,
      registry: { ...baseRegistry, features: { onlineBooking: { enabled: false } } } as RegistryType,
    })
    expect(data).toBeNull()
  })

  it('team builder returns null when team is empty', () => {
    expect(SECTION_BUILDERS.team(ctx)).toBeNull()
  })

  it('emergency builder requires a phone number', () => {
    expect(SECTION_BUILDERS.emergencyIndicator({ ...ctx, business: { ...baseBusiness, phone: undefined } })).toBeNull()
    const data = SECTION_BUILDERS.emergencyIndicator(ctx)
    expect(data?.phone).toBe('+595981234567')
  })

  it('gallery builder generates placeholders when no images exist', () => {
    const data = SECTION_BUILDERS.gallery(ctx)
    expect(Array.isArray(data?.images)).toBe(true)
    expect((data?.images as unknown[]).length).toBeGreaterThan(0)
  })

  it('whatsappFloat builder defers to compose (returns null from map)', () => {
    expect(SECTION_BUILDERS.whatsappFloat(ctx)).toBeNull()
  })
})
