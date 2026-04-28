'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Multi-question maturity assessment with scoring + tier-specific result.
 *
 * Pattern: scored radio questions → sum → tier lookup → tier-specific
 * recommendation page → optional email capture for a tailored follow-up.
 *
 * Built for Stoic Finch's Data Maturity Assessment (P3 of FEATURE_PLAN.md)
 * but generic — any technology-digital tenant can author its own questions
 * + tiers in content JSON without touching code.
 *
 * Lead capture posts to /api/leads with `source: <tenant>-maturity` and
 * the full answer + tier payload.
 */

export interface MaturityQuestionOption {
  value: number
  label: string
}

export interface MaturityQuestion {
  id: string
  label: string
  options: MaturityQuestionOption[]
}

export interface MaturityTier {
  min: number
  max: number
  name: string
  summary: string
  recommendation: string
}

export interface MaturityLeadCaptureField {
  id: string
  label: string
  required?: boolean
}

export interface MaturityLeadCapture {
  title: string
  subtitle?: string
  fields: MaturityLeadCaptureField[]
  submitLabel: string
  successMessage: string
}

export interface MaturityAssessmentSectionProps {
  title: string
  subtitle?: string
  questions: MaturityQuestion[]
  tiers: MaturityTier[]
  submitLabel?: string
  leadCapture?: MaturityLeadCapture
  /** Tenant slug — becomes the source tag on the lead. */
  __siteSlug?: string
  /** Where to POST the lead. Defaults to /api/leads. */
  submitEndpoint?: string
}

function scoreToTier(score: number, tiers: MaturityTier[]): MaturityTier | null {
  return tiers.find((t) => score >= t.min && score <= t.max) ?? null
}

