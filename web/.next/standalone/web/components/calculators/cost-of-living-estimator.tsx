'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

interface CostOfLivingEstimatorProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  ctaLabel?: string
  __locale?: string
}

const NEIGHBORHOODS = [
  { id: 'villa-morra', name: { es: 'Villa Morra', en: 'Villa Morra' }, rent2br: [800, 1500], familyScore: 9 },
  { id: 'carmelitas', name: { es: 'Carmelitas', en: 'Carmelitas' }, rent2br: [600, 1200], familyScore: 7 },
  { id: 'recoleta', name: { es: 'Recoleta', en: 'Recoleta' }, rent2br: [500, 900], familyScore: 8 },
  { id: 'las-mercedes', name: { es: 'Las Mercedes', en: 'Las Mercedes' }, rent2br: [1000, 2000], familyScore: 9 },
  { id: 'maria-auxiliadora', name: { es: 'María Auxiliadora', en: 'María Auxiliadora' }, rent2br: [350, 600], familyScore: 7 },
  { id: 'manuel-guerreño', name: { es: 'Manuel Gueñu', en: 'Manuel Gueñu' }, rent2br: [450, 800], familyScore: 8 },
]

const SCHOOLS = [
  { id: 'american', name: 'American School', annualFee: [12000, 25000] },
  { id: 'british', name: 'British School', annualFee: [10000, 22000] },
  { id: 'european', name: 'Colegio Europeo', annualFee: [8000, 18000] },
  { id: 'public', name: 'Public Schools', annualFee: [0, 500] },
]

const BUDGET_PROFILES = {
  single: { rent: 40, utilities: 8, food: 20, transport: 10, dining: 10, misc: 12 },
  couple: { rent: 35, utilities: 6, food: 18, transport: 8, dining: 8, misc: 15 },
  family2: { rent: 35, utilities: 5, food: 18, transport: 6, dining: 6, education: 12, misc: 13 },
  family3: { rent: 33, utilities: 4, food: 17, transport: 5, dining: 5, education: 16, misc: 15 },
}

