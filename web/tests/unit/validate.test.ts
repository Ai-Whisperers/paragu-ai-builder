import { describe, it, expect } from 'vitest'
import { validateBusiness } from '@/lib/generation/validate'

describe('validateBusiness', () => {
  it('validates a valid business input', () => {
    const result = validateBusiness({
      name: 'Salon Maria',
      type: 'peluqueria',
      contact: { phone: '+595981234567', whatsapp: '+595981234567' },
      location: { city: 'Asuncion', neighborhood: 'Villa Morra' },
      tagline: 'Tu mejor look comienza aqui',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Salon Maria')
      expect(result.data.type).toBe('peluqueria')
    }
  })

  it('rejects missing business name', () => {
    const result = validateBusiness({
      type: 'spa',
      contact: {},
      location: { city: 'Asuncion' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid business type', () => {
    const result = validateBusiness({
      name: 'Test',
      type: 'invalid_type',
      contact: {},
      location: { city: 'Asuncion' },
    })

    expect(result.success).toBe(false)
  })

  it('validates all 11 business types', () => {
    const types = [
      'peluqueria', 'salon_belleza', 'gimnasio', 'spa', 'unas', 'tatuajes',
      'barberia', 'estetica', 'maquillaje', 'depilacion', 'pestanas',
    ]

    for (const type of types) {
      const result = validateBusiness({
        name: `Test ${type}`,
        type,
        contact: {},
        location: { city: 'Asuncion' },
      })
      expect(result.success).toBe(true)
    }
  })

  it('validates business with full service data', () => {
    const result = validateBusiness({
      name: 'GymFit',
      type: 'gimnasio',
      contact: { email: 'info@gymfit.com.py', instagram: '@gymfit' },
      location: {
        city: 'Asuncion',
        address: 'Av. Espana 1234',
        coordinates: { lat: -25.2867, lng: -57.6472 },
      },
      services: [
        { name: 'Musculacion', price: '150.000 Gs/mes', duration: '60 min' },
        { name: 'Crossfit', price: '200.000 Gs/mes' },
      ],
      team: [
        { name: 'Carlos Benitez', role: 'Entrenador Principal' },
      ],
    })

    expect(result.success).toBe(true)
  })
})
