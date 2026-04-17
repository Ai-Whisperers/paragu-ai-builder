'use client'

import BeforeAfterComponent from '@/components/portfolio/before-after'

interface BeforeAfterItem {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  title?: string
}

interface BeforeAfterSectionProps {
  title?: string
  subtitle?: string
  items: BeforeAfterItem[]
}

export function BeforeAfterSection({
  title = 'Antes y Después',
  subtitle,
  items
}: BeforeAfterSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="bg-[var(--surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <BeforeAfterComponent
              key={index}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              beforeLabel={item.beforeLabel || 'Antes'}
              afterLabel={item.afterLabel || 'Después'}
              title={item.title}
            />
          ))}
        </div>
      </div>
    </section>
  )
}