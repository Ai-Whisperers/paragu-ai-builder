import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { transitionStatus, CheckoutError, getOrder } from '@/lib/commerce/orders'
import { OrderStatusSchema } from '@/lib/schemas/commerce/order'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { enqueueOrderEmail } from '@/lib/commerce/notifications'
import { recordOrderEvent } from '@/lib/commerce/order-events'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const BodySchema = z.object({
  status: OrderStatusSchema,
  tracking: z
    .object({
      carrier: z.string().max(80).nullable().optional(),
      number: z.string().max(120).nullable().optional(),
      url: z.string().url().max(500).nullable().optional(),
    })
    .optional(),
})

// Which status transitions should fire a customer email. Intentionally
// small — refunded / fulfilled / delivered don't email today; the admin
// can still transition them, just no customer notification.
const STATUS_TO_TEMPLATE: Partial<Record<z.infer<typeof OrderStatusSchema>, 'order_paid' | 'order_shipped'>> = {
  paid: 'order_paid',
  shipped: 'order_shipped',
}

export const POST = withRequestLog<{ businessId: string; id: string }>(async (req, { log }, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  try {
    await transitionStatus(businessId, id, parsed.data.status, { tracking: parsed.data.tracking })
    log.info('admin.commerce.order.transitioned', { businessId, orderId: id, status: parsed.data.status })
    await recordOrderEvent({
      businessId,
      orderId: id,
      eventType: 'status_changed',
      actorId: admin.userId,
      actorLabel: admin.email ?? null,
      toStatus: parsed.data.status,
    })
  } catch (err) {
    if (err instanceof CheckoutError) {
      const status = err.code === 'order_not_found' ? 404 : 409
      return NextResponse.json({ error: err.code }, { status })
    }
    if (err instanceof Error && err.name === 'OrderStateError') {
      return NextResponse.json({ error: 'invalid_transition', detail: err.message }, { status: 409 })
    }
    throw err
  }

  // Fire the matching customer notification for transitions the shopper
  // cares about. Fire-and-forget — an outbox insert failure must not
  // block the admin action. commerce-email-flush cron sends on next tick.
  const template = STATUS_TO_TEMPLATE[parsed.data.status]
  if (template) {
    try {
      const order = await getOrder(businessId, id)
      const supabase = await createAdminClient()
      const { data: biz } = await supabase
        .from('businesses')
        .select('name, slug')
        .eq('id', businessId)
        .maybeSingle()
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://paragu-ai.com'
      const storeUrl = biz ? `${appUrl}/s/es/${biz.slug}/orden/${order.id}` : appUrl
      await enqueueOrderEmail({
        businessId,
        businessName: biz?.name ?? 'Tienda',
        orderId: order.id,
        template,
        order,
        storeUrl,
      })
    } catch (err) {
      log.warn('admin.commerce.order.customer_email_enqueue_failed', {
        orderId: id,
        status: parsed.data.status,
        err: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return NextResponse.json({ ok: true })
})
