import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { transitionStatus, CheckoutError } from '@/lib/commerce/orders'
import { OrderStatusSchema } from '@/lib/schemas/commerce/order'
import { requireAdminUser } from '@/lib/commerce/admin-auth'

export const runtime = 'nodejs'

const BodySchema = z.object({ status: OrderStatusSchema })

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
    await transitionStatus(businessId, id, parsed.data.status)
    log.info('admin.commerce.order.transitioned', { businessId, orderId: id, status: parsed.data.status })
    return NextResponse.json({ ok: true })
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
})
