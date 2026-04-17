'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'

interface Plan {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  popular?: boolean
  cta?: string
}

interface MembershipPlansSectionProps {
  title?: string
  subtitle?: string
  plans: Plan[]
  whatsappPhone?: string
  onSelectPlan?: (plan: Plan) => void
}

export function MembershipPlansSection({
  title = 'Planes de Membresía',
  subtitle,
  plans,
  whatsappPhone,
  onSelectPlan
}: MembershipPlansSectionProps) {
  const handleSelect = (plan: Plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan)
    } else if (whatsappPhone) {
      const message = `Hola! Me interesa el plan ${plan.name} (${plan.price}). Quisiera mas información.`
      window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  return (
    <section id="planes" className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 ${
                plan.popular
                  ? 'bg-[var(--primary)] text-white ring-4 ring-[var(--primary)] ring-offset-2'
                  : 'bg-[var(--surface)] border border-[var(--border)]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Más Popular
                </span>
              )}

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={plan.popular ? 'text-white/80' : 'text-[var(--text-muted)]'}>
                    /{plan.period}
                  </span>
                )}
              </div>

              {plan.description && (
                <p className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                  {plan.description}
                </p>
              )}

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-[var(--primary)]'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.popular ? 'text-white/90' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelect(plan)}
                variant={plan.popular ? 'secondary' : 'primary'}
                className="w-full"
              >
                {plan.cta || 'Comprar'}
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}