import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { cn } from '@/lib/utils'

export interface ContactSectionProps {
  title: string
  subtitle?: string
  address?: string
  neighborhood?: string
  city: string
  phone?: string
  email?: string
  whatsapp?: string
  whatsappMessage?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
  __locale?: string
}

const CONTACT_LABELS: Record<string, {
  address: string
  contact: string
  whatsappCta: string
  email: string
  hours: string
  mapAlt: (city: string) => string
}> = {
  en: {
    address: 'Address',
    contact: 'Contact',
    whatsappCta: 'Message on WhatsApp',
    email: 'Email',
    hours: 'Business hours',
    mapAlt: (city) => `Map of ${city}`,
  },
  es: {
    address: 'Dirección',
    contact: 'Contacto',
    whatsappCta: 'Escribir por WhatsApp',
    email: 'Email',
    hours: 'Horario de atención',
    mapAlt: (city) => `Mapa de ${city}`,
  },
}

/**
 * Enhanced Contact section with improved layout and UX.
 *
 * Improvements:
 * - Better visual hierarchy with cards
 * - Improved spacing and typography
 * - Enhanced WhatsApp CTA
 * - Better map container styling
 * - Cleaner info item design
 */
export function ContactSection({
  title,
  subtitle,
  address,
  neighborhood,
  city,
  phone,
  email,
  whatsapp,
  whatsappMessage,
  googleMapsUrl,
  hours,
  __locale = 'es',
}: ContactSectionProps) {
  const labels = CONTACT_LABELS[__locale] ?? CONTACT_LABELS.es
  const hasContactInfo = phone || email || whatsapp
  const hasHours = hours && Object.keys(hours).length > 0
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`
    : ''

  return (
    <section id="contacto" className="bg-[var(--surface)] py-20 sm:py-28 lg:py-32">
      <Container>
        <AnimatedSectionHeader className="mb-12 sm:mb-16">
          <Heading level={2}
            style={{
              fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Heading>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed"
              style={{ color: 'var(--text-light)' }}
            >
              {subtitle}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Contact Info Cards */}
          <AnimateOnScroll>
            <div className="space-y-6">
              {/* Address Card */}
              <div 
                className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(30, 58, 95, 0.08)',
                  }}
                >
                  <MapPin size={22} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <Heading level={3} 
                    className="mb-2 text-base font-bold uppercase tracking-wide"
                    style={{ color: 'var(--text)' }}
                  >
                    {labels.address}
                  </Heading>
                  <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>
                    {address && <span className="block">{address}</span>}
                    {neighborhood && <span>{neighborhood}, </span>}
                    <span className="font-medium" style={{ color: 'var(--text)' }}>{city}</span>
                  </p>
                </div>
              </div>

              {/* Phone/WhatsApp Card */}
              {hasContactInfo && (
                <div 
                  className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(184, 134, 11, 0.12)',
                    }}
                  >
                    <Phone size={22} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <div className="flex-1">
                    <Heading level={3} 
                      className="mb-2 text-base font-bold uppercase tracking-wide"
                      style={{ color: 'var(--text)' }}
                    >
                      {labels.contact}
                    </Heading>
                    {phone && (
                      <a 
                        href={`tel:${phone}`} 
                        className="block mb-2 text-lg font-medium transition-colors hover:underline"
                        style={{ color: 'var(--primary)' }}
                      >
                        {phone}
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          backgroundColor: '#25D366',
                          color: '#ffffff',
                          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                        }}
                      >
                        <MessageCircle size={18} />
                        {labels.whatsappCta}
                        <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Email Card */}
              {email && (
                <div 
                  className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(30, 58, 95, 0.08)',
                    }}
                  >
                    <Mail size={22} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <Heading level={3} 
                      className="mb-2 text-base font-bold uppercase tracking-wide"
                      style={{ color: 'var(--text)' }}
                    >
                      {labels.email}
                    </Heading>
                    <a 
                      href={`mailto:${email}`}
                      className="text-lg font-medium transition-colors hover:underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Hours Card */}
              {hasHours && (
                <div 
                  className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(30, 58, 95, 0.08)',
                    }}
                  >
                    <Clock size={22} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1">
                    <Heading level={3} 
                      className="mb-3 text-base font-bold uppercase tracking-wide"
                      style={{ color: 'var(--text)' }}
                    >
                      {labels.hours}
                    </Heading>
                    <dl className="space-y-2">
                      {Object.entries(hours).map(([day, time]) => (
                        <div key={day} 
                          className="flex justify-between gap-4 text-sm sm:text-base py-1 border-b border-gray-100 last:border-0"
                        >
                          <dt style={{ color: 'var(--text)' }}>{day}</dt>
                          <dd className="font-medium" style={{ color: 'var(--text-light)' }}>{time}</dd>
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
            <div 
              className="h-full min-h-[400px] overflow-hidden rounded-2xl"
              style={{
                backgroundColor: 'var(--surface-light)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {googleMapsUrl ? (
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  className="min-h-[400px] lg:min-h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={labels.mapAlt(city)}
                  style={{ filter: 'grayscale(15%) contrast(105%)' }}
                />
              ) : (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    <MapPin size={32} opacity={0.4} />
                  </div>
                  <p className="text-base">
                    {address ? `${address}, ${city}` : city}
                  </p>
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  )
}

export default ContactSection
