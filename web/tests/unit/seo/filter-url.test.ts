import { describe, it, expect } from 'vitest'
import {
  parseFilterParams,
  buildCanonicalUrl,
  computeIndexPolicy,
} from '@/lib/seo/filter-url'

describe('parseFilterParams', () => {
  it('returns empty facets when no params', () => {
    const r = parseFilterParams({})
    expect(r.facets).toEqual({})
    expect(r.hasViewOnlyParam).toBe(false)
    expect(r.search).toBeUndefined()
  })

  it('splits comma-separated multi-value facets', () => {
    const r = parseFilterParams({ brand: 'acme,zeta', category: 'gym' })
    expect(r.facets.brand).toEqual(['acme', 'zeta'])
    expect(r.facets.category).toEqual(['gym'])
  })

  it('flags view-only params', () => {
    const r = parseFilterParams({ sort: 'price-asc', per_page: '48' })
    expect(r.hasViewOnlyParam).toBe(true)
    expect(r.sort).toBe('price-asc')
    expect(r.perPage).toBe('48')
  })

  it('parses page only when > 1', () => {
    expect(parseFilterParams({ page: '1' }).page).toBeUndefined()
    expect(parseFilterParams({ page: '3' }).page).toBe(3)
    expect(parseFilterParams({ page: 'abc' }).page).toBeUndefined()
  })

  it('captures search query trimmed', () => {
    expect(parseFilterParams({ q: '  hello  ' }).search).toBe('hello')
    expect(parseFilterParams({ q: '' }).search).toBeUndefined()
  })

  it('treats string[] params by taking first value', () => {
    const r = parseFilterParams({ brand: ['acme', 'zeta'] })
    expect(r.facets.brand).toEqual(['acme'])
  })
})

describe('buildCanonicalUrl', () => {
  const base = 'https://example.com/s/es/foo/tienda'

  it('returns base when no facets', () => {
    expect(buildCanonicalUrl(base, { facets: {} })).toBe(base)
  })

  it('emits facets sorted alphabetically by key', () => {
    const url = buildCanonicalUrl(base, {
      facets: { color: ['azul'], brand: ['acme'] },
    })
    expect(url).toBe(`${base}?brand=acme&color=azul`)
  })

  it('sorts multi-values within a facet', () => {
    const url = buildCanonicalUrl(base, {
      facets: { color: ['rojo', 'azul'] },
    })
    expect(url).toBe(`${base}?color=azul,rojo`)
  })

  it('encodes special characters in facet values', () => {
    const url = buildCanonicalUrl(base, {
      facets: { brand: ['acme & co'] },
    })
    expect(url).toContain('brand=acme%20%26%20co')
  })
})

describe('computeIndexPolicy', () => {
  it('indexes the bare PLP', () => {
    expect(computeIndexPolicy(parseFilterParams({}))).toEqual({
      index: true,
      follow: true,
    })
  })

  it('indexes single allowlisted facet', () => {
    expect(computeIndexPolicy(parseFilterParams({ category: 'gym' }))).toEqual({
      index: true,
      follow: true,
    })
  })

  it('indexes brand+category (two allowlisted facets)', () => {
    expect(
      computeIndexPolicy(parseFilterParams({ category: 'gym', brand: 'acme' })),
    ).toEqual({ index: true, follow: true })
  })

  it('noindexes 3+ allowlisted facets', () => {
    expect(
      computeIndexPolicy(
        parseFilterParams({ category: 'gym', brand: 'acme', tag: 'sale' }),
      ),
    ).toEqual({ index: false, follow: true })
  })

  it('noindexes any non-allowlisted facet (price, in_stock, on_sale)', () => {
    expect(computeIndexPolicy(parseFilterParams({ min: '1000' }))).toEqual({
      index: false,
      follow: true,
    })
    expect(computeIndexPolicy(parseFilterParams({ in_stock: '1' }))).toEqual({
      index: false,
      follow: true,
    })
  })

  it('noindexes when sort/view/per_page set', () => {
    expect(computeIndexPolicy(parseFilterParams({ sort: 'price-asc' }))).toEqual({
      index: false,
      follow: true,
    })
    expect(computeIndexPolicy(parseFilterParams({ view: 'grid' }))).toEqual({
      index: false,
      follow: true,
    })
  })

  it('noindexes paginated pages (page > 1)', () => {
    expect(computeIndexPolicy(parseFilterParams({ page: '2' }))).toEqual({
      index: false,
      follow: true,
    })
  })

  it('noindexes search results', () => {
    expect(computeIndexPolicy(parseFilterParams({ q: 'foo' }))).toEqual({
      index: false,
      follow: true,
    })
  })
})
