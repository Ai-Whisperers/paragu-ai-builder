import { describe, it, expect } from 'vitest'
import { rankProviders, NoEligibleProviderError } from '@/lib/payments/router'

describe('rankProviders', () => {
  it('PY/PYG → pagopar wins (basePriority 1)', () => {
    const ranked = rankProviders({ country: 'PY', currency: 'PYG' })
    expect(ranked[0]).toBe('pagopar')
  })

  it('respects preferred provider when eligible', () => {
    const ranked = rankProviders({ country: 'PY', currency: 'PYG', preferred: 'bancard' })
    expect(ranked[0]).toBe('bancard')
    expect(ranked).toContain('pagopar')
  })

  it('ignores preferred provider when not eligible (different country)', () => {
    const ranked = rankProviders({ country: 'BR', currency: 'BRL', preferred: 'pagopar' })
    expect(ranked[0]).toBe('dlocal')
    expect(ranked).not.toContain('pagopar')
  })

  it('BR/BRL → dlocal wins (only eligible)', () => {
    const ranked = rankProviders({ country: 'BR', currency: 'BRL' })
    expect(ranked).toEqual(['dlocal'])
  })

  it('throws NoEligibleProviderError for unsupported country', () => {
    expect(() => rankProviders({ country: 'JP', currency: 'JPY' })).toThrow(NoEligibleProviderError)
  })

  it('throws when currency mismatches even if country supported', () => {
    // PY supports PYG only; USD on PY → no eligible provider
    expect(() => rankProviders({ country: 'PY', currency: 'USD' })).toThrow(NoEligibleProviderError)
  })

  it('respects available filter (merchant has limited credentials)', () => {
    const ranked = rankProviders({ country: 'PY', currency: 'PYG', available: ['bancard'] })
    expect(ranked).toEqual(['bancard'])
  })

  it('returns empty-eligible-set throws even with available filter', () => {
    expect(() =>
      rankProviders({ country: 'PY', currency: 'PYG', available: ['dlocal'] }),
    ).toThrow(NoEligibleProviderError)
  })

  it('case-insensitive on country and currency', () => {
    const ranked = rankProviders({ country: 'py', currency: 'pyg' })
    expect(ranked[0]).toBe('pagopar')
  })
})
