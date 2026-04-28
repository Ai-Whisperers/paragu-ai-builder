'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'

interface BusinessData {
  id: string
  slug: string
  name: string
  type: string
  phone: string | null
  email: string | null
  whatsapp: string | null
  instagram: string | null
  facebook: string | null
  address: string | null
  neighborhood: string | null
  city: string | null
  tagline: string | null
  hours: Record<string, string> | null
}

const FIELDS = [
  { key: 'name', label: 'Nombre del negocio', type: 'text' },
  { key: 'tagline', label: 'Eslogan / Tagline', type: 'text' },
  { key: 'phone', label: 'Teléfono', type: 'tel' },
  { key: 'email', label: 'Correo electrónico', type: 'email' },
  { key: 'whatsapp', label: 'WhatsApp', type: 'tel' },
  { key: 'instagram', label: 'Instagram', type: 'text' },
  { key: 'facebook', label: 'Facebook', type: 'text' },
  { key: 'address', label: 'Dirección', type: 'text' },
  { key: 'neighborhood', label: 'Barrio', type: 'text' },
  { key: 'city', label: 'Ciudad', type: 'text' },
]

const GROUPS = [
  { title: 'Información general', keys: ['name', 'tagline'] },
  { title: 'Contacto', keys: ['phone', 'email', 'whatsapp', 'instagram', 'facebook'] },
  { title: 'Ubicación', keys: ['address', 'neighborhood', 'city'] },
]

export default function SettingsPage() {
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal/business')
      .then((r) => r.json())
      .then((d) => {
        const biz = d.business as BusinessData
        setBusiness(biz)
        const initial: Record<string, string> = {}
        for (const { key } of FIELDS) {
          initial[key] = String(biz[key as keyof BusinessData] ?? '')
        }
        setValues(initial)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const update = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/portal/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">
            Actualizá la información de tu negocio
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>

      <div className="space-y-6">
        {GROUPS.map(({ title, keys }) => (
          <div key={title} className="rounded-xl border bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
            <div className="space-y-4">
              {keys.map((key) => {
                const field = FIELDS.find((f) => f.key === key)
                if (!field) return null
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={values[key] ?? ''}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
