'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

/**
 * Paraguay aguinaldo (13th-salary) calculator.
 *
 * Code del Trabajo art. 243: aguinaldo = 1/12 of total yearly earned
 * remuneration (sueldos + comisiones + horas extras + bonificaciones
 * habituales). Payment due before 31-dec of each year.
 *
 * Employees entering mid-year receive a proportional amount based on
 * months effectively worked. Employers subject aguinaldo to IPS 9%
 * worker deduction (16.5% patronal is NOT discounted from the aguinaldo
 * — it's an employer cost). IRP typically doesn't apply (exempt item).
 */

export interface CalcAguinaldoSectionProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  disclaimer?: string
  ctaLabel?: string
  ctaHref?: string
  whatsapp?: string
  __locale?: string
}

function formatGs(n: number): string {
  return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n))) + ' Gs'
}

const LABELS = {
  es: {
    eyebrow: 'Calculadora Aguinaldo',
    title: 'Calcula tu aguinaldo 2026',
    subtitle: 'Art. 243 del Codigo del Trabajo: 1/12 del total anual de remuneraciones. Se paga antes del 31 de diciembre.',
    monthlySalaryLabel: 'Sueldo mensual bruto (Gs)',
    monthsWorkedLabel: 'Meses trabajados en el ano (1-12)',
    extrasLabel: 'Comisiones + horas extra + bonificaciones anuales (Gs)',
    aguinaldoLabel: 'Aguinaldo bruto',
    ipsLabel: 'Descuento IPS obrero (9%)',
    netLabel: 'Aguinaldo neto a cobrar',
    employerCostLabel: 'Costo total para el empleador',
    disclaimer: 'Calculo referencial segun CT art. 243. Casos especiales (liquidacion final, sueldo variable, multiple empleador) requieren revision por contador. Bonificaciones no habituales pueden quedar excluidas de la base.',
    cta: 'Cotizar liquidacion de sueldos',
    whatsappCta: 'Consultar por WhatsApp',
  },
  en: {
    eyebrow: 'Aguinaldo Calculator',
    title: 'Calculate your Paraguay 13th-salary',
    subtitle: 'Labor Code Art. 243: 1/12 of the annual total salary. Due before December 31st.',
    monthlySalaryLabel: 'Gross monthly salary (PYG)',
    monthsWorkedLabel: 'Months worked in the year (1-12)',
    extrasLabel: 'Commissions + overtime + bonuses (annual, PYG)',
    aguinaldoLabel: 'Gross aguinaldo',
    ipsLabel: 'IPS worker deduction (9%)',
    netLabel: 'Net aguinaldo',
    employerCostLabel: 'Total employer cost',
    disclaimer: 'Reference calculation per CT art. 243. Special cases (final settlement, variable salary, multi-employer) require accountant review. Non-recurring bonuses may be excluded.',
    cta: 'Quote payroll services',
    whatsappCta: 'Chat on WhatsApp',
  },
  pt: {
    eyebrow: 'Calculadora Aguinaldo',
    title: 'Calcule seu 13o salario paraguaio',
    subtitle: 'Art. 243 Codigo do Trabalho: 1/12 do total anual de remuneracoes. Pagamento ate 31 de dezembro.',
    monthlySalaryLabel: 'Salario mensal bruto (PYG)',
    monthsWorkedLabel: 'Meses trabalhados no ano (1-12)',
    extrasLabel: 'Comissoes + horas extras + bonus (anual, PYG)',
    aguinaldoLabel: 'Aguinaldo bruto',
    ipsLabel: 'Desconto IPS trabalhador (9%)',
    netLabel: 'Aguinaldo liquido',
    employerCostLabel: 'Custo total empregador',
    disclaimer: 'Calculo referencial. Casos especiais (rescisao, salario variavel) requerem revisao por contador.',
    cta: 'Cotizar folha de pagamento',
    whatsappCta: 'Falar no WhatsApp',
  },
}

export function CalcAguinaldoSection({
  eyebrow,
  title,
  subtitle,
  disclaimer,
  ctaLabel,
  ctaHref = '#contacto',
  whatsapp,
  __locale,
}: CalcAguinaldoSectionProps) {
  const locale = (__locale && __locale in LABELS ? __locale : 'es') as keyof typeof LABELS
  const L = LABELS[locale]

  const [monthlySalary, setMonthlySalary] = useState<number>(3_500_000)
  const [monthsWorked, setMonthsWorked] = useState<number>(12)
  const [extras, setExtras] = useState<number>(0)

  const result = useMemo(() => {
    const totalAnnual = monthlySalary * monthsWorked + extras
    const aguinaldo = totalAnnual / 12
    const ipsDeduction = aguinaldo * 0.09
    const netAguinaldo = aguinaldo - ipsDeduction
    const ipsPatronal = aguinaldo * 0.165
    const employerCost = aguinaldo + ipsPatronal
    return { totalAnnual, aguinaldo, ipsDeduction, netAguinaldo, ipsPatronal, employerCost }
  }, [monthlySalary, monthsWorked, extras])

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola, necesito ayuda con la liquidacion de aguinaldo y sueldos de mi empresa.',
      )}`
    : null

  return (
    <section className="py-16 bg-[var(--surface,#ffffff)] sm:py-24">
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
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">{L.monthlySalaryLabel}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100_000}
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
                <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(monthlySalary)}</span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">{L.monthsWorkedLabel}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={12}
                  step={1}
                  value={monthsWorked}
                  onChange={(e) => setMonthsWorked(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">{L.extrasLabel}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100_000}
                  value={extras}
                  onChange={(e) => setExtras(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
                <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(extras)}</span>
              </label>
            </div>

            <div className="flex flex-col justify-center rounded-xl bg-[var(--surface-light,#f8fafc)] p-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">{L.aguinaldoLabel}</dt>
                  <dd className="text-xl font-semibold text-[var(--text,#0f172a)]">{formatGs(result.aguinaldo)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">{L.ipsLabel}</dt>
                  <dd className="text-xl font-semibold text-rose-700">- {formatGs(result.ipsDeduction)}</dd>
                </div>
                <div className="border-t border-[var(--border,#e2e8f0)] pt-4">
                  <dt className="text-xs uppercase tracking-wider text-[var(--secondary)]">{L.netLabel}</dt>
                  <dd
                    className="text-3xl font-bold"
                    style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    {formatGs(result.netAguinaldo)}
                  </dd>
                </div>
                <div className="border-t border-dashed border-[var(--border,#e2e8f0)] pt-4">
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">{L.employerCostLabel}</dt>
                  <dd className="text-lg font-semibold text-[var(--text,#0f172a)]">{formatGs(result.employerCost)}</dd>
                  <p className="mt-1 text-xs text-[var(--text-muted,#64748b)]">+ 16.5% IPS patronal</p>
                </div>
              </dl>
            </div>
          </div>

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
