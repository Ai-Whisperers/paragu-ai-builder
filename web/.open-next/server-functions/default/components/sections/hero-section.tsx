import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export interface HeroSectionProps {
  headline: string
  subheadline: string
  ctaPrimaryText: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  backgroundImage?: string
}

export function HeroSection({
  headline,
  subheadline,
  ctaPrimaryText,
  ctaPrimaryHref = '#contacto',
  ctaSecondaryText,
  ctaSecondaryHref = '#servicios',
  backgroundImage,
}: HeroSectionProps) {
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
          {headline}
        </h1>
        <p
          className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl"
          style={{
            fontFamily: 'var(--font-body)',
            color: backgroundImage ? 'rgba(255,255,255,0.9)' : 'var(--text-light)',
          }}
        >
          {subheadline}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg" href={ctaPrimaryHref}>
            {ctaPrimaryText}
          </Button>
          {ctaSecondaryText && (
            <Button variant="secondary" size="lg" href={ctaSecondaryHref}>
              {ctaSecondaryText}
            </Button>
          )}
        </div>
      </Container>
    </section>
  )
}
