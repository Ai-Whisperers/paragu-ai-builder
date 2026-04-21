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

  it('PY/PYG with available=[pagopar, bancard] → both ranked, pagopar first', () => {
    // Simulates a tenant with both platform-fallback providers available.
    // This is the default state after availableProvidersForCheckout runs
    // and the platform env has both sets of tokens.
    const ranked = rankProviders({
      country: 'PY',
      currency: 'PYG',
      available: ['pagopar', 'bancard'],
    })
    expect(ranked).toEqual(['pagopar', 'bancard'])
  })

  it('PY/PYG with available=[pagopar, bancard] and preferred=bancard → bancard first but pagopar still offered', () => {
    // Tenant configures site.json integrations.payments.provider="bancard"
    // but platform Pagopar env is also set; both should end up in the
    // ranked list so failover can retry across providers.
    const ranked = rankProviders({
      country: 'PY',
      currency: 'PYG',
      preferred: 'bancard',
      available: ['pagopar', 'bancard'],
    })
    expect(ranked[0]).toBe('bancard')
    expect(ranked).toContain('pagopar')
    expect(ranked).toHaveLength(2)
  })
})
