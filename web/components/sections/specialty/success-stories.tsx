'use client'
import { Section } from '@/components/ui/section'

import { useState } from 'react'
import { ArrowRight, Quote, MapPin, Calendar, TrendingUp, Users } from 'lucide-react'

type LocalizedString = Partial<Record<'es' | 'en' | 'nl' | 'de', string>>

interface Testimonial {
  id: string
  name: string
  country: string
  quote: LocalizedString
  rating: number
  before?: LocalizedString
  after?: LocalizedString
  metrics?: { label: string; value: string }[]
  program?: string
}

interface SuccessStoriesProps {
  title?: LocalizedString
  subtitle?: LocalizedString
  items: Testimonial[]
  locale?: 'es' | 'en' | 'nl' | 'de'
}

const DEFAULT_STORIES: Testimonial[] = [
  {
    id: 'janssen-family',
    name: 'Familia Janssen',
    country: 'Netherlands',
    quote: {
      es: 'Nos ayudaron con todo el proceso de residencia y la compra de nuestra propiedad. Excelente servicio desde el primer día.',
      en: 'They helped us with the entire residency process and the purchase of our property. Excellent service from day one.',
    },
    rating: 5,
    before: {
      es: 'Buscando información confusa en línea, sin saber qué documentos necesitaban',
      en: 'Searching for confusing information online, not knowing what documents they needed',
    },
    after: {
      es: 'Residencia permanente obtenida en 4 meses, propiedad en Asunción',
      en: 'Permanent residency obtained in 4 months, property in Asunción',
    },
    metrics: [
      { label: 'Timeline', value: '4 months' },
      { label: 'Savings', value: '$45K/year' },
    ],
    program: 'Business Residency',
  },
  {
    id: 'schmidt-michael',
    name: 'Michael Schmidt',
    country: 'Germany',
    quote: {
      es: 'Komplette Unterstützung bei der Firmengründung. Sehr zu empfehlen! El equipo Handles toda la documentación.',
      en: 'Complete support for company formation. Highly recommended! The team handles all documentation.',
    },
    rating: 5,
    before: {
      es: 'Preocupado por la burocracia paraguaya',
      en: 'Worried about Paraguayan bureaucracy',
    },
    after: {
      es: 'SRL operativa en 3 semanas, cuenta bancaria abierta',
      en: 'Operating SRL in 3 weeks, bank account opened',
    },
    metrics: [
      { label: 'Timeline', value: '3 weeks' },
      { label: 'Tax Savings', value: '60%' },
    ],
    program: 'Company Formation',
  },
  {
    id: 'garcia-muller',
    name: 'Familia García-Müller',
    country: 'Spain',
    quote: {
      es: 'El proceso fue mucho más sencillo de lo que esperábamos. Gracias a Nexa por hacer todo tan fácil.',
      en: 'The process was much simpler than we expected. Thanks to Nexa for making everything so easy.',
    },
    rating: 5,
    before: {
      es: 'Espera de 2 años en lista para golden visa en Portugal',
      en: '2-year wait on golden visa list in Portugal',
    },
    after: {
      es: 'Residencia temporal approved en 8 semanas',
      en: 'Temporary residency approved in 8 weeks',
    },
    metrics: [
      { label: 'Timeline', value: '8 weeks' },
      { label: 'Investment', value: '$0' },
    ],
    program: 'Temporary Residency',
  },
]

export function SuccessStories({
  title,
  subtitle,
  items = DEFAULT_STORIES,
  locale = 'es',
}: SuccessStoriesProps) {
  const [activeStory, setActiveStory] = useState(0)

  return (
    <Section fullWidth spacing="md" className="bg-gradient-to-b from-surface to-surface-light" id="testimonials">
      <div className="mx-auto  px-6">
        {title && (
          <div className="mb-12 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground">{title[locale] || title.es}</h2>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle[locale] || subtitle.es}</p>}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {items.map((story, idx) => (
              <button
                key={story.id}
                onClick={() => setActiveStory(idx)}
                className={`group w-full text-left transition-all ${
                  activeStory === idx
                    ? 'rounded-2xl border-2 border-primary bg-surface p-4'
                    : 'rounded-2xl border border-border bg-surface p-4 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{story.name}</span>
                      <span className="flex text-yellow-400">
                        {Array.from({ length: story.rating }).map((_, i) => (
                          <Quote key={i} size={12} fill="currentColor" />
                        ))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {story.country}
                    </div>
                    {story.program && (
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {story.program}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-surface p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Quote size={32} />
              </div>
              <div>
                <p className="text-lg italic text-foreground">"{items[activeStory].quote[locale] || items[activeStory].quote.es}"</p>
              </div>
            </div>

            {items[activeStory].before && items[activeStory].after && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[var(--error)]/5 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-[var(--error)]">Before</p>
                  <p className="text-sm text-foreground">{items[activeStory].before?.[locale] || items[activeStory].before?.es}</p>
                </div>
                <div className="rounded-xl bg-success/5 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-[var(--success)]">After</p>
                  <p className="text-sm text-foreground">{items[activeStory].after?.[locale] || items[activeStory].after?.es}</p>
                </div>
              </div>
            )}

            {items[activeStory].metrics && (
              <div className="flex gap-4">
                {items[activeStory].metrics?.map((metric, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-xl border border-border bg-surface-light p-3 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp size={16} className="text-[var(--success)]" />
                      <span className="text-lg font-bold text-foreground">{metric.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{items[activeStory].country}</span>
              </div>
              <a
                href="/contacto"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Get similar results
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
