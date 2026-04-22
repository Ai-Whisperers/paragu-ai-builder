import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { transitionStatus, getOrder } from '@/lib/commerce/orders'
import { enqueueOrderEmail } from '@/lib/commerce/notifications'
import { recordOrderEvent } from '@/lib/commerce/order-events'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

// Accept up to 100 order ids in one call. A merchant confirming a
// morning's batch of transfers shouldn't fire 20 separate POSTs.
const BodySchema = z.object({
  orderIds: z.array(z.string().uuid()).min(1).max(100),
})

export const POST = withRequestLog<{ businessId: string }>(
  async (req, { log }, { businessId }) => {
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
      return NextResponse.json({ error: 'validation' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: biz } = await supabase
      .from('businesses')
      .select('name, slug')
      .eq('id', businessId)
      .maybeSingle()
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://paragu-ai.com'

    const results: Array<{ orderId: string; ok: boolean; error?: string }> = []

    // Sequential on purpose: each transition fires an email + audit row,
    // we'd rather 50 linear queries than 50 parallel race conditions
    // against the state machine.
    for (const orderId of parsed.data.orderIds) {
      try {
        await transitionStatus(businessId, orderId, 'paid')
        const order = await getOrder(businessId, orderId)
        const storeUrl = biz ? `${appUrl}/s/es/${biz.slug}/orden/${order.id}` : appUrl
        await Promise.all([
          enqueueOrderEmail({
            businessId,
            businessName: biz?.name ?? 'Tienda',
            orderId: order.id,
            template: 'order_paid',
            order,
            storeUrl,
          }),
          recordOrderEvent({
            businessId,
            orderId: order.id,
            eventType: 'status_changed',
            actorId: admin.userId,
            actorLabel: admin.email ?? null,
            toStatus: 'paid',
            note: 'Bulk confirm',
          }),
        ])
        results.push({ orderId, ok: true })
      } catch (err) {
        results.push({
          orderId,
          ok: false,
          error: err instanceof Error ? err.message : 'unknown',
        })
      }
    }

    const ok = results.filter((r) => r.ok).length
    const failed = results.length - ok
    log.info('admin.commerce.bulk_confirm_paid.done', { businessId, ok, failed })
    return NextResponse.json({ ok, failed, results })
  },
)
