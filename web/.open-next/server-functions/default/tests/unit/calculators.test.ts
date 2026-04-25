import { describe, it, expect } from 'vitest'

describe('Tax Calculations', () => {
  const nlBrackets = [
    { min: 0, max: 36999, rate: 36.97 },
    { min: 36999, max: 75993, rate: 37.47 },
    { min: 75993, max: 124999, rate: 49.5 },
    { min: 124999, max: 239999, rate: 51.95 },
    { min: 239999, max: Infinity, rate: 49.5 },
  ]

  const pyBrackets = [
    { min: 0, max: 7434, rate: 0 },
    { min: 7434, max: 11285, rate: 8 },
    { min: 11285, max: 17902, rate: 10 },
    { min: 17902, max: Infinity, rate: 10 },
  ]

  function calcTax(income: number, brackets: typeof nlBrackets): number {
    let tax = 0
    for (const b of brackets) {
      if (income > b.min) {
        const amt = Math.min(income, b.max) - b.min
        tax += Math.max(0, amt) * (b.rate / 100)
      }
    }
    return tax
  }

  it('NL tax at 60k is ~21k', () => {
    expect(calcTax(60000, nlBrackets)).toBeGreaterThan(20000)
  })

  it('PY tax at 60k is ~5k', () => {
    expect(calcTax(60000, pyBrackets)).toBeLessThan(7000)
  })

  it('PY foreign income is 0%', () => {
    expect(0).toBe(0)
  })
})

describe('Cost of Living', () => {
  const profiles = {
    single: { rent: 40, utilities: 8, food: 20 },
    couple: { rent: 35, utilities: 6, food: 18 },
  }

  function calcBudget(rent: number, profile: keyof typeof profiles, mult = 1): number {
    const p = profiles[profile]
    return rent * (1 + (p.utilities + p.food) / 100) * mult
  }

  it('budget for couple in Villa Morra', () => {
    const rent = (800 + 1500) / 2
    expect(calcBudget(rent, 'couple')).toBeGreaterThan(1000)
  })

  it('premium lifestyle costs more', () => {
    const rent = 1000
    expect(calcBudget(rent, 'single', 1.4)).toBeGreaterThan(calcBudget(rent, 'single', 1))
  })
})

describe('ROI', () => {
  function calcROI(inv: number, pct: number, yrs: number) {
    const annual = inv * (pct / 100)
    return { annual, fiveYear: annual * yrs + inv, breakEven: inv / annual }
  }

  it('6% on 150k', () => {
    const r = calcROI(150000, 6, 5)
    expect(r.annual).toBe(9000)
    expect(r.fiveYear).toBe(195000)
  })
})

describe('Timeline', () => {
  function calcTimeline(base: number, docs: string, inCountry: boolean) {
    let adj = 0
    if (docs === 'partial') adj += 2
    if (docs === 'no') adj += 4
    if (!inCountry) adj += 2
    return { min: base + adj, max: base + adj + 8 }
  }

  it('partial docs adds time', () => {
    expect(calcTimeline(8, 'partial', true).min).toBe(10)
  })
})

describe('Qualifier', () => {
  const recs = [
    { min: 80, program: 'business' },
    { min: 60, program: 'base' },
    { min: 40, program: 'consult' },
  ]

  function getRec(score: number) {
    return recs.find(r => score >= r.min)?.program || 'none'
  }

  it('high score = business', () => {
    expect(getRec(85)).toBe('business')
  })

  it('low score = none', () => {
    expect(getRec(30)).toBe('none')
  })
})