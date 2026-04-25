import { describe, it, expect } from 'vitest'
import { loadBusiness, loadAllSlugs } from '@/lib/engine/data-loader'
import { getRegistry, getContent } from '@/lib/engine/static-config'

describe('data-loader.ts — demo fallback path', () => {
  describe('loadBusiness', () => {
    it('loads a demo business by slug', async () => {
      const business = await loadBusiness('salon-maria')
      expect(business).not.toBeNull()
      expect(business?.slug).toBe('salon-maria')
    })

    it('returns null for non-existent slug', async () => {
      const business = await loadBusiness('non-existent-business')
      expect(business).toBeNull()
    })

    it('loads gymfit-py with class schedule', async () => {
      const business = await loadBusiness('gymfit-py')
      expect(business).not.toBeNull()
      expect(business?.classSchedule).toBeDefined()
      expect(business?.classSchedule?.length ?? 0).toBeGreaterThan(0)
    })

    it('loads gymfit-py with membership plans', async () => {
      const business = await loadBusiness('gymfit-py')
      expect(business).not.toBeNull()
      expect(business?.membershipPlans).toBeDefined()
      expect(business?.membershipPlans?.length ?? 0).toBeGreaterThan(0)
    })
  })

  describe('loadAllSlugs', () => {
    it('returns the full demo catalog including flagship businesses', async () => {
      const slugs = await loadAllSlugs()
      expect(slugs.length).toBeGreaterThan(0)
      expect(slugs).toContain('salon-maria')
      expect(slugs).toContain('gymfit-py')
      expect(slugs).toContain('spa-serenidad')
    })
  })
})

describe('static-config.ts — embedded registry/content catalog', () => {
  describe('getRegistry', () => {
    it('returns peluqueria registry', () => {
      const registry = getRegistry('peluqueria') as { id: string } | null
      expect(registry).not.toBeNull()
      expect(registry?.id).toBe('peluqueria')
    })

    it('returns gimnasio registry', () => {
      const registry = getRegistry('gimnasio') as { id: string } | null
      expect(registry).not.toBeNull()
      expect(registry?.id).toBe('gimnasio')
    })

    it('returns spa registry', () => {
      const registry = getRegistry('spa') as { id: string } | null
      expect(registry).not.toBeNull()
      expect(registry?.id).toBe('spa')
    })

    it('returns null for invalid type', () => {
      expect(getRegistry('invalid-type')).toBeNull()
    })
  })

  describe('getContent', () => {
    it('returns peluqueria content with hero', () => {
      const content = getContent('peluqueria') as { hero?: unknown } | null
      expect(content).not.toBeNull()
      expect(content?.hero).toBeDefined()
    })

    it('returns gimnasio content with classSchedule', () => {
      const content = getContent('gimnasio') as { classSchedule?: unknown } | null
      expect(content).not.toBeNull()
      expect(content?.classSchedule).toBeDefined()
    })

    it('returns spa content with membershipPlans', () => {
      const content = getContent('spa') as { membershipPlans?: unknown } | null
      expect(content).not.toBeNull()
      expect(content?.membershipPlans).toBeDefined()
    })

    it('returns null for invalid type', () => {
      expect(getContent('invalid-type')).toBeNull()
    })
  })
})

describe('data integrity', () => {
  it('BUSINESS_TYPES contains at least the 12 original verticals', async () => {
    const { BUSINESS_TYPES } = await import('@/lib/types')
    expect(BUSINESS_TYPES.length).toBeGreaterThanOrEqual(12)
    // Spot-check a few critical entries rather than freezing the full list.
    expect(BUSINESS_TYPES).toContain('peluqueria')
    expect(BUSINESS_TYPES).toContain('gimnasio')
    expect(BUSINESS_TYPES).toContain('spa')
  })
})
