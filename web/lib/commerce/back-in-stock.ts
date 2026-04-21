import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

/**
 * Shopper-facing subscribe: records an email against a product so we
 * can notify when inventory returns. Idempotent on (business_id, product_id, email)
 * thanks to the UNIQUE constraint — a duplicate is a no-op.
 */
export async function subscribeBackInStock(opts: {
  businessId: string
  productId: string
  email: string
  locale?: string
}): Promise<{ ok: true } | { ok: false; code: 'invalid_email' | 'insert_failed' }> {
  const email = opts.email.trim().toLowerCase()
  if (!email.includes('@') || email.length > 200) {
    return { ok: false, code: 'invalid_email' }
  }
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('back_in_stock_subscriptions')
    .upsert(
      {
        business_id: opts.businessId,
        product_id: opts.productId,
        email,
        locale: opts.locale ?? 'es',
        notified_at: null,
      },
      { onConflict: 'business_id,product_id,email', ignoreDuplicates: true },
    )
  if (error) {
    logger.warn('[back-in-stock] subscribe failed', {
      action: 'commerce.back_in_stock.subscribe_failed',
      businessId: opts.businessId,
      productId: opts.productId,
      error: error.message,
    })
    return { ok: false, code: 'insert_failed' }
  }
  return { ok: true }
}

export interface PendingSubscription {
  subscriptionId: string
  businessId: string
  productId: string
  productName: string
  productSlug: string
  productUrl: string
  email: string
  locale: string
}

/**
 * Scan for subscriptions on products that are currently back in stock
 * (inventory_qty > 0 OR policy = 'continue'). Paginated externally via
 * the cron that calls this. Returns the payload the email renderer
 * needs, not the raw row.
 */
export async function findPendingBackInStockNotifications(limit = 50): Promise<PendingSubscription[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('back_in_stock_subscriptions')
    .select(
      `
      id, business_id, product_id, email, locale,
      products!inner (
        slug, name, inventory_qty, inventory_policy, status
      ),
      businesses!inner (
        slug
      )
    `,
    )
    .is('notified_at', null)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) {
    logger.error('[back-in-stock] pending scan failed', {
      action: 'commerce.back_in_stock.scan_failed',
      error: error.message,
    })
    return []
  }
  // PostgREST embedded joins come back as arrays even for single-row
  // relations when declared without `!inner`-style hints. Accept both
  // shapes (object | array) defensively.
  type EmbeddedProduct = { slug: string; name: string; inventory_qty: number; inventory_policy: string; status: string }
  type EmbeddedBusiness = { slug: string }
  const rows = (Array.isArray(data) ? data : []) as Array<{
    id: string
    business_id: string
    product_id: string
    email: string
    locale: string
    products: EmbeddedProduct | EmbeddedProduct[] | null
    businesses: EmbeddedBusiness | EmbeddedBusiness[] | null
  }>

  const pickOne = <T,>(v: T | T[] | null): T | null => {
    if (!v) return null
    return Array.isArray(v) ? v[0] ?? null : v
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://paragu-ai.com'

  return rows
    .map((r) => ({ raw: r, product: pickOne(r.products), business: pickOne(r.businesses) }))
    .filter(({ product, business }) => {
      if (!product || !business || product.status !== 'active') return false
      return product.inventory_policy === 'continue' || product.inventory_qty > 0
    })
    .map(({ raw, product, business }) => ({
      subscriptionId: raw.id,
      businessId: raw.business_id,
      productId: raw.product_id,
      productName: product!.name,
      productSlug: product!.slug,
      productUrl: `${appUrl}/s/${raw.locale}/${business!.slug}/producto/${product!.slug}`,
      email: raw.email,
      locale: raw.locale,
    }))
}

/** Mark a subscription as notified. Idempotent. */
export async function markNotified(subscriptionId: string): Promise<void> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('back_in_stock_subscriptions')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', subscriptionId)
  if (error) {
    logger.warn('[back-in-stock] markNotified failed', {
      action: 'commerce.back_in_stock.mark_notified_failed',
      subscriptionId,
      error: error.message,
    })
  }
}
