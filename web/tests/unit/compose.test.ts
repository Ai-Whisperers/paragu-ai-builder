import { describe, it, expect, beforeEach } from 'vitest'
import { composePage } from '@/lib/engine/compose'
import { __resetContentCache } from '@/lib/content/loader'
import type { BusinessData } from '@/lib/engine/business'

function makeBusiness(overrides: Partial<BusinessData> = {}): BusinessData {
  return {
    name: 'Salon Maria',
    slug: 'salon-maria',
    type: 'peluqueria',
    city: 'Asuncion',
    neighborhood: 'Villa Morra',
    phone: '+595981234567',
    whatsapp: '+595981234567',
    email: 'info@salonmaria.com.py',
    ...overrides,
  }
}

beforeEach(() => {
  __resetContentCache()
})

describe('composePage', () => {
  it('produces a page with meta, theme, and ordered sections', async () => {
    const page = await composePage(makeBusiness())
    expect(page.meta.title).toContain('Salon Maria')
    expect(page.meta.description).toContain('Asuncion')
    expect(page.theme.cssString).toContain(':root')
    expect(page.theme.googleFontsUrl).toMatch(/^https:\/\/fonts\.googleapis\.com/)
    expect(page.sections.length).toBeGreaterThan(0)
    const orders = page.sections.map((s) => s.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })

  it('never emits duplicate section types even if registry lists aliases', async () => {
    const page = await composePage(makeBusiness())
    const types = page.sections.map((s) => s.type)
    expect(new Set(types).size).toBe(types.length)
  })

  it('appends whatsappFloat when business has whatsapp and feature is enabled', async () => {
    const page = await composePage(makeBusiness())
    const wa = page.sections.find((s) => s.type === 'whatsappFloat')
    expect(wa).toBeDefined()
    expect(wa!.data.phone).toBe('+595981234567')
    expect(typeof wa!.data.message).toBe('string')
  })

  it('omits whatsappFloat when business has no whatsapp', async () => {
    const page = await composePage(makeBusiness({ whatsapp: undefined }))
    expect(page.sections.find((s) => s.type === 'whatsappFloat')).toBeUndefined()
  })

  it('skips team section when no team members are supplied', async () => {
    const page = await composePage(makeBusiness())
    expect(page.sections.find((s) => s.type === 'team')).toBeUndefined()
  })

  it('emits team section when team members are supplied', async () => {
    const page = await composePage(
      makeBusiness({ team: [{ name: 'Ana', role: 'Estilista' }] })
    )
    const team = page.sections.find((s) => s.type === 'team')
    expect(team).toBeDefined()
    expect(team!.data.members).toHaveLength(1)
  })

  it('falls back to content-default services when none are supplied', async () => {
    const page = await composePage(makeBusiness({ services: [] }))
    const services = page.sections.find((s) => s.type === 'services')
    expect(services).toBeDefined()
    expect(Array.isArray(services!.data.services)).toBe(true)
  })

  it('fills placeholder gallery when business has no photos', async () => {
    const page = await composePage(makeBusiness())
    const gallery = page.sections.find((s) => s.type === 'gallery')
    expect(gallery).toBeDefined()
    expect(gallery!.data.images.length).toBeGreaterThan(0)
    expect(gallery!.data.images[0].src).toMatch(/^data:image\/svg\+xml/)
  })

  it('composes all business types declared in types.ts', async () => {
    const types = [
      'peluqueria',
      'salon_belleza',
      'gimnasio',
      'spa',
      'unas',
      'tatuajes',
      'barberia',
      'estetica',
      'maquillaje',
      'depilacion',
      'pestanas',
      'diseno_grafico',
    ] as const
    for (const t of types) {
      const page = await composePage(makeBusiness({ type: t, slug: t }))
      expect(page.sections.length).toBeGreaterThan(0)
      expect(page.meta.title).toBeTruthy()
    }
  })
})
