/**
 * GET /api/admin/leads/export?site=&status=&assignee=&q=
 * CSV export of inbox leads matching the filter set. Admin-gated.
 */
import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const admin = await checkAdmin()
  if (!admin.ok) return NextResponse.json({ error: admin.reason }, { status: admin.status })

  const url = new URL(req.url)
  const site = url.searchParams.get('site') || undefined
  const status = url.searchParams.get('status') || undefined
  const assignee = url.searchParams.get('assignee') || undefined
  const q = url.searchParams.get('q') || undefined

  const supabase = await createClient()
  let query = supabase
    .from('leads')
    .select('id, created_at, site_slug, locale, name, email, phone, country, program_interest, objective, status, assigned_to, close_reason, contacted_at, qualified_at, closed_at, source, referer, utm')
    .order('created_at', { ascending: false })
    .limit(10_000)

  if (site) query = query.eq('site_slug', site)
  if (status && ['new', 'contacted', 'qualified', 'closed'].includes(status)) query = query.eq('status', status)
  if (assignee === 'unassigned') query = query.is('assigned_to', null)
  else if (assignee) query = query.eq('assigned_to', assignee)
  if (q && q.trim()) {
    const esc = q.trim().replace(/[%,]/g, '')
    query = query.or(`name.ilike.%${esc}%,email.ilike.%${esc}%,objective.ilike.%${esc}%`)
  }

  const { data, error } = await query
  if (error) {
    logger.error('inbox CSV export query failed', { error: error.message })
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  const rows = (data ?? []) as Array<Record<string, unknown>>
  const csv = toCsv(rows)
  const filename = `inbox-leads-${new Date().toISOString().slice(0, 10)}.csv`
  logger.info('Inbox CSV export', { by: admin.user.email, rows: rows.length })

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}

function toCsv(rows: Array<Record<string, unknown>>): string {
  const cols = ['created_at', 'site_slug', 'locale', 'name', 'email', 'phone', 'country', 'program_interest', 'status', 'assigned_to', 'close_reason', 'contacted_at', 'qualified_at', 'closed_at', 'source', 'referer', 'utm_source', 'utm_medium', 'utm_campaign', 'objective']
  const lines = [cols.join(',')]
  for (const row of rows) {
    const utm = (row.utm && typeof row.utm === 'object' ? row.utm : {}) as Record<string, string>
    const flat: Record<string, unknown> = {
      ...row,
      utm_source: utm.utm_source ?? utm.source ?? '',
      utm_medium: utm.utm_medium ?? utm.medium ?? '',
      utm_campaign: utm.utm_campaign ?? utm.campaign ?? '',
    }
    lines.push(cols.map((c) => csvCell(flat[c])).join(','))
  }
  return lines.join('\n') + '\n'
}

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return ''
  const s = typeof v === 'string' ? v : String(v)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}
