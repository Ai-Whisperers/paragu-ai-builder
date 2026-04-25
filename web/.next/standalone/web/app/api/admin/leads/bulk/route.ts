/**
 * POST /api/admin/leads/bulk
 * Apply one patch across multiple lead ids. Admin-gated. Max 200 ids.
 * Supported ops: status, close_reason, assigned_to.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkAdmin, isAdminEmail } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const BulkSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
  close_reason: z.enum(['won', 'lost_not_fit', 'lost_no_response', 'lost_other']).nullable().optional(),
  assigned_to: z.string().email().nullable().optional(),
})

export async function POST(req: Request) {
  const admin = await checkAdmin()
  if (!admin.ok) return NextResponse.json({ error: admin.reason }, { status: admin.status })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }) }

  const parsed = BulkSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })

  const { ids, status, close_reason, assigned_to } = parsed.data
  if (assigned_to !== undefined && assigned_to !== null && !isAdminEmail(assigned_to)) {
    return NextResponse.json({ error: 'invalid_assignee' }, { status: 400 })
  }
  if (status === undefined && close_reason === undefined && assigned_to === undefined) {
    return NextResponse.json({ error: 'no_op_specified' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: current, error: loadErr } = await supabase
    .from('leads')
    .select('id, status, contacted_at, qualified_at, closed_at')
    .in('id', ids)
  if (loadErr) return NextResponse.json({ error: 'lookup_failed' }, { status: 500 })

  const currentById = new Map(
    ((current ?? []) as Array<{ id: string; status: string; contacted_at: string | null; qualified_at: string | null; closed_at: string | null }>).map((r) => [r.id, r]),
  )

  const now = new Date().toISOString()
  const basePatch: Record<string, unknown> = {}
  if (close_reason !== undefined) basePatch.close_reason = close_reason
  if (assigned_to !== undefined) basePatch.assigned_to = assigned_to
  if (status !== undefined) basePatch.status = status

  const needContacted: string[] = []
  const needQualified: string[] = []
  const needClosed: string[] = []
  if (status) {
    for (const id of ids) {
      const row = currentById.get(id)
      if (!row) continue
      if (status === 'contacted' && !row.contacted_at) needContacted.push(id)
      if (status === 'qualified' && !row.qualified_at) needQualified.push(id)
      if (status === 'closed' && !row.closed_at) needClosed.push(id)
    }
  }

  const baseIds = ids.filter((id) => !needContacted.includes(id) && !needQualified.includes(id) && !needClosed.includes(id))
  const updates: Array<PromiseLike<{ error: { message: string } | null }>> = []
  if (baseIds.length > 0) updates.push(supabase.from('leads').update(basePatch).in('id', baseIds) as unknown as PromiseLike<{ error: { message: string } | null }>)
  if (needContacted.length > 0) updates.push(supabase.from('leads').update({ ...basePatch, contacted_at: now }).in('id', needContacted) as unknown as PromiseLike<{ error: { message: string } | null }>)
  if (needQualified.length > 0) updates.push(supabase.from('leads').update({ ...basePatch, qualified_at: now }).in('id', needQualified) as unknown as PromiseLike<{ error: { message: string } | null }>)
  if (needClosed.length > 0) updates.push(supabase.from('leads').update({ ...basePatch, closed_at: now }).in('id', needClosed) as unknown as PromiseLike<{ error: { message: string } | null }>)

  const results = await Promise.all(updates)
  const errors = results.map((r) => r.error).filter((e): e is { message: string } => !!e)
  if (errors.length > 0) {
    logger.error('Bulk update partial failure', { by: admin.user.email, errors: errors.map((e) => e.message) })
    return NextResponse.json({ error: 'bulk_update_partial' }, { status: 500 })
  }

  logger.info('Bulk lead update', { by: admin.user.email, count: ids.length, ops: Object.keys(basePatch) })
  return NextResponse.json({ ok: true, count: ids.length })
}
