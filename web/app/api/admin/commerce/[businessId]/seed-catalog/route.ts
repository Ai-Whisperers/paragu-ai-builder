import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { seedCatalog } from '@/lib/commerce/seed-catalog'
import { requireAdminUser } from '@/lib/commerce/admin-auth'

export const runtime = 'nodejs'

export const POST = withRequestLog<{ businessId: string }>(async (_req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const supabase = await createAdminClient()
  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, type')
    .eq('id', businessId)
    .maybeSingle()

  if (error || !business) {
    return NextResponse.json({ error: 'business_not_found' }, { status: 404 })
  }

  const count = await seedCatalog(businessId, business.type)
  log.info('admin.commerce.seed_catalog.done', { businessId, businessType: business.type, count })
  return NextResponse.json({ count })
})
