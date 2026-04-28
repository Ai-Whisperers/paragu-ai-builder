'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { formatGs, cleanPhone } from '@/lib/format'
import type { BaseCalculatorSectionProps } from '@/types/sections'

/**
 * Paraguay "costo real de un empleado" calculator — B2B conversion magnet.
 *
 * Takes a gross monthly salary and surfaces the TRUE monthly cost to the
 * employer including IPS patronal 16.5%, aguinaldo provision 1/12, and
 * vacaciones provision. Most PY SMB owners under-budget employee cost by
 * 20-25% — seeing the real number is a strong pull into payroll services.
 */

export interface CalcCostoEmpleadoSectionProps extends BaseCalculatorSectionProps {}

export function CalcCostoEmpleadoSection({
  eyebrow = 'Costo real de un empleado',
  title = 'Cuanto te cuesta contratar?',
  subtitle = 'Sueldo bruto + IPS patronal + aguinaldo + vacaciones — el costo mensual verdadero que la mayoria de PYMES subestima.',
  disclaimer,
  ctaLabel = 'Cotizar liquidacion de sueldos',
  ctaHref = '#contacto',
  whatsapp,
}: CalcCostoEmpleadoSectionProps) {
  const [monthlySalary, setMonthlySalary] = useState<number>(3_500_000)
  const [headcount, setHeadcount] = useState<number>(1)

  const r = useMemo(() => {
    const salary = monthlySalary
    const ipsPatronal = salary * 0.165 // 16.5% patronal
    const aguinaldoProvision = salary / 12 // 1/12 monthly accrual
    const vacProvision = salary * (12 / 30) / 12 // 12 dias/ano min = 0.033 × salary monthly
    const monthlyCost = salary + ipsPatronal + aguinaldoProvision + vacProvision
    const annualCost = monthlyCost * 12
    const uplift = salary > 0 ? (monthlyCost - salary) / salary : 0
    const totalHeadcountMonthly = monthlyCost * headcount
    const totalHeadcountAnnual = annualCost * headcount
    return { salary, ipsPatronal, aguinaldoProvision, vacProvision, monthlyCost, annualCost, uplift, totalHeadcountMonthly, totalHeadcountAnnual }
  }, [monthlySalary, headcount])

  const whatsappHref = whatsapp
    ? `https://wa.me/${cleanPhone(whatsapp)}?text=${encodeURIComponent('Hola, quiero tercerizar la liquidacion de sueldos de mi empresa.')}`
    : null

  return (
    <section className="font-heading text-primary py-16 bg-surface sm:py-24">
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
                <span className="font-heading text-primary mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Sueldo mensual bruto (Gs)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100_000}
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Math.max(0, Number(e.target.value) || 0))}
                  className="font-heading text-primary w-full rounded-md border border-[var(--border,#e2e8f0)] bg-surface px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-secondary focus:outline-none"
                />
                <span className="font-heading text-primary mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(monthlySalary)}</span>
              </label>

              <label className="font-heading text-primary block">
                <span className="font-heading text-primary mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Cantidad de empleados</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={500}
                  step={1}
                  value={headcount}
                  onChange={(e) => setHeadcount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                  className="font-heading text-primary w-full rounded-md border border-[var(--border,#e2e8f0)] bg-surface px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-secondary focus:outline-none"
                />
              </label>

              <div className="font-heading text-primary rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
                <p className="font-heading text-primary font-semibold">Recargo real: +{(r.uplift * 100).toFixed(1)}%</p>
                <p className="font-heading text-primary mt-1 text-xs">Por cada Gs. 1 de sueldo pagas Gs. {(1 + r.uplift).toFixed(2)} de costo total.</p>
              </div>
            </div>

            <div className="font-heading text-primary flex flex-col justify-center rounded-xl bg-surface-light p-6">
              <dl className="font-heading text-primary space-y-3 text-sm">
                <Row label="Sueldo bruto" value={formatGs(r.salary)} />
                <Row label="IPS patronal (16.5%)" value={`+ ${formatGs(r.ipsPatronal)}`} positive />
                <Row label="Provision aguinaldo (1/12)" value={`+ ${formatGs(r.aguinaldoProvision)}`} positive />
                <Row label="Provision vacaciones" value={`+ ${formatGs(r.vacProvision)}`} positive />
                <div className="font-heading text-primary border-t border-[var(--border,#e2e8f0)] pt-3">
                  <dt className="font-heading text-primary text-xs uppercase tracking-wider text-secondary">Costo mensual real por empleado</dt>
                  <dd className="font-heading text-primary text-xl sm:text-3xl font-bold">
                    {formatGs(r.monthlyCost)}
                  </dd>
                </div>
                <div className="font-heading text-primary border-t border-dashed border-[var(--border,#e2e8f0)] pt-3">
                  <Row label="Costo anual por empleado" value={formatGs(r.annualCost)} bold />
                </div>
                {headcount > 1 && (
                  <>
                    <div className="font-heading text-primary border-t border-[var(--border,#e2e8f0)] pt-3">
                      <Row label={`Total mensual (${headcount} emp.)`} value={formatGs(r.totalHeadcountMonthly)} bold />
                    </div>
                    <Row label={`Total anual (${headcount} emp.)`} value={formatGs(r.totalHeadcountAnnual)} bold />
                  </>
                )}
              </dl>
            </div>
          </div>

          <p className="font-heading text-primary mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer ||
              'Calculo incluye IPS patronal (16.5%), provision de aguinaldo y provision de vacaciones minimas (12 dias/ano). No incluye: seguro medico privado, bonificaciones, horas extra, carga por despido (15d/ano), seguro de riesgos, ART. Consulta con contador para calculo exacto por rubro.'}
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

function Row({ label, value, bold, positive }: { label: string; value: string; bold?: boolean; positive?: boolean }) {
  return (
    <div className="font-heading text-primary flex items-baseline justify-between gap-4">
      <dt className="font-heading text-primary text-[var(--text-light,#475569)]">{label}</dt>
      <dd className={`font-semibold ${positive ? 'text-emerald-700' : bold ? 'text-lg text-[var(--text,#0f172a)]' : 'text-[var(--text,#0f172a)]'}`}>{value}</dd>
    </div>
  )
}
