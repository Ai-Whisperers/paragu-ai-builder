/**
 * Shared UI types for the commerce system.
 * Every component that renders trust items, filters, pills, or breadcrumbs
 * should import from here to avoid duplicating interface definitions.
 */

/** Trust strip item shown above the product grid or on PDP */
export interface TrustItem {
  icon: string
  title: string
  description: string
}

/** Sort option for product listing pages */
export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'popularity' | 'rating'

/** A single "quick filter" chip above the toolbar */
export interface QuickFilter {
  key: string
  label: string
  params: Record<string, string | null>
  matches: (sp: URLSearchParams) => boolean
}

/** Filter state parsed from URL search params */
export interface ProductFilters {
  search: string
  sort: ProductSort
  categories: string[]
  brands: string[]
  tags: string[]
  minPriceCents: number
  maxPriceCents: number
  inStockOnly: boolean
  onSaleOnly: boolean
  page: number
  perPage: number
}

/** Breadcrumb item for navigation */
export interface BreadcrumbItem {
  label: string
  href?: string
}
