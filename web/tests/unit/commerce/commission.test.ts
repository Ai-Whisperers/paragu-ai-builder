import { describe, it, expect } from 'vitest'
import {
  computeCommission,
  buildCommissionItem,
} from '@/lib/payments/pagopar/commission'

describe('computeCommission', () => {
  it('applies the percent to subtotal (5% of 150.000 = 7.500)', () => {
    expect(computeCommission(150_000, { percent: 5, flatCents: 0, exemptUntil: null })).toBe(7_500)
  })

  it('adds the flat fee on top of percent', () => {
    expect(computeCommission(100_000, { percent: 3, flatCents: 2_000, exemptUntil: null })).toBe(5_000)
  })

  it('returns zero when the business is still in the exempt window', () => {
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days out
    expect(computeCommission(1_000_000, { percent: 5, flatCents: 0, exemptUntil: future })).toBe(0)
  })

  it('applies commission again once the exempt window has passed', () => {
    const past = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    expect(computeCommission(100_000, { percent: 5, flatCents: 0, exemptUntil: past })).toBe(5_000)
  })

  it('returns zero for empty subtotal', () => {
    expect(computeCommission(0, { percent: 5, flatCents: 500, exemptUntil: null })).toBe(0)
  })

  it('rounds to integer PYG (no subunit)', () => {
    // 5% of 12.345 = 617.25 → rounds to 617
    expect(computeCommission(12_345, { percent: 5, flatCents: 0, exemptUntil: null })).toBe(617)
  })

  it('supports fractional percent (2.5% of 200.000 = 5.000)', () => {
    expect(computeCommission(200_000, { percent: 2.5, flatCents: 0, exemptUntil: null })).toBe(5_000)
  })
})

describe('buildCommissionItem', () => {
  it('returns null when commission is zero', () => {
    expect(
      buildCommissionItem({ commissionCents: 0, platformPublicKey: 'p_x', paddedProductId: 900001 }),
    ).toBeNull()
  })

  it('constructs a split-billing compras_items entry', () => {
    const item = buildCommissionItem({
      commissionCents: 7_500,
      platformPublicKey: 'p_paragu_ai',
      paddedProductId: 900005,
    })
    expect(item).not.toBeNull()
    expect(item!.nombre).toBe('Plataforma · servicio digital')
    expect(item!.precio_total).toBe(7_500)
    expect(item!.public_key).toBe('p_paragu_ai')
    expect(item!.id_producto).toBe(900005)
    expect(item!.cantidad).toBe(1)
  })

  it('uses a distinct id_producto range (900000+) to avoid colliding with tenant items', () => {
    const item = buildCommissionItem({
      commissionCents: 1_000,
      platformPublicKey: 'p_x',
      paddedProductId: 900010,
    })
    expect(item!.id_producto).toBeGreaterThanOrEqual(900000)
  })
})
