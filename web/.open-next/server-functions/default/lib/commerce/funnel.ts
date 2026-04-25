import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

type FunnelEventType =
  | 'cart_item_added'
  | 'cart_item_updated'
  | 'cart_item_removed'
  | 'begin_checkout'
  | 'order_created'
  | 'order_paid'

/**
 * Server-side commerce funnel logger. Writes to `analytics_events` —
 * same table the frontend analytics/track route uses — so the admin
 * dashboard can reason about both surfaces from a single query.
 *
 * Fire-and-forget. Failures log but never throw: funnel logging is
 * nice-to-have observability, not a business rule.
 */
export async function recordCommerceFunnelEvent(opts: {
  businessId: string
  eventType: FunnelEventType
  sessionToken?: string | null
  orderId?: string | null
  cartId?: string | null
  productId?: string | null
  quantity?: number | null
  amountCents?: number | null
  currency?: string | null
  metadata?: Record<string, unknown>
}): Promise<void> {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('analytics_events').insert({
      business_id: opts.businessId,
      event_type: opts.eventType,
      session_token: opts.sessionToken ?? null,
      metadata: {
        ...(opts.orderId ? { orderId: opts.orderId } : {}),
        ...(opts.cartId ? { cartId: opts.cartId } : {}),
        ...(opts.productId ? { productId: opts.productId } : {}),
        ...(opts.quantity !== null && opts.quantity !== undefined ? { quantity: opts.quantity } : {}),
        ...(opts.amountCents !== null && opts.amountCents !== undefined
          ? { amountCents: opts.amountCents }
          : {}),
        ...(opts.currency ? { currency: opts.currency } : {}),
        ...(opts.metadata ?? {}),
      },
    })
    if (error) {
      logger.warn('[commerce.funnel] insert failed', {
        action: 'commerce.funnel.insert_failed',
        eventType: opts.eventType,
        error: error.message,
      })
    }
  } catch (err) {
    logger.warn('[commerce.funnel] insert threw', {
      action: 'commerce.funnel.threw',
      eventType: opts.eventType,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
