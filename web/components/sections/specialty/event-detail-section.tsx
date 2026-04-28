import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

export interface EventDetail {
  name: string
  date: string
  time: string
  venue: string
  description: string
  lineup?: string[]
  image?: string
  ticketUrl?: string
  mapUrl?: string
  capacity?: number
}

export interface EventDetailSectionProps {
  event?: EventDetail
  variant?: 'hero' | 'split'
  __locale?: string
}

export function EventDetailSection({
  event,
  variant = 'hero',
}: EventDetailSectionProps) {
  if (!event) return null

  if (variant === 'split') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {event.image && <img src={event.image} alt={event.name} className="h-80 w-full rounded-xl object-cover lg:h-full" />}
            <div>
              <Heading level={1} className="text-3xl">{event.name}</Heading>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {event.date}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {event.time}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.venue}</p>
                {event.capacity && <p className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Capacidad: {event.capacity}</p>}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
              {event.lineup && event.lineup.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 font-semibold text-foreground">Lineup</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.lineup.map((a) => <span key={a} className="rounded-full bg-surface-light px-3 py-1 text-xs text-muted-foreground">{a}</span>)}
                  </div>
                </div>
              )}
              {event.ticketUrl && (
                <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
                  Comprar entradas
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
        {event.image && <img src={event.image} alt={event.name} className="mb-6 h-72 w-full rounded-xl object-cover" />}
        <Heading level={1} className="text-3xl">{event.name}</Heading>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {event.date}</span>
          <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {event.time}</span>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.venue}</span>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{event.description}</p>
        {event.lineup && event.lineup.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 font-semibold text-foreground">Lineup</h3>
            <div className="flex flex-wrap gap-2">
              {event.lineup.map((a) => <span key={a} className="rounded-full bg-surface-light px-3 py-1 text-xs text-muted-foreground">{a}</span>)}
            </div>
          </div>
        )}
        {event.ticketUrl && (
          <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
            Comprar entradas
          </a>
        )}
      </Container>
    </Section>
  )
}
