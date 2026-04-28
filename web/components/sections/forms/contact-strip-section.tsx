import { Section } from '@/components/ui/section'
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
    <Section fullWidth className="py-10 sm:py-12 border-t border-b border-border">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {addressLine && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 flex-shrink-0 text-primary" />
              <p className="text-sm sm:text-base text-foreground">{addressLine}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors bg-[#25D366]"
              >
                <MessageCircle size={16} />
                {L.whatsapp}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors border-border text-primary"
              >
                <Phone size={16} />
                {L.call}
              </a>
            )}
            {hoursCompact && (
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>{hoursCompact}</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default ContactStripSection
