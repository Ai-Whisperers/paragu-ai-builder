import * as Icons from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export type ProcessTimelineVariant = 'horizontal' | 'vertical' | 'stepped'

export interface ProcessStep {
  number?: number
  title: string
  description: string
  icon?: string
  duration?: string
}

export interface ProcessTimelineSectionProps {
  variant?: ProcessTimelineVariant
  eyebrow?: string
  title: string
  subtitle?: string
  steps: ProcessStep[]
  totalDuration?: string
  ctaLabel?: string
  ctaHref?: string
}

function IconByName({ name, size = 28 }: { name?: string; size?: number }) {
  if (!name) return null
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name]
  if (!Icon) return null
  return <Icon size={size} className="text-[var(--secondary)]" />
}

export function ProcessTimelineSection({
  variant = 'horizontal',
  eyebrow,
  title,
  subtitle,
  steps,
  totalDuration,
  ctaLabel,
  ctaHref,
}: ProcessTimelineSectionProps) {
  return (
    <section id="proceso" className="bg-[var(--surface-light)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
              {eyebrow}
            </p>
          )}
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {variant === 'vertical' ? (
          <Vertical steps={steps} />
        ) : variant === 'stepped' ? (
          <Stepped steps={steps} />
        ) : (
          <Horizontal steps={steps} />
        )}

        {(totalDuration || ctaLabel) && (
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            {totalDuration && (
              <p className="text-sm text-[var(--text-muted)]">
                {totalDuration}
              </p>
            )}
            {ctaLabel && ctaHref && (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--secondary)] px-6 py-3 text-[var(--secondary-foreground)] shadow-button transition-all hover:-translate-y-0.5"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}

function Horizontal({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-5">
      {steps.map((step, i) => (
        <AnimateOnScroll key={i} stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
          <div className="relative text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--secondary)] bg-[var(--surface)]">
              <IconByName name={step.icon} />
              {!step.icon && (
                <span className="text-xl font-bold text-[var(--secondary)]">{step.number ?? i + 1}</span>
              )}
            </div>
            <h3
              className="mb-2 text-lg font-semibold text-[var(--primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {step.title}
            </h3>
            <p className="text-sm text-[var(--text-light)]">{step.description}</p>
            {step.duration && (
              <p className="mt-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                {step.duration}
              </p>
            )}
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function Vertical({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="mt-12 space-y-8 border-l-2 border-[var(--secondary)]/30 pl-8">
      {steps.map((step, i) => (
        <AnimateOnScroll key={i} stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
          <li className="relative">
            <span className="absolute -left-[2.65rem] flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] text-sm font-bold text-[var(--secondary-foreground)]">
              {step.number ?? i + 1}
            </span>
            <h3
              className="mb-1 text-xl font-semibold text-[var(--primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {step.title}
            </h3>
            <p className="text-[var(--text-light)]">{step.description}</p>
            {step.duration && (
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                {step.duration}
              </p>
            )}
          </li>
        </AnimateOnScroll>
      ))}
    </ol>
  )
}

function Stepped({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="mt-12 space-y-6">
      {steps.map((step, i) => (
        <AnimateOnScroll key={i} stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
          <div className="flex items-start gap-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card transition-all hover:shadow-card-hover">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/10">
              <span className="text-lg font-bold text-[var(--secondary)]">
                {step.number ?? i + 1}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-xl font-semibold text-[var(--primary)]">
                {step.title}
              </h3>
              <p className="text-[var(--text-light)]">{step.description}</p>
            </div>
            {step.duration && (
              <span className="flex-shrink-0 rounded-full bg-[var(--surface-light)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                {step.duration}
              </span>
            )}
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  )
}
