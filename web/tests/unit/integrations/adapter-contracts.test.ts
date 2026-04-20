/**
 * Adapter contract tests.
 *
 * Every integration adapter must:
 *   1. Return a structured `{ ok: false, error: string }` on misconfiguration
 *      — never throw, never return `undefined`.
 *   2. Return a structured `{ ok: false, error: string }` on upstream 4xx/5xx.
 *   3. Swallow transport errors into the same structured shape.
 *
 * These tests stub `globalThis.fetch` to simulate each failure mode.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { hubspotAdapter } from '@/lib/integrations/crm/hubspot'
import { notionAdapter } from '@/lib/integrations/crm/notion'
import { pipedriveAdapter } from '@/lib/integrations/crm/pipedrive'
import { mailchimpAdapter } from '@/lib/integrations/email/mailchimp'
import { resendAdapter } from '@/lib/integrations/email/resend'
import type { Lead } from '@/lib/integrations/types'

const baseLead: Lead = {
  siteSlug: 'nexa-paraguay',
  locale: 'es',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+595981234567',
  country: 'AR',
  programInterest: 'visa',
  source: 'hero',
  createdAt: new Date('2026-04-18').toISOString(),
}

function mockFetch(impl: (url: string, init?: RequestInit) => Promise<Response>): void {
  // @ts-expect-error — assigning a test stub
  globalThis.fetch = vi.fn(impl)
}

function okJson(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

function errJson(status: number, body: string): Response {
  return new Response(body, { status })
}

describe('adapter contracts — misconfiguration', () => {
  it('hubspot: missing portalId returns structured error', async () => {
    const r = await hubspotAdapter.submit(baseLead, {})
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/portalId/i)
  })

  it('notion: missing apiKey returns structured error', async () => {
    const r = await notionAdapter.submit(baseLead, {})
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/apiKey/i)
  })

  it('pipedrive: missing apiKey returns structured error', async () => {
    const r = await pipedriveAdapter.submit(baseLead, {})
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/apiKey/i)
  })

  it('mailchimp: missing listId returns structured error', async () => {
    const r = await mailchimpAdapter.subscribe(baseLead, { apiKey: 'xxx-us1' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/listId/i)
  })

  it('resend: missing fromAddress returns structured error', async () => {
    const r = await resendAdapter.subscribe(baseLead, { transactionalApiKey: 'xxx' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/fromAddress|not configured/i)
  })
})

describe('adapter contracts — upstream 4xx/5xx', () => {
  const origFetch = globalThis.fetch
  afterEach(() => {
    globalThis.fetch = origFetch
  })

  it('hubspot: surfaces HTTP status in error', async () => {
    mockFetch(async () => errJson(400, 'bad request'))
    const r = await hubspotAdapter.submit(baseLead, { portalId: 'p', endpoint: 'e' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/400/)
  })

  it('notion: surfaces HTTP status in error', async () => {
    mockFetch(async () => errJson(401, 'unauthorized'))
    const r = await notionAdapter.submit(baseLead, { apiKey: 'k', endpoint: 'db' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/401/)
  })

  it('pipedrive: surfaces HTTP error on person create', async () => {
    mockFetch(async () => errJson(500, JSON.stringify({ error: 'boom' })))
    const r = await pipedriveAdapter.submit(baseLead, { apiKey: 'k' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/person/)
  })

  it('mailchimp: surfaces HTTP status', async () => {
    mockFetch(async () => errJson(403, 'forbidden'))
    const r = await mailchimpAdapter.subscribe(baseLead, { apiKey: 'xxx-us1', listId: 'abc' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/403/)
  })

  it('resend: surfaces HTTP status', async () => {
    mockFetch(async () => errJson(422, 'invalid'))
    const r = await resendAdapter.subscribe(baseLead, {
      transactionalApiKey: 'k',
      fromAddress: 'hi@nexa.com',
    })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/422/)
  })
})

describe('adapter contracts — network failure', () => {
  const origFetch = globalThis.fetch
  afterEach(() => {
    globalThis.fetch = origFetch
  })

  it('hubspot: transport error becomes structured error', async () => {
    mockFetch(async () => {
      throw new Error('ECONNRESET')
    })
    const r = await hubspotAdapter.submit(baseLead, { portalId: 'p', endpoint: 'e' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/ECONNRESET/)
  })

  it('mailchimp: transport error becomes structured error', async () => {
    mockFetch(async () => {
      throw new Error('timeout')
    })
    const r = await mailchimpAdapter.subscribe(baseLead, { apiKey: 'xxx-us1', listId: 'abc' })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/timeout/)
  })

  it('resend: transport error becomes structured error', async () => {
    mockFetch(async () => {
      throw new Error('fetch failed')
    })
    const r = await resendAdapter.subscribe(baseLead, {
      transactionalApiKey: 'k',
      fromAddress: 'hi@nexa.com',
    })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/fetch failed/)
  })
})

describe('adapter contracts — happy path', () => {
  const origFetch = globalThis.fetch
  afterEach(() => {
    globalThis.fetch = origFetch
  })

  it('hubspot: 2xx returns ok', async () => {
    mockFetch(async () => okJson({}))
    const r = await hubspotAdapter.submit(baseLead, { portalId: 'p', endpoint: 'e' })
    expect(r.ok).toBe(true)
  })

  it('notion: 2xx returns ok + externalId', async () => {
    mockFetch(async () => okJson({ id: 'notion-abc' }))
    const r = await notionAdapter.submit(baseLead, { apiKey: 'k', endpoint: 'db' })
    expect(r.ok).toBe(true)
    expect(r.externalId).toBe('notion-abc')
  })

  it('mailchimp: 2xx returns ok', async () => {
    mockFetch(async () => okJson({}))
    const r = await mailchimpAdapter.subscribe(baseLead, { apiKey: 'xxx-us1', listId: 'abc' })
    expect(r.ok).toBe(true)
  })

  it('resend: 2xx returns ok + externalId', async () => {
    mockFetch(async () => okJson({ id: 'resend-xyz' }))
    const r = await resendAdapter.subscribe(baseLead, {
      transactionalApiKey: 'k',
      fromAddress: 'hi@nexa.com',
    })
    expect(r.ok).toBe(true)
    expect(r.externalId).toBe('resend-xyz')
  })
})