const LABELS: Record<string, { eyebrow: string; title: string; subtitle: string; household: string; neighborhood: string; children: string; school: string; lifestyle: string; currentCity: string; budget: string; breakdown: string; vsCity: string; cta: string }> = {
  en: { eyebrow: 'Budget Planner', title: 'Your Monthly Budget in Asunción', subtitle: 'Plan your cost of living in Paraguay\'s capital. See real prices for housing, schools, and daily life.', household: 'Household type', neighborhood: 'Neighborhood', children: 'Children', school: 'International school', lifestyle: 'Lifestyle', currentCity: 'Compare with', budget: 'Recommended budget', breakdown: 'Monthly breakdown', vsCity: 'vs Amsterdam', cta: 'Get Full Report' },
  es: { eyebrow: 'Planificador', title: 'Tu Presupuesto Mensual en Asunción', subtitle: 'Planifica tu costo de vida en la capital paraguaya. Ve precios reales para vivienda, escuelas y vida diaria.', household: 'Tipo de hogar', neighborhood: 'Barrio', children: 'Hijos', school: 'Escuela internacional', lifestyle: 'Estilo de vida', currentCity: 'Comparar con', budget: 'Presupuesto recomendado', breakdown: 'Desglose mensual', vsCity: 'vs Ámsterdam', cta: 'Obtener Informe' },
  nl: { eyebrow: 'Budget planner', title: 'Uw Maandelijkse Budget in Asunción', subtitle: 'Plan uw levensonderhoud in de Paraguayaanse hoofdstad. Zie actuele prijzen voor woning, scholen en het dagelijks leven.', household: 'Huishouden', neighborhood: 'Buurt', children: 'Kinderen', school: 'Internationale school', lifestyle: 'Levensstijl', currentCity: 'Vergelijk met', budget: 'Aanbevolen budget', breakdown: 'Maandelijkse opdeling', vsCity: 'vs Amsterdam', cta: 'Volledig Rapport' },
  de: { eyebrow: 'Budget-Planer', title: 'Ihr Monatsbudget in Asunción', subtitle: 'Planen Sie Ihre Lebenshaltungskosten in der paraguayischen Hauptstadt. Sehen Sie aktuelle Preise für Wohnen, Schulen und Alltag.', household: 'Haushaltstyp', neighborhood: 'Stadtviertel', children: 'Kinder', school: 'Internationale Schule', lifestyle: 'Lebensstil', currentCity: 'Vergleichen mit', budget: 'Empfohlenes Budget', breakdown: 'Monatliche Aufschlüsselung', vsCity: 'vs Amsterdam', cta: 'Vollständiger Bericht' },
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function CostOfLivingEstimator({ eyebrow, title, subtitle, __locale = 'en' }: CostOfLivingEstimatorProps) {
  const L = LABELS[__locale as 'es' | 'en'] || LABELS.en

  const [household, setHousehold] = useState<'single' | 'couple' | 'family2' | 'family3'>('couple')
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOODS[0].id)
  const [children, setChildren] = useState(0)
  const [schoolId, setSchoolId] = useState(SCHOOLS[3].id)
  const [lifestyle, setLifestyle] = useState<'budget' | 'standard' | 'premium'>('standard')

  const currentNeighborhood = useMemo(() => NEIGHBORHOODS.find((n) => n.id === neighborhood) || NEIGHBORHOODS[0], [neighborhood])
  const currentSchool = useMemo(() => SCHOOLS.find((s) => s.id === schoolId) || SCHOOLS[0], [schoolId])

  const rent = useMemo(() => {
    const idx = household === 'single' ? 0 : household === 'couple' ? 0 : household === 'family2' ? 1 : 1
    return currentNeighborhood.rent2br[idx] as unknown as [number, number]
  }, [currentNeighborhood, household])

  const rentMonthly = (rent[0] + rent[1]) / 2

  const schoolCost = children > 0 ? (currentSchool.annualFee[0] + currentSchool.annualFee[1]) / 2 / 12 : 0

  const multipliers = { budget: 0.8, standard: 1, premium: 1.4 }
  const baseMult = multipliers[lifestyle]

  const budget = useMemo(() => {
    const breakdown = BUDGET_PROFILES[household]
    const totalBase = rentMonthly + schoolCost
    const otherPct = Object.values(breakdown).reduce((a, b) => a + b, 0) - breakdown.rent - ((breakdown as { education?: number }).education || 0)
    const total = totalBase + (totalBase * otherPct / 100) * baseMult
    return total
  }, [rentMonthly, schoolCost, household, baseMult])

  const breakdownValues = useMemo(() => {
    const breakdown = BUDGET_PROFILES[household]
    return {
      rent: budget * (breakdown.rent / 100),
      utilities: budget * (breakdown.utilities / 100),
      food: budget * (breakdown.food / 100),
      transport: budget * (breakdown.transport / 100),
      dining: budget * (breakdown.dining / 100),
      education: (breakdown as { education?: number }).education ? budget * ((breakdown as { education?: number }).education! / 100) : 0,
      misc: budget * (breakdown.misc / 100),
    }
  }, [budget, household])

  const vsAmsterdam = budget * 2.4

  return (
    <section className="bg-[var(--surface)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow || L.eyebrow}</p>
          <Heading level={2}>{title || L.title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle || L.subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--surface-light)] p-6 shadow-card sm:p-10">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--text)]">{L.household}</span>
                  <select
                    value={household}
                    onChange={(e) => setHousehold(e.target.value as typeof household)}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base"
                  >
                    <option value="single">{__locale === 'es' ? 'Solo' : __locale === 'de' ? 'Alleinstehend' : __locale === 'nl' ? 'Alleenstaand' : 'Single'}</option>
                    <option value="couple">{__locale === 'es' ? 'Pareja' : __locale === 'de' ? 'Paar' : __locale === 'nl' ? 'Paar' : 'Couple'}</option>
                    <option value="family2">{__locale === 'es' ? 'Familia (2 adultos)' : __locale === 'de' ? 'Familie (2 Erwachsene)' : __locale === 'nl' ? 'Gezin (2 volwassenen)' : 'Family (2 adults)'}</option>
                    <option value="family3">{__locale === 'es' ? 'Familia (3+)' : __locale === 'de' ? 'Familie (3+)' : __locale === 'nl' ? 'Gezin (3+)' : 'Family (3+)'}</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--text)]">{L.neighborhood}</span>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base"
                  >
                    {NEIGHBORHOODS.map((n) => (
                      <option key={n.id} value={n.id}>{n.name[__locale as 'es' | 'en'] || n.name.en}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--text)]">{L.children}</span>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, Math.min(5, Number(e.target.value))))}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base"
                  />
                </label>

                {children > 0 && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[var(--text)]">{L.school}</span>
                    <select
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base"
                    >
                      {SCHOOLS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--text)]">{L.lifestyle}</span>
                  <select
                    value={lifestyle}
                    onChange={(e) => setLifestyle(e.target.value as typeof lifestyle)}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base"
                  >
                    <option value="budget">{__locale === 'es' ? 'Económico' : __locale === 'de' ? 'Budget' : __locale === 'nl' ? 'Budget' : 'Budget'}</option>
                    <option value="standard">{__locale === 'es' ? 'Estándar' : __locale === 'de' ? 'Standard' : __locale === 'nl' ? 'Standaard' : 'Standard'}</option>
                    <option value="premium">{__locale === 'es' ? 'Premium' : __locale === 'de' || __locale === 'nl' || 'en' ? 'Premium' : 'Premium'}</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-[var(--surface)] p-5">
                <p className="text-sm text-[var(--text-muted)]">{L.budget}</p>
                <p className="text-3xl font-bold text-[var(--primary)]">{formatUSD(budget)}</p>
                <p className="text-xs text-[var(--text-muted)]">/month</p>
              </div>

              <div className="rounded-xl bg-[var(--surface)] p-5">
                <p className="text-sm text-[var(--text-muted)]">{L.vsCity}</p>
                <p className="text-xl font-semibold text-[var(--text)]">{formatUSD(vsAmsterdam)}</p>
                <p className="text-xs text-green-600">{__locale === 'es' ? 'Ahorras' : __locale === 'de' ? 'Sie sparen' : __locale === 'nl' ? 'Je bespaart' : 'You save'} {formatUSD(vsAmsterdam - budget)}/mo</p>
              </div>

              <div className="space-y-2">
                {Object.entries(breakdownValues).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)] capitalize">{key}</span>
                    <span className="font-medium">{formatUSD(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}