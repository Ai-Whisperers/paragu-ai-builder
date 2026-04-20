import { describe, it, expect } from 'vitest'
import { parsePygPrice, formatPyg } from '@/lib/commerce/price-parser'

describe('parsePygPrice', () => {
  it('accepts plain integer', () => {
    expect(parsePygPrice('150000')).toBe(150000)
  })

  it('accepts dot-thousands', () => {
    expect(parsePygPrice('150.000')).toBe(150000)
  })

  it('accepts comma-thousands', () => {
    expect(parsePygPrice('150,000')).toBe(150000)
  })

  it('strips "Gs" prefix', () => {
    expect(parsePygPrice('Gs 250.000')).toBe(250000)
  })

  it('rejects invalid input', () => {
    expect(() => parsePygPrice('abc')).toThrow()
    expect(() => parsePygPrice('')).toThrow()
  })

  it('passes through numbers', () => {
    expect(parsePygPrice(300000)).toBe(300000)
  })
})

describe('formatPyg', () => {
  it('formats with thousands separator', () => {
    expect(formatPyg(150000)).toMatch(/Gs\s*150[.,]000/)
  })
})
