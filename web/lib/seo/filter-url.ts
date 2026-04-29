/**
 * Filter URL convention + indexability policy for storefront PLPs.
 *
 * Spec: docs/reference/STORE_PLAYBOOK.md §5.4.
 *
 * - Multi-value facets are comma-joined: `?color=azul,rojo`
 * - Canonical URL strips view-only params (`sort`, `view`, `per_page`, `page`)
 *   and emits remaining facet values alphabetically — so `?brand=acme&color=azul`
 *   and `?color=azul&brand=acme` collapse to the same canonical.
 * - Index policy: a page is indexable when ≤ 2 facets from the indexable
 *   allowlist (category, brand, tag) are active and no view-only param is set.
 *   Three or more facets, or any sort/view/per_page, → noindex,follow.
 */

export const INDEXABLE_FACETS = ['category', 'brand', 'tag'] as const
export type IndexableFacet = typeof INDEXABLE_FACETS[number]

export const VIEW_ONLY_PARAMS = ['sort', 'view', 'per_page', 'page'] as const

export type RawSearchParams = Record<string, string | string[] | undefined>

export interface ParsedFilterParams {
  /** Facet name → list of selected values, comma-split if needed. */
  facets: Record<string, string[]>
  /** Free-text search query (`q`). */
  search?: string
  sort?: string
  view?: string
  perPage?: string
  page?: number
  /** True iff any of the view-only params (sort/view/per_page) is set. */
  hasViewOnlyParam: boolean
}

const FACET_KEYS_ALL = ['category', 'brand', 'tag', 'min', 'max', 'in_stock', 'on_sale'] as const

function asScalar(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

function splitMulti(v: string | undefined): string[] {
  if (!v) return []
  return v
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function parseFilterParams(sp: RawSearchParams): ParsedFilterParams {
  const facets: Record<string, string[]> = {}
  for (const key of FACET_KEYS_ALL) {
    const raw = asScalar(sp[key])
    const values = splitMulti(raw)
    if (values.length > 0) facets[key] = values
  }

  const sort = asScalar(sp.sort)
  const view = asScalar(sp.view)
  const perPage = asScalar(sp.per_page)
  const pageRaw = asScalar(sp.page)
  const pageNum = pageRaw ? parseInt(pageRaw, 10) : NaN
  const page = Number.isFinite(pageNum) && pageNum > 1 ? pageNum : undefined

  const search = asScalar(sp.q)?.trim() || undefined

  return {
    facets,
    search,
    sort: sort && sort.length > 0 ? sort : undefined,
    view: view && view.length > 0 ? view : undefined,
    perPage: perPage && perPage.length > 0 ? perPage : undefined,
    page,
    hasViewOnlyParam: Boolean(sort || view || perPage),
  }
}

/**
 * Build the canonical URL for a PLP given its base path and parsed filters.
 *
 * - View-only params (sort/view/per_page/page) are dropped — Google should
 *   treat permutations of them as duplicates of the unsorted page.
 * - Free-text search (`q`) is dropped — the canonical for `/tienda?q=foo`
 *   is `/tienda` (search results are not indexable).
 * - Facets are emitted in alphabetical order with values sorted, so the
 *   canonical is stable regardless of input ordering.
 */
export function buildCanonicalUrl(
  baseUrl: string,
  parsed: Pick<ParsedFilterParams, 'facets'>,
): string {
  const keys = Object.keys(parsed.facets).sort()
  if (keys.length === 0) return baseUrl
  const parts = keys.map((k) => {
    const values = [...parsed.facets[k]].sort()
    return `${encodeURIComponent(k)}=${values.map(encodeURIComponent).join(',')}`
  })
  return `${baseUrl}?${parts.join('&')}`
}

export interface IndexPolicy {
  index: boolean
  follow: boolean
}

/**
 * Indexability decision for a faceted PLP.
 *
 * Rules (playbook §5.4):
 * - Free-text search (`q`) → noindex,follow (search results never index).
 * - Any view-only param (`sort`/`view`/`per_page`) → noindex,follow.
 * - Page > 1 → noindex,follow (paginated rel=next/prev replacement).
 * - 0–2 facets from allowlist (category, brand, tag) → index,follow.
 * - 3+ facets or facets outside the allowlist (price min/max, in_stock,
 *   on_sale) → noindex,follow.
 */
export function computeIndexPolicy(parsed: ParsedFilterParams): IndexPolicy {
  if (parsed.search) return { index: false, follow: true }
  if (parsed.hasViewOnlyParam) return { index: false, follow: true }
  if (parsed.page && parsed.page > 1) return { index: false, follow: true }

  const facetKeys = Object.keys(parsed.facets)
  const indexableKeys = facetKeys.filter((k): k is IndexableFacet =>
    (INDEXABLE_FACETS as readonly string[]).includes(k),
  )
  const nonIndexableKeys = facetKeys.filter(
    (k) => !(INDEXABLE_FACETS as readonly string[]).includes(k),
  )

  if (nonIndexableKeys.length > 0) return { index: false, follow: true }
  if (indexableKeys.length > 2) return { index: false, follow: true }
  return { index: true, follow: true }
}
