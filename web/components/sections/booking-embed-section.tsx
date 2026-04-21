import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export type BookingEmbedVariant = 'iframe' | 'link'

export interface BookingEmbedSectionProps {
  variant?: BookingEmbedVariant
  title?: string
  subtitle?: string
  bookingUrl?: string
  provider?: string
  ctaLabel?: string
  /** Contact fallback when booking is not yet configured. */
  fallbackWhatsapp?: string
  fallbackEmail?: string
  /** Active URL locale — picks localized default labels. */
  __locale?: string
}

type BookingLabels = {
  unavailableTitle: string
  unavailableBody: string
  whatsappCta: string
  emailCta: string
}

const BOOKING_LABELS: Record<string, BookingLabels> = {
  de: {
    unavailableTitle: 'Online-Buchung demnächst verfügbar',
    unavailableBody: 'Bis dahin erreichen Sie uns direkt über WhatsApp oder E-Mail — wir antworten innerhalb eines Werktages.',
    whatsappCta: 'Über WhatsApp schreiben',
    emailCta: 'E-Mail senden',
  },
  en: {
    unavailableTitle: 'Online booking coming soon',
    unavailableBody: 'Reach us directly via WhatsApp or email in the meantime — we reply within one business day.',
    whatsappCta: 'Message on WhatsApp',
    emailCta: 'Send email',
  },
  es: {
    unavailableTitle: 'Reservas en línea próximamente',
    unavailableBody: 'Mientras tanto, contáctenos directamente por WhatsApp o email — respondemos dentro de un día hábil.',
    whatsappCta: 'Escribir por WhatsApp',
    emailCta: 'Enviar email',
  },
  nl: {
    unavailableTitle: 'Online afspraken binnenkort beschikbaar',
    unavailableBody: 'Neem in de tussentijd rechtstreeks contact op via WhatsApp of e-mail — we reageren binnen één werkdag.',
    whatsappCta: 'Bericht via WhatsApp',
    emailCta: 'E-mail sturen',
  },
  pt: {
    unavailableTitle: 'Agendamento online em breve',
    unavailableBody: 'Entretanto, fale conosco diretamente por WhatsApp ou email — respondemos em até um dia útil.',
    whatsappCta: 'Mensagem no WhatsApp',
    emailCta: 'Enviar email',
  },
}

/**
 * Treat a booking URL as "not yet configured" when it's missing or still
 * pointing at the documented placeholder account. Calendly renders a 404
 * page inside the iframe for non-existent accounts, leaving a huge blank
 * white block — the fallback UI is a better experience.
 */
function isPlaceholderUrl(url: string | undefined): boolean {
  if (!url || url.trim() === '' || url === '#') return true
  const placeholders = [
    'calendly.com/nexaparaguay/consulta', // documented placeholder in LAUNCH.md
    'calendly.com/your-account',
    'example.com',
  ]
  return placeholders.some((p) => url.includes(p))
}

export function BookingEmbedSection({
  variant = 'iframe',
  title,
  subtitle,
  bookingUrl,
  provider = 'calendly',
  ctaLabel = 'Schedule a consultation',
  fallbackWhatsapp,
  fallbackEmail,
  __locale,
}: BookingEmbedSectionProps) {
  const L = BOOKING_LABELS[__locale ?? 'es'] || BOOKING_LABELS.es
  const unavailable = isPlaceholderUrl(bookingUrl)

  return (
    <section id="agendar" className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        {(title || subtitle) && (
          <AnimatedSectionHeader>
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle}</p>
            )}
          </AnimatedSectionHeader>
        )}

        <div className="mt-10 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-card">
          {unavailable ? (
            <div className="p-10 text-center">
              <Heading level={3} className="mb-3 text-xl font-semibold text-[var(--primary)]">
                {L.unavailableTitle}
              </Heading>
              <p className="mx-auto mb-6 max-w-md text-[var(--text-light)]">{L.unavailableBody}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {fallbackWhatsapp && (
                  <a
                    href={`https://wa.me/${fallbackWhatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
                  >
                    {L.whatsappCta}
                  </a>
                )}
                {fallbackEmail && (
                  <a
                    href={`mailto:${fallbackEmail}`}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-light)]"
                  >
                    {L.emailCta}
                  </a>
                )}
              </div>
            </div>
          ) : variant === 'iframe' ? (
            <iframe
              src={bookingUrl}
              width="100%"
              height="720"
              frameBorder="0"
              title={provider}
              loading="lazy"
              className="block min-h-[720px] w-full"
            />
          ) : (
            <div className="p-10 text-center">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--secondary)] px-6 py-3 text-[var(--secondary-foreground)] shadow-button transition-all hover:-translate-y-0.5"
              >
                {ctaLabel}
              </a>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
