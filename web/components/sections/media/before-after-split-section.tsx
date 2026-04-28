import { Section } from '@/components/ui/section'
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
    <Section spacing="sm" background="background">
      <Container>
        {title && (
          <div className="text-center mb-10">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-lg border border-surface-light p-6 bg-surface">
            <Heading level={3} className="font-semibold text-muted-foreground mb-3">{before.label}</Heading>
            <ul className="space-y-2">
              {before.items.map((x, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span>✕</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-2 border-primary p-6 bg-surface">
            <Heading level={3} className="font-semibold text-primary mb-3">{after.label}</Heading>
            <ul className="space-y-2">
              {after.items.map((x, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground">
                  <span className="text-primary">✓</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
