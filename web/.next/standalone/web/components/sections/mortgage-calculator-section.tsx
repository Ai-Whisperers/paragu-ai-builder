'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState, useMemo } from 'react'
import { formatPrice, type SupportedCurrency } from '@/lib/currency'

/**
 * Mortgage calculator — simple monthly-payment estimator.
 * Formula: M = P * (r(1+r)^n) / ((1+r)^n – 1)
 * where P = principal, r = monthly rate, n = months.
 *
 * Reusable for real-estate tenants. Rate presets are passed in per tenant
 * (PY bank rates differ from EU rates; author in content JSON).
 */

export interface MortgageRatePreset {
  label: string
  annualRate: number // e.g. 0.095 for 9.5%
}

export interface MortgageCalculatorProps {
  title?: string
  subtitle?: string
  defaultPrincipal: number
  currency: SupportedCurrency
  locale?: string
  termYearsOptions: number[]
  ratePresets: MortgageRatePreset[]
  disclaimer?: string
}

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function MortgageCalculatorSection({
  title = 'Calculadora de cuotas',
  subtitle,
  defaultPrincipal,
  currency,
  locale = 'es-PY',
  termYearsOptions,
  ratePresets,
  disclaimer,
}: MortgageCalculatorProps) {
  const [principal, setPrincipal] = useState(defaultPrincipal)
  const [years, setYears] = useState(termYearsOptions[0] || 10)
  const [ratePreset, setRatePreset] = useState(ratePresets[0])

  const monthly = useMemo(
    () => (ratePreset ? monthlyPayment(principal, ratePreset.annualRate, years) : 0),
    [principal, ratePreset, years],
  )
  const totalPaid = monthly * years * 12
  const totalInterest = totalPaid - principal

  return (
    <section className="py-14 bg-[var(--background)]">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
          </div>

          <div className="bg-[var(--surface)] rounded-lg p-5 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Monto del prestamo</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className="w-full border border-[var(--surface-light)] rounded px-3 py-2 bg-[var(--background)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Plazo (años)</label>
                <select
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full border border-[var(--surface-light)] rounded px-3 py-2 bg-[var(--background)]"
                >
                  {termYearsOptions.map((y) => (
                    <option key={y} value={y}>
                      {y} años
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tasa</label>
                <select
                  value={ratePreset?.label || ''}
                  onChange={(e) =>
                    setRatePreset(ratePresets.find((r) => r.label === e.target.value) || ratePresets[0])
                  }
                  className="w-full border border-[var(--surface-light)] rounded px-3 py-2 bg-[var(--background)]"
                >
                  {ratePresets.map((r) => (
                    <option key={r.label} value={r.label}>
                      {r.label} — {(r.annualRate * 100).toFixed(1)}% anual
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--surface-light)] text-center">
              <div>
                <div className="text-xs text-[var(--text-muted)]">Cuota mensual</div>
                <div className="text-xl font-bold text-[var(--primary)]">
                  {formatPrice(monthly, { currency, locale })}
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)]">Total a pagar</div>
                <div className="text-sm font-semibold">{formatPrice(totalPaid, { currency, locale })}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)]">Intereses</div>
                <div className="text-sm font-semibold">
                  {formatPrice(totalInterest, { currency, locale })}
                </div>
              </div>
            </div>
          </div>

          {disclaimer && (
            <p className="mt-4 text-xs italic text-[var(--text-muted)] text-center">{disclaimer}</p>
          )}
        </div>
      </Container>
    </section>
  )
}
