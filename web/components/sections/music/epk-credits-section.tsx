import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface CreditItem {
  role: string
  name: string
}

interface ThankYouSection {
  title: string
  items: string[]
}

interface EpkCreditsSectionProps {
  title?: string
  subtitle?: string
  items?: CreditItem[]
  sections?: ThankYouSection[]
  variant?: 'standard' | 'thank-you'
}

export function EpkCreditsSection({
  title,
  subtitle,
  items = [],
  sections = [],
  variant = 'standard',
}: EpkCreditsSectionProps) {
  if (variant === 'thank-you') {
    if (!sections || sections.length === 0) return null
    return (
      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-2xl mx-auto">
            {title && (
              <Heading level={2} className="text-center mb-2">
                {title}
              </Heading>
            )}
            {subtitle && (
              <p className="text-center text-[var(--textLight)] mb-12">{subtitle}</p>
            )}
            <div className="space-y-12">
              {sections.map((section, i) => (
                <div key={i}>
                  <h3 className="text-lg font-medium text-[var(--primary)] mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-[var(--text)] leading-relaxed pl-4 border-l-2 border-[var(--primary)]/20">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl mx-auto">
          {title && (
            <Heading level={2} className="text-center mb-2">
              {title}
            </Heading>
          )}
          {subtitle && (
            <p className="text-center text-[var(--textLight)] mb-10">{subtitle}</p>
          )}
          <dl className="divide-y divide-[var(--border-color)]">
            {items.map((item, i) => (
              <div key={i} className="flex items-baseline gap-4 py-3">
                <dt className="w-32 flex-shrink-0 text-sm text-[var(--textMuted)] uppercase tracking-wider">
                  {item.role}
                </dt>
                <dd className="text-[var(--text)] font-medium">
                  {item.name}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
