import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardImage, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface ServiceItem {
  name: string
  description?: string
  price?: string
  priceFrom?: string
  duration?: number
  imageUrl?: string
  category?: string
}

export interface ServicesSectionProps {
  title: string
  subtitle?: string
  services: ServiceItem[]
  showPrices?: boolean
  showDuration?: boolean
}

export function ServicesSection({
  title,
  subtitle,
  services,
  showPrices = true,
  showDuration = true,
}: ServicesSectionProps) {
  return (
    <section id="servicios" className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <div className="mb-12 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index}>
              {service.imageUrl && (
                <CardImage src={service.imageUrl} alt={service.name} className="h-48" />
              )}
              <CardContent>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{service.name}</CardTitle>
                  {showPrices && (service.price || service.priceFrom) && (
                    <Badge variant="outline">
                      {service.priceFrom ? `Desde ${service.priceFrom}` : service.price}
                    </Badge>
                  )}
                </div>
                {service.description && (
                  <CardDescription>{service.description}</CardDescription>
                )}
                {showDuration && service.duration && (
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    {service.duration} min
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
