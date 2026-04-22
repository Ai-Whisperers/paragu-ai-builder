'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

interface TimelineEstimatorProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  __locale?: string
}

const TIMELINES = {
  temporary: {
    name: { es: 'Residencia Temporal', en: 'Temporary Residency' },
    minWeeks: 8,
    maxWeeks: 16,
    steps: [
      { name: { es: 'Preparación documental', en: 'Document preparation' }, weeks: 2 },
      { name: { es: 'Cita en inmigración', en: 'Immigration appointment' }, weeks: 2 },
      { name: { es: 'Tramitación', en: 'Processing' }, weeks: 4 },
      { name: { es: 'Emisión de residencia', en: 'Residency issuance' }, weeks: 2 },
    ],
  },
  permanent: {
    name: { es: 'Residencia Permanente', en: 'Permanent Residency' },
    minWeeks: 6,
    maxWeeks: 12,
    steps: [
      { name: { es: 'Preparación documental', en: 'Document preparation' }, weeks: 1 },
      { name: { es: 'Cita en inmigración', en: 'Immigration appointment' }, weeks: 1 },
      { name: { es: 'Tramitación', en: 'Processing' }, weeks: 4 },
      { name: { es: 'Emisión de residencia', en: 'Residency issuance' }, weeks: 2 },
    ],
  },
  suace: {
    name: { es: 'Inversionista SUACE', en: 'SUACE Investor' },
    minWeeks: 10,
    maxWeeks: 20,
    steps: [
      { name: { es: 'Preparación documental', en: 'Document preparation' }, weeks: 2 },
      { name: { es: 'Inversión en proyecto', en: 'Investment in project' }, weeks: 2 },
      { name: { es: 'Tramitación SUACE', en: 'SUACE processing' }, weeks: 6 },
      { name: { es: 'Emisión de residencia', en: 'Residency issuance' }, weeks: 4 },
    ],
  },
}

