import { Container } from '@/components/ui/container'

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
}

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
}: FooterSectionProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--primary)] py-12 text-[var(--primary-foreground)]">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3
              className="mb-4 text-lg font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {businessName}
            </h3>
            <p className="text-sm opacity-80">
              {address && <span>{address}<br /></span>}
              {city}
            </p>
          </div>

          {/* Quick Links */}
          {navLinks.length > 0 && (
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-60">
                Enlaces
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm opacity-80 transition-opacity hover:opacity-100"
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
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-60">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="hover:opacity-100">{phone}</a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="hover:opacity-100">{email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          {(instagram || facebook || whatsapp) && (
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-60">
                Redes Sociales
              </h4>
              <div className="flex gap-4">
                {instagram && (
                  <a
                    href={`https://instagram.com/${instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 transition-opacity hover:opacity-100"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                )}
                {facebook && (
                  <a
                    href={`https://facebook.com/${facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 transition-opacity hover:opacity-100"
                    aria-label="Facebook"
                  >
                    Facebook
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 transition-opacity hover:opacity-100"
                    aria-label="WhatsApp"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm opacity-60">
          {year} {businessName}. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  )
}
