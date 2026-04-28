import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'

export interface DeliveryStatusSectionProps {
  title?: string
  orderId?: string
  status?: string
  estimatedArrival?: string
  steps?: Array<{ label: string; time?: string; completed: boolean }>
  variant?: 'timeline' | 'card'
  __locale?: string
}

export function DeliveryStatusSection({
  title = 'Estado de entrega',
  orderId,
  estimatedArrival,
  steps = [
    { label: 'Pedido recibido', completed: true },
    { label: 'En preparación', completed: true },
    { label: 'En camino', completed: true },
    { label: 'Entregado', completed: false },
  ],
  variant = 'timeline',
}: DeliveryStatusSectionProps) {
  if (!steps?.length) return null

  if (variant === 'card') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-sm">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className={`rounded-full p-4 ${steps.every(s => s.completed) ? 'bg-green-50' : 'bg-primary/10'}`}>
                    {steps.every(s => s.completed) ? <CheckCircle className="h-8 w-8 text-green-600" /> : <Truck className="h-8 w-8 text-primary" />}
                  </div>
                </div>
                <Heading level={3}>{title}</Heading>
                {orderId && <p className="text-xs text-muted-foreground">Pedido #{orderId}</p>}
                {estimatedArrival && <p className="mt-2 text-sm font-semibold text-foreground">Llega {estimatedArrival}</p>}
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    )
  }

  const lastDone = [...steps].reverse().find(s => s.completed)

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
            {orderId && <p className="text-sm text-muted-foreground">Pedido #{orderId}</p>}
            {estimatedArrival && <p className="text-sm font-medium text-primary">Estimado: {estimatedArrival}</p>}
          </div>
          <div className="relative">
            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                {i < steps.length - 1 && <div className={`absolute left-[18px] top-10 h-full w-0.5 ${step.completed ? 'bg-primary' : 'bg-border'}`} />}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${step.completed ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground'}`}>
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                  {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
