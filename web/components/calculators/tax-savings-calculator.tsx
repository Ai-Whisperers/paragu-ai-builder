'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { LeadCaptureModal } from './lead-capture-modal'

interface TaxSavingsCalculatorProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  __locale?: string
}

type CountryData = {
  code: string
  name: Record<string, string>
  brackets: Array<{ min: number; max: number; rate: number }>
}

const COUNTRIES: CountryData[] = [
  { code: 'NL', name: { es: 'Países Bajos', en: 'Netherlands', nl: 'Nederland', de: 'Niederlande' }, brackets: [{ min: 0, max: 36999, rate: 36.97 }, { min: 36999, max: 75993, rate: 37.47 }, { min: 75993, max: 124999, rate: 49.5 }, { min: 124999, max: 239999, rate: 51.95 }, { min: 239999, max: Infinity, rate: 49.5 }] },
  { code: 'DE', name: { es: 'Alemania', en: 'Germany', nl: 'Duitsland', de: 'Deutschland' }, brackets: [{ min: 0, max: 11604, rate: 0 }, { min: 11604, max: 17005, rate: 14 }, { min: 17005, max: 66760, rate: 24 }, { min: 66760, max: 277825, rate: 42 }, { min: 277825, max: Infinity, rate: 45 }] },
  { code: 'BE', name: { es: 'Bélgica', en: 'Belgium', nl: 'België', de: 'Belgien' }, brackets: [{ min: 0, max: 15470, rate: 25 }, { min: 15470, max: 29070, rate: 40 }, { min: 29070, max: 55460, rate: 45 }, { min: 55460, max: Infinity, rate: 50 }] },
  { code: 'AT', name: { es: 'Austria', en: 'Austria', nl: 'Oostenrijk', de: 'Österreich' }, brackets: [{ min: 0, max: 11693, rate: 0 }, { min: 11693, max: 19134, rate: 20 }, { min: 19134, max: 32075, rate: 30 }, { min: 32075, max: 62110, rate: 40 }, { min: 62110, max: 93120, rate: 48 }, { min: 93120, max: Infinity, rate: 50 }] },
  { code: 'ES', name: { es: 'España', en: 'Spain', nl: 'Spanje', de: 'Spanien' }, brackets: [{ min: 0, max: 12450, rate: 19 }, { min: 12450, max: 20200, rate: 24 }, { min: 20200, max: 35200, rate: 30 }, { min: 35200, max: 60000, rate: 37 }, { min: 60000, max: 300000, rate: 45 }, { min: 300000, max: Infinity, rate: 47 }] },
]

const PY_BRACKETS = [
  { min: 0, max: 7434, rate: 0 },
  { min: 7434, max: 11285, rate: 8 },
  { min: 11285, max: 17902, rate: 10 },
  { min: 17902, max: Infinity, rate: 10 },
]

function calculateProgressiveTax(income: number, brackets: Array<{ min: number; max: number; rate: number }>): number {
  let tax = 0
  let remaining = income
  for (const bracket of brackets) {
    if (remaining <= 0) break
    const taxableInBracket = Math.min(remaining, bracket.max - bracket.min)
    if (income > bracket.min) {
      const taxedAmount = Math.min(income, bracket.max) - bracket.min
      tax += Math.max(0, taxedAmount) * (bracket.rate / 100)
    }
    remaining -= taxableInBracket
  }
  return tax
}

const LABELS: Record<string, { eyebrow: string; title: string; subtitle: string; currentCountry: string; income: string; incomeType: string; source: string; sourceLocal: string; sourceForeign: string; currentTax: string; pyTax: string; savings: string; fiveYear: string; disclaimer: string; cta: string }> = {
  en: { eyebrow: 'Calculator', title: 'How much could YOU save?', subtitle: 'Enter your income and compare your personal tax burden before and after relocating to Paraguay.', currentCountry: 'Current country', income: 'Annual income (EUR)', incomeType: 'Income type', source: 'Income source?', sourceLocal: 'Working in Paraguay', sourceForeign: 'Remote / foreign', currentTax: 'Current tax', pyTax: 'Paraguay tax', savings: 'Annual SAVINGS', fiveYear: '5-Year savings', disclaimer: 'Estimates only. Real tax depends on double-tax treaties, residency status, and personal circumstances. Consult a tax advisor.', cta: 'Talk to us' },
  es: { eyebrow: 'Calculadora', title: '¿Cuánto PODRÍA ganar?', subtitle: 'Ingrese su income y Compare su carga fiscal personal antes y después de mudarse a Paraguay.', currentCountry: 'País actual', income: 'Ingreso anual (EUR)', incomeType: 'Tipo de ingreso', source: '¿Fuente del ingreso?', sourceLocal: 'Trabajando en PY', sourceForeign: 'Remoto / extranjero', currentTax: 'Impuesto actual', pyTax: 'Impuesto en PY', savings: 'AHORRO anual', fiveYear: 'Ahorro 5 años', disclaimer: 'Estimaciones only. El impuesto real depende de tratados, residencia y circunstancias. Consulte un asesor.', cta: 'Hable con nosotros' },
  nl: { eyebrow: 'Rekenmachine', title: 'Hoeveel kunt U BESPAREN?', subtitle: 'Voer uw inkomen in en vergelijk uw persoonlijke belastingdruk vóór en na verhuizing naar Paraguay.', currentCountry: 'Huidig land', income: 'Jaarlijks inkomen (EUR)', incomeType: 'Inkomens_type', source: 'Inkomensbron?', sourceLocal: 'Werkend in PY', sourceForeign: 'Externationaal', currentTax: 'Huidige belasting', pyTax: 'Belasting PY', savings: 'JAARLIJKSE BESPARING', fiveYear: '5 jaar besparing', disclaimer: 'Schattingen alleen. Werkelijke belasting hangt af van verdragen en omstandigheden. Raadpleeg een adviseur.', cta: 'Praat met ons' },
  de: { eyebrow: 'Rechner', title: 'Wie viel KÖNNEN Sie SPAREN?', subtitle: 'Geben Sie Ihr Einkommen ein und vergleichen Sie Ihre persönliche Steuerlast vor und nach dem Umzug nach Paraguay.', currentCountry: 'Aktuelles Land', income: 'Jährliches Einkommen (EUR)', incomeType: 'Einkommenstyp', source: 'Einkommensquelle?', sourceLocal: 'Arbeitend in PY', sourceForeign: 'International', currentTax: 'Aktuelle Steuer', pyTax: 'Steuer PY', savings: 'JÄHRLICHE ERSPARNIS', fiveYear: '5-Jahres-Ersparnis', disclaimer: 'Nur Schätzungen. Tatsächliche Steuer hängt von Verträgen ab. Konsultieren Sie einen Berater.', cta: 'Sprechen Sie mit uns' },
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n)))
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n)))
}

