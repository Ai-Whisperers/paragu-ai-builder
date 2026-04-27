'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { formatGs, cleanPhone } from '@/lib/format'
import type { BaseCalculatorSectionProps } from '@/types/sections'

/**
 * Paraguay liquidacion final / finiquito calculator.
 *
 * Components per Codigo del Trabajo:
 *   - Sueldo pendiente (dias trabajados del mes final)
 *   - Aguinaldo proporcional (meses del ano actual)
 *   - Vacaciones proporcionales (1/12 del derecho anual por mes)
 *   - Preaviso (solo en despido sin justa causa): 30/60/90 dias segun antiguedad
 *   - Indemnizacion por despido sin causa: 15 dias de salario por ano de servicio
 *   - Indemnizacion por despido por causas disciplinarias: sin preaviso ni indemnizacion
 *   - Renuncia: solo sueldo pendiente + aguinaldo + vacaciones proporcionales
 *
 * Preaviso brackets (art. 87 CT):
 *   - Antiguedad &lt; 1 ano: no preaviso
 *   - 1-5 anos: 30 dias
 *   - 5-10 anos: 45 dias
 *   - 10+ anos: 60 dias
 */

export interface CalcFiniquitoSectionProps extends BaseCalculatorSectionProps {}

type Cause = 'sin-causa' | 'con-causa' | 'renuncia' | 'acuerdo'

function preavisoDays(yearsService: number): number {
  if (yearsService < 1) return 0
  if (yearsService < 5) return 30
  if (yearsService < 10) return 45
  return 60
}

