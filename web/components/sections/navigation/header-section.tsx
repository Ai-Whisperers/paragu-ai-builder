'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { LOCALE_LABELS, type Locale } from '@/lib/i18n/config'
import { buildLocaleUrl } from '@/lib/i18n/routing'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronDown } from 'lucide-react'
import { HeaderSearch } from '@/components/commerce/header-search'

export interface NavItem {
  label: string
  href: string
  /**
   * Optional child items. When present, the parent renders as a
   * hover-triggered dropdown on desktop and as a nested list on mobile.
   * The parent's own `href` is kept as a fallback destination (screen
   * reader / no-JS flow).
   */
  children?: Array<{ label: string; href: string }>
}

export interface HeaderSectionProps {
  businessName?: string
  navItems?: NavItem[]
  items?: NavItem[]
  ctaText?: string
  ctaHref?: string
  enableSearch?: boolean
  /** Optional logo image URL — when set, renders an <img> instead of plain text businessName */
  logoUrl?: string
  /** Alt text for logo image */
  logoAlt?: string
  variant?: 'standard' | 'sticky' | 'transparent'
  __siteSlug?: string
  __locale?: Locale
  __availableLocales?: Locale[]
  __currentPath?: string
}

/**
 * Header section with hide-on-scroll-down / reveal-on-scroll-up behavior.
 *
 * Rules:
 *  - Top of page (scrollY < 80): always visible, no shadow.
 *  - Scrolling down past threshold: slides out (translate-y-[-100%]).
 *  - Scrolling up by >6px: slides back in.
 *  - Mobile menu auto-closes on hide so the panel doesn't linger off-screen.
 * Previously used surface/95 + backdrop-blur which made the nav unreadable
 * over hero content — now the header is either fully opaque or fully offscreen.
 */
export function HeaderSection({
  businessName,
  navItems: navItemsProp,
  items,
  ctaText,
  ctaHref,
  enableSearch,
  logoUrl,
  logoAlt,
  variant = 'standard',
  __siteSlug,
  __locale,
  __availableLocales,
  __currentPath,
}: HeaderSectionProps) {
  const navItems = navItemsProp || items || []
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = typeof window !== 'undefined' ? window.scrollY : 0
    let ticking = false

    const update = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY

      setScrolled(currentY > 20)

      if (currentY < 80) {
        setHidden(false)
      } else if (delta > 20) {
        setHidden(true)
        setMobileOpen(false)
      } else if (delta < -20) {
        setHidden(false)
      }

      lastY = currentY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showLocaleSwitch =
    !!__siteSlug && !!__locale && !!__availableLocales && __availableLocales.length > 1

  const renderLocaleSwitch = (variant: 'desktop' | 'mobile') => {
    if (!showLocaleSwitch) return null
    const wrapperClass =
      variant === 'desktop'
        ? 'ml-3 hidden items-center gap-1 border-l border-surface-light pl-4 md:flex'
        : 'mt-4 flex items-center gap-2 border-t border-white/10 pt-4'
    return (
      <nav aria-label="Language" className={wrapperClass}>
        {__availableLocales!.map((loc) => {
          const href = buildLocaleUrl(loc, __siteSlug!, __currentPath)
          const active = loc === __locale
          return (
            <a
              key={loc}
              href={href}
              hrefLang={loc}
              aria-current={active ? 'true' : undefined}
              aria-label={`${LOCALE_LABELS[loc]}${active ? ' (current)' : ''}`}
              title={LOCALE_LABELS[loc]}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all duration-200',
                active
                  ? 'bg-secondary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-light'
              )}
            >
              <span aria-hidden="true">{loc}</span>
              <span className="sr-only">{LOCALE_LABELS[loc]}</span>
            </a>
          )
        })}
      </nav>
    )
  }

  return (
    <header
      className={cn(
        'font-heading fixed top-0 left-0 right-0 z-50 transition-transform duration-300 will-change-transform',
        variant === 'transparent' && !scrolled ? 'bg-transparent backdrop-blur-sm' : 'bg-surface',
        scrolled ? 'shadow-md bg-surface' : variant === 'transparent' ? 'shadow-none' : 'shadow-sm',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Container>
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo / Name */}
          <a
            href="#"
            className="flex items-center whitespace-nowrap text-lg sm:text-xl font-bold transition-colors hover:opacity-80"
            style={{
              fontFamily: logoUrl ? undefined : 'var(--font-heading)',
              color: 'var(--primary)',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logoAlt || businessName || ''}
                className="h-10 w-auto object-contain"
              />
            ) : (
              businessName
            )}
          </a>

          {/* Desktop search (opt-in via content). Hidden on mobile where the
              nav's hamburger is the entry point. */}
          {enableSearch && __siteSlug ? (
            <div className="mx-4 hidden max-w-sm flex-1 md:block">
              <HeaderSearch siteSlug={__siteSlug} locale={__locale ?? 'es'} />
            </div>
          ) : null}

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <div key={item.href} className="group relative">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-surface-light"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </button>
                  <div
                    className="invisible absolute left-0 top-full min-w-[200px] translate-y-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ zIndex: 60 }}
                  >
                    <div
                      className="mt-1 rounded-lg py-2 shadow-lg"
                      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm transition-colors hover:bg-surface-light"
                          style={{ color: 'var(--text)' }}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-surface-light"
                  style={{ color: 'var(--text)' }}
                  aria-current={__currentPath && item.href === __currentPath ? 'page' : undefined}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--secondary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text)'
                  }}
                >
                  {item.label}
                </a>
              ),
            )}
            {ctaText && (
              <Button 
                variant="primary" 
                size="sm" 
                href={ctaHref}
                className="ml-3 min-h-[40px] px-5"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: '#ffffff',
                }}
              >
                {ctaText}
              </Button>
            )}
            {renderLocaleSwitch('desktop')}
          </nav>

          {/* Mobile toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-surface-light md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? (
              <X size={24} style={{ color: 'var(--text)' }} />
            ) : (
              <Menu size={24} style={{ color: 'var(--text)' }} />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <div 
          id="mobile-nav"
          className={cn(
            'overflow-hidden transition-all duration-300 md:hidden',
            mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <nav className="border-t border-surface-light py-4">
            {enableSearch && __siteSlug ? (
              <div className="mb-3 px-1">
                <HeaderSearch siteSlug={__siteSlug} locale={__locale ?? 'es'} />
              </div>
            ) : null}
            {navItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <div key={item.href} className="mb-1">
                  <div
                    className="px-2 py-2 text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-base font-medium transition-colors hover:bg-surface-light"
                      style={{ color: 'var(--text)' }}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-3 rounded-lg text-base font-medium transition-colors hover:bg-surface-light"
                  style={{ color: 'var(--text)' }}
                >
                  {item.label}
                </a>
              ),
            )}
            {ctaText && (
              <Button 
                variant="primary" 
                size="lg" 
                href={ctaHref} 
                onClick={() => setMobileOpen(false)}
                className="mt-4 w-full min-h-[48px]"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: '#ffffff',
                }}
              >
                {ctaText}
              </Button>
            )}
            {renderLocaleSwitch('mobile')}
          </nav>
        </div>
      </Container>
    </header>
  )
}

export default HeaderSection
