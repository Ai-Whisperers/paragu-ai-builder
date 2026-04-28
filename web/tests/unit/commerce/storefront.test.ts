import { describe, it, expect } from 'vitest'
import { computeInstallmentDisplay } from '@/lib/commerce/installments'
import { getFreeShippingThresholdCents } from '@/lib/commerce/shipping-threshold'
import { getConfig } from '@/lib/commerce/tenant-config'

describe('InstallmentLine', () => {
  it('returns installments for viajero-comercio with high price', () => {
    const result = computeInstallmentDisplay('viajero-comercio', 45_000_000, 'PYG')
    expect(result).not.toBeNull()
    expect(result!.count).toBe(3)
    expect(result!.freeOfInterest).toBe(true)
  })

  it('returns null for price below threshold', () => {
    const result = computeInstallmentDisplay('viajero-comercio', 5_000_000, 'PYG')
    expect(result).toBeNull()
  })

  it('returns null for non-PYG currency', () => {
    const result = computeInstallmentDisplay('viajero-comercio', 45_000_000, 'USD')
    expect(result).toBeNull()
  })

  it('returns null for unknown site slug', () => {
    const result = computeInstallmentDisplay('unknown-site', 45_000_000, 'PYG')
    expect(result).toBeNull()
  })
})

describe('ShippingThreshold', () => {
  it('returns 30000000 for viajero-comercio', () => {
    expect(getFreeShippingThresholdCents('viajero-comercio')).toBe(30_000_000)
  })

  it('returns 20000000 for fun4me', () => {
    expect(getFreeShippingThresholdCents('fun4me')).toBe(20_000_000)
  })

  it('returns 0 for unknown sites', () => {
    expect(getFreeShippingThresholdCents('unknown')).toBe(0)
  })
})

describe('TenantConfig', () => {
  it('hides discreet mode for viajero-comercio', () => {
    const config = getConfig('viajero-comercio')
    expect(config.hideDiscreetMode).toBe(true)
  })

  it('shows discreet mode for fun4me', () => {
    const config = getConfig('fun4me')
    expect(config.hideDiscreetMode).toBe(false)
  })

  it('has empty tag groups for viajero-comercio', () => {
    const config = getConfig('viajero-comercio')
    expect(config.tagGroups).toEqual([])
  })

  it('has tag groups for fun4me', () => {
    const config = getConfig('fun4me')
    expect(config.tagGroups.length).toBeGreaterThan(0)
  })

  it('hides quiz fab for viajero-comercio', () => {
    const config = getConfig('viajero-comercio')
    expect(config.showQuizFab).toBe(false)
  })
})
