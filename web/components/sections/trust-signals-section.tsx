'use client'

import { Container } from '@/components/ui/container'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { Heading } from '@/components/ui/heading'
import { useLocale } from '@/lib/i18n/language-context'

export interface TrustSignalItem {
  text: string
  textEn?: string
  icon?: string
}

export interface TrustSignalsSectionProps {
  title?: string
  items: TrustSignalItem[]
}

export function TrustSignalsSection({ title, items }: TrustSignalsSectionProps) {
  const { t } = useLocale()

  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        {title && (
          <AnimatedSectionHeader>
            <Heading level={2} className="mb-8 text-center" style={{ color: 'var(--primary)' }}>
              {title}
            </Heading>
          </AnimatedSectionHeader>
        )}

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <AnimateOnScroll key={idx} stagger={idx}>
              <div className="flex flex-col items-center gap-3 rounded-xl p-6 text-center transition-shadow duration-300 hover:shadow-md"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
                  {t(item.text, item.textEn)}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}
