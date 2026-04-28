'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import type { BaseCalculatorSectionProps } from '@/types/sections'

/**
 * Interactive tax-savings calculator for European prospects considering
 * Paraguay's territorial tax system.
 *
 * Model: headline corporate tax rate of user's home country vs Paraguay's
 *        effective corporate rate (10% on locally-sourced income,
 *        0% on foreign-sourced income under territorial system).
 *
 * This is marketing-grade — it shows ORDERS OF MAGNITUDE for
 * conversation-starting, NOT a tax-advisory calculation. We explicitly
 * disclaim that real cases depend on double-tax treaties, actual income
 * sourcing, residency timing, and local legal advice. The goal is to
 * hook the prospect into a consultation, not replace their accountant.
 */

export interface TaxSavingsCalculatorSectionProps extends BaseCalculatorSectionProps {
  /** Locale-keyed UI labels. Falls back to LABELS constant when omitted. */
  labels?: Record<string, {
    eyebrow: string
    title: string
    subtitle: string
    countryLabel: string
    incomeLabel: string
    sourceLabel: string
    sourceLocal: string
    sourceForeign: string
    currentTax: string
    paraguayTax: string
    annualSavings: string
    disclaimer: string
    cta: string
  }>
}

type CountryPreset = {
  code: string
  /** Localized display name — the map picks it per-locale. */
  name: Record<string, string>
  /** Representative corporate tax rate (%). Rounded to the nearest point. */
  corpRate: number
}

// Representative headline corporate rates as of early 2026.
// Sources checked at commit time: OECD tax database, government publications.
// These are approximations intended for a "ballpark savings" calculator,
// not legal advice. Always encourage the user to confirm with their accountant.
const COUNTRIES: CountryPreset[] = [
  { code: 'DE', name: { es: 'Alemania', en: 'Germany', nl: 'Duitsland', de: 'Deutschland', pt: 'Alemanha' }, corpRate: 30 },
  { code: 'NL', name: { es: 'Países Bajos', en: 'Netherlands', nl: 'Nederland', de: 'Niederlande', pt: 'Países Baixos' }, corpRate: 25 },
  { code: 'FR', name: { es: 'Francia', en: 'France', nl: 'Frankrijk', de: 'Frankreich', pt: 'França' }, corpRate: 25 },
  { code: 'IT', name: { es: 'Italia', en: 'Italy', nl: 'Italië', de: 'Italien', pt: 'Itália' }, corpRate: 24 },
  { code: 'ES', name: { es: 'España', en: 'Spain', nl: 'Spanje', de: 'Spanien', pt: 'Espanha' }, corpRate: 25 },
  { code: 'SE', name: { es: 'Suecia', en: 'Sweden', nl: 'Zweden', de: 'Schweden', pt: 'Suécia' }, corpRate: 21 },
  { code: 'AT', name: { es: 'Austria', en: 'Austria', nl: 'Oostenrijk', de: 'Österreich', pt: 'Áustria' }, corpRate: 23 },
  { code: 'BE', name: { es: 'Bélgica', en: 'Belgium', nl: 'België', de: 'Belgien', pt: 'Bélgica' }, corpRate: 25 },
  { code: 'CH', name: { es: 'Suiza', en: 'Switzerland', nl: 'Zwitserland', de: 'Schweiz', pt: 'Suíça' }, corpRate: 15 },
  { code: 'UK', name: { es: 'Reino Unido', en: 'United Kingdom', nl: 'Verenigd Koninkrijk', de: 'Vereinigtes Königreich', pt: 'Reino Unido' }, corpRate: 25 },
]

const PARAGUAY_RATE_LOCAL = 10 // corporate tax on locally-sourced income
const PARAGUAY_RATE_FOREIGN = 0 // territorial system: foreign-sourced income exempt

type Labels = {
  eyebrow: string
  title: string
  subtitle: string
  countryLabel: string
  incomeLabel: string
  sourceLabel: string
  sourceLocal: string
  sourceForeign: string
  currentTax: string
  paraguayTax: string
  annualSavings: string
  disclaimer: string
  cta: string
}

