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
  return <Icon size={size} className="font-heading text-[var(--secondary-foreground)]" />
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
    <section id="proceso" className="font-heading bg-surface py-16 sm:py-24">
      <Container size="md">
        <AnimatedSectionHeader>
          {eyebrow && (
            <p className="font-heading mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
              {eyebrow}
            </p>
          )}
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="font-heading mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {totalDuration && (
          <div className="font-heading mt-6 flex justify-center">
            <span className="font-heading inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <span aria-hidden="true">⏱</span>
              {totalDuration}
            </span>
          </div>
        )}

        {variant === 'vertical' ? (
          <Vertical steps={steps} />
        ) : variant === 'stepped' ? (
          <Stepped steps={steps} />
        ) : (
          <Horizontal steps={steps} />
        )}

        {ctaLabel && ctaHref && (
          <div className="font-heading mt-12 flex justify-center">
            <a
              href={ctaHref}
              className="font-heading inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-[var(--primary-foreground,white)] shadow-button transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              {ctaLabel}
              <span aria-hidden="true">→</span>
            </a>
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
    <div className={`mt-8 grid gap-x-4 gap-y-10 ${gridColsClass} items-start`}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <AnimateOnScroll
            key={i}
            stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
            className="font-heading relative"
          >
            {!isLast && (
              <>
                {/* Desktop connector: right-pointing arrow between columns */}
                <Icons.ArrowRight
                  aria-hidden="true"
                  className="font-heading pointer-events-none absolute top-9 right-[-20px] hidden h-6 w-6 text-secondary/60 md:block"
                />
                {/* Mobile connector: down-pointing arrow below the card */}
                <Icons.ArrowDown
                  aria-hidden="true"
                  className="font-heading pointer-events-none mx-auto mt-6 h-6 w-6 text-secondary/60 md:hidden"
                />
              </>
            )}
            <div className="font-heading text-center">
              {(() => {
                const img = stepImage(step.image)
                if (!img) return null
                return (
                  <div className="font-heading mb-4 overflow-hidden rounded-lg bg-surface shadow-card aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt || step.title}
                      className="font-heading h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )
              })()}
              <div className="font-heading relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-[var(--secondary-foreground)] shadow-[0_8px_24px_rgba(201,169,110,0.35)] ring-4 ring-[var(--surface)]">
                {step.icon ? (
                  <div className="font-heading text-[var(--secondary-foreground)]">
                    <IconByName name={step.icon} size={28} />
                  </div>
                ) : (
                  <span className="font-heading text-2xl font-bold">{step.number ?? i + 1}</span>
                )}
                <span
                  aria-hidden="true"
                  className="font-heading absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md ring-2 ring-[var(--surface)]"
                >
                  {step.number ?? i + 1}
                </span>
              </div>
              <Heading
                level={3}
                className="font-heading mb-2 text-lg font-semibold text-primary"
               
              >
                {step.title}
              </Heading>
              <p className="font-heading min-h-[3.25rem] text-sm text-muted-foreground">{step.description}</p>
              {step.duration && (
                <p className="font-heading mt-2 text-xs uppercase tracking-wider text-muted-foreground">
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
    <ol className="font-heading mt-12 space-y-10">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <AnimateOnScroll
            key={i}
            stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
          >
            <li className="font-heading relative flex gap-6">
              {/* Vertical connector — the line visually links this step
                  to the next. Positioned behind the circle's center. */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="font-heading pointer-events-none absolute left-8 top-16 bottom-[-2.5rem] w-0.5 bg-secondary/30"
                />
              )}
              {/* Numbered circle — matches the visual language of the
                  horizontal variant: gold fill, white content, ring over
                  the surface, a navy step-number badge at the top-right. */}
              <div className="font-heading relative shrink-0">
                <div className="font-heading relative flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-[var(--secondary-foreground)] shadow-[0_6px_20px_rgba(201,169,110,0.35)] ring-4 ring-[var(--surface)]">
                  {step.icon ? (
                    <div className="font-heading text-[var(--secondary-foreground)]">
                      <IconByName name={step.icon} size={26} />
                    </div>
                  ) : (
                    <span className="font-heading text-xl font-bold">{step.number ?? i + 1}</span>
                  )}
                  <span
                    aria-hidden="true"
                    className="font-heading absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-md"
                  >
                    {step.number ?? i + 1}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="font-heading flex-1 pt-2">
                <Heading
                  level={3}
                  className="font-heading mb-1 text-xl font-semibold text-primary"
                 
                >
                  {step.title}
                </Heading>
                <p className="font-heading text-muted-foreground">{step.description}</p>
                {step.duration && (
                  <p className="font-heading mt-1 text-xs uppercase tracking-wider text-muted-foreground">
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
    <div className="font-heading mt-12 space-y-6">
      {steps.map((step, i) => (
        <AnimateOnScroll key={i} stagger={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
          <div className="font-heading flex items-start gap-6 rounded-lg border border-border bg-surface p-6 shadow-card transition-all hover:shadow-card-hover">
            <div className="font-heading flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10">
              <span className="font-heading text-lg font-bold text-secondary">
                {step.number ?? i + 1}
              </span>
            </div>
            <div className="font-heading flex-1">
              <Heading level={3} className="font-heading mb-1 text-xl font-semibold text-primary">
                {step.title}
              </Heading>
              <p className="font-heading text-muted-foreground">{step.description}</p>
            </div>
            {step.duration && (
              <span className="font-heading flex-shrink-0 rounded-full bg-surface px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
                {step.duration}
              </span>
            )}
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  )
}
