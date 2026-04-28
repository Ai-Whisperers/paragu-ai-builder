import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'

export interface TrackingStep {
  label: string
  date?: string
  completed: boolean
  description?: string
}

export interface OrderTrackingSectionProps {
  title?: string
  orderId?: string
  status?: string
  steps?: TrackingStep[]
  variant?: 'timeline' | 'steps' | 'card'
  __locale?: string
}

const DEFAULT_STEPS: TrackingStep[] = [
  { label: 'Pedido confirmado', completed: true },
  { label: 'En preparación', completed: true },
  { label: 'En camino', completed: false },
  { label: 'Entregado', completed: false },
]

const STEP_ICONS: Record<string, React.ReactNode> = {
  'Pedido confirmado': <CheckCircle className="h-5 w-5" />,
  'En preparación': <Package className="h-5 w-5" />,
  'En camino': <Truck className="h-5 w-5" />,
  'Entregado': <CheckCircle className="h-5 w-5" />,
}

export function OrderTrackingSection({
  title = 'Estado del pedido',
  orderId,
  steps = DEFAULT_STEPS,
  variant = 'timeline',
}: OrderTrackingSectionProps) {
  if (!steps?.length) return null

  if (variant === 'card') {
    const lastCompleted = [...steps].reverse().find((s) => s.completed)
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-sm rounded-xl border border-border bg-surface p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <Heading level={3}>{title}</Heading>
            {orderId && <p className="mt-1 text-xs text-muted-foreground">Pedido #{orderId}</p>}
            <p className="mt-3 text-sm font-medium text-foreground">{lastCompleted?.label}</p>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
            {orderId && <p className="mt-1 text-sm text-muted-foreground">Pedido #{orderId}</p>}
          </div>
          <div className="relative">
            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                {i < steps.length - 1 && (
                  <div className={`absolute left-[18px] top-10 h-full w-0.5 ${step.completed ? 'bg-primary' : 'bg-border'}`} />
                )}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  step.completed ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground'
                }`}>
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="min-w-0 pt-1">
                  <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                  {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
