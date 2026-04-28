'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { ProductSort } from '@/lib/schemas/commerce'
import { getConfig } from '@/lib/commerce/tenant-config'
import { FilterChip } from '@/components/ui/pill'
import { SearchBox } from './search-box'
import { SortSelect } from './sort-select'
import { CategoryFilters } from './category-filters'
import { PriceFilters, formatPyg } from './price-filters'

interface Props {
  siteSlug: string
  initialQuery: string
  initialSort: ProductSort
  resultCount: number
  totalCount: number
  initialCategory: string
  initialCategories: string[]
  availableCategories: string[]
  categoryCounts?: Record<string, number>
  initialBrands: string[]
  availableBrands: string[]
  initialTags: string[]
  availableTags: string[]
  initialMinPrice: number
  initialMaxPrice: number
  initialInStockOnly: boolean
  initialOnSaleOnly: boolean
  initialPerPage: number
}

type FilterUpdate = {
  q?: string | null
  sort?: string | null
  category?: string | null
  min?: string | null
  max?: string | null
  in_stock?: string | null
  on_sale?: string | null
  page?: string | null
  per_page?: string | null
  brand?: string | null
  tag?: string | null
}

export function TiendaToolbar({
  siteSlug,
  initialQuery,
  initialSort,
  resultCount,
  totalCount,
  initialCategory,
  initialCategories,
  availableCategories,
  categoryCounts,
  initialMinPrice,
  initialMaxPrice,
  initialInStockOnly,
  initialOnSaleOnly,
  initialPerPage: _initialPerPage,
  initialBrands,
  availableBrands,
  initialTags,
  availableTags,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const tenantConfig = getConfig(siteSlug)
  const TAG_GROUPS = tenantConfig.tagGroups

  function pushParams(next: FilterUpdate) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === '' || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    if (!('page' in next)) params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  function toggleCategory(cat: string) {
    const set = new Set(initialCategories)
    if (set.has(cat)) set.delete(cat)
    else set.add(cat)
    const next = Array.from(set)
    pushParams({ category: next.length === 0 ? null : next.join(',') })
  }

  function toggleBrand(brand: string) {
    const set = new Set(initialBrands)
    if (set.has(brand)) set.delete(brand)
    else set.add(brand)
    const next = Array.from(set)
    pushParams({ brand: next.length === 0 ? null : next.join(',') })
  }

  function toggleTag(tag: string) {
    const set = new Set(initialTags)
    if (set.has(tag)) set.delete(tag)
    else set.add(tag)
    const next = Array.from(set)
    pushParams({ tag: next.length === 0 ? null : next.join(',') })
  }

  function clearAll() {
    startTransition(() => { router.push(pathname) })
  }

  const activeFilters: Array<{ key: string; label: string; clear: () => void }> = []
  if (initialQuery) activeFilters.push({ key: 'q', label: `"${initialQuery}"`, clear: () => pushParams({ q: null }) })
  for (const cat of initialCategories) activeFilters.push({ key: `category:${cat}`, label: cat, clear: () => { const next = initialCategories.filter((c) => c !== cat); pushParams({ category: next.length === 0 ? null : next.join(',') }) } })
  for (const brand of initialBrands) activeFilters.push({ key: `brand:${brand}`, label: brand, clear: () => { const next = initialBrands.filter((b) => b !== brand); pushParams({ brand: next.length === 0 ? null : next.join(',') }) } })
  for (const tag of initialTags) activeFilters.push({ key: `tag:${tag}`, label: `#${tag}`, clear: () => { const next = initialTags.filter((t) => t !== tag); pushParams({ tag: next.length === 0 ? null : next.join(',') }) } })
  if (initialMinPrice || initialMaxPrice) {
    const label = initialMinPrice && initialMaxPrice
      ? `${formatPyg(initialMinPrice)} – ${formatPyg(initialMaxPrice)}`
      : initialMinPrice ? `Desde ${formatPyg(initialMinPrice)}` : `Hasta ${formatPyg(initialMaxPrice)}`
    activeFilters.push({ key: 'price', label, clear: () => pushParams({ min: null, max: null }) })
  }
  if (initialInStockOnly) activeFilters.push({ key: 'in_stock', label: 'Solo en stock', clear: () => pushParams({ in_stock: null }) })
  if (initialOnSaleOnly) activeFilters.push({ key: 'on_sale', label: 'En oferta', clear: () => pushParams({ on_sale: null }) })

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-3">
      {/* Search + Sort row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox initialQuery={initialQuery} onSearch={(q) => pushParams({ q: q || null })} pending={pending} />
        <SortSelect value={initialSort} onChange={(sort) => pushParams({ sort: sort === 'newest' ? null : sort })} />
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        aria-expanded={advancedOpen}
        className="flex items-center justify-between rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)] md:hidden"
      >
        <span className="flex items-center gap-2">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M6 12h12M10 20h4" />
          </svg>
          Filtros
          {(() => {
            const n = initialCategories.length + initialBrands.length + initialTags.length + (initialMinPrice || initialMaxPrice ? 1 : 0) + (initialInStockOnly ? 1 : 0) + (initialOnSaleOnly ? 1 : 0)
            if (n === 0) return null
            return <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[color:var(--secondary,#b8860b)] px-1.5 py-0.5 text-[10px] font-semibold text-white">{n}</span>
          })()}
        </span>
        <span aria-hidden="true">{advancedOpen ? '▲' : '▼'}</span>
      </button>

      {/* Advanced filters */}
      <div className={cn('flex flex-col gap-3', advancedOpen ? 'block' : 'hidden', 'md:flex')}>
        <CategoryFilters
          availableCategories={availableCategories}
          categoryCounts={categoryCounts}
          initialCategories={initialCategories}
          onToggleCategory={toggleCategory}
          onClear={() => pushParams({ category: null })}
        />

        {/* Brand filter */}
        {availableBrands.length >= 2 ? (
          <fieldset className="flex flex-wrap items-center gap-2 text-xs">
            <legend className="float-left mr-2 text-[color:var(--text-muted,#6b7280)]">Marca:</legend>
            {availableBrands.map((b) => {
              const active = initialBrands.includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBrand(b)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] ${
                    active ? 'border-[color:var(--secondary,#b8860b)] bg-[color:var(--secondary,#b8860b)] text-white' : 'border-[color:var(--border,#e5e7eb)] hover:bg-surface-light'
                  }`}
                >
                  {b}
                </button>
              )
            })}
          </fieldset>
        ) : null}

        {/* Tag groups */}
        {TAG_GROUPS.length > 0 && availableTags.length > 0 ? (
          <div className="flex flex-col gap-2">
            {TAG_GROUPS.map((group) => {
              const tagsInGroup = availableTags.filter((t) => group.tags.includes(t))
              if (tagsInGroup.length === 0) return null
              const activeCount = tagsInGroup.filter((t) => initialTags.includes(t)).length
              return (
                <details key={group.id} open={activeCount > 0} className="group rounded-md border border-[color:var(--border,#e5e7eb)] bg-surface px-3 py-2">
                  <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-[color:var(--text,#111)] marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2">
                      <span>{group.label}</span>
                      {activeCount > 0 ? <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-[color:var(--primary-foreground,#fff)]">{activeCount}</span> : null}
                    </span>
                    <span aria-hidden="true" className="text-[color:var(--text-muted,#9ca3af)] transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <div className="mt-2 flex flex-wrap gap-1.5 pt-1">
                    {tagsInGroup.map((t) => (
                      <button key={t} type="button" onClick={() => toggleTag(t)} aria-pressed={initialTags.includes(t)}
                        className={`rounded-full border px-2.5 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] ${
                          initialTags.includes(t) ? 'border-[color:var(--primary,#111)] bg-primary text-[color:var(--primary-foreground,#fff)]' : 'border-[color:var(--border,#e5e7eb)] hover:bg-surface-light'
                        }`}
                      >
                        {t.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>
        ) : null}

        <PriceFilters
          initialMinPrice={initialMinPrice}
          initialMaxPrice={initialMaxPrice}
          initialInStockOnly={initialInStockOnly}
          initialOnSaleOnly={initialOnSaleOnly}
          onApply={(min, max) => pushParams({ min: min || null, max: max || null })}
          onToggleStock={() => pushParams({ in_stock: initialInStockOnly ? null : '1' })}
          onToggleSale={() => pushParams({ on_sale: initialOnSaleOnly ? null : '1' })}
          pending={pending}
        />
      </div>

      {/* Active filter chips */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[color:var(--border,#e5e7eb)] pt-3 text-xs">
        {activeFilters.map((f) => (
          <FilterChip key={f.key} label={f.label} onRemove={f.clear} />
        ))}
        {activeFilters.length > 0 ? (
          <button type="button" onClick={clearAll} className="text-[color:var(--primary,#111)] underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]">
            Limpiar todo
          </button>
        ) : null}
        <span className="ml-auto text-[color:var(--text-muted,#6b7280)]" aria-live="polite">
          {resultCount === totalCount ? `${totalCount} ${totalCount === 1 ? 'producto' : 'productos'}` : `Mostrando ${resultCount} de ${totalCount}`}
        </span>
      </div>
    </div>
  )
}
