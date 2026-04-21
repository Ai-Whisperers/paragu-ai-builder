import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Container } from '@/components/ui/container'
import { GradientBackground } from '@/components/ui/gradient'
import { DecorativeBlob } from '@/components/ui/decorative'
import { FloatingElement } from '@/components/ui/animated'
import { GlassCard } from '@/components/ui/glass'
import { cn } from '@/lib/utils'

export interface HeroSectionProps {
  headline: string
  subheadline: string
  ctaPrimaryText?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  backgroundImage?: string
  enhanced?: boolean
  useGradient?: boolean
  gradientVariant?: 'primary-secondary' | 'secondary-accent' | 'primary-accent' | 'mesh-1' | 'mesh-2'
  floatingHeadline?: boolean
  glassCard?: boolean
  eyebrow?: string
  /** URL locale — used to pick trust-badge labels when `enhanced` is on. */
  __locale?: string
  /** Opt-out of the enhanced trust-badges row (some tenants prefer a clean hero). */
  trustBadgesEnabled?: boolean
}

// The enhanced hero optionally shows three small trust-badges (shield +
// label) below the CTAs. Labels are locale-aware — previously hardcoded
// as German ("Professionell / Transparent / Vertrauenswürdig"), which
// bled into every non-Nexa tenant. Set trustBadgesEnabled=false on a
// hero to drop them entirely.
const TRUST_BADGE_LABELS: Record<string, [string, string, string]> = {
  de: ['Professionell', 'Transparent', 'Vertrauenswürdig'],
  en: ['Professional', 'Transparent', 'Trustworthy'],
  es: ['Profesional', 'Transparente', 'De confianza'],
  nl: ['Professioneel', 'Transparant', 'Betrouwbaar'],
  pt: ['Profissional', 'Transparente', 'Confiável'],
}

export function HeroSection({
  headline,
  subheadline,
  ctaPrimaryText,
  ctaPrimaryHref = '#contacto',
  ctaSecondaryText,
  ctaSecondaryHref = '#servicios',
  backgroundImage,
  enhanced = true,
  useGradient = true,
  gradientVariant = 'primary-secondary',
  floatingHeadline = false,
  glassCard = true,
  eyebrow,
  __locale,
  trustBadgesEnabled = true,
}: HeroSectionProps) {
  const trustBadges = TRUST_BADGE_LABELS[__locale ?? 'es'] ?? TRUST_BADGE_LABELS.es
  const content = (
    <Container className="relative z-10 py-16 sm:py-24 lg:py-32">
      <div className={cn("max-w-4xl mx-auto text-center", enhanced && "hero-content-animate")}>
        {eyebrow && (
          <div className="mb-6 hero-animate-delay-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
              {eyebrow}
            </span>
          </div>
        )}

        {floatingHeadline && enhanced ? (
          <FloatingElement amplitude={8} duration={5}>
            <Heading level={1} className="mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: backgroundImage ? '#ffffff' : (useGradient ? '#ffffff' : 'var(--primary-foreground)') }}>
              {headline}
            </Heading>
          </FloatingElement>
        ) : (
          <Heading level={1} className={cn("mb-6 sm:mb-8 hero-animate-delay-1")}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: backgroundImage ? '#ffffff' : (useGradient ? '#ffffff' : 'var(--primary-foreground)') }}>
            {headline}
          </Heading>
        )}
        
        <p className={cn("mx-auto mb-10 sm:mb-12 max-w-2xl", enhanced && "hero-animate-delay-2")}
          style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: '1.65', fontWeight: '400', color: backgroundImage ? 'rgba(255,255,255,0.95)' : (useGradient ? 'rgba(255,255,255,0.95)' : 'var(--text-light)') }}>
          {subheadline}
        </p>
        
        {(ctaPrimaryText || ctaSecondaryText) && (
          <div className={cn("flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6", enhanced && "hero-animate-delay-3")}>
            {ctaPrimaryText && (
              <Button variant="primary" size="lg" href={ctaPrimaryHref}
                className={cn("w-full sm:w-auto min-h-[56px] px-8 text-base font-semibold tracking-wide", enhanced && "hero-btn-primary hover:scale-[1.02] transition-transform duration-300")}
                style={{ backgroundColor: 'var(--secondary)', color: '#ffffff', boxShadow: '0 8px 24px rgba(184, 134, 11, 0.35)' }}>
                {ctaPrimaryText}
              </Button>
            )}
            {ctaSecondaryText && (
              <Button variant="secondary" size="lg" href={ctaSecondaryHref}
                className={cn("w-full sm:w-auto min-h-[56px] px-8 text-base font-semibold tracking-wide", useGradient && "border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60", enhanced && "hero-btn-secondary transition-all duration-300")}>
                {ctaSecondaryText}
              </Button>
            )}
          </div>
        )}

        {enhanced && trustBadgesEnabled && (
          <div className="mt-12 sm:mt-16 hero-animate-delay-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {trustBadges.map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="var(--secondary)" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  )

  const wrappedContent = glassCard && enhanced ? (
    <GlassCard variant={useGradient ? 'dark' : 'light'} rounded="2xl" className="mx-4 sm:mx-auto max-w-5xl my-8 sm:my-12"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
      {content}
    </GlassCard>
  ) : content

  const backgroundStyle = backgroundImage
    ? { backgroundImage: `linear-gradient(rgba(15, 30, 50, 0.7), rgba(15, 30, 50, 0.8)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  return (
    <section className={cn("relative flex min-h-[80vh] sm:min-h-[85vh] items-center justify-center overflow-hidden pt-20 sm:pt-24", !backgroundImage && !useGradient && "bg-[var(--primary)]")} style={backgroundStyle}>
      {useGradient && !backgroundImage && (
        <GradientBackground variant={gradientVariant} animated={enhanced} className="absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
      {enhanced && (
        <>
          <DecorativeBlob variant="accent" size="xl" animated position="absolute" placement={{ top: '-15%', right: '-10%' }} blur="xl" opacity={0.12} />
          <DecorativeBlob variant="secondary" size="lg" animated position="absolute" placement={{ bottom: '-10%', left: '-5%' }} blur="lg" opacity={0.08} />
          <DecorativeBlob variant="primary" size="md" animated position="absolute" placement={{ top: '40%', left: '5%' }} blur="lg" opacity={0.06} />
        </>
      )}
      {wrappedContent}
    </section>
  )
}
