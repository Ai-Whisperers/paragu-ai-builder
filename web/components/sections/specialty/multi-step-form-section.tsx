'use client'
import { Section } from '@/components/ui/section'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

/**
 * Multi-step form — wizard alternative to intake-questionnaire when there are
 * more than 5 questions and chunking into steps improves completion rate.
 */

export interface MultiStepFormProps {
  title: string
  subtitle?: string
  steps: Array<{
    id: string
    title: string
    fields: Array<{
      id: string
      label: string
      kind: 'text' | 'textarea' | 'select'
      options?: Array<{ value: string; label: string }>
      required?: boolean
    }>
  }>
  submitEndpoint?: string
  tenantSlug?: string
  submitLabel?: string
  successMessage?: string
}

type Answers = Record<string, string>

export function MultiStepFormSection({
  title,
  subtitle,
  steps,
  submitEndpoint = '/api/leads',
  tenantSlug,
  submitLabel = 'Enviar',
  successMessage = 'Gracias, te responderemos pronto.',
}: MultiStepFormProps) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const step = steps[idx]

  function update(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function canAdvance(): boolean {
    return step.fields.every((f) => !f.required || (answers[f.id] || '').trim().length > 0)
  }

  async function onSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: tenantSlug ? `${tenantSlug}-multistep` : 'multistep',
          answers,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error enviando.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Section spacing="md" background="background">
        <Container>
          <p className="text-center text-foreground">{successMessage}</p>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="background">
      <Container>
        <div className="text-center mb-6">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>

        <div className="max-w-xl mx-auto bg-surface rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
            <span>
              Paso {idx + 1} de {steps.length}
            </span>
            <span>{Math.round(((idx + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-surface-light rounded mb-6">
            <div
              className="h-1 rounded bg-primary transition-all"
              style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
            />
          </div>

          <Heading level={3} className="font-semibold text-foreground mb-4">{step.title}</Heading>

          <div className="space-y-4">
            {step.fields.map((f) => (
              <div key={f.id}>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {f.label}
                  {f.required && <span className="text-primary ml-1">*</span>}
                </label>
                {f.kind === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={answers[f.id] || ''}
                    onChange={(e) => update(f.id, e.target.value)}
                    className="w-full border border-surface-light rounded px-3 py-2 bg-surface"
                  />
                ) : f.kind === 'select' ? (
                  <select
                    value={answers[f.id] || ''}
                    onChange={(e) => update(f.id, e.target.value)}
                    className="w-full border border-surface-light rounded px-3 py-2 bg-surface"
                  >
                    <option value="">—</option>
                    {(f.options || []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[f.id] || ''}
                    onChange={(e) => update(f.id, e.target.value)}
                    className="w-full border border-surface-light rounded px-3 py-2 bg-surface"
                  />
                )}
              </div>
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-primary">{error}</p>}

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={idx === 0}
            >
              Atras
            </Button>
            {idx < steps.length - 1 ? (
              <Button type="button" onClick={() => setIdx(idx + 1)} disabled={!canAdvance()}>
                Siguiente
              </Button>
            ) : (
              <Button type="button" onClick={onSubmit} disabled={submitting || !canAdvance()}>
                {submitting ? 'Enviando...' : submitLabel}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
