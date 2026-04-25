import { createHash } from 'crypto'

/**
 * Bancard vPOS 2.0 HTTP client + MD5 token helpers.
 *
 * Docs references:
 *   - Integración con eCommerce Bancard Compra Simple v0.3.1 (PDF, AFD)
 *   - https://github.com/Bancard/bancard-connectors
 *   - https://github.com/Bancard/bancard-checkout-js (iframe lib)
 *
 * Auth model:
 *   - Merchant has `public_key` + `private_key` from the Comercios portal.
 *   - Each operation generates an MD5 token from a different template
 *     (documented per-operation in the PDF). The token is passed in the
 *     body; the public_key in the URL path or body.
 *   - No shared session / JWT; token regenerated per request.
 *
 * Environments:
 *   - Staging:    https://vpos.infonet.com.py:8888
 *   - Production: https://vpos.infonet.com.py
 *
 * All amounts are sent as strings with exactly 2 decimal places
 * (e.g., "10000.00"), even for PYG which has no fractional unit.
 * Bancard rejects integers.
 */

const BANCARD_STAGING_BASE = 'https://vpos.infonet.com.py:8888'
const BANCARD_PRODUCTION_BASE = 'https://vpos.infonet.com.py'

export interface BancardCredentials {
  publicKey: string
  privateKey: string
  environment: 'sandbox' | 'production'
}

/**
 * Read credentials from env. Per-tenant override via the admin credential
 * manager is wired separately at the adapter level — this helper returns
 * the platform fallback used when a merchant has not installed their own.
 */
export function getBancardCredentials(): BancardCredentials {
  const publicKey = process.env.BANCARD_PUBLIC_KEY
  const privateKey = process.env.BANCARD_PRIVATE_KEY
  if (!publicKey || !privateKey) {
    throw new Error('BANCARD_PUBLIC_KEY and BANCARD_PRIVATE_KEY are not set')
  }
  const rawEnv = (process.env.BANCARD_ENVIRONMENT ?? 'sandbox').toLowerCase()
  const environment = rawEnv === 'production' ? 'production' : 'sandbox'
  return { publicKey, privateKey, environment }
}

export function bancardBaseUrl(env: BancardCredentials['environment']): string {
  return env === 'production' ? BANCARD_PRODUCTION_BASE : BANCARD_STAGING_BASE
}

/**
 * Format an integer cents amount as Bancard's expected "N.DD" string.
 *
 * Bancard treats PYG as a 2-decimal currency internally: the shopper
 * sees "Gs 10.000" but the API expects "10000.00". Our storage is
 * integer cents (following ISO 4217 subunit rules), so we pass through
 * without scaling.
 */
export function formatBancardAmount(amountCents: number, currency: string): string {
  // PYG has no real subunit — our "cents" is actually whole guaraníes.
  // Other currencies on paragu-ai-builder aren't live for Bancard yet,
  // but when they come online this block needs to divide by 100.
  if (currency === 'PYG') {
    return `${amountCents}.00`
  }
  const integer = Math.floor(amountCents / 100)
  const fraction = amountCents % 100
  return `${integer}.${String(fraction).padStart(2, '0')}`
}

/**
 * MD5 token generator.
 *
 * Each Bancard operation specifies its own concatenation template.
 * Separating it from the operation code keeps the hash inputs auditable.
 */
export function md5Token(parts: Array<string | number>): string {
  return createHash('md5').update(parts.join('')).digest('hex')
}

/**
 * Token templates per operation, per the vPOS 2.0 docs.
 *
 * Order of concatenation matters — changing it invalidates the token
 * and Bancard rejects the request with a generic "invalid token" error.
 */
export function singleBuyToken(privateKey: string, shopProcessId: number | string, amount: string, currency: string): string {
  return md5Token([privateKey, shopProcessId, amount, currency])
}

export function confirmationToken(privateKey: string, shopProcessId: number | string): string {
  return md5Token([privateKey, shopProcessId, 'get_confirmation'])
}

export function rollbackToken(privateKey: string, shopProcessId: number | string): string {
  return md5Token([privateKey, shopProcessId, 'rollback', '0.00'])
}

export function refundToken(privateKey: string, shopProcessId: number | string, amount: string): string {
  return md5Token([privateKey, shopProcessId, 'refund', amount])
}

export interface BancardApiResponse<T = Record<string, unknown>> {
  status: 'success' | 'error'
  confirmation?: T
  messages?: Array<{ level: string; key: string; dsc: string }>
}

export async function bancardFetch<T = Record<string, unknown>>(
  env: BancardCredentials['environment'],
  path: string,
  init: RequestInit = {},
): Promise<BancardApiResponse<T>> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  const response = await fetch(`${bancardBaseUrl(env)}${path}`, { ...init, headers })
  const text = await response.text()

  if (!response.ok) {
    throw new Error(`bancard_api_error:${response.status}:${text.slice(0, 500)}`)
  }

  if (!text) return { status: 'success' } as BancardApiResponse<T>

  try {
    return JSON.parse(text) as BancardApiResponse<T>
  } catch {
    throw new Error(`bancard_invalid_json:${text.slice(0, 200)}`)
  }
}
