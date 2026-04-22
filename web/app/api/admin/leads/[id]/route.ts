/**
 * PATCH /api/admin/leads/[id]
 *
 * Updates status + admin_notes on a lead row. Admin-only via requireAdmin().
 * Derives the status-transition timestamps automatically: contacted_at on
 * first move to 'contacted', qualified_at on first move to 'qualified',
 * closed_at on first move to 'closed'. Never clears those once set.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const PatchSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
  admin_notes: z.string().max(10_000).optional(),
  close_reason: z.enum(['won', 'lost_not_fit', 'lost_no_response', 'lost_other']).nullable().optional(),
})

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params
  const admin = await checkAdmin()
  if (!admin.ok) {
    return NextResponse.json({ error: admin.reason }, { status: admin.status })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', detail: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const supabase = await createClient()

  // Load current row so we can compute transition timestamps.
  const { data: current, error: loadErr } = await supabase
    .from('leads')
    .select('id, status, contacted_at, qualified_at, closed_at')
    .eq('id', id)
    .maybeSingle()

  if (loadErr) {
    logger.warn('Failed to load lead for PATCH', { id, error: loadErr.message })
    return NextResponse.json({ error: 'lookup_failed' }, { status: 500 })
  }
  if (!current) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const patch: Record<string, unknown> = {}
  if (parsed.data.admin_notes !== undefined) patch.admin_notes = parsed.data.admin_notes
  if (parsed.data.close_reason !== undefined) patch.close_reason = parsed.data.close_reason

  if (parsed.data.status) {
    patch.status = parsed.data.status
    const now = new Date().toISOString()
    // Set transition timestamps on first entry into each terminal-ish state.
    if (parsed.data.status === 'contacted' && !current.contacted_at) patch.contacted_at = now
    if (parsed.data.status === 'qualified' && !current.qualified_at) patch.qualified_at = now
    if (parsed.data.status === 'closed' && !current.closed_at) patch.closed_at = now
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: true, changed: false })
  }

  const { data: updated, error: updateErr } = await supabase
    .from('leads')
    .update(patch)
    .eq('id', id)
    .select('id, status, admin_notes, contacted_at, qualified_at, closed_at, close_reason, updated_at')
    .single()

  if (updateErr) {
    logger.warn('Failed to update lead', { id, error: updateErr.message })
    return NextResponse.json({ error: 'update_failed', detail: updateErr.message }, { status: 500 })
  }

  logger.info('Lead updated via admin inbox', {
    leadId: id,
    by: admin.user.email,
    fields: Object.keys(patch),
  })

  return NextResponse.json({ ok: true, lead: updated })
}
