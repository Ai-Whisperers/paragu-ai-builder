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
  return <Icon size={size} className="font-heading text-secondary" />
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
    <section id="por-que" className="font-heading bg-surface py-16 sm:py-24">
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

        {variant === 'alternating' ? (
          <Alternating pillars={pillars} />
        ) : (
          <ThreeCol pillars={pillars} />
        )}

        {honestNote && (
          <AnimateOnScroll>
            <aside className="font-heading mx-auto mt-12 max-w-3xl rounded-lg border-l-4 border-secondary bg-surface-light p-6">
              <p className="font-heading text-sm italic text-muted-foreground">{honestNote}</p>
            </aside>
          </AnimateOnScroll>
        )}
      </Container>
    </section>
  )
}

function ThreeCol({ pillars }: { pillars: WhyPillar[] }) {
  return (
    <div className="font-heading mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {pillars.map((p, i) => (
        <AnimateOnScroll key={i} stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6} className="font-heading h-full">
          <article className="font-heading flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover">
            {p.imageUrl && (
              <div className="font-heading aspect-[4/3] w-full overflow-hidden bg-surface-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="font-heading h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <div className="font-heading flex flex-1 flex-col p-8">
              <div className="font-heading mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-secondary/10">
                <IconByName name={p.icon} />
              </div>
              <Heading level={3}
                className="font-heading mb-3 text-xl font-semibold text-primary"
               
              >
                {p.title}
              </Heading>
              <p className="font-heading text-muted-foreground">{p.description}</p>
              {p.bullets && p.bullets.length > 0 && (
                <ul className="font-heading mt-4 space-y-2">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="font-heading flex gap-2 text-sm text-foreground">
                      <span className="font-heading text-secondary">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function Alternating({ pillars }: { pillars: WhyPillar[] }) {
  return (
    <div className="font-heading mt-12 space-y-16">
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
                <div className="font-heading mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary/10">
                  <IconByName name={p.icon} />
                </div>
              )}
              <Heading level={3}
                className="font-heading mb-3 text-2xl font-semibold text-primary"
               
              >
                {p.title}
              </Heading>
              <p className="font-heading text-muted-foreground">{p.description}</p>
              {p.bullets && (
                <ul className="font-heading mt-4 space-y-2">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="font-heading flex gap-2 text-sm text-foreground">
                      <span className="font-heading text-secondary">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="font-heading aspect-[4/3] overflow-hidden rounded-lg bg-surface-light">
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="font-heading h-full w-full object-cover"
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
