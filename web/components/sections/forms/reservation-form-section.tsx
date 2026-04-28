'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Calendar, Users, Send } from 'lucide-react'

export interface ReservationFormSectionProps {
  title?: string
  subtitle?: string
  restaurantName?: string
  maxPartySize?: number
  phone: string
  variant?: 'standard' | 'compact'
  __locale?: string
}

export function ReservationFormSection({
  title = 'Reservá tu mesa',
  subtitle = 'Completá los datos y te confirmamos por WhatsApp',
  maxPartySize = 12,
  phone,
  variant = 'standard',
}: ReservationFormSectionProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [name, setName] = useState('')

  const buildUrl = () => {
    const msg = `Hola! Quiero reservar:%0A- Fecha: ${date}%0A- Hora: ${time}%0A- Personas: ${partySize}%0A- Nombre: ${name}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

  const isValid = date && time && name

  if (variant === 'compact') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-sm">
            <Heading level={3} className="mb-4">{title}</Heading>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Personas:</span>
                <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="rounded border border-border px-2 py-1 text-sm">-</button>
                <span className="min-w-[24px] text-center text-sm font-medium">{partySize}</span>
                <button onClick={() => setPartySize(Math.min(maxPartySize, partySize + 1))} className="rounded border border-border px-2 py-1 text-sm">+</button>
              </div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              {isValid && (
                <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                  <Send className="h-4 w-4" /> Reservar por WhatsApp
                </a>
              )}
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Fecha</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-secondary focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Hora</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Personas</label>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="flex h-7 w-7 items-center justify-center rounded border border-border text-sm hover:bg-surface-light">-</button>
                <span className="min-w-[24px] text-center font-medium text-foreground">{partySize}</span>
                <button onClick={() => setPartySize(Math.min(maxPartySize, partySize + 1))} className="flex h-7 w-7 items-center justify-center rounded border border-border text-sm hover:bg-surface-light">+</button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
            </div>
            {isValid && (
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Confirmar reserva por WhatsApp
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
