import { ProgramTier, StepContent, IntakeWizardSectionProps, recommendTier, DEFAULT_STEPS, DEFAULT_TIER_LABELS, UI_LABELS } from './intake-wizard-data'

export function IntakeWizardSection({
  title,
  subtitle,
  steps,
  resultHeading,
  tierLabels,
  __locale,
  __siteSlug = 'nexa-paraguay',
}: IntakeWizardSectionProps) {
  const locale = __locale && __locale in UI_LABELS ? __locale : 'es'
  const ui = UI_LABELS[locale]
  const s = steps || DEFAULT_STEPS[locale] || DEFAULT_STEPS.es!
  const tl = tierLabels || DEFAULT_TIER_LABELS[locale] || DEFAULT_TIER_LABELS.es

  const STEP_KEYS: Array<keyof typeof s> = ['goal', 'income', 'needs', 'timeline']
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const currentStepKey = STEP_KEYS[stepIdx]
  const currentStep = s[currentStepKey]
  const answered = !!answers[currentStepKey]
  const isLastStep = stepIdx === STEP_KEYS.length - 1

  const handleNext = () => {
    if (!answered) return
    // Emit a wizard_step event for every advance — lets us see where
    // prospects drop out of the 4-step funnel in GA4.
    trackWizardStep({
      step: stepIdx + 1,
      stepKey: String(currentStepKey),
      answerKey: answers[currentStepKey] || '',
      answerLabel: currentStep!.options.find((o) => o.value === answers[currentStepKey])?.label || '',
      tenant: __siteSlug,
    })
    if (isLastStep) {
      // Compute the recommendation eagerly here so the wizard_complete
      // event carries the correct `recommended_tier` instead of firing
      // on a subsequent render cycle.
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
    const info = tl[tier]
    return (
      <section className="bg-[var(--surface-light)] py-16 sm:py-24">
        <Container size="md">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card sm:p-12">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
              <Check size={16} /> {ui.result}
            </div>
            <Heading level={2} className="mb-3 text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {info.name}
            </Heading>
            <p className="mb-6 text-lg leading-relaxed text-[var(--text-light)]">{info.pitch}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`/s/${locale}/${__siteSlug}/contacto?programa=${tier}`}
                className="inline-flex items-center justify-center rounded-md bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)] shadow-button"
              >
                {ui.viewProgram} →
              </a>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-light)]"
              >
                {ui.restart}
              </button>
            </div>
          </div>
        </Container>
      </section>
    )
  }

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
            {ui.step} {stepIdx + 1} {ui.of} {STEP_KEYS.length}
          </p>
          <div className="mb-6 h-1 overflow-hidden rounded bg-[var(--surface-light)]">
            <div
              className="h-full bg-[var(--secondary)] transition-all"
              style={{ width: `${((stepIdx + 1) / STEP_KEYS.length) * 100}%` }}
            />
          </div>
          <Heading level={3} className="mb-6 text-xl font-semibold text-[var(--primary)]">{currentStep!.question}</Heading>
          <div className="space-y-2">
            {currentStep!.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                  answers[currentStepKey] === opt.value
                    ? 'border-[var(--secondary)] bg-[var(--secondary)]/5'
                    : 'border-[var(--border)] hover:bg-[var(--surface-light)]'
                }`}
              >
                <input
                  type="radio"
                  name={currentStepKey}
                  value={opt.value}
                  checked={answers[currentStepKey] === opt.value}
                  onChange={(e) => setAnswers({ ...answers, [currentStepKey]: e.target.value })}
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
              <ArrowLeft size={16} /> {ui.back}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!answered}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--secondary)] px-5 py-2.5 text-sm font-semibold text-[var(--secondary-foreground)] shadow-button disabled:opacity-50"
            >
              {ui.next} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
