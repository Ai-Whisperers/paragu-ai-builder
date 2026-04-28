import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Gift, Star, Award } from 'lucide-react'

export interface LoyaltyTier {
  name: string
  minPoints: number
  benefits: string[]
}

export interface LoyaltyProgressSectionProps {
  title?: string
  currentPoints?: number
  nextTier?: string
  pointsToNext?: number
  tiers?: LoyaltyTier[]
  variant?: 'bar' | 'card' | 'tier'
  __locale?: string
}

const TIER_ICONS: Record<string, React.ReactNode> = {
  Bronce: <Star className="h-5 w-5" />,
  Plata: <Award className="h-5 w-5" />,
  Oro: <Award className="h-5 w-5" />,
  Platino: <Gift className="h-5 w-5" />,
}

export function LoyaltyProgressSection({
  title = 'Tu progreso',
  currentPoints = 0,
  nextTier,
  pointsToNext = 0,
  tiers = [],
  variant = 'bar',
}: LoyaltyProgressSectionProps) {
  if (variant === 'tier' && tiers.length > 0) {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
          </div>
          <div className="mx-auto max-w-lg space-y-4">
            {tiers.map((tier) => {
              const unlocked = currentPoints >= tier.minPoints
              const progress = currentPoints >= tier.minPoints ? 100 : Math.round((currentPoints / tier.minPoints) * 100)
              return (
                <div key={tier.name} className={`rounded-xl border p-5 ${unlocked ? 'border-primary/30 bg-primary/5' : 'border-border bg-surface'}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className={unlocked ? 'text-primary' : 'text-muted-foreground'}>{TIER_ICONS[tier.name] || <Star className="h-5 w-5" />}</span>
                    <div>
                      <p className={`font-semibold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.minPoints.toLocaleString()} puntos{unlocked ? ' — Desbloqueado' : ''}</p>
                    </div>
                  </div>
                  {!unlocked && (
                    <div className="mb-3 h-2 overflow-hidden rounded-full bg-surface-light">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                  )}
                  <ul className="space-y-1">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-green-500">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>
    )
  }

  const maxTier = currentPoints + pointsToNext || 1
  const pct = Math.min(Math.round((currentPoints / (currentPoints + pointsToNext || 1)) * 100), 100)

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-sm">
          <Card>
            <CardContent className="p-6">
              <Heading level={3} className="mb-4 text-center">{title}</Heading>
              <div className="mb-2 text-center">
                <span className="text-3xl font-bold text-foreground">{currentPoints.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground"> puntos</span>
              </div>
              <div className="mb-2 h-3 overflow-hidden rounded-full bg-surface-light">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              {nextTier && (
                <p className="text-center text-xs text-muted-foreground">
                  Faltan {pointsToNext.toLocaleString()} puntos para {nextTier}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