const LABELS: Record<string, { eyebrow: string; title: string; subtitle: string; residency: string; documents: string; travel: string; minimum: string; maximum: string; milestones: string; travelRequired: string; disclaimer: string }> = {
  en: { eyebrow: 'Timeline', title: 'How long does it take?', subtitle: 'See realistic timeframes for each residency pathway. Your actual timeline depends on document readiness.', residency: 'Residency type', documents: 'Documents ready?', documentsYes: 'Yes, all ready', documentsPartial: 'Partially ready', documentsNo: 'No, need to get', travel: 'Currently in home country?', minimum: 'Minimum', maximum: 'Maximum', milestones: 'Key milestones', travelRequired: 'Travel required', disclaimer: 'Timelines are estimates based on typical cases. Peak seasons may add 1-2 weeks.' },
  es: { eyebrow: 'Cronograma', title: '¿Cuánto tiempo Toma?', subtitle: 'Vea los plazos realistas para cada vía de residencia. Su cronograma real depende de la documentación.', residency: 'Tipo de residencia', documents: '¿Documentos listos?', documentsYes: 'Sí, listos', documentsPartial: 'Parcialmente', documentsNo: 'No, necesito obtener', travel: '¿Actualmente en su país?', minimum: 'Mínimo', maximum: 'Máximo', milestones: 'Hitos clave', travelRequired: 'Viaje requerido', disclaimer: 'Los plazos son estimaciones. Temporadas pico pueden agregar 1-2 semanas.' },
  nl: { eyebrow: 'Tijdslijn', title: 'Hoe lang duurt het?', subtitle: 'Zie realistische tijdschema's voor elk immigratiepad. Uw eigen tijdlijn hangt af van documenten.', residency: 'Soort verblijf', documents: 'Documenten klaar?', documentsYes: 'Ja, allemaal', documentsPartial: 'Gedeeltelijk', documentsNo: 'Nee, moeten ophalen', travel: 'Nu in thuisland?', minimum: 'Minimaal', maximum: 'Maximaal', milestones: 'Belangrijke mijlpalen', travelRequired: 'Reis vereist', disclaimer: 'Tijdslijnen zijn schattingen. Piekseizoenen kunnen 1-2 weken toevoegen.' },
  de: { eyebrow: 'Zeitplan', title: 'Wie lange dauert es?', subtitle: 'Sehen Sie realistische Zeitrahmen für jeden Aufenthaltsweg. Ihre tatsächliche Zeit hängt von Dokumenten ab.', residency: 'Aufenthaltsart', documents: 'Dokumente bereit?', documentsYes: 'Ja, alle', documentsPartial: 'Teilweise', documentsNo: 'Nein, müssen besorgen', travel: 'Derzeit im Heimatland?', minimum: 'Minimal', maximum: 'Maximal', milestones: 'Wichtige Meilensteine', travelRequired: 'Reise erforderlich', disclaimer: 'Zeitpläne sind Schätzungen. Stoßzeiten können 1-2 Wochen hinzufügen.' },
}

function formatWeeks(n: number): string {
  return n === 1 ? '1 week' : `${n} weeks`
}

function formatMonths(n: number): string {
  if (n < 1) return formatWeeks(n * 4)
  const months = Math.round(n)
  return months === 1 ? '1 month' : `${months} months`
}

export function TimelineEstimator({ eyebrow, title, subtitle, __locale = 'en' }: TimelineEstimatorProps) {
  const L = LABELS[__locale] || LABELS.en

  const [residency, setResidency] = useState<keyof typeof TIMELINES>('temporary')
  const [documents, setDocuments] = useState<'yes' | 'partial' | 'no'>('partial')
  const [inCountry, setInCountry] = useState<boolean>(true)

  const timeline = TIMELINES[residency]

  const getActualTimeline = useMemo(() => {
    let minAdj = 0
    let maxAdj = 0
    if (documents === 'partial') {
      minAdj += 1
      maxAdj += 3
    } else if (documents === 'no') {
      minAdj += 2
      maxAdj += 6
    }
    if (!inCountry) {
      maxAdj += 2
    }
    return {
      min: timeline.minWeeks + minAdj,
      max: timeline.maxWeeks + maxAdj,
    }
  }, [timeline, documents, inCountry])

  return (
    <section className="bg-[var(--surface-light)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow || L.eyebrow}</p>
          <Heading level={2}>{title || L.title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle || L.subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card sm:p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text)]">{L.residency}</span>
                <select
                  value={residency}
                  onChange={(e) => setResidency(e.target.value as typeof residency)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base"
                >
                  <option value="temporary">{TIMELINES.temporary.name[__locale] || TIMELINES.temporary.name.en}</option>
                  <option value="permanent">{TIMELINES.permanent.name[__locale] || TIMELINES.permanent.name.en}</option>
                  <option value="suace">{TIMELINES.suace.name[__locale] || TIMELINES.suace.name.en}</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--text)]">{L.documents}</span>
                <select
                  value={documents}
                  onChange={(e) => setDocuments(e.target.value as typeof documents)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base"
                >
                  <option value="yes">{L.documentsYes}</option>
                  <option value="partial">{L.documentsPartial}</option>
                  <option value="no">{L.documentsNo}</option>
                </select>
              </label>

              <fieldset className="block">
                <legend className="mb-2 block text-sm font-medium text-[var(--text)]">{L.travel}</legend>
                <div className="flex gap-2">
                  <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
                    <input type="radio" name="in-country" value="yes" checked={inCountry === true} onChange={() => setInCountry(true)} />
                    <span>{__locale === 'es' ? 'Sí' : __locale === 'de' ? 'Ja' : __locale === 'nl' ? 'Ja' : 'Yes'}</span>
                  </label>
                  <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
                    <input type="radio" name="in-country" value="no" checked={inCountry === false} onChange={() => setInCountry(false)} />
                    <span>{__locale === 'es' ? 'No' : __locale === 'de' ? 'Nein' : __locale === 'nl' ? 'Nee' : 'No'}</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center gap-8 rounded-xl bg-[var(--surface-light)] p-6">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{L.minimum}</p>
                  <p className="text-2xl font-bold text-[var(--primary)]">{formatMonths(getActualTimeline.min / 4)}</p>
                </div>
                <div className="h-10 w-px bg-[var(--border)]"></div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{L.maximum}</p>
                  <p className="text-2xl font-bold text-[var(--text)]">{formatMonths(getActualTimeline.max / 4)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[var(--text)]">{L.milestones}</p>
                {timeline.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-bold text-white">{idx + 1}</div>
                    <span className="flex-1 text-[var(--text)]">{step.name[__locale] || step.name.en}</span>
                    <span className="text-[var(--text-muted)]">{formatWeeks(step.weeks)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-[var(--text-muted)]">{L.disclaimer}</p>
        </div>
      </Container>
    </section>
  )
}