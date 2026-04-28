import { Section } from '@/components/ui/section'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { listActiveProducts } from '@/lib/commerce/products'
import { formatCents } from '@/lib/commerce/compute-totals'
import { logger } from '@/lib/logger'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface FeaturedProductsSectionProps {
  siteSlug: string
  businessName: string
  title: string
  subtitle?: string
  viewAllText: string
  limit: number
  /** Optional — the URL locale the page was rendered at. Defaults to 'es'. */
  locale?: string
}

/**
 * Server-rendered homepage "featured products" rail. Queries the live
 * commerce DB at render time so what shoppers see on the landing page
 * matches tienda. Early-returns null when the business has no active
 * products or commerce is disabled, so tenants can keep the section in
 * their page config without worrying about empty states.
 *
 * Unlike ProductCatalogSection (static JSON, WhatsApp-to-order), this
 * links to real PDPs. Add-to-cart happens there — homepage's job is
 * discovery, not conversion.
 */
export async function FeaturedProductsSection({
  siteSlug,
  title,
  subtitle,
  viewAllText,
  limit,
  locale = 'es',
}: FeaturedProductsSectionProps) {
  // Opt the host page out of static generation — same reason as
  // CommerceCatalogSection: the data fetches use cookies via the Supabase
  // admin client, which Next.js forbids during SSG.
  noStore()

  // Fail-soft: any crash in the data layer returns null instead of 500ing
  // the page. The tenant's landing still renders its other sections.
  let products: Awaited<ReturnType<typeof listActiveProducts>> = []
  try {
    const business = await resolveBusinessBySlug(siteSlug)
    if (!business || !(await isCommerceEnabled(business.type))) return null
    products = await listActiveProducts(business.id, { limit, sort: 'newest' })
  } catch (err) {
    logger.error('[featured-products] render failed — falling back to empty', {
      action: 'commerce.featured_products.render_failed',
      siteSlug,
      error: err instanceof Error ? err.message : String(err),
    })
    return null
  }
  if (products.length === 0) return null

  return (
    <Section spacing="sm" aria-labelledby="featured-products-heading">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Heading level={2} id="featured-products-heading" className="text-xl sm:text-3xl font-bold text-[color:var(--text,#111)]">
              {title}
            </Heading>
            {subtitle ? <p className="mt-1 text-[color:var(--text-muted)]">{subtitle}</p> : null}
          </div>
          <Link
            href={`/s/${locale}/${siteSlug}/tienda`}
            className="text-sm font-medium text-[color:var(--primary,#111)] underline-offset-4 hover:underline"
          >
            {viewAllText} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const cover = p.images.find((i) => i.isCover) ?? p.images[0]
            return (
              <Link
                key={p.id}
                href={`/s/${locale}/${siteSlug}/producto/${p.slug}`}
                className="group block overflow-hidden rounded-lg border border-[color:var(--border)] bg-surface transition hover:border-[color:var(--primary,#111)]"
              >
                {cover?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.url}
                    alt={cover.alt ?? p.name}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="aspect-square w-full bg-surface-light" />
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium text-[color:var(--text,#111)]">{p.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--text,#111)]">
                    {formatCents(p.priceCents, p.currency)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
