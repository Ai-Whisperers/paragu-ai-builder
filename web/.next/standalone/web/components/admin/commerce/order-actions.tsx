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
  const [showShipForm, setShowShipForm] = useState(false)
  const [carrier, setCarrier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')

  const actions = NEXT_ACTIONS[currentStatus] ?? []

  const transitionTo = async (status: OrderStatus, tracking?: { carrier?: string | null; number?: string | null; url?: string | null }) => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/orders/${orderId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tracking }),
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

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault()
    await transitionTo('shipped', {
      carrier: carrier.trim() || null,
      number: trackingNumber.trim() || null,
      url: trackingUrl.trim() || null,
    })
    setShowShipForm(false)
  }

  if (actions.length === 0) {
    return <p className="text-sm text-[color:var(--text-muted,#6b7280)]">Sin acciones disponibles desde este estado.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {actions.map((a) => {
        // Shipping is the one transition that wants extra data → show a form.
        if (a.status === 'shipped' && !showShipForm) {
          return (
            <button
              key={a.status}
              type="button"
              onClick={() => setShowShipForm(true)}
              disabled={busy}
              className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {a.label}
            </button>
          )
        }
        if (a.status === 'shipped' && showShipForm) {
          return (
            <form
              key={a.status}
              onSubmit={handleShip}
              className="space-y-2 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] p-3 text-sm"
            >
              <p className="text-xs text-[color:var(--text-muted,#6b7280)]">Datos de seguimiento (opcional)</p>
              <input
                type="text"
                placeholder="Empresa de envío (ej. Motoenvío, Encomienda ABC)"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                maxLength={80}
                className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
              />
              <input
                type="text"
                placeholder="Número de seguimiento"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                maxLength={120}
                className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
              />
              <input
                type="url"
                placeholder="URL de seguimiento (opcional)"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                maxLength={500}
                className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded bg-[color:var(--primary,#111)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {busy ? 'Enviando…' : 'Confirmar envío'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowShipForm(false)}
                  disabled={busy}
                  className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-xs hover:bg-[color:var(--surface,#fff)]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )
        }
        return (
          <button
            key={a.status}
            type="button"
            onClick={() => transitionTo(a.status)}
            disabled={busy}
            className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Actualizando…' : a.label}
          </button>
        )
      })}
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
