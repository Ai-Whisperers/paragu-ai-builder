/**
 * /admin/inbox — inbound consultation leads dashboard.
 *
 * Reads from public.leads (the inbound contact-form schema, not the older
 * outbound-prospecting table that /admin/leads references). Status pipeline:
 * new → contacted → qualified → closed.
 *
 * Service-role access via createClient(). RLS remains service-role-only;
 * admin gate is at the route level via requireAdmin().
 */
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { InboxDashboard } from './inbox-dashboard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Inbox — Admin',
  description: 'Inbound consultation leads across tenants.',
}

export interface InboxLead {
  id: string
  site_slug: string
  locale: string
  name: string
  email: string
  phone: string | null
  country: string | null
  program_interest: string | null
  objective: string | null
  source: string | null
  referer: string | null
  utm: Record<string, string> | null
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  admin_notes: string | null
  contacted_at: string | null
  qualified_at: string | null
  closed_at: string | null
  close_reason: string | null
  created_at: string
  updated_at: string
}

export interface InboxStats {
  total: number
  new: number
  contacted: number
  qualified: number
  closed: number
  wonLast30Days: number
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; status?: string; q?: string }>
}) {
  await requireAdmin()
  const { site, status, q } = await searchParams

  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select(
      'id, site_slug, locale, name, email, phone, country, program_interest, objective, source, referer, utm, status, admin_notes, contacted_at, qualified_at, closed_at, close_reason, created_at, updated_at',
    )
    .order('created_at', { ascending: false })
    .limit(250)

  if (site) query = query.eq('site_slug', site)
  if (status && ['new', 'contacted', 'qualified', 'closed'].includes(status)) {
    query = query.eq('status', status)
  }
  if (q && q.trim()) {
    // PostgREST `or` filter: name/email ilike. Safe from injection; supabase-js
    // escapes values. Kept narrow — no full-text search.
    const esc = q.trim().replace(/[%,]/g, '')
    query = query.or(`name.ilike.%${esc}%,email.ilike.%${esc}%,objective.ilike.%${esc}%`)
  }

  const { data, error } = await query
  if (error) {
    logger.error('inbox leads load failed', { error: error.message })
  }
  const leads = (data ?? []) as InboxLead[]

  // Stats across ALL leads (unfiltered) for the top cards. Kept separate so
  // filters don't skew the pipeline count.
  const { data: statRows } = await supabase
    .from('leads')
    .select('status, closed_at, close_reason')
    .limit(10_000)

  const stats = buildStats((statRows ?? []) as Array<{ status: string; closed_at: string | null; close_reason: string | null }>)

  const siteOptions = Array.from(new Set(leads.map((l) => l.site_slug))).sort()

  return (
    <InboxDashboard
      leads={leads}
      stats={stats}
      siteOptions={siteOptions}
      activeFilters={{ site, status, q }}
    />
  )
}

function buildStats(
  rows: Array<{ status: string; closed_at: string | null; close_reason: string | null }>,
): InboxStats {
  const base: InboxStats = {
    total: rows.length,
    new: 0,
    contacted: 0,
    qualified: 0,
    closed: 0,
    wonLast30Days: 0,
  }
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  for (const r of rows) {
    if (r.status in base) (base as unknown as Record<string, number>)[r.status]++
    if (
      r.status === 'closed' &&
      r.close_reason === 'won' &&
      r.closed_at &&
      new Date(r.closed_at).getTime() >= cutoff
    ) {
      base.wonLast30Days++
    }
  }
  return base
}
