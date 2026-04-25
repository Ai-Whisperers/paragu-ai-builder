import { describe, it, expect } from 'vitest'
import { enrichLead } from '@/lib/leads/enrich'

function makeReq(headers: Record<string, string>): Request {
  return new Request('https://example.test/api/leads', {
    method: 'POST',
    headers,
  })
}

describe('enrichLead', () => {
  it('extracts Cloudflare country code uppercase', () => {
    const r = enrichLead(makeReq({ 'cf-ipcountry': 'py' }))
    expect(r.ipCountry).toBe('PY')
  })

  it('falls back to vercel country header', () => {
    const r = enrichLead(makeReq({ 'x-vercel-ip-country': 'DE' }))
    expect(r.ipCountry).toBe('DE')
  })

  it('detects chrome browser', () => {
    const r = enrichLead(makeReq({ 'user-agent': 'Mozilla/5.0 Chrome/120.0' }))
    expect(r.userAgentBrowser).toBe('chrome')
  })

  it('detects safari browser', () => {
    const r = enrichLead(makeReq({ 'user-agent': 'Mozilla/5.0 Safari/600.0' }))
    expect(r.userAgentBrowser).toBe('safari')
  })

  it('detects edge before chrome', () => {
    const r = enrichLead(makeReq({ 'user-agent': 'Mozilla/5.0 Chrome/120 Edg/120' }))
    expect(r.userAgentBrowser).toBe('edge')
  })

  it('detects mobile device', () => {
    const r = enrichLead(makeReq({ 'user-agent': 'Mozilla/5.0 iPhone Mobile' }))
    expect(r.userAgentDevice).toBe('mobile')
  })

  it('extracts referrer domain, strips path', () => {
    const r = enrichLead(makeReq({ referer: 'https://google.com/search?q=py' }))
    expect(r.referrerDomain).toBe('google.com')
  })

  it('returns undefined for missing headers', () => {
    const r = enrichLead(makeReq({}))
    expect(r.ipCountry).toBeUndefined()
    expect(r.userAgentBrowser).toBeUndefined()
    expect(r.referrerDomain).toBeUndefined()
  })

  it('always sets enrichedAt timestamp', () => {
    const r = enrichLead(makeReq({}))
    expect(r.enrichedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
