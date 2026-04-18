/**
 * Admin/Service Role Supabase Client
 * Ported from Vete (ai-whisperers/vete).
 *
 * WARNING: This client bypasses Row-Level Security.
 * Only use for admin operations, background jobs, and data migrations.
 * NEVER expose to client-side code.
 */
import { createClient as createServerClient } from './server'

export async function createAdminClient() {
  return createServerClient('service_role')
}
