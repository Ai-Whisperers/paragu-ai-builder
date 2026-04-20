import { Clock } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { SpotlightCard } from '@/components/ui/glow'
import { StaggerContainer } from '@/components/ui/animated'
import { cn } from '@/lib/utils'

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
  /** Enable enhanced effects (spotlight cards, staggered animations) */
  enhanced?: boolean
  /** Card style variant */
  cardStyle?: 'default' | 'glass' | 'gradient' | 'outline'
  /** Enable hover lift effect on cards */
  hoverEffect?: boolean
}

/**
 * Services section with optional enhanced effects.
 * 
 * @example
 * // Basic services grid
 * <ServicesSection
 *   title="Our Services"
 *   subtitle="What we offer"
 *   services={services}
 * />
 * 
 * @example
 * // Enhanced with spotlight cards and staggered animations
 * <ServicesSection
 *   title="Our Services"
 *   subtitle="What we offer"
 *   services={services}
 *   enhanced
 *   cardStyle="default"
 *   hoverEffect
 * />
 */
export function ServicesSection({
  title,
  subtitle,
  services,
  showPrices = true,
  showDuration = true,
  enhanced = false,
  cardStyle = 'default',
  hoverEffect = true,
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

  const ServiceCard = ({ 
    service, 
    index 
  }: { 
    service: ServiceItem
    index: number 
  }) => {
    const cardContent = (
      <>
        {service.imageUrl && (
          <div className={cn(
            "overflow-hidden",
            enhanced ? "rounded-t-xl" : "rounded-t-lg"
          )}>
            <img
              src={service.imageUrl}
              alt={service.name}
              className={cn(
                "h-48 w-full object-cover",
                hoverEffect && "transition-transform duration-500 hover:scale-110"
              )}
              loading="lazy"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2">
            <Heading level={3} className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {service.name}
            </Heading>
            {showPrices && (service.price || service.priceFrom) && (
              <Badge variant="outline">
                {service.priceFrom ? `Desde ${service.priceFrom}` : service.price}
              </Badge>
            )}
          </div>
          {service.description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{service.description}</p>
          )}
          {showDuration && service.duration && (
            <p className="mt-3 flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock size={12} />
              {service.duration} min
            </p>
          )}
        </div>
      </>
    )

    if (enhanced) {
      return (
        <SpotlightCard 
          rounded="xl" 
          borderGlow={hoverEffect}
          className={cn(
            "bg-[var(--surface)]",
            hoverEffect && "hover:shadow-card-hover"
          )}
        >
          {cardContent}
        </SpotlightCard>
      )
    }

    return (
      <div className={cn(
        "overflow-hidden rounded-lg bg-[var(--surface)] shadow-card",
        hoverEffect && "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
      )}>
        {cardContent}
      </div>
    )
  }

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
                  <Heading level={3} 
                    className="mb-6 text-xl font-semibold text-[var(--text)]" 
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {category}
                  </Heading>
                </AnimateOnScroll>
                
                {enhanced ? (
                  <StaggerContainer 
                    staggerDelay={100} 
                    animation="fade-up"
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {categoryServices.map((service, index) => (
                      <ServiceCard key={index} service={service} index={index} />
                    ))}
                  </StaggerContainer>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryServices.map((service, index) => (
                      <AnimateOnScroll key={index} stagger={index}>
                        <ServiceCard service={service} index={index} />
                      </AnimateOnScroll>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Flat grid
          enhanced ? (
            <StaggerContainer 
              staggerDelay={100} 
              animation="fade-up"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} index={index} />
              ))}
            </StaggerContainer>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <AnimateOnScroll key={index} stagger={index}>
                  <ServiceCard service={service} index={index} />
                </AnimateOnScroll>
              ))}
            </div>
          )
        )}
      </Container>
    </section>
  )
}
