import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardImage } from '@/components/ui/card'

/**
 * Sample week preview — "esto es lo que recibiste la semana pasada".
 * Gives concreteness before buyers subscribe. Reusable for CSAs, meal plans,
 * box services.
 */

export interface SampleWeekPreviewProps {
  title?: string
  subtitle?: string
  weekOf?: string
  items: Array<{
    name: string
    description?: string
    imageUrl?: string
    quantity?: string
    tag?: string
  }>
  footnote?: string
}

export function SampleWeekPreviewSection({
  title = 'Asi se ve tu semana',
  subtitle,
  weekOf,
  items,
  footnote,
}: SampleWeekPreviewProps) {
  if (!items?.length) return null
  return (
    <Section spacing="sm" background="surface">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          {weekOf && (
            <p className="mt-1 text-xs uppercase tracking-wide text-primary">
              Semana del {weekOf}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
          {items.map((it, i) => (
            <Card key={i}>
              {it.imageUrl && <CardImage src={it.imageUrl} alt={it.name} />}
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <Heading level={3} className="font-semibold text-foreground">{it.name}</Heading>
                  {it.quantity && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {it.quantity}
                    </span>
                  )}
                </div>
                {it.description && <p className="mt-1 text-xs text-muted-foreground">{it.description}</p>}
                {it.tag && (
                  <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-background text-muted-foreground">
                    {it.tag}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {footnote && (
          <p className="mt-6 text-center text-xs italic text-muted-foreground">{footnote}</p>
        )}
      </Container>
    </Section>
  )
}
