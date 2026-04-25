import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { updateDiscount, deleteDiscount, DiscountInputShape } from '@/lib/commerce/discounts-admin'

export const runtime = 'nodejs'

const PatchSchema = DiscountInputShape.partial()

export const PATCH = withRequestLog<{ businessId: string; id: string }>(async (req, { log }, { businessId, id }) => {
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
    const discount = await updateDiscount(businessId, id, parsed.data)
    log.info('admin.commerce.discount.updated', { businessId, id })
    return NextResponse.json({ discount })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'update_failed' },
      { status: 500 },
    )
  }
})

export const DELETE = withRequestLog<{ businessId: string; id: string }>(async (_req, { log }, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    await deleteDiscount(businessId, id)
    log.info('admin.commerce.discount.deleted', { businessId, id })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'delete_failed' },
      { status: 500 },
    )
  }
})
