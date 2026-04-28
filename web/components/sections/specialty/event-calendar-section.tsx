'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'

export interface CalendarEvent {
  name: string
  date: string
  time?: string
  venue?: string
  price?: string
  image?: string
  url?: string
}

export interface EventCalendarSectionProps {
  title?: string
  subtitle?: string
  events?: CalendarEvent[]
  variant?: 'grid' | 'list'
  __locale?: string
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function formatDate(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr)
  return { day: String(d.getDate()), month: MONTHS[d.getMonth()].slice(0, 3) }
}

export function EventCalendarSection({
  title = 'Próximos eventos',
  subtitle = 'No te pierdas nuestras actividades',
  events = [],
  variant = 'grid',
}: EventCalendarSectionProps) {
  if (!events?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-8 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const { day, month } = formatDate(ev.date)
            return (
              <Card key={ev.name}>
                {ev.image && <img src={ev.image} alt={ev.name} className="h-36 w-full rounded-t-xl object-cover" />}
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-primary/10 py-2 text-center">
                      <span className="text-lg font-bold text-primary">{day}</span>
                      <span className="text-[10px] font-medium uppercase text-primary">{month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">{ev.name}</h3>
                      {ev.time && <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {ev.time}</p>}
                      {ev.venue && <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {ev.venue}</p>}
                    </div>
                  </div>
                  {ev.price && <p className="text-sm font-semibold text-primary">{ev.price}</p>}
                  {ev.url && (
                    <a href={ev.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      Más información →
                    </a>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
