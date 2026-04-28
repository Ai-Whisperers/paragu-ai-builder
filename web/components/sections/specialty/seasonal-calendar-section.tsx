import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Check, X } from 'lucide-react'

export interface SeasonalProduct {
  name: string
  available: boolean
  image?: string
}

export interface SeasonMonth {
  month: string
  products: SeasonalProduct[]
}

export interface SeasonalCalendarSectionProps {
  title?: string
  subtitle?: string
  seasons?: SeasonMonth[]
  variant?: 'grid' | 'list'
  __locale?: string
}

const DEFAULT_SEASONS: SeasonMonth[] = [
  { month: 'Enero', products: [{ name: 'Sandía', available: true }, { name: 'Mango', available: true }, { name: 'Frutilla', available: true }, { name: 'Maíz', available: false }] },
  { month: 'Abril', products: [{ name: 'Mandarina', available: true }, { name: 'Pomelo', available: true }, { name: 'Batata', available: true }, { name: 'Sandía', available: false }] },
  { month: 'Julio', products: [{ name: 'Naranja', available: true }, { name: 'Pera', available: true }, { name: 'Zapallo', available: true }] },
  { month: 'Octubre', products: [{ name: 'Mango', available: true }, { name: 'Frutilla', available: true }, { name: 'Miel', available: true }, { name: 'Huevos', available: true }] },
]

export function SeasonalCalendarSection({
  title = 'Calendario de estación',
  subtitle = 'Productos disponibles según la temporada',
  seasons = DEFAULT_SEASONS,
  variant = 'grid',
}: SeasonalCalendarSectionProps) {
  if (!seasons?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-8 text-center">
          <CalendarDays className="mx-auto mb-2 h-8 w-8 text-primary" />
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {seasons.map((season) => (
            <Card key={season.month}>
              <CardContent className="p-5">
                <h3 className="mb-4 text-center font-semibold text-foreground">{season.month}</h3>
                <div className="space-y-2">
                  {season.products.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{p.name}</span>
                      {p.available ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-300" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
