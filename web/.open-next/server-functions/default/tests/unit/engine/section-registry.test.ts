import { describe, it, expect } from 'vitest'
import {
  SECTION_CATALOG,
  hasSection,
  hasVariant,
  defaultVariant,
} from '@/lib/engine/section-registry'

describe('section-registry', () => {
  it('has all required relocation sections', () => {
    const needed = [
      'header', 'hero', 'programs-comparison', 'process-timeline',
      'why-destination', 'trust-signals', 'faq', 'cta-banner',
      'contact', 'footer', 'whatsapp-float', 'booking-embed',
      'blog-index', 'blog-post',
    ]
    for (const id of needed) {
      expect(hasSection(id)).toBe(true)
    }
  })

  it('every manifest lists its default variant among variants', () => {
    for (const [id, m] of Object.entries(SECTION_CATALOG)) {
      expect(m.variants, `${id} has no variants`).not.toHaveLength(0)
      expect(m.variants, `${id} defaultVariant not in variants`).toContain(m.defaultVariant)
    }
  })

  it('hasVariant rejects unknown variants', () => {
    expect(hasVariant('hero', 'image')).toBe(true)
    expect(hasVariant('hero', 'nonexistent')).toBe(false)
    expect(hasVariant('nonexistent-section', 'whatever')).toBe(false)
  })

  it('defaultVariant throws on unknown section', () => {
    expect(() => defaultVariant('nope')).toThrow()
  })
})
