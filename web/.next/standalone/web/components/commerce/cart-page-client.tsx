'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore, cartSubtotalCents } from '@/lib/stores/cart-store'
import { formatCents } from '@/lib/commerce/compute-totals'
import { buildWhatsAppCartUrl } from '@/lib/commerce/whatsapp-cart-link'

interface Props {
  siteSlug: string
  locale?: string
  /** E.164-ish WhatsApp number from the tenant record. When set, a
   *  secondary "Pedir por WhatsApp" CTA shows under the primary checkout
   *  button. Digits-only is also accepted. */
  whatsappNumber?: string
  /** Business name used to open the pre-filled WA message. */
  businessName?: string
}

export function CartPageClient({ siteSlug, locale = 'es', whatsappNumber, businessName }: Props) {
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
        <Link href={`/s/${locale}/${siteSlug}/tienda`} className="mt-4 inline-block text-sm font-medium text-[color:var(--primary,#111)] underline">
          Ir a la tienda
        </Link>
      </div>
    )
  }

  const subtotal = cartSubtotalCents(cart)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {cart.items.map((it) => {
          const displayName = it.productName ?? 'Producto'
          return (
            <li key={it.id} className="flex items-center gap-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4">
              {it.productImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.productImageUrl}
                  alt=""
                  className="h-16 w-16 flex-shrink-0 rounded object-cover"
                />
              ) : null}
              <div className="flex-1">
                {it.productSlug ? (
                  <Link href={`/s/${locale}/${siteSlug}/producto/${it.productSlug}`} className="font-medium text-[color:var(--text,#111)] hover:underline">
                    {displayName}
                  </Link>
                ) : (
                  <p className="font-medium text-[color:var(--text,#111)]">{displayName}</p>
                )}
                <p className="text-sm text-[color:var(--text-muted,#6b7280)]">{formatCents(it.unitPriceCents, cart.currency)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateItem(siteSlug, it.id, Math.max(0, it.quantity - 1))}
                  className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
                  aria-label={`Quitar uno de ${displayName}`}
                >
                  <span aria-hidden="true">−</span>
                </button>
                <span className="min-w-[2rem] text-center" aria-live="polite">
                  <span className="sr-only">Cantidad: </span>{it.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateItem(siteSlug, it.id, it.quantity + 1)}
                  className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
                  aria-label={`Sumar uno a ${displayName}`}
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
              <p className="w-24 text-right font-semibold">{formatCents(it.unitPriceCents * it.quantity, cart.currency)}</p>
            </li>
          )
        })}
      </ul>

      <aside className="h-fit rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{formatCents(subtotal, cart.currency)}</span>
        </div>
        <p className="mt-1 text-xs text-[color:var(--text-muted,#6b7280)]">El envío se calcula al confirmar la dirección.</p>
        <Link
          href={`/s/${locale}/${siteSlug}/checkout`}
          className="mt-4 block w-full rounded-lg bg-[color:var(--primary,#111)] px-4 py-3 text-center font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]"
        >
          {status === 'syncing' ? 'Actualizando…' : 'Finalizar compra'}
        </Link>
        {whatsappNumber ? (() => {
          const waUrl = buildWhatsAppCartUrl({
            whatsappNumber,
            businessName: businessName ?? 'Tienda',
            currency: cart.currency,
            items: cart.items.map((i) => ({
              productName: i.productName,
              quantity: i.quantity,
              unitPriceCents: i.unitPriceCents,
            })),
            subtotalCents: subtotal,
          })
          return (
            <>
              <div className="my-3 flex items-center gap-3 text-xs text-[color:var(--text-muted,#6b7280)]">
                <span className="h-px flex-1 bg-[color:var(--border,#e5e7eb)]" />
                <span>o</span>
                <span className="h-px flex-1 bg-[color:var(--border,#e5e7eb)]" />
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-white px-4 py-3 text-center font-semibold text-[#128C7E] transition-colors hover:bg-[#25D36610] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Pedir por WhatsApp
              </a>
              <p className="mt-2 text-center text-[11px] text-[color:var(--text-muted,#6b7280)]">
                Pagás por transferencia o en efectivo al recibir. Confirmamos stock antes.
              </p>
            </>
          )
        })() : null}
      </aside>
    </div>
  )
}
