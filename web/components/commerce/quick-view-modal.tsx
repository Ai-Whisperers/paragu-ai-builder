'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/schemas/commerce/product'
import { formatCents } from '@/lib/commerce/compute-totals'
import { InstallmentLine } from './installment-line'
import { FreebieBadge } from './freebie-badge'
import { useCartStore } from '@/lib/stores/cart-store'

interface Props {
  siteSlug: string
  locale: string
  product: Product
  open: boolean
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Peek-the-product modal. Rendered on demand from the grid's "Vista
 * rápida" button. Shows the cover image + description + price + a
 * full-width add-to-cart, plus a link to the full PDP for details
 * the quick-view intentionally leaves out (shipping, reviews, related).
 *
 * Focus trap pattern is the same one used by CartDrawer — keeps
 * keyboard users inside the modal while it's open.
 */
export function QuickViewModal({ siteSlug, locale, product, open, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [adding, setAdding] = useState(false)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const cover = product.images.find((i) => i.isCover) ?? product.images[0] ?? null
  const outOfStock = product.inventoryPolicy === 'deny' && product.inventoryQty === 0
  const discount =
    product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents
      ? Math.round(((product.compareAtPriceCents - product.priceCents) / product.compareAtPriceCents) * 100)
      : null

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE)
    focusables[0]?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const list = dialog!.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function handleAdd() {
    if (outOfStock || adding) return
    setAdding(true)
    try {
      await addItem(siteSlug, product.id, 1)
      onClose()
    } finally {
      setAdding(false)
    }
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-3xl grid-cols-1 gap-6 overflow-hidden rounded-lg bg-surface p-6 shadow-xl md:grid-cols-2"
      >
        <div className="relative">
          {cover?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover.url}
              alt={cover.alt ?? product.name}
              className="aspect-square w-full rounded-lg object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded-lg bg-surface-light" />
          )}
          {discount ? (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              −{discount}%
            </span>
          ) : null}
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <h2 id="quickview-title" className="text-xl font-bold text-[color:var(--text,#111)]">
              {product.name}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar vista rápida"
              className="rounded p-1 text-[color:var(--text-muted,#6b7280)] hover:bg-surface-light"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-[color:var(--text,#111)]">
              {formatCents(product.priceCents, product.currency)}
            </p>
            {product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents ? (
              <p className="text-sm text-[color:var(--text-muted,#9ca3af)] line-through">
                {formatCents(product.compareAtPriceCents, product.currency)}
              </p>
            ) : null}
          </div>
          <InstallmentLine
            siteSlug={siteSlug}
            priceCents={product.priceCents}
            currency={product.currency}
            className="mt-1"
          />
          <FreebieBadge metadata={product.metadata} className="mt-2" />

          {product.description ? (
            <p className="mt-4 line-clamp-6 whitespace-pre-line text-sm text-[color:var(--text,#111)]">
              {product.description}
            </p>
          ) : null}

          <div className="mt-auto flex flex-col gap-2 pt-4">
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock || adding}
              className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {outOfStock ? 'Agotado' : adding ? 'Agregando…' : 'Agregar al carrito'}
            </button>
            <Link
              href={`/s/${locale}/${siteSlug}/producto/${product.slug}`}
              className="text-center text-xs text-[color:var(--text-muted,#6b7280)] underline"
              onClick={onClose}
            >
              Ver detalle completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
