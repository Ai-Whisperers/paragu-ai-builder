'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

export interface PropertySearchSectionProps {
  title?: string
  propertyTypes?: string[]
  locations?: string[]
  priceRange?: { min: number; max: number }
  currency?: string
  variant?: 'full' | 'compact'
  __locale?: string
}

export function PropertySearchSection({
  title = 'Buscá tu propiedad',
  propertyTypes = ['Casa', 'Departamento', 'Terreno', 'Local', 'Oficina'],
  locations = ['Asunción', 'Fernando de la Mora', 'San Lorenzo', 'Luque', 'Lambaré'],
  priceRange = { min: 0, max: 500000 },
  variant = 'full',
}: PropertySearchSectionProps) {
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')
  const [minPrice, setMinPrice] = useState(priceRange.min)
  const [maxPrice, setMaxPrice] = useState(priceRange.max)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (location) params.set('location', location)
    if (minPrice > priceRange.min) params.set('min', String(minPrice))
    if (maxPrice < priceRange.max) params.set('max', String(maxPrice))
    window.location.href = `/s/es/demo/tienda?${params.toString()}`
  }

  if (variant === 'compact') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-lg">
            <Heading level={3} className="mb-4">{title}</Heading>
            <div className="flex gap-2">
              <select value={type} onChange={(e) => setType(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="">Tipo</option>
                {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="">Ubicación</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={handleSearch} className="rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
                  <option value="">Todos</option>
                  {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Ubicación</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
                  <option value="">Todas</option>
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Precio mínimo: USD {minPrice.toLocaleString()}</label>
                <input type="range" min={priceRange.min} max={priceRange.max} step={10000} value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Precio máximo: USD {maxPrice.toLocaleString()}</label>
                <input type="range" min={priceRange.min} max={priceRange.max} step={10000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <button onClick={handleSearch} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:opacity-90">
              <Search className="h-4 w-4" /> Buscar propiedades
            </button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
