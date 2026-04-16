'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { useLocale } from '@/lib/i18n/language-context'

export interface ServiceCategoryItem {
  key: string
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  defaultServices?: Array<{
    name: string
    nameEn?: string
    description?: string
    descriptionEn?: string
    price?: string | null
    priceFrom?: string | null
    duration?: number
  }>
}

export interface ServiceCategoriesSectionProps {
  title: string
  titleEn?: string
  subtitle?: string
  subtitleEn?: string
  categories: ServiceCategoryItem[]
}

const CATEGORY_ICONS: Record<string, string> = {
  migratorios: '🛂',
  empresariales: '🏢',
  bancarios: '🏦',
  contables: '📊',
  logisticos: '🚗',
  inversion: '📈',
}

export function ServiceCategoriesSection({
  title,
  titleEn,
  subtitle,
  subtitleEn,
  categories,
}: ServiceCategoriesSectionProps) {
  const { t } = useLocale()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="servicios" className="py-16 sm:py-20" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2} className="mb-3 text-center" style={{ color: 'var(--primary)' }}>
            {t(title, titleEn)}
          </Heading>
          {subtitle && (
            <p className="mx-auto mb-12 max-w-2xl text-center text-lg" style={{ color: 'var(--text-muted)' }}>
              {t(subtitle, subtitleEn)}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className="mx-auto max-w-4xl space-y-4">
          {categories.map((cat, idx) => {
            const isOpen = openIdx === idx
            const icon = CATEGORY_ICONS[cat.key] || '📋'

            return (
              <AnimateOnScroll key={cat.key} stagger={idx}>
                <div
                  className="overflow-hidden rounded-xl transition-shadow duration-300"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: isOpen ? '2px solid var(--secondary)' : '1px solid var(--border)',
                    boxShadow: isOpen ? '0 4px 20px rgba(27,42,74,0.08)' : 'none',
                  }}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`cat-${cat.key}`}
                  >
                    <span className="text-2xl" aria-hidden="true">{icon}</span>
                    <div className="flex-grow">
                      <h3
                        className="text-lg font-bold"
                        style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                      >
                        {t(cat.title, cat.titleEn)}
                      </h3>
                      {cat.description && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                          {t(cat.description, cat.descriptionEn)}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      size={20}
                      className="flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: 'var(--text-muted)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {/* Expanded Services */}
                  <div
                    id={`cat-${cat.key}`}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: isOpen ? '600px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                    role="region"
                    aria-labelledby={`cat-heading-${cat.key}`}
                  >
                    {cat.defaultServices && cat.defaultServices.length > 0 && (
                      <div className="border-t px-6 pb-5 pt-4" style={{ borderColor: 'var(--border)' }}>
                        <div className="space-y-3">
                          {cat.defaultServices.map((svc, svcIdx) => (
                            <div
                              key={svcIdx}
                              className="flex items-start gap-3 rounded-lg p-3"
                              style={{ backgroundColor: 'var(--surface-light)' }}
                            >
                              <span
                                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
                                style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
                                aria-hidden="true"
                              >
                                ✓
                              </span>
                              <div>
                                <p className="font-medium" style={{ color: 'var(--text)' }}>
                                  {t(svc.name, svc.nameEn)}
                                </p>
                                {svc.description && (
                                  <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                                    {t(svc.description, svc.descriptionEn)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
