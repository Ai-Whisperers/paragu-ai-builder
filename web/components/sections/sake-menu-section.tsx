import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { SakeIcon, SeigaihaPattern } from '@/components/icons/sushi'

export interface SakeType {
  name: string
  description: string
}

export interface SakeMenuSectionProps {
  title: string
  subtitle?: string
  description?: string
  types: SakeType[]
}

export function SakeMenuSection({
  title,
  subtitle,
  description,
  types
}: SakeMenuSectionProps) {
  return (
    <section id="sake" className="relative overflow-hidden bg-[var(--background)] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <SeigaihaPattern id="sake-seigaiha" color="var(--primary)" opacity={0.03} />
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

        {description && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[var(--text-muted)]">{description}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {types.map((type, index) => (
            <AnimateOnScroll key={type.name} stagger={index}>
              <Card className="group h-full text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] transition-transform duration-300 group-hover:scale-110">
                    <SakeIcon width="48" height="48" />
                  </div>
                  <CardTitle className="mb-2">{type.name}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Nuestro sommelier de sake te ayudará a elegir el acompañamiento perfecto para tu experiencia gastronómica.
          </p>
        </div>
      </Container>
    </section>
  )
}