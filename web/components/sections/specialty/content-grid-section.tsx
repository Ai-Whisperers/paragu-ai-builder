'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export interface ContentGridItem {
  id?: string
  title: string
  description?: string
  image?: string
  icon?: string
  badge?: string
  href?: string
  metadata?: Record<string, string>
}

export interface ContentGridSectionProps {
  variant?: 'cards' | 'grid' | 'masonry' | 'list' | 'detailed' | 'carousel' | 'icon-cards'
  items: ContentGridItem[]
  columns?: 2 | 3 | 4
  cardStyle?: 'minimal' | 'standard' | 'detailed' | 'horizontal' | 'icon-card'
  imageShape?: 'square' | 'rounded' | 'circle' | 'none'
  title?: string
  subtitle?: string
  showFilters?: boolean
  filterKey?: string
}

export function ContentGridSection({
  variant = 'cards',
  items,
  columns = 3,
  cardStyle = 'standard',
  imageShape = 'rounded',
  title,
  subtitle,
  showFilters = false,
  filterKey = 'category',
}: ContentGridSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  if (!items || items.length === 0) return null

  const safeColumns = Math.min(columns, 4) as 2 | 3 | 4
  const gridCols: Record<number, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  const categories = showFilters
    ? ['all', ...new Set(items.map((i) => i.badge).filter(Boolean) as string[])]
    : []

  const filtered = showFilters && activeFilter !== 'all'
    ? items.filter((i) => i.badge === activeFilter)
    : items

  const imgClass = imageShape === 'circle'
    ? 'rounded-full'
    : imageShape === 'square'
    ? 'rounded-none'
    : 'rounded-lg'

  return (
    <section className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        {(title || subtitle) && (
          <AnimatedSectionHeader>
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle}</p>
            )}
          </AnimatedSectionHeader>
        )}

        {showFilters && categories.length > 1 && (
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === cat
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white'
                }`}
              >
                {cat === 'all' ? (variant === 'icon-cards' ? 'Todos' : 'All') : cat}
              </button>
            ))}
          </div>
        )}

        {variant === 'list' ? (
          <div className="space-y-6">
            {filtered.map((item, i) => (
              <div key={i} className="flex gap-6 p-6 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                {item.image && (
                  <img src={item.image} alt={item.title} className={`w-24 h-24 object-cover ${imgClass}`} />
                )}
                <div className="flex-1">
                  <Heading level={3} className="text-lg font-semibold">{item.title}</Heading>
                  {item.description && <p className="mt-2 text-[var(--text-muted)]">{item.description}</p>}
                  {item.badge && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : variant === 'detailed' ? (
          <div className={`grid ${gridCols[safeColumns]} gap-6`}>
            {filtered.map((item, i) => (
              <AnimateOnScroll key={i} stagger={((i % safeColumns) + 1) as 1 | 2 | 3 | 4}>
                <div className="group bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden transition-all hover:shadow-card-hover">
                  {item.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <Heading level={3} className="text-lg font-semibold">{item.title}</Heading>
                    {item.description && (
                      <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-3">{item.description}</p>
                    )}
                    {item.badge && (
                      <span className="inline-block mt-3 text-xs px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.href && (
                      <a href={item.href} className="mt-3 inline-block text-sm text-[var(--primary)] font-medium hover:underline">
                        Ver más →
                      </a>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        ) : (
          <div className={`grid ${gridCols[safeColumns]} gap-6`}>
            {filtered.map((item, i) => (
              <AnimateOnScroll key={i} stagger={((i % safeColumns) + 1) as 1 | 2 | 3 | 4}>
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 transition-all hover:shadow-card-hover">
                  {item.image && (
                    <img src={item.image} alt={item.title} className={`w-full h-40 object-cover mb-4 ${imgClass}`} />
                  )}
                  {item.icon && (
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                  )}
                  <Heading level={3} className="text-lg font-semibold">{item.title}</Heading>
                  {item.description && (
                    <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-3">{item.description}</p>
                  )}
                  {item.badge && (
                    <span className="inline-block mt-3 text-xs px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
