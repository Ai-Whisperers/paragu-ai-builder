import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  /** Omit href on the terminal (current) item so it renders as plain text. */
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
  /** Base URL used to absolute-ize schema.org itemid values. Required for
   * valid structured data — Google rejects relative breadcrumb URLs. */
  absoluteBaseUrl?: string
}

/**
 * Breadcrumb nav + matching BreadcrumbList JSON-LD. The visible crumbs
 * and the schema entries share the same source so they can't drift.
 *
 * Renders nothing for 0- or 1-item trails (a breadcrumb of just the
 * current page is noise).
 */
export function Breadcrumbs({ items, absoluteBaseUrl }: Props) {
  if (items.length < 2) return null

  const base = absoluteBaseUrl?.replace(/\/$/, '') ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `${base}${item.href}` : undefined,
    })),
  }

  return (
    <nav aria-label="Migas de pan" className="mx-auto mb-4 max-w-6xl px-4 pt-4 text-sm text-[color:var(--text-muted,#6b7280)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${i}-${item.label}`} className="flex items-center gap-1.5">
              {i > 0 ? <span aria-hidden="true">/</span> : null}
              {isLast || !item.href ? (
                <span
                  className="truncate text-[color:var(--text,#111)]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
