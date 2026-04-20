'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface ComparePlansMatrixProps {
  title?: string
  subtitle?: string
  plans: Array<{ id: string; name: string; price?: string; popular?: boolean }>
  features: Array<{ label: string; values: Record<string, string | boolean> }>
  ctaTextBuilder?: (planId: string) => string
}

function renderValue(v: string | boolean | undefined) {
  if (v === true) return '✓'
  if (v === false || v === undefined) return '—'
  return v
}

export function ComparePlansMatrixSection({
  title = 'Compara los planes',
  subtitle,
  plans,
  features,
  ctaTextBuilder,
}: ComparePlansMatrixProps) {
  return (
    <section className="py-16 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl mx-auto text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 text-[var(--text-muted)]">Caracteristica</th>
                {plans.map((p) => (
                  <th
                    key={p.id}
                    className={`p-3 text-center ${
                      p.popular ? 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-t' : ''
                    }`}
                  >
                    <div className="font-semibold">{p.name}</div>
                    {p.price && <div className="text-xs mt-1">{p.price}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="border-t border-[var(--surface-light)]">
                  <td className="p-3 text-[var(--text)]">{f.label}</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-3 text-center text-[var(--text)]">
                      {renderValue(f.values[p.id])}
                    </td>
                  ))}
                </tr>
              ))}
              {ctaTextBuilder && (
                <tr className="border-t border-[var(--surface-light)]">
                  <td />
                  {plans.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      <span className="text-[var(--primary)] font-medium">{ctaTextBuilder(p.id)}</span>
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  )
}
