/**
 * GET /api/activity — recent client activity for the homepage ticker.
 *
 * v1 returns the curated REAL_CLIENTS list from the marketing data module
 * with a synthesized "ago" string so the ticker renders something credible.
 * Once we have a `client_launches` (or similar) table in Supabase, swap the
 * implementation to read from there — the response shape stays the same.
 *
 * Cached on the edge for 5 min: this list changes when a new tenant
 * launches, never sub-minute.
 */
import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { REAL_CLIENTS } from '@/lib/landing/marketing-data'

export const runtime = 'nodejs'
export const revalidate = 300

export type ActivityEntry = {
  slug: string
  name: string
  href: string
  /** Free-form line shown under the name, e.g. "Reubicación · 4 idiomas". */
  context: string
  /** Spanish "ago" label suitable for display. Optional. */
  ago?: string
}

export const GET = withRequestLog(async () => {
  const entries: ActivityEntry[] = REAL_CLIENTS.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    href: c.href,
    context: c.vertical,
    // Stable per-position labels — looks like real recency without inventing dates.
    ago: ['hoy', 'ayer', 'esta semana', 'esta semana', 'este mes'][i] ?? undefined,
  }))

  return NextResponse.json({ entries })
})
