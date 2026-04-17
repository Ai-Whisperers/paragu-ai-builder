'use client'

interface Product {
  id?: string
  name: string
  price?: string
  priceFrom?: string
  image?: string
  category?: string
  description?: string
  inStock?: boolean
}

interface ProductCardProps {
  product: Product
  onSelect?: (product: Product) => void
  showPrice?: boolean
  showStock?: boolean
}

export default function ProductCard({ 
  product, 
  onSelect,
  showPrice = true,
  showStock = true 
}: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(product)}
    >
      {product.image && (
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 line-clamp-2">{product.name}</h4>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        )}
        {showPrice && (product.price || product.priceFrom) && (
          <p className="font-semibold text-[var(--primary)] mt-2">
            {product.priceFrom && !product.price ? 'Desde ' : ''}
            {product.price || product.priceFrom}
          </p>
        )}
        {showStock && product.inStock === false && (
          <span className="text-xs text-red-500 mt-1 inline-block">Sin stock</span>
        )}
      </div>
    </div>
  )
}