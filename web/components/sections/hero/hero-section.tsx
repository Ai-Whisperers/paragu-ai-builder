'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Container } from '@/components/ui/container'
import { GradientBackground } from '@/components/ui/gradient'
import { DecorativeBlob } from '@/components/ui/decorative'
import { FloatingElement } from '@/components/ui/animated'
import { GlassCard } from '@/components/ui/glass'
import { cn } from '@/lib/utils'
import { LeadCaptureModal } from '@/components/commerce/lead-capture-modal'

export interface DisclaimerBannerProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  cssClasses?: string
  dismissible: boolean
}

export interface HeroSectionProps {
  headline: string
  subheadline: string
  ctaPrimaryText?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  /** When true, the secondary CTA opens a lead capture modal instead of navigating. Works only for the Alejandro site. */
  secondaryCtaModal?: boolean
  backgroundImage?: string
  /** Variant controls layout: 'image' (full-bg with glass card), 'split' (text left / image right), 'minimal' (text only). */
  variant?: 'image' | 'split' | 'minimal'
  disclaimerBanner?: DisclaimerBannerProps
  backgroundImageMobile?: string
  enhanced?: boolean
  useGradient?: boolean
  gradientVariant?: 'primary-secondary' | 'secondary-accent' | 'primary-accent' | 'mesh-1' | 'mesh-2'
  floatingHeadline?: boolean
  glassCard?: boolean
  eyebrow?: string
  __locale?: string
  trustBadgesEnabled?: boolean
  trustBadges?: string[]
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
  backgroundImageMobile,
  variant = 'image',
  enhanced = true,
  useGradient = true,
  gradientVariant = 'primary-secondary',
  floatingHeadline = false,
  glassCard = true,
  eyebrow,
  __locale,
  trustBadgesEnabled = true,
  trustBadges: trustBadgesProp,
  secondaryCtaModal,
  disclaimerBanner,
}: HeroSectionProps) {
  const [isBannerDismissed, setIsBannerDismissed] = useState(false)
  const [leadModalOpen, setLeadModalOpen] = useState(false)

  useEffect(() => {
    if (disclaimerBanner?.dismissible) {
      const dismissed = localStorage.getItem('stoicfinch-disclaimer-dismissed')
      if (dismissed === 'true') {
        setIsBannerDismissed(true)
      }
    }
  }, [disclaimerBanner?.dismissible])

  const handleDismissBanner = () => {
    localStorage.setItem('stoicfinch-disclaimer-dismissed', 'true')
    setIsBannerDismissed(true)
  }

  const trustBadges =
    Array.isArray(trustBadgesProp) && trustBadgesProp.length === 3
      ? (trustBadgesProp as [string, string, string])
      : TRUST_BADGE_LABELS[__locale ?? 'es'] ?? TRUST_BADGE_LABELS.es

  const content = (
    <Container className="font-heading relative z-10 py-16 sm:py-24 lg:py-32">
      <div className={cn("max-w-4xl mx-auto text-center", enhanced && "hero-content-animate")}>
        {disclaimerBanner && !isBannerDismissed && (
          <div className={cn(disclaimerBanner.cssClasses || "bg-amber-100 border-l-2 border-amber-500 p-4 text-center", "mb-6 rounded-r-md")}>
            <div className="font-heading flex items-start justify-between gap-4">
              <div className="font-heading flex-1 text-left">
                <h3 className="font-heading font-semibold text-amber-900 mb-1">{disclaimerBanner.title}</h3>
                <p className="font-heading text-sm text-amber-800 mb-3">{disclaimerBanner.description}</p>
                {disclaimerBanner.buttonText && (
                  <Button
                    variant="primary"
                    size="sm"
                    href={disclaimerBanner.buttonLink}
                    className="font-heading inline-flex items-center gap-2"
                    style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                  >
                    {disclaimerBanner.buttonText}
                  </Button>
                )}
              </div>
              {disclaimerBanner.dismissible && (
                <button
                  onClick={handleDismissBanner}
                  className="font-heading text-amber-600 hover:text-amber-900 transition-colors p-1 -mt-1 -mr-1"
                  aria-label="Dismiss disclaimer"
                >
                  <svg className="font-heading w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        {eyebrow && (
          <div className="font-heading mb-6 hero-animate-delay-0">
            <span className="font-heading inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
              {eyebrow}
            </span>
          </div>
        )}

        {floatingHeadline && enhanced ? (
          <FloatingElement amplitude={8} duration={5}>
            <Heading level={1} className="font-heading mb-6 sm:mb-8"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: backgroundImage ? '#ffffff' : (useGradient ? '#ffffff' : 'var(--primary-foreground)') }}>
              {headline}
            </Heading>
          </FloatingElement>
        ) : (
          <Heading level={1} className={cn("mb-4 sm:mb-6 hero-animate-delay-1")}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: backgroundImage ? '#ffffff' : (useGradient ? '#ffffff' : 'var(--primary-foreground)') }}>
            {headline}
          </Heading>
        )}
        
        <p className={cn("mx-auto mb-8 sm:mb-10 max-w-2xl", enhanced && "hero-animate-delay-2")}
          style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: '1.65', fontWeight: '400', color: backgroundImage ? 'rgba(255,255,255,0.95)' : (useGradient ? 'rgba(255,255,255,0.95)' : 'var(--text-light)') }}>
          {subheadline}
        </p>
        
        {(ctaPrimaryText || ctaSecondaryText) && (
          <div className={cn("flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6", enhanced && "hero-animate-delay-3")}>
            {ctaPrimaryText && (
              <Button variant="primary" size="lg" href={ctaPrimaryHref}
                className={cn("w-full sm:w-auto min-h-[60px] px-10 text-base font-semibold tracking-wide", enhanced && "hero-btn-primary hover:scale-[1.02] transition-transform duration-300")}
                style={{ backgroundColor: 'var(--secondary)', color: '#ffffff', boxShadow: '0 8px 24px rgba(184, 134, 11, 0.35)' }}>
                {ctaPrimaryText}
              </Button>
            )}
            {ctaSecondaryText && secondaryCtaModal ? (
              <Button variant="secondary" size="lg" onClick={() => setLeadModalOpen(true)}
                className={cn("w-full sm:w-auto min-h-[60px] px-10 text-base font-semibold tracking-wide", useGradient && "border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60", enhanced && "hero-btn-secondary transition-all duration-300")}>
                {ctaSecondaryText}
              </Button>
            ) : ctaSecondaryText && (
              <Button variant="secondary" size="lg" href={ctaSecondaryHref}
                className={cn("w-full sm:w-auto min-h-[60px] px-10 text-base font-semibold tracking-wide", useGradient && "border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60", enhanced && "hero-btn-secondary transition-all duration-300")}>
                {ctaSecondaryText}
              </Button>
            )}
          </div>
        )}

        {enhanced && trustBadgesEnabled && (
          <div className="font-heading mt-12 sm:mt-16 hero-animate-delay-4">
            <div className="font-heading flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {trustBadges.map((label) => (
                <div key={label} className="font-heading flex items-center gap-2">
                  <svg className="font-heading w-5 h-5" fill="var(--secondary)" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
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
    <GlassCard variant={useGradient ? 'dark' : 'light'} rounded="2xl" className="font-heading mx-4 sm:mx-auto max-w-5xl my-8 sm:my-12"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
      {content}
    </GlassCard>
  ) : content

  // When both desktop and mobile variants are set, we stop using CSS
  // background-image on the section root and render a real <picture> so
  // the browser can pick the best source. The dark overlay still lives on
  // an absolute layer above the picture.
  const useResponsivePicture = Boolean(backgroundImage && backgroundImageMobile)
  const backgroundStyle = backgroundImage && !useResponsivePicture
    ? { backgroundImage: `linear-gradient(rgba(15, 30, 50, 0.7), rgba(15, 30, 50, 0.8)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  // Split layout: text on dark left half, image on right half
  if (variant === 'split' && backgroundImage) {
    return (
      <section className="relative flex min-h-[70vh] flex-col overflow-hidden lg:flex-row">
        {/* Left: text content on primary background */}
        <div className="flex flex-1 items-center bg-primary px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
          <div className="mx-auto w-full max-w-xl">
            <Container className="px-0">
              {eyebrow && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90">
                    {eyebrow}
                  </span>
                </div>
              )}
              <Heading level={1}
                style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: '#ffffff' }}>
                {headline}
              </Heading>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                {subheadline}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                {ctaPrimaryText && (
                  <Button variant="primary" size="lg" href={ctaPrimaryHref}
                    className="w-full sm:w-auto min-h-[56px] px-8 text-base font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.02]">
                    {ctaPrimaryText}
                  </Button>
                )}
                {ctaSecondaryText && secondaryCtaModal ? (
                  <Button variant="secondary" size="lg" onClick={() => setLeadModalOpen(true)}
                    className="w-full sm:w-auto min-h-[56px] border-2 border-white/40 px-8 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10">
                    {ctaSecondaryText}
                  </Button>
                ) : ctaSecondaryText && (
                  <Button variant="secondary" size="lg" href={ctaSecondaryHref}
                    className="w-full sm:w-auto min-h-[56px] border-2 border-white/40 px-8 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10">
                    {ctaSecondaryText}
                  </Button>
                )}
              </div>
              {enhanced && trustBadgesEnabled && trustBadges.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-4">
                  {trustBadges.map((label) => (
                    <div key={label} className="flex items-center gap-2 text-sm font-medium text-white/80">
                      <svg className="h-4 w-4" fill="var(--secondary)" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </Container>
          </div>
        </div>
        {/* Right: image */}
        <div className="relative flex-1 bg-surface-light">
          <picture className="absolute inset-0 h-full w-full">
            {backgroundImageMobile && (
              <source media="(max-width: 640px)" srcSet={backgroundImageMobile} />
            )}
            <img src={backgroundImage} alt="" className="h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
          </picture>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("relative flex min-h-[60vh] sm:min-h-[70vh] items-center justify-center overflow-hidden pt-16 sm:pt-20", !backgroundImage && !useGradient && "bg-primary")} style={backgroundStyle}>
      {useResponsivePicture && backgroundImage && (
        <picture aria-hidden="true" className="font-heading pointer-events-none absolute inset-0 h-full w-full">
          {backgroundImageMobile && (
            <source media="(max-width: 640px)" srcSet={backgroundImageMobile} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="font-heading h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      )}
      {useResponsivePicture && (
        <div className="font-heading absolute inset-0 bg-gradient-to-b from-[rgba(15,30,50,0.7)] to-[rgba(15,30,50,0.8)] pointer-events-none" />
      )}
      {useGradient && !backgroundImage && (
        <GradientBackground variant={gradientVariant} animated={enhanced} className="font-heading absolute inset-0" />
      )}
      <div className="font-heading absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
      {enhanced && (
        <>
          <DecorativeBlob variant="accent" size="xl" animated position="absolute" placement={{ top: '-15%', right: '-10%' }} blur="xl" opacity={0.12} />
          <DecorativeBlob variant="secondary" size="lg" animated position="absolute" placement={{ bottom: '-10%', left: '-5%' }} blur="lg" opacity={0.08} />
          <DecorativeBlob variant="primary" size="md" animated position="absolute" placement={{ top: '40%', left: '5%' }} blur="lg" opacity={0.06} />
        </>
      )}
      {wrappedContent}
      {leadModalOpen && (
        <LeadCaptureModal open={leadModalOpen} onOpenChange={setLeadModalOpen} locale={__locale} />
      )}
    </section>
  )
}
