import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'

export interface NutritionItem {
  name: string
  calories?: number
  protein?: string
  carbs?: string
  fat?: string
  allergens?: string[]
}

export interface NutritionInfoSectionProps {
  title?: string
  items?: NutritionItem[]
  variant?: 'table' | 'cards'
  __locale?: string
}

export function NutritionInfoSection({
  title = 'Información nutricional',
  items = [],
  variant = 'table',
}: NutritionInfoSectionProps) {
  if (!items?.length) return null

  if (variant === 'cards') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <Heading level={2} className="mb-6">{title}</Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.name}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {item.calories && <div className="rounded-lg bg-surface-light p-2"><p className="text-sm font-bold text-foreground">{item.calories}</p><p className="text-[10px] text-muted-foreground">Calorías</p></div>}
                    {item.protein && <div className="rounded-lg bg-surface-light p-2"><p className="text-sm font-bold text-foreground">{item.protein}</p><p className="text-[10px] text-muted-foreground">Proteinas</p></div>}
                    {item.carbs && <div className="rounded-lg bg-surface-light p-2"><p className="text-sm font-bold text-foreground">{item.carbs}</p><p className="text-[10px] text-muted-foreground">Carbohid.</p></div>}
                  </div>
                  {item.allergens && item.allergens.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">Alérgenos: {item.allergens.join(', ')}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <Heading level={2} className="mb-6">{title}</Heading>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-light">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Producto</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Calorías</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Proteinas</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Carbohid.</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Grasas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.name} className="hover:bg-surface-light">
                  <td className="px-5 py-3 font-medium text-foreground">{item.name}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{item.calories ?? '-'}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{item.protein ?? '-'}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{item.carbs ?? '-'}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{item.fat ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  )
}
