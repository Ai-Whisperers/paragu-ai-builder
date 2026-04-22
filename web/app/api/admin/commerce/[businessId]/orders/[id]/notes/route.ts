import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { recordOrderEvent } from '@/lib/commerce/order-events'

export const runtime = 'nodejs'

const BodySchema = z.object({
  note: z.string().trim().min(1).max(500),
})

export const POST = withRequestLog<{ businessId: string; id: string }>(
  async (req, { log }, { businessId, id }) => {
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

    await recordOrderEvent({
      businessId,
      orderId: id,
      eventType: 'note_added',
      actorId: admin.id,
      actorLabel: admin.email ?? null,
      note: parsed.data.note,
    })

    log.info('admin.commerce.order.note_added', { businessId, orderId: id })
    return NextResponse.json({ ok: true })
  },
)
