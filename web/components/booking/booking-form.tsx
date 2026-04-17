'use client'

import { useState } from 'react'

interface BookingFormProps {
  service?: { name: string; price?: string; duration?: number }
  date?: Date
  time?: string
  staff?: { name: string } | null
  onSubmit: (data: BookingFormData) => Promise<void>
}

interface BookingFormData {
  name: string
  email: string
  phone: string
  notes?: string
}

export default function BookingForm({
  service,
  date,
  time,
  staff,
  onSubmit
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      await onSubmit(formData)
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">¡Reserva Confirmada!</h3>
        <p className="text-gray-600 mb-4">Te hemos enviado un correo de confirmación.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
          <p><strong>Servicio:</strong> {service?.name}</p>
          {date && <p><strong>Fecha:</strong> {date.toLocaleDateString('es-PY')}</p>}
          {time && <p><strong>Hora:</strong> {time}</p>}
          {staff && <p><strong>Profesional:</strong> {staff.name}</p>}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="font-medium text-gray-900">Tus datos</h4>
      
      <div>
        <label className="block text-sm text-gray-700 mb-1">Nombre completo *</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          placeholder="Juan Pérez"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="juan@email.com"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Teléfono *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="+595 9xx xxx xxx"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Notas adicionales</label>
        <textarea
          name="notes"
          rows={2}
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          placeholder="Alguna solicitud especial..."
        />
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm">
        <h5 className="font-medium mb-2">Resumen de la reserva</h5>
        {service && <p><span className="text-gray-500">Servicio:</span> {service.name}</p>}
        {service?.price && <p><span className="text-gray-500">Precio:</span> {service.price}</p>}
        {date && <p><span className="text-gray-500">Fecha:</span> {date.toLocaleDateString('es-PY')}</p>}
        {time && <p><span className="text-gray-500">Hora:</span> {time}</p>}
        {staff && <p><span className="text-gray-500">Profesional:</span> {staff.name}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-[var(--primary)] text-white font-medium py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Confirmando...' : 'Confirmar Reserva'}
      </button>
    </form>
  )
}