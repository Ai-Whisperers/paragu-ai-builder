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
  ctaPrimaryText: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  backgroundImage?: string
  /** Enable enhanced effects (glassmorphism, floating elements, blobs) */
  enhanced?: boolean
  /** Use gradient background instead of solid color */
  useGradient?: boolean
  /** Gradient variant when useGradient is true */
  gradientVariant?: 'primary-secondary' | 'secondary-accent' | 'primary-accent' | 'mesh-1' | 'mesh-2'
  /** Enable floating headline animation */
  floatingHeadline?: boolean
  /** Add glass card behind content */
  glassCard?: boolean
}

/**
 * Hero section with optional enhanced effects.
 * 
 * @example
 * // Basic hero
 * <HeroSection
 *   headline="Welcome"
 *   subheadline="Description here"
 *   ctaPrimaryText="Get Started"
 * />
 * 
 * @example
 * // Enhanced hero with glassmorphism and floating elements
 * <HeroSection
 *   headline="Welcome"
 *   subheadline="Description here"
 *   ctaPrimaryText="Get Started"
 *   enhanced
 *   useGradient
 *   gradientVariant="primary-secondary"
 *   floatingHeadline
 *   glassCard
 * />
 */
export function HeroSection({
  headline,
  subheadline,
  ctaPrimaryText,
  ctaPrimaryHref = '#contacto',
  ctaSecondaryText,
  ctaSecondaryHref = '#servicios',
  backgroundImage,
  enhanced = false,
  useGradient = false,
  gradientVariant = 'primary-secondary',
  floatingHeadline = false,
  glassCard = false,
}: HeroSectionProps) {
  const content = (
    <Container className="relative z-10 py-20 text-center">
      <div className={cn(
        "transition-all duration-700",
        enhanced && "hero-animate"
      )}>
        {/* Headline with optional floating animation */}
        {floatingHeadline && enhanced ? (
          <FloatingElement amplitude={10} duration={4}>
            <Heading level={1}
              className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--heading-weight)',
                color: backgroundImage ? '#ffffff' : (useGradient ? '#ffffff' : 'var(--primary-foreground)'),
                textTransform: 'var(--heading-transform)' as React.CSSProperties['textTransform'],
              }}
            >
              {headline}
            </Heading>
          </FloatingElement>
        ) : (
          <Heading level={1}
            className={cn(
              "mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl",
              enhanced && "hero-animate-delay-1"
            )}
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--heading-weight)',
              color: backgroundImage ? '#ffffff' : (useGradient ? '#ffffff' : 'var(--primary-foreground)'),
              textTransform: 'var(--heading-transform)' as React.CSSProperties['textTransform'],
            }}
          >
            {headline}
          </Heading>
        )}
        
        {/* Subheadline */}
        <p
          className={cn(
            "mx-auto mb-10 max-w-2xl text-lg sm:text-xl",
            enhanced && "hero-animate-delay-2"
          )}
          style={{
            fontFamily: 'var(--font-body)',
            color: backgroundImage ? 'rgba(255,255,255,0.9)' : (useGradient ? 'rgba(255,255,255,0.9)' : 'var(--text-light)'),
          }}
        >
          {subheadline}
        </p>
        
        {/* CTAs */}
        <div 
          className={cn(
            "flex flex-col items-center justify-center gap-4 sm:flex-row",
            enhanced && "hero-animate-delay-3"
          )}
        >
          <Button 
            variant="primary" 
            size="lg" 
            href={ctaPrimaryHref}
            className={cn(
              enhanced && "hover-lift"
            )}
          >
            {ctaPrimaryText}
          </Button>
          {ctaSecondaryText && (
            <Button 
              variant="secondary" 
              size="lg" 
              href={ctaSecondaryHref}
              className={cn(
                useGradient && "border-white text-white hover:bg-white hover:text-[var(--primary)]",
                enhanced && "hover-lift"
              )}
            >
              {ctaSecondaryText}
            </Button>
          )}
        </div>
      </div>
    </Container>
  )

  // Wrap content in glass card if enabled
  const wrappedContent = glassCard && enhanced ? (
    <GlassCard 
      variant={useGradient ? 'dark' : 'light'} 
      rounded="xl" 
      className="mx-auto max-w-4xl"
    >
      {content}
    </GlassCard>
  ) : content

  // Background image style
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined

  return (
    <section
      className={cn(
        "relative flex min-h-[70vh] items-center justify-center overflow-hidden",
        !backgroundImage && !useGradient && "bg-[var(--primary)]"
      )}
      style={backgroundStyle}
    >
      {/* Gradient background (when enabled) */}
      {useGradient && !backgroundImage && (
        <GradientBackground 
          variant={gradientVariant}
          animated={enhanced}
          className="absolute inset-0"
        />
      )}

      {/* Decorative blobs when enhanced */}
      {enhanced && (
        <>
          <DecorativeBlob
            variant="accent"
            size="xl"
            animated
            position="absolute"
            placement={{ top: '-20%', right: '-10%' }}
            blur="xl"
            opacity={0.15}
          />
          <DecorativeBlob
            variant="secondary"
            size="lg"
            animated
            position="absolute"
            placement={{ bottom: '-10%', left: '-5%' }}
            blur="lg"
            opacity={0.1}
          />
        </>
      )}

      {wrappedContent}
    </section>
  )
}
