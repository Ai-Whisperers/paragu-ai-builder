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

  // No steps configured — don't render anything
  if (!stepList.length && !done) return null

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
      <section className="font-heading bg-surface-light py-16 sm:py-24">
        <Container size="md">
          <div className="font-heading mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-12">
            <div className="font-heading mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-secondary">
              <Check size={16} /> {resolvedUi.result}
            </div>
            <Heading level={2} className="font-heading mb-3 text-xl sm:text-3xl font-bold text-primary">
              {info?.name}
            </Heading>
            <p className="font-heading mb-6 text-lg leading-relaxed text-muted-foreground">{info?.pitch}</p>
            <div className="font-heading flex flex-col gap-3 sm:flex-row">
              <a
                href={`/s/${locale}/${__siteSlug}/contacto?programa=${tier}`}
                className="font-heading inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)] shadow-button"
              >
                {resolvedUi.viewProgram} →
              </a>
              <button
                type="button"
                onClick={handleRestart}
                className="font-heading inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-light"
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
    <section className="font-heading bg-surface-light py-16 sm:py-24">
      <Container size="md">
        {(title || subtitle) && (
          <div className="font-heading mb-10 text-center">
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && <p className="font-heading mx-auto mt-3 max-w-xl text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="font-heading mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-12">
          <p className="font-heading mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {resolvedUi.step} {stepIdx + 1} {resolvedUi.of} {stepList.length}
          </p>
          <div className="font-heading mb-6 h-1 overflow-hidden rounded bg-surface-light">
            <div
              className="font-heading h-full bg-secondary transition-all"
              style={{ width: `${((stepIdx + 1) / stepList.length) * 100}%` }}
            />
          </div>
          <Heading level={3} className="font-heading mb-6 text-xl font-semibold text-primary">{currentStep.question}</Heading>
          <div className="font-heading space-y-2">
            {currentStep.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                  answers[currentStep.key] === opt.value
                    ? 'border-secondary bg-secondary/5'
                    : 'border-border hover:bg-surface-light'
                }`}
              >
                <input
                  type="radio"
                  name={currentStep.key}
                  value={opt.value}
                  checked={answers[currentStep.key] === opt.value}
                  onChange={(e) => setAnswers({ ...answers, [currentStep.key]: e.target.value })}
                  className="font-heading accent-[var(--secondary)]"
                />
                <span className="font-heading text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
          <div className="font-heading mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
              disabled={stepIdx === 0}
              className="font-heading inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground disabled:opacity-40 enabled:hover:text-foreground"
            >
              <ArrowLeft size={16} /> {resolvedUi.back}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!answered}
              className="font-heading inline-flex items-center gap-1 rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-[var(--secondary-foreground)] shadow-button disabled:opacity-50"
            >
              {resolvedUi.next} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
