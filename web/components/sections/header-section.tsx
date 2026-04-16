'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
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
    <header className="sticky top-0 z-50 border-b border-[var(--surface-light)] bg-[var(--surface)]/95 shadow-nav backdrop-blur-sm">
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
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-[var(--text-muted)] transition-colors duration-normal hover:text-[var(--secondary)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--secondary)] after:transition-all after:duration-normal hover:after:w-full"
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
            className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--text)] transition-colors hover:bg-[var(--surface-light)] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav — always in DOM, animated via max-height */}
        <nav
          className="overflow-hidden transition-all duration-normal md:hidden"
          style={{
            maxHeight: mobileOpen ? '400px' : '0px',
            opacity: mobileOpen ? 1 : 0,
          }}
        >
          <div className="border-t border-[var(--surface-light)] pb-4 pt-2">
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
          </div>
        </nav>
      </Container>
    </header>
  )
}
