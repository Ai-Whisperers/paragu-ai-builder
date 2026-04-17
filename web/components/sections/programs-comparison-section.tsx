import { Check, Minus } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export type ProgramsComparisonVariant = 'tiered' | 'matrix'

export interface ProgramTier {
  id: string
  name: string
  description?: string
  price?: string
  priceNote?: string
  badge?: string
  highlighted?: boolean
  included: string[]
  excluded?: string[]
  ctaLabel: string
  ctaHref: string
}

export interface ProgramsComparisonSectionProps {
  variant?: ProgramsComparisonVariant
  eyebrow?: string
  title: string
  subtitle?: string
  tiers: ProgramTier[]
  comparisonRows?: Array<{ feature: string; values: Array<string | boolean> }>
}

export function ProgramsComparisonSection({
  variant = 'tiered',
  eyebrow,
  title,
  subtitle,
  tiers,
  comparisonRows,
}: ProgramsComparisonSectionProps) {
  return (
    <section id="programas" className="bg-[var(--background)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
              {eyebrow}
            </p>
          )}
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {variant === 'matrix' && comparisonRows && comparisonRows.length > 0 ? (
          <MatrixTable tiers={tiers} rows={comparisonRows} />
        ) : (
          <TierCards tiers={tiers} />
        )}
      </Container>
    </section>
  )
}

function TierCards({ tiers }: { tiers: ProgramTier[] }) {
  const cols = tiers.length <= 2 ? 2 : tiers.length === 3 ? 3 : 4
  return (
    <div
      className="mt-12 grid gap-6"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))` }}
      data-cols={cols}
    >
      {tiers.map((tier, idx) => (
        <AnimateOnScroll key={tier.id} stagger={(idx + 1) as 1 | 2 | 3 | 4}>
          <article
            className={
              'relative flex h-full flex-col rounded-lg border p-8 transition-all ' +
              (tier.highlighted
                ? 'border-[var(--secondary)] bg-[var(--surface)] shadow-card-hover'
                : 'border-[var(--border)] bg-[var(--surface)] shadow-card hover:shadow-card-hover')
            }
          >
            {tier.badge && (
              <span className="absolute -top-3 left-6 rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--secondary-foreground)]">
                {tier.badge}
              </span>
            )}
            <h3
              className="text-2xl font-bold text-[var(--primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {tier.name}
            </h3>
            {tier.description && (
              <p className="mt-2 text-sm text-[var(--text-light)]">{tier.description}</p>
            )}
            {tier.price && (
              <div className="mt-6">
                <p className="text-3xl font-bold text-[var(--text)]">{tier.price}</p>
                {tier.priceNote && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{tier.priceNote}</p>
                )}
              </div>
            )}
            <ul className="mt-6 flex-1 space-y-3">
              {tier.included.map((item, i) => (
                <li key={`inc-${i}`} className="flex gap-3 text-sm text-[var(--text)]">
                  <Check size={18} className="mt-0.5 flex-shrink-0 text-[var(--secondary)]" />
                  <span>{item}</span>
                </li>
              ))}
              {tier.excluded?.map((item, i) => (
                <li
                  key={`exc-${i}`}
                  className="flex gap-3 text-sm text-[var(--text-muted)] line-through"
                >
                  <Minus size={18} className="mt-0.5 flex-shrink-0 opacity-40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              variant={tier.highlighted ? 'primary' : 'secondary'}
              size="lg"
              href={tier.ctaHref}
              className="mt-8 w-full"
            >
              {tier.ctaLabel}
            </Button>
          </article>
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function MatrixTable({
  tiers,
  rows,
}: {
  tiers: ProgramTier[]
  rows: Array<{ feature: string; values: Array<string | boolean> }>
}) {
  return (
    <div className="mt-12 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--surface-light)]">
            <th className="p-4 text-left font-semibold text-[var(--text)]">&nbsp;</th>
            {tiers.map((t) => (
              <th key={t.id} className="p-4 text-left font-semibold text-[var(--primary)]">
                {t.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 1 ? 'bg-[var(--surface-light)]' : ''}
            >
              <th className="p-4 text-left font-medium text-[var(--text)]">{row.feature}</th>
              {row.values.map((val, j) => (
                <td key={j} className="p-4 text-[var(--text-light)]">
                  {renderValue(val)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th className="p-4">&nbsp;</th>
            {tiers.map((t) => (
              <td key={t.id} className="p-4">
                <Button variant="primary" size="sm" href={t.ctaHref}>
                  {t.ctaLabel}
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function renderValue(val: string | boolean) {
  if (val === true) return <Check size={18} className="text-[var(--secondary)]" />
  if (val === false)
    return <Minus size={18} className="text-[var(--text-muted)] opacity-40" />
  return val
}
