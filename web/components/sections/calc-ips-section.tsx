'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { formatGs, cleanPhone } from '@/lib/format'
import type { BaseCalculatorSectionProps } from '@/types/sections'

/**
 * Paraguay IPS aportes calculator — 9% obrero + 16.5% patronal.
 *
 * Employees see what gets deducted from their paycheck (9%) and
 * employers see the full cost (obrero + patronal = 25.5% on gross).
 * IPS covers retirement, sickness, maternity and accident insurance.
 */

export interface CalcIpsSectionProps extends BaseCalculatorSectionProps {}

export function CalcIpsSection({
  eyebrow = 'Calculadora IPS',
  title = 'Calcula tus aportes IPS',
  subtitle = 'Aporte obrero 9% + aporte patronal 16.5% sobre el salario bruto. Vence el dia 10 del mes siguiente.',
  disclaimer,
  ctaLabel = 'Cotizar liquidacion de IPS',
  ctaHref = '#contacto',
  whatsapp,
}: CalcIpsSectionProps) {
  const [salary, setSalary] = useState<number>(3_500_000)

  const r = useMemo(() => {
    const obrero = salary * 0.09
    const patronal = salary * 0.165
    const total = obrero + patronal
    const neto = salary - obrero
    return { salary, obrero, patronal, total, neto }
  }, [salary])

  const whatsappHref = whatsapp
    ? `https://wa.me/${cleanPhone(whatsapp)}?text=${encodeURIComponent('Hola, necesito ayuda con los aportes mensuales al IPS.')}`
    : null

  return (
    <section className="py-16 bg-[var(--surface-light,#f8fafc)] sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow}</p>
          <Heading level={2}>{title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light,#475569)]">{subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] p-6 shadow-sm sm:p-10">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Salario bruto mensual (Gs)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100_000}
              value={salary}
              onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
            />
            <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(salary)}</span>
          </label>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border,#e2e8f0)] bg-[var(--surface-light,#f8fafc)] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted,#64748b)]">Vista del empleado</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Salario bruto</dt><dd className="font-semibold">{formatGs(r.salary)}</dd></div>
                <div className="flex justify-between"><dt>Descuento IPS obrero (9%)</dt><dd className="font-semibold text-rose-700">- {formatGs(r.obrero)}</dd></div>
                <div className="flex justify-between border-t border-[var(--border,#e2e8f0)] pt-2">
                  <dt className="text-xs uppercase tracking-wider text-[var(--secondary)]">Salario neto</dt>
                  <dd className="text-2xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>{formatGs(r.neto)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-[var(--border,#e2e8f0)] bg-[var(--surface-light,#f8fafc)] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted,#64748b)]">Vista del empleador</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Aporte obrero (9%)</dt><dd className="font-semibold">{formatGs(r.obrero)}</dd></div>
                <div className="flex justify-between"><dt>Aporte patronal (16.5%)</dt><dd className="font-semibold">{formatGs(r.patronal)}</dd></div>
                <div className="flex justify-between border-t border-[var(--border,#e2e8f0)] pt-2">
                  <dt className="text-xs uppercase tracking-wider text-[var(--secondary)]">Total IPS a pagar</dt>
                  <dd className="text-2xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>{formatGs(r.total)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer ||
              'IPS art. 21 Ley 98/92. Vencimiento: dia 10 del mes siguiente. El aporte patronal adicional financia ANDE (6.5%). Aguinaldo y vacaciones tambien generan aporte IPS. Consulta con un contador para casos especiales (directores, autonomos, rural).'}
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
