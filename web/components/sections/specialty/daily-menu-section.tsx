import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Utensils } from 'lucide-react'

export interface MenuCategory {
  name: string
  items: Array<{
    name: string
    price: string
    description?: string
    image?: string
  }>
}

export interface DailyMenuSectionProps {
  title?: string
  subtitle?: string
  date?: string
  categories?: MenuCategory[]
  variant?: 'grid' | 'list' | 'categorized'
  __locale?: string
}

export function DailyMenuSection({
  title = 'Menú del día',
  subtitle,
  categories = [],
  variant = 'grid',
}: DailyMenuSectionProps) {
  if (!categories?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-8 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.name}>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Utensils className="h-5 w-5 text-primary" />
                {cat.name}
              </h3>
              {variant === 'list' ? (
                <div className="divide-y divide-border rounded-xl border border-border">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                      </div>
                      <span className="font-semibold text-foreground">{item.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map((item) => (
                    <Card key={item.name}>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                        <p className="mt-2 font-semibold text-primary">{item.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
