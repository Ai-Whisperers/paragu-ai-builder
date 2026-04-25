import { cookies } from 'next/headers'
import { newSessionToken } from './cart'

const COOKIE_NAME = 'paragu_cart_session'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

/**
 * Read the cart session token from the httpOnly cookie. If missing, returns
 * null — API routes should mint one via `ensureSessionToken` when needed.
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

export async function ensureSessionToken(): Promise<string> {
  const store = await cookies()
  const existing = store.get(COOKIE_NAME)?.value
  if (existing) return existing
  const fresh = newSessionToken()
  store.set(COOKIE_NAME, fresh, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  })
  return fresh
}
