'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { formatGs } from '@/lib/format-gs'
import type { BaseCalculatorSectionProps } from '@/types/sections'

/**
 * Paraguay IRP (Impuesto a la Renta Personal) calculator — RSP + GCR.
 *
 * Law 6380/2019 brackets (as of 2026):
 *   - Gs 0 - 50M  -> 8%
 *   - Gs 50M+1 - 150M -> 9%
 *   - Over Gs 150M -> 10%
 *
 * RSP (Renta de Servicios Personales): 100% of expenses with comprobantes
 * are deductible (including IVA credito). Employees in dependencia relation
 * have a 36-salario-minimo-annual exempt threshold.
 *
 * This is an ILLUSTRATIVE calculator — actual returns require a contador.
 * Disclaimer is explicit.
 */

export interface CalcIrpSectionProps extends BaseCalculatorSectionProps {}

const BRACKETS = [
  { upto: 50_000_000, rate: 0.08 },
  { upto: 150_000_000, rate: 0.09 },
  { upto: Infinity, rate: 0.1 },
] as const

function computeIrp(baseGs: number): { tax: number; effectiveRate: number; breakdown: Array<{ band: string; taxed: number; rate: number; tax: number }> } {
  let remaining = Math.max(0, baseGs)
  let cursor = 0
  let totalTax = 0
  const breakdown: Array<{ band: string; taxed: number; rate: number; tax: number }> = []

  for (const b of BRACKETS) {
    if (remaining <= 0) break
    const bandLimit = b.upto - cursor
    const taxed = Math.min(remaining, bandLimit)
    const tax = taxed * b.rate
    totalTax += tax
    breakdown.push({
      band: `${formatGs(cursor)} - ${b.upto === Infinity ? '+' : formatGs(b.upto)}`,
      taxed,
      rate: b.rate,
      tax,
    })
    remaining -= taxed
    cursor = b.upto
  }

  return {
    tax: totalTax,
    effectiveRate: baseGs > 0 ? totalTax / baseGs : 0,
    breakdown,
  }
}

const LABELS = {
  es: {
    eyebrow: 'Calculadora IRP',
    title: 'Calcula tu IRP anual',
    subtitle: 'Impuesto a la Renta Personal (Ley 6380/19) para profesionales independientes y dependientes.',
    incomeLabel: 'Ingresos anuales gravados (Gs)',
    deductionsLabel: 'Egresos deducibles con comprobante (Gs)',
    baseLabel: 'Base imponible',
    annualTax: 'IRP anual',
    monthlyTax: 'Equivalente mensual',
    effectiveRate: 'Tasa efectiva',
    breakdownTitle: 'Tramos aplicados',
    disclaimer: 'Solo ilustrativo. El calculo real depende de deducciones especiales (art. 68 Ley 6380/19), regimen, exenciones y cierre anual. Consulta con un contador matriculado antes de presentar tu declaracion jurada.',
    cta: 'Cotizar IRP con un contador',
    whatsappCta: 'Consultar por WhatsApp',
    bandCol: 'Tramo',
    taxedCol: 'Gravado',
    rateCol: 'Tasa',
    taxCol: 'Impuesto',
  },
  en: {
    eyebrow: 'IRP Calculator',
    title: 'Estimate your Paraguay IRP',
    subtitle: 'Personal Income Tax (Law 6380/19) for independent professionals and employees.',
    incomeLabel: 'Annual taxable income (PYG)',
    deductionsLabel: 'Deductible expenses with invoice (PYG)',
    baseLabel: 'Taxable base',
    annualTax: 'Annual IRP',
    monthlyTax: 'Monthly equivalent',
    effectiveRate: 'Effective rate',
    breakdownTitle: 'Bracket breakdown',
    disclaimer: 'Illustrative only. Real computation depends on special deductions (Art. 68 Law 6380/19), regime, exemptions, and annual close. Consult a registered contador before filing.',
    cta: 'Get a quote from a contador',
    whatsappCta: 'Chat on WhatsApp',
    bandCol: 'Band',
    taxedCol: 'Taxed',
    rateCol: 'Rate',
    taxCol: 'Tax',
  },
  pt: {
    eyebrow: 'Calculadora IRP',
    title: 'Calcule seu IRP paraguaio',
    subtitle: 'Imposto de Renda Pessoal (Lei 6380/19) para profissionais autonomos e dependentes.',
    incomeLabel: 'Renda anual tributavel (PYG)',
    deductionsLabel: 'Despesas dedutiveis com nota fiscal (PYG)',
    baseLabel: 'Base tributavel',
    annualTax: 'IRP anual',
    monthlyTax: 'Equivalente mensal',
    effectiveRate: 'Taxa efetiva',
    breakdownTitle: 'Faixas aplicadas',
    disclaimer: 'Apenas ilustrativo. O calculo real depende de deducoes especiais, regime, isencoes e fechamento anual. Consulte um contador antes de apresentar sua declaracao.',
    cta: 'Cotizar com um contador',
    whatsappCta: 'Falar no WhatsApp',
    bandCol: 'Faixa',
    taxedCol: 'Tributado',
    rateCol: 'Taxa',
    taxCol: 'Imposto',
  },
}

