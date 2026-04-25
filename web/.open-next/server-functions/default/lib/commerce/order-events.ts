import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

type EventType =
  | 'status_changed'
  | 'comprobante_received'
  | 'comprobante_uploaded'
  | 'invoice_issued'
  | 'refund_issued'
  | 'note_added'

export interface OrderEventRow {
  id: string
  orderId: string
  actorId: string | null
  actorLabel: string | null
  eventType: EventType
  fromStatus: string | null
  toStatus: string | null
  note: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

interface RecordOpts {
  businessId: string
  orderId: string
  eventType: EventType
  actorId?: string | null
  actorLabel?: string | null
  fromStatus?: string | null
  toStatus?: string | null
  note?: string | null
  metadata?: Record<string, unknown>
}

/**
 * Append-only write into order_events. Fire-and-forget — failures log
 * but never throw. The audit log is nice-to-have; a missing row is
 * not worth crashing the admin action that triggered it.
 */
export async function recordOrderEvent(opts: RecordOpts): Promise<void> {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('order_events').insert({
      business_id: opts.businessId,
      order_id: opts.orderId,
      actor_id: opts.actorId ?? null,
      actor_label: opts.actorLabel ?? null,
      event_type: opts.eventType,
      from_status: opts.fromStatus ?? null,
      to_status: opts.toStatus ?? null,
      note: opts.note ?? null,
      metadata: opts.metadata ?? {},
    })
    if (error) {
      logger.warn('[commerce] order_events insert failed', {
        action: 'commerce.order_event.insert_failed',
        orderId: opts.orderId,
        eventType: opts.eventType,
        error: error.message,
      })
    }
  } catch (err) {
    logger.warn('[commerce] order_events insert threw', {
      action: 'commerce.order_event.threw',
      orderId: opts.orderId,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export async function listOrderEvents(
  businessId: string,
  orderId: string,
): Promise<OrderEventRow[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('order_events')
    .select('*')
    .eq('business_id', businessId)
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    .limit(200)
  return (Array.isArray(data) ? data : []).map(
    (r): OrderEventRow => ({
      id: r.id as string,
      orderId: r.order_id as string,
      actorId: (r.actor_id as string | null) ?? null,
      actorLabel: (r.actor_label as string | null) ?? null,
      eventType: r.event_type as EventType,
      fromStatus: (r.from_status as string | null) ?? null,
      toStatus: (r.to_status as string | null) ?? null,
      note: (r.note as string | null) ?? null,
      metadata: (r.metadata as Record<string, unknown>) ?? {},
      createdAt: r.created_at as string,
    }),
  )
}