const LABELS: Record<string, Labels> = {
  de: {
    eyebrow: 'Rechner',
    title: 'Wie viel könnten Sie mit Paraguay sparen?',
    subtitle: 'Wählen Sie Ihr Herkunftsland, geben Sie ein typisches Jahreseinkommen ein, und vergleichen Sie die Steuerlast vor und nach dem Umzug.',
    countryLabel: 'Ihr aktuelles Land',
    incomeLabel: 'Jährliches Unternehmenseinkommen (USD)',
    sourceLabel: 'Wo entsteht das Einkommen?',
    sourceLocal: 'Hauptsächlich in Paraguay',
    sourceForeign: 'Hauptsächlich außerhalb Paraguays',
    currentTax: 'Aktuelle Steuerlast (≈)',
    paraguayTax: 'Paraguayische Steuerlast (≈)',
    annualSavings: 'Jährliche Ersparnis (≈)',
    disclaimer: 'Nur zu Illustrationszwecken. Reale Steuerlast hängt von Doppelbesteuerungsabkommen, Ansässigkeit und lokaler Beratung ab. Kein Steuergutachten.',
    cta: 'Mit einem Berater sprechen',
  },
  en: {
    eyebrow: 'Calculator',
    title: 'How much could you save with Paraguay?',
    subtitle: 'Pick your current country, enter a typical annual income, and compare the tax burden before and after relocation.',
    countryLabel: 'Your current country',
    incomeLabel: 'Annual company income (USD)',
    sourceLabel: 'Where is the income earned?',
    sourceLocal: 'Mostly in Paraguay',
    sourceForeign: 'Mostly outside Paraguay',
    currentTax: 'Current tax burden (≈)',
    paraguayTax: 'Paraguay tax burden (≈)',
    annualSavings: 'Annual savings (≈)',
    disclaimer: 'For illustration only. Real tax depends on double-taxation treaties, sourcing rules, residency, and local advice. Not a tax opinion.',
    cta: 'Talk to an advisor',
  },
  es: {
    eyebrow: 'Calculadora',
    title: '¿Cuánto podría ahorrar con Paraguay?',
    subtitle: 'Elija su país actual, ingrese un ingreso anual típico, y compare la carga fiscal antes y después de la reubicación.',
    countryLabel: 'Su país actual',
    incomeLabel: 'Ingreso anual de la empresa (USD)',
    sourceLabel: '¿Dónde se genera el ingreso?',
    sourceLocal: 'Principalmente en Paraguay',
    sourceForeign: 'Principalmente fuera de Paraguay',
    currentTax: 'Carga fiscal actual (≈)',
    paraguayTax: 'Carga fiscal en Paraguay (≈)',
    annualSavings: 'Ahorro anual (≈)',
    disclaimer: 'Solo ilustrativo. La carga real depende de tratados para evitar doble imposición, fuente de los ingresos, residencia y asesoría local. No es una opinión fiscal.',
    cta: 'Hablar con un asesor',
  },
  nl: {
    eyebrow: 'Calculator',
    title: 'Hoeveel zou u kunnen besparen met Paraguay?',
    subtitle: 'Kies uw huidige land, voer een typisch jaarinkomen in, en vergelijk de belastingdruk voor en na verhuizing.',
    countryLabel: 'Uw huidige land',
    incomeLabel: 'Jaarlijks bedrijfsinkomen (USD)',
    sourceLabel: 'Waar wordt het inkomen verdiend?',
    sourceLocal: 'Voornamelijk in Paraguay',
    sourceForeign: 'Voornamelijk buiten Paraguay',
    currentTax: 'Huidige belastingdruk (≈)',
    paraguayTax: 'Belastingdruk Paraguay (≈)',
    annualSavings: 'Jaarlijkse besparing (≈)',
    disclaimer: 'Alleen ter illustratie. Werkelijke belasting hangt af van belastingverdragen, herkomst van het inkomen, verblijf en lokaal advies. Geen fiscaal advies.',
    cta: 'Praat met een adviseur',
  },
  pt: {
    eyebrow: 'Calculadora',
    title: 'Quanto você poderia economizar com o Paraguai?',
    subtitle: 'Escolha seu país atual, insira uma renda anual típica e compare a carga fiscal antes e depois da realocação.',
    countryLabel: 'Seu país atual',
    incomeLabel: 'Renda anual da empresa (USD)',
    sourceLabel: 'Onde a renda é gerada?',
    sourceLocal: 'Principalmente no Paraguai',
    sourceForeign: 'Principalmente fora do Paraguai',
    currentTax: 'Carga fiscal atual (≈)',
    paraguayTax: 'Carga fiscal no Paraguai (≈)',
    annualSavings: 'Economia anual (≈)',
    disclaimer: 'Apenas ilustrativo. A carga real depende de tratados, fonte da renda, residência e aconselhamento local. Não é uma opinião fiscal.',
    cta: 'Falar com um consultor',
  },
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)))
}

