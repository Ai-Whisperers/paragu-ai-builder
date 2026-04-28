import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export interface ServicePackage {
  name: string
  price: string
  services: string[]
  savings?: string
  popular?: boolean
  description?: string
}

export interface ServicePackagesSectionProps {
  title?: string
  subtitle?: string
  packages?: ServicePackage[]
  variant?: 'cards' | 'tiered' | 'comparison'
  __locale?: string
}

export function ServicePackagesSection({
  title = 'Paquetes de servicios',
  subtitle = 'Elegí el plan que mejor se adapte a tus necesidades',
  packages = [],
  variant = 'cards',
}: ServicePackagesSectionProps) {
  if (!packages?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-10 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.name} className={`relative ${pkg.popular ? 'ring-2 ring-primary' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">Más popular</Badge>
              )}
              <CardContent className="flex flex-col p-6">
                <h3 className="text-lg font-semibold text-foreground">{pkg.name}</h3>
                {pkg.description && <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{pkg.price}</span>
                </div>
                {pkg.savings && <p className="mt-1 text-xs text-green-600">Ahorrás {pkg.savings}</p>}
                <ul className="mt-6 flex-1 space-y-3">
                  {pkg.services.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
