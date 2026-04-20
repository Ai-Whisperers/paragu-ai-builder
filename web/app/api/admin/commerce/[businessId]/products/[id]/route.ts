import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { ProductUpdateSchema } from '@/lib/schemas/commerce/product'
import { updateProduct } from '@/lib/commerce/products'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdminUser } from '@/lib/commerce/admin-auth'

export const runtime = 'nodejs'

export const PATCH = withRequestLog<{ businessId: string; id: string }>(async (req, { log }, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = ProductUpdateSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const product = await updateProduct(businessId, id, parsed.data)
    log.info('admin.commerce.product.updated', { businessId, productId: id })
    return NextResponse.json({ product })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'update_failed' }, { status: 400 })
  }
})

export const DELETE = withRequestLog<{ businessId: string; id: string }>(async (_req, { log }, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('business_id', businessId)

  if (error) {
    log.error('admin.commerce.product.delete_failed', new Error(error.message))
    return NextResponse.json({ error: 'delete_failed' }, { status: 400 })
  }
  log.info('admin.commerce.product.deleted', { businessId, productId: id })
  return NextResponse.json({ ok: true })
})
