'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore, cartSubtotalCents } from '@/lib/stores/cart-store'
import { formatCents } from '@/lib/commerce/compute-totals'

export function CartPageClient({ siteSlug }: { siteSlug: string }) {
  const cart = useCartStore((s) => s.cart)
  const status = useCartStore((s) => s.status)
  const refresh = useCartStore((s) => s.refresh)
  const updateItem = useCartStore((s) => s.updateItem)

  useEffect(() => {
    refresh(siteSlug)
  }, [siteSlug, refresh])

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-12 text-center">
        <p className="text-[color:var(--text-muted,#6b7280)]">Tu carrito está vacío.</p>
        <Link href={`/s/es/${siteSlug}/tienda`} className="mt-4 inline-block text-sm font-medium text-[color:var(--primary,#111)] underline">
          Ir a la tienda
        </Link>
      </div>
    )
  }

  const subtotal = cartSubtotalCents(cart)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {cart.items.map((it) => (
          <li key={it.id} className="flex items-center gap-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4">
            <div className="flex-1">
              <p className="font-medium text-[color:var(--text,#111)]">{it.productId.slice(0, 8)}…</p>
              <p className="text-sm text-[color:var(--text-muted,#6b7280)]">{formatCents(it.unitPriceCents, cart.currency)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateItem(siteSlug, it.id, Math.max(0, it.quantity - 1))}
                className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
                aria-label="Quitar uno"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center">{it.quantity}</span>
              <button
                type="button"
                onClick={() => updateItem(siteSlug, it.id, it.quantity + 1)}
                className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
                aria-label="Sumar uno"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-semibold">{formatCents(it.unitPriceCents * it.quantity, cart.currency)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{formatCents(subtotal, cart.currency)}</span>
        </div>
        <p className="mt-1 text-xs text-[color:var(--text-muted,#6b7280)]">Envío se calcula en el siguiente paso</p>
        <Link
          href={`/s/es/${siteSlug}/checkout`}
          className="mt-4 block w-full rounded-lg bg-[color:var(--primary,#111)] px-4 py-3 text-center font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90"
        >
          {status === 'syncing' ? 'Actualizando…' : 'Finalizar compra'}
        </Link>
      </aside>
    </div>
  )
}
