'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { formatGs } from '@/lib/format-gs'
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
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, necesito ayuda con la liquidacion anual de IRE de mi empresa.')}`
    : null

  return (
    <section className="py-16 bg-[var(--surface-light,#f8fafc)] sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow}</p>
          <Heading level={2}>{title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light,#475569)]">{subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] p-6 shadow-sm sm:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Ingresos anuales gravados (Gs)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={10_000_000}
                  value={revenue}
                  onChange={(e) => setRevenue(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
                <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(revenue)}</span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Egresos deducibles con comprobante (Gs)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={5_000_000}
                  value={expenses}
                  onChange={(e) => setExpenses(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
                <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(expenses)}</span>
              </label>

              <div className="rounded-lg border border-dashed border-[var(--border,#e2e8f0)] bg-[var(--surface-light,#f8fafc)] p-4">
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">Regimen aplicable</p>
                <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>{r.regime}</p>
                <p className="mt-1 text-xs text-[var(--text-muted,#64748b)]">
                  {r.regime === 'RESIMPLE' && 'Tributo unico mensual — consulta con contador'}
                  {r.regime === 'IRE SIMPLE' && 'Regimen simplificado, deducciones limitadas'}
                  {r.regime === 'IRE GENERAL' && 'Regimen general, contabilidad completa'}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-xl bg-[var(--surface-light,#f8fafc)] p-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">Utilidad neta</dt>
                  <dd className="text-xl font-semibold text-[var(--text,#0f172a)]">{formatGs(r.base)}</dd>
                  <p className="mt-1 text-xs text-[var(--text-muted,#64748b)]">Margen: {(r.margin * 100).toFixed(1)}%</p>
                </div>
                <div className="border-t border-[var(--border,#e2e8f0)] pt-4">
                  <dt className="text-xs uppercase tracking-wider text-[var(--secondary)]">IRE a pagar (10%)</dt>
                  <dd className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatGs(r.tax)}
                  </dd>
                </div>
                <div className="border-t border-dashed border-[var(--border,#e2e8f0)] pt-4">
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">Equivalente mensual</dt>
                  <dd className="text-lg font-semibold text-[var(--text,#0f172a)]">{formatGs(r.tax / 12)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer ||
              'Calculo referencial IRE General/Simple. RESIMPLE tiene formula propia (tributo unico escalonado). Deducciones reales dependen de comprobantes validos, depreciaciones, incobrables y limites por rubro. Consulta con un contador antes de presentar.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {whatsappHref && (
              <Button href={whatsappHref} variant="secondary" size="lg" style={{ backgroundColor: '#25d366', color: '#ffffff', borderColor: '#25d366' }}>
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
