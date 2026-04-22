'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

interface DocumentChecklistProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  __locale?: string
}

type DocStatus = 'pending' | 'in_progress' | 'ready' | 'submitted'

interface Doc {
  id: string
  name: { es: string; en: string }
  required: boolean
  legalization: string
  weeks: number
}

const DOCUMENTS: Doc[] = [
  { id: 'passport', name: { es: 'Pasaporte válido (6+ meses)', en: 'Valid passport (6+ months)' }, required: true, legalization: 'None', weeks: 0 },
  { id: 'birthCert', name: { es: 'Certificado de nacimiento', en: 'Birth certificate' }, required: true, legalization: 'Apostille', weeks: 2 },
  { id: 'criminalRecord', name: { es: 'Antecedentes penales', en: 'Criminal background check' }, required: true, legalization: 'Apostille', weeks: 2 },
  { id: 'photos', name: { es: 'Fotos 4x4 fondo blanco', en: 'Photos 4x4 white background' }, required: true, legalization: 'None', weeks: 0 },
  { id: 'bankStatement', name: { es: 'Estado de cuenta bancario', en: 'Bank statement' }, required: true, legalization: 'Notarized', weeks: 1 },
  { id: 'marriageCert', name: { es: 'Certificado de matrimonio', en: 'Marriage certificate' }, required: false, legalization: 'Apostille', weeks: 2 },
]

const LABELS: Record<string, { eyebrow: string; title: string; subtitle: string; status: string; weeks: string; progress: string }> = {
  en: { eyebrow: 'Checklist', title: 'Your Document Checklist', subtitle: 'Track your residency documents. Check off items as you complete them.', status: 'Status', weeks: 'Est. time', progress: 'Progress' },
  es: { eyebrow: 'Lista', title: 'Tu Lista de Documentos', subtitle: 'Rastrea tus documentos de residencia. Marca los elementos al completarlos.', status: 'Estado', weeks: 'Tiempo est.', progress: 'Progreso' },
  nl: { eyebrow: 'Checklist', title: 'Uw Document Checklist', subtitle: 'Volg uw verblijfsdocumenten. Vink items af.', status: 'Status', weeks: 'Schatting', progress: 'Voortgang' },
  de: { eyebrow: 'Checkliste', title: 'Ihre Dokumentenliste', subtitle: 'Verfolgen Sie Ihre Aufenthaltsdokumente. Items abhaken.', status: 'Status', weeks: 'Zeit', progress: 'Fortschritt' },
}

const STATUS_LABELS: Record<string, Record<DocStatus, string>> = {
  en: { pending: 'Pending', in_progress: 'In Progress', ready: 'Ready', submitted: 'Submitted' },
  es: { pending: 'Pendiente', in_progress: 'En Proceso', ready: 'Listo', submitted: 'Enviado' },
  nl: { pending: 'In afwachting', in_progress: 'In behandeling', ready: 'Klaar', submitted: 'Ingediend' },
  de: { pending: 'Ausstehend', in_progress: 'In Bearbeitung', ready: 'Bereit', submitted: 'Eingereicht' },
}

export function DocumentChecklist({ eyebrow, title, subtitle, __locale = 'en' }: DocumentChecklistProps) {
  const [docs, setDocs] = useState<Record<string, DocStatus>>(() => {
    const initial: Record<string, DocStatus> = {}
    DOCUMENTS.forEach((d) => { initial[d.id] = 'pending' })
    return initial
  })

  const L = LABELS[__locale] || LABELS.en

  const statusColors: Record<DocStatus, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-green-100 text-green-700',
    submitted: 'bg-blue-100 text-blue-700',
  }

  const statusOptions: DocStatus[] = ['pending', 'in_progress', 'ready', 'submitted']

  const toggleStatus = (docId: string) => {
    const current = docs[docId]
    const idx = statusOptions.indexOf(current)
    setDocs((prev) => ({ ...prev, [docId]: statusOptions[(idx + 1) % statusOptions.length] }))
  }

  const requiredDocs = DOCUMENTS.filter(d => d.required)
  const readyCount = Object.values(docs).filter(s => s === 'ready' || s === 'submitted').length
  const progress = Math.round((readyCount / requiredDocs.length) * 100)

  const SL = STATUS_LABELS[__locale] || STATUS_LABELS.en

  return (
    <section className="bg-[var(--surface)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow || L.eyebrow}</p>
          <Heading level={2}>{title || L.title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle || L.subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface-light)] p-6 shadow-card sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">{L.progress}</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div className="h-full rounded-full bg-[var(--secondary)] transition-all" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="space-y-3">
            {DOCUMENTS.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
                <button onClick={() => toggleStatus(doc.id)} className={`flex h-6 w-6 items-center justify-center rounded border ${docs[doc.id] === 'ready' || docs[doc.id] === 'submitted' ? 'border-green-500 bg-green-500 text-white' : 'border-[var(--border)]'}`}>
                  {(docs[doc.id] === 'ready' || docs[doc.id] === 'submitted') && '✓'}
                </button>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text)]">{doc.name[__locale] || doc.name.en}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {doc.legalization !== 'None' && `${doc.legalization} • `}{L.weeks}: {doc.weeks === 0 ? '1 day' : `${doc.weeks} weeks`}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[docs[doc.id]]}`}>
                  {SL[docs[doc.id]]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}