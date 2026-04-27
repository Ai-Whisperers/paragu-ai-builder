import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

/**
 * Before/after split — two-column comparison for transformation stories.
 * Different from `before-after` slider: this shows ORDERED LISTS, not images.
 *
 * Use cases: "before Nexa / after Nexa", "before meal prep / after",
 * "pre-renovation / post-renovation", "DIY / with us".
 */

export interface BeforeAfterSplitProps {
  title?: string
  subtitle?: string
  before: { label: string; items: string[]; icon?: string }
  after: { label: string; items: string[]; icon?: string }
}

export function BeforeAfterSplitSection({
  title,
  subtitle,
  before,
  after,
}: BeforeAfterSplitProps) {
  return (
    <section className="py-14 bg-[var(--background)]">
      <Container>
        {title && (
          <div className="text-center mb-10">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-lg border border-[var(--surface-light)] p-6 bg-[var(--surface)]">
            <Heading level={3} className="font-semibold text-[var(--text-muted)] mb-3">{before.label}</Heading>
            <ul className="space-y-2">
              {before.items.map((x, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-muted)]">
                  <span>✕</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-2 border-[var(--primary)] p-6 bg-[var(--surface)]">
            <Heading level={3} className="font-semibold text-[var(--primary)] mb-3">{after.label}</Heading>
            <ul className="space-y-2">
              {after.items.map((x, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text)]">
                  <span className="text-[var(--primary)]">✓</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
