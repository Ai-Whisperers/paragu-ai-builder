import { describe, it, expect } from 'vitest'
import { correlationFromRequest, generateTraceId, toTraceparent } from '@/lib/obs/request-id'

function req(headers: Record<string, string> = {}, url = 'https://example.com/x'): Request {
  return new Request(url, { headers })
}

describe('correlationFromRequest', () => {
  it('generates a fresh UUID when no correlation header is present', () => {
    const c = correlationFromRequest(req())
    expect(c.source).toBe('generated')
    expect(c.traceId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    expect(c.spanId).toBeUndefined()
  })

  it('honours an upstream x-request-id', () => {
    const c = correlationFromRequest(req({ 'x-request-id': 'upstream-abc' }))
    expect(c.source).toBe('x-request-id')
    expect(c.traceId).toBe('upstream-abc')
  })

  it('honours x-correlation-id when x-request-id is absent', () => {
    const c = correlationFromRequest(req({ 'x-correlation-id': 'corr-123' }))
    expect(c.source).toBe('x-correlation-id')
    expect(c.traceId).toBe('corr-123')
  })

  it('parses W3C traceparent and extracts trace + parent span', () => {
    const c = correlationFromRequest(
      req({ traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01' }),
    )
    expect(c.source).toBe('traceparent')
    expect(c.traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736')
    expect(c.spanId).toBe('00f067aa0ba902b7')
  })

  it('rejects malformed x-request-id values and falls back to generate', () => {
    const c = correlationFromRequest(req({ 'x-request-id': '<script>alert(1)</script>' }))
    expect(c.source).toBe('generated')
  })

  it('rejects absurdly long x-request-id values', () => {
    const huge = 'a'.repeat(500)
    const c = correlationFromRequest(req({ 'x-request-id': huge }))
    expect(c.source).toBe('generated')
  })

  it('falls back to generate when traceparent is malformed', () => {
    const c = correlationFromRequest(req({ traceparent: 'not-valid' }))
    expect(c.source).toBe('generated')
  })
})

describe('generateTraceId', () => {
  it('returns a 36-char UUID string', () => {
    const id = generateTraceId()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })
})

describe('toTraceparent', () => {
  it('builds a well-formed W3C traceparent', () => {
    const tp = toTraceparent('4bf92f3577b34da6a3ce929d0e0e4736', '00f067aa0ba902b7')
    expect(tp).toBe('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01')
  })

  it('pads short trace/span ids to the expected length', () => {
    const tp = toTraceparent('abc', 'def')
    // 32 hex trace, 16 hex span
    const parts = tp.split('-')
    expect(parts).toHaveLength(4)
    expect(parts[1].length).toBe(32)
    expect(parts[2].length).toBe(16)
  })
})
