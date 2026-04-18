'use client'

import { useState } from 'react'

interface PortfolioItem {
  title: string
  description?: string
  image?: string
  category?: string
  client?: string
  year?: string
}

interface PortfolioGalleryProps {
  items: PortfolioItem[]
  categories?: string[]
  columns?: 2 | 3 | 4
}

export default function PortfolioGallery({
  items,
  categories = [],
  columns = 3
}: PortfolioGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3', 
    4: 'grid-cols-2 md:grid-cols-4'
  }

  return (
    <>
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
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

      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {filteredItems.map((item, idx) => (
          <div 
            key={idx}
            className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openLightbox(idx)}
          >
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-medium">{item.title}</h4>
                {item.category && (
                  <span className="text-white/70 text-sm">{item.category}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 p-2"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>
          
          <div 
            className="max-w-4xl max-h-[80vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredItems[currentIndex]?.image && (
              <img 
                src={filteredItems[currentIndex].image} 
                alt={filteredItems[currentIndex].title}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
            <div className="text-white mt-4 text-center">
              <h4 className="text-xl font-medium">{filteredItems[currentIndex].title}</h4>
              {filteredItems[currentIndex].description && (
                <p className="text-white/70 mt-2">{filteredItems[currentIndex].description}</p>
              )}
            </div>
          </div>
          
          {filteredItems.length > 1 && (
            <>
              <button 
                className="absolute left-4 text-white text-4xl hover:text-gray-300"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1)) }}
              >
                ‹
              </button>
              <button 
                className="absolute right-4 text-white text-4xl hover:text-gray-300"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1)) }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}