import { describe, it, expect } from 'vitest'
import { formatPrice, formatPriceRange, defaultCurrencyForCountry } from '@/lib/currency'

describe('formatPrice', () => {
  it('passes through pre-formatted strings (legacy content stays working)', () => {
    expect(formatPrice('150.000 Gs')).toBe('150.000 Gs')
    expect(formatPrice('$35')).toBe('$35')
    expect(formatPrice('Consultar')).toBe('Consultar')
  })

  it('formats PYG as "<n> Gs" with period thousands separator', () => {
    expect(formatPrice(150000, { currency: 'PYG' })).toBe('150.000 Gs')
    expect(formatPrice(1200000, { currency: 'PYG' })).toBe('1.200.000 Gs')
    expect(formatPrice(45000, { currency: 'PYG' })).toBe('45.000 Gs')
  })

  it('formats USD with native symbol', () => {
    const result = formatPrice(35, { currency: 'USD', locale: 'en-US' })
    expect(result).toContain('$')
    expect(result).toContain('35')
  })

  it('formats EUR with native symbol', () => {
    const result = formatPrice(35, { currency: 'EUR', locale: 'nl-NL' })
    expect(result).toContain('€')
  })

  it('honours structured input with period suffix', () => {
    expect(formatPrice({ amount: 150000, currency: 'PYG', period: 'mes' })).toBe('150.000 Gs/mes')
    expect(formatPrice({ amount: 250000, currency: 'PYG', period: 'semana' })).toBe('250.000 Gs/semana')
  })

  it('returns empty for null/undefined/empty', () => {
    expect(formatPrice(null)).toBe('')
    expect(formatPrice(undefined)).toBe('')
    expect(formatPrice('')).toBe('')
  })

  it('defaults currency to PYG if omitted', () => {
    expect(formatPrice(150000)).toBe('150.000 Gs')
  })

  it('formatPriceRange formats both ends', () => {
    const r = formatPriceRange(100000, 200000, { currency: 'PYG' })
    expect(r).toContain('100.000 Gs')
    expect(r).toContain('200.000 Gs')
    expect(r).toContain('–')
  })
})

describe('defaultCurrencyForCountry', () => {
  it('maps Paraguay → PYG', () => {
    expect(defaultCurrencyForCountry('Paraguay')).toBe('PYG')
    expect(defaultCurrencyForCountry('PY')).toBe('PYG')
  })

  it('maps Uruguay → UYU', () => {
    expect(defaultCurrencyForCountry('Uruguay')).toBe('UYU')
  })

  it('maps Netherlands → EUR', () => {
    expect(defaultCurrencyForCountry('Netherlands')).toBe('EUR')
  })

  it('falls back to PYG for unknown country', () => {
    expect(defaultCurrencyForCountry(undefined)).toBe('PYG')
    expect(defaultCurrencyForCountry('Atlantis')).toBe('PYG')
  })
})
