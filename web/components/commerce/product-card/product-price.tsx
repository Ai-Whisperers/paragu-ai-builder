import { formatCents } from '@/lib/commerce/compute-totals'
import { PriceDisplay } from '@/components/commerce/price-display'
import { InstallmentLine } from '@/components/commerce/installment-line'
import { FreebieBadge } from '@/components/commerce/freebie-badge'
import type { Product } from '@/lib/schemas/commerce'

interface Props {
  product: Product
  siteSlug: string
  rates?: Record<string, number>
}

export function ProductPrice({ product, siteSlug, rates }: Props) {
  const hasCompareAt = product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents

  return (
    <div className="mt-auto pt-3">
      <div className="flex items-baseline gap-2">
        {rates && product.currency === 'PYG' ? (
          <PriceDisplay className="text-lg font-bold text-[color:var(--text,#111)]" pygCents={product.priceCents} rates={rates} />
        ) : (
          <p className="text-lg font-bold text-[color:var(--text,#111)]">{formatCents(product.priceCents, product.currency)}</p>
        )}
        {hasCompareAt ? (
          rates && product.currency === 'PYG' ? (
            <PriceDisplay className="text-xs text-[color:var(--text-muted,#9ca3af)] line-through" pygCents={product.compareAtPriceCents} rates={rates} />
          ) : (
            <p className="text-xs text-[color:var(--text-muted,#9ca3af)] line-through">{formatCents(product.compareAtPriceCents, product.currency)}</p>
          )
        ) : null}
      </div>
      <InstallmentLine siteSlug={siteSlug} priceCents={product.priceCents} currency={product.currency} className="mt-0.5" />
      <FreebieBadge metadata={product.metadata} className="mt-1" />
    </div>
  )
}
