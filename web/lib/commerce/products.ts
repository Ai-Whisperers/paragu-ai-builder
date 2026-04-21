import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import type { Product, ProductCreate, ProductUpdate } from '@/lib/schemas/commerce/product'

interface ProductRow {
  id: string
  business_id: string
  slug: string
  name: string
  description: string | null
  category: string | null
  price_cents: number
  compare_at_price_cents: number | null
  currency: string
  sku: string | null
  inventory_qty: number
  inventory_policy: 'deny' | 'continue'
  low_stock_threshold: number | null
  images: unknown[]
  weight_grams: number | null
  status: 'active' | 'draft' | 'archived'
  is_seed: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    businessId: row.business_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category,
    priceCents: row.price_cents,
    compareAtPriceCents: row.compare_at_price_cents,
    currency: row.currency,
    sku: row.sku,
    inventoryQty: row.inventory_qty,
    inventoryPolicy: row.inventory_policy,
    lowStockThreshold: row.low_stock_threshold,
    images: (row.images as Product['images']) ?? [],
    weightGrams: row.weight_grams,
    status: row.status,
    isSeed: row.is_seed,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listActiveProducts(
  businessId: string,
  opts: { category?: string; limit?: number; offset?: number } = {},
): Promise<Product[]> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data } = await scoped.select<ProductRow>('products', '*', {
    filter: (q) => {
      let query = q.eq('status', 'active').order('created_at', { ascending: false })
      if (opts.category) query = query.eq('category', opts.category)
      if (opts.limit) query = query.limit(opts.limit)
      if (opts.offset) query = query.range(opts.offset, (opts.offset ?? 0) + (opts.limit ?? 50) - 1)
      return query
    },
  })
  return (Array.isArray(data) ? data : []).map(rowToProduct)
}

export async function getProductBySlug(businessId: string, slug: string): Promise<Product | null> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data } = await scoped.select<ProductRow>('products', '*', {
    filter: (q) => q.eq('slug', slug).limit(1),
  })
  const row = Array.isArray(data) ? data[0] : data
  return row ? rowToProduct(row) : null
}

export async function createProduct(
  businessId: string,
  input: ProductCreate & { isSeed?: boolean },
): Promise<Product> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data, error } = await scoped.insert<ProductRow>('products', {
    slug: input.slug,
    name: input.name,
    description: input.description ?? null,
    category: input.category ?? null,
    price_cents: input.priceCents,
    compare_at_price_cents: input.compareAtPriceCents ?? null,
    currency: input.currency,
    sku: input.sku ?? null,
    inventory_qty: input.inventoryQty,
    inventory_policy: input.inventoryPolicy,
    low_stock_threshold: input.lowStockThreshold ?? 3,
    images: input.images,
    weight_grams: input.weightGrams ?? null,
    status: input.status,
    is_seed: input.isSeed ?? false,
    metadata: input.metadata,
  })
  if (error || !data?.[0]) throw new Error(error?.message ?? 'product_create_failed')
  return rowToProduct(data[0])
}

export async function updateProduct(
  businessId: string,
  productId: string,
  patch: ProductUpdate,
): Promise<Product> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)

  const dbPatch: Record<string, unknown> = {}
  if (patch.slug !== undefined) dbPatch.slug = patch.slug
  if (patch.name !== undefined) dbPatch.name = patch.name
  if (patch.description !== undefined) dbPatch.description = patch.description
  if (patch.category !== undefined) dbPatch.category = patch.category
  if (patch.priceCents !== undefined) dbPatch.price_cents = patch.priceCents
  if (patch.compareAtPriceCents !== undefined) dbPatch.compare_at_price_cents = patch.compareAtPriceCents
  if (patch.currency !== undefined) dbPatch.currency = patch.currency
  if (patch.sku !== undefined) dbPatch.sku = patch.sku
  if (patch.inventoryQty !== undefined) dbPatch.inventory_qty = patch.inventoryQty
  if (patch.inventoryPolicy !== undefined) dbPatch.inventory_policy = patch.inventoryPolicy
  if (patch.lowStockThreshold !== undefined) dbPatch.low_stock_threshold = patch.lowStockThreshold
  if (patch.images !== undefined) dbPatch.images = patch.images
  if (patch.weightGrams !== undefined) dbPatch.weight_grams = patch.weightGrams
  if (patch.status !== undefined) dbPatch.status = patch.status
  if (patch.metadata !== undefined) dbPatch.metadata = patch.metadata

  const { data, error } = await scoped.update<ProductRow>('products', dbPatch, (q) => q.eq('id', productId))
  if (error || !data?.[0]) throw new Error(error?.message ?? 'product_update_failed')
  return rowToProduct(data[0])
}
