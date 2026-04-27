/**
 * PATCH /api/admin/leads/[id]
 *
 * Updates status / admin_notes / close_reason / assigned_to on a lead row.
 * Admin-only via checkAdmin(). Derives status-transition timestamps on
 * first entry into each state. assigned_to must be null or match an email
 * in ADMIN_EMAILS. Appends one row to lead_audit_log per changed field.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkAdmin, isAdminEmail } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const PatchSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
  admin_notes: z.string().max(10_000).optional(),
  close_reason: z.enum(['won', 'lost_not_fit', 'lost_no_response', 'lost_other']).nullable().optional(),
  assigned_to: z.string().email().nullable().optional(),
})

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params
  const admin = await checkAdmin()
  if (!admin.ok) return NextResponse.json({ error: admin.reason }, { status: admin.status })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }) }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })

  if (parsed.data.assigned_to !== undefined && parsed.data.assigned_to !== null && !isAdminEmail(parsed.data.assigned_to)) {
    return NextResponse.json({ error: 'invalid_assignee' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: current, error: loadErr } = await supabase
    .from('leads')
    .select('id, status, contacted_at, qualified_at, closed_at, assigned_to, close_reason')
    .eq('id', id)
    .maybeSingle()

  if (loadErr) return NextResponse.json({ error: 'lookup_failed' }, { status: 500 })
  if (!current) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const patch: Record<string, unknown> = {}
  if (parsed.data.admin_notes !== undefined) patch.admin_notes = parsed.data.admin_notes
  if (parsed.data.close_reason !== undefined) patch.close_reason = parsed.data.close_reason
  if (parsed.data.assigned_to !== undefined) patch.assigned_to = parsed.data.assigned_to

  if (parsed.data.status) {
    patch.status = parsed.data.status
    const now = new Date().toISOString()
    if (parsed.data.status === 'contacted' && !current.contacted_at) patch.contacted_at = now
    if (parsed.data.status === 'qualified' && !current.qualified_at) patch.qualified_at = now
    if (parsed.data.status === 'closed' && !current.closed_at) patch.closed_at = now
  }

  if (Object.keys(patch).length === 0) return NextResponse.json({ ok: true, changed: false })

  const { data: updated, error: updateErr } = await supabase
    .from('leads')
    .update(patch)
    .eq('id', id)
    .select('id, status, admin_notes, contacted_at, qualified_at, closed_at, close_reason, assigned_to, updated_at')
    .single()

  if (updateErr) return NextResponse.json({ error: 'update_failed', detail: updateErr.message }, { status: 500 })

  // Append one audit row per changed field. Best-effort — audit failure
  // should not fail the update itself. Fire-and-forget inside the request.
  const auditRows: Array<{ lead_id: string; actor: string | null; field: string; old_value: string | null; new_value: string | null }> = []
  const actor = admin.user.email ?? null
  if (parsed.data.status !== undefined && current.status !== parsed.data.status) {
    auditRows.push({ lead_id: id, actor, field: 'status', old_value: current.status ?? null, new_value: parsed.data.status })
  }
  if (parsed.data.assigned_to !== undefined && current.assigned_to !== parsed.data.assigned_to) {
    auditRows.push({ lead_id: id, actor, field: 'assigned_to', old_value: current.assigned_to ?? null, new_value: parsed.data.assigned_to })
  }
  if (parsed.data.close_reason !== undefined && current.close_reason !== parsed.data.close_reason) {
    auditRows.push({ lead_id: id, actor, field: 'close_reason', old_value: current.close_reason ?? null, new_value: parsed.data.close_reason })
  }
  if (auditRows.length > 0) {
    supabase.from('lead_audit_log').insert(auditRows).then(({ error: auditErr }) => {
      if (auditErr) logger.warn('Audit append failed', { leadId: id, error: auditErr.message })
    })
  }

  logger.info('Lead updated via admin inbox', { leadId: id, by: admin.user.email, fields: Object.keys(patch) })
  return NextResponse.json({ ok: true, lead: updated })
}
