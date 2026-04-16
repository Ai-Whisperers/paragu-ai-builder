import { Clock } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardImage, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

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

function ServiceCard({
  service,
  showPrices,
  showDuration,
  index,
}: {
  service: ServiceItem
  showPrices: boolean
  showDuration: boolean
  index: number
}) {
  return (
    <AnimateOnScroll stagger={index}>
      <Card>
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
            <p className="mt-2 flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock size={12} />
              {service.duration} min
            </p>
          )}
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}

export function ServicesSection({
  title,
  subtitle,
  services,
  showPrices = true,
  showDuration = true,
}: ServicesSectionProps) {
  // Group services by category if categories exist
  const hasCategories = services.some((s) => s.category)
  const grouped = hasCategories
    ? services.reduce<Record<string, ServiceItem[]>>((acc, s) => {
        const cat = s.category || 'Otros'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(s)
        return acc
      }, {})
    : null

  return (
    <section id="servicios" className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {grouped ? (
          // Render grouped by category
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, categoryServices]) => (
              <div key={category}>
                <AnimateOnScroll>
                  <h3 className="mb-6 text-xl font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {category}
                  </h3>
                </AnimateOnScroll>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service, index) => (
                    <ServiceCard
                      key={index}
                      service={service}
                      showPrices={showPrices}
                      showDuration={showDuration}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat grid
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                showPrices={showPrices}
                showDuration={showDuration}
                index={index}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
