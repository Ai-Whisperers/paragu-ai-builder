'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { useState, useEffect } from 'react'
import { Clock, Bell } from 'lucide-react'

export interface AppointmentReminderSectionProps {
  title?: string
  appointment?: {
    date: string
    time: string
    service: string
    location?: string
  }
  variant?: 'banner' | 'card' | 'inline'
  __locale?: string
}

function timeUntil(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hours, minutes] = timeStr.split(':').map(Number)
  const target = new Date(year, month - 1, day, hours, minutes)
  const now = new Date()
  const diff = target.getTime() - now.getTime()

  if (diff < 0) return 'Vencido'
  const days = Math.floor(diff / 86400000)
  const hrs = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)

  if (days > 0) return `En ${days}d ${hrs}h`
  if (hrs > 0) return `En ${hrs}h ${mins}min`
  return `En ${mins}min`
}

export function AppointmentReminderSection({
  title = 'Próximo turno',
  appointment,
  variant = 'banner',
}: AppointmentReminderSectionProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!appointment) return null

  const countdown = mounted ? timeUntil(appointment.date, appointment.time) : 'Cargando...'

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">{appointment.service}</span>
        <span>{appointment.date} {appointment.time}</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{countdown}</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{appointment.service}</p>
            <p className="text-sm text-muted-foreground">{appointment.date} a las {appointment.time}</p>
            {appointment.location && <p className="text-xs text-muted-foreground">{appointment.location}</p>}
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{countdown}</span>
        </div>
      </div>
    )
  }

  return (
    <Section spacing="sm" background="surface">
      <Container>
        <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {title}: <span className="font-semibold">{appointment.service}</span>
              </p>
              <p className="text-xs text-muted-foreground">{appointment.date} a las {appointment.time}</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">{countdown}</span>
        </div>
      </Container>
    </Section>
  )
}
