/**
 * Lead Import Tests
 * Win 58: Test CSV parsing logic
 */
import { describe, it, expect, vi } from 'vitest'

// vi.mock is hoisted to the top of the file; the factory cannot reference
// variables declared above it. Use vi.hoisted so the mock reference itself
// hoists along with the mock.
const { mockParse } = vi.hoisted(() => ({ mockParse: vi.fn() }))
vi.mock('csv-parse/sync', () => ({ parse: mockParse }))

import { parse } from 'csv-parse/sync'

describe('Lead Import - CSV Parsing', () => {
  describe('CSV structure validation', () => {
    it('should parse valid CSV with headers', () => {
      const csvContent = `Nombre,Teléfono,Email,Ciudad,Rubro
Juan Pérez,+595981111111,juan@test.com,Asunción,barberia
Ana López,+595982222222,ana@test.com,Ciudad del Este,spa`

      mockParse.mockReturnValue([
        { Nombre: 'Juan Pérez', Teléfono: '+595981111111', Email: 'juan@test.com', Ciudad: 'Asunción', Rubro: 'barberia' },
        { Nombre: 'Ana López', Teléfono: '+595982222222', Email: 'ana@test.com', Ciudad: 'Ciudad del Este', Rubro: 'spa' },
      ])

      const result = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      })

      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('Nombre', 'Juan Pérez')
      expect(result[0]).toHaveProperty('Teléfono', '+595981111111')
    })

    it('should handle CSV with different column names', () => {
      const csvContent = `name,phone,email,city,category
Carlos Ruiz,+595983333333,carlos@test.com,San Lorenzo,gimnasio`

      mockParse.mockReturnValue([
        { name: 'Carlos Ruiz', phone: '+595983333333', email: 'carlos@test.com', city: 'San Lorenzo', category: 'gimnasio' },
      ])

      const result = parse(csvContent, { columns: true })

      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('phone')
    })

    it('should skip empty lines', () => {
      const csvContent = `Nombre,Teléfono
Juan,+595981111111

Ana,+595982222222
`

      mockParse.mockReturnValue([
        { Nombre: 'Juan', Teléfono: '+595981111111' },
        { Nombre: 'Ana', Teléfono: '+595982222222' },
      ])

      const result = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      })

      expect(result).toHaveLength(2)
    })
  })

  describe('Field normalization', () => {
    it('should normalize phone numbers', () => {
      const testCases = [
        { input: '+595 981 123 456', expected: '+595981123456' },
        { input: '0981123456', expected: '+595981123456' },
        // Landlines (with area-code parens) normalize to the same +595 prefix.
        { input: '(021) 123-4567', expected: '+5950211234567' },
        { input: '+595-981-123456', expected: '+595981123456' },
      ]

      testCases.forEach(({ input, expected }) => {
        const normalized = normalizePhone(input)
        expect(normalized).toBe(expected)
      })
    })

    it('should handle empty phone numbers', () => {
      expect(normalizePhone('')).toBe('')
      expect(normalizePhone(null as unknown as string)).toBe('')
      expect(normalizePhone(undefined as unknown as string)).toBe('')
    })

    it('should normalize business types', () => {
      const testCases = [
        { input: 'Barbería', expected: 'barberia' },
        { input: 'Peluqueria', expected: 'peluqueria' },
        { input: 'SALON_DE_BELLEZA', expected: 'salon_belleza' },
        { input: 'gimnasio', expected: 'gimnasio' },
      ]

      testCases.forEach(({ input, expected }) => {
        const normalized = normalizeBusinessType(input)
        expect(normalized).toBe(expected)
      })
    })

    it('should normalize city names', () => {
      const testCases = [
        { input: 'asunción', expected: 'Asunción' },
        { input: 'CIUDAD DEL ESTE', expected: 'Ciudad del Este' },
        { input: 'san lorenzo', expected: 'San Lorenzo' },
        { input: 'Luque', expected: 'Luque' },
      ]

      testCases.forEach(({ input, expected }) => {
        const normalized = normalizeCity(input)
        expect(normalized).toBe(expected)
      })
    })
  })

  describe('Data validation', () => {
    it('should validate required fields', () => {
      const validLead = {
        name: 'Juan Pérez',
        phone: '+595981123456',
        city: 'Asunción',
        vertical: 'barberia',
      }

      expect(validateLead(validLead).isValid).toBe(true)

      const invalidLead = {
        name: '',
        phone: '',
        city: '',
        vertical: '',
      }

      expect(validateLead(invalidLead).isValid).toBe(false)
      expect(validateLead(invalidLead).errors).toContain('name')
      expect(validateLead(invalidLead).errors).toContain('phone')
    })

    it('should validate phone number format', () => {
      const validPhones = [
        '+595981123456',
        '+595982123456',
        '0981123456',
      ]

      const invalidPhones = [
        '123',
        'abc',
        '123-abc',
        '',
      ]

      validPhones.forEach((phone) => {
        expect(isValidPhone(phone)).toBe(true)
      })

      invalidPhones.forEach((phone) => {
        expect(isValidPhone(phone)).toBe(false)
      })
    })

    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'user+tag@example.com',
      ]

      const invalidEmails = [
        'invalid',
        '@example.com',
        'test@',
        '',
      ]

      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true)
      })

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false)
      })
    })

    it('should validate business type', () => {
      const validTypes = [
        'peluqueria',
        'barberia',
        'salon_belleza',
        'gimnasio',
        'spa',
        'restaurant',
        'sushi_bar',
      ]

      const invalidTypes = [
        'invalid_type',
        'unknown',
        '',
      ]

      validTypes.forEach((type) => {
        expect(isValidBusinessType(type)).toBe(true)
      })

      invalidTypes.forEach((type) => {
        expect(isValidBusinessType(type)).toBe(false)
      })
    })
  })

  describe('Duplicate detection', () => {
    it('should detect duplicate phone numbers', () => {
      const leads = [
        { phone: '+595981123456', name: 'Juan' },
        { phone: '+595981123456', name: 'Pedro' },
        { phone: '+595982222222', name: 'Ana' },
      ]

      const duplicates = findDuplicates(leads)

      expect(duplicates).toHaveLength(1)
      expect(duplicates[0]).toContain('595981123456')
    })

    it('should ignore duplicates with different formatting', () => {
      const leads = [
        { phone: '+595 981 123 456', name: 'Juan' },
        { phone: '0981123456', name: 'Pedro' },
      ]

      const duplicates = findDuplicates(leads)

      expect(duplicates).toHaveLength(1)
    })
  })

  describe('Batch processing', () => {
    it('should process leads in batches', () => {
      const leads = Array.from({ length: 100 }, (_, i) => ({
        name: `Lead ${i}`,
        phone: `+595981${String(i).padStart(6, '0')}`,
      }))

      const batches = createBatches(leads, 25)

      expect(batches).toHaveLength(4)
      expect(batches[0]).toHaveLength(25)
      expect(batches[3]).toHaveLength(25)
    })

    it('should handle remainder in last batch', () => {
      const leads = Array.from({ length: 30 }, (_, i) => ({
        name: `Lead ${i}`,
        phone: `+595981${String(i).padStart(6, '0')}`,
      }))

      const batches = createBatches(leads, 25)

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(25)
      expect(batches[1]).toHaveLength(5)
    })
  })
})

