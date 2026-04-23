import { describe, it, expect } from 'vitest'
import { composeSitePage } from '@/lib/engine/compose-site'

const PAGES = [
  '',
  'nosotros',
  'tiendas',
  'guias',
  'garantia',
  'envios',
  'financiacion',
  'terminos',
  'privacidad',
  'promo-cartagena',
] as const

describe('superspuma composition', () => {
  for (const pageSlug of PAGES) {
    it(`composes /${pageSlug || 'home'} without errors`, () => {
      const page = composeSitePage({ siteSlug: 'superspuma', locale: 'es', pageSlug })
      expect(page.sections.length).toBeGreaterThan(0)
      for (const section of page.sections) {
        expect(section.id).toBeTruthy()
        expect(section.props).toBeDefined()
      }
    })
  }
})
