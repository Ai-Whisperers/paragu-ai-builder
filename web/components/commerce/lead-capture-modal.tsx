'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'

interface LeadCaptureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Locale to determine the guide language. */
  locale?: string
}

export function LeadCaptureModal({ open, onOpenChange, locale = 'es' }: LeadCaptureModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isSpanish = locale === 'es'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, country, source: 'investor-guide', locale, guideType: 'investor-pass-2026' }),
      })
      if (!res.ok) console.warn('Lead capture API error:', await res.text())
    } catch (err) {
      console.warn('Lead capture fetch failed:', err)
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <svg className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary">
              {isSpanish ? 'Guía enviada' : 'Guide sent!'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSpanish
                ? 'Te enviamos la Guía del Investor Pass 2026 a tu correo. Revisá tu bandeja de entrada.'
                : 'We sent the Investor Pass 2026 Guide to your email. Check your inbox.'}
            </p>
            <Button variant="primary" size="md" onClick={() => onOpenChange(false)} className="mt-6">
              {isSpanish ? 'Entendido' : 'Got it'}
            </Button>
          </div>
        </div>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary">
            {isSpanish ? 'Guía del Investor Pass 2026' : 'Investor Pass 2026 Guide'}
          </h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-surface-light hover:text-foreground"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          {isSpanish
            ? 'Descargá la guía completa con requisitos, montos, plazos y beneficios del nuevo régimen 2026.'
            : 'Download the complete guide with requirements, amounts, timelines and benefits of the new 2026 program.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label={isSpanish ? 'Nombre' : 'Name'} required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder={isSpanish ? 'Tu nombre' : 'Your name'}
            />
          </FormField>
          <FormField label="Email" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder="email@ejemplo.com"
            />
          </FormField>
          <FormField label={isSpanish ? 'País de origen' : 'Country of origin'}>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              placeholder={isSpanish ? 'Ej: Brasil, EE.UU., España' : 'e.g. Brazil, USA, Spain'}
            />
          </FormField>
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {isSpanish ? 'Descargar Guía' : 'Download Guide'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          {isSpanish
            ? 'Tus datos están seguros. No compartimos información con terceros.'
            : 'Your data is safe. We do not share information with third parties.'}
        </p>
      </div>
    </Dialog>
  )
}
