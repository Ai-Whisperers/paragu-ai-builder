'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingPlan {
  name: string
  price?: string
  description: string
  features: PricingFeature[]
  popular?: boolean
  cta?: string
  footnote?: string
}

interface PricingTableSectionProps {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
  whatsappPhone?: string
  onSelectPlan?: (plan: PricingPlan) => void
}

export function PricingTableSection({
  title = 'Nuestros Paquetes',
  subtitle,
  plans = [],
  whatsappPhone,
  onSelectPlan,
}: PricingTableSectionProps) {
  const handleSelect = (plan: PricingPlan) => {
    if (onSelectPlan) {
      onSelectPlan(plan)
    } else if (whatsappPhone) {
      const message = `Hola! Me interesa el paquete ${plan.name}. Quisiera mas información.`
      window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  if (!plans.length) {
    return null
  }

  return (
    <section id="paquetes" className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl border p-6 transition-all ${
                plan.popular ? 'ring-2 scale-105 z-10' : ''
              }`}
              style={{
                backgroundColor: 'var(--card)',
                borderColor: plan.popular ? 'var(--primary)' : 'var(--border)',
                boxShadow: plan.popular ? '0 20px 40px rgba(0,0,0,0.1)' : 'var(--shadow-md)',
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold uppercase"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  Mas Popular
                </div>
              )}

              <div className="text-center">
                <h3
                  className="text-xl font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {plan.name}
                </h3>
                {plan.price && (
                  <div className="mt-2">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: 'var(--primary)' }}
                    >
                      {plan.price}
                    </span>
                  </div>
                )}
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--secondary)' }}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: feature.included ? 'var(--success)' : 'var(--error)' }}
                    >
                      {feature.included ? '✓' : '×'}
                    </span>
                    <span
                      style={{
                        color: feature.included ? 'var(--foreground)' : 'var(--text-muted)',
                      }}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.footnote && (
                <p
                  className="mt-3 text-xs italic"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {plan.footnote}
                </p>
              )}

              <div className="mt-6">
                <Button
                  onClick={() => handleSelect(plan)}
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'secondary'}
                >
                  {plan.cta || 'Solicitar Informacion'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default PricingTableSection