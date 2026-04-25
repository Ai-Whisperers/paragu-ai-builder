import { describe, it, expect } from 'vitest'
import { sanitizeContext, sanitizeMessage } from '@/lib/obs/redact'

describe('sanitizeContext', () => {
  it('returns undefined for undefined input', () => {
    expect(sanitizeContext(undefined)).toBeUndefined()
  })

  it('passes safe known keys through unchanged', () => {
    const out = sanitizeContext({
      'trace.id': 'abc-123',
      'labels.business_id': 'biz-1',
      'http.method': 'POST',
      'http.status': 201,
      duration: 42,
    })
    expect(out).toEqual({
      'trace.id': 'abc-123',
      'labels.business_id': 'biz-1',
      'http.method': 'POST',
      'http.status': 201,
      duration: 42,
    })
  })

  it('masks keys that match sensitive patterns', () => {
    const out = sanitizeContext({
      password: 'hunter2',
      apiKey: 'sk_live_abc',
      accessToken: 'xyz',
      SUPABASE_SERVICE_ROLE_KEY: 'srk',
      'http.method': 'GET',
    })
    expect(out!.password).toBe('[redacted]')
    expect(out!.apiKey).toBe('[redacted]')
    expect(out!.accessToken).toBe('[redacted]')
    expect(out!.SUPABASE_SERVICE_ROLE_KEY).toBe('[redacted]')
    expect(out!['http.method']).toBe('GET')
  })

  it('scrubs email addresses from free-form string values', () => {
    const out = sanitizeContext({
      note: 'Contact ada@example.com for details',
    }) as { note: string }
    expect(out.note).not.toContain('ada@example.com')
    expect(out.note).toContain('[redacted:email]')
  })

  it('scrubs JWTs and bearer tokens from string values', () => {
    const out = sanitizeContext({
      header: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.AbCdEfGhIjKlMnOpQrStUvWxYz',
      raw: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.AbCdEfGhIjKlMnOpQrStUvWxYz',
    }) as { header: string; raw: string }
    // The token body is scrubbed by either the JWT pattern (preferred, since
    // it runs first) or the Bearer pattern.
    expect(out.header).toMatch(/\[redacted:(token|bearer)\]/)
    expect(out.header).not.toContain('eyJhbG')
    expect(out.raw).toContain('[redacted:token]')
  })

  it('truncates strings longer than 1KB', () => {
    const long = 'x'.repeat(2000)
    const out = sanitizeContext({ note: long }) as { note: string }
    expect(out.note.length).toBeLessThan(2000)
    expect(out.note).toContain('…')
  })

  it('caps array length and recurses into elements', () => {
    const arr = Array.from({ length: 60 }, (_, i) => `value-${i}`)
    const out = sanitizeContext({ items: arr }) as { items: unknown[] }
    expect(out.items.length).toBe(51) // 50 + 1 "+10 more" marker
    expect(out.items[50]).toContain('+10 more')
  })

  it('scrubs nested object values', () => {
    const out = sanitizeContext({
      detail: {
        inner: { email: 'ada@example.com' },
        password: 'hunter2',
      },
    }) as { detail: { inner: { email: string }; password: string } }
    expect(out.detail.password).toBe('[redacted]')
    // email is a sensitive substring pattern at the key path `detail.inner.email`
    // but since 'email' isn't in SENSITIVE_KEY_PATTERNS, the string value gets
    // pattern-scrubbed instead.
    expect(out.detail.inner.email).toBe('[redacted:email]')
  })

  it('serializes Error instances safely', () => {
    const err = new Error('something failed at ada@example.com')
    const out = sanitizeContext({ cause: err }) as { cause: { name: string; message: string } }
    expect(out.cause.name).toBe('Error')
    expect(out.cause.message).toContain('[redacted:email]')
  })
})

describe('sanitizeMessage', () => {
  it('scrubs PII from the message body', () => {
    expect(sanitizeMessage('User ada@example.com signed in')).toContain('[redacted:email]')
  })

  it('truncates long messages', () => {
    const long = 'x'.repeat(2000)
    expect(sanitizeMessage(long).length).toBeLessThan(2000)
  })
})
