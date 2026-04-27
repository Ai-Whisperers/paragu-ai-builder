'use client'

import { useState } from 'react'
import { trackWizardStep, trackWizardComplete } from '@/lib/analytics/marketing-events'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

export type ProgramTier = 'base' | 'business' | 'investor' | 'tierras'

export interface IntakeWizardSectionProps {
  title?: string
  subtitle?: string
  /** Step config for the current locale */
  steps?: Array<{ key: string; question: string; options: Array<{ value: string; label: string }> }>
  /** Tier labels for the current locale */
  tierLabels?: Record<string, { name: string; pitch: string }>
  /** UI labels for the current locale */
  ui?: { back: string; next: string; step: string; of: string; result: string; viewProgram: string; restart: string }
  __locale?: string
  __siteSlug?: string
}

export function recommendTier(answers: {
  goal: string
  income: string
  needs: string
  timeline: string
}): ProgramTier {
  if (answers.goal === 'land' || answers.needs === 'land-only') return 'tierras'
  if (answers.needs === 'company-plus-advisory' || answers.income === 'investor') return 'investor'
  if (answers.needs === 'company-and-bank') return 'business'
  return 'base'
}

export function IntakeWizardSection({
  title,
  subtitle,
  steps,
  tierLabels,
  ui,
  __locale,
  __siteSlug,
}: IntakeWizardSectionProps) {
  const locale = __locale || 'es'
  const resolvedUi = ui ?? { back: 'Atrás', next: 'Siguiente', step: 'Paso', of: 'de', result: 'Su programa recomendado', viewProgram: 'Ver detalles del programa', restart: 'Empezar de nuevo' }
  const stepList = steps ?? []
  const resolvedTiers = tierLabels ?? {}

  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const currentStep = stepList[stepIdx]
  const answered = currentStep ? !!answers[currentStep.key] : false
  const isLastStep = stepIdx === stepList.length - 1

  const handleNext = () => {
    if (!answered || !currentStep) return
    trackWizardStep({
      step: stepIdx + 1,
      stepKey: currentStep.key,
      answerKey: answers[currentStep.key] || '',
      answerLabel: currentStep.options.find((o) => o.value === answers[currentStep.key])?.label || '',
      tenant: __siteSlug,
    })
    if (isLastStep) {
      const tier = recommendTier({
        goal: answers.goal || '',
        income: answers.income || '',
        needs: answers.needs || '',
        timeline: answers.timeline || '',
      })
      trackWizardComplete({ recommendedTier: tier, tenant: __siteSlug })
      setDone(true)
    } else {
      setStepIdx(stepIdx + 1)
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setStepIdx(0)
    setDone(false)
  }

  if (done) {
    const tier = recommendTier({
      goal: answers.goal || '',
      income: answers.income || '',
      needs: answers.needs || '',
      timeline: answers.timeline || '',
    })
    const info = resolvedTiers[tier]
    return (
      <section className="bg-[var(--surface-light)] py-16 sm:py-24">
        <Container size="md">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card sm:p-12">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
              <Check size={16} /> {resolvedUi.result}
            </div>
            <Heading level={2} className="mb-3 text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {info?.name}
            </Heading>
            <p className="mb-6 text-lg leading-relaxed text-[var(--text-light)]">{info?.pitch}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`/s/${locale}/${__siteSlug}/contacto?programa=${tier}`}
                className="inline-flex items-center justify-center rounded-md bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)] shadow-button"
              >
                {resolvedUi.viewProgram} →
              </a>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-light)]"
              >
                {resolvedUi.restart}
              </button>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (!currentStep) return null

  return (
    <section className="bg-[var(--surface-light)] py-16 sm:py-24">
      <Container size="md">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && <p className="mx-auto mt-3 max-w-xl text-[var(--text-light)]">{subtitle}</p>}
          </div>
        )}
        <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card sm:p-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {resolvedUi.step} {stepIdx + 1} {resolvedUi.of} {stepList.length}
          </p>
          <div className="mb-6 h-1 overflow-hidden rounded bg-[var(--surface-light)]">
            <div
              className="h-full bg-[var(--secondary)] transition-all"
              style={{ width: `${((stepIdx + 1) / stepList.length) * 100}%` }}
            />
          </div>
          <Heading level={3} className="mb-6 text-xl font-semibold text-[var(--primary)]">{currentStep.question}</Heading>
          <div className="space-y-2">
            {currentStep.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                  answers[currentStep.key] === opt.value
                    ? 'border-[var(--secondary)] bg-[var(--secondary)]/5'
                    : 'border-[var(--border)] hover:bg-[var(--surface-light)]'
                }`}
              >
                <input
                  type="radio"
                  name={currentStep.key}
                  value={opt.value}
                  checked={answers[currentStep.key] === opt.value}
                  onChange={(e) => setAnswers({ ...answers, [currentStep.key]: e.target.value })}
                  className="accent-[var(--secondary)]"
                />
                <span className="text-[var(--text)]">{opt.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
              disabled={stepIdx === 0}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[var(--text-muted)] disabled:opacity-40 enabled:hover:text-[var(--text)]"
            >
              <ArrowLeft size={16} /> {resolvedUi.back}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!answered}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--secondary)] px-5 py-2.5 text-sm font-semibold text-[var(--secondary-foreground)] shadow-button disabled:opacity-50"
            >
              {resolvedUi.next} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
