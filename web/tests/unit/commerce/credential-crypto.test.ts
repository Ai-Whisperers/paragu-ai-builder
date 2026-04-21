import { describe, it, expect, beforeAll } from 'vitest'
import { encryptSecrets, decryptSecrets, preview } from '@/lib/commerce/credential-crypto'

beforeAll(() => {
  // 64 hex chars = 32 bytes for AES-256
  process.env.COMMERCE_CREDENTIALS_KEY = 'a'.repeat(64)
})

describe('encryptSecrets / decryptSecrets', () => {
  it('round-trips a single field', () => {
    const enc = encryptSecrets({ token: 'super-secret' })
    expect(enc.fields.token).toHaveProperty('iv')
    expect(enc.fields.token).toHaveProperty('ct')
    expect(enc.fields.token).toHaveProperty('tag')
    expect(enc.fields.token.ct).not.toBe('super-secret')

    const dec = decryptSecrets(enc)
    expect(dec.token).toBe('super-secret')
  })

  it('round-trips multiple fields independently', () => {
    const enc = encryptSecrets({ public: 'p_abc', private: 's_xyz', other: 'meh' })
    const dec = decryptSecrets(enc)
    expect(dec).toEqual({ public: 'p_abc', private: 's_xyz', other: 'meh' })
  })

  it('produces different ciphertext on each encryption (random IV)', () => {
    const a = encryptSecrets({ k: 'value' }).fields.k.ct
    const b = encryptSecrets({ k: 'value' }).fields.k.ct
    expect(a).not.toBe(b)
  })

  it('throws on tampered ciphertext', () => {
    const enc = encryptSecrets({ k: 'value' })
    enc.fields.k.ct = enc.fields.k.ct.replace(/^./, '0')
    expect(() => decryptSecrets(enc)).toThrow()
  })

  it('throws on tampered auth tag', () => {
    const enc = encryptSecrets({ k: 'value' })
    enc.fields.k.tag = enc.fields.k.tag.replace(/^./, '0')
    expect(() => decryptSecrets(enc)).toThrow()
  })

  it('throws if COMMERCE_CREDENTIALS_KEY is missing', () => {
    const orig = process.env.COMMERCE_CREDENTIALS_KEY
    delete process.env.COMMERCE_CREDENTIALS_KEY
    expect(() => encryptSecrets({ k: 'v' })).toThrow(/COMMERCE_CREDENTIALS_KEY/)
    process.env.COMMERCE_CREDENTIALS_KEY = orig
  })

  it('throws if key is wrong length', () => {
    const orig = process.env.COMMERCE_CREDENTIALS_KEY
    process.env.COMMERCE_CREDENTIALS_KEY = 'short'
    expect(() => encryptSecrets({ k: 'v' })).toThrow(/64 hex chars/)
    process.env.COMMERCE_CREDENTIALS_KEY = orig
  })
})

describe('preview', () => {
  it('shows last 4 chars', () => {
    expect(preview('sk_live_abcdef1234')).toBe('•••• 1234')
  })

  it('full bullets for short or missing values', () => {
    expect(preview(undefined)).toBe('••••')
    expect(preview('abc')).toBe('••••')
  })
})
