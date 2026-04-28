'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCartStore, cartSubtotalCents } from '@/lib/stores/cart-store'
import { formatCents } from '@/lib/commerce/compute-totals'
import { getFreeShippingThresholdCents } from '@/lib/commerce/shipping-threshold'
import { buildWhatsAppCartUrl } from '@/lib/commerce/whatsapp-cart-link'

interface Props {
  siteSlug: string
  locale: string
  open: boolean
  onClose: () => void
  /** Optional tenant WhatsApp number. When set, adds a "Pedir por
   *  WhatsApp" secondary CTA below the primary pay button. */
  whatsappNumber?: string
  /** Business display name for the pre-filled WA message. */
  businessName?: string
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function CartDrawer({ siteSlug, locale, open, onClose, whatsappNumber, businessName }: Props) {
  const cart = useCartStore((s) => s.cart)
  const status = useCartStore((s) => s.status)
  const updateItem = useCartStore((s) => s.updateItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const drawerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    if (!drawer) return
    // Focus the first actionable control so screen readers land inside the
    // dialog, and so Tab cycles stay within it.
    const focusables = drawer.querySelectorAll<HTMLElement>(FOCUSABLE)
    focusables[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const list = drawer.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
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
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-[color:var(--border,#e5e7eb)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[color:var(--text,#111)]">Tu carrito</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded p-2 hover:bg-surface-light">
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
              {items.map((it) => {
                const displayName = it.productName ?? 'Producto'
                return (
                  <li key={it.id} className="flex gap-3">
                    {it.productImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.productImageUrl}
                        alt=""
                        className="h-16 w-16 flex-shrink-0 rounded border border-[color:var(--border,#e5e7eb)] object-cover"
                      />
                    ) : null}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[color:var(--text,#111)]">{displayName}</p>
                      <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{formatCents(it.unitPriceCents, currency)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Quitar uno de ${displayName}`}
                          onClick={() => updateItem(siteSlug, it.id, Math.max(0, it.quantity - 1))}
                          className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-0.5 text-sm"
                        >
                          <span aria-hidden="true">−</span>
                        </button>
                        <span aria-live="polite" className="min-w-[2rem] text-center text-sm">
                          <span className="sr-only">Cantidad: </span>
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Sumar uno a ${displayName}`}
                          onClick={() => updateItem(siteSlug, it.id, it.quantity + 1)}
                          className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-0.5 text-sm"
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                        <button
                          type="button"
                          aria-label={`Eliminar ${displayName} del carrito`}
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
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-[color:var(--border,#e5e7eb)] px-6 py-4">
            {(() => {
              // Progress bar toward free-shipping threshold. Hidden when
              // the tenant has no threshold configured, or when the cart
              // currency doesn't match the tenant's threshold currency
              // (both PYG for PY tenants today). Converts the "Gs 200.000"
              // marketing promise into a concrete "faltan Gs X" nudge the
              // moment the shopper opens the drawer.
              const threshold = getFreeShippingThresholdCents(siteSlug)
              if (threshold <= 0 || currency !== 'PYG') return null
              const pct = Math.min(100, Math.round((subtotal / threshold) * 100))
              const reached = subtotal >= threshold
              return (
                <div className="mb-3" aria-live="polite">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={reached ? 'font-medium text-emerald-700' : 'text-[color:var(--text-muted,#6b7280)]'}>
                      {reached
                        ? '🎉 ¡Ya tenés envío gratis!'
                        : `Te faltan ${formatCents(threshold - subtotal, 'PYG')} para envío gratis`}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-1.5 overflow-hidden rounded-full bg-surface-light"
                  >
                    <div
                      className={`h-full transition-all duration-300 ${reached ? 'bg-emerald-600' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })()}
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[color:var(--text-muted,#6b7280)]">Subtotal</span>
              <span className="text-lg font-semibold">{formatCents(subtotal, currency)}</span>
            </div>
            <Link
              href={`/s/${locale}/${siteSlug}/checkout`}
              className="block w-full rounded-lg bg-primary px-4 py-3 text-center font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]"
            >
              {status === 'syncing' ? 'Actualizando…' : 'Pagar ahora'}
            </Link>
            {whatsappNumber ? (() => {
              const waUrl = buildWhatsAppCartUrl({
                whatsappNumber,
                businessName: businessName ?? 'Tienda',
                currency,
                items: items.map((i) => ({
                  productName: i.productName,
                  quantity: i.quantity,
                  unitPriceCents: i.unitPriceCents,
                })),
                subtotalCents: subtotal,
              })
              return (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#128C7E] hover:bg-[#25D36610] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Pedir por WhatsApp
                </a>
              )
            })() : null}
            <p className="mt-2 text-center text-xs text-[color:var(--text-muted,#6b7280)]">
              Envío y totales se calculan en el siguiente paso
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-[color:var(--text-muted,#6b7280)]">
              <span>📦 Empaque discreto</span>
              <span aria-hidden>·</span>
              <span>🔒 Pago seguro</span>
              <span aria-hidden>·</span>
              <span>↩️ Cambios 7 días</span>
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  )
}
