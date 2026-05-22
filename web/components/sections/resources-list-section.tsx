import * as Icons from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface ResourceItem {
  icon?: string
  title: string
  description: string
  href?: string
}

interface ResourcesListSectionProps {
  title?: string
  subtitle?: string
  features?: ResourceItem[]
  items?: ResourceItem[]
  columns?: 2 | 3 | 4
  downloadLabel?: string
  locale?: string
}

const DOWNLOAD_LABEL: Record<string, string> = {
  de: 'Herunterladen',
  en: 'Download',
  es: 'Descargar',
  nl: 'Downloaden',
  pt: 'Baixar',
}

const GRID_COLS: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

const DOWNLOADABLE_EXTS = new Set(['pdf', 'md', 'zip', 'csv', 'xlsx', 'docx', 'pptx'])

function isDownloadableAsset(href: string): boolean {
  const path = href.split('?')[0].split('#')[0]
  const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase()
  return DOWNLOADABLE_EXTS.has(ext)
}

function IconByName({ name }: { name?: string }) {
  if (!name) return null
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name]
  if (!Icon) return null
  return <Icon size={24} className="text-[var(--primary-foreground)]" />
}

export function ResourcesListSection({
  title,
  subtitle,
  features,
  items,
  columns = 3,
  downloadLabel: downloadLabelProp,
  locale = 'es',
}: ResourcesListSectionProps) {
  const list = features || items || []
  if (list.length === 0) return null
  const downloadLabel = downloadLabelProp || DOWNLOAD_LABEL[locale] || DOWNLOAD_LABEL.es

  return (
    <section className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${GRID_COLS[columns]}`}>
          {list.map((item, i) => {
            const downloadable = item.href ? isDownloadableAsset(item.href) : false
            const cardClass =
              'flex h-full flex-col rounded-xl p-6 transition-all duration-300' +
              (item.href ? ' hover:-translate-y-1 hover:shadow-lg' : '')
            const cardStyle = {
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
            } as const
            const inner = (
              <>
                {item.icon && (
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    <IconByName name={item.icon} />
                  </div>
                )}
                <Heading
                  level={3}
                  className="mb-2 text-lg font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {item.title}
                </Heading>
                <p className="text-sm" style={{ color: 'var(--secondary)' }}>
                  {item.description}
                </p>
                {item.href && (
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
            return item.href ? (
              <a
                key={i}
                href={item.href}
                {...(downloadable ? { download: '' } : {})}
                className={cardClass}
                style={cardStyle}
              >
                {inner}
              </a>
            ) : (
              <div key={i} className={cardClass} style={cardStyle}>
                {inner}
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default ResourcesListSection
