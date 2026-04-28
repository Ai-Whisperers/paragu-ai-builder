'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  businessId: string
  orderId: string
  currentStatus: string
}

const REFUNDABLE = new Set(['paid', 'fulfilled', 'shipped', 'delivered'])

export function OrderRefundButton({ businessId, orderId, currentStatus }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null)

  if (!REFUNDABLE.has(currentStatus)) return null

  async function refund(markOnly: boolean) {
    const prompt = markOnly
      ? '¿Marcar esta orden como reembolsada sin llamar a Pagopar? (Usá esto si ya devolviste el dinero manualmente.)'
      : '¿Reembolsar esta orden vía Pagopar? Esta acción es irreversible.'
    const reason = window.prompt(prompt + '\n\nMotivo (opcional):')
    if (reason === null) return

    setBusy(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || undefined, markOnly }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message ?? data.error ?? 'refund_failed')

      let msg = 'Orden marcada como reembolsada'
      if (data.providerRefunded === true) msg = 'Reembolso procesado en Pagopar ✓'
      else if (data.fallbackManual) msg = 'Estado actualizado — completá el reembolso manualmente en el panel de Pagopar'
      setFeedback({ kind: 'ok', message: msg })
      router.refresh()
    } catch (err) {
      setFeedback({ kind: 'error', message: err instanceof Error ? err.message : 'Error al reembolsar' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => refund(false)}
          disabled={busy}
          className="rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {busy ? 'Reembolsando…' : 'Reembolsar vía Pagopar'}
        </button>
        <button
          type="button"
          onClick={() => refund(true)}
          disabled={busy}
          className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm font-medium hover:bg-surface-light disabled:opacity-50"
        >
          Marcar como reembolsada (sin Pagopar)
        </button>
      </div>
      {feedback ? (
        <p
          role={feedback.kind === 'error' ? 'alert' : 'status'}
          className={`rounded p-2 text-xs ${feedback.kind === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  )
}
