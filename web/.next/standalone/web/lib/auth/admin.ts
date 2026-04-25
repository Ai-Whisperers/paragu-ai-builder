/**
 * Admin authorization helper.
 *
 * Why env-allowlist instead of a `profiles.role = 'admin'` table:
 * - The `profiles` table doesn't exist in this project (verified
 *   2026-04-21 against project qyvokpribmbrosafntqa). The code that
 *   referenced it was silently failing — every authenticated user
 *   redirected to /unauthorized.
 * - For a 1-2 person team, an env var is clearer, version-controlled
 *   per-environment, and removes a database round-trip per admin request.
 * - When the team grows beyond ~5 admins, swap this helper for a real
 *   role-based check; call sites won't change.
 */
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowlist = getAdminEmails()
  if (allowlist.length === 0) return false // fail closed when env unset
  return allowlist.includes(email.toLowerCase())
}

/**
 * Server Component variant: redirects to /login or /unauthorized as needed.
 * Always returns the authenticated admin user. Throws via redirect otherwise.
 */
export async function requireAdmin(): Promise<{ user: User }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=unauthorized')
  if (!isAdminEmail(user.email)) redirect('/unauthorized')
  return { user }
}

/**
 * Route-handler variant: returns a discriminated result instead of redirecting.
 */
export async function checkAdmin(): Promise<
  | { ok: true; user: User }
  | { ok: false; status: 401 | 403; reason: 'unauthenticated' | 'forbidden' }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, status: 401, reason: 'unauthenticated' }
  if (!isAdminEmail(user.email)) return { ok: false, status: 403, reason: 'forbidden' }
  return { ok: true, user }
}
