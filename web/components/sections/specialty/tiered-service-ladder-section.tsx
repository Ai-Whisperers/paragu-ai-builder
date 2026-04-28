import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/**
 * Tiered service ladder — visualises progression between subscription/service
 * levels. Different from pricing-table because it shows the UPGRADE PATH
 * (L1 → L2 → L3), not just side-by-side options.
 *
 * Use cases:
 *  - De Abasto a Casa: compras-only (L1) → mise-en-place (L2) → comidas-listas (L3)
 *  - Gyms: drop-in → basic membership → unlimited + classes
 *  - SaaS: starter → pro → enterprise
 *
 * Emphasises "what you get at this level that you didn't before" — the
 * `upgradesFromPrevious` field carries the delta copy.
 */

export interface LadderTier {
  level: number | string
  name: string
  subtitle?: string
  price?: string
  description?: string
  features: string[]
  /** Bullets describing what changes vs the previous tier. */
  upgradesFromPrevious?: string[]
  popular?: boolean
  status?: 'available' | 'coming-soon' | 'wait-list'
  statusLabel?: string
  ctaText?: string
}

export interface TieredServiceLadderSectionProps {
  title: string
  subtitle?: string
  tiers: LadderTier[]
  whatsappPhone?: string
  footerNote?: string
}

function statusBadge(tier: LadderTier) {
  if (!tier.status || tier.status === 'available') return null
  const label =
    tier.statusLabel ||
    (tier.status === 'coming-soon' ? 'Proximamente' : 'Lista de espera')
  return <Badge variant="outline">{label}</Badge>
}

export function TieredServiceLadderSection({
  title,
  subtitle,
  tiers,
  whatsappPhone,
  footerNote,
}: TieredServiceLadderSectionProps) {
  function contactCta(tier: LadderTier): string {
    if (!whatsappPhone) return '#contacto'
    const msg = `Hola, me interesa el nivel "${tier.name}". Quisiera mas informacion.`
    return `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
  }

  return (
    <section className="py-16 bg-background">
      <Container>
        <div className="text-center mb-10">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Connector line (desktop only) */}
        <div className="hidden md:block relative h-0 mb-[-1rem]">
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-[var(--surface-light)]" />
        </div>

        <div className="grid gap-5 md:grid-cols-3 relative">
          {tiers.map((tier, idx) => (
            <Card
              key={`${tier.level}-${idx}`}
              className={`relative h-full ${tier.popular ? 'ring-2 ring-primary' : ''} ${
                tier.status && tier.status !== 'available' ? 'opacity-80' : ''
              }`}
            >
              {/* Level indicator */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                {tier.level}
              </div>

              <CardContent className="pt-8 pb-6 px-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <Heading level={3}>{tier.name}</Heading>
                    {tier.subtitle && (
                      <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
                    )}
                  </div>
                  {statusBadge(tier)}
                  {tier.popular && <Badge>Recomendado</Badge>}
                </div>

                {tier.price && (
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-primary">{tier.price}</span>
                  </div>
                )}

                {tier.description && (
                  <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                )}

                {tier.upgradesFromPrevious && tier.upgradesFromPrevious.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-[var(--surface-light)]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Sube al nivel {tier.level}:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {tier.upgradesFromPrevious.map((u, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">↑</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ul className="space-y-1.5 text-sm text-foreground mb-5">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--success)]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full" variant={tier.popular ? 'primary' : 'secondary'}>
                  <a href={contactCta(tier)} target="_blank" rel="noopener noreferrer">
                    {tier.ctaText ||
                      (tier.status === 'coming-soon' ? 'Pre-reservar' : 'Quiero este nivel')}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {footerNote && (
          <p className="mt-8 text-center text-sm text-muted-foreground">{footerNote}</p>
        )}
      </Container>
    </section>
  )
}
