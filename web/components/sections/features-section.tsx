'use client'

import * as Icons from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface Feature {
  title: string
  description: string
  icon?: string
  /**
   * Optional link target. When set, the card is rendered as a clickable
   * anchor. If the URL points at a non-HTML asset we add the `download`
   * attribute so browsers save the file instead of trying to render it.
   */
  href?: string
}

interface FeaturesSectionProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  /** Active URL locale — picks a localized default for `title` when caller omits it. */
  __locale?: string
}

const FEATURES_DEFAULT_TITLE: Record<string, string> = {
  de: 'Warum uns wählen',
  en: 'Why choose us',
  es: 'Por qué elegirnos',
  nl: 'Waarom ons kiezen',
  pt: 'Por que nos escolher',
}

const DOWNLOAD_LABEL: Record<string, string> = {
  de: 'Herunterladen',
  en: 'Download',
  es: 'Descargar',
  nl: 'Downloaden',
  pt: 'Baixar',
}

function FeatureIcon({ name }: { name?: string }) {
  if (!name) return null
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name]
  if (!Icon) return null
  return <Icon size={24} className="text-[var(--primary-foreground)]" />
}

function isDownloadableAsset(href: string): boolean {
  try {
    const path = href.split('?')[0].split('#')[0]
    const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase()
    return ['pdf', 'md', 'zip', 'csv', 'xlsx', 'docx', 'pptx'].includes(ext)
  } catch {
    return false
  }
}

export function FeaturesSection({
  title,
  subtitle,
  features = [],
  columns = 3,
  __locale,
}: FeaturesSectionProps) {
  const resolvedTitle = title || FEATURES_DEFAULT_TITLE[__locale ?? 'es'] || FEATURES_DEFAULT_TITLE.es
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
        {resolvedTitle && (
          <div className="text-center mb-12">
            <Heading level={2}>{resolvedTitle}</Heading>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${gridCols[columns]}`}>
          {features.map((feature, index) => {
            const downloadable = feature.href ? isDownloadableAsset(feature.href) : false
            const downloadLabel = DOWNLOAD_LABEL[__locale ?? 'es'] || DOWNLOAD_LABEL.es
            const cardClass = `flex h-full flex-col rounded-xl p-6 ${
              feature.href
                ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                : ''
            }`
            const cardStyle = {
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
            } as const
            const inner = (
              <>
                {feature.icon && (
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    <FeatureIcon name={feature.icon} />
                  </div>
                )}
                <Heading level={3}
                  className="mb-2 text-lg font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {feature.title}
                </Heading>
                <p
                  className="text-sm"
                  style={{ color: 'var(--secondary)' }}
                >
                  {feature.description}
                </p>
                {feature.href && (
                  <span
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: 'var(--primary)' }}
                  >
                    {downloadLabel}
                    <Icons.ArrowDownToLine size={16} />
                  </span>
                )}
              </>
            )
            return feature.href ? (
              <a
                key={index}
                href={feature.href}
                {...(downloadable ? { download: '' } : {})}
                className={cardClass}
                style={cardStyle}
              >
                {inner}
              </a>
            ) : (
              <div key={index} className={cardClass} style={cardStyle}>
                {inner}
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default FeaturesSection