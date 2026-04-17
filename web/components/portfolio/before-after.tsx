'use client'

import { useState } from 'react'

interface BeforeAfterProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  title?: string
}

export default function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = 'Antes',
  afterLabel = 'Después',
  title
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    
    const container = e.currentTarget as HTMLDivElement
    const rect = container.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const position = ((clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, position)))
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      {title && (
        <h4 className="text-lg font-medium mb-3 text-center">{title}</h4>
      )}
      
      <div 
        className="relative aspect-video cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleMove}
      >
        {/* Before Image (Full) */}
        <div className="absolute inset-0">
          <img 
            src={beforeImage} 
            alt={beforeLabel}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {beforeLabel}
          </span>
        </div>

        {/* After Image (Clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <img 
            src={afterImage} 
            alt={afterLabel}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 right-4 bg-[var(--primary)] text-white px-3 py-1 rounded-full text-sm">
            {afterLabel}
          </span>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" />
            </svg>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-2">
        Desliza para comparar
      </p>
    </div>
  )
}