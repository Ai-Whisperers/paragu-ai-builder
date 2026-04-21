import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { CallbackHashHandler } from './callback-hash-handler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Magic-link / OAuth callback.
 *
 * Two auth flows to handle:
 *   1. PKCE (query `?code=...`): server-exchanges for session via
 *      supabase.auth.exchangeCodeForSession, then redirects.
 *   2. Implicit (hash `#access_token=...&refresh_token=...`): the tokens
 *      never reach the server (URL fragments aren't sent in the HTTP
 *      request). We render a client component that reads window.location.hash,
 *      calls supabase.auth.setSession, and router.push(next).
 *
 * Supabase's current admin generate_link API uses the implicit flow by
 * default, so path #2 is the hot path today. Path #1 is ready for when
 * we add a login UI that calls signInWithOtp with flowType:'pkce'.
 */
export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string; error?: string; error_description?: string }>
}) {
  const params = await searchParams
  const next = params.next && params.next.startsWith('/') ? params.next : '/admin'

  // Surface provider-side errors as a redirect to /login with the message
  if (params.error) {
    const msg = encodeURIComponent(params.error_description ?? params.error)
    redirect(`/login?error=${msg}`)
  }

  // PKCE path — exchange on the server, set cookies, redirect.
  if (params.code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(params.code)
      if (error) {
        logger.warn('auth.callback.pkce_exchange_failed', { error: error.message })
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
      }
    } catch (err) {
      // next/navigation redirect() throws internally; re-throw so it propagates.
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
      logger.error('auth.callback.pkce_unhandled', err instanceof Error ? err : new Error(String(err)))
      redirect('/login?error=auth_callback_failed')
    }
    redirect(next)
  }

  // Implicit path — tokens are in the URL hash, which we can't read server-side.
  // Render a tiny client component that extracts them from window.location.hash.
  return <CallbackHashHandler next={next} />
}
