'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ALL_SECTIONS = [
  { id: 'hero', label: 'Hero principal', default: true },
  { id: 'services', label: 'Servicios', default: true },
  { id: 'about', label: 'Sobre nosotros', default: true },
  { id: 'team', label: 'Equipo', default: false },
  { id: 'testimonials', label: 'Testimonios', default: true },
  { id: 'gallery', label: 'Galería', default: false },
  { id: 'faq', label: 'Preguntas frecuentes', default: true },
  { id: 'contact', label: 'Contacto', default: true },
  { id: 'cta-banner', label: 'Banner CTA', default: false },
  { id: 'pricing', label: 'Precios', default: false },
  { id: 'blog-index', label: 'Blog', default: false },
  { id: 'booking', label: 'Reservas', default: false },
]

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

export function OnboardingWizard({
  slug,
  businessId,
  business,
}: {
  slug: string
  businessId: string
  business: any
}) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: business?.name || '',
    phone: business?.phone || '',
    whatsapp: business?.whatsapp || '',
    email: business?.email || '',
    address: business?.address || '',
    city: business?.city || '',
    headline: '',
    subheadline: '',
    ctaText: 'Contactanos',
    sections: ALL_SECTIONS.filter((s) => s.default).map((s) => s.id),
    hours: {} as Record<string, { open: string; close: string; closed: boolean }>,
  })

  const totalSteps = 5
  const progress = ((step + 1) / totalSteps) * 100

  async function handleComplete() {
    setSaving(true)
    try {
      await fetch(`/api/tenant/${businessId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          address: form.address,
          city: form.city,
          hours: form.hours,
        }),
      })

      await fetch(`/api/tenant/${businessId}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero: {
            headline: form.headline || `Bienvenido a ${form.name}`,
            subheadline: form.subheadline || '',
            cta: form.ctaText,
          },
        }),
      })

      router.push(`/dashboard/${slug}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 text-center">Paso {step + 1} de {totalSteps}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {step === 0 && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🚀</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido!</h1>
              <p className="text-gray-500 mb-6">
                En unos pasos vamos a configurar tu sitio web. Después vas a poder editarlo
                cuando quieras desde tu panel de control.
              </p>
              <button
                onClick={() => setStep(1)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Comenzar
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Información del negocio</h2>
              <p className="text-sm text-gray-500">Contanos sobre tu negocio</p>

              <Field label="Nombre del negocio" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Teléfono" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+595 9XX XXX XXX" />
                <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="+595 9XX XXX XXX" />
              </div>
              <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
              <Field label="Dirección" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
              <Field label="Ciudad" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Horarios</h2>
              <p className="text-sm text-gray-500">Decinos cuándo trabajás</p>

              <div className="space-y-3">
                {DAYS.map((day) => {
                  const h = form.hours[day.key] || { open: '09:00', close: '18:00', closed: day.key === 'sunday' }
                  return (
                    <div key={day.key} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20">{day.label}</span>
                      <label className="flex items-center gap-2 text-xs text-gray-500">
                        <input
                          type="checkbox"
                          checked={h.closed}
                          onChange={(e) => setForm({
                            ...form,
                            hours: { ...form.hours, [day.key]: { ...h, closed: e.target.checked } },
                          })}
                        />
                        Cerrado
                      </label>
                      {!h.closed && (
                        <>
                          <input type="time" value={h.open} onChange={(e) => setForm({ ...form, hours: { ...form.hours, [day.key]: { ...h, open: e.target.value } } })} className="w-24 px-2 py-1 text-sm border rounded-lg" />
                          <span className="text-xs text-gray-400">a</span>
                          <input type="time" value={h.close} onChange={(e) => setForm({ ...form, hours: { ...form.hours, [day.key]: { ...h, close: e.target.value } } })} className="w-24 px-2 py-1 text-sm border rounded-lg" />
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Hero principal</h2>
              <p className="text-sm text-gray-500">La primera impresión de tu sitio</p>

              <Field label="Título principal" value={form.headline} onChange={(v) => setForm({ ...form, headline: v })} placeholder={`Bienvenido a ${form.name || 'tu negocio'}`} />
              <Field label="Subtítulo" value={form.subheadline} onChange={(v) => setForm({ ...form, subheadline: v })} placeholder="Describí brevemente qué ofrecés" />
              <Field label="Texto del botón" value={form.ctaText} onChange={(v) => setForm({ ...form, ctaText: v })} placeholder="Contactanos" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Secciones del sitio</h2>
              <p className="text-sm text-gray-500">Elegí qué secciones mostrar en tu página principal</p>

              <div className="space-y-2">
                {ALL_SECTIONS.map((section) => (
                  <label key={section.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.sections.includes(section.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, sections: [...form.sections, section.id] })
                        } else {
                          setForm({ ...form, sections: form.sections.filter((s) => s !== section.id) })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{section.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {step > 0 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Atrás
            </button>

            {step < totalSteps - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Guardando...' : '¡Finalizar!'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value?: string; onChange: (v: string) => void; placeholder?: string; type?: string
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