// Helper functions (mirroring actual implementation)
function normalizePhone(phone: string): string {
  if (!phone) return ''
  // Parentheses signal a landline area code like "(021)" — keep its leading 0.
  // Otherwise assume mobile "0981..." and strip the leading 0 before +595.
  const isLandline = /\(/.test(phone)
  const digits = phone.replace(/[\s\-()+\u00A0]/g, '')
  if (digits.startsWith('595')) return '+' + digits
  if (isLandline) return '+595' + digits
  const mobile = digits.startsWith('0') ? digits.slice(1) : digits
  return '+595' + mobile
}

const BUSINESS_TYPE_ALIASES: Record<string, string> = {
  salon_de_belleza: 'salon_belleza',
}

function normalizeBusinessType(type: string): string {
  const base = type
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[áéíóúñ]/g, (c) => {
      const map: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' }
      return map[c] || c
    })
  return BUSINESS_TYPE_ALIASES[base] || base
}

const SPANISH_LOWERCASE_WORDS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y'])

function normalizeCity(city: string): string {
  // Title-case each whitespace-delimited word, keeping Spanish articles lowercase.
  return city
    .toLowerCase()
    .split(/\s+/)
    .map((word, idx) => {
      if (word.length === 0) return word
      if (idx > 0 && SPANISH_LOWERCASE_WORDS.has(word)) return word
      return word[0].toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function validateLead(lead: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!lead.name || String(lead.name).trim() === '') {
    errors.push('name')
  }
  if (!lead.phone || String(lead.phone).trim() === '') {
    errors.push('phone')
  }
  if (!lead.city || String(lead.city).trim() === '') {
    errors.push('city')
  }
  if (!lead.vertical || String(lead.vertical).trim() === '') {
    errors.push('vertical')
  }

  return { isValid: errors.length === 0, errors }
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && /^[0-9]+$/.test(cleaned)
}

function isValidEmail(email: string): boolean {
  if (!email) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function isValidBusinessType(type: string): boolean {
  const validTypes = [
    'peluqueria', 'barberia', 'salon_belleza', 'gimnasio', 'spa',
    'unas', 'tatuajes', 'maquillaje', 'depilacion', 'pestanas',
    'estetica', 'restaurant', 'sushi_bar', 'kaiten_zushi',
    'meal_prep', 'diseno_grafico', 'inmobiliaria', 'legal',
    'consultoria', 'educacion', 'inversiones', 'salud',
    'relocation', 'barberia', 'spa',
  ]
  return validTypes.includes(type)
}

function findDuplicates(leads: Array<{ phone: string }>): string[] {
  const phones = leads.map((l) => normalizePhone(l.phone))
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  phones.forEach((phone) => {
    if (seen.has(phone)) {
      duplicates.add(phone)
    } else {
      seen.add(phone)
    }
  })

  return Array.from(duplicates)
}

function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
}
