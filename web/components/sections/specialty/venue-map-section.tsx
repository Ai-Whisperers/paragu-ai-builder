'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { MapPin, Users } from 'lucide-react'

export interface VenueSection {
  name: string
  rows: number
  seatsPerRow: number
}

export interface VenueMapSectionProps {
  title?: string
  venueName?: string
  address?: string
  capacity?: number
  sections?: VenueSection[]
  googleMapsUrl?: string
  variant?: 'interactive' | 'static'
  __locale?: string
}

export function VenueMapSection({
  title = 'Mapa del venue',
  venueName,
  address,
  capacity,
  sections = [],
  googleMapsUrl,
  variant = 'static',
}: VenueMapSectionProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  if (variant === 'static') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-lg">
            <Heading level={2} className="mb-2">{title}</Heading>
            <Card>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{venueName}</h3>
                    {address && <p className="text-sm text-muted-foreground">{address}</p>}
                  </div>
                </div>
                {capacity && <p className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Capacidad: {capacity}</p>}
                {googleMapsUrl && (
                  <div className="mt-4 h-48 overflow-hidden rounded-lg">
                    <iframe
                      title={venueName || 'Ubicación'}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(address || venueName || '')}&output=embed`}
                      className="border-0"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <Heading level={2} className="mb-6">{title}</Heading>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground">{venueName}</h3>
                {address && <p className="text-sm text-muted-foreground">{address}</p>}
                {capacity && <p className="mt-2 text-sm text-muted-foreground">Capacidad total: {capacity}</p>}
                {sections.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {sections.map((sec) => (
                      <button
                        key={sec.name}
                        onClick={() => setSelectedSection(sec.name)}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                          selectedSection === sec.name ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <p className="font-medium text-foreground">{sec.name}</p>
                        <p className="text-xs text-muted-foreground">{sec.rows} filas · {sec.seatsPerRow} asientos por fila</p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {googleMapsUrl && (
            <div className="h-80 overflow-hidden rounded-xl">
              <iframe title="Mapa" width="100%" height="100%" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(address || venueName || '')}&output=embed`} className="border-0" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
