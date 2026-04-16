import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { ContactForm } from './contact-form'

export interface ContactSectionProps {
  title: string
  address?: string
  neighborhood?: string
  city: string
  phone?: string
  email?: string
  whatsapp?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
  /** Business slug for contact form submission */
  businessSlug?: string
  /** Business name for success message */
  businessName?: string
}

export function ContactSection({
  title,
  address,
  neighborhood,
  city,
  phone,
  email,
  whatsapp,
  googleMapsUrl,
  hours,
  businessSlug,
  businessName,
}: ContactSectionProps) {
  return (
    <section id="contacto" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
        </AnimatedSectionHeader>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <AnimateOnScroll>
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-3">
                <MapPin size={20} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-[var(--text)]">Direccion</h3>
                  <p className="text-[var(--text-muted)]">
                    {address && <span>{address}<br /></span>}
                    {neighborhood && <span>{neighborhood}, </span>}
                    {city}
                  </p>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              {(phone || whatsapp) && (
                <div className="flex gap-3">
                  <Phone size={20} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[var(--text)]">Telefono</h3>
                    {phone && (
                      <a href={`tel:${phone}`} className="block text-[var(--secondary)] hover:underline">
                        {phone}
                      </a>
                    )}
                    {whatsapp && (
                      <Button
                        variant="primary"
                        size="sm"
                        href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                        className="mt-2"
                      >
                        Escribir por WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="flex gap-3">
                  <Mail size={20} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[var(--text)]">Email</h3>
                    <a href={`mailto:${email}`} className="text-[var(--secondary)] hover:underline">
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Hours */}
              {hours && Object.keys(hours).length > 0 && (
                <div className="flex gap-3">
                  <Clock size={20} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Horarios</h3>
                    <dl className="space-y-1">
                      {Object.entries(hours).map(([day, time]) => (
                        <div key={day} className="flex justify-between gap-4 text-sm">
                          <dt className="text-[var(--text)]">{day}</dt>
                          <dd className="text-[var(--text-muted)]">{time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </AnimateOnScroll>

          {/* Map + Contact Form */}
          <div className="space-y-6">
            <AnimateOnScroll stagger={1}>
              <div className="min-h-[300px] overflow-hidden rounded-lg bg-[var(--surface-light)] shadow-card">
                {googleMapsUrl ? (
                  <iframe
                    src={googleMapsUrl}
                    width="100%"
                    height="100%"
                    className="min-h-[300px] border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${city}`}
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
                    <MapPin size={32} className="opacity-40" />
                    <p className="text-sm">{address ? `${address}, ${city}` : city}</p>
                  </div>
                )}
              </div>
            </AnimateOnScroll>

            {businessSlug && (
              <AnimateOnScroll stagger={2}>
                <ContactForm
                  businessSlug={businessSlug}
                  businessName={businessName || 'este negocio'}
                  whatsapp={whatsapp}
                />
              </AnimateOnScroll>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
