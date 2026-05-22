import { MapPin, MessageCircle, Phone, Clock } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { cleanPhone } from '@/lib/format'

export interface ContactStripSectionProps {
  address?: string
  neighborhood?: string
  city?: string
  whatsapp?: string
  whatsappMessage?: string
  phone?: string
  hoursCompact?: string
  labels?: Record<string, { whatsapp: string; call: string; hours: string }>
  __locale?: string
}

const DEFAULT_LABELS: Record<string, { whatsapp: string; call: string; hours: string }> = {
  en: { whatsapp: 'WhatsApp', call: 'Call', hours: 'Hours' },
  es: { whatsapp: 'WhatsApp', call: 'Llamar', hours: 'Horario' },
}

/**
 * Lightweight contact block. Shows a 3-line strip: address · WhatsApp
 * button · hours. Used as a "slim contact affordance" on every info
 * sub-page via `site.chrome`, so users can reach out from anywhere
 * without the page carrying a full 400px map-embedded contact split.
 *
 * The full `ContactSection` (split with map) is reserved for pages
 * where contact IS the page — /contacto and /tiendas — declared
 * explicitly in those page configs to override the chrome default.
 */
export function ContactStripSection({
  address,
  neighborhood,
  city,
  whatsapp,
  whatsappMessage,
  phone,
  hoursCompact,
  __locale = 'es',
  labels: labelsProp,
}: ContactStripSectionProps) {
  const resolvedLabels = labelsProp ?? DEFAULT_LABELS
  const L = resolvedLabels[__locale] ?? resolvedLabels.es
  const waClean = cleanPhone(whatsapp)
  const whatsappHref = waClean
    ? `https://wa.me/${waClean}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`
    : null

  const addressLine = [address, neighborhood, city].filter(Boolean).join(' · ')

  return (
    <section className="py-10 sm:py-12 border-t border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {addressLine && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
              <p className="text-sm sm:text-base" style={{ color: 'var(--text)' }}>{addressLine}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              >
                <MessageCircle size={16} />
                {L.whatsapp}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
              >
                <Phone size={16} />
                {L.call}
              </a>
            )}
            {hoursCompact && (
              <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Clock size={16} />
                <span>{hoursCompact}</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default ContactStripSection
