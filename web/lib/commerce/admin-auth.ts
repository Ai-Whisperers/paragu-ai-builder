import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

/**
 * Returns the authenticated admin user for this request, or null if there is
 * none. Callers MUST use this for /api/admin/* routes — the Next.js
 * middleware only protects page routes, not API routes (see matcher config).
 *
 * "Admin" means: signed in with a Supabase session. We don't have role-based
 * authz yet — the expectation is that only the operator(s) can sign in, and
 * /login is not user-facing. If/when we add roles, tighten here in one place.
 */
export async function requireAdminUser(): Promise<{ userId: string; email: string | null } | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null
    return { userId: user.id, email: user.email ?? null }
  } catch (err) {
    logger.warn('[commerce] admin auth check failed', {
      action: 'commerce.admin_auth.failed',
      error: err instanceof Error ? err.message : String(err),
    })
    return null
  }
}
