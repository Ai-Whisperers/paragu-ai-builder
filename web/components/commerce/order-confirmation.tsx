'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Order } from '@/lib/schemas/commerce/order'
import { formatCents } from '@/lib/commerce/compute-totals'

interface Props {
  siteSlug: string
  initialOrder: Order
  initialStatus?: 'success' | 'pending' | 'failure' | null
}

export function OrderConfirmation({ siteSlug, initialOrder, initialStatus }: Props) {
  const [order, setOrder] = useState(initialOrder)
  const [polling, setPolling] = useState(initialOrder.status === 'awaiting_payment')

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
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[color:var(--text,#111)]">{headline}</h1>
        <p className="mb-6 text-[color:var(--text-muted,#6b7280)]">{body}</p>
        <p className="mb-1 text-sm text-[color:var(--text-muted,#6b7280)]">Número de orden</p>
        <p className="mb-6 font-mono text-lg font-semibold">{order.orderNumber}</p>

        <div className="mb-6 divide-y divide-[color:var(--border,#e5e7eb)] text-left">
          {(order.items ?? []).map((it) => (
            <div key={it.id} className="flex justify-between py-3">
              <div>
                <p className="font-medium">{it.productSnapshot.name}</p>
                <p className="text-sm text-[color:var(--text-muted,#6b7280)]">Cantidad: {it.quantity}</p>
              </div>
              <p className="font-semibold">{formatCents(it.lineTotalCents, order.currency)}</p>
            </div>
          ))}
          <div className="flex justify-between py-3 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCents(order.totalCents, order.currency)}</span>
          </div>
        </div>

        <p className="mb-4 text-sm text-[color:var(--text-muted,#6b7280)]">
          Enviamos la confirmación a <strong>{order.customerEmail}</strong>.
        </p>

        <Link
          href={`/s/es/${siteSlug}/tienda`}
          className="inline-block rounded-lg border border-[color:var(--primary,#111)] px-4 py-2 font-medium text-[color:var(--primary,#111)] hover:bg-[color:var(--primary,#111)] hover:text-[color:var(--primary-foreground,#fff)]"
        >
          Seguir comprando
        </Link>
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
  return 'Estamos esperando la confirmación de Mercado Pago. Esto puede tardar unos minutos.'
}
