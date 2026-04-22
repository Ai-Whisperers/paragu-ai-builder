import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

// Max body size handled via the multipart/form-data parse; the bucket
// itself enforces 5MB at the storage layer.
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
const MAX_BYTES = 5 * 1024 * 1024

function extForMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'application/pdf') return 'pdf'
  return 'bin'
}

export const POST = withRequestLog<{ site: string; id: string }>(
  async (req, { log }, { site, id }) => {
    const business = await resolveBusinessBySlug(site)
    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const form = await req.formData().catch(() => null)
    if (!form) return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'missing_file' }, { status: 400 })
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: 'unsupported_mime' }, { status: 415 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'file_too_large', maxBytes: MAX_BYTES }, { status: 413 })
    }

    const supabase = await createAdminClient()

    // Confirm the order exists + belongs to this business before writing.
    // Avoids a random shopper dumping files into other tenants' paths.
    const { data: order } = await supabase
      .from('orders')
      .select('id, business_id, order_number, comprobante_image_url')
      .eq('id', id)
      .eq('business_id', business.id)
      .maybeSingle()
    if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })

    const ext = extForMime(file.type)
    const ts = Date.now()
    const path = `${business.id}/${order.id}/${ts}.${ext}`

    const buf = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await supabase.storage.from('comprobantes').upload(path, buf, {
      contentType: file.type,
      upsert: false,
    })
    if (uploadError) {
      log.error('commerce.comprobante_upload.failed', {
        orderId: id,
        error: uploadError.message,
      })
      return NextResponse.json({ error: 'upload_failed' }, { status: 500 })
    }

    // Mark order as comprobante-sent and persist the storage path.
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        comprobante_image_url: path,
        comprobante_uploaded_at: new Date().toISOString(),
        comprobante_sent_at: order.comprobante_image_url
          ? undefined // preserve earlier sent-at if reuploading
          : new Date().toISOString(),
      })
      .eq('id', id)
      .eq('business_id', business.id)
    if (updateError) {
      log.error('commerce.comprobante_upload.db_update_failed', {
        orderId: id,
        error: updateError.message,
      })
      // File uploaded but DB didn't update — still return ok, the admin
      // can recover via the storage path if needed. Logging is enough.
    }

    log.info('commerce.comprobante_upload.ok', {
      orderId: id,
      orderNumber: order.order_number,
      path,
      size: file.size,
    })

    return NextResponse.json({ ok: true })
  },
)
