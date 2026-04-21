import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import {
  updateShippingZone,
  deleteShippingZone,
  ShippingZoneInputSchema,
} from '@/lib/commerce/shipping-zones'

export const runtime = 'nodejs'

const PatchSchema = ShippingZoneInputSchema.partial()

export const PATCH = withRequestLog<{ businessId: string; zoneId: string }>(async (req, { log }, { businessId, zoneId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const zone = await updateShippingZone(businessId, zoneId, parsed.data)
    log.info('admin.commerce.shipping.updated', { businessId, zoneId })
    return NextResponse.json({ zone })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'update_failed' },
      { status: 500 },
    )
  }
})

export const DELETE = withRequestLog<{ businessId: string; zoneId: string }>(async (_req, { log }, { businessId, zoneId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    await deleteShippingZone(businessId, zoneId)
    log.info('admin.commerce.shipping.deleted', { businessId, zoneId })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'delete_failed' },
      { status: 500 },
    )
  }
})
