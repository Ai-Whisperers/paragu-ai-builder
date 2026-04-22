/**
 * Server-side Supabase Client.
 *
 * Two modes, picked by `keyType`:
 *
 *  - `anon` (default): request-scoped client that reads/writes the user's
 *    auth cookies via `@supabase/ssr`. Use this for routes that need to
 *    impersonate the signed-in user and let RLS apply.
 *
 *  - `service_role`: cookie-free client built on plain
 *    `@supabase/supabase-js`. MUST NOT attach user cookies — doing so
 *    silently forwards the caller's JWT as the `Authorization` header,
 *    overriding the service-role key and re-enabling RLS on a bypass
 *    path. We learned this the hard way: PR #253 traced prod 500s on
 *    `/api/storefront/<site>/cart/items` to the admin client doing
 *    exactly that. See memory: admin-client-ssr-footgun.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

// Connection pool target — informational only. PostgREST connection
// pooling lives at the PgBouncer / Supavisor layer, NOT in the JS client.
// See docs/how-to/debug.md §8 for the real pool knobs. These numbers
// document our target shape:
//   max=20, min=5, acquireTimeout=5s, idleTimeout=30s,
//   reap=1s, create/destroy timeout=5s.

// Request timeout configuration
const REQUEST_CONFIG = {
  timeout: 10000, // 10 second request timeout
  maxRetries: 3,
  retryDelay: 1000,
}

function timeoutFetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_CONFIG.timeout)
  return fetch(url, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId))
}

/**
 * Create an optimized server-side Supabase client.
 *
 * @param keyType - 'anon' for user requests, 'service_role' for admin operations
 * @returns Configured Supabase client
 */
export async function createClient(keyType: 'anon' | 'service_role' = 'anon') {
  if (keyType === 'service_role') {
    // Cookie-free service-role client. Nothing in the request context
    // should leak into Supabase auth headers — the whole point of the
    // service role is to skip RLS, which only works when no user JWT
    // is attached.
    return createServiceClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'paragu-ai-builder-admin@1.0.0',
        },
        fetch: timeoutFetch,
      },
    })
  }

  const cookieStore = await cookies()

  return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    // NOTE: `db.pool` is not part of SupabaseClientOptions. Connection
    // pooling is configured at the PgBouncer / Supavisor layer, not from
    // the client — see docs/how-to/debug.md §8 and the comment block
    // above this file's REQUEST_CONFIG for the documented target shape.
    global: {
      headers: {
        'X-Client-Info': 'paragu-ai-builder@1.0.0',
      },
      fetch: timeoutFetch,
    },

    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },

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
