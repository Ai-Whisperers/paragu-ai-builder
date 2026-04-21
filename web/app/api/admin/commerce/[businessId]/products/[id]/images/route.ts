import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import {
  uploadProductImage,
  deleteProductImage,
  setCoverImage,
  UploadError,
} from '@/lib/commerce/product-images'

export const runtime = 'nodejs'

const uploadErrorStatus: Record<string, number> = {
  unsupported_mime_type: 415,
  file_too_large: 413,
  product_not_found: 404,
  image_not_found: 404,
  storage_upload_failed: 502,
  product_update_failed: 500,
}

/**
 * POST — upload one image (multipart/form-data, field "file").
 * Optional form fields: alt, isCover ("true"/"false").
 */
export const POST = withRequestLog<{ businessId: string; id: string }>(async (req, { log }, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'invalid_multipart' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 })
  }

  const alt = (form.get('alt') as string | null) ?? undefined
  const isCover = String(form.get('isCover') ?? '').toLowerCase() === 'true'

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const product = await uploadProductImage({
      businessId,
      productId: id,
      fileName: file.name,
      mimeType: file.type,
      data: buffer,
      alt,
      isCover,
    })
    log.info('admin.commerce.image.uploaded', { businessId, productId: id, size: buffer.byteLength })
    return NextResponse.json({ product })
  } catch (err) {
    if (err instanceof UploadError) {
      const status = uploadErrorStatus[err.code] ?? 400
      return NextResponse.json({ error: err.code, message: err.message }, { status })
    }
    throw err
  }
})

const DeleteSchema = z.object({ url: z.string().url() })

export const DELETE = withRequestLog<{ businessId: string; id: string }>(async (req, { log }, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = DeleteSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const product = await deleteProductImage({ businessId, productId: id, url: parsed.data.url })
    log.info('admin.commerce.image.deleted', { businessId, productId: id })
    return NextResponse.json({ product })
  } catch (err) {
    if (err instanceof UploadError) {
      const status = uploadErrorStatus[err.code] ?? 400
      return NextResponse.json({ error: err.code }, { status })
    }
    throw err
  }
})

const PatchSchema = z.object({
  action: z.literal('set_cover'),
  url: z.string().url(),
})

export const PATCH = withRequestLog<{ businessId: string; id: string }>(async (req, _ctx, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'validation' }, { status: 400 })

  try {
    const product = await setCoverImage({ businessId, productId: id, url: parsed.data.url })
    return NextResponse.json({ product })
  } catch (err) {
    if (err instanceof UploadError) {
      const status = uploadErrorStatus[err.code] ?? 400
      return NextResponse.json({ error: err.code }, { status })
    }
    throw err
  }
})
