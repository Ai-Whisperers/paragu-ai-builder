'use client'
import { Section } from '@/components/ui/section'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { cleanPhone } from '@/lib/format'
import { useState } from 'react'

/**
 * Generic intake questionnaire. Config-driven so every real client can author
 * its own question set in content JSON without touching code.
 *
 * Use cases covered today:
 *   - De Abasto a Casa: household size, dietary constraints, dislikes,
 *     delivery window, weekly budget.
 *   - Dayah LitWorks: book genre, trim size, mood, reference covers, budget.
 *   - Nexa Paraguay: residency goal, timeline, dependants count, source country.
 *
 * The submission flow posts to /api/leads with `source: <tenant>-intake` and
 * the full answers object; CRM consumes it like any other lead.
 */

export type IntakeQuestionKind = 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'number'

export interface IntakeQuestion {
  id: string
  kind: IntakeQuestionKind
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
}

export interface IntakeQuestionnaireSectionProps {
  title: string
  subtitle?: string
  questions: IntakeQuestion[]
  submitLabel?: string
  successMessage?: string
  /** Tenant slug — becomes the source tag on the lead. */
  tenantSlug?: string
  /** Where to POST answers. Defaults to /api/leads. */
  submitEndpoint?: string
  /** Optional WhatsApp fallback shown below the form. */
  whatsappPhone?: string
  whatsappFallbackLabel?: string
}

type AnswerValue = string | string[] | number | null

export function IntakeQuestionnaireSection({
  title,
  subtitle,
  questions,
  submitLabel = 'Enviar',
  successMessage = 'Gracias — te escribimos en las proximas horas.',
  tenantSlug,
  submitEndpoint = '/api/leads',
  whatsappPhone,
  whatsappFallbackLabel = 'O consulta directo por WhatsApp',
}: IntakeQuestionnaireSectionProps) {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (id: string, value: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [id]: value }))

  const missingRequired = questions
    .filter((q) => q.required)
    .filter((q) => {
      const v = answers[q.id]
      if (v === null || v === undefined) return true
      if (typeof v === 'string' && v.trim() === '') return true
      if (Array.isArray(v) && v.length === 0) return true
      return false
    })
    .map((q) => q.id)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (missingRequired.length > 0) {
      setError('Por favor, responde las preguntas marcadas con *.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: tenantSlug ? `${tenantSlug}-intake` : 'intake',
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
        <Container size="md">
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-8 text-center">
              <Heading level={3}>{successMessage}</Heading>
            </CardContent>
          </Card>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="background">
      <Container size="md">
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </AnimatedSectionHeader>

        <form
          onSubmit={onSubmit}
          className="max-w-2xl mx-auto space-y-5 bg-surface rounded-lg p-6 shadow-sm"
        >
          {questions.map((q) => (
            <QuestionField
              key={q.id}
              question={q}
              value={answers[q.id] ?? null}
              onChange={(v) => update(q.id, v)}
            />
          ))}

          {error && <p className="text-sm text-primary">{error}</p>}

          <div className="flex items-center justify-between gap-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Enviando...' : submitLabel}
            </Button>
            {whatsappPhone && (
              <a
                href={`https://wa.me/${cleanPhone(whatsappPhone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline"
              >
                {whatsappFallbackLabel}
              </a>
            )}
          </div>
        </form>
      </Container>
    </Section>
  )
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: IntakeQuestion
  value: AnswerValue
  onChange: (v: AnswerValue) => void
}) {
  const labelClasses = 'block text-sm font-medium text-foreground mb-1'
  const inputClasses =
    'w-full border border-[var(--surface-light)] rounded-md px-3 py-2 bg-surface text-foreground'

  const label = (
    <label htmlFor={question.id} className={labelClasses}>
      {question.label}
      {question.required && <span className="text-primary ml-1">*</span>}
    </label>
  )

  const helpText = question.helpText && (
    <p className="text-xs text-muted-foreground mt-1">{question.helpText}</p>
  )

  switch (question.kind) {
    case 'text':
      return (
        <div>
          {label}
          <input
            id={question.id}
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className={inputClasses}
          />
          {helpText}
        </div>
      )
    case 'number':
      return (
        <div>
          {label}
          <input
            id={question.id}
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            min={question.min}
            max={question.max}
            className={inputClasses}
          />
          {helpText}
        </div>
      )
    case 'textarea':
      return (
        <div>
          {label}
          <textarea
            id={question.id}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className={inputClasses}
          />
          {helpText}
        </div>
      )
    case 'select':
      return (
        <div>
          {label}
          <select
            id={question.id}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          >
            <option value="">—</option>
            {(question.options || []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {helpText}
        </div>
      )
    case 'radio':
      return (
        <div>
          {label}
          <div className="space-y-1">
            {(question.options || []).map((o) => (
              <label key={o.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={question.id}
                  value={o.value}
                  checked={value === o.value}
                  onChange={() => onChange(o.value)}
                />
                <span className="text-sm text-foreground">{o.label}</span>
              </label>
            ))}
          </div>
          {helpText}
        </div>
      )
    case 'checkbox': {
      const current: string[] = Array.isArray(value) ? value : []
      return (
        <div>
          {label}
          <div className="space-y-1">
            {(question.options || []).map((o) => {
              const checked = current.includes(o.value)
              return (
                <label key={o.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked ? current.filter((v) => v !== o.value) : [...current, o.value]
                      onChange(next)
                    }}
                  />
                  <span className="text-sm text-foreground">{o.label}</span>
                </label>
              )
            })}
          </div>
          {helpText}
        </div>
      )
    }
    default:
      return null
  }
}
