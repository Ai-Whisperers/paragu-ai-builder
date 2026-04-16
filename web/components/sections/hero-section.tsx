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
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%)',
            }
      }
    >
      {/* Decorative pattern overlay (CSS-only, no images) */}
      {!backgroundImage && (
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%),
              radial-gradient(circle at 40% 80%, rgba(255,255,255,0.2) 0%, transparent 60%)
            `,
          }}
        />
      )}

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />

      <Container className="relative z-10 py-20 text-center">
        <h1
          className="hero-animate mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
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
          className="hero-animate-delay-1 mx-auto mb-10 max-w-2xl text-lg sm:text-xl"
          style={{
            fontFamily: 'var(--font-body)',
            color: backgroundImage ? 'rgba(255,255,255,0.9)' : 'var(--primary-foreground)',
            opacity: 0.9,
          }}
        >
          {subheadline}
        </p>
        <div className="hero-animate-delay-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
