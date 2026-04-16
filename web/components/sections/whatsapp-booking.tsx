'use client'

import { useState } from 'react'
import { MessageCircle, Calendar, Clock, Scissors, X } from 'lucide-react'

interface WhatsAppBookingProps {
  phone: string
  businessName: string
  services?: Array<{
    name: string
    price?: string
    duration?: number
  }>
}

/**
 * WhatsApp booking flow — lets customers compose a booking message
 * with selected service, preferred date/time, then opens WhatsApp.
 */
export function WhatsAppBooking({ phone, businessName, services }: WhatsAppBookingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const cleanPhone = phone.replace(/\D/g, '')

  function buildMessage(): string {
    const parts = [`Hola! Quisiera reservar una cita en ${businessName}.`]
    if (name) parts.push(`Mi nombre es ${name}.`)
    if (selectedService) parts.push(`Servicio: ${selectedService}.`)
    if (date) parts.push(`Fecha preferida: ${date}.`)
    if (time) parts.push(`Hora preferida: ${time}.`)
    parts.push('Gracias!')
    return parts.join('\n')
  }

  function handleBook() {
    const message = encodeURIComponent(buildMessage())
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-semibold text-white shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <Calendar size={20} />
        Reservar por WhatsApp
      </button>
    )
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card-hover">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--text)]">
          <MessageCircle size={20} className="text-[#25D366]" />
          Reservar Cita
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-light)]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">Tu Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como te llamas?"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        {services && services.length > 0 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text)]">
              <Scissors size={14} className="mr-1 inline" />
              Servicio
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="">Selecciona un servicio</option>
              {services.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                  {s.price ? ` — ${s.price}` : ''}
                  {s.duration ? ` (${s.duration} min)` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text)]">
              <Calendar size={14} className="mr-1 inline" />
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text)]">
              <Clock size={14} className="mr-1 inline" />
              Hora
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
        </div>

        <button
          onClick={handleBook}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-base font-semibold text-white shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <MessageCircle size={18} />
          Enviar por WhatsApp
        </button>

        <p className="text-center text-xs text-[var(--text-muted)]">
          Se abrira WhatsApp con tu mensaje de reserva
        </p>
      </div>
    </div>
  )
}
