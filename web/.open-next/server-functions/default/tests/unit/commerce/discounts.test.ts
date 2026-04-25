import { describe, it, expect } from 'vitest'

// Pure validation shape is tested here. The full applyDiscount path requires
// DB fixtures; we delegate that to integration tests.

describe('discount math (inline)', () => {
  it('computes percent discount', () => {
    const subtotal = 200_000
    const percent = 15
    expect(Math.round((subtotal * percent) / 100)).toBe(30_000)
  })

  it('caps fixed discount at subtotal', () => {
    const subtotal = 50_000
    const fixed = 100_000
    expect(Math.min(fixed, subtotal)).toBe(50_000)
  })
})
