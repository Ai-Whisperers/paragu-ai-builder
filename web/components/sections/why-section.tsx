import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface WhyPoint {
  title: string
  description: string
  icon?: string
}

export interface WhySectionProps {
  title: string
  subtitle?: string
  points: WhyPoint[]
}

const POINT_ICONS: Record<string, string> = {
  economy: '📈',
  tax: '💰',
  lifestyle: '🌴',
  process: '⚡',
}

export function WhySection({ title, subtitle, points }: WhySectionProps) {
  return (
    <section id="por-que-paraguay" className="py-16 sm:py-20" style={{ backgroundColor: 'var(--surface-light)' }}>
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2} className="mb-3 text-center" style={{ color: 'var(--primary)' }}>
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto mb-12 max-w-2xl text-center text-lg" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
          {points.map((point, idx) => (
            <AnimateOnScroll key={idx} delay={idx * 0.1}>
              <div
                className="rounded-xl p-8 transition-shadow duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                  style={{ backgroundColor: 'var(--primary)', opacity: 0.9 }}
                >
                  <span className="text-white">
                    {point.icon && POINT_ICONS[point.icon] ? POINT_ICONS[point.icon] : (idx + 1).toString()}
                  </span>
                </div>
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                >
                  {point.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {point.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}
