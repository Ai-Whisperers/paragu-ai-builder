import { createAdminClient } from '@/lib/supabase/admin'
import type { Review, ReviewAggregate, ReviewCreate } from '@/lib/schemas/commerce/review'
import { logger } from '@/lib/logger'

interface ReviewRow {
  id: string
  business_id: string
  product_id: string
  author_name: string
  author_email: string | null
  rating: number
  title: string | null
  content: string
  is_verified_purchase: boolean | null
  is_approved: boolean | null
  created_at: string
  updated_at: string
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    businessId: row.business_id,
    productId: row.product_id,
    authorName: row.author_name,
    authorEmail: row.author_email,
    rating: row.rating,
    title: row.title,
    content: row.content,
    isVerifiedPurchase: Boolean(row.is_verified_purchase),
    isApproved: Boolean(row.is_approved),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Public-facing list: approved only, newest first. */
export async function listApprovedReviews(
  businessId: string,
  productId: string,
  opts: { limit?: number } = {},
): Promise<Review[]> {
  const limit = opts.limit ?? 50
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    logger.error('[reviews] listApproved failed', {
      action: 'reviews.list_approved',
      businessId,
      productId,
      error: error.message,
    })
    return []
  }
  return (Array.isArray(data) ? data : []).map((r) => rowToReview(r as ReviewRow))
}

/**
 * Aggregate ratings for ALL active products of a tenant in one query.
 * Returns a Record<productId, { count, avg }> so product-card and tienda
 * can render stars without N+1 queries.
 *
 * Only counts approved reviews.
 */
export async function getReviewAggregatesByBusiness(
  businessId: string,
): Promise<Record<string, ReviewAggregate>> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('product_id, rating')
    .eq('business_id', businessId)
    .eq('is_approved', true)
  if (error) {
    logger.error('[reviews] aggregate query failed', {
      action: 'reviews.aggregate',
      businessId,
      error: error.message,
    })
    return {}
  }
  const acc: Record<string, { sum: number; count: number }> = {}
  for (const r of (Array.isArray(data) ? data : []) as Array<{ product_id: string; rating: number }>) {
    const existing = acc[r.product_id] ?? { sum: 0, count: 0 }
    existing.sum += r.rating
    existing.count += 1
    acc[r.product_id] = existing
  }
  const out: Record<string, ReviewAggregate> = {}
  for (const [productId, { sum, count }] of Object.entries(acc)) {
    out[productId] = { productId, count, avg: count > 0 ? sum / count : 0 }
  }
  return out
}

/**
 * Creates a pending (un-approved) review. Admin must approve before it
 * appears on the storefront. Spam is mitigated by the is_approved=false
 * default + rate limiting at the API boundary.
 */
export async function createReview(
  businessId: string,
  input: ReviewCreate,
): Promise<Review | null> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      business_id: businessId,
      product_id: input.productId,
      author_name: input.authorName,
      author_email: input.authorEmail ?? null,
      rating: input.rating,
      title: input.title ?? null,
      content: input.content,
      is_verified_purchase: false,
      is_approved: false,
    })
    .select('*')
    .single()
  if (error || !data) {
    logger.error('[reviews] create failed', {
      action: 'reviews.create',
      businessId,
      productId: input.productId,
      error: error?.message ?? 'no data',
    })
    return null
  }
  return rowToReview(data as ReviewRow)
}
