'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardImage, CardTitle, CardDescription } from '@/components/ui/card'
import { cleanPhone } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { useState } from 'react'
import { trackWhatsappClick } from '@/lib/analytics/tenant-events'
import { ProductCard } from './product-card'

export interface ProductItem {
  name: string
  description?: string
  price?: string
  /** Original price shown crossed out when promoPercent is present. */
  priceOriginal?: string
  /** Percent off — renders a corner discount ribbon + crosses out priceOriginal. */
  promoPercent?: number
  /** Optional label shown on the ribbon. Defaults to "-{promoPercent}%". */
  promoLabel?: string
  imageUrl?: string
  category?: string
  available?: boolean
  /**
   * If set, the product card image + title become a link to this URL
   * (usually a PDP), and a "Ver detalle" secondary CTA is rendered below
   * the primary WhatsApp button. Shape-equivalent to `href` — callers can
   * pass either; `href` wins when both are present.
   */
  slug?: string
  href?: string
}

export interface ProductCatalogSectionProps {
  title: string
  subtitle?: string
  products?: ProductItem[]
  /** Legacy alias */
  items?: ProductItem[]
  categories?: string[]
  showPrices?: boolean
  whatsappPhone?: string
  orderButtonText?: string
  orderMessageTemplate?: string
  emailAddress?: string
  /**
   * If set, each product without an explicit `href` gets a link to
   * `<productLinkBase>/<product.slug>`. Enables a one-line toggle: set
   * `productLinkBase: "/s/es/superspuma/producto"` in content and every
   * card becomes a PDP entry point.
   */
  productLinkBase?: string
  /**
   * Locale-keyed catalog labels — passed by the content pipeline.
   * Falls back to CATALOG_LABELS inline constant when not supplied.
   */
  catalogLabels?: Record<string, {
    all: string
    orderButton: string
    detailButton: string
    orderTemplate: string
    emailSubject: (name: string) => string
    emailBody: (name: string, price?: string) => string
  }>
  __locale?: string
}

export const CATALOG_LABELS: Record<
  string,
  {
    all: string
    orderButton: string
    detailButton: string
    orderTemplate: string
    emailSubject: (name: string) => string
    emailBody: (name: string, price?: string) => string
  }
> = {
  en: {
    all: 'All',
    orderButton: 'Ask via WhatsApp',
    detailButton: 'View details',
    orderTemplate:
      "Hi! I'm interested in: {{productName}} (${{productPrice}}). Could you tell me more?",
    emailSubject: (name) => `Inquiry: ${name}`,
    emailBody: (name, price) =>
      `Hi! I'm interested in "${name}"${price ? ` ($${price})` : ''}. Could you send more info?`,
  },
  es: {
    all: 'Todos',
    orderButton: 'Consultar por WhatsApp',
    detailButton: 'Ver detalle',
    orderTemplate:
      'Hola! Me interesa el diseno: {{productName}} (${{productPrice}}). Quisiera mas informacion.',
    emailSubject: (name) => `Consulta: ${name}`,
    emailBody: (name, price) =>
      `Hola! Me interesa el diseno "${name}"${price ? ` ($${price})` : ''}. Quisiera mas informacion.`,
  },
  de: {
    all: 'Alle',
    orderButton: 'Über WhatsApp anfragen',
    detailButton: 'Details ansehen',
    orderTemplate:
      'Hallo! Ich interessiere mich für: {{productName}} (${{productPrice}}). Können Sie mir mehr Informationen geben?',
    emailSubject: (name) => `Anfrage: ${name}`,
    emailBody: (name, price) =>
      `Hallo! Ich interessiere mich für "${name}"${price ? ` ($${price})` : ''}. Können Sie mir mehr Informationen senden?`,
  },
  pt: {
    all: 'Todos',
    orderButton: 'Consultar pelo WhatsApp',
    detailButton: 'Ver detalhes',
    orderTemplate:
      'Olá! Tenho interesse em: {{productName}} (${{productPrice}}). Poderia me enviar mais informações?',
    emailSubject: (name) => `Consulta: ${name}`,
    emailBody: (name, price) =>
      `Olá! Tenho interesse em "${name}"${price ? ` ($${price})` : ''}. Poderia me enviar mais informações?`,
  },
  nl: {
    all: 'Alle',
    orderButton: 'Vraag via WhatsApp',
    detailButton: 'Bekijk details',
    orderTemplate:
      'Hallo! Ik heb interesse in: {{productName}} (${{productPrice}}). Kunt u mij meer vertellen?',
    emailSubject: (name) => `Aanvraag: ${name}`,
    emailBody: (name, price) =>
      `Hallo! Ik heb interesse in "${name}"${price ? ` ($${price})` : ''}. Kunt u mij meer informatie sturen?`,
  },
}

