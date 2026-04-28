import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Truck, Clock } from 'lucide-react'

export interface DeliveryZone {
  name: string
  fee?: string
  freeThreshold?: string
  estimatedDays?: string
  description?: string
}

export interface DeliveryZonesSectionProps {
  title?: string
  subtitle?: string
  zones?: DeliveryZone[]
  variant?: 'list' | 'cards'
  __locale?: string
}

export function DeliveryZonesSection({
  title = 'Zonas de entrega',
  subtitle = 'Hacemos envíos a las siguientes áreas',
  zones = [],
  variant = 'list',
}: DeliveryZonesSectionProps) {
  if (!zones?.length) return null

  if (variant === 'cards') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mb-8 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <Card key={zone.name}>
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{zone.name}</h3>
                  </div>
                  {zone.description && <p className="mb-3 text-sm text-muted-foreground">{zone.description}</p>}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {zone.fee && <p className="flex items-center gap-1"><Truck className="h-3 w-3" /> Costo: {zone.fee}</p>}
                    {zone.freeThreshold && <p className="flex items-center gap-1">✓ Gratis desde {zone.freeThreshold}</p>}
                    {zone.estimatedDays && <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {zone.estimatedDays}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border">
          {zones.map((zone) => (
            <div key={zone.name} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{zone.name}</p>
                  {zone.description && <p className="text-xs text-muted-foreground">{zone.description}</p>}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {zone.fee && <p>{zone.fee}</p>}
                {zone.freeThreshold && <p className="text-green-600">Gratis +{zone.freeThreshold}</p>}
                {zone.estimatedDays && <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {zone.estimatedDays}</p>}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
