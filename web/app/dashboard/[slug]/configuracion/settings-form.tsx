'use client'

import { useState } from 'react'

interface BusinessData {
  name?: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  neighborhood?: string
  city?: string
  instagram?: string
  facebook?: string
  hours?: Record<string, { open?: string; close?: string; closed?: boolean }>
}

export function SettingsForm({ business, businessId }: { business: BusinessData | null; businessId: string }) {
  const [form, setForm] = useState<BusinessData>({
    name: business?.name || '',
    phone: business?.phone || '',
    whatsapp: business?.whatsapp || '',
    email: business?.email || '',
    address: business?.address || '',
    neighborhood: business?.neighborhood || '',
    city: business?.city || '',
    instagram: business?.instagram || '',
    facebook: business?.facebook || '',
    hours: business?.hours || {},
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch(`/api/tenant/${businessId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels: Record<string, string> = {
    monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves',
    friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-medium text-gray-900">Información del negocio</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Teléfono" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+595 9XX XXX XXX" />
          <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="+595 9XX XXX XXX" />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          <Field label="Dirección" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Field label="Barrio" value={form.neighborhood} onChange={(v) => setForm({ ...form, neighborhood: v })} />
          <Field label="Ciudad" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Field label="Instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
          <Field label="Facebook" value={form.facebook} onChange={(v) => setForm({ ...form, facebook: v })} />
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-medium text-gray-900">Horarios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {days.map((day) => {
            const h = form.hours?.[day] || {}
            return (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">{dayLabels[day]}</span>
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={h.closed || false}
                    onChange={(e) => setForm({
                      ...form,
                      hours: { ...form.hours, [day]: { ...h, closed: e.target.checked } },
                    })}
                  />
                  Cerrado
                </label>
                {!h.closed && (
                  <>
                    <input
                      type="time"
                      value={h.open || '09:00'}
                      onChange={(e) => setForm({
                        ...form,
                        hours: { ...form.hours, [day]: { ...h, open: e.target.value } },
                      })}
                      className="w-24 px-2 py-1 text-sm border rounded-lg"
                    />
                    <span className="text-xs text-gray-400">a</span>
                    <input
                      type="time"
                      value={h.close || '18:00'}
                      onChange={(e) => setForm({
                        ...form,
                        hours: { ...form.hours, [day]: { ...h, close: e.target.value } },
                      })}
                      className="w-24 px-2 py-1 text-sm border rounded-lg"
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {saved && (
          <span className="text-sm text-green-600">✓ Cambios guardados</span>
        )}
      </div>
    </form>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string
  value?: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  )
}
