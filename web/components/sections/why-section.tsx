'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { useLocale } from '@/lib/i18n/language-context'

export interface WhyPoint {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  icon?: string
}

export interface WhySectionProps {
  title: string
  titleEn?: string
  subtitle?: string
  subtitleEn?: string
  points: WhyPoint[]
}

const POINT_ICONS: Record<string, string> = {
  economy: '📈',
  tax: '💰',
  lifestyle: '🌴',
  process: '⚡',
}

export function WhySection({ title, titleEn, subtitle, subtitleEn, points }: WhySectionProps) {
  const { t } = useLocale()

  return (
    <section id="por-que-paraguay" className="py-16 sm:py-20" style={{ backgroundColor: 'var(--surface-light)' }}>
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2} className="mb-3 text-center" style={{ color: 'var(--primary)' }}>
            {t(title, titleEn)}
          </Heading>
          {subtitle && (
            <p className="mx-auto mb-12 max-w-2xl text-center text-lg" style={{ color: 'var(--text-muted)' }}>
              {t(subtitle, subtitleEn)}
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
                  {t(point.title, point.titleEn)}
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {t(point.description, point.descriptionEn)}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}
