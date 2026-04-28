import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

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
    <section id="sake" className="bg-background py-16 sm:py-20">
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

        <div className="grid gap-6 md:grid-cols-3">
          {types.map((type, index) => (
            <AnimateOnScroll key={type.name} stagger={index}>
              <Card className="h-full text-center">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">🍶</span>
                  </div>
                  <CardTitle className="mb-2">{type.name}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            Nuestro sommelier de sake te ayudará a elegir el acompañamiento perfecto para tu experiencia gastronómica.
          </p>
        </div>
      </Container>
    </section>
  )
}