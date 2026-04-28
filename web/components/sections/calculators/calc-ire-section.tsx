'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { formatGs, cleanPhone } from '@/lib/format'
import type { BaseCalculatorSectionProps } from '@/types/sections'

/**
 * Paraguay IRE Simple / General calculator (10% sobre utilidad neta).
 *
 * Ley 6380/19:
 *   - IRE Simple: facturacion anual <= Gs 2.000.000.000 (approx)
 *   - IRE General: sobre el umbral
 *   - RESIMPLE: micro-contribuyentes (< Gs 600M aprox), tributo unico
 *
 * Base imponible = ingresos gravados - egresos deducibles con comprobante.
 * Tasa = 10% plano.
 */

export interface CalcIreSectionProps extends BaseCalculatorSectionProps {}

const RESIMPLE_CEILING = 600_000_000
const SIMPLE_CEILING = 2_000_000_000

export function CalcIreSection({
  eyebrow = 'Calculadora IRE',
  title = 'Calcula tu IRE anual',
  subtitle = 'Impuesto a la Renta Empresarial (10% sobre utilidad neta) — regimen SIMPLE, GENERAL o RESIMPLE.',
  disclaimer,
  ctaLabel = 'Cotizar liquidacion IRE',
  ctaHref = '#contacto',
  whatsapp,
}: CalcIreSectionProps) {
  const [revenue, setRevenue] = useState<number>(1_200_000_000)
  const [expenses, setExpenses] = useState<number>(800_000_000)

  const r = useMemo(() => {
    const base = Math.max(0, revenue - expenses)
    const tax = base * 0.1
    const regime = revenue <= RESIMPLE_CEILING ? 'RESIMPLE' : revenue <= SIMPLE_CEILING ? 'IRE SIMPLE' : 'IRE GENERAL'
    const margin = revenue > 0 ? base / revenue : 0
    return { base, tax, regime, margin }
  }, [revenue, expenses])

  const whatsappHref = whatsapp
    ? `https://wa.me/${cleanPhone(whatsapp)}?text=${encodeURIComponent('Hola, necesito ayuda con la liquidacion anual de IRE de mi empresa.')}`
    : null

  return (
    <section className="font-heading text-primary py-16 bg-surface-light sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="font-heading text-primary mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">{eyebrow}</p>
          <Heading level={2}>{title}</Heading>
          <p className="font-heading text-primary mx-auto mt-4 max-w-2xl text-[var(--text-light,#475569)]">{subtitle}</p>
        </AnimatedSectionHeader>

        <div className="font-heading text-primary mx-auto mt-12 max-w-4xl rounded-2xl border border-[var(--border,#e2e8f0)] bg-surface p-6 shadow-sm sm:p-10">
          <div className="font-heading text-primary grid gap-8 md:grid-cols-2">
            <div className="font-heading text-primary space-y-5">
              <label className="font-heading text-primary block">
                <span className="font-heading text-primary mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Ingresos anuales gravados (Gs)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={10_000_000}
                  value={revenue}
                  onChange={(e) => setRevenue(Math.max(0, Number(e.target.value) || 0))}
                  className="font-heading text-primary w-full rounded-md border border-[var(--border,#e2e8f0)] bg-surface px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-secondary focus:outline-none"
                />
                <span className="font-heading text-primary mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(revenue)}</span>
              </label>

              <label className="font-heading text-primary block">
                <span className="font-heading text-primary mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Egresos deducibles con comprobante (Gs)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={5_000_000}
                  value={expenses}
                  onChange={(e) => setExpenses(Math.max(0, Number(e.target.value) || 0))}
                  className="font-heading text-primary w-full rounded-md border border-[var(--border,#e2e8f0)] bg-surface px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-secondary focus:outline-none"
                />
                <span className="font-heading text-primary mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(expenses)}</span>
              </label>

              <div className="font-heading text-primary rounded-lg border border-dashed border-[var(--border,#e2e8f0)] bg-surface-light p-4">
                <p className="font-heading text-primary text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">Regimen aplicable</p>
                <p className="font-heading text-primary text-lg font-bold">{r.regime}</p>
                <p className="font-heading text-primary mt-1 text-xs text-[var(--text-muted,#64748b)]">
                  {r.regime === 'RESIMPLE' && 'Tributo unico mensual — consulta con contador'}
                  {r.regime === 'IRE SIMPLE' && 'Regimen simplificado, deducciones limitadas'}
                  {r.regime === 'IRE GENERAL' && 'Regimen general, contabilidad completa'}
                </p>
              </div>
            </div>

            <div className="font-heading text-primary flex flex-col justify-center rounded-xl bg-surface-light p-6">
              <dl className="font-heading text-primary space-y-4">
                <div>
                  <dt className="font-heading text-primary text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">Utilidad neta</dt>
                  <dd className="font-heading text-primary text-xl font-semibold text-[var(--text,#0f172a)]">{formatGs(r.base)}</dd>
                  <p className="font-heading text-primary mt-1 text-xs text-[var(--text-muted,#64748b)]">Margen: {(r.margin * 100).toFixed(1)}%</p>
                </div>
                <div className="font-heading text-primary border-t border-[var(--border,#e2e8f0)] pt-4">
                  <dt className="font-heading text-primary text-xs uppercase tracking-wider text-secondary">IRE a pagar (10%)</dt>
                  <dd className="font-heading text-primary text-xl sm:text-3xl font-bold">
                    {formatGs(r.tax)}
                  </dd>
                </div>
                <div className="font-heading text-primary border-t border-dashed border-[var(--border,#e2e8f0)] pt-4">
                  <dt className="font-heading text-primary text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">Equivalente mensual</dt>
                  <dd className="font-heading text-primary text-lg font-semibold text-[var(--text,#0f172a)]">{formatGs(r.tax / 12)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="font-heading text-primary mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer ||
              'Calculo referencial IRE General/Simple. RESIMPLE tiene formula propia (tributo unico escalonado). Deducciones reales dependen de comprobantes validos, depreciaciones, incobrables y limites por rubro. Consulta con un contador antes de presentar.'}
          </p>

          <div className="font-heading text-primary mt-6 flex flex-wrap justify-center gap-3">
            {whatsappHref && (
              <Button href={whatsappHref} variant="whatsapp" size="lg">
                Consultar por WhatsApp
              </Button>
            )}
            <Button variant="primary" size="lg" href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
