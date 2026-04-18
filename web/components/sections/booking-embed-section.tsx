import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export type BookingEmbedVariant = 'iframe' | 'link'

export interface BookingEmbedSectionProps {
  variant?: BookingEmbedVariant
  title?: string
  subtitle?: string
  bookingUrl: string
  provider?: string
  ctaLabel?: string
}

export function BookingEmbedSection({
  variant = 'iframe',
  title,
  subtitle,
  bookingUrl,
  provider = 'calendly',
  ctaLabel = 'Schedule a consultation',
}: BookingEmbedSectionProps) {
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
          {variant === 'iframe' ? (
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
