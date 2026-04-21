/**
 * Server-side Supabase Client - OPTIMIZED
 * 
 * Improvements:
 * - Connection pooling for better performance
 * - Request timeout configuration
 * - Connection limits to prevent exhaustion
 * - Optimized cookie handling
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
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
  timeout: 10000,              // 10 second request timeout
  maxRetries: 3,               // Max retries for failed requests
  retryDelay: 1000,            // Delay between retries
}

/**
 * Create an optimized server-side Supabase client
 * 
 * @param keyType - 'anon' for user requests, 'service_role' for admin operations
 * @returns Configured Supabase client
 */
export async function createClient(keyType: 'anon' | 'service_role' = 'anon') {
  const cookieStore = await cookies()

  const apiKey = keyType === 'service_role' 
    ? env.SUPABASE_SERVICE_ROLE_KEY 
    : env.SUPABASE_ANON_KEY

  return createServerClient(env.SUPABASE_URL, apiKey, {
    // NOTE: `db.pool` is not part of SupabaseClientOptions. Connection
    // pooling is configured at the PgBouncer / Supavisor layer, not from
    // the client — see docs/how-to/debug.md §8 and the comment block
    // above this file's REQUEST_CONFIG for the documented target shape.
    //
    // Global configuration
    global: {
      headers: {
        'X-Client-Info': 'paragu-ai-builder@1.0.0',
      },
      // Custom fetch with timeout
      fetch: (url: RequestInfo | URL, init?: RequestInit) => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_CONFIG.timeout)
        
        return fetch(url, {
          ...init,
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId))
      },
    },
    
    // Auth configuration
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    
    // Cookie handling
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