export function CalcIrpSection({
  eyebrow,
  title,
  subtitle,
  disclaimer,
  ctaLabel,
  ctaHref = '#contacto',
  whatsapp,
  __locale,
}: CalcIrpSectionProps) {
  const locale = (__locale && __locale in LABELS ? __locale : 'es') as keyof typeof LABELS
  const L = LABELS[locale]

  const [income, setIncome] = useState<number>(120_000_000)
  const [deductions, setDeductions] = useState<number>(30_000_000)

  const base = Math.max(0, income - deductions)
  const { tax, effectiveRate, breakdown } = useMemo(() => computeIrp(base), [base])

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola, quiero cotizar la liquidacion de mi IRP. Mis ingresos anuales son aprox Gs ${formatGs(income)}`,
      )}`
    : null

  return (
    <section className="py-16 bg-[var(--surface-light,#f8fafc)] sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
            {eyebrow || L.eyebrow}
          </p>
          <Heading level={2}>{title || L.title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light,#475569)]">{subtitle || L.subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] p-6 shadow-sm sm:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">{L.incomeLabel}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1_000_000}
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
                <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(income)}</span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">{L.deductionsLabel}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={500_000}
                  value={deductions}
                  onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
                <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(deductions)}</span>
              </label>

              <div className="rounded-lg border border-dashed border-[var(--border,#e2e8f0)] bg-[var(--surface-light,#f8fafc)] p-4">
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">{L.baseLabel}</p>
                <p className="text-lg font-semibold text-[var(--text,#0f172a)]">{formatGs(base)}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-xl bg-[var(--surface-light,#f8fafc)] p-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">{L.annualTax}</dt>
                  <dd
                    className="text-3xl font-bold"
                    style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    {formatGs(tax)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">{L.monthlyTax}</dt>
                  <dd className="text-xl font-semibold text-[var(--text,#0f172a)]">{formatGs(tax / 12)}</dd>
                </div>
                <div className="border-t border-[var(--border,#e2e8f0)] pt-4">
                  <dt className="text-xs uppercase tracking-wider text-[var(--secondary)]">{L.effectiveRate}</dt>
                  <dd className="text-xl font-semibold text-[var(--text,#0f172a)]">
                    {(effectiveRate * 100).toFixed(2)}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {base > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted,#64748b)]">
                {L.breakdownTitle}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border,#e2e8f0)] text-left text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">
                      <th className="py-2 pr-3">{L.bandCol}</th>
                      <th className="py-2 pr-3 text-right">{L.taxedCol}</th>
                      <th className="py-2 pr-3 text-right">{L.rateCol}</th>
                      <th className="py-2 text-right">{L.taxCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown
                      .filter((b) => b.taxed > 0)
                      .map((b, i) => (
                        <tr key={i} className="border-b border-[var(--border,#e2e8f0)] last:border-0">
                          <td className="py-2 pr-3 text-[var(--text-light,#475569)]">{b.band}</td>
                          <td className="py-2 pr-3 text-right">{formatGs(b.taxed)}</td>
                          <td className="py-2 pr-3 text-right">{(b.rate * 100).toFixed(0)}%</td>
                          <td className="py-2 text-right font-semibold text-[var(--text,#0f172a)]">{formatGs(b.tax)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer || L.disclaimer}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {whatsappHref && (
              <Button
                href={whatsappHref}
                variant="secondary"
                size="lg"
                style={{ backgroundColor: '#25d366', color: '#ffffff', borderColor: '#25d366' }}
              >
                {L.whatsappCta}
              </Button>
            )}
            <Button variant="primary" size="lg" href={ctaHref}>
              {ctaLabel || L.cta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
