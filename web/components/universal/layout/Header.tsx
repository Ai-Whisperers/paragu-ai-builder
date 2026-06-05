/**
 * @component Header
 * @description Responsive navigation header with mobile hamburger menu, desktop nav links, WhatsApp CTA button, account icon, and real-time OpeningBadge.
 * @featureFlags core
 * @requires siteConfig, getSiteConfig, business, waLink, OpeningBadge from @/lib/config and @/components
 * @implementation Sticky positioning with backdrop-blur, dropdown menu with mouse enter/leave timers, feature flag filtering for nav items
 */

"use client"
import { useState, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import { Menu, X, MessageCircle, User } from "lucide-react"
import { business, waLink, getSiteName, getSiteConfig } from "@/lib/config/config"
import { OpeningBadge } from "@/components/ui/opening-badge"

type NavItem = { label: string; href: string; feature?: string }

interface HeaderProps {
  lang?: "es" | "en"
}

export function Header({ lang = "es" }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const siteConfig = useMemo(() => getSiteConfig(lang), [lang])

  const navItems: NavItem[] = useMemo(() => {
    const main = (siteConfig as { navigation?: { main?: NavItem[] } })?.navigation?.main as NavItem[] | undefined
    return main || [
      { label: lang === "en" ? "Home" : "Inicio", href: `/${lang}` },
      { label: lang === "en" ? "Services" : "Servicios", href: `/${lang}/servicios` },
      { label: lang === "en" ? "About Us" : "Nosotros", href: `/${lang}/nosotros` },
      { label: lang === "en" ? "Book Now" : "Reservar", href: `/${lang}/booking` },
      { label: lang === "en" ? "Contact" : "Contacto", href: `/${lang}/contacto` },
    ]
  }, [siteConfig, lang])

  const moreItems: NavItem[] = useMemo(() => {
    const more = (siteConfig as { navigation?: { more?: NavItem[] } })?.navigation?.more as NavItem[] | undefined
    const defaultMore: NavItem[] = [
      { label: lang === "en" ? "Offers" : "Ofertas", href: `/${lang}/ofertas`, feature: "promotions" },
      { label: lang === "en" ? "Blog" : "Blog", href: `/${lang}/blog`, feature: "blog" },
      { label: lang === "en" ? "FAQ" : "FAQ", href: `/${lang}/faq` },
      { label: lang === "en" ? "Gift Cards" : "Tarjetas de Regalo", href: `/${lang}/tarjetas-de-regalo`, feature: "giftCards" },
    ]
    const items = more || defaultMore
    return items.filter((item: NavItem) => {
      const feat = item.feature
      if (!feat) return true
      return (siteConfig as { features?: Record<string, boolean> })?.features?.[feat] !== false
    })
  }, [siteConfig, lang])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setMoreOpen(false), 300)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setMoreOpen(true)
  }, [])

  const bookingLabel = lang === "en" ? "Book Now" : "Reservar"
  const accountLabel = lang === "en" ? "My Account" : "Mi Cuenta"
  const moreLabel = lang === "en" ? "More" : "Más"
  const mobileBookingLabel = lang === "en" ? "Book via WhatsApp" : "Reservar por WhatsApp"

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm relative">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo + Badge */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href={`/${lang}`} className="flex items-center gap-2.5" aria-label="Ir al inicio">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">{(siteConfig.site?.name || "S").charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-primary text-lg leading-none block">{siteConfig.site?.name || getSiteName()}</span>
              <span className="text-xs text-foreground-muted tracking-wider uppercase">{(siteConfig as { tagline?: string })?.tagline || ""}</span>
            </div>
          </Link>
          <div className="hidden md:block">
            <OpeningBadge />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
              {item.label}
            </Link>
          ))}
          {/* Más dropdown */}
          <div className="relative" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
            <button
              aria-haspopup="true"
              aria-expanded={moreOpen}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-1">
              {moreLabel}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {moreOpen && (
              <div
                role="menu"
                aria-label="Más opciones"
                className="absolute right-0 top-full pt-2 z-50"
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}>
                <div className="w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  {moreItems.map(item => (
                    <Link key={item.href} href={item.href}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href={`/${lang}/mi-cuenta`}
            className="p-2 text-foreground-muted hover:text-primary transition-colors" aria-label={accountLabel}>
            <User className="w-5 h-5" />
          </Link>
          <a href={business.instagram} target="_blank" rel="noopener noreferrer"
            className="p-2 text-foreground-muted hover:text-primary transition-colors" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href={waLink(business.whatsappMessage || "")} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-secondary-dark transition-all shadow-sm">
            <MessageCircle className="w-4 h-4" />
            {bookingLabel}
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground" aria-label="Menú">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container-page py-4 space-y-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors">
                {item.label}
              </Link>
            ))}
            {moreItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors flex items-center gap-2">
                {item.label === accountLabel && <User className="w-4 h-4" />}
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 mt-2">
              <Link href={`/${lang}/mi-cuenta`} onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold mb-2">
                <User className="w-5 h-5" />
                {accountLabel}
              </Link>
              <a href={waLink(business.whatsappMessage || "")} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-semibold">
                <MessageCircle className="w-5 h-5" />
                {mobileBookingLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}