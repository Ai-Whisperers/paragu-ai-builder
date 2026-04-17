import { describe, it, expect, beforeEach } from 'vitest'
import { buildSectionData, SECTION_MAP, type SectionType } from '../../lib/engine/compose'
import type { RegistryType } from '../../lib/engine/compose'
import type { BusinessData } from '../../lib/engine/compose'
import type { ContentTemplate } from '../../lib/engine/compose'

describe('compose.ts - SECTION_MAP', () => {
  const sectionTypes = [
    'header', 'hero', 'services', 'booking', 'portfolio', 'beforeAfter', 'classSchedule',
    'membershipPlans', 'roomBooking', 'eventVenues', 'quoteForm', 'emergencyIndicator',
    'productCatalog', 'gallery', 'team', 'testimonials', 'contact', 'faq', 'ctaBanner',
    'footer', 'whatsappFloat'
  ] as SectionType[]

  it('should map all known section names to section types', () => {
    expect(SECTION_MAP.header).toBe('header')
    expect(SECTION_MAP.hero).toBe('hero')
    expect(SECTION_MAP.services).toBe('services')
    expect(SECTION_MAP.booking).toBe('booking')
    expect(SECTION_MAP.onlineBooking).toBe('booking')
    expect(SECTION_MAP.portfolio).toBe('portfolio')
    expect(SECTION_MAP.portfolioGallery).toBe('portfolio')
    expect(SECTION_MAP.beforeAfter).toBe('beforeAfter')
    expect(SECTION_MAP.coverUps).toBe('beforeAfter')
    expect(SECTION_MAP.classSchedule).toBe('classSchedule')
    expect(SECTION_MAP.schedule).toBe('classSchedule')
    expect(SECTION_MAP.membershipPlans).toBe('membershipPlans')
    expect(SECTION_MAP.memberships).toBe('membershipPlans')
    expect(SECTION_MAP.plans).toBe('membershipPlans')
    expect(SECTION_MAP.roomBooking).toBe('roomBooking')
    expect(SECTION_MAP.rooms).toBe('roomBooking')
    expect(SECTION_MAP.eventVenues).toBe('eventVenues')
    expect(SECTION_MAP.venues).toBe('eventVenues')
    expect(SECTION_MAP.quoteForm).toBe('quoteForm')
    expect(SECTION_MAP.presupuesto).toBe('quoteForm')
    expect(SECTION_MAP.consultationForm).toBe('quoteForm')
    expect(SECTION_MAP.emergencyIndicator).toBe('emergencyIndicator')
    expect(SECTION_MAP.emergency).toBe('emergencyIndicator')
    expect(SECTION_MAP.gallery).toBe('gallery')
    expect(SECTION_MAP.galleryPreview).toBe('gallery')
    expect(SECTION_MAP.team).toBe('team')
    expect(SECTION_MAP.teamProfiles).toBe('team')
    expect(SECTION_MAP.testimonial).toBe('testimonials')
    expect(SECTION_MAP.testimonials).toBe('testimonials')
    expect(SECTION_MAP.productCatalog).toBe('productCatalog')
    expect(SECTION_MAP.contact).toBe('contact')
    expect(SECTION_MAP.contactSplit).toBe('contact')
    expect(SECTION_MAP.locationBlock).toBe('contact')
    expect(SECTION_MAP.faq).toBe('faq')
    expect(SECTION_MAP.ctaBanner).toBe('ctaBanner')
    expect(SECTION_MAP.footer).toBe('footer')
    expect(SECTION_MAP.whatsappFloat).toBe('whatsappFloat')
  })

  it('should have mappings for all 21 section types', () => {
    for (const sectionType of sectionTypes) {
      const mappedKeys = Object.entries(SECTION_MAP).filter(([, v]) => v === sectionType)
      expect(mappedKeys.length).toBeGreaterThan(0)
    }
  })
})

