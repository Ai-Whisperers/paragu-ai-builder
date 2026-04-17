'use client'

interface GoogleMapsProps {
  address?: string
  city?: string
  neighborhood?: string
  googleMapsUrl?: string
  embedUrl?: string
  height?: number
}

export default function GoogleMaps({
  address,
  city = 'Asunción',
  neighborhood,
  googleMapsUrl,
  embedUrl,
  height = 300
}: GoogleMapsProps) {
  const fullAddress = [address, neighborhood, city].filter(Boolean).join(', ')
  
  const getEmbedUrl = () => {
    if (embedUrl) return embedUrl
    
    const query = encodeURIComponent(fullAddress)
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d-57.5!3d-25.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE1JzAwLjAiTiA1N8KwMzAnMDAuMCJF!5e0!3m2!1ses!2spy!4v1234567890`
  }

  const handleDirections = () => {
    const url = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    window.open(url, '_blank')
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      {fullAddress && (
        <div className="relative" style={{ height: `${height}px` }}>
          <iframe
            src={getEmbedUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación en el mapa"
          />
          
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleDirections}
              className="w-full bg-white shadow-lg py-2 px-4 rounded-lg text-sm font-medium text-[var(--primary)] hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Cómo llegar
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{fullAddress}</span>
        </div>
        <button
          onClick={handleDirections}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          Abrir en Google Maps
        </button>
      </div>
    </div>
  )
}