export function MaturityAssessmentSection({
  title,
  subtitle,
  questions,
  tiers,
  submitLabel = 'Get my score',
  leadCapture,
  __siteSlug,
  submitEndpoint = '/api/leads',
}: MaturityAssessmentSectionProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [leadValues, setLeadValues] = useState<Record<string, string>>({})
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState<string | null>(null)

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0)
  const tier = showResult ? scoreToTier(totalScore, tiers) : null
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  function selectOption(qid: string, value: number) {
    setAnswers((prev) => ({ ...prev, [qid]: value }))
  }

  function updateLead(id: string, value: string) {
    setLeadValues((prev) => ({ ...prev, [id]: value }))
  }

  async function submitLead() {
    if (!leadCapture) return
    const missing = leadCapture.fields
      .filter((f) => f.required)
      .filter((f) => !(leadValues[f.id] || '').trim())
    if (missing.length) {
      setLeadError(`Required: ${missing.map((m) => m.label).join(', ')}`)
      return
    }
    setLeadError(null)
    setLeadSubmitting(true)
    try {
      const payload = {
        source: __siteSlug ? `${__siteSlug}-maturity` : 'maturity-assessment',
        siteSlug: __siteSlug,
        answers,
        score: totalScore,
        tier: tier?.name ?? 'unknown',
        ...leadValues,
      }
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setLeadSubmitted(true)
    } catch (e) {
      setLeadError(e instanceof Error ? e.message : 'Submission failed')
    } finally {
      setLeadSubmitting(false)
    }
  }

  function restart() {
    setAnswers({})
    setShowResult(false)
    setLeadValues({})
    setLeadSubmitted(false)
    setLeadError(null)
  }

  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <Heading level={2} className="mb-3">
              {title}
            </Heading>
            {subtitle ? (
              <p style={{ color: 'var(--textLight)' }}>{subtitle}</p>
            ) : null}
          </div>

          {!showResult ? (
            <div className="space-y-6">
              {questions.map((q, qi) => (
                <Card key={q.id}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-3">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primaryForeground)',
                        }}
                      >
                        {qi + 1}
                      </span>
                      <p className="font-medium" style={{ color: 'var(--text)' }}>
                        {q.label}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const checked = answers[q.id] === opt.value
                        return (
                          <label
                            key={`${q.id}-${opt.value}`}
                            className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors"
                            style={{
                              borderColor: checked
                                ? 'var(--accent)'
                                : 'var(--border)',
                              backgroundColor: checked
                                ? 'rgba(20,184,166,0.08)'
                                : 'transparent',
                            }}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={checked}
                              onChange={() => selectOption(q.id, opt.value)}
                              className="h-4 w-4"
                            />
                            <span style={{ color: 'var(--text)' }}>
                              {opt.label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="text-center pt-4">
                <Button
                  onClick={() => setShowResult(true)}
                  disabled={!allAnswered}
                  size="lg"
                >
                  {submitLabel}
                </Button>
                {!allAnswered ? (
                  <p
                    className="mt-3 text-sm"
                    style={{ color: 'var(--textLight)' }}
                  >
                    Answer all {questions.length} questions to see your score.
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <div className="mb-6 text-center">
                    <p
                      className="text-sm uppercase tracking-wider mb-2"
                      style={{ color: 'var(--textLight)' }}
                    >
                      Your maturity tier
                    </p>
                    <Heading level={3} className="mb-2">
                      {tier?.name ?? 'Unscored'}
                    </Heading>
                    <p
                      className="text-xl sm:text-3xl font-bold"
                      style={{ color: 'var(--accent)' }}
                    >
                      Score: {totalScore} / {questions.length * 4}
                    </p>
                  </div>
                  {tier ? (
                    <>
                      <p
                        className="mb-4 text-lg"
                        style={{ color: 'var(--text)' }}
                      >
                        {tier.summary}
                      </p>
                      <div
                        className="rounded-lg border p-5"
                        style={{
                          borderColor: 'var(--accent)',
                          backgroundColor: 'rgba(20,184,166,0.06)',
                        }}
                      >
                        <p
                          className="mb-2 text-sm font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--accent)' }}
                        >
                          Recommended next step
                        </p>
                        <p style={{ color: 'var(--text)' }}>
                          {tier.recommendation}
                        </p>
                      </div>
                    </>
                  ) : null}
                </CardContent>
              </Card>

              {leadCapture && !leadSubmitted ? (
                <Card>
                  <CardContent className="p-6">
                    <Heading level={4} className="mb-2">
                      {leadCapture.title}
                    </Heading>
                    {leadCapture.subtitle ? (
                      <p
                        className="mb-4 text-sm"
                        style={{ color: 'var(--textLight)' }}
                      >
                        {leadCapture.subtitle}
                      </p>
                    ) : null}
                    <div className="space-y-3">
                      {leadCapture.fields.map((f) => (
                        <div key={f.id}>
                          <label
                            className="mb-1 block text-sm font-medium"
                            style={{ color: 'var(--text)' }}
                          >
                            {f.label}
                            {f.required ? (
                              <span style={{ color: 'var(--error)' }}> *</span>
                            ) : null}
                          </label>
                          <input
                            type="text"
                            value={leadValues[f.id] || ''}
                            onChange={(e) => updateLead(f.id, e.target.value)}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            style={{
                              borderColor: 'var(--border)',
                              backgroundColor: 'var(--background)',
                              color: 'var(--text)',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {leadError ? (
                      <p
                        className="mt-3 text-sm"
                        style={{ color: 'var(--error)' }}
                      >
                        {leadError}
                      </p>
                    ) : null}
                    <div className="mt-5 flex gap-3">
                      <Button onClick={submitLead} disabled={leadSubmitting}>
                        {leadSubmitting ? 'Sending…' : leadCapture.submitLabel}
                      </Button>
                      <Button onClick={restart} variant="ghost">
                        Restart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {leadSubmitted ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p style={{ color: 'var(--text)' }}>
                      {leadCapture?.successMessage ?? 'Thanks — we’ll be in touch.'}
                    </p>
                    <div className="mt-4">
                      <Button onClick={restart} variant="ghost">
                        Restart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
