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
  /**
   * Optional institutional/photo thumbnail. When present we render a
   * 40x40 rounded square in place of the icon circle. Accepts a bare URL
   * or the `{src, alt}` shape produced by `{ $img: "trust.<key>" }`.
   */
  image?: string | { src: string; alt: string }
}

export interface TrustSignalsSectionProps {
  variant?: TrustSignalsVariant
  eyebrow?: string
  title?: string
  subtitle?: string
  items?: TrustItem[]
  /** Legacy alias for `items` — some content files ship this key instead. */
  credentials?: TrustItem[]
  /**
   * Optional background image for the whole section — lets trust-heavy
   * tenants put an institutional photo behind their badges. Omit to keep
   * the default flat surface styling.
   */
  backgroundImage?: string
}

function itemImage(img: TrustItem['image']): { src: string; alt: string } | null {
  if (!img) return null
  if (typeof img === 'string') return { src: img, alt: '' }
  if (typeof img === 'object' && typeof img.src === 'string') {
    return { src: img.src, alt: img.alt ?? '' }
  }
  return null
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
  credentials,
  backgroundImage,
}: TrustSignalsSectionProps) {
  const resolvedItems = items || credentials || []
  if (resolvedItems.length === 0 && !title && !subtitle) return null
  const sectionStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined
  return (
    <section className="bg-[var(--surface-light)] py-12 sm:py-16" style={sectionStyle}>
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

        {variant === 'logos-row' ? <LogosRow items={resolvedItems} /> : <Credentials items={resolvedItems} />}
      </Container>
    </section>
  )
}

function Credentials({ items }: { items: TrustItem[] }) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
      {items.map((item, i) => {
        const img = itemImage(item.image)
        return (
        <AnimateOnScroll key={i} stagger={((i % 4) + 1) as 1 | 2 | 3 | 4} className="h-full">
          <div className="flex h-full flex-col rounded-lg bg-[var(--surface)] p-6 text-center shadow-card">
            {img ? (
              <div className="mx-auto mb-3 h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--surface-light)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || item.title || ''}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="mx-auto mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/10">
                <IconByName name={item.icon} />
              </div>
            )}
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
        )
      })}
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
