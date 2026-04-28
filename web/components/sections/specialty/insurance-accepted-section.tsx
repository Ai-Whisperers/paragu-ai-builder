import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Shield, Check } from 'lucide-react'

export interface InsuranceAcceptedSectionProps {
  title?: string
  subtitle?: string
  insurances?: string[]
  variant?: 'grid' | 'list'
  __locale?: string
}

export function InsuranceAcceptedSection({
  title = 'Obras sociales y prepagas',
  subtitle = 'Trabajamos con las principales',
  insurances = [],
  variant = 'grid',
}: InsuranceAcceptedSectionProps) {
  if (!insurances?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        {variant === 'list' ? (
          <div className="mx-auto max-w-lg divide-y divide-border rounded-xl border border-border">
            {insurances.map((ins) => (
              <div key={ins} className="flex items-center gap-3 px-5 py-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-foreground">{ins}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {insurances.map((ins) => (
              <div key={ins} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{ins}</span>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
