import { createHash } from 'crypto'

const PAGOPAR_API_BASE = 'https://api.pagopar.com'

export function getPagoparTokens(): { publicToken: string; privateToken: string } {
  const publicToken = process.env.PAGOPAR_PUBLIC_TOKEN
  const privateToken = process.env.PAGOPAR_PRIVATE_TOKEN
  if (!publicToken || !privateToken) {
    throw new Error('PAGOPAR_PUBLIC_TOKEN and PAGOPAR_PRIVATE_TOKEN are not set')
  }
  return { publicToken, privateToken }
}

/**
 * Pagopar's SHA-1 request-signature scheme.
 * Docs: https://soporte.pagopar.com/portal/es/kb/articles/api-integracion-medios-pagos
 *
 * Template: sha1(private_key + <identifier>)
 *    - For iniciar-transaccion: identifier = orderNumber + amount
 *    - For webhooks (incoming token): identifier = orderHash
 */
export function signPagopar(privateKey: string, identifier: string): string {
  return createHash('sha1').update(privateKey + identifier).digest('hex')
}

export async function pagoparFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  const response = await fetch(`${PAGOPAR_API_BASE}${path}`, { ...init, headers })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`pagopar_api_error:${response.status}:${text.slice(0, 500)}`)
  }
  return (text ? JSON.parse(text) : {}) as T
}
