import { Check, Minus, Star } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { cn } from '@/lib/utils'

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
  /**
   * Optional top-banner image (16:9) rendered above the tier name in the
   * `TierCards` variant. Accepts a bare URL or the `{src, alt}` object
   * emitted by `{ $img: "programs.<key>" }`.
   */
  image?: string | { src: string; alt: string }
}

function tierImage(img: ProgramTier['image']): { src: string; alt: string } | null {
  if (!img) return null
  if (typeof img === 'string') return { src: img, alt: '' }
  if (typeof img === 'object' && typeof img.src === 'string') {
    return { src: img.src, alt: img.alt ?? '' }
  }
  return null
}

export interface ProgramsComparisonSectionProps {
  variant?: ProgramsComparisonVariant
  eyebrow?: string
  title: string
  subtitle?: string
  tiers?: ProgramTier[]
  comparisonRows?: Array<{ feature: string; values: Array<string | boolean> }>
  /** Header label for the left column of the matrix variant. Locale-aware when omitted. */
  featureColumnLabel?: string
  /** Active URL locale — lets us pick a localized default for `featureColumnLabel`. */
  __locale?: string
}

const FEATURE_COLUMN_LABELS: Record<string, string> = {
  de: 'Merkmale',
  en: 'Features',
  es: 'Características',
  nl: 'Kenmerken',
  pt: 'Características',
}

export function ProgramsComparisonSection({
  variant = 'tiered',
  eyebrow,
  title,
  subtitle,
  tiers = [],
  comparisonRows,
  featureColumnLabel,
  __locale,
}: ProgramsComparisonSectionProps) {
  // Matrix variant can still render if the content only supplied
  // comparisonRows — we synthesize a single unnamed tier column so the
  // rows show up instead of silently returning null. This class of bug
  // cost us a full deploy cycle on the Superspuma /garantia page where
  // warrantyByModel had rows but no tiers.
  if (tiers.length === 0) {
    if (variant === 'matrix' && comparisonRows && comparisonRows.length > 0) {
      if (typeof console !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn(
          '[programs-comparison] matrix variant received comparisonRows without tiers — synthesizing a single column. Fix the content to provide tiers[] for proper rendering.',
        )
      }
      const rowCount = comparisonRows[0]?.values.length ?? 1
      tiers = Array.from({ length: rowCount }).map((_, i) => ({
        id: `col-${i}`,
        name: '',
        included: [],
        ctaLabel: '',
        ctaHref: '',
      }))
    } else {
      return null
    }
  }

  const resolvedFeatureLabel =
    featureColumnLabel || FEATURE_COLUMN_LABELS[__locale ?? 'es'] || FEATURE_COLUMN_LABELS.es

  return (
    <section id="programas" className="bg-[var(--background)] py-20 sm:py-28 lg:py-32">
      <Container>
        <AnimatedSectionHeader className="mb-12 sm:mb-16">
          {eyebrow && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
              {eyebrow}
            </p>
          )}
          <Heading level={2} style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--text-light)' }}>
              {subtitle}
            </p>
          )}
        </AnimatedSectionHeader>

        {variant === 'matrix' && comparisonRows && comparisonRows.length > 0 ? (
          <MatrixTable tiers={tiers} rows={comparisonRows} featureLabel={resolvedFeatureLabel} />
        ) : (
          <TierCards tiers={tiers} />
        )}
      </Container>
    </section>
  )
}

