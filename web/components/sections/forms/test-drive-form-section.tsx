'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Calendar, Car, Send } from 'lucide-react'

export interface TestDriveVehicle {
  id: string
  name: string
}

export interface TestDriveFormSectionProps {
  title?: string
  subtitle?: string
  vehicles?: TestDriveVehicle[]
  phone: string
  locations?: string[]
  variant?: 'form' | 'compact'
  __locale?: string
}

export function TestDriveFormSection({
  title = 'Agendá una prueba de manejo',
  subtitle = 'Vení a probar el vehículo sin compromiso',
  vehicles = [],
  phone,
  locations = ['Asunción'],
  variant = 'form',
}: TestDriveFormSectionProps) {
  const [vehicleId, setVehicleId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState(locations[0])
  const [name, setName] = useState('')

  const selected = vehicles.find((v) => v.id === vehicleId)
  const isValid = vehicleId && date && time && name

  const buildUrl = () => {
    const msg = `Hola! Quiero agendar una prueba de manejo:%0A- Vehículo: ${selected?.name || vehicleId}%0A- Fecha: ${date}%0A- Hora: ${time}%0A- Lugar: ${location}%0A- Nombre: ${name}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-2 flex justify-center"><Car className="h-8 w-8 text-primary" /></div>
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Vehículo</label>
              <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
                <option value="">Seleccioná...</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            {locations.length > 1 && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Lugar</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Fecha</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Hora</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            {isValid && (
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Agendar prueba
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
