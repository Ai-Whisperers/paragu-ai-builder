'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { useLocale } from '@/lib/i18n/language-context'

export interface CTABannerSectionProps {
  title: string
  titleEn?: string
  subtitle?: string
  buttonText: string
  buttonTextEn?: string
  buttonHref?: string
}

export function CTABannerSection({
  title,
  titleEn,
  subtitle,
  buttonText,
  buttonTextEn,
  buttonHref = '#contacto',
}: CTABannerSectionProps) {
  const { t } = useLocale()
  return (
    <section
      className="relative overflow-hidden py-16"
      style={{
        background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
      }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5) 0%, transparent 50%)`,
        }}
      />

      <Container className="relative z-10 text-center">
        <AnimateOnScroll>
          <h2
            className="mb-4 text-3xl font-bold text-[var(--secondary-foreground)] sm:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t(title, titleEn)}
          </h2>
          {subtitle && (
            <p className="mx-auto mb-8 max-w-xl text-lg text-[var(--secondary-foreground)] opacity-80">{subtitle}</p>
          )}
          <Button
            variant="secondary"
            size="lg"
            href={buttonHref}
            className="border-[var(--secondary-foreground)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary-foreground)] hover:text-[var(--secondary)]"
          >
            {t(buttonText, buttonTextEn)}
          </Button>
        </AnimateOnScroll>
      </Container>
    </section>
  )
}