function TierCards({ tiers }: { tiers: ProgramTier[] }) {
  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
      {tiers.map((tier, idx) => (
        <AnimateOnScroll key={tier.id} stagger={((idx % 4) + 1) as 1 | 2 | 3 | 4}>
          <article className={cn('relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300',
              tier.highlighted ? 'bg-[var(--surface)] shadow-xl ring-2 ring-[var(--secondary)]' : 'bg-[var(--surface)] shadow-md hover:shadow-lg border border-[var(--surface-light)]'
            )} style={{ boxShadow: tier.highlighted ? '0 20px 50px -12px rgba(184, 134, 11, 0.25)' : undefined }}>
            {tier.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg" style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }}>
                  <Star size={12} fill="currentColor" />
                  {tier.badge}
                </span>
              </div>
            )}

            {(() => {
              const img = tierImage(tier.image)
              if (!img) return null
              return (
                <div className="aspect-[16/9] w-full overflow-hidden bg-[var(--surface-light)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt || tier.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )
            })()}

            <div className={cn("p-6 sm:p-8 pb-6", tier.highlighted && !tier.image && "pt-10")}>
              <Heading level={3} className="text-xl sm:text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {tier.name}
              </Heading>
              {tier.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tier.description}</p>
              )}
              
              {tier.price && (
                <div className="mt-5">
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{tier.price}</p>
                  {tier.priceNote && (
                    <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>{tier.priceNote}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 px-6 sm:px-8 py-4">
              <ul className="space-y-3">
                {(tier.included || []).map((item, i) => (
                  <li key={`inc-${i}`} className="flex gap-3 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text)' }}>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'rgba(184, 134, 11, 0.15)' }}>
                      <Check size={12} strokeWidth={3} style={{ color: 'var(--secondary)' }} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
                {tier.excluded?.map((item, i) => (
                  <li key={`exc-${i}`} className="flex gap-3 text-sm sm:text-base leading-relaxed opacity-50" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-[var(--surface-light)]">
                      <Minus size={12} strokeWidth={3} className="text-[var(--text-muted)]" />
                    </span>
                    <span className="line-through">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 sm:p-8 pt-4">
              <Button variant={tier.highlighted ? 'primary' : 'secondary'} size="lg" href={tier.ctaHref}
                className="w-full min-h-[52px] text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02]"
                style={tier.highlighted ? { backgroundColor: 'var(--secondary)', color: '#ffffff', boxShadow: '0 4px 16px rgba(184, 134, 11, 0.35)' } : undefined}>
                {tier.ctaLabel}
              </Button>
            </div>
          </article>
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function MatrixTable({ tiers, rows, featureLabel }: { tiers: ProgramTier[]; rows: Array<{ feature: string; values: Array<string | boolean> }>; featureLabel: string }) {
  return (
    <div className="mt-12 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr style={{ backgroundColor: 'var(--surface-light)' }}>
            <th className="p-4 sm:p-6 text-left font-semibold" style={{ color: 'var(--text)' }}>{featureLabel}</th>
            {tiers.map((t) => (
              <th key={t.id} className="p-4 sm:p-6 text-left font-bold" style={{ color: 'var(--primary)', minWidth: '180px' }}>{t.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn("transition-colors", i % 2 === 1 ? 'bg-[var(--surface-light)]/50' : '')}>
              <th className="p-4 sm:p-6 text-left font-medium" style={{ color: 'var(--text)' }}>{row.feature}</th>
              {row.values.map((val, j) => (
                <td key={j} className="p-4 sm:p-6" style={{ color: 'var(--text-light)' }}>{renderValue(val)}</td>
              ))}
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid var(--border)' }}>
            <th className="p-4 sm:p-6">&nbsp;</th>
            {tiers.map((t) => (
              <td key={t.id} className="p-4 sm:p-6">
                <Button variant="primary" size="sm" href={t.ctaHref} className="min-h-[44px] px-6">{t.ctaLabel}</Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function renderValue(val: string | boolean) {
  if (val === true) return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: 'rgba(184, 134, 11, 0.15)' }}>
      <Check size={16} strokeWidth={3} style={{ color: 'var(--secondary)' }} />
    </span>
  )
  if (val === false) return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--surface-light)]">
      <Minus size={16} strokeWidth={3} className="text-[var(--text-light)]" />
    </span>
  )
  return <span className="font-medium">{val}</span>
}
