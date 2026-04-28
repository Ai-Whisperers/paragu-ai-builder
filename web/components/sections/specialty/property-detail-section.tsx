'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { MapPin, Bed, Bath, Maximize, Home, ChevronLeft, ChevronRight } from 'lucide-react'

export interface Property {
  title: string
  price: string
  currency?: string
  beds?: number
  baths?: number
  area?: string
  description: string
  images: string[]
  location: string
  features: string[]
  type?: string
  status?: string
}

export interface PropertyDetailSectionProps {
  property?: Property
  variant?: 'gallery' | 'split'
  __locale?: string
}

export function PropertyDetailSection({
  property,
  variant = 'gallery',
}: PropertyDetailSectionProps) {
  const [imgIdx, setImgIdx] = useState(0)

  if (!property) return null

  const img = property.images[imgIdx]

  return (
    <Section spacing="md" background="surface">
      <Container>
        {/* Image gallery */}
        <div className="relative mb-6 overflow-hidden rounded-xl">
          {img && <img src={img} alt={property.title} className="h-[400px] w-full object-cover" />}
          {property.images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2">
              <button onClick={() => setImgIdx((i) => (i - 1 + property.images.length) % property.images.length)} className="rounded-full bg-white/80 p-2 shadow hover:bg-white"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setImgIdx((i) => (i + 1) % property.images.length)} className="rounded-full bg-white/80 p-2 shadow hover:bg-white"><ChevronRight className="h-5 w-5" /></button>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex gap-1">
            {property.images.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`h-2 w-2 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
          {property.status && <Badge className="absolute left-3 top-3">{property.status}</Badge>}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold text-foreground">{property.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {property.location}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              {property.beds && <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Bed className="h-4 w-4 text-primary" /> {property.beds} dorm.</span>}
              {property.baths && <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Bath className="h-4 w-4 text-primary" /> {property.baths} baños</span>}
              {property.area && <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Maximize className="h-4 w-4 text-primary" /> {property.area}</span>}
              {property.type && <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Home className="h-4 w-4 text-primary" /> {property.type}</span>}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{property.description}</p>
            {property.features.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-foreground">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <span key={f} className="rounded-full bg-surface-light px-3 py-1 text-xs text-muted-foreground">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-border bg-surface p-6">
              <p className="text-sm text-muted-foreground">{property.currency || 'USD'}</p>
              <p className="text-3xl font-bold text-foreground">{property.price}</p>
              <Button variant="primary" size="lg" className="mt-4 w-full" asChild>
                <a href={`https://wa.me/?text=Hola!%20Quiero%20información%20sobre%20${encodeURIComponent(property.title)}`}>
                  Consultar por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
