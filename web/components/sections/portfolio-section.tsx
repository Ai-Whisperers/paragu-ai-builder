'use client'

import { useState } from 'react'
import PortfolioGalleryComponent from '@/components/portfolio/portfolio-gallery'

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
  columns?: 2 | 3 | 4
}

export function PortfolioSection({
  title = 'Nuestro Portafolio',
  subtitle,
  items,
  categories = [],
  columns = 3
}: PortfolioSectionProps) {
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
    <section id="portafolio" className="bg-[var(--background)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        {uniqueCategories.length > 0 && (
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white'
              }`}
            >
              Todos
            </button>
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--surface-light)]"
            >
              {item.image || item.imageUrl ? (
                <img
                  src={item.image || item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                  <span className="text-4xl font-bold text-white opacity-30">
                    {item.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-normal group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  {item.category && (
                    <p className="text-sm text-white/80">{item.category}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}