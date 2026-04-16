'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { useLocale } from '@/lib/i18n/language-context'

export interface ProcessStep {
  step: number
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  duration?: string
  icon?: string
}

export interface ProcessTimelineSectionProps {
  title: string
  titleEn?: string
  subtitle?: string
  subtitleEn?: string
  steps: ProcessStep[]
  totalTime?: string
  totalTimeEn?: string
}

const STEP_ICONS: Record<string, string> = {
  'phone': '📞',
  'file-check': '📋',
  'calendar-check': '🗓️',
  'building': '🏢',
  'check-circle': '✅',
}

export function ProcessTimelineSection({
  title,
  titleEn,
  subtitle,
  subtitleEn,
  steps,
  totalTime,
  totalTimeEn,
}: ProcessTimelineSectionProps) {
  const { t } = useLocale()

  return (
    <section id="proceso" className="py-20" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2} className="mb-3 text-center" style={{ color: 'var(--primary)' }}>
            {t(title, titleEn)}
          </Heading>
          {subtitle && (
            <p className="mx-auto mb-16 max-w-2xl text-center text-lg" style={{ color: 'var(--text-muted)' }}>
              {t(subtitle, subtitleEn)}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className="mx-auto max-w-3xl">
          {steps.map((step, idx) => (
            <AnimateOnScroll key={step.step} stagger={idx}>
              <div className="relative flex gap-6 pb-12 last:pb-0">
                {/* Timeline Line */}
                {idx < steps.length - 1 && (
                  <div
                    className="absolute left-6 top-14 w-0.5"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      opacity: 0.3,
                      height: 'calc(100% - 2rem)',
                    }}
                  />
                )}

                {/* Step Number Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow pt-1">
                  <div className="mb-1 flex flex-wrap items-center gap-3">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                    >
                      {step.icon && STEP_ICONS[step.icon] ? (
                        <span className="mr-2">{STEP_ICONS[step.icon]}</span>
                      ) : null}
                      {t(step.title, step.titleEn)}
                    </h3>
                    {step.duration && (
                      <span
                        className="inline-flex rounded-full px-3 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--primary)',
                          opacity: 0.9,
                        }}
                      >
                        {step.duration}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {t(step.description, step.descriptionEn)}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {totalTime && (
          <AnimateOnScroll>
            <div
              className="mx-auto mt-12 max-w-md rounded-xl p-6 text-center"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
              }}
            >
              <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                {t(totalTime, totalTimeEn)}
              </p>
            </div>
          </AnimateOnScroll>
        )}
      </Container>
    </section>
  )
}