export function TaxSavingsCalculator({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref = '#contacto',
  __locale = 'en',
}: TaxSavingsCalculatorProps) {
  const L = LABELS[__locale] || LABELS.en

  const [countryCode, setCountryCode] = useState('NL')
  const [income, setIncome] = useState<number>(60000)
  const [incomeType, setIncomeType] = useState<'employment' | 'freelance' | 'business' | 'pension'>('employment')
  const [source, setSource] = useState<'local' | 'foreign'>('foreign')

  const country = useMemo(() => COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0], [countryCode])

  const currentTax = useMemo(() => {
    let baseTax = calculateProgressiveTax(income, country.brackets)
    if (countryCode === 'DE') baseTax *= 1.055
    return baseTax
  }, [income, country, countryCode])

  const paraguayTax = useMemo(() => {
    const eurToUsd = 1.08
    const incomeUSD = income * eurToUsd
    let pyTax = calculateProgressiveTax(incomeUSD, PY_BRACKETS)
    if (source === 'foreign') {
      pyTax = 0
    }
    return pyTax
  }, [income, source])

  const savings = currentTax - (paraguayTax / 1.08)
  const fiveYear = savings * 5

  const resolvedEyebrow = eyebrow || L.eyebrow
  const resolvedTitle = title || L.title
  const resolvedSubtitle = subtitle || L.subtitle
  const resolvedCtaLabel = ctaLabel || L.cta

  const [showLeadModal, setShowLeadModal] = useState(false)

  return (
    <section className="bg-surface-light py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">{resolvedEyebrow}</p>
          <Heading level={2}>{resolvedTitle}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{resolvedSubtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">{L.currentCountry}</span>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name[__locale] || c.name.en}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">{L.income}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={5000}
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">{L.incomeType}</span>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value as typeof incomeType)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
                >
                  <option value="employment">{__locale === 'es' ? 'Empleado' : __locale === 'de' ? 'Angestellt' : __locale === 'nl' ? 'Werknemer' : 'Employee'}</option>
                  <option value="freelance">{__locale === 'es' ? 'Freelance' : __locale === 'de' || __locale === 'nl' ? 'Freelancer' : 'Freelance'}</option>
                  <option value="business">{__locale === 'es' ? 'Dueño de negocio' : __locale === 'de' ? 'Unternehmer' : __locale === 'nl' ? 'Ondernemer' : 'Business owner'}</option>
                  <option value="pension">{__locale === 'es' ? 'Jubilado' : __locale === 'de' ? 'Rentner' : __locale === 'nl' ? 'Gepensioneerde' : 'Pensioner'}</option>
                </select>
              </label>

              <fieldset className="block">
                <legend className="mb-2 block text-sm font-medium text-foreground">{L.source}</legend>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm">
                    <input type="radio" name="income-source" value="foreign" checked={source === 'foreign'} onChange={() => setSource('foreign')} />
                    <span>{L.sourceForeign}</span>
                  </label>
                  <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm">
                    <input type="radio" name="income-source" value="local" checked={source === 'local'} onChange={() => setSource('local')} />
                    <span>{L.sourceLocal}</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col justify-center rounded-xl bg-surface-light p-6">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{L.currentTax}</dt>
                  <dd className="text-xl font-semibold text-foreground">{formatEUR(currentTax)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{L.pyTax}</dt>
                  <dd className="text-xl font-semibold text-foreground">€{formatUSD(paraguayTax).replace('$', '')}</dd>
                </div>
                <div className="border-t border-border pt-4">
                  <dt className="text-xs uppercase tracking-wider text-secondary">{L.savings}</dt>
                  <dd className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatEUR(savings)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{L.fiveYear}</dt>
                  <dd className="text-lg font-semibold text-foreground">{formatEUR(fiveYear)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{L.disclaimer}</p>

          <div className="mt-6 flex justify-center">
            <Button variant="primary" size="lg" href={ctaHref} style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }}>
              {resolvedCtaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}