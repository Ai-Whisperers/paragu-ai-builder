import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import {
  listDiscounts,
  createDiscount,
  DiscountInputSchema,
} from '@/lib/commerce/discounts-admin'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ businessId: string }>(async (_req, _ctx, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const discounts = await listDiscounts(businessId)
  return NextResponse.json({ discounts })
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
  const parsed = DiscountInputSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  try {
    const discount = await createDiscount(businessId, parsed.data)
    log.info('admin.commerce.discount.created', { businessId, code: discount.code })
    return NextResponse.json({ discount })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'create_failed'
    const status = message === 'code_already_exists' ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
})
