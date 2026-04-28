'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = [
  { title: 'Tu negocio', description: 'Completá la información básica' },
  { title: 'Contacto', description: 'Agregá tus datos de contacto' },
  { title: 'Horarios', description: 'Configurá tus horarios de atención' },
  { title: 'Listo', description: 'Tu sitio está configurado' },
]

const WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function OnboardingPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    tagline: '',
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    neighborhood: '',
    city: 'Asunción',
    hours: Object.fromEntries(WEEKDAYS.map((d) => [d, '08:00 - 17:00'])),
  })
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const update = (field: string, value: string) => setData((p) => ({ ...p, [field]: value }))
  const updateHour = (day: string, value: string) => setData((p) => ({ ...p, hours: { ...p.hours, [day]: value } }))

  const canProceed = () => {
    if (step === 0) return data.name.length >= 2
    if (step === 1) return data.phone.length >= 6 || data.email.length >= 3
    return true
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await fetch('/api/portal/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          tagline: data.tagline,
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp,
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          hours: data.hours,
        }),
      })
      setDone(true)
      setTimeout(() => router.push(`/dashboard/${slug}`), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">¡Todo listo!</h2>
          <p className="mt-2 text-gray-500">Redirigiendo al panel de control...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurá tu sitio</h1>
        <p className="mt-1 text-sm text-gray-500">Completá los datos para publicar tu sitio web</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">{STEPS[step].description}</p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio *</label>
              <input type="text" value={data.name} onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eslogan / Tagline</label>
              <input type="text" value={data.tagline} onChange={(e) => update('tagline', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input type="text" value={data.city} onChange={(e) => update('city', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+595 981 324 569"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input type="tel" value={data.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input type="text" value={data.address} onChange={(e) => update('address', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barrio</label>
              <input type="text" value={data.neighborhood} onChange={(e) => update('neighborhood', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {WEEKDAYS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-28 text-sm font-medium text-gray-700">{day}</span>
                <input
                  type="text"
                  value={data.hours[day]}
                  onChange={(e) => updateHour(day, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
            <p className="text-xs text-gray-400">Formato: 08:00 - 17:00. Escribí "Cerrado" si no abre.</p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Check className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Revisá tu información</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {data.name && <p><strong>Negocio:</strong> {data.name}</p>}
              {data.phone && <p><strong>Teléfono:</strong> {data.phone}</p>}
              {data.email && <p><strong>Email:</strong> {data.email}</p>}
              {data.city && <p><strong>Ciudad:</strong> {data.city}</p>}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Guardando...' : 'Finalizar'} <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
