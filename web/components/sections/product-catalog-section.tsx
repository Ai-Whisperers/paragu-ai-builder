'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardImage, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { useState } from 'react'

export interface ProductItem {
  name: string
  description?: string
  price?: string
  imageUrl?: string
  category?: string
  available?: boolean
}

export interface ProductCatalogSectionProps {
  title: string
  subtitle?: string
  products: ProductItem[]
  categories?: string[]
  showPrices?: boolean
  whatsappPhone?: string
  orderButtonText?: string
  orderMessageTemplate?: string
  emailAddress?: string
}

function buildWhatsAppUrl(
  phone: string,
  product: ProductItem,
  messageTemplate: string
): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const message = messageTemplate
    .replace('{{productName}}', product.name)
    .replace('{{productPrice}}', product.price || 'consultar')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

function buildEmailUrl(email: string, product: ProductItem): string {
  const subject = encodeURIComponent(`Consulta: ${product.name}`)
  const body = encodeURIComponent(
    `Hola! Me interesa el diseno "${product.name}"${product.price ? ` ($${product.price})` : ''}. Quisiera mas informacion.`
  )
  return `mailto:${email}?subject=${subject}&body=${body}`
}

function ProductCard({
  product,
  showPrices,
  whatsappPhone,
  orderButtonText,
  orderMessageTemplate,
  emailAddress,
  index,
}: {
  product: ProductItem
  showPrices: boolean
  whatsappPhone?: string
  orderButtonText: string
  orderMessageTemplate: string
  emailAddress?: string
  index: number
}) {
  const isAvailable = product.available !== false

  return (
    <AnimateOnScroll stagger={index}>
      <Card className="flex flex-col overflow-hidden">
        {product.imageUrl && (
          <CardImage src={product.imageUrl} alt={product.name} className="h-64" />
        )}
        <CardContent className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{product.name}</CardTitle>
            {showPrices && product.price && (
              <Badge variant="default">{product.price}</Badge>
            )}
          </div>
          {product.description && (
            <CardDescription>{product.description}</CardDescription>
          )}
          {product.category && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">{product.category}</p>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-4">
            {!isAvailable && (
              <Badge variant="muted" className="self-start">No disponible</Badge>
            )}
            {isAvailable && whatsappPhone && (
              <Button
                variant="primary"
                size="sm"
                href={buildWhatsAppUrl(whatsappPhone, product, orderMessageTemplate)}
              >
                <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {orderButtonText}
              </Button>
            )}
            {isAvailable && emailAddress && !whatsappPhone && (
              <Button
                variant="primary"
                size="sm"
                href={buildEmailUrl(emailAddress, product)}
              >
                {orderButtonText}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}

export function ProductCatalogSection({
  title,
  subtitle,
  products,
  categories,
  showPrices = true,
  whatsappPhone,
  orderButtonText = 'Consultar por WhatsApp',
  orderMessageTemplate = 'Hola! Me interesa el diseno: {{productName}} (${{productPrice}}). Quisiera mas informacion.',
  emailAddress,
}: ProductCatalogSectionProps) {
  // Build categories list from products if not explicitly provided
  const allCategories = categories || [
    ...new Set(products.filter((p) => p.category).map((p) => p.category!)),
  ]
  const hasCategories = allCategories.length > 0

  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products

  return (
    <section id="catalogo" className="bg-[var(--surface-light)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {/* Category filter tabs */}
        {hasCategories && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-normal ${
                activeCategory === null
                  ? 'bg-[var(--secondary)] text-white shadow-button'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
              }`}
            >
              Todos
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-normal ${
                  activeCategory === cat
                    ? 'bg-[var(--secondary)] text-white shadow-button'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={`${product.name}-${index}`}
              product={product}
              showPrices={showPrices}
              whatsappPhone={whatsappPhone}
              orderButtonText={orderButtonText}
              orderMessageTemplate={orderMessageTemplate}
              emailAddress={emailAddress}
              index={index}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="py-12 text-center text-[var(--text-muted)]">
            No hay productos disponibles en esta categoria.
          </p>
        )}
      </Container>
    </section>
  )
}