export function TaxSavingsCalculatorSection({
  eyebrow,
  title,
  subtitle,
  disclaimer,
  ctaLabel,
  ctaHref = '#contacto',
  __locale,
  labels: labelsProp,
}: TaxSavingsCalculatorSectionProps) {
  const resolvedLabels = labelsProp ?? LABELS
  const locale = __locale && __locale in resolvedLabels ? __locale : 'es'
  const L = resolvedLabels[locale]

  const [countryCode, setCountryCode] = useState<string>('DE')
  const [income, setIncome] = useState<number>(200_000)
  const [source, setSource] = useState<'local' | 'foreign'>('foreign')

  const country = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0],
    [countryCode],
  )

  const currentTax = income * (country.corpRate / 100)
  const paraguayRate = source === 'foreign' ? PARAGUAY_RATE_FOREIGN : PARAGUAY_RATE_LOCAL
  const paraguayTax = income * (paraguayRate / 100)
  const annualSavings = currentTax - paraguayTax

  const resolvedEyebrow = eyebrow || L.eyebrow
  const resolvedTitle = title || L.title
  const resolvedSubtitle = subtitle || L.subtitle
  const resolvedDisclaimer = disclaimer || L.disclaimer
  const resolvedCtaLabel = ctaLabel || L.cta

  return (
    <Section fullWidth spacing="lg" background="surface-light" className="bg-secondary text-white font-heading text-primary">
      <Container>
        <AnimatedSectionHeader>
          <p className="bg-secondary text-white font-heading text-primary mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
            {resolvedEyebrow}
          </p>
          <Heading level={2}>{resolvedTitle}</Heading>
          <p className="bg-secondary text-white font-heading text-primary mx-auto mt-4 max-w-2xl text-muted-foreground">{resolvedSubtitle}</p>
        </AnimatedSectionHeader>

        <CalcCard>
          <div className="bg-secondary text-white font-heading text-primary grid gap-6 md:grid-cols-2">
            {/* Inputs */}
            <div className="bg-secondary text-white font-heading text-primary space-y-5">
              <label className="bg-secondary text-white font-heading text-primary block">
                <span className="bg-secondary text-white font-heading text-primary mb-2 block text-sm font-medium text-foreground">{L.countryLabel}</span>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-secondary text-white font-heading text-primary w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name[locale] || c.name.en} ({c.corpRate}%)
                    </option>
                  ))}
                </select>
              </label>

              <label className="bg-secondary text-white font-heading text-primary block">
                <span className="bg-secondary text-white font-heading text-primary mb-2 block text-sm font-medium text-foreground">{L.incomeLabel}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={10_000}
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
                  className="bg-secondary text-white font-heading text-primary w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none"
                />
              </label>

              <fieldset className="bg-secondary text-white font-heading text-primary block">
                <legend className="bg-secondary text-white font-heading text-primary mb-2 block text-sm font-medium text-foreground">{L.sourceLabel}</legend>
                <div className="bg-secondary text-white font-heading text-primary flex flex-col gap-2 sm:flex-row">
                  <label className="bg-secondary text-white font-heading text-primary flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm">
                    <input type="radio" name="tax-source" value="foreign" checked={source === 'foreign'} onChange={() => setSource('foreign')} />
                    <span>{L.sourceForeign}</span>
                  </label>
                  <label className="bg-secondary text-white font-heading text-primary flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm">
                    <input type="radio" name="tax-source" value="local" checked={source === 'local'} onChange={() => setSource('local')} />
                    <span>{L.sourceLocal}</span>
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Results */}
            <div className="bg-secondary text-white font-heading text-primary flex flex-col justify-center rounded-xl bg-surface-light p-6">
              <dl className="bg-secondary text-white font-heading text-primary space-y-4">
                <div>
                  <dt className="bg-secondary text-white font-heading text-primary text-xs uppercase tracking-wider text-muted-foreground">{L.currentTax}</dt>
                  <dd className="bg-secondary text-white font-heading text-primary text-xl font-semibold text-foreground">{formatUSD(currentTax)}</dd>
                </div>
                <div>
                  <dt className="bg-secondary text-white font-heading text-primary text-xs uppercase tracking-wider text-muted-foreground">{L.paraguayTax}</dt>
                  <dd className="bg-secondary text-white font-heading text-primary text-xl font-semibold text-foreground">{formatUSD(paraguayTax)}</dd>
                </div>
                <div className="bg-secondary text-white font-heading text-primary border-t border-border pt-4">
                  <dt className="bg-secondary text-white font-heading text-primary text-xs uppercase tracking-wider text-secondary">{L.annualSavings}</dt>
                  <dd
                    className="bg-secondary text-white font-heading text-primary text-xl sm:text-3xl font-bold"
                   
                  >
                    {formatUSD(annualSavings)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="bg-secondary text-white font-heading text-primary mt-6 text-xs leading-relaxed text-muted-foreground">
            {resolvedDisclaimer}
          </p>

          <div className="bg-secondary text-white font-heading text-primary mt-6 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              href={ctaHref}
             
            >
              {resolvedCtaLabel}
            </Button>
          </div>
        </CalcCard>
      </Container>
    </Section>
  )
}
