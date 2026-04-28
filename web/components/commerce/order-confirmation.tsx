'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Order } from '@/lib/schemas/commerce/order'
import { formatCents } from '@/lib/commerce/compute-totals'
import { OrderStatusTimeline } from './order-status-timeline'

interface Props {
  siteSlug: string
  locale: string
  /** Used as the print-receipt header so the printed copy identifies the seller. */
  businessName?: string
  initialOrder: Order
  initialStatus?: 'success' | 'pending' | 'failure' | null
}

export function OrderConfirmation({ siteSlug, locale, businessName, initialOrder, initialStatus }: Props) {
  const [order, setOrder] = useState(initialOrder)
  const [polling, setPolling] = useState(initialOrder.status === 'awaiting_payment')
  const [resendState, setResendState] = useState<
    | { kind: 'idle' }
    | { kind: 'sending' }
    | { kind: 'sent'; sentTo: string }
    | { kind: 'rate_limited'; waitSeconds: number }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' })

  async function handleResend() {
    setResendState({ kind: 'sending' })
    try {
      const res = await fetch(`/api/storefront/${siteSlug}/orders/${order.id}/resend-email`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (res.status === 429) {
        setResendState({ kind: 'rate_limited', waitSeconds: data.retryAfterSeconds ?? 60 })
        return
      }
      if (!res.ok) {
        setResendState({ kind: 'error', message: data.error ?? 'resend_failed' })
        return
      }
      setResendState({ kind: 'sent', sentTo: data.sentTo ?? order.customerEmail })
    } catch {
      setResendState({ kind: 'error', message: 'network_error' })
    }
  }

  useEffect(() => {
    if (!polling) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/storefront/${siteSlug}/orders/${order.id}`)
        if (!res.ok) return
        const data = await res.json()
        setOrder(data.order)
        if (data.order.status !== 'awaiting_payment') {
          setPolling(false)
        }
      } catch {
        // keep polling; transient errors ignored
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [polling, order.id, siteSlug])

  const headline = headlineFor(order.status, initialStatus ?? null)
  const body = bodyFor(order.status, initialStatus ?? null)

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 print:py-4">
      <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-8 text-center print:rounded-none print:border-0 print:p-0 print:text-left">
        {businessName ? (
          <p className="mb-2 hidden text-sm font-semibold uppercase tracking-wide text-[color:var(--text-muted,#6b7280)] print:block">
            {businessName} — Comprobante
          </p>
        ) : null}
        <h1 className="mb-2 text-2xl font-bold text-[color:var(--text,#111)] print:text-xl">{headline}</h1>
        <p className="mb-6 text-[color:var(--text-muted,#6b7280)] print:hidden">{body}</p>
        <p className="mb-1 text-sm text-[color:var(--text-muted,#6b7280)]">Número de orden</p>
        <p className="mb-2 font-mono text-lg font-semibold">{order.orderNumber}</p>

        <OrderStatusTimeline status={order.status} />

        {order.trackingCarrier || order.trackingNumber || order.trackingUrl ? (
          <div className="mb-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] p-3 text-left text-sm print:bg-white">
            <p className="mb-1 text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
              Seguimiento del envío
            </p>
            {order.trackingCarrier ? <p className="text-[color:var(--text,#111)]">{order.trackingCarrier}</p> : null}
            {order.trackingNumber ? (
              <p className="font-mono text-[color:var(--text,#111)]">{order.trackingNumber}</p>
            ) : null}
            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-[color:var(--secondary,#b8860b)] underline print:hidden"
              >
                Ver estado en el transportista →
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="mb-6 divide-y divide-[color:var(--border,#e5e7eb)] text-left">
          {(order.items ?? []).map((it) => {
            const canReview = order.status === 'shipped' || order.status === 'delivered'
            const snapSlug = (it.productSnapshot as { slug?: string }).slug
            return (
              <div key={it.id} className="flex justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{it.productSnapshot.name}</p>
                  <p className="text-sm text-[color:var(--text-muted,#6b7280)]">Cantidad: {it.quantity}</p>
                  {canReview && snapSlug ? (
                    <a
                      href={`/s/${locale}/${siteSlug}/producto/${snapSlug}#review-form-heading`}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-[color:var(--secondary,#b8860b)] hover:underline print:hidden"
                    >
                      ★ Dejar una reseña
                    </a>
                  ) : null}
                </div>
                <p className="whitespace-nowrap font-semibold">{formatCents(it.lineTotalCents, order.currency)}</p>
              </div>
            )
          })}
          <div className="flex justify-between py-3 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCents(order.totalCents, order.currency)}</span>
          </div>
        </div>

        <p className="mb-2 text-sm text-[color:var(--text-muted,#6b7280)]">
          Enviamos la confirmación a <strong>{order.customerEmail}</strong>.
        </p>

        <div className="mb-6 text-xs print:hidden">
          {resendState.kind === 'sent' ? (
            <p className="text-green-700">✓ Te reenviamos el email a {resendState.sentTo}.</p>
          ) : resendState.kind === 'rate_limited' ? (
            <p className="text-amber-700">Esperá {resendState.waitSeconds}s antes de reintentar.</p>
          ) : resendState.kind === 'error' ? (
            <p className="text-red-700">No pudimos reenviar el email ({resendState.message}). Probá más tarde.</p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendState.kind === 'sending'}
              className="text-[color:var(--primary,#111)] underline disabled:opacity-50"
            >
              {resendState.kind === 'sending' ? 'Enviando…' : '¿No te llegó? Reenviar email'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 print:hidden">
          <Link
            href={`/s/${locale}/${siteSlug}/tienda`}
            className="inline-block rounded-lg border border-[color:var(--primary,#111)] px-4 py-2 font-medium text-[color:var(--primary,#111)] hover:bg-primary hover:text-[color:var(--primary-foreground,#fff)]"
          >
            Seguir comprando
          </Link>
          <Link
            href={`/s/${locale}/${siteSlug}/orden/${order.id}/recibo`}
            className="inline-block rounded-lg border border-[color:var(--border,#e5e7eb)] px-4 py-2 font-medium text-[color:var(--text-muted,#6b7280)] hover:bg-surface-light"
          >
            📄 Descargar recibo
          </Link>
        </div>
      </div>
    </div>
  )
}

function headlineFor(status: Order['status'], initial: 'success' | 'pending' | 'failure' | null): string {
  if (status === 'paid') return '¡Pago confirmado!'
  if (status === 'failed' || initial === 'failure') return 'Pago rechazado'
  if (status === 'cancelled') return 'Orden cancelada'
  if (initial === 'success') return 'Estamos procesando tu pago'
  return 'Tu orden fue recibida'
}

function bodyFor(status: Order['status'], initial: 'success' | 'pending' | 'failure' | null): string {
  if (status === 'paid') return 'Gracias por tu compra. Tu pedido se está preparando.'
  if (status === 'failed' || initial === 'failure') return 'No pudimos procesar tu pago. Intentá con otro método.'
  if (status === 'cancelled') return 'Esta orden fue cancelada. Si crees que es un error, contactanos.'
  return 'Estamos esperando la confirmación del pago. Esto puede tardar unos minutos.'
}
