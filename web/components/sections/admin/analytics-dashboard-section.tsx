import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'

export interface AnalyticsStat {
  label: string
  value: string
  change?: string
  icon?: string
}

export interface AnalyticsDashboardSectionProps {
  title?: string
  stats?: AnalyticsStat[]
  variant?: 'grid'
  __locale?: string
}

export function AnalyticsDashboardSection({
  title = 'Dashboard',
  stats = [
    { label: 'Visitas hoy', value: '1,234', change: '+12%' },
    { label: 'Consultas WhatsApp', value: '28', change: '+8%' },
    { label: 'Productos vistos', value: '567', change: '+23%' },
    { label: 'Tasa de conversión', value: '3.2%', change: '+0.5%' },
  ],
}: AnalyticsDashboardSectionProps) {
  if (!stats?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <Heading level={2} className="mb-6">{title}</Heading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.change && (
                  <p className={`mt-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
