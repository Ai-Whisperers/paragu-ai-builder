'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/lib/schemas/commerce/order'

interface Props {
  businessId: string
  orderId: string
  currentStatus: OrderStatus
}

const NEXT_ACTIONS: Partial<Record<OrderStatus, Array<{ label: string; status: OrderStatus }>>> = {
  awaiting_payment: [{ label: 'Confirmar pago recibido', status: 'paid' }],
  paid: [{ label: 'Marcar como preparada', status: 'fulfilled' }],
  fulfilled: [{ label: 'Marcar como enviada', status: 'shipped' }],
  shipped: [{ label: 'Marcar como entregada', status: 'delivered' }],
}

export function OrderActions({ businessId, orderId, currentStatus }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const actions = NEXT_ACTIONS[currentStatus] ?? []

  const transitionTo = async (status: OrderStatus) => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/orders/${orderId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'transition_failed')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setBusy(false)
    }
  }

  if (actions.length === 0) {
    return <p className="text-sm text-[color:var(--text-muted,#6b7280)]">Sin acciones disponibles desde este estado.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {actions.map((a) => (
        <button
          key={a.status}
          type="button"
          onClick={() => transitionTo(a.status)}
          disabled={busy}
          className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? 'Actualizando…' : a.label}
        </button>
      ))}
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
