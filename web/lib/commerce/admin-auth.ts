import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { isAdminEmail } from '@/lib/auth/admin'

/**
 * Returns the authenticated admin user for this request, or null if there is
 * none. Callers MUST use this for /api/admin/* routes — the Next.js
 * middleware only protects page routes, not API routes (see matcher config).
 *
 * "Admin" means: signed in with a Supabase session AND in the env-allowlist
 * (`ADMIN_EMAILS`). The earlier version only checked the first condition,
 * which would have allowed any authenticated tenant customer to call
 * /api/admin/* commerce routes. See ADR 0003 for the env-allowlist authz
 * model.
 */
export async function requireAdminUser(): Promise<{ userId: string; email: string | null } | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null
    if (!isAdminEmail(user.email)) {
      logger.warn('[commerce] non-admin user attempted admin route', {
        action: 'commerce.admin_auth.forbidden',
        email: user.email,
      })
      return null
    }
    return { userId: user.id, email: user.email ?? null }
  } catch (err) {
    logger.warn('[commerce] admin auth check failed', {
      action: 'commerce.admin_auth.failed',
      error: err instanceof Error ? err.message : String(err),
    })
    return null
  }
}
