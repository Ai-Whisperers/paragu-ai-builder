import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface ConveyorBeltStep {
  number: number
  title: string
  description: string
}

export interface PlateColor {
  color: string
  name: string
  price: string
  description: string
}

export interface ConveyorBeltSectionProps {
  title: string
  subtitle?: string
  steps: ConveyorBeltStep[]
  plateColors: PlateColor[]
  tips?: string[]
}

export function ConveyorBeltSection({
  title,
  subtitle,
  steps,
  plateColors,
  tips
}: ConveyorBeltSectionProps) {
  return (
    <section id="como-funciona" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader className="mb-12 text-center">
          <Heading as="h2" size="h2" className="mb-4">
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-[var(--secondary)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {/* How It Works Steps */}
        <div className="mb-16">
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <AnimateOnScroll key={step.number} stagger={index}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-2xl font-bold text-[var(--primary-foreground)]">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{step.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Plate Colors / Pricing */}
        <div className="mb-12">
          <Heading as="h3" size="h3" className="mb-8 text-center">
            Precios por Color de Plato
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {plateColors.map((plate, index) => (
              <AnimateOnScroll key={plate.color} stagger={index}>
                <Card className="overflow-hidden">
                  <div
                    className="h-4"
                    style={{ backgroundColor: plate.color }}
                  />
                  <CardContent className="p-4 text-center">
                    <div
                      className="mx-auto mb-2 h-12 w-12 rounded-full border-4"
                      style={{ borderColor: plate.color, backgroundColor: `${plate.color}20` }}
                    />
                    <CardTitle className="mb-1 text-lg">{plate.name}</CardTitle>
                    <p className="mb-1 text-2xl font-bold text-[var(--primary)]">{plate.price}</p>
                    <p className="text-xs text-[var(--text-muted)]">{plate.description}</p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Tips */}
        {tips && tips.length > 0 && (
          <div className="mx-auto max-w-3xl rounded-lg bg-[var(--surface-light)] p-8">
            <Heading as="h4" size="h4" className="mb-4 text-center">
              Tips para tu Primera Visita
            </Heading>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[var(--success)]">💡</span>
                  <span className="text-[var(--text-light)]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  )
}