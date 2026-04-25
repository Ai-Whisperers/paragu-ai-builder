/**
 * Bulk Update Leads API
 *
 * Apply one of a fixed set of actions (status, priority, favorite, etc.) to
 * up to 100 leads at once. Admin-only.
 *
 * Auth: gated by `checkAdmin()` — was previously gated only on "any signed-in
 * Supabase user", which would have allowed any authenticated customer to
 * bulk-mutate leads. Tightened to admin-only.
 *
 * Audit: every successful bulk update writes a row to `audit_logs` keyed by
 * the request id from `withRequestLog`.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/auth/admin'

export const runtime = 'nodejs'

const BulkUpdateSchema = z.object({
  leadIds: z
    .array(z.string().uuid())
    .min(1, 'At least one lead ID is required')
    .max(100, 'Maximum 100 leads per request'),
  action: z.enum([
    'update_status',
    'update_priority',
    'add_tags',
    'remove_tags',
    'mark_favorite',
    'unmark_favorite',
    'assign_to',
    'archive',
  ]),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]).optional(),
})

type BulkUpdateBody = z.infer<typeof BulkUpdateSchema>

function buildUpdate(action: BulkUpdateBody['action'], value: BulkUpdateBody['value']):
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: number; error: string } {
  const now = new Date().toISOString()
  switch (action) {
    case 'update_status':
      if (typeof value !== 'string') return { ok: false, status: 400, error: 'Status value must be a string' }
      return { ok: true, data: { status: value, updated_at: now } }
    case 'update_priority':
      if (typeof value !== 'string') return { ok: false, status: 400, error: 'Priority value must be a string' }
      return { ok: true, data: { priority_tier: value, updated_at: now } }
    case 'mark_favorite':
      return { ok: true, data: { is_favorite: true, updated_at: now } }
    case 'unmark_favorite':
      return { ok: true, data: { is_favorite: false, updated_at: now } }
    case 'assign_to':
      if (typeof value !== 'string') return { ok: false, status: 400, error: 'Assignee value must be a string' }
      return { ok: true, data: { assigned_to: value, updated_at: now } }
    case 'archive':
      return { ok: true, data: { status: 'archived', updated_at: now } }
    case 'add_tags':
    case 'remove_tags':
      // Tags require a JSONB array merge; not supported in this iteration.
      return { ok: false, status: 501, error: 'Tags actions not yet implemented' }
    default:
      return { ok: false, status: 400, error: 'Unknown action' }
  }
}

export const POST = withRequestLog(async (request, { log, perf, requestId }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    log.warn('leads.bulk_update.unauthorized', { reason: auth.reason })
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }
  const userId = auth.user.id

  const body = await request.json().catch(() => null)
  const validated = BulkUpdateSchema.safeParse(body)
  if (!validated.success) {
    log.warn('leads.bulk_update.invalid_request', { errors: validated.error.flatten() })
    return NextResponse.json(
      { error: 'Invalid request', details: validated.error.flatten() },
      { status: 400 },
    )
  }
  const { leadIds, action, value } = validated.data
  perf.checkpoint('validated')

  const supabase = await createClient()
  const { data: accessibleLeads, error: accessError } = await supabase
    .from('leads')
    .select('id')
    .in('id', leadIds)

  if (accessError) {
    log.error('leads.bulk_update.access_check_failed', new Error(accessError.message))
    return NextResponse.json({ error: 'Access verification failed' }, { status: 500 })
  }

  const accessibleIds = (accessibleLeads ?? []).map((l) => l.id)
  if (accessibleIds.length !== leadIds.length) {
    const missingIds = leadIds.filter((id) => !accessibleIds.includes(id))
    log.warn('leads.bulk_update.missing_ids', { missingIds })
    return NextResponse.json({ error: 'Some leads not found', missingIds }, { status: 404 })
  }
  perf.checkpoint('access_verified')

  const update = buildUpdate(action, value)
  if (!update.ok) {
    return NextResponse.json({ error: update.error }, { status: update.status })
  }

  const { data: updatedData, error: updateError } = await supabase
    .from('leads')
    .update(update.data)
    .in('id', accessibleIds)
    .select('id')

  if (updateError) {
    log.error('leads.bulk_update.failed', new Error(updateError.message))
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
  perf.checkpoint('updated')

  await supabase.from('audit_logs').insert({
    user_id: userId,
    action: 'bulk_update',
    entity_type: 'leads',
    entity_ids: accessibleIds,
    changes: update.data,
    request_id: requestId,
  })

  log.info('leads.bulk_update.success', {
    action,
    count: updatedData?.length ?? 0,
  })
  return NextResponse.json({ success: true, updatedCount: updatedData?.length ?? 0 })
})

export const GET = withRequestLog(async () =>
  NextResponse.json({ error: 'Method not allowed', allowedMethods: ['POST'] }, { status: 405 }),
)
