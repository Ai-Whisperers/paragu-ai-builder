import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, Gauge, Fuel, Cog } from 'lucide-react'

export interface Vehicle {
  name: string
  year: number
  price: string
  mileage?: string
  fuelType?: string
  transmission?: string
  image?: string
  condition?: string
}

export interface VehicleListingSectionProps {
  title?: string
  subtitle?: string
  vehicles?: Vehicle[]
  variant?: 'grid' | 'list'
  __locale?: string
}

export function VehicleListingSection({
  title = 'Vehículos disponibles',
  subtitle = 'Encontrá tu próximo auto',
  vehicles = [],
  variant = 'grid',
}: VehicleListingSectionProps) {
  if (!vehicles?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-8 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <Card key={`${v.name}-${v.year}`}>
              {v.image && <img src={v.image} alt={v.name} className="h-48 w-full rounded-t-xl object-cover" />}
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{v.name}</h3>
                    <p className="text-sm text-muted-foreground">{v.year}</p>
                  </div>
                  {v.condition && <Badge variant={v.condition === 'Nuevo' ? 'default' : 'secondary'}>{v.condition}</Badge>}
                </div>
                <p className="text-xl font-bold text-primary">{v.price}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {v.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" /> {v.mileage}</span>}
                  {v.fuelType && <span className="flex items-center gap-1"><Fuel className="h-3 w-3" /> {v.fuelType}</span>}
                  {v.transmission && <span className="flex items-center gap-1"><Cog className="h-3 w-3" /> {v.transmission}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
