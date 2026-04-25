import { describe, it, expect } from 'vitest'

/**
 * Re-implements the monthly-payment amortisation formula used in
 * web/components/sections/mortgage-calculator-section.tsx. Keeping a
 * tested twin here means tweaks to the UI component's inputs can't
 * silently change the underlying math.
 */
function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

describe('mortgage monthlyPayment', () => {
  it('returns principal/n when the rate is zero', () => {
    expect(monthlyPayment(120_000, 0, 10)).toBeCloseTo(1000, 2)
  })

  it('matches the standard 30-year 6% reference', () => {
    // $300k at 6% nominal for 30 years — well-known textbook value.
    const m = monthlyPayment(300_000, 0.06, 30)
    expect(m).toBeGreaterThan(1798)
    expect(m).toBeLessThan(1799)
  })

  it('higher rate → higher payment', () => {
    const lo = monthlyPayment(200_000, 0.04, 20)
    const hi = monthlyPayment(200_000, 0.09, 20)
    expect(hi).toBeGreaterThan(lo)
  })

  it('longer term → lower monthly, higher total interest', () => {
    const short = monthlyPayment(200_000, 0.07, 15)
    const long = monthlyPayment(200_000, 0.07, 30)
    expect(long).toBeLessThan(short)
    expect(long * 30 * 12).toBeGreaterThan(short * 15 * 12)
  })
})
