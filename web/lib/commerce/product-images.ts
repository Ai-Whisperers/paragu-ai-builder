import { randomUUID } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import type { Product, ProductImage } from '@/lib/schemas/commerce/product'

const BUCKET = 'commerce-products'
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB — must match the bucket policy
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export class UploadError extends Error {
  constructor(public code: string, message?: string) {
    super(message ?? code)
    this.name = 'UploadError'
  }
}

function extensionFor(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      return 'bin'
  }
}

/**
 * Uploads a single image file (already received server-side as a Buffer) to
 * the commerce-products bucket and appends it to products.images.
 *
 * Path convention: {business_id}/{product_id}/{uuid}.{ext}. Knowing business_id
 * + product_id in the path makes orphan cleanup trivial and prevents a later
 * migration to a different path convention from breaking existing URLs.
 */
export async function uploadProductImage(opts: {
  businessId: string
  productId: string
  fileName: string
  mimeType: string
  data: Buffer
  isCover?: boolean
  alt?: string
}): Promise<Product> {
  if (!ALLOWED_MIME.has(opts.mimeType)) {
    throw new UploadError('unsupported_mime_type', `Mime ${opts.mimeType} not allowed`)
  }
  if (opts.data.byteLength > MAX_FILE_BYTES) {
    throw new UploadError('file_too_large', `Max ${MAX_FILE_BYTES} bytes`)
  }

  const supabase = await createAdminClient()

  // Verify ownership — the admin API caller is trusted, but we still enforce
  // business_id scoping defensively so a path-traversal or bad-input bug
  // can't upload under the wrong tenant.
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, business_id, images')
    .eq('id', opts.productId)
    .eq('business_id', opts.businessId)
    .maybeSingle()

  if (productError || !product) {
    throw new UploadError('product_not_found')
  }

  const id = randomUUID()
  const ext = extensionFor(opts.mimeType)
  const path = `${opts.businessId}/${opts.productId}/${id}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, opts.data, {
      contentType: opts.mimeType,
      cacheControl: '31536000', // 1 year — objects are content-addressed by uuid
      upsert: false,
    })

  if (uploadError) {
    logger.error('[commerce] image upload failed', {
      action: 'commerce.image.upload_failed',
      businessId: opts.businessId,
      productId: opts.productId,
      error: uploadError.message,
    })
    throw new UploadError('storage_upload_failed', uploadError.message)
  }

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path)

  // Append to images array. If the new image is marked cover, unset other covers.
  const current = Array.isArray(product.images) ? (product.images as ProductImage[]) : []
  const newImage: ProductImage = {
    url: publicUrl.publicUrl,
    alt: opts.alt,
    isCover: opts.isCover ?? current.length === 0, // first image becomes cover by default
  }
  const updated: ProductImage[] = newImage.isCover
    ? [newImage, ...current.map((i) => ({ ...i, isCover: false }))]
    : [...current, newImage]

  const { data: row, error: updateError } = await supabase
    .from('products')
    .update({ images: updated })
    .eq('id', opts.productId)
    .eq('business_id', opts.businessId)
    .select('*')
    .single()

  if (updateError || !row) {
    // Roll back the upload so we don't leave orphans in the bucket.
    await supabase.storage.from(BUCKET).remove([path])
    logger.error('[commerce] image DB update failed, storage rolled back', {
      action: 'commerce.image.db_update_failed',
      businessId: opts.businessId,
      productId: opts.productId,
      error: updateError?.message,
    })
    throw new UploadError('product_update_failed', updateError?.message)
  }

  logger.info('[commerce] image uploaded', {
    action: 'commerce.image.uploaded',
    businessId: opts.businessId,
    productId: opts.productId,
    path,
    size: opts.data.byteLength,
  })

  return dbRowToProduct(row)
}

/**
 * Remove an image by URL. Deletes from both the bucket (best-effort) and the
 * products.images JSONB. The URL is parsed to extract the storage path —
 * public URLs look like
 *   https://<ref>.supabase.co/storage/v1/object/public/commerce-products/<path>
 */
export async function deleteProductImage(opts: {
  businessId: string
  productId: string
  url: string
}): Promise<Product> {
  const supabase = await createAdminClient()

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, business_id, images')
    .eq('id', opts.productId)
    .eq('business_id', opts.businessId)
    .maybeSingle()

  if (productError || !product) {
    throw new UploadError('product_not_found')
  }

  const current = Array.isArray(product.images) ? (product.images as ProductImage[]) : []
  const remaining = current.filter((i) => i.url !== opts.url)

  // Extract storage path from public URL. If the URL doesn't parse cleanly
  // (e.g., external image that was pasted in manually), we skip the bucket
  // delete but still remove it from the JSONB.
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const markerIdx = opts.url.indexOf(marker)
  if (markerIdx !== -1) {
    const path = opts.url.slice(markerIdx + marker.length)
    // Only delete objects under this business's own prefix — belt-and-suspenders.
    if (path.startsWith(`${opts.businessId}/${opts.productId}/`)) {
      await supabase.storage.from(BUCKET).remove([path])
    }
  }

  // If the removed image was the cover and we have others, promote the first
  // remaining image to cover.
  if (current.find((i) => i.url === opts.url)?.isCover && remaining.length > 0) {
    remaining[0] = { ...remaining[0], isCover: true }
  }

  const { data: row, error: updateError } = await supabase
    .from('products')
    .update({ images: remaining })
    .eq('id', opts.productId)
    .eq('business_id', opts.businessId)
    .select('*')
    .single()

  if (updateError || !row) throw new UploadError('product_update_failed', updateError?.message)
  return dbRowToProduct(row)
}

/** Sets a specific URL as cover; unsets others. */
export async function setCoverImage(opts: {
  businessId: string
  productId: string
  url: string
}): Promise<Product> {
  const supabase = await createAdminClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('images')
    .eq('id', opts.productId)
    .eq('business_id', opts.businessId)
    .maybeSingle()

  if (error || !product) throw new UploadError('product_not_found')
  const current = Array.isArray(product.images) ? (product.images as ProductImage[]) : []
  if (!current.some((i) => i.url === opts.url)) throw new UploadError('image_not_found')

  const updated = current.map((i) => ({ ...i, isCover: i.url === opts.url }))
  // Stable sort: move the cover to the front so storefront galleries render it first.
  updated.sort((a, b) => Number(b.isCover ?? false) - Number(a.isCover ?? false))

  const { data: row, error: updateError } = await supabase
    .from('products')
    .update({ images: updated })
    .eq('id', opts.productId)
    .eq('business_id', opts.businessId)
    .select('*')
    .single()
  if (updateError || !row) throw new UploadError('product_update_failed', updateError?.message)
  return dbRowToProduct(row)
}

function dbRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string | null) ?? null,
    category: (row.category as string | null) ?? null,
    priceCents: row.price_cents as number,
    compareAtPriceCents: (row.compare_at_price_cents as number | null) ?? null,
    currency: row.currency as string,
    sku: (row.sku as string | null) ?? null,
    inventoryQty: row.inventory_qty as number,
    inventoryPolicy: row.inventory_policy as Product['inventoryPolicy'],
    lowStockThreshold: (row.low_stock_threshold as number | null) ?? null,
    images: (row.images as ProductImage[]) ?? [],
    weightGrams: (row.weight_grams as number | null) ?? null,
    status: row.status as Product['status'],
    isSeed: (row.is_seed as boolean) ?? false,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
