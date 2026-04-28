import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface OmakaseTier {
  name: string
  price: string
  courses: number
  duration: string
  features: string[]
}

export interface OmakaseSectionProps {
  title: string
  subtitle?: string
  description?: string
  tiers: OmakaseTier[]
  notes?: string[]
}

export function OmakaseSection({
  title,
  subtitle,
  description,
  tiers,
  notes
}: OmakaseSectionProps) {
  return (
    <section id="omakase" className="bg-surface py-16 sm:py-20">
      <Container size="md">
        <AnimatedSectionHeader className="mb-12 text-center">
          <Heading as="h2" level={2} className="mb-4">
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-secondary">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {description && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <AnimateOnScroll key={tier.name} stagger={index}>
              <Card className="relative h-full overflow-hidden">
                {index === 1 && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-secondary px-12 py-1 text-xs font-bold text-[var(--secondary-foreground)]">
                    Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="mb-4 text-center">
                    <p className="text-sm uppercase tracking-wider text-muted-foreground">
                      {tier.courses} piezas
                    </p>
                    <CardTitle className="mt-2 text-xl sm:text-3xl font-bold">{tier.name}</CardTitle>
                    <p className="mt-2 text-2xl sm:text-4xl font-bold text-primary">{tier.price}</p>
                    <p className="text-sm text-muted-foreground">{tier.duration}</p>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[var(--success)]">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" size="lg">
                    Reservar {tier.name}
                  </Button>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        {notes && notes.length > 0 && (
          <div className="mx-auto mt-12 max-w-2xl rounded-lg bg-surface-light p-6">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">Notas importantes:</p>
            <ul className="space-y-2">
              {notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span>•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  )
}