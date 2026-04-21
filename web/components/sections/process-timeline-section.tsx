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
  /**
   * Optional illustrative image for the step. Accepts a bare URL or the
   * `{ src, alt }` object emitted by `{ $img: "process.<key>" }` content
   * refs. Only renders in the `horizontal` variant today.
   */
  image?: string | { src: string; alt: string }
}

function stepImage(img: ProcessStep['image']): { src: string; alt: string } | null {
  if (!img) return null
  if (typeof img === 'string') return { src: img, alt: '' }
  if (typeof img === 'object' && typeof img.src === 'string') {
    return { src: img.src, alt: img.alt ?? '' }
  }
  return null
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
  const cols = Math.min(Math.max(steps.length, 2), 6)
  const gridColsClass = (
    cols === 2 ? 'md:grid-cols-2'
    : cols === 3 ? 'md:grid-cols-3'
    : cols === 4 ? 'md:grid-cols-4'
    : cols === 5 ? 'md:grid-cols-5'
    : 'md:grid-cols-6'
  )
  return (
    <div className={`mt-12 grid gap-x-4 gap-y-10 ${gridColsClass} items-start`}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <AnimateOnScroll
            key={i}
            stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
            className="relative"
          >
            {!isLast && (
              <>
                {/* Desktop connector: right-pointing arrow between columns */}
                <Icons.ArrowRight
                  aria-hidden="true"
                  className="pointer-events-none absolute top-9 right-[-20px] hidden h-6 w-6 text-[var(--secondary)]/60 md:block"
                />
                {/* Mobile connector: down-pointing arrow below the card */}
                <Icons.ArrowDown
                  aria-hidden="true"
                  className="pointer-events-none mx-auto mt-6 h-6 w-6 text-[var(--secondary)]/60 md:hidden"
                />
              </>
            )}
            <div className="text-center">
              {(() => {
                const img = stepImage(step.image)
                if (!img) return null
                return (
                  <div className="mb-4 overflow-hidden rounded-lg bg-[var(--surface-light)] shadow-card aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt || step.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )
              })()}
              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-[0_8px_24px_rgba(201,169,110,0.35)] ring-4 ring-[var(--surface)]">
                {step.icon ? (
                  <div className="text-[var(--secondary-foreground)]">
                    <IconByName name={step.icon} size={28} />
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{step.number ?? i + 1}</span>
                )}
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white shadow-md"
                >
                  {step.number ?? i + 1}
                </span>
              </div>
              <Heading
                level={3}
                className="mb-2 text-lg font-semibold text-[var(--primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {step.title}
              </Heading>
              <p className="text-sm text-[var(--text-light)]">{step.description}</p>
              {step.duration && (
                <p className="mt-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {step.duration}
                </p>
              )}
            </div>
          </AnimateOnScroll>
        )
      })}
    </div>
  )
}

function Vertical({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="mt-12 space-y-10">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <AnimateOnScroll
            key={i}
            stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
          >
            <li className="relative flex gap-6">
              {/* Vertical connector — the line visually links this step
                  to the next. Positioned behind the circle's center. */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-8 top-16 bottom-[-2.5rem] w-0.5 bg-[var(--secondary)]/30"
                />
              )}
              {/* Numbered circle — matches the visual language of the
                  horizontal variant: gold fill, white content, ring over
                  the surface, a navy step-number badge at the top-right. */}
              <div className="relative shrink-0">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-[0_6px_20px_rgba(201,169,110,0.35)] ring-4 ring-[var(--surface)]">
                  {step.icon ? (
                    <div className="text-[var(--secondary-foreground)]">
                      <IconByName name={step.icon} size={26} />
                    </div>
                  ) : (
                    <span className="text-xl font-bold">{step.number ?? i + 1}</span>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white shadow-md"
                  >
                    {step.number ?? i + 1}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 pt-2">
                <Heading
                  level={3}
                  className="mb-1 text-xl font-semibold text-[var(--primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {step.title}
                </Heading>
                <p className="text-[var(--text-light)]">{step.description}</p>
                {step.duration && (
                  <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    {step.duration}
                  </p>
                )}
              </div>
            </li>
          </AnimateOnScroll>
        )
      })}
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
              <Heading level={3} className="mb-1 text-xl font-semibold text-[var(--primary)]">
                {step.title}
              </Heading>
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
