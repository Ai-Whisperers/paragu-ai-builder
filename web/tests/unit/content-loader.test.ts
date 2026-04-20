/**
 * Content Loader Tests
 * Win 54: Test placeholder replacement
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
const mockReadFileSync = vi.fn()
vi.mock('fs', () => ({
  readFileSync: mockReadFileSync,
}))

import { fillTemplate } from '@/lib/utils'

describe('fillTemplate - content loading context', () => {
  it('should replace business name placeholder', () => {
    const template = 'Welcome to {{businessName}}'
    const result = fillTemplate(template, { businessName: 'Cafetería Central' })
    expect(result).toBe('Welcome to Cafetería Central')
  })

  it('should replace city placeholder', () => {
    const template = 'Located in {{city}}'
    const result = fillTemplate(template, { city: 'Asunción' })
    expect(result).toBe('Located in Asunción')
  })

  it('should replace year placeholder', () => {
    const template = '© {{year}} All rights reserved'
    const result = fillTemplate(template, { year: 2026 })
    expect(result).toBe('© 2026 All rights reserved')
  })

  it('should replace neighborhood placeholder', () => {
    const template = 'In the heart of {{neighborhood}}'
    const result = fillTemplate(template, { neighborhood: 'Villa Morra' })
    expect(result).toBe('In the heart of Villa Morra')
  })

  it('should handle multiple placeholders in content', () => {
    const template = '{{businessName}} - The best services in {{city}} since {{year}}'
    const data = {
      businessName: 'Salón de Belleza María',
      city: 'Asunción',
      year: 2026,
    }
    const result = fillTemplate(template, data)
    expect(result).toBe('Salón de Belleza María - The best services in Asunción since 2026')
  })

  it('should handle empty neighborhood gracefully', () => {
    const template = 'Located in {{city}}, {{neighborhood}}'
    const result = fillTemplate(template, {
      city: 'Asunción',
      neighborhood: '',
    })
    expect(result).toBe('Located in Asunción, ')
  })

  it('should preserve unmatched template variables', () => {
    const template = '{{businessName}} - {{unknownVar}}'
    const result = fillTemplate(template, { businessName: 'Test' })
    expect(result).toBe('Test - {{unknownVar}}')
  })

  it('should handle template with no placeholders', () => {
    const template = 'Static content without placeholders'
    const result = fillTemplate(template, { businessName: 'Test' })
    expect(result).toBe('Static content without placeholders')
  })

  it('should handle special characters in replacement values', () => {
    const template = 'Welcome to {{businessName}}'
    const result = fillTemplate(template, { businessName: 'Café & Repostería' })
    expect(result).toBe('Welcome to Café & Repostería')
  })

  it('should handle accented characters in replacement values', () => {
    const template = '{{businessName}} in {{city}}'
    const result = fillTemplate(template, {
      businessName: 'Diseño Estético',
      city: 'Asunción',
    })
    expect(result).toBe('Diseño Estético in Asunción')
  })

  it('should handle numeric price values', () => {
    const template = 'Starting from ${{price}}'
    const result = fillTemplate(template, { price: 50000 })
    expect(result).toBe('Starting from $50000')
  })

  it('should handle phone numbers', () => {
    const template = 'Call us at {{phone}}'
    const result = fillTemplate(template, { phone: '+595-981-123456' })
    expect(result).toBe('Call us at +595-981-123456')
  })

  it('should handle complex nested content structures', () => {
    const template = '{{greeting}} {{businessName}}! Visit us at {{address}} in {{neighborhood}}, {{city}}.'
    const data = {
      greeting: 'Welcome to',
      businessName: 'Peluquería Moderna',
      address: 'Av. Mariscal López 1234',
      neighborhood: 'Villa Morra',
      city: 'Asunción',
    }
    const result = fillTemplate(template, data)
    expect(result).toBe('Welcome to Peluquería Moderna! Visit us at Av. Mariscal López 1234 in Villa Morra, Asunción.')
  })

  it('should handle partial data replacement', () => {
    const template = '{{businessName}} - {{tagline}} - {{city}}'
    const data = {
      businessName: 'Test Business',
      city: 'Asunción',
    }
    const result = fillTemplate(template, data)
    expect(result).toBe('Test Business - {{tagline}} - Asunción')
  })

  it('should handle URL placeholders', () => {
    const template = 'Visit: {{websiteUrl}}'
    const result = fillTemplate(template, { websiteUrl: 'https://example.com' })
    expect(result).toBe('Visit: https://example.com')
  })

  it('should handle email placeholders', () => {
    const template = 'Contact: {{email}}'
    const result = fillTemplate(template, { email: 'test@example.com' })
    expect(result).toBe('Contact: test@example.com')
  })

  it('should handle SEO metadata templates', () => {
    const titleTemplate = '{{businessName}} | {{city}}'
    const descTemplate = 'Best {{businessType}} in {{city}}. Visit {{businessName}} in {{neighborhood}}.'

    const titleData = { businessName: 'Salón María', city: 'Asunción' }
    const descData = {
      businessType: 'salon',
      city: 'Asunción',
      businessName: 'Salón María',
      neighborhood: 'Villa Morra',
    }

    expect(fillTemplate(titleTemplate, titleData)).toBe('Salón María | Asunción')
    expect(fillTemplate(descTemplate, descData)).toBe('Best salon in Asunción. Visit Salón María in Villa Morra.')
  })
})

describe('Content template integration patterns', () => {
  it('should handle hero headline template', () => {
    const headlineTemplate = 'Bienvenidos a {{businessName}}'
    const result = fillTemplate(headlineTemplate, { businessName: 'Cafetería El Buen Sabor' })
    expect(result).toBe('Bienvenidos a Cafetería El Buen Sabor')
  })

  it('should handle hero subheadline template', () => {
    const subheadlineTemplate = 'Los mejores servicios en {{city}}'
    const result = fillTemplate(subheadlineTemplate, { city: 'Asunción' })
    expect(result).toBe('Los mejores servicios en Asunción')
  })

  it('should handle footer copyright template', () => {
    const copyrightTemplate = '© {{year}} {{businessName}}. Todos los derechos reservados.'
    const result = fillTemplate(copyrightTemplate, {
      year: 2026,
      businessName: 'Peluquería Moderna',
    })
    expect(result).toBe('© 2026 Peluquería Moderna. Todos los derechos reservados.')
  })

  it('should handle CTA banner template', () => {
    const ctaTemplate = '¿Listo para visitar {{businessName}} en {{city}}?'
    const result = fillTemplate(ctaTemplate, {
      businessName: 'Spa Relax',
      city: 'Asunción',
    })
    expect(result).toBe('¿Listo para visitar Spa Relax en Asunción?')
  })
})
