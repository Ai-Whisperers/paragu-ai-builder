'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { PriceChip } from '@/components/ui/pill'

interface QuickFilter {
  key: string
  label: string
  params: Record<string, string | null>
  /** Which current URL state means this is active. */
  matches: (sp: URLSearchParams) => boolean
}

/**
 * Pre-baked URL-param shortcuts above the full filter toolbar. Each chip
 * sets or clears a handful of params in one click — no separate state.
 * When a chip is already "active", clicking it clears its params.
 */
const QUICK_FILTERS: QuickFilter[] = [
  {
    key: 'on-sale',
    label: '\u{1F525} En oferta',
    params: { on_sale: '1', min: null, max: null },
    matches: (sp) => sp.get('on_sale') === '1',
  },
  {
    key: 'under-100k',
    label: '\u{1F4B0} Hasta Gs 100.000',
    params: { min: null, max: '10000000', on_sale: null },
    matches: (sp) => !sp.get('min') && sp.get('max') === '10000000',
  },
  {
    key: '100-300k',
    label: '\u{1F4B0} Gs 100.000 \u2013 300.000',
    params: { min: '10000000', max: '30000000', on_sale: null },
    matches: (sp) => sp.get('min') === '10000000' && sp.get('max') === '30000000',
  },
  {
    key: 'over-300k',
    label: '\u{1F4B0} Gs 300.000+',
    params: { min: '30000000', max: null, on_sale: null },
    matches: (sp) => sp.get('min') === '30000000' && !sp.get('max'),
  },
  {
    key: 'in-stock',
    label: '\u{2705} Solo en stock',
    params: { in_stock: '1' },
    matches: (sp) => sp.get('in_stock') === '1',
  },
]

export function TiendaQuickFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function toggle(filter: QuickFilter) {
    const params = new URLSearchParams(searchParams.toString())
    const isActive = filter.matches(params)
    if (isActive) {
      for (const key of Object.keys(filter.params)) params.delete(key)
    } else {
      for (const [key, value] of Object.entries(filter.params)) {
        if (value === null) params.delete(key)
        else params.set(key, value)
      }
    }
    params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2" aria-label="Filtros rápidos">
        {QUICK_FILTERS.map((f) => {
        const active = f.matches(searchParams)
        return (
          <PriceChip
            key={f.key}
            active={active}
            onClick={() => toggle(f)}
            label={f.label}
          />
        )
      })}
    </div>
  )
}
