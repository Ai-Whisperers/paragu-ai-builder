import Link from 'next/link'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { listActiveProducts } from '@/lib/commerce/products'
import { loadPygRates } from '@/lib/commerce/currency-server'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ProductCard } from '@/components/commerce/product-card'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'

export interface CommerceCatalogSectionProps {
  siteSlug: string
  businessName: string
  title?: string
  subtitle?: string
  viewAllText?: string
  /** Max products to render inline. Excess gets a "see more" link. Default 24. */
  limit?: number
  /** URL locale for cart + PDP links. */
  locale?: string
}

/**
 * Full DB-backed product grid embedded as a homepage / custom-page section.
 * Use when a tenant wants the actual tienda experience surfaced inline on
 * a marketing page (e.g., fun4me's `/fun4me/store` path-based route).
 *
 * Unlike ProductCatalogSection (static JSON, WhatsApp-to-order), this
 * queries the commerce DB at render time and renders the same ProductCard
 * the `/tienda` route uses — so add-to-cart works and prices stay in sync.
 *
 * Includes the cart hydrator so the shopper's cart state loads on this
 * page; the actual cart drawer + /carrito page live at the /s/[locale]/...
 * commerce route tree.
 */
export async function CommerceCatalogSection({
  siteSlug,
  title = 'Nuestros productos',
  subtitle,
  viewAllText = 'Ver catálogo completo',
  limit = 24,
  locale = 'es',
}: CommerceCatalogSectionProps) {
  const business = await resolveBusinessBySlug(siteSlug)
  if (!business || !(await isCommerceEnabled(business.type))) return null

  const [products, rates] = await Promise.all([
    listActiveProducts(business.id, { limit: limit + 1, sort: 'newest' }),
    loadPygRates(),
  ])
  if (products.length === 0) return null

  const hasMore = products.length > limit
  const shown = products.slice(0, limit)

  return (
    <section className="py-12" aria-labelledby="commerce-catalog-heading">
      <CartStoreHydrator siteSlug={siteSlug} initialCart={null} />
      <Container>
        <div className="mb-6 text-center">
          <Heading level={2} id="commerce-catalog-heading" className="text-3xl font-bold text-[color:var(--text,#111)]">
            {title}
          </Heading>
          {subtitle ? <p className="mt-1 text-[color:var(--text-muted,#6b7280)]">{subtitle}</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {shown.map((p, idx) => (
            <ProductCard
              key={p.id}
              siteSlug={siteSlug}
              product={p}
              priority={idx < 4}
              rates={rates}
              locale={locale}
            />
          ))}
        </div>

        {hasMore ? (
          <div className="mt-8 text-center">
            <Link
              href={`/s/${locale}/${siteSlug}/tienda`}
              className="inline-block rounded-lg border border-[color:var(--primary,#111)] px-6 py-3 font-medium text-[color:var(--primary,#111)] hover:bg-[color:var(--primary,#111)] hover:text-[color:var(--primary-foreground,#fff)]"
            >
              {viewAllText} →
            </Link>
          </div>
        ) : null}
      </Container>
    </section>
  )
}
