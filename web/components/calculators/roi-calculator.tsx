'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

interface ROICalculatorProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  __locale?: string
}

const LABELS: Record<string, { eyebrow: string; title: string; subtitle: string; investment: string; type: string; return: string; holding: string; projectedAnnual: string; fiveYear: string; breakEven: string; taxSavings: string; disclaimer: string }> = {
  en: { eyebrow: 'ROI Calculator', title: 'Investment Returns in Paraguay', subtitle: 'See potential returns on real estate or business investment in Asunción.', investment: 'Investment (USD)', type: 'Investment type', return: 'Expected return (%)', holding: 'Holding period', projectedAnnual: 'Projected annual return', fiveYear: '5-Year projection', breakEven: 'Break-even', taxSavings: 'Tax savings vs NL/DE', disclaimer: 'Historical data only. Not investment advice.' },
  es: { eyebrow: 'Calculadora ROI', title: 'Retornos de Inversión en PY', subtitle: 'Ve retornos potenciales en bienes raíces o negocio en Asunción.', investment: 'Inversión (USD)', type: 'Tipo de inversión', return: 'Retorno esperado (%)', holding: 'Período de tenencia', projectedAnnual: 'Retorno anual proyectado', fiveYear: 'Proyección a 5 años', breakEven: 'Punto de equilibrio', taxSavings: 'Ahorro fiscal vs NL/DE', disclaimer: 'Datos históricos. No es advice financiero.' },
  nl: { eyebrow: 'ROI Rekenmachine', title: 'Investeringsrendement in Paraguay', subtitle: 'Zie potentiële rendementen op vastgoed of zakelijke investering in Asunción.', investment: 'Investering (USD)', type: 'Type investering', return: 'Verwacht rendement (%)', holding: 'Houdperiode', projectedAnnual: 'Projecteerd jaarlijks rendement', fiveYear: '5-Jaars projectie', breakEven: 'Break-even', taxSavings: 'Belastingbesparing vs NL/DE', disclaimer: 'Historische data alleen. Geen investeringsadvies.' },
  de: { eyebrow: 'ROI-Rechner', title: 'Investitionsrenditen in Paraguay', subtitle: 'Sehen Sie potenzielle Renditen auf Immobilien- oder Geschäftsinvestitionen in Asunción.', investment: 'Investition (USD)', type: 'Investitionstyp', return: 'Erwartete Rendite (%)', holding: 'Haltedauer', projectedAnnual: 'Projektierte jährliche Rendite', fiveYear: '5-Jahres-Projektion', breakEven: 'Break-even', taxSavings: 'Steuervorteil vs NL/DE', disclaimer: 'Nur historische Daten. Kein Investitionsrat.' },
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function ROICalculator({ eyebrow, title, subtitle, __locale = 'en' }: ROICalculatorProps) {
  const L = LABELS[__locale] || LABELS.en

  const [investment, setInvestment] = useState(150000)
  const [type, setType] = useState<'real_estate' | 'business'>('real_estate')
  const [expectedReturn, setExpectedReturn] = useState(6)
  const [holdingYears, setHoldingYears] = useState(5)

  const results = useMemo(() => {
    const annualReturn = investment * (expectedReturn / 100)
    const fiveYearReturn = annualReturn * holdingYears

    const taxIfNL = type === 'business' ? investment * 0.25 : 0
    const taxIfDE = type === 'business' ? investment * 0.30 : 0
    const taxPY = type === 'business' ? investment * 0.10 : 0

    const taxSavingsNL = taxIfNL - taxPY
    const taxSavingsDE = taxIfDE - taxPY

    const breakEvenYears = expectedReturn > 0 ? investment / annualReturn : 0

    return {
      annualReturn,
      fiveYearReturn: fiveYearReturn + investment,
      breakEvenYears: Math.round(breakEvenYears * 10) / 10,
      taxSavings: Math.max(taxSavingsNL, taxSavingsDE),
    }
  }, [investment, type, expectedReturn, holdingYears])

  return (
    <section className="bg-surface-light py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">{eyebrow || L.eyebrow}</p>
          <Heading level={2}>{title || L.title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle || L.subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">{L.investment}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={50000}
                  step={10000}
                  value={investment}
                  onChange={(e) => setInvestment(Math.max(50000, Number(e.target.value) || 150000))}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">{L.type}</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base"
                >
                  <option value="real_estate">{__locale === 'es' ? 'Bienes raíces' : __locale === 'de' ? 'Immobilien' : __locale === 'nl' ? 'Vastgoed' : 'Real Estate'}</option>
                  <option value="business">{__locale === 'es' ? 'Negocio / Corporativo' : __locale === 'de' ? 'Geschäft / Unternehmens' : __locale === 'nl' ? 'Zakelijk' : 'Business / Corporate'}</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">{L.return}</span>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 text-center text-sm font-medium">{expectedReturn}%</div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">{L.holding}</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={holdingYears}
                  onChange={(e) => setHoldingYears(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 text-center text-sm font-medium">{holdingYears} {__locale === 'es' ? 'años' : __locale === 'de' ? 'Jahre' : __locale === 'nl' ? 'jaar' : 'years'}</div>
              </label>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl bg-surface-light p-5">
                <p className="text-sm text-muted-foreground">{L.projectedAnnual}</p>
                <p className="text-2xl font-bold text-green-600">{formatUSD(results.annualReturn)}</p>
              </div>

              <div className="rounded-xl bg-surface-light p-5">
                <p className="text-sm text-muted-foreground">{L.fiveYear}</p>
                <p className="text-2xl font-bold text-primary">{formatUSD(results.fiveYearReturn)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface-light p-4">
                  <p className="text-xs text-muted-foreground">{L.breakEven}</p>
                  <p className="text-lg font-semibold">{results.breakEvenYears} {__locale === 'es' ? 'años' : 'yrs'}</p>
                </div>
                <div className="rounded-xl bg-surface-light p-4">
                  <p className="text-xs text-muted-foreground">{L.taxSavings}</p>
                  <p className="text-lg font-semibold text-green-600">{formatUSD(results.taxSavings)}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">{L.disclaimer}</p>
        </div>
      </Container>
    </section>
  )
}