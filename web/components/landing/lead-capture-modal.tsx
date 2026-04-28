'use client'

import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'

interface LeadCaptureModalProps {
  open: boolean
  onClose: () => void
  planName: string
  planId: string
}

export function LeadCaptureModal({ open, onClose, planName, planId }: LeadCaptureModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', type: '' })

  if (!open) return null

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: form.business || form.name,
          slug: form.business?.toLowerCase().replace(/[^a-z0-9]/g, '-') || form.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          business_type: form.type || 'unknown',
          phone: form.phone,
          email: form.email,
          city: 'Asunción',
          status: 'demo_ready',
        }),
      })
      setStep('success')
    } catch {
      // still show success so user doesn't lose hope
      setStep('success')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {step === 'form' ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Comenzar {planName}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Dejanos tus datos y te contactamos en minutos</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Teléfono *</label>
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+595 981 324 569"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
                <input type="text" value={form.business} onChange={(e) => update('business', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
                <select value={form.type} onChange={(e) => update('type', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Seleccioná un rubro</option>
                  <option value="peluqueria">Peluquería</option>
                  <option value="salon_belleza">Salón de Belleza</option>
                  <option value="barberia">Barbería</option>
                  <option value="gimnasio">Gimnasio</option>
                  <option value="spa">Spa</option>
                  <option value="restaurant">Restaurante</option>
                  <option value="taller_mecanico">Taller Mecánico</option>
                  <option value="inmobiliaria">Inmobiliaria</option>
                  <option value="consultoria">Consultoría</option>
                  <option value="educacion">Educación</option>
                  <option value="salud">Salud</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <button type="submit" disabled={sending}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">¡Recibimos tus datos!</h2>
            <p className="mt-2 text-sm text-gray-500">Te contactamos por WhatsApp en las próximas horas.</p>
            <button onClick={onClose} className="mt-6 rounded-xl bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
