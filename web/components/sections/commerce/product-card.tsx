'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardImage, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { cn } from '@/lib/utils'
import { trackWhatsappClick } from '@/lib/analytics/tenant-events'
import type { ProductItem } from './product-catalog-section'
import { CATALOG_LABELS, buildWhatsAppUrl, buildEmailUrl } from './product-catalog-section'

export function ProductCard({
  product,
  showPrices,
  whatsappPhone,
  orderButtonText,
  orderMessageTemplate,
  emailAddress,
  index,
  labels,
  unavailableText,
  detailHref,
}: {
  product: ProductItem
  showPrices: boolean
  whatsappPhone?: string
  orderButtonText: string
  orderMessageTemplate: string
  emailAddress?: string
  index: number
  labels: (typeof CATALOG_LABELS)[string]
  unavailableText: string
  /** Resolved PDP link — explicit `product.href`, else `product.slug`
   * joined to the catalog-level `productLinkBase`. Undefined when neither
   * is set (card stays non-clickable, only the WhatsApp CTA works). */
  detailHref?: string
}) {
  const isAvailable = product.available !== false

  // Image + title are the natural click target for a PDP entry. Wrap each
  // optionally so the component still works without a link (pre-existing
  // tenants like demo catalogs that never set `slug`).
  const imageNode = product.imageUrl ? (
    <CardImage src={product.imageUrl} alt={product.name} className="font-heading h-64" />
  ) : (
    <div
      className="font-heading flex h-64 items-center justify-center px-6"
      style={{
        background:
          'linear-gradient(135deg, var(--surface) 0%, var(--surface-light, var(--surface)) 100%)',
        borderBottom: '1px solid var(--border)',
      }}
      aria-label={`${product.name} — foto próximamente`}
    >
      <div className="font-heading text-center">
        <p
          className="font-heading font-semibold tracking-wide"
          style={{
            color: 'var(--primary)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          }}
        >
          {product.name}
        </p>
        {product.category && (
          <p
            className="font-heading mt-2 text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            {product.category}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <AnimateOnScroll stagger={index}>
      <Card className="font-heading relative flex flex-col overflow-hidden">
        {product.promoPercent && product.promoPercent > 0 && (
          <div
            className="font-heading absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold shadow-lg"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
            }}
          >
            {product.promoLabel || `-${product.promoPercent}%`}
          </div>
        )}
        {detailHref ? (
          <Link
            href={detailHref}
            aria-label={product.name}
            className="font-heading block transition-transform hover:scale-[1.02]"
          >
            {imageNode}
          </Link>
        ) : (
          imageNode
        )}
        <CardContent className="font-heading flex flex-1 flex-col">
          <div className="font-heading flex items-start justify-between gap-2">
            {detailHref ? (
              <Link
                href={detailHref}
                className="font-heading hover:underline"
                style={{ color: 'inherit' }}
              >
                <CardTitle>{product.name}</CardTitle>
              </Link>
            ) : (
              <CardTitle>{product.name}</CardTitle>
            )}
            {showPrices && product.price && (
              <div className="font-heading flex flex-col items-end gap-0.5">
                {product.priceOriginal && product.promoPercent && (
                  <span
                    className="font-heading text-xs line-through"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {product.priceOriginal}
                  </span>
                )}
                <Badge variant="default">{product.price}</Badge>
              </div>
            )}
          </div>
          {product.description && (
            <CardDescription>{product.description}</CardDescription>
          )}
          {product.category && (
            <p className="font-heading mt-2 text-xs text-muted-foreground">{product.category}</p>
          )}

          <div className="font-heading mt-auto flex flex-col gap-2 pt-4">
            {!isAvailable && (
              <Badge variant="muted" className="font-heading self-start">{unavailableText}</Badge>
            )}
            {isAvailable && whatsappPhone && (
              <Button
                variant="primary"
                size="sm"
                href={buildWhatsAppUrl(whatsappPhone, product, orderMessageTemplate)}
                onClick={() =>
                  trackWhatsappClick({ source: 'catalog', productSlug: product.slug })
                }
              >
                <svg viewBox="0 0 24 24" className="font-heading mr-2 h-4 w-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {orderButtonText}
              </Button>
            )}
            {isAvailable && emailAddress && !whatsappPhone && (
              <Button
                variant="primary"
                size="sm"
                href={buildEmailUrl(emailAddress, product, labels)}
              >
                {orderButtonText}
              </Button>
            )}
            {isAvailable && detailHref && (
              <Link
                href={detailHref}
                className="font-heading text-center text-sm font-medium hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                {labels.detailButton} →
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  )
}
