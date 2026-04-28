import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { PAYMENT_IDS, PAYMENT_LABELS, PaymentIcon, type PaymentMethodId } from '@/lib/commerce/payment-icons'

export interface PaymentMethodsSectionProps {
  title?: string
  methods?: PaymentMethodId[]
  showLabels?: boolean
  __locale?: string
}

export function PaymentMethodsSection({
  title = 'Medios de pago',
  methods = [...PAYMENT_IDS],
  showLabels = false,
}: PaymentMethodsSectionProps) {
  if (!methods?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        {title && (
          <Heading level={3} className="mb-4 text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </Heading>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {methods.map((method) => (
            <div key={method} className="flex flex-col items-center gap-1">
              <PaymentIcon method={method} />
              {showLabels && (
                <span className="text-[10px] text-muted-foreground">{PAYMENT_LABELS[method]}</span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
