import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import type { Product, ProductCreate, ProductUpdate } from '@/lib/schemas/commerce/product'
import { normalizeSearchTerm } from './search-normalize'

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

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'name-asc'

export interface ListActiveProductsOpts {
  category?: string
  limit?: number
  offset?: number
  /** Free-text search — matches name OR description OR SKU (ilike). Empty string is no filter. */
  search?: string
  /** Sort order. Defaults to 'newest'. */
  sort?: ProductSort
  /** Price floor (cents, inclusive). */
  minPriceCents?: number
  /** Price ceiling (cents, inclusive). */
  maxPriceCents?: number
  /** Only return products currently in stock (inventory_qty > 0 OR inventory_policy='continue'). */
  inStockOnly?: boolean
  /** Only return products with compare_at_price > price (= on sale). */
  onSaleOnly?: boolean
}

const SORT_FIELDS: Record<ProductSort, { column: string; ascending: boolean }> = {
  newest: { column: 'created_at', ascending: false },
  'price-asc': { column: 'price_cents', ascending: true },
  'price-desc': { column: 'price_cents', ascending: false },
  'name-asc': { column: 'name', ascending: true },
}

/**
 * Escape a user-supplied search term so % / _ / \ aren't interpreted as
 * ilike wildcards. PostgREST's `.or()` uses comma-separated filter specs
 * so we also reject `,` inside the pattern to avoid breaking the spec.
 */
function escapeIlike(raw: string): string {
  return raw.replace(/[\\%_,]/g, (ch) => `\\${ch}`)
}

export async function listActiveProducts(
  businessId: string,
  opts: ListActiveProductsOpts = {},
): Promise<Product[]> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const sortKey = opts.sort && SORT_FIELDS[opts.sort] ? opts.sort : 'newest'
  const sort = SORT_FIELDS[sortKey]
  const { data } = await scoped.select<ProductRow>('products', '*', {
    filter: (q) => {
      let query = q.eq('status', 'active').order(sort.column, { ascending: sort.ascending })
      if (opts.category) query = query.eq('category', opts.category)
      if (opts.search && opts.search.trim()) {
        // Accent-insensitive search. The DB carries a generated
        // `search_haystack` column = lower(unaccent(name+desc+sku)). We
        // normalize the user's input to the same shape (NFD strip +
        // lowercase) and ilike against the haystack, so "uñas" matches
        // stored "unas" and vice versa. Backed by a GIN trgm index.
        const normalized = normalizeSearchTerm(opts.search)
        const pat = `%${escapeIlike(normalized)}%`
        query = query.ilike('search_haystack', pat)
      }
      if (typeof opts.minPriceCents === 'number') query = query.gte('price_cents', opts.minPriceCents)
      if (typeof opts.maxPriceCents === 'number') query = query.lte('price_cents', opts.maxPriceCents)
      if (opts.inStockOnly) {
        // Either policy allows backorder OR we have positive inventory.
        query = query.or('inventory_policy.eq.continue,inventory_qty.gt.0')
      }
      if (opts.onSaleOnly) {
        // compare_at_price is set AND is strictly greater than price.
        // PostgREST doesn't support column-vs-column in a single filter; the
        // correct SQL would be `compare_at_price_cents > price_cents`. We get
        // as close as possible with "compare_at not null" and leave the
        // strict > check to the caller (listDistinctOnSale or a post-filter).
        query = query.not('compare_at_price_cents', 'is', null)
      }
      if (opts.limit) query = query.limit(opts.limit)
      if (opts.offset) query = query.range(opts.offset, (opts.offset ?? 0) + (opts.limit ?? 50) - 1)
      return query
    },
  })
  const rows = (Array.isArray(data) ? data : []).map(rowToProduct)
  if (opts.onSaleOnly) {
    // Post-filter: compare_at must be strictly greater than price. Cheap
    // client-side check; the DB-level "not null" above cuts most noise.
    return rows.filter((p) => p.compareAtPriceCents != null && p.compareAtPriceCents > p.priceCents)
  }
  return rows
}

/**
 * Count of active products matching the same filters — for pagination.
 * Deliberately re-runs the same filter logic as listActiveProducts so
 * there's no divergence risk. Uses `count: 'exact', head: true` so no
 * rows are pulled.
 */
export async function countActiveProducts(
  businessId: string,
  opts: Omit<ListActiveProductsOpts, 'limit' | 'offset' | 'sort'> = {},
): Promise<number> {
  const supabase = await createAdminClient()
  let query = supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)
    .eq('status', 'active')
  if (opts.category) query = query.eq('category', opts.category)
  if (opts.search && opts.search.trim()) {
    // See listActiveProducts for rationale — match the same shape as the
    // DB-side search_haystack column.
    const normalized = normalizeSearchTerm(opts.search)
    const pat = `%${escapeIlike(normalized)}%`
    query = query.ilike('search_haystack', pat)
  }
  if (typeof opts.minPriceCents === 'number') query = query.gte('price_cents', opts.minPriceCents)
  if (typeof opts.maxPriceCents === 'number') query = query.lte('price_cents', opts.maxPriceCents)
  if (opts.inStockOnly) query = query.or('inventory_policy.eq.continue,inventory_qty.gt.0')
  if (opts.onSaleOnly) query = query.not('compare_at_price_cents', 'is', null)
  const { count } = await query
  return count ?? 0
}

/**
 * Distinct categories present in the active catalog — for the filter pills
 * on the tienda toolbar. Returns alphabetised; null/empty categories skipped.
 */
export async function listDistinctCategories(businessId: string): Promise<string[]> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('category')
    .eq('business_id', businessId)
    .eq('status', 'active')
    .not('category', 'is', null)
  const set = new Set<string>()
  for (const row of (Array.isArray(data) ? data : []) as Array<{ category: string | null }>) {
    if (row.category) set.add(row.category)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
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

/**
 * Suggestions for the "More from this category" rail on a PDP. Excludes
 * the current product, falls back to recent active products from any
 * category if the source product has no category set or there aren't
 * enough siblings.
 */
export async function listRelatedProducts(
  businessId: string,
  opts: { excludeId: string; category: string | null; limit?: number },
): Promise<Product[]> {
  const limit = opts.limit ?? 4
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)

  const fetchBatch = async (filterCategory: boolean): Promise<Product[]> => {
    const { data } = await scoped.select<ProductRow>('products', '*', {
      filter: (q) => {
        let query = q
          .eq('status', 'active')
          .neq('id', opts.excludeId)
          .order('created_at', { ascending: false })
          .limit(limit)
        if (filterCategory && opts.category) query = query.eq('category', opts.category)
        return query
      },
    })
    return (Array.isArray(data) ? data : []).map(rowToProduct)
  }

  const sameCategory = opts.category ? await fetchBatch(true) : []
  if (sameCategory.length >= limit) return sameCategory

  // Top up with recent products from any category, excluding what we already have.
  const seen = new Set([opts.excludeId, ...sameCategory.map((p) => p.id)])
  const fallback = await fetchBatch(false)
  return [...sameCategory, ...fallback.filter((p) => !seen.has(p.id))].slice(0, limit)
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