export function CalcFiniquitoSection({
  eyebrow,
  title,
  subtitle,
  disclaimer,
  ctaLabel,
  ctaHref = '#contacto',
  whatsapp,
  __locale,
}: CalcFiniquitoSectionProps) {
  const locale = __locale || 'es'

  const [monthlySalary, setMonthlySalary] = useState<number>(3_500_000)
  const [yearsService, setYearsService] = useState<number>(3)
  const [monthsThisYear, setMonthsThisYear] = useState<number>(8)
  const [daysPending, setDaysPending] = useState<number>(15)
  const [cause, setCause] = useState<Cause>('sin-causa')

  const result = useMemo(() => {
    const dailySalary = monthlySalary / 30
    const sueldoPendiente = dailySalary * Math.min(30, Math.max(0, daysPending))

    // Aguinaldo proporcional
    const aguinaldoProp = (monthlySalary * monthsThisYear) / 12

    // Vacaciones proporcionales — minimum 12 dias per year after 1 year completed
    const vacDaysAnnual = yearsService < 1 ? 0 : yearsService < 5 ? 12 : yearsService < 10 ? 18 : 30
    const vacacionesProp = (dailySalary * vacDaysAnnual * monthsThisYear) / 12

    // Preaviso and indemnizacion depend on cause
    let preaviso = 0
    let indemnizacion = 0

    if (cause === 'sin-causa') {
      preaviso = dailySalary * preavisoDays(yearsService)
      // 15 days salary per year of service (art. 91 CT)
      indemnizacion = dailySalary * 15 * yearsService
    } else if (cause === 'acuerdo') {
      // "Mutual agreement" — typically full indemnizacion + preaviso negotiated
      preaviso = dailySalary * preavisoDays(yearsService)
      indemnizacion = dailySalary * 15 * yearsService
    }
    // 'con-causa' and 'renuncia' — no preaviso, no indemnizacion

    const subtotal = sueldoPendiente + aguinaldoProp + vacacionesProp + preaviso + indemnizacion
    const ipsDeduction = (sueldoPendiente + aguinaldoProp + vacacionesProp) * 0.09 // preaviso/indem typically exentos
    const neto = subtotal - ipsDeduction

    return {
      sueldoPendiente,
      aguinaldoProp,
      vacacionesProp,
      preaviso,
      indemnizacion,
      subtotal,
      ipsDeduction,
      neto,
    }
  }, [monthlySalary, yearsService, monthsThisYear, daysPending, cause])

  const whatsappHref = whatsapp
    ? `https://wa.me/${cleanPhone(whatsapp)}?text=${encodeURIComponent(
        'Hola, necesito ayuda con una liquidacion final / finiquito.',
      )}`
    : null

  return (
    <section className="py-16 bg-[var(--surface-light,#f8fafc)] sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
            {eyebrow || 'Calculadora Finiquito'}
          </p>
          <Heading level={2}>{title || 'Calcula tu liquidacion final'}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light,#475569)]">
            {subtitle ||
              'Liquidacion final segun Codigo del Trabajo Paraguay: sueldo pendiente + aguinaldo + vacaciones + preaviso + indemnizacion.'}
          </p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] p-6 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Sueldo mensual bruto (Gs)</span>
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
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Anos completos de antiguedad</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={60}
                  step={1}
                  value={yearsService}
                  onChange={(e) => setYearsService(Math.max(0, Math.min(60, Number(e.target.value) || 0)))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[var(--text-muted,#64748b)]">
                  Preaviso aplicable: {preavisoDays(yearsService)} dias
                </p>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Meses trabajados este ano (1-12)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={12}
                  step={1}
                  value={monthsThisYear}
                  onChange={(e) => setMonthsThisYear(Math.min(12, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Dias pendientes del mes final (0-30)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={30}
                  step={1}
                  value={daysPending}
                  onChange={(e) => setDaysPending(Math.min(30, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </label>

              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Causa del cese</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      { v: 'sin-causa' as const, l: 'Despido sin causa' },
                      { v: 'con-causa' as const, l: 'Despido con causa' },
                      { v: 'renuncia' as const, l: 'Renuncia del trabajador' },
                      { v: 'acuerdo' as const, l: 'Mutuo acuerdo' },
                    ] satisfies Array<{ v: Cause; l: string }>
                  ).map((opt) => (
                    <label
                      key={opt.v}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="finiquito-cause"
                        value={opt.v}
                        checked={cause === opt.v}
                        onChange={() => setCause(opt.v)}
                      />
                      <span>{opt.l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col justify-center rounded-xl bg-[var(--surface-light,#f8fafc)] p-6">
              <dl className="space-y-3 text-sm">
                <Row label="Sueldo pendiente" value={formatGs(result.sueldoPendiente)} />
                <Row label="Aguinaldo proporcional" value={formatGs(result.aguinaldoProp)} />
                <Row label="Vacaciones proporcionales" value={formatGs(result.vacacionesProp)} />
                <Row label="Preaviso" value={formatGs(result.preaviso)} muted={result.preaviso === 0} />
                <Row label="Indemnizacion" value={formatGs(result.indemnizacion)} muted={result.indemnizacion === 0} />
                <div className="border-t border-[var(--border,#e2e8f0)] pt-3">
                  <Row label="Subtotal" value={formatGs(result.subtotal)} bold />
                </div>
                <Row label="Descuento IPS (9%)" value={`- ${formatGs(result.ipsDeduction)}`} negative />
                <div className="border-t border-[var(--border,#e2e8f0)] pt-3">
                  <dt className="text-xs uppercase tracking-wider text-[var(--secondary)]">Liquidacion neta a cobrar</dt>
                  <dd
                    className="mt-1 text-3xl font-bold"
                    style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    {formatGs(result.neto)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer ||
              'Calculo referencial segun Codigo del Trabajo Paraguay. Casos reales dependen de convenio colectivo, comisiones variables, justificacion de causa, bonificaciones habituales y comunicaciones al MTESS. Consulta con un contador o abogado laboral antes de firmar liquidacion.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {whatsappHref && (
              <Button
                href={whatsappHref}
                variant="secondary"
                size="lg"
                style={{ backgroundColor: '#25d366', color: '#ffffff', borderColor: '#25d366' }}
              >
                {locale === 'en' ? 'Chat on WhatsApp' : 'Consultar por WhatsApp'}
              </Button>
            )}
            <Button variant="primary" size="lg" href={ctaHref}>
              {ctaLabel || 'Cotizar liquidacion'}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Row({ label, value, bold, muted, negative }: { label: string; value: string; bold?: boolean; muted?: boolean; negative?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={`${muted ? 'text-[var(--text-muted,#64748b)]' : 'text-[var(--text-light,#475569)]'}`}>{label}</dt>
      <dd
        className={`font-semibold ${
          negative ? 'text-rose-700' : muted ? 'text-[var(--text-muted,#64748b)]' : bold ? 'text-lg text-[var(--text,#0f172a)]' : 'text-[var(--text,#0f172a)]'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
