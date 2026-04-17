'use client'

interface ServiceItem {
  name: string
  description?: string
  price?: string
  priceFrom?: string
  duration?: number
  category?: string
}

interface ServiceMenuProps {
  services: ServiceItem[]
  categories?: string[]
  showPrices?: boolean
  showDuration?: boolean
  onSelectService?: (service: ServiceItem) => void
  ctaText?: string
  ctaLink?: string
}

export default function ServiceMenu({
  services,
  categories = [],
  showPrices = true,
  showDuration = true,
  onSelectService,
  ctaText = 'Reservar',
  ctaLink
}: ServiceMenuProps) {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  const filteredServices = categories.length > 0 
    ? services.filter(s => s.category && categories.includes(s.category))
    : services

  return (
    <div className="space-y-6">
      {categories.length > 0 && categories.map(category => {
        const categoryServices = services.filter(s => s.category === category)
        if (categoryServices.length === 0) return null
        
        return (
          <div key={category} className="service-category">
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">{category}</h3>
            <div className="space-y-3">
              {categoryServices.map((service, idx) => (
                <div 
                  key={idx}
                  className="flex justify-between items-start p-4 bg-white rounded-lg border border-gray-100 hover:border-[var(--primary)] transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    {service.description && (
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    )}
                    {showDuration && service.duration && (
                      <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {formatDuration(service.duration)}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {showPrices && (service.price || service.priceFrom) && (
                      <p className="font-semibold text-[var(--primary)]">
                        {service.priceFrom && !service.price ? 'Desde ' : ''}
                        {service.price || service.priceFrom}
                      </p>
                    )}
                    {onSelectService && (
                      <button
                        onClick={() => onSelectService(service)}
                        className="mt-2 text-sm text-[var(--primary)] hover:underline"
                      >
                        {ctaText}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      
      {categories.length === 0 && (
        <div className="space-y-3">
          {filteredServices.map((service, idx) => (
            <div 
              key={idx}
              className="flex justify-between items-start p-4 bg-white rounded-lg border border-gray-100 hover:border-[var(--primary)] transition-colors"
            >
              <div className="flex-1 pr-4">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                {service.description && (
                  <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                )}
                {showDuration && service.duration && (
                  <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {formatDuration(service.duration)}
                  </span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                {showPrices && (service.price || service.priceFrom) && (
                  <p className="font-semibold text-[var(--primary)]">
                    {service.priceFrom && !service.price ? 'Desde ' : ''}
                    {service.price || service.priceFrom}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}