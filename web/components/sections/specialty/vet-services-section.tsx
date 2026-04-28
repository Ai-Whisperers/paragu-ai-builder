import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Syringe, Clock, DollarSign } from 'lucide-react'

export interface VetService {
  name: string
  description?: string
  price?: string
  duration?: string
  category?: string
}

export interface VetServicesSectionProps {
  title?: string
  subtitle?: string
  services?: VetService[]
  variant?: 'cards' | 'list'
  __locale?: string
}

export function VetServicesSection({
  title = 'Servicios veterinarios',
  subtitle = 'Cuidamos de tu mascota',
  services = [],
  variant = 'cards',
}: VetServicesSectionProps) {
  if (!services?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-8 text-center">
          <Syringe className="mx-auto mb-2 h-8 w-8 text-primary" />
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <Card key={svc.name}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground">{svc.name}</h3>
                {svc.description && <p className="mt-1 text-sm text-muted-foreground">{svc.description}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {svc.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {svc.duration}</span>}
                  {svc.price && <span className="flex items-center gap-1 font-semibold text-primary"><DollarSign className="h-3 w-3" /> {svc.price}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
