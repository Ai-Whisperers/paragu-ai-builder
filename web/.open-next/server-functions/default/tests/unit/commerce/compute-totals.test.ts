import { describe, it, expect } from 'vitest'
import { computeCartTotals, computeOrderTotal, formatCents } from '@/lib/commerce/compute-totals'
import type { CartItem } from '@/lib/schemas/commerce/cart'

const makeItem = (qty: number, cents: number): CartItem => ({
  id: `i-${qty}-${cents}`,
  cartId: 'c',
  productId: 'p',
  quantity: qty,
  unitPriceCents: cents,
  createdAt: new Date().toISOString(),
})

describe('computeCartTotals', () => {
  it('handles empty cart', () => {
    expect(computeCartTotals([], 'PYG')).toEqual({ subtotalCents: 0, itemCount: 0, currency: 'PYG' })
  })

  it('sums line totals', () => {
    const items = [makeItem(2, 50000), makeItem(1, 25000)]
    expect(computeCartTotals(items, 'PYG').subtotalCents).toBe(125000)
  })

  it('counts items by quantity, not row count', () => {
    const items = [makeItem(3, 1000), makeItem(2, 2000)]
    expect(computeCartTotals(items, 'PYG').itemCount).toBe(5)
  })
})

describe('computeOrderTotal', () => {
  it('adds shipping + tax, subtracts discount', () => {
    expect(computeOrderTotal({ subtotalCents: 100000, shippingCents: 20000, taxCents: 0, discountCents: 10000 })).toBe(110000)
  })

  it('floors at zero', () => {
    expect(computeOrderTotal({ subtotalCents: 50000, shippingCents: 0, taxCents: 0, discountCents: 100000 })).toBe(0)
  })
})

describe('formatCents', () => {
  it('formats PYG without decimals', () => {
    expect(formatCents(150000)).toMatch(/Gs\s*150\.000|Gs\s*150,000/)
  })
})
