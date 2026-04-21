'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface Props {
  currentPage: number
  totalPages: number
}

/**
 * Simple numeric pagination. Preserves all other query params (search,
 * filters, sort). Uses pushState so back/forward navigates pages.
 *
 * Window size: always show first, last, and ±2 around current, with
 * ellipsis gaps. Good for up to ~100 pages; beyond that the ellipsis
 * handles density without sprawl.
 */
export function TiendaPagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  if (totalPages <= 1) return null

  function goto(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) params.delete('page')
    else params.set('page', String(page))
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
      // Scroll to top of grid so the new page is visible.
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // Build the window of pages to render.
  const pages: Array<number | 'ellipsis'> = []
  const near = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage - 2,
    currentPage + 2,
  ])
  let lastAdded = 0
  for (let p = 1; p <= totalPages; p++) {
    if (!near.has(p)) continue
    if (lastAdded && p - lastAdded > 1) pages.push('ellipsis')
    pages.push(p)
    lastAdded = p
  }

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => goto(currentPage - 1)}
        disabled={currentPage <= 1 || pending}
        className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-[color:var(--surface-muted,#f3f4f6)]"
      >
        ← Anterior
      </button>
      <ul className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <li key={`e${i}`} aria-hidden="true" className="px-1 text-[color:var(--text-muted,#6b7280)]">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => goto(p)}
                aria-current={p === currentPage ? 'page' : undefined}
                disabled={pending}
                className={`min-w-[2.25rem] rounded px-2 py-1.5 text-sm ${
                  p === currentPage
                    ? 'bg-[color:var(--primary,#111)] text-[color:var(--primary-foreground,#fff)]'
                    : 'border border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
                }`}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        onClick={() => goto(currentPage + 1)}
        disabled={currentPage >= totalPages || pending}
        className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-[color:var(--surface-muted,#f3f4f6)]"
      >
        Siguiente →
      </button>
    </nav>
  )
}
