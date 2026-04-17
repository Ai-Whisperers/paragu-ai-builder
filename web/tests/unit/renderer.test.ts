import { describe, it, expect, vi } from 'vitest'
import { renderSection, renderSections } from '../lib/engine/renderer'
import type { ComposedSection } from '../lib/engine/compose'

describe('renderer.tsx - renderSection', () => {
  it('should render header section', () => {
    const section: ComposedSection = {
      type: 'header',
      order: 0,
      data: { logo: 'Test Logo', phone: '+595981234567' },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render hero section', () => {
    const section: ComposedSection = {
      type: 'hero',
      order: 1,
      data: { headline: 'Welcome', subheadline: 'Best service' },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render services section', () => {
    const section: ComposedSection = {
      type: 'services',
      order: 2,
      data: {
        title: 'Our Services',
        services: [{ name: 'Service 1', price: '100' }],
        showPrices: true,
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render booking section', () => {
    const section: ComposedSection = {
      type: 'booking',
      order: 3,
      data: {
        title: 'Book Now',
        services: [{ name: 'Service 1', price: '100' }],
        whatsappPhone: '+595981234567',
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render portfolio section', () => {
    const section: ComposedSection = {
      type: 'portfolio',
      order: 4,
      data: {
        title: 'Our Work',
        items: [{ title: 'Project 1', image: 'image.jpg' }],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render beforeAfter section', () => {
    const section: ComposedSection = {
      type: 'beforeAfter',
      order: 5,
      data: {
        title: 'Before & After',
        items: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render classSchedule section', () => {
    const section: ComposedSection = {
      type: 'classSchedule',
      order: 6,
      data: {
        title: 'Class Schedule',
        schedule: [{ day: 'Lunes', classes: [] }],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render membershipPlans section', () => {
    const section: ComposedSection = {
      type: 'membershipPlans',
      order: 7,
      data: {
        title: 'Plans',
        plans: [{ name: 'Basic', price: '100', features: [] }],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render roomBooking section', () => {
    const section: ComposedSection = {
      type: 'roomBooking',
      order: 8,
      data: {
        title: 'Rooms',
        rooms: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render eventVenues section', () => {
    const section: ComposedSection = {
      type: 'eventVenues',
      order: 9,
      data: {
        title: 'Event Venues',
        venues: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render quoteForm section', () => {
    const section: ComposedSection = {
      type: 'quoteForm',
      order: 10,
      data: {
        title: 'Get Quote',
        services: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render emergencyIndicator section', () => {
    const section: ComposedSection = {
      type: 'emergencyIndicator',
      order: 11,
      data: {
        phone: '+595981234567',
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render productCatalog section', () => {
    const section: ComposedSection = {
      type: 'productCatalog',
      order: 12,
      data: {
        title: 'Products',
        products: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render gallery section', () => {
    const section: ComposedSection = {
      type: 'gallery',
      order: 13,
      data: {
        title: 'Gallery',
        images: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render team section', () => {
    const section: ComposedSection = {
      type: 'team',
      order: 14,
      data: {
        title: 'Our Team',
        members: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render testimonials section', () => {
    const section: ComposedSection = {
      type: 'testimonials',
      order: 15,
      data: {
        title: 'Testimonials',
        testimonials: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render contact section', () => {
    const section: ComposedSection = {
      type: 'contact',
      order: 16,
      data: {
        title: 'Contact Us',
        phone: '+595981234567',
        city: 'Asuncion',
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render faq section', () => {
    const section: ComposedSection = {
      type: 'faq',
      order: 17,
      data: {
        title: 'FAQ',
        items: [],
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render ctaBanner section', () => {
    const section: ComposedSection = {
      type: 'ctaBanner',
      order: 18,
      data: {
        title: 'Call to Action',
        buttonText: 'Click Me',
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render footer section', () => {
    const section: ComposedSection = {
      type: 'footer',
      order: 19,
      data: {
        businessName: 'Test Business',
        phone: '+595981234567',
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should render whatsappFloat section', () => {
    const section: ComposedSection = {
      type: 'whatsappFloat',
      order: 20,
      data: {
        phone: '+595981234567',
      },
    }
    const result = renderSection(section)
    expect(result).not.toBeNull()
  })

  it('should log warning for unknown section type', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const section: ComposedSection = {
      type: 'unknown' as never,
      order: 0,
      data: {},
    }
    const result = renderSection(section)
    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('[Renderer] Unknown section type:', 'unknown')
    consoleSpy.mockRestore()
  })
})

describe('renderer.tsx - renderSections', () => {
  it('should sort sections by order', () => {
    const sections: ComposedSection[] = [
      { type: 'hero', order: 2, data: { headline: 'Second' } },
      { type: 'header', order: 0, data: { logo: 'First' } },
      { type: 'services', order: 1, data: { title: 'Third' } },
    ]
    const results = renderSections(sections)
    expect(results).toHaveLength(3)
  })

  it('should filter out null sections', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const sections: ComposedSection[] = [
      { type: 'header', order: 0, data: {} },
      { type: 'unknown' as never, order: 1, data: {} },
      { type: 'hero', order: 2, data: {} },
    ]
    const results = renderSections(sections)
    expect(results).toHaveLength(2)
    consoleSpy.mockRestore()
  })

  it('should render all 21 section types', () => {
    const sectionTypes = [
      'header', 'hero', 'services', 'booking', 'portfolio', 'beforeAfter',
      'classSchedule', 'membershipPlans', 'roomBooking', 'eventVenues',
      'quoteForm', 'emergencyIndicator', 'productCatalog', 'gallery',
      'team', 'testimonials', 'contact', 'faq', 'ctaBanner', 'footer',
      'whatsappFloat',
    ]
    const sections: ComposedSection[] = sectionTypes.map((type, index) => ({
      type: type as never,
      order: index,
      data: {},
    }))
    const results = renderSections(sections)
    expect(results).toHaveLength(21)
  })
})