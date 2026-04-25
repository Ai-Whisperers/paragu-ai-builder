/**
 * /admin/inbox — inbound consultation leads dashboard.
 *
 * Reads from public.leads. Pipeline: new → contacted → qualified → closed.
 * Supports filtering by site, status, assignee, and free-text search, with
 * paginated results (25/page). Auth gated by admin layout.tsx.
 */
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
  assigned_to: string | null
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

const PAGE_SIZE = 25

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{
    site?: string
    status?: string
    q?: string
    assignee?: string
    page?: string
  }>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('leads')
    .select(
      'id, site_slug, locale, name, email, phone, country, program_interest, objective, source, referer, utm, status, admin_notes, contacted_at, qualified_at, closed_at, close_reason, assigned_to, created_at, updated_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (sp.site) query = query.eq('site_slug', sp.site)
  if (sp.status && ['new', 'contacted', 'qualified', 'closed'].includes(sp.status)) {
    query = query.eq('status', sp.status)
  }
  if (sp.assignee === 'unassigned') query = query.is('assigned_to', null)
  else if (sp.assignee) query = query.eq('assigned_to', sp.assignee)
  if (sp.q && sp.q.trim()) {
    const esc = sp.q.trim().replace(/[%,]/g, '')
    query = query.or(`name.ilike.%${esc}%,email.ilike.%${esc}%,objective.ilike.%${esc}%`)
  }

  const { data, error, count } = await query
  if (error) logger.error('inbox leads load failed', { error: error.message })
  const leads = (data ?? []) as InboxLead[]
  const totalCount = count ?? leads.length

  const { data: statRows } = await supabase.from('leads').select('status, closed_at, close_reason').limit(10_000)
  const stats = buildStats((statRows ?? []) as Array<{ status: string; closed_at: string | null; close_reason: string | null }>)

  const { data: siteDistinct } = await supabase.from('leads').select('site_slug').limit(10_000)
  const siteOptions = Array.from(new Set((siteDistinct ?? []).map((r: { site_slug: string }) => r.site_slug))).sort()

  const { data: assigneeDistinct } = await supabase.from('leads').select('assigned_to').not('assigned_to', 'is', null).limit(10_000)
  const assigneeOptions = Array.from(
    new Set(
      (assigneeDistinct ?? [])
        .map((r: { assigned_to: string | null }) => r.assigned_to)
        .filter((v): v is string => !!v),
    ),
  ).sort()

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)

  return (
    <InboxDashboard
      leads={leads}
      stats={stats}
      siteOptions={siteOptions}
      assigneeOptions={assigneeOptions}
      adminEmails={adminEmails}
      pagination={{ page, pageSize: PAGE_SIZE, totalCount }}
      activeFilters={{ site: sp.site, status: sp.status, q: sp.q, assignee: sp.assignee }}
    />
  )
}

function buildStats(
  rows: Array<{ status: string; closed_at: string | null; close_reason: string | null }>,
): InboxStats {
  const base: InboxStats = { total: rows.length, new: 0, contacted: 0, qualified: 0, closed: 0, wonLast30Days: 0 }
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  for (const r of rows) {
    if (r.status in base) (base as unknown as Record<string, number>)[r.status]++
    if (r.status === 'closed' && r.close_reason === 'won' && r.closed_at && new Date(r.closed_at).getTime() >= cutoff) {
      base.wonLast30Days++
    }
  }
  return base
}
