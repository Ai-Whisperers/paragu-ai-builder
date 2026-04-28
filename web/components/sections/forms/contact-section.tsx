import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from 'lucide-react'
import { cleanPhone } from '@/lib/format'
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
  hours?: Record<string, string> | string
  hoursNote?: string
  labels?: Record<string, {
    address: string
    contact: string
    whatsappCta: string
    email: string
    hours: string
    mapAlt: (city: string) => string
    weekdayOrder: string[]
  }>
  __locale?: string
}

const CONTACT_LABELS: Record<string, {
  address: string
  contact: string
  whatsappCta: string
  email: string
  hours: string
  mapAlt: (city: string) => string
  weekdayOrder: string[]
}> = {
  en: {
    address: 'Address',
    contact: 'Contact',
    whatsappCta: 'Message on WhatsApp',
    email: 'Email',
    hours: 'Business hours',
    mapAlt: (city) => `Map of ${city}`,
    weekdayOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  es: {
    address: 'Dirección',
    contact: 'Contacto',
    whatsappCta: 'Escribir por WhatsApp',
    email: 'Email',
    hours: 'Horario de atención',
    mapAlt: (city) => `Mapa de ${city}`,
    weekdayOrder: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  },
}

function orderHours(
  hours: Record<string, string>,
  preferred: string[],
): Array<[string, string]> {
  const entries = Object.entries(hours)
  const normalize = (s: string) => s.toLowerCase()
  const byKey = new Map(entries.map(([k, v]) => [normalize(k), [k, v] as [string, string]]))
  const ordered: Array<[string, string]> = []
  for (const day of preferred) {
    const hit = byKey.get(normalize(day))
    if (hit) {
      ordered.push(hit)
      byKey.delete(normalize(day))
    }
  }
  for (const [, pair] of byKey) ordered.push(pair)
  return ordered
}

const cardBg = { backgroundColor: 'var(--background)', border: '1px solid rgba(0,0,0,0.06)' } as const
const iconBg1 = { backgroundColor: 'rgba(30, 58, 95, 0.08)' } as const
const iconBg2 = { backgroundColor: 'rgba(184, 134, 11, 0.12)' } as const

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
  hoursNote,
  __locale = 'es',
  labels: labelsProp,
}: ContactSectionProps) {
  const resolvedLabels = labelsProp ?? CONTACT_LABELS
  const labels = resolvedLabels[__locale] ?? resolvedLabels.es
  const hasContactInfo = phone || email || whatsapp
  const hoursIsString = typeof hours === 'string'
  const hoursMap = !hoursIsString && hours ? hours : undefined
  const hasHours = hoursIsString
    ? (hours as string).trim().length > 0
    : hoursMap
    ? Object.keys(hoursMap).length > 0
    : false
  const waClean = cleanPhone(whatsapp)
  const whatsappHref = waClean
    ? `https://wa.me/${waClean}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`
    : ''

  return (
    <section id="contacto" className="py-20 sm:py-28 lg:py-32 bg-surface">
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
            <p className="mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className={`grid gap-8 lg:gap-12 ${googleMapsUrl ? 'lg:grid-cols-2' : ''}`}>
          <AnimateOnScroll>
            <div className="space-y-6">
              {/* Address Card */}
              <div
                className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md bg-background"
                style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={iconBg1}
                >
                  <MapPin size={22} className="text-primary" />
                </div>
                <div>
                  <Heading level={3} className="mb-2 text-base font-bold uppercase tracking-wide text-foreground">
                    {labels.address}
                  </Heading>
                  <p className="leading-relaxed text-muted-foreground">
                    {address && <span className="block">{address}</span>}
                    {neighborhood && <span>{neighborhood}, </span>}
                    <span className="font-medium text-foreground">{city}</span>
                  </p>
                </div>
              </div>

              {/* Phone/WhatsApp Card */}
              {hasContactInfo && (
                <div
                  className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md bg-background"
                  style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={iconBg2}
                  >
                    <Phone size={22} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <Heading level={3} className="mb-2 text-base font-bold uppercase tracking-wide text-foreground">
                      {labels.contact}
                    </Heading>
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="block mb-2 text-lg font-medium text-primary transition-colors hover:underline"
                      >
                        {phone}
                      </a>
                    )}
                    {whatsapp && !phone && (
                      <p className="block mb-2 text-lg font-medium text-primary">
                        {whatsapp}
                      </p>
                    )}
                    {whatsapp && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          backgroundColor: '#25D366',
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
                  className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md bg-background"
                  style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={iconBg1}
                  >
                    <Mail size={22} className="text-primary" />
                  </div>
                  <div>
                    <Heading level={3} className="mb-2 text-base font-bold uppercase tracking-wide text-foreground">
                      {labels.email}
                    </Heading>
                    <a
                      href={`mailto:${email}`}
                      className="text-lg font-medium text-primary transition-colors hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Hours Card */}
              {hasHours && (
                <div
                  className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md bg-background"
                  style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={iconBg1}
                  >
                    <Clock size={22} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <Heading level={3} className="mb-3 text-base font-bold uppercase tracking-wide text-foreground">
                      {labels.hours}
                    </Heading>
                    {hoursIsString ? (
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {hours as string}
                      </p>
                    ) : (
                      <dl className="space-y-2">
                        {orderHours(hoursMap as Record<string, string>, labels.weekdayOrder).map(([day, time]) => (
                          <div key={day}
                            className="flex justify-between gap-4 text-sm sm:text-base py-1 border-b border-border last:border-0"
                          >
                            <dt className="text-foreground">{day}</dt>
                            <dd className="font-medium text-muted-foreground">{time}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {hoursNote && (
                      <p className="mt-3 text-xs italic text-muted-foreground">
                        {hoursNote}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </AnimateOnScroll>

          {googleMapsUrl && (
            <AnimateOnScroll stagger={1}>
              <div
                className="h-full min-h-[400px] overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: 'var(--surface-light)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
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
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </Container>
    </section>
  )
}

export default ContactSection
