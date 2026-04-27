import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdminUser } from '@/lib/commerce/admin-auth'

export const runtime = 'nodejs'

// 15-minute signed URL — long enough to render in the admin UI and
// click through to full-size, short enough that a leaked URL decays
// fast. The bucket is private; we create a new signed URL each time
// the admin page renders.
const SIGNED_URL_TTL_SECONDS = 15 * 60

export const GET = withRequestLog<{ businessId: string; id: string }>(
  async (_req, { log }, { businessId, id }) => {
    const admin = await requireAdminUser()
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const supabase = await createAdminClient()
    const { data: order } = await supabase
      .from('orders')
      .select('comprobante_image_url')
      .eq('id', id)
      .eq('business_id', businessId)
      .maybeSingle()

    if (!order?.comprobante_image_url) {
      return NextResponse.json({ error: 'no_comprobante' }, { status: 404 })
    }

    const { data, error } = await supabase.storage
      .from('comprobantes')
      .createSignedUrl(order.comprobante_image_url, SIGNED_URL_TTL_SECONDS)

    if (error || !data?.signedUrl) {
      log.error('admin.commerce.comprobante_signed_url.failed', {
        orderId: id,
        error: error?.message,
      })
      return NextResponse.json({ error: 'sign_failed' }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  },
)
