'use client'

import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatCents } from '@/lib/commerce/compute-totals'
import { trackAddToCart } from '@/lib/analytics/commerce-events'

interface Props {
  siteSlug: string
  productId: string
  productName: string
  priceCents: number
  currency: string
  inventoryQty: number
  inventoryPolicy: 'deny' | 'continue'
  imageUrl?: string | null
  /**
   * Selector of the main in-page add-to-cart element. When that element is
   * visible in the viewport the sticky bar hides — avoids double-CTA
   * awkwardness. When it scrolls off, the sticky bar appears.
   */
  mainCtaSelector?: string
}

/**
 * Mobile-only sticky "Agregar al carrito" bar fixed to the bottom of the
 * viewport. Hidden on md+ (desktop has the inline CTA in the main column).
 * Watches the main CTA via IntersectionObserver so it only shows after the
 * shopper scrolls past the real button.
 */
export function PdpStickyMobileCta({
  siteSlug,
  productId,
  productName,
  priceCents,
  currency,
  inventoryQty,
  inventoryPolicy,
  imageUrl,
  mainCtaSelector = '#pdp-main-add-to-cart',
}: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [adding, setAdding] = useState(false)
  const [visible, setVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const outOfStock = inventoryPolicy === 'deny' && inventoryQty === 0

  useEffect(() => {
    const target = document.querySelector(mainCtaSelector)
    if (!target) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setVisible(!entry.isIntersecting)
      },
      { rootMargin: '0px 0px -20px 0px' },
    )
    obs.observe(target)
    observerRef.current = obs
    return () => obs.disconnect()
  }, [mainCtaSelector])

  const handleAdd = async () => {
    if (outOfStock || adding) return
    setAdding(true)
    try {
      await addItem(siteSlug, productId, 1)
      trackAddToCart({
        itemId: productId,
        itemName: productName,
        price: priceCents,
        currency,
        quantity: 1,
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-transform duration-200 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- keep <img> to avoid next/image layout shift in a fixed bar
          <img src={imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-[color:var(--text,#111)]">{productName}</p>
          <p className="text-sm font-semibold text-[color:var(--text,#111)]">
            {formatCents(priceCents, currency)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock || adding}
          className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] disabled:opacity-50"
        >
          {outOfStock ? 'Agotado' : adding ? 'Agregando…' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}
