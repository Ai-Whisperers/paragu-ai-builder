'use client'

import { useState } from 'react'
import BookingWizard from '@/components/booking/booking-wizard'

interface Service {
  name: string
  description?: string
  price?: string
  priceFrom?: string
  duration?: number
  category?: string
}

interface Staff {
  name: string
  role?: string
  imageUrl?: string
  bio?: string
  specialties?: string[]
}

interface BookingSectionProps {
  title?: string
  subtitle?: string
  services: Service[]
  staff?: Staff[]
  workingHours?: { start: string; end: string }
  whatsappPhone?: string
  onComplete?: (data: unknown) => Promise<void>
}

export function BookingSection({
  title = 'Reserva Tu Cita',
  subtitle,
  services,
  staff = [],
  workingHours = { start: '08:00', end: '20:00' },
  whatsappPhone,
  onComplete
}: BookingSectionProps) {
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleComplete = async (data: unknown) => {
    setBookingComplete(true)
    if (onComplete) {
      await onComplete(data)
    }
  }

  if (bookingComplete) {
    return (
      <section id="reservar" className="bg-[var(--surface)] py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">¡Reserva Confirmada!</h2>
            <p className="text-[var(--text-muted)] mb-6">
              Te hemos enviado los detalles por WhatsApp. Te esperamos en tu cita.
            </p>
            <button
              onClick={() => setBookingComplete(false)}
              className="text-[var(--primary)] hover:underline"
            >
              Hacer otra reserva
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reservar" className="bg-[var(--surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <BookingWizard
          services={services.map(s => ({
            name: s.name,
            price: s.price || s.priceFrom,
            duration: s.duration,
            category: s.category
          }))}
          staff={staff.map(s => ({
            name: s.name,
            role: s.role,
            image: s.imageUrl,
            bio: s.bio,
            specialties: s.specialties
          }))}
          workingHours={workingHours}
          whatsappPhone={whatsappPhone}
          onComplete={handleComplete}
        />
      </div>
    </section>
  )
}