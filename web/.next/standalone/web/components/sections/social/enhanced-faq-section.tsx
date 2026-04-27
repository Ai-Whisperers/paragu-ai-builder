'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, MessageCircle, Phone, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'

export interface EnhancedFAQItem {
  question: string
  answer: string
  category: string
}

interface FAQSectionProps {
  business: {
    name: string
    whatsapp: string
    phone?: string
  }
  /** Tenants supply their own FAQ items via content/es.json. If omitted or
   * empty, the section renders just the contact CTA card. */
  items?: EnhancedFAQItem[]
  /** Override default section title. */
  title?: string
  /** Override default section subtitle. */
  subtitle?: string
}

type FAQItem = EnhancedFAQItem

// No defaults: this section is content-driven. Tenants MUST supply `items`
// from their content/<locale>.json (see sites/granja-cabral/content/es.json
// for a reference implementation). Leaving this block inline would leak
// brand-specific copy into every tenant that uses the section.

export function EnhancedFAQSection({ business, items, title, subtitle }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchQuery, setSearchQuery] = useState('')

  // Content-driven: tenants supply items via their content file. Categories
  // auto-derive so adopters don't maintain two arrays.
  const allFaqs: FAQItem[] = items ?? []
  const CATEGORIES =
    allFaqs.length > 0
      ? ['Todas', ...Array.from(new Set(allFaqs.map((f) => f.category).filter(Boolean)))]
      : ['Todas']

  const filteredFAQs = allFaqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'Todas' || faq.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  const whatsappUrl = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Tengo una pregunta que no encontré en las FAQs...')}`
  const resolvedTitle = title ?? 'Preguntas Frecuentes'
  const resolvedSubtitle =
    subtitle ?? 'Encontrá respuestas a las dudas más comunes sobre nuestros productos y servicios.'

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Heading level={2} className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">
            {resolvedTitle}
          </Heading>
          <p className="text-lg text-[var(--text-muted)]">{resolvedSubtitle}</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <Input
            type="text"
            placeholder="Buscar preguntas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm ${selectedCategory === category ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <Card 
              key={index} 
              className={`border-[var(--border)] transition-all ${openIndex === index ? 'ring-2 ring-orange-200' : ''}`}
            >
              <button
                id={`enhanced-faq-trigger-${index}`}
                type="button"
                aria-expanded={openIndex === index}
                aria-controls={`enhanced-faq-panel-${index}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left"
              >
                <CardHeader className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-semibold text-[var(--text)]">
                        {faq.question}
                      </CardTitle>
                    </div>
                    <div className="flex-shrink-0 mt-1" aria-hidden="true">
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
              
              {openIndex === index && (
                <div
                  id={`enhanced-faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`enhanced-faq-trigger-${index}`}
                >
                  <CardContent className="pt-0 pb-4">
                    <div className="border-t border-[var(--border)] pt-4">
                      <p className="text-[var(--text-muted)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)] mb-4">No encontramos preguntas con esos criterios.</p>
            <Button 
              variant="outline" 
              onClick={() => {setSearchQuery(''); setSelectedCategory('Todas')}}
            >
              Ver todas las preguntas
            </Button>
          </div>
        )}

        {/* Still Have Questions */}
        <Card className="mt-10 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Heading level={3} className="text-xl font-bold text-[var(--text)] mb-3">
                ¿No encontraste lo que buscabas?
              </Heading>
              <p className="text-[var(--text-muted)] mb-6">
                Estamos para ayudarte. Escribinos por WhatsApp y te respondemos en minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[var(--success)] hover:bg-green-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Preguntar por WhatsApp
                  </Button>
                </Link>
                <Link href={`tel:${business.phone || business.whatsapp}`}>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
