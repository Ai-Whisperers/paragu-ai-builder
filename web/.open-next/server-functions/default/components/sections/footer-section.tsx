import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import type { Locale } from '@/lib/i18n/config'
import { cn } from '@/lib/utils'

export interface FooterSectionProps {
  businessName: string
  phone?: string
  email?: string
  address?: string
  city: string
  instagram?: string
  facebook?: string
  whatsapp?: string
  navLinks?: Array<{ label: string; href: string }>
  __siteSlug?: string
  __locale?: Locale
}

const NEXA_GROUP: Array<{
  slug: string
  label: string
  defaultLocale: Locale
  locales: Locale[]
}> = [
  { slug: 'nexa-paraguay', label: 'Nexa Paraguay', defaultLocale: 'nl', locales: ['nl', 'en', 'de', 'es'] },
  { slug: 'nexa-propiedades', label: 'Nexa Propiedades', defaultLocale: 'es', locales: ['es', 'en', 'pt'] },
]

const VERSION = process.env.NEXT_PUBLIC_SITE_VERSION || 'dev'

const NETWORK_LABEL: Record<string, string> = {
  nl: 'Nexa-netwerk',
  en: 'Nexa network',
  de: 'Nexa-Netzwerk',
  es: 'Red Nexa',
  pt: 'Rede Nexa',
}

const FOOTER_LABELS: Record<string, { links: string; contact: string; social: string; rights: string }> = {
  de: { links: 'Links', contact: 'Kontakt', social: 'Social Media', rights: 'Alle Rechte vorbehalten.' },
  en: { links: 'Links', contact: 'Contact', social: 'Social', rights: 'All rights reserved.' },
  es: { links: 'Enlaces', contact: 'Contacto', social: 'Redes', rights: 'Todos los derechos reservados.' },
  nl: { links: 'Links', contact: 'Contact', social: 'Social', rights: 'Alle rechten voorbehouden.' },
  pt: { links: 'Links', contact: 'Contato', social: 'Social', rights: 'Todos os direitos reservados.' },
}

/**
 * Enhanced Footer section with improved aesthetics.
 * 
 * Improvements:
 * - Better visual hierarchy
 * - Improved spacing and typography
 * - Enhanced link hover states
 * - Better social link styling
 * - Cleaner network section
 */
export function FooterSection({
  businessName,
  phone,
  email,
  address,
  city,
  instagram,
  facebook,
  whatsapp,
  navLinks = [],
  __siteSlug,
  __locale,
}: FooterSectionProps) {
  const year = new Date().getFullYear()
  const isNexa = __siteSlug?.startsWith('nexa-') || __siteSlug === 'nexaparaguay'
  const networkHeading = (__locale && NETWORK_LABEL[__locale]) || NETWORK_LABEL.en
  const labels = (__locale && FOOTER_LABELS[__locale]) || FOOTER_LABELS.en
  const showVersion = process.env.NEXT_PUBLIC_SHOW_VERSION !== 'false'

  return (
    <footer 
      className="py-16 sm:py-20"
      style={{ 
        backgroundColor: 'var(--primary)',
        color: 'rgba(255,255,255,0.9)',
      }}
    >
      <Container>
        <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* About / Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Heading level={3}
              className="mb-4 text-xl font-bold"
              style={{ 
                fontFamily: 'var(--font-heading)',
                color: '#ffffff',
              }}
            >
              {businessName}
            </Heading>
            <p className="text-sm leading-relaxed opacity-80">
              {address && <span className="block">{address}</span>}
              <span>{city}</span>
            </p>
          </div>

          {/* Quick Links */}
          {navLinks.length > 0 && (
            <div>
              <h4 
                className="mb-5 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {labels.links}
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 
              className="mb-5 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {labels.contact}
            </h4>
            <ul className="space-y-3 text-sm">
              {phone && (
                <li>
                  <a 
                    href={`tel:${phone}`} 
                    className="transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a 
                    href={`mailto:${email}`} 
                    className="transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          {(instagram || facebook || whatsapp) && (
            <div>
              <h4 
                className="mb-5 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {labels.social}
              </h4>
              <div className="flex flex-wrap gap-3">
                {instagram && (
                  <a
                    href={`https://instagram.com/${instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {facebook && (
                  <a
                    href={`https://facebook.com/${facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                    }}
                    aria-label="WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Nexa Network */}
        {isNexa && (
          <div 
            className="mt-12 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <h4 
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {networkHeading}
            </h4>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {NEXA_GROUP.filter((g) => g.slug !== __siteSlug).map((g) => {
                const loc = __locale && g.locales.includes(__locale) ? __locale : g.defaultLocale
                const href = `/s/${loc}/${g.slug}`
                return (
                  <li key={g.slug}>
                    <a 
                      href={href} 
                      className="transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {g.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Copyright */}
        <div 
          className="mt-12 pt-8 text-center text-sm"
          style={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          © {year} {businessName}. {labels.rights}
          {showVersion && (
            <span 
              className="ml-2 inline-block rounded px-1.5 py-0.5 text-xs font-mono"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                color: 'rgba(255,255,255,0.7)' 
              }}
            >
              v{VERSION}
            </span>
          )}
        </div>
      </Container>
    </footer>
  )
}

export default FooterSection
