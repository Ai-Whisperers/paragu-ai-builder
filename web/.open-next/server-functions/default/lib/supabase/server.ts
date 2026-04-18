/**
 * Server-side Supabase Client
 * Ported from Vete (ai-whisperers/vete) - identical pattern.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export async function createClient(keyType: 'anon' | 'service_role' = 'anon') {
  const cookieStore = await cookies()

  const apiKey = keyType === 'service_role' ? env.SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_ANON_KEY

  return createServerClient(env.SUPABASE_URL, apiKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // Called from Server Component - middleware handles refresh
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // Called from Server Component - middleware handles refresh
        }
      },
    },
  })
}
