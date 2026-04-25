import { describe, it, expect } from 'vitest'
import { createHash } from 'crypto'
import { signPagopar } from '@/lib/payments/pagopar/client'

describe('signPagopar', () => {
  const PRIVATE_KEY = 'test_private_token_xyz'

  it('matches sha1(privateKey + identifier)', () => {
    const identifier = 'PRG-2026-000001150000'
    const expected = createHash('sha1').update(PRIVATE_KEY + identifier).digest('hex')
    expect(signPagopar(PRIVATE_KEY, identifier)).toBe(expected)
  })

  it('produces a 40-char hex string', () => {
    const sig = signPagopar(PRIVATE_KEY, 'whatever')
    expect(sig).toMatch(/^[a-f0-9]{40}$/)
  })

  it('is deterministic', () => {
    const a = signPagopar(PRIVATE_KEY, 'order-1')
    const b = signPagopar(PRIVATE_KEY, 'order-1')
    expect(a).toBe(b)
  })

  it('produces different output for different private keys', () => {
    const a = signPagopar('key-a', 'order-1')
    const b = signPagopar('key-b', 'order-1')
    expect(a).not.toBe(b)
  })

  it('produces different output for different identifiers', () => {
    const a = signPagopar(PRIVATE_KEY, 'order-1')
    const b = signPagopar(PRIVATE_KEY, 'order-2')
    expect(a).not.toBe(b)
  })
})
