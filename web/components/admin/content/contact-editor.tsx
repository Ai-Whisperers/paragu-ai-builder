'use client'

import { useState } from 'react'
import type { ContactContent } from '@/lib/commerce/business-content'
import { useSaveSection } from './use-save-section'
import { FieldInput, SaveButton } from './form-primitives'
import { DEMO_WHATSAPP } from '@/lib/constants'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
}

type Hours = NonNullable<ContactContent['hours']>
type HourRow = Hours[number]

const DEFAULT_HOURS: Hours = DAYS.map((day) => ({ day, open: '09:00', close: '18:00', closed: day === 'sun' })) as Hours

export function ContactEditor({ businessId, initial }: { businessId: string; initial?: ContactContent }) {
  const { saving, feedback, save } = useSaveSection(businessId, 'contact')
  const [hours, setHours] = useState<Hours>(initial?.hours ?? DEFAULT_HOURS)

  function updateHour(day: HourRow['day'], patch: Partial<HourRow>) {
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)) as Hours)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const f = new FormData(event.currentTarget)
    await save({
      phone: String(f.get('phone') ?? ''),
      whatsapp: String(f.get('whatsapp') ?? ''),
      email: String(f.get('email') ?? ''),
      address: String(f.get('address') ?? ''),
      city: String(f.get('city') ?? ''),
      googleMapsUrl: String(f.get('googleMapsUrl') ?? ''),
      hours,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-6">
        <h3 className="text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Contacto</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldInput name="phone" label="Teléfono" defaultValue={initial?.phone ?? ''} placeholder="+595 21 123 456" />
          <FieldInput name="whatsapp" label="WhatsApp" defaultValue={initial?.whatsapp ?? ''} placeholder={DEMO_WHATSAPP} />
          <FieldInput name="email" label="Email" type="email" defaultValue={initial?.email ?? ''} />
          <FieldInput name="city" label="Ciudad" defaultValue={initial?.city ?? ''} placeholder="Asunción" />
          <FieldInput
            name="address"
            label="Dirección"
            defaultValue={initial?.address ?? ''}
            placeholder="Av. España 1234"
          />
          <FieldInput
            name="googleMapsUrl"
            label="Google Maps URL"
            type="url"
            defaultValue={initial?.googleMapsUrl ?? ''}
            hint="Pegá el link de Google Maps → compartir"
          />
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-6">
        <h3 className="text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Horarios</h3>
        <div className="divide-y divide-[color:var(--border,#e5e7eb)]">
          {hours.map((row) => (
            <div key={row.day} className="grid grid-cols-[100px_1fr_auto] items-center gap-3 py-2">
              <span className="text-sm font-medium">{DAY_LABELS[row.day]}</span>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={row.open ?? ''}
                  onChange={(e) => updateHour(row.day, { open: e.target.value })}
                  disabled={row.closed}
                  className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm disabled:bg-surface-light"
                />
                <span className="text-xs text-[color:var(--text-muted,#6b7280)]">a</span>
                <input
                  type="time"
                  value={row.close ?? ''}
                  onChange={(e) => updateHour(row.day, { close: e.target.value })}
                  disabled={row.closed}
                  className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm disabled:bg-surface-light"
                />
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={row.closed ?? false}
                  onChange={(e) => updateHour(row.day, { closed: e.target.checked })}
                />
                Cerrado
              </label>
            </div>
          ))}
        </div>
      </section>

      <SaveButton saving={saving} feedback={feedback} />
    </form>
  )
}
