'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ShippingZone } from '@/lib/commerce/shipping-zones'

const PY_REGIONS = [
  'Asunción', 'Central', 'Alto Paraná', 'Itapúa', 'Caaguazú', 'Cordillera',
  'Paraguarí', 'San Pedro', 'Guairá', 'Misiones', 'Ñeembucú', 'Concepción',
  'Canindeyú', 'Caazapá', 'Amambay', 'Alto Paraguay', 'Boquerón', 'Presidente Hayes',
]

function formatGs(cents: number): string {
  return `Gs ${cents.toLocaleString('es-PY')}`
}

function summariseRule(zone: ShippingZone): string {
  if (zone.rules.type === 'flat') return `Monto fijo · ${formatGs(zone.rules.amountCents)}`
  if (zone.rules.type === 'cart_total_tiers') {
    return `${zone.rules.tiers.length} tramos por subtotal`
  }
  return '—'
}

export function ShippingZonesManager({
  businessId,
  initialZones,
}: {
  businessId: string
  initialZones: ShippingZone[]
}) {
  const router = useRouter()
  const [zones, setZones] = useState(initialZones)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createZone(payload: {
    name: string
    amountCents: number
    regions: string[]
  }) {
    setError(null)
    setCreating(true)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          countries: ['PY'],
          regions: payload.regions.length > 0 ? payload.regions : null,
          rules: { type: 'flat', amountCents: payload.amountCents },
          status: 'active',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'create_failed')
      setZones((prev) => [...prev, data.zone].sort((a, b) => a.sortOrder - b.sortOrder))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setCreating(false)
    }
  }

  async function deleteZone(zoneId: string) {
    if (!confirm('¿Eliminar esta zona?')) return
    const res = await fetch(`/api/admin/commerce/${businessId}/shipping/${zoneId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setZones((prev) => prev.filter((z) => z.id !== zoneId))
      router.refresh()
    }
  }

  async function updateZoneAmount(zoneId: string, amountCents: number) {
    const res = await fetch(`/api/admin/commerce/${businessId}/shipping/${zoneId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules: { type: 'flat', amountCents } }),
    })
    if (res.ok) {
      const data = await res.json()
      setZones((prev) => prev.map((z) => (z.id === zoneId ? data.zone : z)))
    }
  }

  return (
    <div className="space-y-4">
      {zones.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-6 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
          Aún no tenés zonas configuradas. Los shoppers verán envío gratis (Gs 0) hasta que agregues una.
        </div>
      ) : (
        zones.map((zone) => (
          <div
            key={zone.id}
            className="flex items-center justify-between rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4"
          >
            <div className="flex-1">
              <p className="font-medium">{zone.name}</p>
              <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
                {summariseRule(zone)} ·{' '}
                {zone.regions && zone.regions.length > 0
                  ? zone.regions.join(', ')
                  : 'Todo el país'}
              </p>
            </div>
            {(() => {
              if (zone.rules.type !== 'flat') return null
              const flatRule = zone.rules // narrows after the guard
              return (
                <input
                  type="number"
                  defaultValue={flatRule.amountCents}
                  min={0}
                  onBlur={(e) => {
                    const v = parseInt(e.target.value || '0', 10)
                    if (v !== flatRule.amountCents && v >= 0) {
                      updateZoneAmount(zone.id, v)
                    }
                  }}
                  className="w-32 rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-right text-sm"
                />
              )
            })()}
            <button
              type="button"
              onClick={() => deleteZone(zone.id)}
              className="ml-3 text-xs text-red-700 hover:underline"
            >
              Quitar
            </button>
          </div>
        ))
      )}

      <NewZoneForm onCreate={createZone} creating={creating} />

      {error ? (
        <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function NewZoneForm({
  onCreate,
  creating,
}: {
  onCreate: (payload: { name: string; amountCents: number; regions: string[] }) => void
  creating: boolean
}) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [regions, setRegions] = useState<string[]>([])

  function toggleRegion(r: string) {
    setRegions((prev) => (prev.includes(r) ? prev.filter((p) => p !== r) : [...prev, r]))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const amountCents = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0
    if (!name.trim() || amountCents <= 0) return
    onCreate({ name: name.trim(), amountCents, regions })
    setName('')
    setAmount('')
    setRegions([])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-surface p-4"
    >
      <p className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
        Nueva zona
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Gran Asunción"
          maxLength={200}
          className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Costo Gs"
          className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-[color:var(--text-muted,#6b7280)]">
          Regiones cubiertas (vacío = todo Paraguay)
        </p>
        <div className="flex flex-wrap gap-2">
          {PY_REGIONS.map((r) => (
            <label
              key={r}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${
                regions.includes(r)
                  ? 'border-[color:var(--primary,#111)] bg-primary/10 text-[color:var(--primary,#111)]'
                  : 'border-[color:var(--border,#e5e7eb)] text-[color:var(--text-muted,#6b7280)]'
              }`}
            >
              <input
                type="checkbox"
                checked={regions.includes(r)}
                onChange={() => toggleRegion(r)}
                className="sr-only"
              />
              {r}
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={creating || !name.trim() || !amount.trim()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {creating ? 'Creando…' : '+ Agregar zona'}
      </button>
    </form>
  )
}
