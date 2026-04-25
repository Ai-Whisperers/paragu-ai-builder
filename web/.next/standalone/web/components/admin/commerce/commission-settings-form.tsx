'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface InitialValues {
  commissionPercent: number
  commissionFlatCents: number
  commissionExemptUntil: string | null
}

export function CommissionSettingsForm({
  businessId,
  initial,
}: {
  businessId: string
  initial: InitialValues
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setFeedback(null)
    const form = new FormData(event.currentTarget)
    const exemptRaw = String(form.get('commissionExemptUntil') ?? '').trim()

    const payload = {
      commissionPercent: parseFloat(String(form.get('commissionPercent') ?? '0')) || 0,
      commissionFlatCents: parseInt(String(form.get('commissionFlatCents') ?? '0').replace(/[^0-9]/g, ''), 10) || 0,
      commissionExemptUntil: exemptRaw ? new Date(exemptRaw).toISOString() : null,
    }

    try {
      const res = await fetch(`/api/admin/billing/${businessId}/commission`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'update_failed')
      setFeedback({ ok: true, message: 'Guardado. Se aplica desde la próxima orden.' })
      router.refresh()
    } catch (err) {
      setFeedback({ ok: false, message: err instanceof Error ? err.message : 'Error al guardar' })
    } finally {
      setSubmitting(false)
    }
  }

  // Default the datetime-local input to value in yyyy-MM-ddThh:mm form
  const exemptDefault = initial.commissionExemptUntil
    ? new Date(initial.commissionExemptUntil).toISOString().slice(0, 16)
    : ''

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
          Porcentaje de comisión (%)
        </span>
        <input
          name="commissionPercent"
          type="number"
          min={0}
          max={100}
          step={0.01}
          defaultValue={initial.commissionPercent}
          className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
        />
        <span className="mt-1 block text-xs text-[color:var(--text-muted,#9ca3af)]">
          Se aplica sobre el subtotal (no sobre envío ni impuestos). Default 5%.
        </span>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
          Comisión fija por orden (Gs)
        </span>
        <input
          name="commissionFlatCents"
          type="text"
          defaultValue={String(initial.commissionFlatCents)}
          placeholder="0"
          className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
        />
        <span className="mt-1 block text-xs text-[color:var(--text-muted,#9ca3af)]">
          Se suma al porcentaje. Útil para cubrir costos fijos. Dejá en 0 si no aplicás.
        </span>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
          Exento hasta (período de prueba / promo gratis)
        </span>
        <input
          name="commissionExemptUntil"
          type="datetime-local"
          defaultValue={exemptDefault}
          className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
        />
        <span className="mt-1 block text-xs text-[color:var(--text-muted,#9ca3af)]">
          Durante este período no se aplica comisión. Default: el promo de 3 meses gratis. Dejá vacío para cobrar inmediatamente.
        </span>
      </label>

      {feedback ? (
        <p
          role={feedback.ok ? 'status' : 'alert'}
          className={`rounded p-3 text-sm ${feedback.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}
        >
          {feedback.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {submitting ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  )
}
