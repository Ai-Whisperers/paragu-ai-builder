import type { Product } from '@/lib/schemas/commerce'

interface Props {
  product: Product
  discount: number | null
  isNew: boolean
  lowStock: boolean
  outOfStock: boolean
}

export function ProductBadges({ product, discount, isNew, lowStock, outOfStock }: Props) {
  return (
    <>
      {/* Top-left: discount or new */}
      {discount ? (
        <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white" aria-label={`Descuento del ${discount} por ciento`}>
          −{discount}%
        </span>
      ) : isNew ? (
        <span className="absolute left-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
          NUEVO
        </span>
      ) : null}

      {/* Top-right: stock status */}
      {outOfStock ? (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white">
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg>
          Agotado
        </span>
      ) : lowStock ? (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 20h20L12 2z"/><path d="M12 9v4M12 17h.01"/></svg>
          Ultimas {product.inventoryQty}!
        </span>
      ) : null}

      {/* Free shipping badge */}
      {!outOfStock && product.currency === 'PYG' && product.priceCents >= 300000 ? (
        <span className="absolute bottom-12 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 12h14M5 7h14"/></svg>
          Envio gratis
        </span>
      ) : null}
    </>
  )
}
