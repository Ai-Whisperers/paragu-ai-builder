import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/heading'

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
    <Section spacing="md" background="surface" className="font-heading">
      <div className="font-heading mx-auto max-w-6xl px-4">
        <div className="font-heading text-center mb-12">
          <Heading level={2} className="font-heading text-xl sm:text-3xl font-bold text-foreground">
            {title}
          </Heading>
          {subtitle && (
            <p className="font-heading mt-2 text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="font-heading grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
    </Section>
  )
}