describe('compose.ts - buildSectionData', () => {
  const mockBusiness: BusinessData = {
    name: 'Test Salon',
    slug: 'test-salon',
    type: 'peluqueria',
    city: 'Asuncion',
    phone: '+595981234567',
    whatsapp: '+595981234567',
    hours: { 'Lunes - Viernes': '08:00 - 20:00' },
  }

  const mockRegistry: RegistryType = {
    id: 'peluqueria',
    nameEs: 'Peluqueria',
    nameEn: 'Hair Salon',
    tokens: 'peluqueria',
    pages: { homepage: { sections: ['header', 'hero'], requiredSections: ['header'] } },
    features: { onlineBooking: { enabled: true } },
  } as unknown as RegistryType

  const mockContent: ContentTemplate = {
    hero: { headline: 'Welcome', subheadline: 'Best salon', ctaPrimary: 'Book now' },
    servicesPage: { title: 'Services' },
    galleryPage: { title: 'Gallery' },
    teamPage: { title: 'Team' },
    contactPage: { title: 'Contact' },
    faq: [],
    footer: { columns: [], quickLinks: [], copyright: '' },
    whatsapp: { defaultMessage: 'Hi!' },
  }

  it('should build hero section data', () => {
    const result = buildSectionData('hero', mockBusiness, mockRegistry, mockContent)
    expect(result).not.toBeNull()
    expect(result?.headline).toBe('Welcome')
    expect(result?.ctaPrimaryText).toBe('Book now')
  })

  it('should build services section from business data', () => {
    const businessWithServices = {
      ...mockBusiness,
      services: [{ name: 'Corte', price: '50.000 Gs' }],
    }
    const result = buildSectionData('services', businessWithServices, mockRegistry, mockContent)
    expect(result).not.toBeNull()
    expect(result?.services).toHaveLength(1)
    expect(result?.services?.[0].name).toBe('Corte')
  })

  it('should build team section when team exists', () => {
    const businessWithTeam = {
      ...mockBusiness,
      team: [{ name: 'Maria', role: 'Stylist' }],
    }
    const result = buildSectionData('team', businessWithTeam, mockRegistry, mockContent)
    expect(result).not.toBeNull()
    expect(result?.members).toHaveLength(1)
    expect(result?.members?.[0].name).toBe('Maria')
  })

  it('should return null for team when no team members', () => {
    const result = buildSectionData('team', mockBusiness, mockRegistry, mockContent)
    expect(result).toBeNull()
  })

  it('should build testimonials section', () => {
    const businessWithTestimonials = {
      ...mockBusiness,
      testimonials: [
        { quote: 'Great service!', author: 'Juan', rating: 5 },
      ],
    }
    const result = buildSectionData('testimonials', businessWithTestimonials, mockRegistry, mockContent)
    expect(result).not.toBeNull()
    expect(result?.testimonials).toHaveLength(1)
  })

  it('should return null for testimonials when none exist', () => {
    const result = buildSectionData('testimonials', mockBusiness, mockRegistry, mockContent)
    expect(result).toBeNull()
  })

  it('should build contact section with all fields', () => {
    const result = buildSectionData('contact', mockBusiness, mockRegistry, mockContent)
    expect(result).not.toBeNull()
    expect(result?.phone).toBe('+595981234567')
    expect(result?.whatsapp).toBe('+595981234567')
    expect(result?.city).toBe('Asuncion')
  })

  it('should build gallery section with placeholder images when no gallery', () => {
    const result = buildSectionData('gallery', mockBusiness, mockRegistry, mockContent)
    expect(result).not.toBeNull()
    expect(result?.images).toBeDefined()
    expect(Array.isArray(result?.images)).toBe(true)
  })

  it('should return null for faq when no faq in content', () => {
    const result = buildSectionData('faq', mockBusiness, mockRegistry, mockContent)
    expect(result).toBeNull()
  })

  it('should return null for classSchedule when feature disabled', () => {
    const registryNoClassSchedule = {
      ...mockRegistry,
      features: { classSchedule: { enabled: false } },
    }
    const result = buildSectionData('classSchedule', mockBusiness, registryNoClassSchedule as unknown as RegistryType, mockContent)
    expect(result).toBeNull()
  })

  it('should return null for membershipPlans when packageBuilder disabled', () => {
    const registryNoPlans = {
      ...mockRegistry,
      features: { packageBuilder: { enabled: false } },
    }
    const result = buildSectionData('membershipPlans', mockBusiness, registryNoPlans as unknown as RegistryType, mockContent)
    expect(result).toBeNull()
  })

  it('should return null for portfolio when feature disabled', () => {
    const registryNoPortfolio = {
      ...mockRegistry,
      features: { portfolio: { enabled: false } },
    }
    const result = buildSectionData('portfolio', mockBusiness, registryNoPortfolio as unknown as RegistryType, mockContent)
    expect(result).toBeNull()
  })

  it('should return null for beforeAfter when feature disabled', () => {
    const registryNoBA = {
      ...mockRegistry,
      features: { beforeAfter: { enabled: false } },
    }
    const result = buildSectionData('beforeAfter', mockBusiness, registryNoBA as unknown as RegistryType, mockContent)
    expect(result).toBeNull()
  })

  it('should return null for booking when onlineBooking disabled', () => {
    const registryNoBooking = {
      ...mockRegistry,
      features: { onlineBooking: { enabled: false } },
    }
    const result = buildSectionData('booking', mockBusiness, registryNoBooking as unknown as RegistryType, mockContent)
    expect(result).toBeNull()
  })

  it('should build fallback services from content template', () => {
    const contentWithServices = {
      ...mockContent,
      servicesPage: {
        title: 'Our Services',
        categories: [
          {
            title: 'Cortes',
            defaultServices: [
              { name: 'Corte clasico', price: '50.000' },
              { name: 'Corte Fade', price: '60.000' },
            ],
          },
        ],
      },
    }
    const result = buildSectionData('services', mockBusiness, mockRegistry, contentWithServices)
    expect(result).not.toBeNull()
    expect(result?.services).toHaveLength(2)
    expect(result?.services?.[0].category).toBe('Cortes')
  })
})

describe('compose.ts - template data', () => {
  it('should replace {{businessName}} placeholder', () => {
    const mockBusiness: BusinessData = {
      name: 'Salon Maria',
      slug: 'salon-maria',
      type: 'peluqueria',
      city: 'Asuncion',
    }
    const mockRegistry: RegistryType = {
      id: 'peluqueria',
      nameEs: 'Peluqueria',
      tokens: 'peluqueria',
      pages: { homepage: { sections: [], requiredSections: [] } },
    } as unknown as RegistryType
    const mockContentWithPlaceholder = {
      hero: { headline: 'Welcome to {{businessName}}', subheadline: 'Best in city', ctaPrimary: 'Book' },
      servicesPage: { title: 'Services' },
      galleryPage: { title: 'Gallery' },
      teamPage: { title: 'Team' },
      contactPage: { title: 'Contact' },
      faq: [],
      footer: { columns: [], quickLinks: [], copyright: '' },
      whatsapp: { defaultMessage: 'Hi!' },
    }

    const result = buildSectionData('hero', mockBusiness, mockRegistry, mockContentWithPlaceholder)
    expect(result?.headline).toBe('Welcome to Salon Maria')
  })
})