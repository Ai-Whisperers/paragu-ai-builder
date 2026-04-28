'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Clock } from 'lucide-react'

interface Branch {
  name: string
  address: string
  phone?: string
  hours?: string
  coordinates?: { lat: number; lng: number }
  image?: string
}

interface BranchesSectionProps {
  title?: string
  subtitle?: string
  branches: Branch[]
}

export function BranchesSection({
  title = 'Nuestras Sucursales',
  subtitle = 'Encontranos en estos locales',
  branches,
}: BranchesSectionProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)

  if (!branches?.length) return null

  return (
    <section className="py-16 bg-surface">
      <Container>
        <div className="text-center mb-10">
          <Heading level={2} className="text-xl sm:text-3xl font-bold text-foreground">
            {title}
          </Heading>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch, idx) => (
            <Card
              key={idx}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedBranch(selectedBranch === idx ? null : idx)}
            >
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg text-foreground mb-2">{branch.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    <span>{branch.address}</span>
                  </div>
                  {branch.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      <a href={`tel:${branch.phone}`} className="hover:text-primary">{branch.phone}</a>
                    </div>
                  )}
                  {branch.hours && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <span>{branch.hours}</span>
                    </div>
                  )}
                </div>

                {selectedBranch === idx && branch.coordinates && (
                  <div className="mt-4 h-48 rounded-lg bg-[var(--surface-muted,#f3f4f6)] overflow-hidden">
                    <iframe
                      title={`Mapa ${branch.name}`}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${branch.coordinates.lat},${branch.coordinates.lng}&z=15&output=embed`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
