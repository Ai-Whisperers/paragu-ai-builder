'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface Venue {
  id: string
  name: string
  description?: string
  capacity: number
  idealFor: string[]
  amenities?: string[]
  imageUrl?: string
  priceFrom?: string
}

interface EventVenuesSectionProps {
  title?: string
  subtitle?: string
  venues: Venue[]
  whatsappPhone?: string
}

export function EventVenuesSection({
  title = 'Espacios para Eventos',
  subtitle,
  venues,
  whatsappPhone
}: EventVenuesSectionProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  const handleInquire = (venue: Venue) => {
    setSelectedVenue(venue)
    if (whatsappPhone) {
      const message = `Hola! Me interesa el espacio "${venue.name}" para ${venue.idealFor.join(', ')}. Quisiera más información sobre precios y disponibilidad.`
      window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  return (
    <section id="eventos" className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-8">
          {venues.map((venue, idx) => (
            <div
              key={idx}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-video md:aspect-auto bg-[var(--surface-light)]">
                  {venue.imageUrl ? (
                    <img
                      src={venue.imageUrl}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                      <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--text)] mb-2">{venue.name}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Hasta {venue.capacity} personas
                      </span>
                    </div>

                    {venue.description && (
                      <p className="text-[var(--text-muted)] mb-4">{venue.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {venue.idealFor.map((use, uidx) => (
                        <span
                          key={uidx}
                          className="text-xs px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full font-medium"
                        >
                          {use}
                        </span>
                      ))}
                    </div>

                    {venue.amenities && venue.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {venue.amenities.slice(0, 4).map((amenity, aidx) => (
                          <span
                            key={aidx}
                            className="text-xs px-2 py-1 bg-[var(--surface-light)] rounded text-[var(--text-muted)]"
                          >
                            {amenity}
                          </span>
                        ))}
                        {venue.amenities.length > 4 && (
                          <span className="text-xs py-1 text-[var(--text-muted)]">
                            +{venue.amenities.length - 4} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    {venue.priceFrom && (
                      <span className="text-sm text-[var(--text-muted)]">
                        Desde <span className="font-semibold text-[var(--primary)]">{venue.priceFrom}</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleInquire(venue)}
                      className="px-5 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Consultar Disponibilidad
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}