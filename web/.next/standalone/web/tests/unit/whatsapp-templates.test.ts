/**
 * WhatsApp Templates Tests
 * Win 57: Test message generation
 */
import { describe, it, expect } from 'vitest'
import {
  TEMPLATES,
  generateWhatsAppLink,
  generateOutreachLink,
  type TemplateVariables,
} from '@/lib/outreach/templates'

describe('WhatsApp Templates', () => {
  const mockVars: TemplateVariables = {
    businessName: 'Cafetería El Buen Sabor',
    ownerName: 'María',
    city: 'Asunción',
    demoUrl: 'https://demo.paragu.ai/cafeteria-el-buen-sabor',
    vertical: 'restaurant',
  }

  describe('TEMPLATES.initialOutreach', () => {
    it('should generate initial outreach message', () => {
      const message = TEMPLATES.initialOutreach(mockVars)

      expect(message).toContain('¡Hola! 👋')
      expect(message).toContain('Paragu-AI')
      expect(message).toContain(mockVars.businessName)
      expect(message).toContain(mockVars.city)
    })

    it('should work without optional ownerName', () => {
      const varsWithoutOwner = { ...mockVars, ownerName: undefined }
      const message = TEMPLATES.initialOutreach(varsWithoutOwner)

      expect(message).toContain(mockVars.businessName)
      expect(message).not.toContain('undefined')
    })
  })

  describe('TEMPLATES.demoReady', () => {
    it('should generate demo ready message with URL', () => {
      const message = TEMPLATES.demoReady(mockVars)

      expect(message).toContain(mockVars.businessName)
      expect(message).toContain(mockVars.demoUrl)
      expect(message).toContain('🌐 TU SITIO WEB DE DEMO:')
    })

    it('should use default URL if demoUrl not provided', () => {
      const varsWithoutDemo = { ...mockVars, demoUrl: undefined }
      const message = TEMPLATES.demoReady(varsWithoutDemo)

      expect(message).toContain('https://paragu.ai/demo')
    })
  })

  describe('TEMPLATES.followUp', () => {
    it('should generate follow up message', () => {
      const message = TEMPLATES.followUp(mockVars)

      expect(message).toContain('Hace unos días')
      expect(message).toContain(mockVars.businessName)
      expect(message).toContain('¿Tuvieron chance de ver el demo?')
    })
  })

  describe('TEMPLATES.pricing', () => {
    it('should generate pricing message with all tiers', () => {
      const message = TEMPLATES.pricing(mockVars)

      expect(message).toContain('GRATIS')
      expect(message).toContain('BÁSICO')
      expect(message).toContain('PROFESIONAL')
      expect(message).toContain('PREMIUM')
      expect(message).toContain('₲290.000/mes')
      expect(message).toContain('₲590.000/mes')
      expect(message).toContain('₲990.000/mes')
      expect(message).toContain(mockVars.businessName)
    })
  })

  describe('TEMPLATES.onboarding', () => {
    it('should generate onboarding message with checklist', () => {
      const message = TEMPLATES.onboarding(mockVars)

      expect(message).toContain('¡Excelente noticia! 🎉')
      expect(message).toContain(mockVars.businessName)
      expect(message).toContain('1️⃣ Logo del negocio')
      expect(message).toContain('2️⃣ Fotos de su local')
      expect(message).toContain('3️⃣ Lista de servicios')
      expect(message).toContain('4️⃣ Horarios de atención')
      expect(message).toContain('5️⃣ Datos de contacto')
    })
  })

  describe('TEMPLATES.reactivation', () => {
    it('should generate reactivation message', () => {
      const message = TEMPLATES.reactivation(mockVars)

      expect(message).toContain('Hace tiempo conversamos')
      expect(message).toContain(mockVars.businessName)
      expect(message).toContain('✅ Ahora carga aún más rápido')
      expect(message).toContain('✅ Mejor posicionamiento en Google')
    })
  })

  describe('TEMPLATES.referral', () => {
    it('should generate referral request message', () => {
      const message = TEMPLATES.referral(mockVars)

      expect(message).toContain(mockVars.businessName)
      expect(message).toContain(mockVars.city)
      expect(message).toContain('1 mes gratis')
    })
  })

  describe('generateWhatsAppLink', () => {
    it('should generate wa.me link with message', () => {
      const phone = '+595-981-123456'
      const message = 'Hola, estoy interesado en sus servicios'

      const link = generateWhatsAppLink(phone, message)

      expect(link).toContain('https://wa.me/')
      expect(link).toContain('595981123456')
      expect(link).toContain(encodeURIComponent(message))
    })

    it('should handle phone with spaces and dashes', () => {
      const phone = '+595 981 123-456'
      const message = 'Test message'

      const link = generateWhatsAppLink(phone, message)

      expect(link).toContain('595981123456')
    })

    it('should add country code if missing', () => {
      const phone = '0981123456'
      const message = 'Test'

      const link = generateWhatsAppLink(phone, message)

      expect(link).toContain('595981123456')
    })

    it('should handle phone starting with 0', () => {
      const phone = '0211234567'
      const message = 'Test'

      const link = generateWhatsAppLink(phone, message)

      expect(link).toContain('595211234567')
    })

    it('should handle phone with parentheses', () => {
      const phone = '(021) 123-4567'
      const message = 'Test'

      const link = generateWhatsAppLink(phone, message)

      expect(link).toContain('5950211234567')
    })

    it('should not double-add country code', () => {
      const phone = '595981123456'
      const message = 'Test'

      const link = generateWhatsAppLink(phone, message)

      expect(link).toContain('595981123456')
      expect(link).not.toContain('595595')
    })

    it('should URL encode special characters in message', () => {
      const phone = '+595981123456'
      const message = 'Hello! ¿Cómo estás? Café & té'

      const link = generateWhatsAppLink(phone, message)

      // encodeURIComponent leaves !'()* per RFC 3986; check that the encoded
      // form appears and that whitespace is turned into %20.
      expect(link).toContain(encodeURIComponent(message))
      expect(link).not.toContain(' ')
      expect(link).toContain('%20') // encoded space
      expect(link).toContain('%C3%A9') // encoded é
    })
  })

  describe('generateOutreachLink', () => {
    it('should generate link with initial outreach template', () => {
      const link = generateOutreachLink(
        '+595981123456',
        'initialOutreach',
        mockVars
      )

      expect(link).toContain('https://wa.me/')
      expect(link).toContain(encodeURIComponent(mockVars.businessName))
      expect(link).toContain(encodeURIComponent(mockVars.city))
    })

    it('should generate link with demo ready template', () => {
      const link = generateOutreachLink(
        '+595981123456',
        'demoReady',
        mockVars
      )

      expect(link).toContain('https://wa.me/')
      expect(link).toContain(encodeURIComponent(mockVars.demoUrl!))
    })

    it('should work with all template types', () => {
      const templates = [
        'initialOutreach',
        'demoReady',
        'followUp',
        'pricing',
        'onboarding',
        'reactivation',
        'referral',
      ] as const

      templates.forEach((templateName) => {
        const link = generateOutreachLink(
          '+595981123456',
          templateName,
          mockVars
        )
        expect(link).toContain('https://wa.me/')
        expect(link).toContain('595981123456')
      })
    })
  })

  describe('Template message length', () => {
    it('should generate messages under WhatsApp limit (65,536 chars)', () => {
      const message = TEMPLATES.pricing(mockVars)
      expect(message.length).toBeLessThan(65536)
    })

    it('should generate reasonable length messages for readability', () => {
      const message = TEMPLATES.initialOutreach(mockVars)
      expect(message.length).toBeGreaterThan(50)
      expect(message.length).toBeLessThan(2000)
    })
  })
})
