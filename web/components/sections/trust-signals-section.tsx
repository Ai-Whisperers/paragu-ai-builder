import * as Icons from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export type TrustSignalsVariant = 'credentials' | 'logos-row'

export interface TrustItem {
  icon?: string
  title?: string
  description?: string
  logoUrl?: string
  value?: string
}

export interface TrustSignalsSectionProps {
  variant?: TrustSignalsVariant
  eyebrow?: string
  title?: string
  subtitle?: string
  items: TrustItem[]
}

function IconByName({ name, size = 24 }: { name?: string; size?: number }) {
  if (!name) return null
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name]
  if (!Icon) return null
  return <Icon size={size} className="text-[var(--secondary)]" />
}

export function TrustSignalsSection({
  variant = 'credentials',
  eyebrow,
  title,
  subtitle,
  items,
}: TrustSignalsSectionProps) {
  return (
    <section className="bg-[var(--surface-light)] py-12 sm:py-16">
      <Container>
        {(title || subtitle) && (
          <AnimatedSectionHeader>
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">
                {eyebrow}
              </p>
            )}
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle}</p>
            )}
          </AnimatedSectionHeader>
        )}

        {variant === 'logos-row' ? <LogosRow items={items} /> : <Credentials items={items} />}
      </Container>
    </section>
  )
}

function Credentials({ items }: { items: TrustItem[] }) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <AnimateOnScroll key={i} stagger={((i % 4) + 1) as 1 | 2 | 3 | 4}>
          <div className="rounded-lg bg-[var(--surface)] p-6 text-center shadow-card">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--secondary)]/10">
              <IconByName name={item.icon} />
            </div>
            {item.value && (
              <p
                className="mb-1 text-2xl font-bold text-[var(--primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.value}
              </p>
            )}
            {item.title && (
              <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
            )}
            {item.description && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">{item.description}</p>
            )}
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function LogosRow({ items }: { items: TrustItem[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-70">
      {items.map((item, i) => (
        <div key={i} className="flex h-12 items-center">
          {item.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.logoUrl}
              alt={item.title || 'partner'}
              className="h-full w-auto grayscale transition-all hover:grayscale-0"
              loading="lazy"
            />
          ) : (
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {item.title}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
