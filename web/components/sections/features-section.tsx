'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface Feature {
  title: string
  description: string
  icon?: string
}

interface FeaturesSectionProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export function FeaturesSection({
  title = 'Por qué elegirnos',
  subtitle,
  features = [],
  columns = 3,
}: FeaturesSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  if (!features.length) {
    return null
  }

  return (
    <section className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        {title && (
          <div className="text-center mb-12">
            <Heading level={2}>{title}</Heading>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${gridCols[columns]}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
              }}
            >
              {feature.icon && (
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  {feature.icon}
                </div>
              )}
              <h3
                className="mb-2 text-lg font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: 'var(--secondary)' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default FeaturesSection