'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

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

export interface CalcResimpleQualifierSectionProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  disclaimer?: string
  ctaLabel?: string
  ctaHref?: string
  whatsapp?: string
}

const RESIMPLE_BRACKETS = [
  { max: 80_000_000, monthlyFee: 100_000, label: 'Tramo 1' },
  { max: 200_000_000, monthlyFee: 250_000, label: 'Tramo 2' },
  { max: 400_000_000, monthlyFee: 450_000, label: 'Tramo 3' },
  { max: 600_000_000, monthlyFee: 700_000, label: 'Tramo 4' },
] as const

const RESIMPLE_CEILING = 600_000_000

function formatGs(n: number): string {
  return new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n))) + ' Gs'
}

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
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, quiero saber si el regimen RESIMPLE conviene para mi negocio.')}`
    : null

  return (
    <section className="py-16 bg-[var(--surface,#ffffff)] sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow}</p>
          <Heading level={2}>{title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light,#475569)]">{subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] p-6 shadow-sm sm:p-10">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">Facturacion anual estimada (Gs)</span>
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

          <div className="mt-8 rounded-xl bg-[var(--surface-light,#f8fafc)] p-6">
            {result.qualifies && result.bracket ? (
              <>
                <p className="text-xs uppercase tracking-wider text-emerald-700">Calificas para RESIMPLE</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  {formatGs(result.monthlyFee)}/mes
                </p>
                <p className="mt-2 text-sm text-[var(--text-light,#475569)]">
                  {result.bracket.label} — facturacion hasta {formatGs(result.bracket.max)}/ano
                </p>
                <p className="mt-2 text-sm text-[var(--text,#0f172a)]">
                  Costo anual total: <strong>{formatGs(result.annualFee)}</strong>
                </p>
                <p className="mt-3 text-xs text-[var(--text-muted,#64748b)]">{result.recommendation}</p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-rose-700">No calificas</p>
                <p className="mt-1 text-lg font-bold text-[var(--text,#0f172a)]">{result.message}</p>
                <p className="mt-2 text-sm text-[var(--text-light,#475569)]">{result.recommendation}</p>
              </>
            )}
          </div>

          <div className="mt-6 overflow-x-auto">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted,#64748b)]">
              Tabla RESIMPLE 2026
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border,#e2e8f0)] text-left text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)]">
                  <th className="py-2 pr-3">Tramo</th>
                  <th className="py-2 pr-3">Facturacion hasta</th>
                  <th className="py-2 text-right">Cuota mensual</th>
                </tr>
              </thead>
              <tbody>
                {RESIMPLE_BRACKETS.map((b) => (
                  <tr
                    key={b.label}
                    className={`border-b border-[var(--border,#e2e8f0)] last:border-0 ${
                      result.qualifies && result.bracket?.label === b.label ? 'bg-emerald-50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2 pr-3">{b.label}</td>
                    <td className="py-2 pr-3">{formatGs(b.max)}</td>
                    <td className="py-2 text-right">{formatGs(b.monthlyFee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer ||
              'RESIMPLE no aplica a: sociedades de hecho con socios diferentes a conyuges, empresas con empleados > X (variable), actividades reguladas (banca, seguros). Tambien hay limitaciones por rubro. Consulta con un contador para confirmar.'}
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
