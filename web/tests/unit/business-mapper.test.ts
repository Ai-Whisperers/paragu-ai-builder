import { describe, it, expect } from 'vitest'
import { fromBusiness } from '@/lib/engine/business'
import type { Business } from '@/lib/types'

const row: Business = {
  id: 'biz-1',
  slug: 'salon-maria',
  name: 'Salon Maria',
  type: 'peluqueria',
  contact: { phone: '+595981234567', email: 'hi@sm.com' },
  location: { city: 'Asuncion', neighborhood: 'Villa Morra' },
  tagline: 'Tu mejor look',
  createdAt: '2026-04-01T00:00:00Z',
}

describe('fromBusiness', () => {
  it('flattens contact + location into the render DTO', () => {
    const data = fromBusiness(row)
    expect(data.name).toBe('Salon Maria')
    expect(data.slug).toBe('salon-maria')
    expect(data.type).toBe('peluqueria')
    expect(data.city).toBe('Asuncion')
    expect(data.neighborhood).toBe('Villa Morra')
    expect(data.phone).toBe('+595981234567')
    expect(data.email).toBe('hi@sm.com')
  })

  it('merges related collections when provided', () => {
    const data = fromBusiness(row, {
      services: [{ name: 'Corte' }],
      team: [{ name: 'Ana' }],
      heroImage: 'https://img/x.jpg',
    })
    expect(data.services).toEqual([{ name: 'Corte' }])
    expect(data.team).toEqual([{ name: 'Ana' }])
    expect(data.heroImage).toBe('https://img/x.jpg')
  })

  it('drops DB-only fields (id, createdAt) from the DTO', () => {
    const data = fromBusiness(row) as Record<string, unknown>
    expect(data.id).toBeUndefined()
    expect(data.createdAt).toBeUndefined()
  })
})
