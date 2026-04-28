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
 * Paraguay RESIMPLE qualifier — helps micro-contribuyentes decide if
 * they qualify for the Regimen Simplificado de Impuesto a la Renta
 * (tributo unico escalonado).
 *
 * Law 6380/19 + DNIT resolutions:
 *   - Facturacion anual <= Gs. 80.000.000  → tramo 1 (mas bajo)
 *   - Hasta Gs. 200M, Gs. 400M, Gs. 600M → tramos subsiguientes
 *   - Por encima de Gs. 600M → NO califica; debe ir a IRE Simple o General
 *
 * RESIMPLE paga un monto FIJO mensual segun tramo, no un porcentaje
 * sobre ganancia. Simplifica enormemente la carga administrativa.
 */

export interface CalcResimpleQualifierSectionProps extends BaseCalculatorSectionProps {}

const RESIMPLE_BRACKETS = [
  { max: 80_000_000, monthlyFee: 100_000, label: 'Tramo 1' },
  { max: 200_000_000, monthlyFee: 250_000, label: 'Tramo 2' },
  { max: 400_000_000, monthlyFee: 450_000, label: 'Tramo 3' },
  { max: 600_000_000, monthlyFee: 700_000, label: 'Tramo 4' },
] as const

const RESIMPLE_CEILING = 600_000_000

export function CalcResimpleQualifierSection({
  eyebrow = 'Calculadora RESIMPLE',
  title = 'Podes usar regimen RESIMPLE?',
  subtitle = 'Regimen simplificado para micro-contribuyentes. Pagas un monto fijo mensual y listo. Verifica si calificas y cuanto pagarias.',
  disclaimer,
  ctaLabel = 'Consultar si conviene RESIMPLE',
  ctaHref = '#contacto',
  whatsapp,
}: CalcResimpleQualifierSectionProps) {
  const [revenue, setRevenue] = useState<number>(150_000_000)

  const result = useMemo(() => {
    if (revenue > RESIMPLE_CEILING) {
      return {
        qualifies: false,
        bracket: null,
        monthlyFee: 0,
        annualFee: 0,
        message: `No calificas para RESIMPLE. Facturacion excede Gs. ${formatGs(RESIMPLE_CEILING)}.`,
        recommendation: 'Debes ir a IRE Simple o IRE General (10% sobre utilidad neta).',
      }
    }
    const bracket = RESIMPLE_BRACKETS.find((b) => revenue <= b.max) || RESIMPLE_BRACKETS[RESIMPLE_BRACKETS.length - 1]
    return {
      qualifies: true,
      bracket,
      monthlyFee: bracket.monthlyFee,
      annualFee: bracket.monthlyFee * 12,
      message: `Calificas al ${bracket.label}. Pagas Gs. ${formatGs(bracket.monthlyFee)}/mes fijo.`,
      recommendation: 'RESIMPLE reemplaza IRE + IVA + IRP. Contabilidad super simplificada.',
    }
  }, [revenue])

  const whatsappHref = whatsapp
    ? `https://wa.me/${cleanPhone(whatsapp)}?text=${encodeURIComponent('Hola, quiero saber si el regimen RESIMPLE conviene para mi negocio.')}`
    : null

  return (
    <Section fullWidth spacing="lg" background="surface" className="font-heading text-primary">
      <Container>
        <AnimatedSectionHeader>
          <p className="font-heading text-primary mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">{eyebrow}</p>
          <Heading level={2}>{title}</Heading>
          <p className="font-heading text-primary mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
        </AnimatedSectionHeader>

        <CalcCard size="sm">
          <label className="font-heading text-primary block">
            <span className="font-heading text-primary mb-2 block text-sm font-medium text-foreground">Facturacion anual estimada (Gs)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={10_000_000}
              value={revenue}
              onChange={(e) => setRevenue(Math.max(0, Number(e.target.value) || 0))}
              className="font-heading text-primary w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
            />
            <span className="font-heading text-primary mt-1 block text-xs text-muted-foreground">{formatGs(revenue)}</span>
          </label>

          <div className="font-heading text-primary mt-8 rounded-xl bg-surface-light p-6">
            {result.qualifies && result.bracket ? (
              <>
                <p className="font-heading text-primary text-xs uppercase tracking-wider text-emerald-700">Calificas para RESIMPLE</p>
                <p className="font-heading text-primary mt-1 text-xl sm:text-3xl font-bold">
                  {formatGs(result.monthlyFee)}/mes
                </p>
                <p className="font-heading text-primary mt-2 text-sm text-muted-foreground">
                  {result.bracket.label} — facturacion hasta {formatGs(result.bracket.max)}/ano
                </p>
                <p className="font-heading text-primary mt-2 text-sm text-foreground">
                  Costo anual total: <strong>{formatGs(result.annualFee)}</strong>
                </p>
                <p className="font-heading text-primary mt-3 text-xs text-muted-foreground">{result.recommendation}</p>
              </>
            ) : (
              <>
                <p className="font-heading text-primary text-xs uppercase tracking-wider text-rose-700">No calificas</p>
                <p className="font-heading text-primary mt-1 text-lg font-bold text-foreground">{result.message}</p>
                <p className="font-heading text-primary mt-2 text-sm text-muted-foreground">{result.recommendation}</p>
              </>
            )}
          </div>

          <div className="font-heading text-primary mt-6 overflow-x-auto">
            <h3 className="font-heading text-primary mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Tabla RESIMPLE 2026
            </h3>
            <table className="font-heading text-primary w-full text-sm">
              <thead>
                <tr className="font-heading text-primary border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="font-heading text-primary py-2 pr-3">Tramo</th>
                  <th className="font-heading text-primary py-2 pr-3">Facturacion hasta</th>
                  <th className="font-heading text-primary py-2 text-right">Cuota mensual</th>
                </tr>
              </thead>
              <tbody>
                {RESIMPLE_BRACKETS.map((b) => (
                  <tr
                    key={b.label}
                    className={`border-b border-border last:border-0 ${
                      result.qualifies && result.bracket?.label === b.label ? 'bg-emerald-50 font-semibold' : ''
                    }`}
                  >
                    <td className="font-heading text-primary py-2 pr-3">{b.label}</td>
                    <td className="font-heading text-primary py-2 pr-3">{formatGs(b.max)}</td>
                    <td className="font-heading text-primary py-2 text-right">{formatGs(b.monthlyFee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-heading text-primary mt-6 text-xs leading-relaxed text-muted-foreground">
            {disclaimer ||
              'RESIMPLE no aplica a: sociedades de hecho con socios diferentes a conyuges, empresas con empleados > X (variable), actividades reguladas (banca, seguros). Tambien hay limitaciones por rubro. Consulta con un contador para confirmar.'}
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
