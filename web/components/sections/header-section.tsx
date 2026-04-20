'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { LOCALE_LABELS, type Locale } from '@/lib/i18n/config'
import { buildLocaleUrl } from '@/lib/i18n/routing'

export interface NavItem {
  label: string
  href: string
}

export interface HeaderSectionProps {
  businessName: string
  navItems: NavItem[]
  ctaText?: string
  ctaHref?: string
  __siteSlug?: string
  __locale?: Locale
  __availableLocales?: Locale[]
  __currentPath?: string
}

export function HeaderSection({
  businessName,
  navItems,
  ctaText,
  ctaHref = '#contacto',
  __siteSlug,
  __locale,
  __availableLocales,
  __currentPath = '',
}: HeaderSectionProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const showLocaleSwitch =
    !!__siteSlug && !!__locale && !!__availableLocales && __availableLocales.length > 1

  const renderLocaleSwitch = (variant: 'desktop' | 'mobile') => {
    if (!showLocaleSwitch) return null
    const wrapperClass =
      variant === 'desktop'
        ? 'ml-2 hidden items-center gap-2 border-l border-[var(--surface-light)] pl-4 md:flex'
        : 'mt-3 flex items-center gap-3 border-t border-[var(--surface-light)] pt-3'
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
              className={
                active
                  ? 'text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]'
                  : 'text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--text)]'
              }
            >
              {loc}
            </a>
          )
        })}
      </nav>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] shadow-nav">
      <Container>
        <div className="flex h-[70px] items-center justify-between sm:h-20">
          {/* Logo / Name */}
          <a
            href="#"
            className="text-xl font-bold text-[var(--text)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {businessName}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--secondary)]"
              >
                {item.label}
              </a>
            ))}
            {ctaText && (
              <Button variant="primary" size="sm" href={ctaHref}>
                {ctaText}
              </Button>
            )}
            {renderLocaleSwitch('desktop')}
          </nav>

          {/* Mobile toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="text-2xl text-[var(--text)]">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="border-t border-[var(--surface-light)] pb-4 md:hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--secondary)]"
              >
                {item.label}
              </a>
            ))}
            {ctaText && (
              <Button variant="primary" size="sm" href={ctaHref} className="mt-2 w-full">
                {ctaText}
              </Button>
            )}
            {renderLocaleSwitch('mobile')}
          </nav>
        )}
      </Container>
    </header>
  )
}
