'use client'

import { useState } from 'react'
import ProductCard from './product-card'

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

interface ProductGridProps {
  products: Product[]
  categories?: string[]
  onSelectProduct?: (product: Product) => void
  columns?: 2 | 3 | 4
}

export default function ProductGrid({
  products,
  categories = [],
  onSelectProduct,
  columns = 3
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4'
  }

  return (
    <div>
      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No se encontraron productos
        </div>
      ) : (
        <div className={`grid ${gridClasses[columns]} gap-4`}>
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={idx}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  )
}