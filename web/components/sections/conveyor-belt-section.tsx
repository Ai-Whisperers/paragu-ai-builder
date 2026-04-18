import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { SushiPlate, SeigaihaPattern } from '@/components/icons/sushi'
import { ConveyorBeltStrip } from './conveyor-belt-strip'

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
  pricingTitle?: string
  tipsTitle?: string
  animationSpeed?: string
}

const PLATE_VARIANTS: Array<'nigiri' | 'maki' | 'sashimi'> = ['nigiri', 'maki', 'sashimi']

export function ConveyorBeltSection({
  title,
  subtitle,
  steps,
  plateColors,
  tips,
  pricingTitle = 'Precios por Color de Plato',
  tipsTitle = 'Tips para tu Primera Visita',
  animationSpeed = '24s',
}: ConveyorBeltSectionProps) {
  const stripPlates = plateColors.flatMap((plate, i) =>
    PLATE_VARIANTS.map((_, j) => ({
      color: plate.color,
      variant: PLATE_VARIANTS[(i + j) % PLATE_VARIANTS.length],
    }))
  )

  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-[var(--surface)] py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <SeigaihaPattern id="conveyor-seigaiha" color="var(--primary)" opacity={0.04} />
      </div>

      <Container className="relative">
        <AnimatedSectionHeader className="mb-12 text-center">
          <Heading as="h2" size="h2" className="mb-4">
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-[var(--secondary)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {stripPlates.length > 0 && (
          <AnimateOnScroll className="mb-16">
            <ConveyorBeltStrip plates={stripPlates} speed={animationSpeed} />
          </AnimateOnScroll>
        )}

        <div className="mb-16">
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <AnimateOnScroll key={step.number} stagger={index}>
                <div className="text-center">
                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-10 blur-md" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-2xl font-bold text-[var(--primary-foreground)] shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{step.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <Heading as="h3" size="h3" className="mb-8 text-center">
            {pricingTitle}
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {plateColors.map((plate, index) => (
              <AnimateOnScroll key={`${plate.color}-${index}`} stagger={index}>
                <Card className="group overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-2" style={{ backgroundColor: plate.color }} />
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 h-16 w-16 transition-transform duration-300 group-hover:scale-110">
                      <SushiPlate
                        plateColor={plate.color}
                        toppingVariant={PLATE_VARIANTS[index % PLATE_VARIANTS.length]}
                        width="64"
                        height="64"
                      />
                    </div>
                    <CardTitle className="mb-1 text-lg">{plate.name}</CardTitle>
                    <p
                      className="mb-1 text-2xl font-bold"
                      style={{ color: plate.color }}
                    >
                      {plate.price}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{plate.description}</p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {tips && tips.length > 0 && (
          <div className="mx-auto max-w-3xl rounded-xl border border-[var(--primary)]/10 bg-[var(--surface-light)] p-8 shadow-sm">
            <Heading as="h4" size="h4" className="mb-4 text-center">
              {tipsTitle}
            </Heading>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[var(--primary-foreground)]"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {index + 1}
                  </span>
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
