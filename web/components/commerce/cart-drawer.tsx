'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore, cartSubtotalCents } from '@/lib/stores/cart-store'
import { formatCents } from '@/lib/commerce/compute-totals'

interface Props {
  siteSlug: string
  open: boolean
  onClose: () => void
}

export function CartDrawer({ siteSlug, open, onClose }: Props) {
  const cart = useCartStore((s) => s.cart)
  const status = useCartStore((s) => s.status)
  const updateItem = useCartStore((s) => s.updateItem)
  const removeItem = useCartStore((s) => s.removeItem)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const subtotal = cartSubtotalCents(cart)
  const currency = cart?.currency ?? 'PYG'
  const items = cart?.items ?? []

  return (
    <div aria-hidden={!open} className={open ? '' : 'pointer-events-none'}>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[color:var(--surface,#fff)] shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-[color:var(--border,#e5e7eb)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[color:var(--text,#111)]">Tu carrito</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded p-2 hover:bg-[color:var(--surface-muted,#f3f4f6)]">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[color:var(--text-muted,#6b7280)]">Tu carrito está vacío.</p>
              <button type="button" onClick={onClose} className="mt-4 text-sm font-medium text-[color:var(--primary,#111)] underline">
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[color:var(--text,#111)]">{it.productId.slice(0, 8)}…</p>
                    <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{formatCents(it.unitPriceCents, currency)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Quitar uno"
                        onClick={() => updateItem(siteSlug, it.id, Math.max(0, it.quantity - 1))}
                        className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-0.5 text-sm"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm">{it.quantity}</span>
                      <button
                        type="button"
                        aria-label="Sumar uno"
                        onClick={() => updateItem(siteSlug, it.id, it.quantity + 1)}
                        className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-0.5 text-sm"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(siteSlug, it.id)}
                        className="ml-auto text-xs text-[color:var(--text-muted,#6b7280)] hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-sm font-semibold text-[color:var(--text,#111)]">
                    {formatCents(it.unitPriceCents * it.quantity, currency)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-[color:var(--border,#e5e7eb)] px-6 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[color:var(--text-muted,#6b7280)]">Subtotal</span>
              <span className="text-lg font-semibold">{formatCents(subtotal, currency)}</span>
            </div>
            <Link
              href={`/s/es/${siteSlug}/checkout`}
              className="block w-full rounded-lg bg-[color:var(--primary,#111)] px-4 py-3 text-center font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90"
            >
              {status === 'syncing' ? 'Actualizando…' : 'Pagar ahora'}
            </Link>
            <p className="mt-2 text-center text-xs text-[color:var(--text-muted,#6b7280)]">
              Envío y totales se calculan en el siguiente paso
            </p>
          </footer>
        ) : null}
      </aside>
    </div>
  )
}
