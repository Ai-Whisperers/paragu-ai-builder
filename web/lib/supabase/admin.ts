/**
 * Admin / Service-Role Supabase Client.
 *
 * This MUST bypass Row-Level Security. To do that reliably, we use
 * `@supabase/supabase-js`'s plain `createClient` with the service-role
 * key and NO cookie attachment.
 *
 * The earlier implementation delegated to `createServerClient` from
 * `@supabase/ssr`, which automatically forwards the caller's auth
 * cookies. When a logged-in user hit an API route that called this,
 * `@supabase/ssr` attached their user JWT on every DB request, silently
 * overriding the service-role key and re-enabling RLS. That surfaced in
 * production as 500s on `/api/storefront/<site>/cart/items` with
 * `new row violates row-level security policy for table "carts"` in
 * the Postgres logs.
 *
 * WARNING: bypasses RLS. Only use for server-side admin operations,
 * background jobs, and data migrations. NEVER expose to client code.
 */
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

export async function createAdminClient() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'paragu-ai-builder-admin@1.0.0',
      },
    },
  })
}
