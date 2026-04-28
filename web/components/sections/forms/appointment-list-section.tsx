'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'

export interface Appointment {
  date: string
  time: string
  service: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  client?: string
}

export interface AppointmentListSectionProps {
  title?: string
  subtitle?: string
  appointments?: Appointment[]
  showClient?: boolean
  variant?: 'cards' | 'list' | 'calendar'
  __locale?: string
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  confirmed: <CheckCircle className="h-3 w-3" />,
  completed: <CheckCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
}

export function AppointmentListSection({
  title = 'Mis turnos',
  subtitle = 'Administrá tus citas agendadas',
  appointments = [],
  showClient = false,
  variant = 'cards',
}: AppointmentListSectionProps) {
  const [filter, setFilter] = useState<string>('all')

  if (!appointments?.length) return null

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)
  const statuses = [...new Set(appointments.map((a) => a.status))]

  if (variant === 'list') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <Heading level={2} className="mb-2">{title}</Heading>
          {subtitle && <p className="mb-6 text-muted-foreground">{subtitle}</p>}
          <div className="divide-y divide-border rounded-xl border border-border">
            {filtered.map((apt, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{apt.date.split('-')[2]}</p>
                    <p className="text-xs text-muted-foreground">{apt.date.slice(0, 7)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{apt.service}</p>
                    <p className="text-sm text-muted-foreground">{apt.time}</p>
                    {showClient && apt.client && <p className="text-xs text-muted-foreground">{apt.client}</p>}
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[apt.status] || ''}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex gap-1">
            <button onClick={() => setFilter('all')} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${filter === 'all' ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground hover:bg-surface'}`}>Todos</button>
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${filter === s ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground hover:bg-surface'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((apt, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {apt.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {apt.time}
                  </span>
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{apt.service}</h3>
                {showClient && apt.client && <p className="text-xs text-muted-foreground">{apt.client}</p>}
                <span className={`mt-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[apt.status] || ''}`}>
                  {STATUS_ICONS[apt.status]} {apt.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
