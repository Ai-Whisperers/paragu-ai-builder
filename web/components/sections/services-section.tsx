import Image from 'next/image'
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
  /** Optional dual-currency prices — when both present they render as "$X / ₲Y" */
  priceUSD?: string
  pricePYG?: string
  /** Optional expected delivery time (e.g. "1–2 semanas") */
  delivery?: string
  /** Optional list of bullet points describing what's included */
  includes?: string[]
  duration?: number
  imageUrl?: string
  category?: string
  /** Optional URL — when set the whole card becomes a clickable link. */
  href?: string
}

export interface ServicesSectionProps {
  title: string
  subtitle?: string
  services?: ServiceItem[]
  /** Legacy alias — some content files ship `items` instead of `services`. */
  items?: ServiceItem[]
  showPrices?: boolean
  showDuration?: boolean
  /** Enable enhanced effects (spotlight cards, staggered animations) */
  enhanced?: boolean
  /** Card style variant */
  cardStyle?: 'default' | 'glass' | 'gradient' | 'outline'
  /** Enable hover lift effect on cards */
  hoverEffect?: boolean
  /** Active URL locale — picks localized defaults for "From" price prefix and "Other" category fallback. */
  __locale?: string
}

const SERVICE_LABELS: Record<string, { from: string; otherCategory: string; includes: string; delivery: string }> = {
  en: { from: 'From', otherCategory: 'Other', includes: 'Includes', delivery: 'Delivery' },
  es: { from: 'Desde', otherCategory: 'Otros', includes: 'Incluye', delivery: 'Entrega' },
}

function renderPriceLabel(service: ServiceItem, fromLabel: string): string | null {
  if (service.priceUSD && service.pricePYG) {
    return `${service.priceUSD} / ${service.pricePYG}`
  }
  if (service.priceUSD) return service.priceUSD
  if (service.pricePYG) return service.pricePYG
  if (service.priceFrom) return `${fromLabel} ${service.priceFrom}`
  if (service.price) return service.price
  return null
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
  services: servicesProp,
  items,
  showPrices = true,
  showDuration = true,
  enhanced = false,
  cardStyle = 'default',
  hoverEffect = true,
  __locale,
}: ServicesSectionProps) {
  const services = servicesProp || items || []
  if (services.length === 0) return null

  const L = SERVICE_LABELS[__locale ?? 'es'] || SERVICE_LABELS.es

  // Group services by category if categories exist
  const hasCategories = services.some((s) => s.category)
  const grouped = hasCategories
    ? services.reduce<Record<string, ServiceItem[]>>((acc, s) => {
        const cat = s.category || L.otherCategory
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
            <Image
              src={service.imageUrl}
              alt={service.name}
              width={400}
              height={192}
              sizes="(max-width: 768px) 100vw, 400px"
              className={cn(
                "h-48 w-full object-cover",
                hoverEffect && "transition-transform duration-500 hover:scale-110"
              )}
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2">
            <Heading level={3} className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {service.name}
            </Heading>
            {showPrices && renderPriceLabel(service, L.from) && (
              <Badge variant="outline">
                {renderPriceLabel(service, L.from)}
              </Badge>
            )}
          </div>
          {service.description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{service.description}</p>
          )}
          {service.delivery && (
            <p className="mt-3 flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock size={12} />
              {L.delivery}: {service.delivery}
            </p>
          )}
          {showDuration && service.duration && !service.delivery && (
            <p className="mt-3 flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock size={12} />
              {service.duration} min
            </p>
          )}
          {service.includes && service.includes.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {L.includes}
              </p>
              <ul className="mt-2 space-y-1">
                {service.includes.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--text)]">
                    <span className="text-[var(--primary)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    )

    const wrap = (inner: React.ReactNode) =>
      service.href ? (
        <a
          href={service.href}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] rounded-xl"
        >
          {inner}
        </a>
      ) : (
        inner
      )

    if (enhanced) {
      return wrap(
        <SpotlightCard
          rounded="xl"
          borderGlow={hoverEffect}
          className={cn(
            "bg-[var(--surface)]",
            hoverEffect && "hover:shadow-card-hover"
          )}
        >
          {cardContent}
        </SpotlightCard>,
      )
    }

    return wrap(
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
