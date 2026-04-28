'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Send, Wrench } from 'lucide-react'

export interface ServiceSchedule {
  name: string
  price?: string
  duration?: string
}

export interface ServiceSchedulerSectionProps {
  title?: string
  subtitle?: string
  services?: ServiceSchedule[]
  phone: string
  host?: string
  variant?: 'form' | 'compact'
  __locale?: string
}

export function ServiceSchedulerSection({
  title = 'Agendá tu servicio',
  subtitle = 'Seleccioná el servicio y coordinamos',
  services = [],
  phone,
  variant = 'form',
}: ServiceSchedulerSectionProps) {
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [vehicle, setVehicle] = useState('')

  const svc = services.find((s) => s.name === selected)
  const isValid = selected && date && time && name

  const buildUrl = () => {
    const msg = `Hola! Quiero agendar:%0A- Servicio: ${selected}${svc?.price ? ` (${svc.price})` : ''}%0A- Vehículo: ${vehicle}%0A- Fecha: ${date}%0A- Hora: ${time}%0A- Nombre: ${name}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <Heading level={2}>{title}</Heading>
          </div>
          {subtitle && <p className="mb-6 text-center text-sm text-muted-foreground">{subtitle}</p>}
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Servicio</label>
              <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
                <option value="">Seleccioná...</option>
                {services.map((s) => <option key={s.name} value={s.name}>{s.name}{s.price ? ` — ${s.price}` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Vehículo (marca y modelo)</label>
              <input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Ej. Toyota Hilux 2020" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Fecha</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Hora</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            {isValid && (
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Agendar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
