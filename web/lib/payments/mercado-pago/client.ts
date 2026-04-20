const MP_BASE_URL = 'https://api.mercadopago.com'

export function getMpAccessToken(): string {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) throw new Error('MP_ACCESS_TOKEN is not set')
  return token
}

export function getMpWebhookSecret(): string {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) throw new Error('MP_WEBHOOK_SECRET is not set')
  return secret
}

export async function mpFetch<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${getMpAccessToken()}`)
  headers.set('Content-Type', 'application/json')
  if (init.idempotencyKey) headers.set('X-Idempotency-Key', init.idempotencyKey)

  const response = await fetch(`${MP_BASE_URL}${path}`, { ...init, headers })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`mp_api_error:${response.status}:${text.slice(0, 500)}`)
  }
  return (text ? JSON.parse(text) : {}) as T
}
