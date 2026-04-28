'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LeadCaptureModalProps {
  calculatorName: string
  results?: Record<string, unknown>
  title?: string
  subtitle?: string
  ctaLabel?: string
  locale?: string
}

const LABELS: Record<string, { title: string; subtitle: string; emailPlaceholder: string; cta: string; privacy: string; success: string }> = {
  en: { title: 'Save Your Results', subtitle: 'Enter your email for a detailed PDF report.', emailPlaceholder: 'your@email.com', cta: 'Get My Report', privacy: 'We respect your privacy. No spam.', success: 'Thank you! Check your email.' },
  es: { title: 'Guarde Sus Resultados', subtitle: 'Ingrese su email para un informe PDF detallado.', emailPlaceholder: 'tu@email.com', cta: 'Obtener Informe', privacy: 'Respetamos su privacidad. Sin spam.', success: '¡Gracias! Revise su email.' },
  nl: { title: 'Sla Uw Resultaten Op', subtitle: 'Voer uw e-mail in voor een gepersonaliseerd rapport.', emailPlaceholder: 'jouw@email.nl', cta: 'Ontvang Rapport', privacy: 'Wij respecteren uw privacy. Geen spam.', success: 'Bedankt! Controleer je e-mail.' },
  de: { title: 'Speichern Sie Ihre Ergebnisse', subtitle: 'Geben Sie Ihre E-Mail für einen personalisierten Bericht ein.', emailPlaceholder: 'deine@email.de', cta: 'Erhalt Bericht', privacy: 'Wir respektieren Ihre Privatsphäre. Kein Spam.', success: 'Danke! Überprüfen Sie Ihre E-Mail.' },
}

export function LeadCaptureModal({ calculatorName, results, title, subtitle, ctaLabel, locale = 'en' }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const L = LABELS[locale] || LABELS.en

  const trackEvent = useCallback(async (event: string, data: Record<string, unknown>) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, properties: { ...data, source: `calculator-${calculatorName}` } }),
      })
    } catch (e) {
      console.error('Analytics error:', e)
    }
  }, [calculatorName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          calculator: calculatorName,
          data: {
            results,
            captured_at: new Date().toISOString(),
            locale,
          },
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        await trackEvent('calculator_lead_captured', { email, calculator: calculatorName, locale })
      } else {
        setError('Failed to submit. Please try again.')
      }
    } catch (err) {
      console.error('Lead capture error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mb-2 text-3xl">✓</div>
        <p className="font-semibold text-green-800">{L.success}</p>
        <p className="mt-2 text-sm text-green-700">
          {locale === 'es' ? 'También puede contactarnos directamente.' : locale === 'de' ? 'Sie können uns auch direkt kontaktieren.' : locale === 'nl' ? 'Je kunt ons ook direct contacteren.' : 'You can also reach us directly on WhatsApp.'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title || L.title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{subtitle || L.subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={L.emailPlaceholder}
          required
          className="w-full"
          autoComplete="email"
        />
        
        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="w-full"
          style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }}
        >
          {ctaLabel || L.cta}
        </Button>

        <p className="text-xs text-muted-foreground">{L.privacy}</p>
      </form>
    </div>
  )
}