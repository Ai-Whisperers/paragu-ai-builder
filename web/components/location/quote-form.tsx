'use client'

import { useState } from 'react'

interface QuoteFormProps {
  onSubmit: (data: any) => Promise<void>
  services?: string[]
}

export default function QuoteForm({ onSubmit, services = [] }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    description: '',
    timeline: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    await onSubmit(formData)
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-semibold text-green-800">¡Solicitud enviada!</h3>
        <p className="text-green-600 text-sm mt-2">Te contactaremos con tu presupuesto pronto.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        {services.length > 0 && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tipo de servicio</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Seleccionar</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Describe tu proyecto o necesidad</label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Cuéntanos más detalles sobre lo que necesitas..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-[var(--primary)] text-white font-medium py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Enviando...' : 'Solicitar Presupuesto'}
      </button>
    </form>
  )
}