export function buildWhatsAppUrl(
  phone: string,
  product: ProductItem,
  messageTemplate: string
): string {
  const cleaned = cleanPhone(phone) || ''
  const msg = messageTemplate || 'Hola! Me interesa {{productName}}. Quisiera mas informacion.'
  const message = msg
    .replace('{{productName}}', product.name || '')
    .replace('{{productPrice}}', product.price || 'consultar')
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}

export function buildEmailUrl(
  email: string,
  product: ProductItem,
  labels: (typeof CATALOG_LABELS)[string],
): string {
  const subject = encodeURIComponent(labels.emailSubject(product.name))
  const body = encodeURIComponent(labels.emailBody(product.name, product.price))
  return `mailto:${email}?subject=${subject}&body=${body}`
}

export function ProductCatalogSection({
  title,
  subtitle,
  products: productsProp,
  items,
  categories,
  showPrices = true,
  whatsappPhone,
  orderButtonText,
  orderMessageTemplate,
  emailAddress,
  productLinkBase,
  catalogLabels,
  __locale = 'es',
}: ProductCatalogSectionProps) {
  const resolvedLabels = catalogLabels ?? CATALOG_LABELS
  const labels = resolvedLabels[__locale] ?? resolvedLabels.es
  const resolvedOrderButton = orderButtonText ?? labels.orderButton
  const resolvedOrderTemplate = orderMessageTemplate ?? labels.orderTemplate
  const unavailableText = __locale === 'en' ? 'Unavailable' : 'No disponible'
  const products = productsProp || items || []

  // Hooks must be called before any early return — conditional hook calls
  // break React's ordering invariant. Derive a stable category set even
  // when there are zero products, then early-return just the render.
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  if (products.length === 0) return null

  // Build categories list from products if not explicitly provided
  const allCategories = categories || [
    ...new Set(products.filter((p) => p.category).map((p) => p.category!)),
  ]
  const hasCategories = allCategories.length > 0

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products

  return (
    <section id="catalogo" className="bg-surface-light py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {/* Category filter tabs */}
        {hasCategories && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-normal ${
                activeCategory === null
                  ? 'bg-secondary text-white shadow-button'
                  : 'bg-surface text-muted-foreground hover:bg-surface hover:text-foreground'
              }`}
            >
              {labels.all}
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-normal ${
                  activeCategory === cat
                    ? 'bg-secondary text-white shadow-button'
                    : 'bg-surface text-muted-foreground hover:bg-surface hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            // Prefer explicit per-product `href`, else derive from
            // `productLinkBase` + product.slug. Falsy (or no slug) means
            // the card stays non-navigable — existing demo catalogs keep
            // working unchanged.
            const detailHref = product.href
              ?? (productLinkBase && product.slug
                ? `${productLinkBase.replace(/\/$/, '')}/${product.slug}`
                : undefined)
            return (
              <ProductCard
                key={`${product.name}-${index}`}
                product={product}
                showPrices={showPrices}
                whatsappPhone={whatsappPhone}
                orderButtonText={resolvedOrderButton}
                orderMessageTemplate={resolvedOrderTemplate}
                emailAddress={emailAddress}
                index={index}
                labels={labels}
                unavailableText={unavailableText}
                detailHref={detailHref}
              />
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            {__locale === 'en'
              ? 'No products available in this category.'
              : 'No hay productos disponibles en esta categoria.'}
          </p>
        )}
      </Container>
    </section>
  )
}
