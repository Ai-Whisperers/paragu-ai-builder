'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

/**
 * Client-side handler for Supabase's implicit-flow magic link.
 * Reads window.location.hash, extracts access_token + refresh_token,
 * calls setSession (which persists cookies), then navigates to `next`.
 */
export function CallbackHashHandler({ next }: { next: string }) {
  const router = useRouter()
  const [state, setState] = useState<'processing' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function exchange() {
      const hash = typeof window !== 'undefined' ? window.location.hash : ''
      if (!hash) {
        if (!cancelled) {
          setErrorMessage('no_auth_data')
          setState('error')
        }
        return
      }

      const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (!accessToken || !refreshToken) {
        if (!cancelled) {
          setErrorMessage(params.get('error_description') ?? params.get('error') ?? 'missing_tokens')
          setState('error')
        }
        return
      }

      try {
        const supabase = createClient()
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (error) throw error

        // Strip the hash from the URL bar before navigating.
        window.history.replaceState(null, '', next)
        router.replace(next)
        router.refresh()
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : String(err))
          setState('error')
        }
      }
    }

    exchange()
    return () => {
      cancelled = true
    }
  }, [next, router])

  if (state === 'error') {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 text-xl font-semibold">No pudimos completar el inicio de sesión</h1>
        <p className="mb-4 text-sm text-[color:var(--text-muted,#6b7280)]">
          {errorMessage === 'no_auth_data' || errorMessage === 'missing_tokens'
            ? 'El link ya fue usado o expiró. Pedí un link nuevo desde la página de login.'
            : errorMessage}
        </p>
        <Link href="/login" className="text-sm font-medium text-[color:var(--primary,#111)] underline">
          Ir al login
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-[color:var(--text-muted,#6b7280)]">Completando inicio de sesión…</p>
    </main>
  )
}
