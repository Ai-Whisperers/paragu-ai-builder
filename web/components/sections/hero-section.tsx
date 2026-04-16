'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useLocale } from '@/lib/i18n/language-context'

export interface HeroSectionProps {
  headline: string
  headlineEn?: string
  subheadline: string
  subheadlineEn?: string
  ctaPrimaryText: string
  ctaPrimaryTextEn?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryTextEn?: string
  ctaSecondaryHref?: string
  backgroundImage?: string
}

export function HeroSection({
  headline,
  headlineEn,
  subheadline,
  subheadlineEn,
  ctaPrimaryText,
  ctaPrimaryTextEn,
  ctaPrimaryHref = '#contacto',
  ctaSecondaryText,
  ctaSecondaryTextEn,
  ctaSecondaryHref = '#servicios',
  backgroundImage,
}: HeroSectionProps) {
  const { t } = useLocale()
  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[var(--primary)]"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <Container className="relative z-10 py-20 text-center">
        <h1
          className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--heading-weight)',
            color: backgroundImage ? '#ffffff' : 'var(--primary-foreground)',
            textTransform: 'var(--heading-transform)' as React.CSSProperties['textTransform'],
          }}
        >
          {t(headline, headlineEn)}
        </h1>
        <p
          className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl"
          style={{
            fontFamily: 'var(--font-body)',
            color: backgroundImage ? 'rgba(255,255,255,0.9)' : 'var(--text-light)',
          }}
        >
          {t(subheadline, subheadlineEn)}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg" href={ctaPrimaryHref}>
            {t(ctaPrimaryText, ctaPrimaryTextEn)}
          </Button>
          {ctaSecondaryText && (
            <Button variant="secondary" size="lg" href={ctaSecondaryHref}>
              {t(ctaSecondaryText, ctaSecondaryTextEn)}
            </Button>
          )}
        </div>
      </Container>
    </section>
  )
}
