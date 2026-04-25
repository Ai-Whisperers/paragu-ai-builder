'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'

/**
 * Regulatory status / certifications / licenses displayed as trust signals.
 *
 * Use cases:
 *  - De Abasto a Casa: INAN food-safety habilitation status
 *  - Dental / medical / vet: licenses, specialties
 *  - Finance / insurance: SEC/FINRA, bar admissions, insurance broker license
 *  - Real estate: realtor board, MLS, license numbers
 *  - Nexa Paraguay: SEPRELAD AML compliance, attorney bar
 *
 * Each item has a status: "active" | "pending" | "in-progress" | "expired".
 * The section is intentionally simple — its job is to surface the fact of
 * regulation, not to render a full compliance dashboard.
 */

export type RegulatoryStatus = 'active' | 'pending' | 'in-progress' | 'expired'

export interface RegulatoryItem {
  name: string
  /** Agency / issuer (INAN, SEPRELAD, FDA, FINRA, etc.). */
  issuer?: string
  /** License / registration number. */
  number?: string
  status: RegulatoryStatus
  /** Optional date the status applies as of. */
  since?: string
  /** Link to public register if the issuer provides one. */
  verifyUrl?: string
  /** Custom human-readable label for the status (overrides default). */
  statusLabel?: string
  /** Optional short descriptor for the badge tooltip / subtitle. */
  description?: string
}

export interface RegulatoryStatusBadgeSectionProps {
  title?: string
  subtitle?: string
  items: RegulatoryItem[]
  variant?: 'badge' | 'inline'
  /** Footnote shown below. Use for legal language ("verifique en el registro oficial..."). */
  footnote?: string
}

const STATUS_COLORS: Record<RegulatoryStatus, { bg: string; text: string; label: string }> = {
  active: { bg: '#DEF7EC', text: '#03543F', label: 'Habilitado' },
  'in-progress': { bg: '#FDF6B2', text: '#723B13', label: 'En tramite' },
  pending: { bg: '#FEE2E2', text: '#991B1B', label: 'Pendiente' },
  expired: { bg: '#E5E7EB', text: '#1F2937', label: 'Expirado' },
}

export function RegulatoryStatusBadgeSection({
  title = 'Registros y Habilitaciones',
  subtitle,
  items,
  variant = 'badge',
  footnote,
}: RegulatoryStatusBadgeSectionProps) {
  if (!items?.length) return null

  if (variant === 'inline') {
    return (
      <section className="py-6 bg-[var(--surface-light)]">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--text-muted)]">
            {items.map((it, i) => (
              <InlineItem key={i} item={it} />
            ))}
          </div>
          {footnote && (
            <p className="mt-3 text-center text-xs text-[var(--text-muted)] italic">{footnote}</p>
          )}
        </Container>
      </section>
    )
  }

  // Badge (grid) variant
  return (
    <section className="py-12 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {items.map((it, i) => (
            <BadgeCard key={i} item={it} />
          ))}
        </div>

        {footnote && (
          <p className="mt-6 text-center text-xs text-[var(--text-muted)] italic">{footnote}</p>
        )}
      </Container>
    </section>
  )
}

function BadgeCard({ item }: { item: RegulatoryItem }) {
  const palette = STATUS_COLORS[item.status]
  return (
    <div className="rounded-lg p-4 border border-[var(--surface-light)] bg-[var(--surface)]">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-semibold text-[var(--text)]">{item.name}</div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: palette.bg, color: palette.text }}
        >
          {item.statusLabel || palette.label}
        </span>
      </div>
      <div className="text-xs text-[var(--text-muted)] space-y-0.5">
        {item.issuer && <div>{item.issuer}</div>}
        {item.number && <div>N° {item.number}</div>}
        {item.since && <div>Desde {item.since}</div>}
        {item.description && <div className="mt-1 italic">{item.description}</div>}
      </div>
      {item.verifyUrl && (
        <a
          href={item.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-[var(--primary)] underline"
        >
          Verificar en registro oficial
        </a>
      )}
    </div>
  )
}

function InlineItem({ item }: { item: RegulatoryItem }) {
  const palette = STATUS_COLORS[item.status]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
      style={{ backgroundColor: palette.bg, color: palette.text }}
      title={item.description}
    >
      <Badge variant="outline" className="!bg-transparent !border-0 !p-0 !text-inherit">
        {item.name}
      </Badge>
      <span>· {item.statusLabel || palette.label}</span>
    </span>
  )
}
