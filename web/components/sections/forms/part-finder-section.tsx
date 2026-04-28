'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Search, Send } from 'lucide-react'

export interface PartFinderSectionProps {
  title?: string
  subtitle?: string
  phone: string
  vehicleTypes?: string[]
  categories?: string[]
  variant?: 'form' | 'compact'
  __locale?: string
}

export function PartFinderSection({
  title = 'Buscá tu repuesto',
  subtitle = 'Decinos qué necesitás y te cotizamos',
  phone,
  vehicleTypes = ['Auto', 'Camioneta', 'Moto', 'Camión', 'Otro'],
  categories = ['Motor', 'Frenos', 'Suspensión', 'Eléctrico', 'Carrocería', 'Accesorios'],
  variant = 'form',
}: PartFinderSectionProps) {
  const [vehicleType, setVehicleType] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year2, setYear2] = useState('')
  const [part, setPart] = useState('')
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')

  const isValid = (vehicleType || brand || model) && part && name

  const buildUrl = () => {
    const msg = `Hola! Busco un repuesto:%0A- Vehículo: ${vehicleType} ${brand} ${model} ${year2}%0A- Categoría: ${category}%0A- Pieza: ${part}%0A- Nombre: ${name}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg.replace(/\s+/g, ' '))}`
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-2 flex justify-center"><Search className="h-8 w-8 text-primary" /></div>
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Tipo</label>
                <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"><option value="">Tipo</option>{vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}</select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"><option value="">Categoría</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Marca</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ej. Toyota" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Año</label>
                <input type="text" value={year2} onChange={(e) => setYear2(e.target.value)} placeholder="2020" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Modelo</label>
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ej. Hilux" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Repuesto que necesitas</label>
              <textarea value={part} onChange={(e) => setPart(e.target.value)} placeholder="Ej. Disco de freno delantero" rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
            </div>
            {isValid && (
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Consultar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
