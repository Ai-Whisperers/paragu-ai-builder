import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface GuestbookMessage {
  author: string
  message: string
  date?: string
}

interface GuestbookSectionProps {
  title?: string
  subtitle?: string
  messages?: GuestbookMessage[]
  ctaText?: string
  ctaLink?: string
  variant?: 'wall'
}

export function GuestbookSection({
  title = 'Guestbook',
  subtitle,
  messages = [],
  ctaText,
  ctaLink,
}: GuestbookSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-3">
              {title}
            </Heading>
            {subtitle && (
              <p className="text-[var(--textLight)]">{subtitle}</p>
            )}
          </div>

          {messages.length > 0 ? (
            <div className="space-y-6 mb-12">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border-color)]"
                >
                  <p className="text-[var(--text)] leading-relaxed mb-3 font-[var(--font-lyrics)] italic">
                    &ldquo;{msg.message}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--primary)]">
                      — {msg.author}
                    </span>
                    {msg.date && (
                      <span className="text-[var(--textMuted)] text-xs">{msg.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-[var(--surface)] rounded-xl border border-dashed border-[var(--border-color)] mb-12">
              <p className="text-[var(--textMuted)] text-lg mb-2 font-[var(--font-lyrics)] italic">
                This guestbook is waiting for its first message.
              </p>
              <p className="text-[var(--textMuted)] text-sm">
                If a song moved you, reach out.
              </p>
            </div>
          )}

          {ctaText && ctaLink && (
            <div className="text-center">
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
