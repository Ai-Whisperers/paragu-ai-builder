import { randomBytes } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import { logger } from '@/lib/logger'
import type { Cart, CartItem } from '@/lib/schemas/commerce/cart'

export function newSessionToken(): string {
  return randomBytes(24).toString('base64url')
}

interface CartRow {
  id: string
  business_id: string
  user_id: string | null
  session_token: string | null
  status: string
  currency: string
  expires_at: string
  created_at: string
  updated_at: string
}

interface CartItemRow {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  unit_price_cents: number
  created_at: string
}

function rowToCart(row: CartRow, items: CartItem[]): Cart {
  return {
    id: row.id,
    businessId: row.business_id,
    userId: row.user_id,
    sessionToken: row.session_token,
    status: row.status as Cart['status'],
    currency: row.currency,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  }
}

function rowToCartItem(row: CartItemRow): CartItem {
  return {
    id: row.id,
    cartId: row.cart_id,
    productId: row.product_id,
    quantity: row.quantity,
    unitPriceCents: row.unit_price_cents,
    createdAt: row.created_at,
  }
}

export async function getOrCreateCart(
  businessId: string,
  opts: { sessionToken?: string; userId?: string; currency?: string } = {},
): Promise<Cart> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)

  if (opts.userId) {
    const { data } = await scoped.select<CartRow>('carts', '*', {
      filter: (q) => q.eq('user_id', opts.userId!).eq('status', 'open').limit(1),
    })
    const row = Array.isArray(data) ? data[0] : data
    if (row) return rowToCart(row, await fetchItems(businessId, row.id))
  }

  if (opts.sessionToken) {
    const { data } = await scoped.select<CartRow>('carts', '*', {
      filter: (q) => q.eq('session_token', opts.sessionToken!).eq('status', 'open').limit(1),
    })
    const row = Array.isArray(data) ? data[0] : data
    if (row) return rowToCart(row, await fetchItems(businessId, row.id))
  }

  const sessionToken = opts.sessionToken ?? newSessionToken()
  const { data, error } = await scoped.insert<CartRow>('carts', {
    user_id: opts.userId ?? null,
    session_token: opts.userId ? null : sessionToken,
    currency: opts.currency ?? 'PYG',
  })
  if (error || !data?.[0]) {
    logger.error('[commerce] getOrCreateCart failed', { action: 'commerce.cart.create', businessId, error: error?.message })
    throw new Error('cart_create_failed')
  }
  return rowToCart(data[0], [])
}

interface CartItemRowJoined extends CartItemRow {
  products?: {
    name: string | null
    slug: string | null
    images: Array<{ url?: string; isCover?: boolean }> | null
  } | null
}

async function fetchItems(businessId: string, cartId: string): Promise<CartItem[]> {
  const supabase = await createAdminClient()
  // Single query with embedded product join — we need name/slug/cover image
  // so the cart drawer can render "Remera azul talle M" instead of a UUID
  // fragment. PostgREST syntax: `products(name, slug, images)` embeds the
  // related row via the product_id FK.
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(name, slug, images)')
    .eq('cart_id', cartId)
    .eq('business_id', businessId)
    .order('created_at')
  if (error) {
    logger.error('[commerce] fetchItems failed', { action: 'commerce.cart.items', cartId, error: error.message })
    return []
  }
  return (Array.isArray(data) ? data : []).map((row) => {
    const joined = row as CartItemRowJoined
    const cover = joined.products?.images?.find((i) => i?.isCover) ?? joined.products?.images?.[0]
    return {
      ...rowToCartItem(joined),
      productName: joined.products?.name ?? null,
      productSlug: joined.products?.slug ?? null,
      productImageUrl: cover?.url ?? null,
    }
  })
}

export async function addItem(
  businessId: string,
  cartId: string,
  productId: string,
  quantity: number,
): Promise<Cart> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)

  // Read live product price + availability
  const { data: product, error: productError } = await scoped.select<{ id: string; price_cents: number; inventory_qty: number; inventory_policy: string; status: string }>(
    'products',
    'id, price_cents, inventory_qty, inventory_policy, status',
    { filter: (q) => q.eq('id', productId).limit(1) },
  )
  const productRow = Array.isArray(product) ? product[0] : product
  if (productError || !productRow) throw new Error('product_not_found')
  if (productRow.status !== 'active') throw new Error('product_inactive')
  if (productRow.inventory_policy === 'deny' && productRow.inventory_qty < quantity) {
    throw new Error('out_of_stock')
  }

  // Upsert cart_item — increment quantity if present
  const { data: existingItems } = await scoped.select<CartItemRow>('cart_items', '*', {
    filter: (q) => q.eq('cart_id', cartId).eq('product_id', productId).limit(1),
  })
  const existing = Array.isArray(existingItems) ? existingItems[0] : existingItems

  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, unit_price_cents: productRow.price_cents })
      .eq('id', existing.id)
      .eq('business_id', businessId)
  } else {
    await scoped.insert('cart_items', {
      cart_id: cartId,
      product_id: productId,
      quantity,
      unit_price_cents: productRow.price_cents,
    })
  }

  // Touch cart so updated_at moves
  await supabase.from('carts').update({ updated_at: new Date().toISOString() }).eq('id', cartId).eq('business_id', businessId)

  return getCartById(businessId, cartId)
}

export async function updateItem(
  businessId: string,
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<Cart> {
  const supabase = await createAdminClient()
  if (quantity === 0) {
    await supabase.from('cart_items').delete().eq('id', itemId).eq('cart_id', cartId).eq('business_id', businessId)
  } else {
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId).eq('cart_id', cartId).eq('business_id', businessId)
  }
  return getCartById(businessId, cartId)
}

export async function removeItem(businessId: string, cartId: string, itemId: string): Promise<Cart> {
  const supabase = await createAdminClient()
  await supabase.from('cart_items').delete().eq('id', itemId).eq('cart_id', cartId).eq('business_id', businessId)
  return getCartById(businessId, cartId)
}

export async function getCartById(businessId: string, cartId: string): Promise<Cart> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data, error } = await scoped.select<CartRow>('carts', '*', {
    filter: (q) => q.eq('id', cartId).limit(1),
  })
  const row = Array.isArray(data) ? data[0] : data
  if (error || !row) throw new Error('cart_not_found')
  return rowToCart(row, await fetchItems(businessId, cartId))
}
