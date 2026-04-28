'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DiscountRecord, DiscountType } from '@/lib/commerce/discounts-admin'

function formatGs(cents: number | null): string {
  if (cents === null) return '—'
  return `Gs ${cents.toLocaleString('es-PY')}`
}

function summariseValue(d: DiscountRecord): string {
  if (d.type === 'percent') return `${d.valuePercent}%`
  if (d.type === 'fixed_amount') return formatGs(d.valueCents)
  return 'Envío gratis'
}

export function DiscountsManager({
  businessId,
  initialDiscounts,
}: {
  businessId: string
  initialDiscounts: DiscountRecord[]
}) {
  const router = useRouter()
  const [discounts, setDiscounts] = useState(initialDiscounts)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create(payload: {
    code: string
    type: DiscountType
    valuePercent?: number
    valueCents?: number
    minSubtotalCents: number
    endsAt?: string
    maxUses?: number
  }) {
    setError(null)
    const res = await fetch(`/api/admin/commerce/${businessId}/discounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(
        data.error === 'code_already_exists'
          ? 'Ya existe un código con ese nombre.'
          : data.error ?? 'Error al crear',
      )
      return false
    }
    setDiscounts((prev) => [data.discount, ...prev])
    setShowForm(false)
    router.refresh()
    return true
  }

  async function pauseToggle(id: string, current: DiscountRecord['status']) {
    const nextStatus = current === 'active' ? 'paused' : 'active'
    const res = await fetch(`/api/admin/commerce/${businessId}/discounts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    if (res.ok) {
      const { discount } = await res.json()
      setDiscounts((prev) => prev.map((d) => (d.id === id ? discount : d)))
    }
  }

  async function deleteDiscount(id: string) {
    if (!confirm('¿Eliminar este código? Esta acción no se puede deshacer.')) return
    const res = await fetch(`/api/admin/commerce/${businessId}/discounts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setDiscounts((prev) => prev.filter((d) => d.id !== id))
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          + Nuevo código
        </button>
      )}

      {showForm && <NewDiscountForm onCreate={create} onCancel={() => setShowForm(false)} />}

      {error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      {discounts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-6 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
          Sin códigos todavía. Creá el primero — promociones típicas: <code>BIENVENIDO10</code>, <code>ENVIOGRATIS</code>.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--surface-muted,#f9fafb)] text-left">
              <tr>
                <th className="px-4 py-2 font-semibold">Código</th>
                <th className="px-4 py-2 font-semibold">Tipo</th>
                <th className="px-4 py-2 font-semibold">Mínimo</th>
                <th className="px-4 py-2 font-semibold">Usos</th>
                <th className="px-4 py-2 font-semibold">Estado</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-t border-[color:var(--border,#e5e7eb)]">
                  <td className="px-4 py-2 font-mono font-semibold">{d.code}</td>
                  <td className="px-4 py-2">{summariseValue(d)}</td>
                  <td className="px-4 py-2 text-[color:var(--text-muted,#6b7280)]">
                    {d.minSubtotalCents > 0 ? formatGs(d.minSubtotalCents) : '—'}
                  </td>
                  <td className="px-4 py-2 text-[color:var(--text-muted,#6b7280)]">
                    {d.usesCount}
                    {d.maxUses ? ` / ${d.maxUses}` : ''}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        d.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : d.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => pauseToggle(d.id, d.status)}
                        className="text-xs text-[color:var(--primary,#111)] underline"
                      >
                        {d.status === 'active' ? 'Pausar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDiscount(d.id)}
                        className="text-xs text-red-700 underline"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function NewDiscountForm({
  onCreate,
  onCancel,
}: {
  onCreate: (payload: {
    code: string
    type: DiscountType
    valuePercent?: number
    valueCents?: number
    minSubtotalCents: number
    endsAt?: string
    maxUses?: number
  }) => Promise<boolean>
  onCancel: () => void
}) {
  const [type, setType] = useState<DiscountType>('percent')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    const f = new FormData(event.currentTarget)
    const code = String(f.get('code') ?? '').trim()
    const minSubtotalCents = parseInt(String(f.get('minSubtotalCents') ?? '0').replace(/[^0-9]/g, ''), 10) || 0
    const endsAt = String(f.get('endsAt') ?? '')
    const maxUsesRaw = parseInt(String(f.get('maxUses') ?? ''), 10)

    const payload = {
      code,
      type,
      minSubtotalCents,
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      maxUses: Number.isFinite(maxUsesRaw) && maxUsesRaw > 0 ? maxUsesRaw : undefined,
      valuePercent:
        type === 'percent'
          ? parseFloat(String(f.get('valuePercent') ?? '0')) || undefined
          : undefined,
      valueCents:
        type === 'fixed_amount'
          ? parseInt(String(f.get('valueCents') ?? '0').replace(/[^0-9]/g, ''), 10) || undefined
          : undefined,
    }
    await onCreate(payload)
    setSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Código (se guarda en mayúsculas)</span>
          <input
            name="code"
            required
            maxLength={80}
            placeholder="LANZAMIENTO20"
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm uppercase"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DiscountType)}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          >
            <option value="percent">Porcentaje</option>
            <option value="fixed_amount">Monto fijo (Gs)</option>
            <option value="free_shipping">Envío gratis</option>
          </select>
        </label>
        {type === 'percent' && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Porcentaje de descuento</span>
            <input
              name="valuePercent"
              type="number"
              min={1}
              max={100}
              step={0.5}
              required
              placeholder="20"
              className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            />
          </label>
        )}
        {type === 'fixed_amount' && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Monto descontado (Gs)</span>
            <input
              name="valueCents"
              required
              placeholder="20000"
              className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Subtotal mínimo (Gs, opcional)</span>
          <input
            name="minSubtotalCents"
            placeholder="0"
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Vence (opcional)</span>
          <input
            name="endsAt"
            type="datetime-local"
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Usos máximos (opcional)</span>
          <input
            name="maxUses"
            type="number"
            min={1}
            placeholder="100"
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? 'Creando…' : 'Crear código'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-[color:var(--border,#e5e7eb)] px-4 py-2 text-sm hover:bg-surface-light"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
