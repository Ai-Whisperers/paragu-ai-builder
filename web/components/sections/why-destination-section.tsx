import * as Icons from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export type WhyDestinationVariant = 'three-col' | 'alternating'

export interface WhyPillar {
  icon?: string
  title: string
  description: string
  bullets?: string[]
  imageUrl?: string
}

export interface WhyDestinationSectionProps {
  variant?: WhyDestinationVariant
  eyebrow?: string
  title: string
  subtitle?: string
  pillars: WhyPillar[]
  honestNote?: string
}

function IconByName({ name, size = 28 }: { name?: string; size?: number }) {
  if (!name) return null
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name]
  if (!Icon) return null
  return <Icon size={size} className="text-[var(--secondary)]" />
}

export function WhyDestinationSection({
  variant = 'three-col',
  eyebrow,
  title,
  subtitle,
  pillars,
  honestNote,
}: WhyDestinationSectionProps) {
  return (
    <section id="por-que" className="bg-[var(--background)] py-16 sm:py-24">
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

        {variant === 'alternating' ? (
          <Alternating pillars={pillars} />
        ) : (
          <ThreeCol pillars={pillars} />
        )}

        {honestNote && (
          <AnimateOnScroll>
            <aside className="mx-auto mt-12 max-w-3xl rounded-lg border-l-4 border-[var(--secondary)] bg-[var(--surface-light)] p-6">
              <p className="text-sm italic text-[var(--text-light)]">{honestNote}</p>
            </aside>
          </AnimateOnScroll>
        )}
      </Container>
    </section>
  )
}

function ThreeCol({ pillars }: { pillars: WhyPillar[] }) {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {pillars.map((p, i) => (
        <AnimateOnScroll key={i} stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}>
          <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card transition-all hover:shadow-card-hover">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-[var(--secondary)]/10">
              <IconByName name={p.icon} />
            </div>
            <h3
              className="mb-3 text-xl font-semibold text-[var(--primary)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {p.title}
            </h3>
            <p className="text-[var(--text-light)]">{p.description}</p>
            {p.bullets && p.bullets.length > 0 && (
              <ul className="mt-4 space-y-2">
                {p.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2 text-sm text-[var(--text)]">
                    <span className="text-[var(--secondary)]">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function Alternating({ pillars }: { pillars: WhyPillar[] }) {
  return (
    <div className="mt-12 space-y-16">
      {pillars.map((p, i) => (
        <AnimateOnScroll key={i}>
          <div
            className={
              'grid items-center gap-12 lg:grid-cols-2 ' +
              (i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : '')
            }
          >
            <div>
              {p.icon && (
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-[var(--secondary)]/10">
                  <IconByName name={p.icon} />
                </div>
              )}
              <h3
                className="mb-3 text-2xl font-semibold text-[var(--primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {p.title}
              </h3>
              <p className="text-[var(--text-light)]">{p.description}</p>
              {p.bullets && (
                <ul className="mt-4 space-y-2">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-sm text-[var(--text)]">
                      <span className="text-[var(--secondary)]">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[var(--surface-light)]">
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  )
}
