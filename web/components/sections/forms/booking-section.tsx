'use client'

import { Heading } from '@/components/ui/heading'

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
  businessSlug?: string
  onComplete?: (data: unknown) => Promise<void>
}

export function BookingSection({
  title = 'Reserva Tu Cita',
  subtitle,
  services,
  staff = [],
  workingHours = { start: '08:00', end: '20:00' },
  whatsappPhone,
  businessSlug,
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
      <section id="reservar" className="font-heading bg-surface py-16 sm:py-20">
        <div className="font-heading mx-auto max-w-2xl px-4">
          <div className="font-heading bg-surface rounded-xl shadow-sm border border-border p-8 text-center">
            <div className="font-heading w-16 h-16 bg-[var(--color-success-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="font-heading w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Heading level={2} className="font-heading text-2xl font-bold text-foreground mb-2">¡Reserva Confirmada!</Heading>
            <p className="font-heading text-muted-foreground mb-6">
              Te hemos enviado los detalles por WhatsApp. Te esperamos en tu cita.
            </p>
            <button
              onClick={() => setBookingComplete(false)}
              className="font-heading text-primary hover:underline"
            >
              Hacer otra reserva
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reservar" className="font-heading bg-surface py-16 sm:py-20">
      <div className="font-heading mx-auto max-w-3xl px-4">
        <div className="font-heading text-center mb-8">
          <Heading level={2} className="font-heading text-xl sm:text-3xl font-bold text-foreground">
            {title}
          </Heading>
          {subtitle && (
            <p className="font-heading mt-2 text-muted-foreground">{subtitle}</p>
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
          businessSlug={businessSlug || ''}
          onComplete={handleComplete}
        />
      </div>
    </section>
  )
}