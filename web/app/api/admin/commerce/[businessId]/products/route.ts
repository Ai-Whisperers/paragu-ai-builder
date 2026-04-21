import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { ProductCreateSchema } from '@/lib/schemas/commerce/product'
import { createProduct } from '@/lib/commerce/products'
import { requireAdminUser } from '@/lib/commerce/admin-auth'

export const runtime = 'nodejs'

export const POST = withRequestLog<{ businessId: string }>(async (req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = ProductCreateSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const product = await createProduct(businessId, parsed.data)
    log.info('admin.commerce.product.created', { businessId, productId: product.id })
    return NextResponse.json({ product })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'create_failed'
    const status = message.includes('duplicate') || message.includes('unique') ? 409 : 400
    return NextResponse.json({ error: message }, { status })
  }
})
