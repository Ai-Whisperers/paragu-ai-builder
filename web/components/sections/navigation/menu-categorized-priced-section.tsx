'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { useMemo, useState } from 'react'

export interface MenuItem {
  name: string
  description?: string
  price?: string
  category: string
  dietary?: string[]
  imageUrl?: string
  featured?: boolean
}

export interface MenuCategorizedPricedSectionProps {
  title: string
  subtitle?: string
  items: MenuItem[]
  categories?: Array<{ id: string; name: string }>
  showPrices?: boolean
}

export function MenuCategorizedPricedSection({
  title,
  subtitle,
  items,
  categories,
  showPrices = true,
}: MenuCategorizedPricedSectionProps) {
  const derivedCategories = useMemo(() => {
    if (categories?.length) return categories
    const seen = new Set<string>()
    for (const item of items) {
      if (!seen.has(item.category)) seen.add(item.category)
    }
    return Array.from(seen).map((id) => ({ id, name: id }))
  }, [categories, items])

  const [activeCategory, setActiveCategory] = useState<string>(derivedCategories[0]?.id ?? '')

  const visibleItems = useMemo(
    () => items.filter((item) => !activeCategory || item.category === activeCategory),
    [items, activeCategory],
  )

  return (
    <section className="py-16 bg-background">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </AnimatedSectionHeader>

        {derivedCategories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {derivedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-[var(--primary-foreground)]'
                    : 'bg-surface-light text-foreground hover:bg-surface'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto">
          {visibleItems.map((item, idx) => (
            <Card key={`${item.category}-${item.name}-${idx}`} className="h-full">
              <CardContent className="p-5">
                <div className="flex justify-between items-baseline gap-4 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Heading level={3} className="font-semibold text-lg text-foreground">{item.name}</Heading>
                    {item.featured && <Badge>Recomendado</Badge>}
                  </div>
                  {showPrices && item.price && (
                    <span className="font-bold text-primary whitespace-nowrap">{item.price}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                )}
                {item.dietary && item.dietary.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.dietary.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleItems.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No hay platos en esta categoria.</p>
        )}
      </Container>
    </section>
  )
}
