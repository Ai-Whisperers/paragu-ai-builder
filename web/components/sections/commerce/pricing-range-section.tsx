import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

/**
 * Pricing range — "from X to Y" pricing with the factors that drive variation.
 * For services where a fixed tier is misleading (photographers, architects,
 * commission-based work).
 */

export interface PricingRangeProps {
  title?: string
  subtitle?: string
  minPrice: string
  maxPrice: string
  factors: string[]
  ctaText?: string
  ctaHref?: string
}

export function PricingRangeSection({
  title = 'Inversion estimada',
  subtitle,
  minPrice,
  maxPrice,
  factors,
  ctaText = 'Solicitar cotizacion personalizada',
  ctaHref = '#contacto',
}: PricingRangeProps) {
  return (
    <section className="py-14 bg-surface">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}

          <div className="mt-6 flex items-baseline justify-center gap-2">
            <span className="text-2xl sm:text-4xl font-bold text-primary">{minPrice}</span>
            <span className="text-muted-foreground">—</span>
            <span className="text-2xl sm:text-4xl font-bold text-primary">{maxPrice}</span>
          </div>

          <div className="mt-8 text-left bg-background rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-2">
              Lo que hace variar el precio:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {factors.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={ctaHref}
            className="inline-block mt-6 bg-primary text-[var(--primary-foreground)] px-6 py-2 rounded"
          >
            {ctaText}
          </a>
        </div>
      </Container>
    </section>
  )
}
