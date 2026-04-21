import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import {
  listShippingZones,
  createShippingZone,
  ShippingZoneInputSchema,
} from '@/lib/commerce/shipping-zones'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ businessId: string }>(async (_req, _ctx, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const zones = await listShippingZones(businessId)
  return NextResponse.json({ zones })
})

export const POST = withRequestLog<{ businessId: string }>(async (req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = ShippingZoneInputSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const zone = await createShippingZone(businessId, parsed.data)
    log.info('admin.commerce.shipping.created', { businessId, zoneId: zone.id })
    return NextResponse.json({ zone })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'create_failed' },
      { status: 500 },
    )
  }
})
