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
    unavailableTitle: 'Termin per WhatsApp vereinbaren',
    unavailableBody: 'Schnellste Antwort. Normalerweise innerhalb weniger Stunden an Werktagen. E-Mail-Kontakt ebenfalls möglich.',
    whatsappCta: 'Über WhatsApp schreiben',
    emailCta: 'E-Mail senden',
  },
  en: {
    unavailableTitle: 'Book your consultation on WhatsApp',
    unavailableBody: 'Fastest response — usually within a few hours on business days. Email works too.',
    whatsappCta: 'Message on WhatsApp',
    emailCta: 'Send email',
  },
  es: {
    unavailableTitle: 'Reservá tu consulta por WhatsApp',
    unavailableBody: 'Respuesta más rápida — normalmente en pocas horas en días hábiles. También podés escribir por email.',
    whatsappCta: 'Escribir por WhatsApp',
    emailCta: 'Enviar email',
  },
  nl: {
    unavailableTitle: 'Plan je gesprek via WhatsApp',
    unavailableBody: 'Snelste reactie — meestal binnen een paar uur op werkdagen. E-mail kan ook.',
    whatsappCta: 'Bericht via WhatsApp',
    emailCta: 'E-mail sturen',
  },
  pt: {
    unavailableTitle: 'Agende sua consulta pelo WhatsApp',
    unavailableBody: 'Resposta mais rápida — normalmente em poucas horas em dias úteis. Email também funciona.',
    whatsappCta: 'Mensagem no WhatsApp',
    emailCta: 'Enviar email',
  },
}

/**
 * Treat a booking URL as "not yet configured" when it's missing or still
 * pointing at the documented placeholder account. Calendly renders a 404
 * page inside the iframe for non-existent accounts, leaving a huge blank
 * white block — the fallback UI is a better experience.
 *
 * cal.com is treated as live when present — a tenant switching from
 * Calendly to cal.com only needs to change bookingUrl in site.json.
 * No code changes required.
 */
function isPlaceholderUrl(url: string | undefined): boolean {
  if (!url || url.trim() === '' || url === '#') return true
  const placeholders = [
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
    <section id="agendar" className="bg-background py-16 sm:py-20">
      <Container size="md">
        {(title || subtitle) && (
          <AnimatedSectionHeader>
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
            )}
          </AnimatedSectionHeader>
        )}

        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          {unavailable ? (
            <div className="p-10 text-center">
              <Heading level={3} className="mb-3 text-xl font-semibold text-primary">
                {L.unavailableTitle}
              </Heading>
              <p className="mx-auto mb-6 max-w-md text-muted-foreground">{L.unavailableBody}</p>
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
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-light"
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
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-[var(--secondary-foreground)] shadow-button transition-transform hover:-translate-y-0.5"
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
