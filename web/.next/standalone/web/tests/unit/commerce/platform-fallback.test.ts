import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { platformFallbackProviders } from '@/lib/commerce/payment-credentials'

const ORIGINAL_ENV = { ...process.env }

function resetEnv() {
  delete process.env.PAGOPAR_PUBLIC_TOKEN
  delete process.env.PAGOPAR_PRIVATE_TOKEN
  delete process.env.BANCARD_PUBLIC_KEY
  delete process.env.BANCARD_PRIVATE_KEY
}

describe('platformFallbackProviders', () => {
  beforeEach(() => {
    resetEnv()
  })

  afterAll(() => {
    resetEnv()
    Object.assign(process.env, ORIGINAL_ENV)
  })

  it('returns an empty list when no env vars are set', () => {
    expect(platformFallbackProviders()).toEqual([])
  })

  it('includes pagopar when both PAGOPAR_PUBLIC_TOKEN and PAGOPAR_PRIVATE_TOKEN are set', () => {
    process.env.PAGOPAR_PUBLIC_TOKEN = 'p_xxx'
    process.env.PAGOPAR_PRIVATE_TOKEN = 's_xxx'
    expect(platformFallbackProviders()).toEqual(['pagopar'])
  })

  it('excludes pagopar when only ONE token is set (half-configured is not available)', () => {
    process.env.PAGOPAR_PUBLIC_TOKEN = 'p_xxx'
    // no PAGOPAR_PRIVATE_TOKEN
    expect(platformFallbackProviders()).toEqual([])
  })

  it('includes bancard when both BANCARD_PUBLIC_KEY and BANCARD_PRIVATE_KEY are set', () => {
    process.env.BANCARD_PUBLIC_KEY = 'PK_xxx'
    process.env.BANCARD_PRIVATE_KEY = 'SK_xxx'
    expect(platformFallbackProviders()).toEqual(['bancard'])
  })

  it('returns both providers when platform has both configured', () => {
    process.env.PAGOPAR_PUBLIC_TOKEN = 'p_xxx'
    process.env.PAGOPAR_PRIVATE_TOKEN = 's_xxx'
    process.env.BANCARD_PUBLIC_KEY = 'PK_xxx'
    process.env.BANCARD_PRIVATE_KEY = 'SK_xxx'
    const providers = platformFallbackProviders()
    expect(providers).toContain('pagopar')
    expect(providers).toContain('bancard')
    expect(providers).toHaveLength(2)
  })

  it('preserves a stable order (pagopar before bancard) so basePriority tie-breaking is deterministic', () => {
    process.env.BANCARD_PUBLIC_KEY = 'PK_xxx'
    process.env.BANCARD_PRIVATE_KEY = 'SK_xxx'
    process.env.PAGOPAR_PUBLIC_TOKEN = 'p_xxx'
    process.env.PAGOPAR_PRIVATE_TOKEN = 's_xxx'
    expect(platformFallbackProviders()).toEqual(['pagopar', 'bancard'])
  })
})
