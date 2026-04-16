'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useLocale } from '@/lib/i18n/language-context'

export interface HeroSectionProps {
  headline: string
  headlineEn?: string
  headlineNl?: string
  headlineDe?: string
  subheadline: string
  subheadlineEn?: string
  subheadlineNl?: string
  subheadlineDe?: string
  ctaPrimaryText: string
  ctaPrimaryTextEn?: string
  ctaPrimaryTextNl?: string
  ctaPrimaryTextDe?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryTextEn?: string
  ctaSecondaryTextNl?: string
  ctaSecondaryTextDe?: string
  ctaSecondaryHref?: string
  backgroundImage?: string
}

export function HeroSection({
  headline,
  headlineEn,
  headlineNl,
  headlineDe,
  subheadline,
  subheadlineEn,
  subheadlineNl,
  subheadlineDe,
  ctaPrimaryText,
  ctaPrimaryTextEn,
  ctaPrimaryTextNl,
  ctaPrimaryTextDe,
  ctaPrimaryHref = '#contacto',
  ctaSecondaryText,
  ctaSecondaryTextEn,
  ctaSecondaryTextNl,
  ctaSecondaryTextDe,
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
          {t(headline, headlineEn, headlineNl, headlineDe)}
        </h1>
        <p
          className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl"
          style={{
            fontFamily: 'var(--font-body)',
            color: backgroundImage ? 'rgba(255,255,255,0.9)' : 'var(--text-light)',
          }}
        >
          {t(subheadline, subheadlineEn, subheadlineNl, subheadlineDe)}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg" href={ctaPrimaryHref}>
            {t(ctaPrimaryText, ctaPrimaryTextEn, ctaPrimaryTextNl, ctaPrimaryTextDe)}
          </Button>
          {ctaSecondaryText && (
            <Button variant="secondary" size="lg" href={ctaSecondaryHref}>
              {t(ctaSecondaryText, ctaSecondaryTextEn, ctaSecondaryTextNl, ctaSecondaryTextDe)}
            </Button>
          )}
        </div>
      </Container>
    </section>
  )
}
