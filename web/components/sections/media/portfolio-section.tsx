'use client'

import Image from 'next/image'
import { Heading } from '@/components/ui/heading'

import { useState } from 'react'

interface PortfolioItem {
  title: string
  description?: string
  image?: string
  imageUrl?: string
  category?: string
  client?: string
  year?: string
}

interface PortfolioSectionProps {
  title?: string
  subtitle?: string
  items: PortfolioItem[]
  categories?: string[]
  labels?: Record<string, { title: string; all: string }>
  __locale?: string
}

const PORTFOLIO_LABELS: Record<string, { title: string; all: string }> = {
  en: { title: 'Our Portfolio', all: 'All' },
  es: { title: 'Nuestro Portafolio', all: 'Todos' },
  de: { title: 'Unser Portfolio', all: 'Alle' },
  pt: { title: 'Nosso Portfólio', all: 'Todos' },
  nl: { title: 'Ons Portfolio', all: 'Alle' },
}

export function PortfolioSection({
  title,
  subtitle,
  items,
  categories = [],
  __locale = 'es',
  labels: labelsProp,
}: PortfolioSectionProps) {
  const resolvedLabels = labelsProp ?? PORTFOLIO_LABELS
  const labels = resolvedLabels[__locale] ?? resolvedLabels.es
  const resolvedTitle = title ?? labels.title
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory)

  if (items.length === 0) {
    return null
  }

  const uniqueCategories = categories.length > 0 
    ? categories 
    : [...new Set(items.map(item => item.category).filter(Boolean))] as string[]

  return (
    <div className="font-heading bg-background py-16 sm:py-20">
      <div className="font-heading mx-auto  px-4">
        <div className="font-heading text-center mb-12">
          <Heading level={2} className="font-heading text-xl sm:text-3xl font-bold text-foreground">
            {resolvedTitle}
          </Heading>
          {subtitle && (
            <p className="font-heading mt-2 text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {uniqueCategories.length > 0 && (
          <div className="font-heading flex justify-center gap-2 flex-wrap mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-secondary text-[var(--secondary-foreground)]'
                  : 'bg-surface-light text-foreground hover:bg-secondary hover:text-[var(--secondary-foreground)]'
              }`}
            >
              {labels.all}
            </button>
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-secondary text-[var(--secondary-foreground)]'
                    : 'bg-surface-light text-foreground hover:bg-secondary hover:text-[var(--secondary-foreground)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

                <div className="font-heading grid gap-[var(--portfolio-gap,1rem)] sm:grid-cols-[var(--portfolio-cols-sm,repeat(2,minmax(0,1fr)))] lg:grid-cols-[var(--portfolio-cols-lg,repeat(3,minmax(0,1fr)))]">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="font-heading group relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-light"
            >
              {item.image || item.imageUrl ? (
                <Image
                  src={item.image || item.imageUrl || ''}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="font-heading object-cover transition-transform duration-slow group-hover:scale-110"
                  unoptimized={(item.image || item.imageUrl || '').startsWith('data:')}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  fetchPriority={index < 4 ? 'high' : undefined}
                />
              ) : (
                <div className="font-heading flex h-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                  <span className="font-heading text-2xl sm:text-4xl font-bold text-white opacity-30">
                    {item.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="font-heading absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-normal group-hover:opacity-100">
                <div className="font-heading absolute bottom-0 left-0 right-0 p-4">
                  <Heading level={3} className="font-heading text-lg font-semibold text-white">{item.title}</Heading>
                  {item.category && (
                    <p className="font-heading text-sm text-white/80">{item.category}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}