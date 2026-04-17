'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface Room {
  id: string
  name: string
  description?: string
  capacity: number
  amenities?: string[]
  imageUrl?: string
  pricePerHour?: string
  pricePerSession?: string
}

interface RoomBookingSectionProps {
  title?: string
  subtitle?: string
  rooms: Room[]
  whatsappPhone?: string
}

export function RoomBookingSection({
  title = 'Reserva de Salas',
  subtitle,
  rooms,
  whatsappPhone
}: RoomBookingSectionProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const handleBook = (room: Room) => {
    setSelectedRoom(room)
    if (whatsappPhone) {
      const message = `Hola! Quisiera reservar la sala ${room.name} para ${room.capacity} personas.`
      window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  return (
    <section id="salas" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow"
            >
              {room.imageUrl ? (
                <div className="aspect-video bg-[var(--surface-light)]">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[var(--text)]">{room.name}</h3>
                  <span className="text-sm text-[var(--text-muted)]">
                    {room.capacity} personas
                  </span>
                </div>

                {room.description && (
                  <p className="text-sm text-[var(--text-muted)] mb-3">{room.description}</p>
                )}

                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.amenities.slice(0, 3).map((amenity, aidx) => (
                      <span
                        key={aidx}
                        className="text-xs px-2 py-1 bg-[var(--surface-light)] rounded-full text-[var(--text-muted)]"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-xs px-2 py-1 text-[var(--text-muted)]">
                        +{room.amenities.length - 3} más
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <div>
                    {room.pricePerHour && (
                      <span className="text-lg font-bold text-[var(--primary)]">
                        {room.pricePerHour}
                      </span>
                    )}
                    {room.pricePerSession && !room.pricePerHour && (
                      <span className="text-lg font-bold text-[var(--primary)]">
                        {room.pricePerSession}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleBook(room)}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}