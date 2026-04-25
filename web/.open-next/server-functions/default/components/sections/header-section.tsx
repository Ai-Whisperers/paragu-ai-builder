'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { LOCALE_LABELS, type Locale } from '@/lib/i18n/config'
import { buildLocaleUrl } from '@/lib/i18n/routing'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { HeaderSearch } from '@/components/commerce/header-search'

export interface NavItem {
  label: string
  href: string
}

export interface HeaderSectionProps {
  businessName?: string
  /** Primary nav items */
  navItems?: NavItem[]
  /** Legacy alias — some content files ship `items` instead of `navItems`. */
  items?: NavItem[]
  ctaText?: string
  ctaHref?: string
  /**
   * Show the commerce header-search box (with autocomplete + recent
   * searches) between the logo and the nav. Opt-in per tenant via content
   * file — defaults to false so non-commerce tenants don't get a dead
   * search bar.
   */
  enableSearch?: boolean
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
  ctaHref = '#contacto',
  enableSearch = false,
  __siteSlug,
  __locale,
  __availableLocales,
  __currentPath = '',
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
      } else if (delta > 6) {
        setHidden(true)
        setMobileOpen(false)
      } else if (delta < -6) {
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
        ? 'ml-3 hidden items-center gap-1 border-l border-[var(--surface-light)] pl-4 md:flex'
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
              title={LOCALE_LABELS[loc]}
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all duration-200',
                active
                  ? 'bg-[var(--secondary)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-light)]'
              )}
            >
              {loc}
            </a>
          )
        })}
      </nav>
    )
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-300 will-change-transform bg-[var(--surface)]',
        scrolled ? 'shadow-md' : 'shadow-sm',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Container>
        <div className="flex h-[70px] sm:h-20 items-center justify-between">
          {/* Logo / Name */}
          <a
            href="#"
            className="whitespace-nowrap text-lg sm:text-xl font-bold transition-colors hover:opacity-80"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--primary)',
            }}
          >
            {businessName}
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
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[var(--surface-light)]"
                style={{ color: 'var(--text)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text)'
                }}
              >
                {item.label}
              </a>
            ))}
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
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-light)] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
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
          className={cn(
            'overflow-hidden transition-all duration-300 md:hidden',
            mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <nav className="border-t border-[var(--surface-light)] py-4">
            {enableSearch && __siteSlug ? (
              <div className="mb-3 px-1">
                <HeaderSearch siteSlug={__siteSlug} locale={__locale ?? 'es'} />
              </div>
            ) : null}
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-3 rounded-lg text-base font-medium transition-colors hover:bg-[var(--surface-light)]"
                style={{ color: 'var(--text)' }}
              >
                {item.label}
              </a>
            ))}
            {ctaText && (
              <Button 
                variant="primary" 
                size="lg" 
                href={ctaHref} 
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
