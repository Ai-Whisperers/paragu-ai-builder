'use client'

import { useState } from 'react'
import type { BusinessContent } from '@/lib/commerce/business-content'
import { HeroEditor } from './hero-editor'
import { AboutEditor } from './about-editor'
import { TestimonialsEditor } from './testimonials-editor'
import { FaqEditor } from './faq-editor'
import { ContactEditor } from './contact-editor'

type Tab = 'hero' | 'about' | 'testimonials' | 'faq' | 'contact'

const TAB_LABELS: Record<Tab, string> = {
  hero: 'Hero',
  about: 'Sobre nosotros',
  testimonials: 'Testimonios',
  faq: 'FAQ',
  contact: 'Contacto + horarios',
}

export function ContentEditor({
  businessId,
  initialContent,
  siteSlug,
}: {
  businessId: string
  initialContent: BusinessContent
  siteSlug: string
}) {
  const [tab, setTab] = useState<Tab>('hero')

  return (
    <div>
      <nav className="mb-6 flex flex-wrap gap-2 border-b border-[color:var(--border,#e5e7eb)]">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? 'border-b-2 border-[color:var(--primary,#111)] text-[color:var(--primary,#111)]'
                : 'text-[color:var(--text-muted,#6b7280)] hover:text-[color:var(--text,#111)]'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </nav>

      {tab === 'hero' && (
        <HeroEditor businessId={businessId} initial={initialContent.hero} />
      )}
      {tab === 'about' && (
        <AboutEditor businessId={businessId} initial={initialContent.about} />
      )}
      {tab === 'testimonials' && (
        <TestimonialsEditor businessId={businessId} initial={initialContent.testimonials} />
      )}
      {tab === 'faq' && (
        <FaqEditor businessId={businessId} initial={initialContent.faq} />
      )}
      {tab === 'contact' && (
        <ContactEditor businessId={businessId} initial={initialContent.contact} />
      )}

      <p className="mt-6 text-xs text-[color:var(--text-muted,#9ca3af)]">
        Cambios guardados se reflejan en {' '}
        <a href={`/s/es/${siteSlug}`} target="_blank" rel="noreferrer" className="underline">
          paragu-ai.com/s/es/{siteSlug}
        </a>
        {' '} tras la próxima carga de página.
      </p>
    </div>
  )
}
