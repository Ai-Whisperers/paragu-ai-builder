import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

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
  /** Active URL locale — picks localized default labels. */
  __locale?: string
}

type ContactLabels = {
  address: string
  phone: string
  whatsapp: string
  hours: string
  whatsappCta: string
  mapFallback: (city: string) => string
}

const CONTACT_LABELS: Record<string, ContactLabels> = {
  de: {
    address: 'Adresse',
    phone: 'Telefon',
    whatsapp: 'WhatsApp',
    hours: 'Öffnungszeiten',
    whatsappCta: 'Auf WhatsApp schreiben',
    mapFallback: (c) => `Karte von ${c}`,
  },
  en: {
    address: 'Address',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    hours: 'Hours',
    whatsappCta: 'Message on WhatsApp',
    mapFallback: (c) => `Map of ${c}`,
  },
  es: {
    address: 'Dirección',
    phone: 'Teléfono',
    whatsapp: 'WhatsApp',
    hours: 'Horarios',
    whatsappCta: 'Escribir por WhatsApp',
    mapFallback: (c) => `Mapa de ${c}`,
  },
  nl: {
    address: 'Adres',
    phone: 'Telefoon',
    whatsapp: 'WhatsApp',
    hours: 'Openingstijden',
    whatsappCta: 'Bericht via WhatsApp',
    mapFallback: (c) => `Kaart van ${c}`,
  },
  pt: {
    address: 'Endereço',
    phone: 'Telefone',
    whatsapp: 'WhatsApp',
    hours: 'Horários',
    whatsappCta: 'Mensagem no WhatsApp',
    mapFallback: (c) => `Mapa de ${c}`,
  },
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
  __locale,
}: ContactSectionProps) {
  const L = CONTACT_LABELS[__locale ?? 'es'] || CONTACT_LABELS.es
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
                  <Heading level={3} className="mb-1 text-lg font-semibold text-[var(--text)]">{L.address}</Heading>
                  <p className="text-[var(--text-muted)]">
                    {address && <span>{address}<br /></span>}
                    {neighborhood && <span>{neighborhood}, </span>}
                    {city}
                  </p>
                </div>
              </div>

              {/* Phone — only rendered when a real phone number exists. */}
              {phone && (
                <div className="flex gap-3">
                  <Phone size={20} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                  <div>
                    <Heading level={3} className="mb-1 text-lg font-semibold text-[var(--text)]">{L.phone}</Heading>
                    <a href={`tel:${phone}`} className="block text-[var(--secondary)] hover:underline">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {/* WhatsApp — distinct block from Phone so the label matches
                  what the user will actually interact with. */}
              {whatsapp && (
                <div className="flex gap-3">
                  <MessageCircle size={20} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                  <div>
                    <Heading level={3} className="mb-1 text-lg font-semibold text-[var(--text)]">{L.whatsapp}</Heading>
                    <Button
                      variant="primary"
                      size="sm"
                      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                      className="mt-1"
                    >
                      {L.whatsappCta}
                    </Button>
                  </div>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="flex gap-3">
                  <Mail size={20} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                  <div>
                    <Heading level={3} className="mb-1 text-lg font-semibold text-[var(--text)]">Email</Heading>
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
                    <Heading level={3} className="mb-2 text-lg font-semibold text-[var(--text)]">{L.hours}</Heading>
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

          {/* Map */}
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
                  title={L.mapFallback(city)}
                />
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
                  <MapPin size={32} className="opacity-40" />
                  <p className="text-sm">{address ? `${address}, ${city}` : city}</p>
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  )
}
