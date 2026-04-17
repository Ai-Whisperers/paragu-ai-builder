'use client'

import { useState } from 'react'

interface GalleryImage {
  src: string
  alt: string
  category?: string
}

interface PhotoGalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  showLightbox?: boolean
  aspectRatio?: 'square' | 'video' | 'portrait'
}

export default function PhotoGallery({
  images,
  columns = 3,
  showLightbox = true,
  aspectRatio = 'square'
}: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }

  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4'
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className={`grid ${columnClasses[columns]} gap-2 md:gap-4`}>
        {images.map((image, idx) => (
          <div 
            key={idx}
            className={`${aspectClasses[aspectRatio]} relative overflow-hidden rounded-lg cursor-pointer group`}
            onClick={() => showLightbox && openLightbox(idx)}
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {showLightbox && lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 p-2"
            onClick={closeLightbox}
          >
            ×
          </button>
          
          <button 
            className="absolute left-4 text-white text-4xl hover:text-gray-300 p-2"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
          >
            ‹
          </button>
          
          <div 
            className="max-w-4xl max-h-[80vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={images[currentIndex].src} 
              alt={images[currentIndex].alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {images[currentIndex].alt && (
              <p className="text-white text-center mt-4">{images[currentIndex].alt}</p>
            )}
          </div>
          
          <button 
            className="absolute right-4 text-white text-4xl hover:text-gray-300 p-2"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
          >
            ›
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}