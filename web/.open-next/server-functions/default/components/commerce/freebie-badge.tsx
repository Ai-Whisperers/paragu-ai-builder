/**
 * Bundle-freebie ribbon shown on a product card/PDP when the product
 * includes a gift-with-purchase (lubricante, pilas, etc.). Reads from
 * `product.metadata.freebie: string` so no DB migration is required —
 * admins can set this freely on a per-product basis.
 *
 * Different from a discount badge: a freebie signals added value
 * ("includes the lubricant for this toy") without eroding margin, and
 * has been shown by LATAM peers (luden.store) to lift perceived-value
 * on high-intent cards more than a flat % discount of the same cost.
 */

interface Props {
  metadata: Record<string, unknown>
  className?: string
}

export function FreebieBadge({ metadata, className }: Props) {
  const freebie = typeof metadata.freebie === 'string' ? metadata.freebie.trim() : ''
  if (!freebie) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${className ?? ''}`}
    >
      <span aria-hidden="true">🎁</span>
      {freebie}
    </span>
  )
}
