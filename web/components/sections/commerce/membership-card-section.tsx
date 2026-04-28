import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Star, Check } from 'lucide-react'

export interface MembershipCardSectionProps {
  tier?: string
  points?: number
  benefits?: string[]
  expiryDate?: string
  memberName?: string
  memberSince?: string
  variant?: 'card' | 'inline' | 'badge'
  __locale?: string
}

export function MembershipCardSection({
  tier = 'Básico',
  points = 0,
  benefits = [],
  expiryDate,
  memberName,
  memberSince,
  variant = 'card',
}: MembershipCardSectionProps) {
  if (variant === 'badge') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <Star className="h-3 w-3" /> {tier}
      </span>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
        <Award className="h-8 w-8 text-primary" />
        <div>
          <p className="text-sm font-semibold text-foreground">{tier}</p>
          {points > 0 && <p className="text-xs text-muted-foreground">{points.toLocaleString()} puntos</p>}
        </div>
      </div>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-sm">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-[var(--primary-dark,#1a4a1a)] p-6 text-white">
              <div className="mb-4 flex items-center justify-between">
                <Award className="h-8 w-8 opacity-80" />
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{tier}</span>
              </div>
              {memberName && <p className="text-lg font-bold">{memberName}</p>}
              {points > 0 && <p className="mt-1 text-2xl font-bold">{points.toLocaleString()} <span className="text-sm font-normal opacity-80">puntos</span></p>}
              {memberSince && <p className="mt-1 text-xs opacity-70">Miembro desde {memberSince}</p>}
            </div>
            {benefits.length > 0 && (
              <CardContent className="p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Beneficios</p>
                <ul className="space-y-2">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" /> {b}
                    </li>
                  ))}
                </ul>
                {expiryDate && <p className="mt-4 text-xs text-muted-foreground">Vence: {expiryDate}</p>}
              </CardContent>
            )}
          </Card>
        </div>
      </Container>
    </Section>
  )
}
