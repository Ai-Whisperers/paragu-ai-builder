'use client'

import { useState } from 'react'

interface Service {
  name: string
  price?: string
  priceFrom?: string
  duration?: number
  category?: string
}

interface ServiceSelectorProps {
  services: Service[]
  categories?: string[]
  onSelect: (service: Service) => void
  selectedService?: Service
}

export default function ServiceSelector({
  services,
  categories = [],
  onSelect,
  selectedService
}: ServiceSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || 'all')

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  return (
    <div className="space-y-4">
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-[var(--primary)] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {filteredServices.map((service, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(service)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selectedService?.name === service.name
                ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                : 'border-gray-200 hover:border-[var(--primary)]'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{service.name}</p>
                {service.duration && (
                  <p className="text-sm text-gray-500 mt-1">{service.duration} min</p>
                )}
              </div>
              <div className="text-right">
                {service.price && (
                  <p className="font-semibold text-[var(--primary)]">{service.price}</p>
                )}
                {service.priceFrom && !service.price && (
                  <p className="text-sm text-gray-500">Desde {service.priceFrom}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}