/**
 * Tests for /api/whatsapp-webhook. Closes part of BUG_HUNT_500 #476.
 *
 * Coverage:
 *   - GET 200 + challenge echo when verify-token matches
 *   - GET 403 when verify-token mismatches
 *   - POST 401 when WHATSAPP_APP_SECRET unset (fail-closed)
 *   - POST 401 when x-hub-signature-256 missing
 *   - POST 401 when signature mismatches
 *   - POST 200 + lead inserted on valid HMAC + valid payload
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHmac } from 'crypto'

const mockInsert = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: () => ({ insert: (row: unknown) => mockInsert(row) }),
  })),
}))

const ORIGINAL_ENV = { ...process.env }

function signedRequest(rawBody: string, secret: string) {
  const sig = createHmac('sha256', secret).update(rawBody).digest('hex')
  return new Request('http://localhost/api/whatsapp-webhook', {
    method: 'POST',
    headers: { 'x-hub-signature-256': `sha256=${sig}` },
    body: rawBody,
  })
}

describe('/api/whatsapp-webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...ORIGINAL_ENV,
      WHATSAPP_VERIFY_TOKEN: 'verify-me',
      WHATSAPP_APP_SECRET: 'shared-secret',
    }
    mockInsert.mockReset()
    mockInsert.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  describe('GET (verify-token challenge)', () => {
    it('returns 200 + the challenge when token matches', async () => {
      const { GET } = await import('@/app/api/whatsapp-webhook/route')
      const req = new Request(
        'http://localhost/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=42',
        { method: 'GET' },
      )
      const res = await GET(req as never)
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('42')
    })

    it('returns 403 when token mismatches', async () => {
      const { GET } = await import('@/app/api/whatsapp-webhook/route')
      const req = new Request(
        'http://localhost/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=42',
        { method: 'GET' },
      )
      const res = await GET(req as never)
      expect(res.status).toBe(403)
    })
  })

  describe('POST (signed inbound)', () => {
    it('returns 401 when WHATSAPP_APP_SECRET is unset (fail closed)', async () => {
      delete process.env.WHATSAPP_APP_SECRET
      const { POST } = await import('@/app/api/whatsapp-webhook/route')
      const req = new Request('http://localhost/api/whatsapp-webhook', {
        method: 'POST',
        body: '{}',
      })
      const res = await POST(req as never)
      expect(res.status).toBe(401)
    })

    it('returns 401 when x-hub-signature-256 missing', async () => {
      const { POST } = await import('@/app/api/whatsapp-webhook/route')
      const req = new Request('http://localhost/api/whatsapp-webhook', {
        method: 'POST',
        body: '{}',
      })
      const res = await POST(req as never)
      expect(res.status).toBe(401)
    })

    it('returns 401 when signature mismatches', async () => {
      const { POST } = await import('@/app/api/whatsapp-webhook/route')
      const req = new Request('http://localhost/api/whatsapp-webhook', {
        method: 'POST',
        headers: { 'x-hub-signature-256': 'sha256=deadbeef' },
        body: '{}',
      })
      const res = await POST(req as never)
      expect(res.status).toBe(401)
    })

    it('returns 200 + inserts lead on valid HMAC + valid payload', async () => {
      const { POST } = await import('@/app/api/whatsapp-webhook/route')
      const payload = JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                value: {
                  metadata: { phone_number_id: '595981000000' },
                  contacts: [{ profile: { name: 'Maria' }, wa_id: '595987111222' }],
                  messages: [
                    { from: '595987111222', type: 'text', text: { body: 'Hola, info?' } },
                  ],
                },
              },
            ],
          },
        ],
      })
      const req = signedRequest(payload, 'shared-secret')
      const res = await POST(req as never)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.ok).toBe(true)
      expect(body.inserted).toBe(1)
      expect(mockInsert).toHaveBeenCalledTimes(1)
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Maria',
          phone: '595987111222',
          source: 'whatsapp',
          referer: 'Hola, info?',
        }),
      )
    })
  })
})
