'use client'
import { Section } from '@/components/ui/section'
import { CalcCard } from '@/components/ui/calc-card'

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
    <Section fullWidth spacing="lg" background="surface-light" className="font-heading text-primary">
      <Container>
        <AnimatedSectionHeader>
          <p className="font-heading text-primary mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">{eyebrow}</p>
          <Heading level={2}>{title}</Heading>
          <p className="font-heading text-primary mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
        </AnimatedSectionHeader>

        <CalcCard size="sm">
          <label className="font-heading text-primary block">
            <span className="font-heading text-primary mb-2 block text-sm font-medium text-foreground">Salario bruto mensual (Gs)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100_000}
              value={salary}
              onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
              className="font-heading text-primary w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
            />
            <span className="font-heading text-primary mt-1 block text-xs text-muted-foreground">{formatGs(salary)}</span>
          </label>

          <div className="font-heading text-primary mt-8 grid gap-6 md:grid-cols-2">
            <div className="font-heading text-primary rounded-xl border border-border bg-surface-light p-6">
              <p className="font-heading text-primary text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vista del empleado</p>
              <dl className="font-heading text-primary mt-3 space-y-2 text-sm">
                <div className="font-heading text-primary flex justify-between"><dt>Salario bruto</dt><dd className="font-heading text-primary font-semibold">{formatGs(r.salary)}</dd></div>
                <div className="font-heading text-primary flex justify-between"><dt>Descuento IPS obrero (9%)</dt><dd className="font-heading text-primary font-semibold text-rose-700">- {formatGs(r.obrero)}</dd></div>
                <div className="font-heading text-primary flex justify-between border-t border-border pt-2">
                  <dt className="font-heading text-primary text-xs uppercase tracking-wider text-secondary">Salario neto</dt>
                  <dd className="font-heading text-primary text-2xl font-bold">{formatGs(r.neto)}</dd>
                </div>
              </dl>
            </div>

            <div className="font-heading text-primary rounded-xl border border-border bg-surface-light p-6">
              <p className="font-heading text-primary text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vista del empleador</p>
              <dl className="font-heading text-primary mt-3 space-y-2 text-sm">
                <div className="font-heading text-primary flex justify-between"><dt>Aporte obrero (9%)</dt><dd className="font-heading text-primary font-semibold">{formatGs(r.obrero)}</dd></div>
                <div className="font-heading text-primary flex justify-between"><dt>Aporte patronal (16.5%)</dt><dd className="font-heading text-primary font-semibold">{formatGs(r.patronal)}</dd></div>
                <div className="font-heading text-primary flex justify-between border-t border-border pt-2">
                  <dt className="font-heading text-primary text-xs uppercase tracking-wider text-secondary">Total IPS a pagar</dt>
                  <dd className="font-heading text-primary text-2xl font-bold">{formatGs(r.total)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="font-heading text-primary mt-6 text-xs leading-relaxed text-muted-foreground">
            {disclaimer ||
              'IPS art. 21 Ley 98/92. Vencimiento: dia 10 del mes siguiente. El aporte patronal adicional financia ANDE (6.5%). Aguinaldo y vacaciones tambien generan aporte IPS. Consulta con un contador para casos especiales (directores, autonomos, rural).'}
          </p>

          <div className="font-heading text-primary mt-6 flex flex-wrap justify-center gap-3">
            {whatsappHref && (
              <Button href={whatsappHref} variant="whatsapp" size="lg">
                Consultar por WhatsApp
              </Button>
            )}
            <Button variant="primary" size="lg" href={ctaHref}>{ctaLabel}</Button>
          </div>
        </CalcCard>
      </Container>
    </Section>
  )
}
