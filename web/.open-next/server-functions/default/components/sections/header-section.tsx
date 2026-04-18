'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export interface NavItem {
  label: string
  href: string
}

export interface HeaderSectionProps {
  businessName: string
  navItems: NavItem[]
  ctaText?: string
  ctaHref?: string
}

export function HeaderSection({
  businessName,
  navItems,
  ctaText,
  ctaHref = '#contacto',
}: HeaderSectionProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

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
          </nav>
        )}
      </Container>
    </header>
  )
}
