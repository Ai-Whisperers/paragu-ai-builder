'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { trackLeadSubmit } from '@/lib/analytics/marketing-events'

export interface NewsletterSignupProps {
  title?: string
  subtitle?: string
  placeholder?: string
  submitLabel?: string
  successMessage?: string
  consentLabel?: string
  /** POST target — defaults to /api/newsletter. */
  submitEndpoint?: string
  tenantSlug?: string
}

export function NewsletterSignupSection({
  title = 'Recibe nuestras novedades',
  subtitle,
  placeholder = 'Tu email',
  submitLabel = 'Suscribirme',
  successMessage = 'Listo! Revisa tu correo para confirmar.',
  consentLabel = 'Acepto recibir novedades.',
  submitEndpoint = '/api/newsletter',
  tenantSlug,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'submitting' | 'ok' | 'err'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent || !email) return
    setState('submitting')
    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source: tenantSlug ? `${tenantSlug}-newsletter` : 'newsletter' }),
      })
      setState(res.ok ? 'ok' : 'err')
      trackLeadSubmit({ source: 'newsletter', success: res.ok, tenant: tenantSlug })
    } catch {
      setState('err')
      trackLeadSubmit({ source: 'newsletter', success: false, tenant: tenantSlug })
    }
  }

  return (
    <section className="py-12 bg-[var(--surface)]">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <Heading level={3}>{title}</Heading>
          {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}

          {state === 'ok' ? (
            <p className="mt-6 text-[var(--primary)] font-medium">{successMessage}</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 border border-[var(--surface-light)] rounded px-3 py-2 bg-[var(--background)]"
                />
                <Button type="submit" disabled={!consent || state === 'submitting'}>
                  {state === 'submitting' ? '...' : submitLabel}
                </Button>
              </div>
              <label className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>{consentLabel}</span>
              </label>
              {state === 'err' && <p className="text-xs text-red-600">Error. Intenta de nuevo.</p>}
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}
