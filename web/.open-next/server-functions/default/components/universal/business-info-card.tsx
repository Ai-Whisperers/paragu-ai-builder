'use client'

interface BusinessInfoCardProps {
  phone?: string
  email?: string
  address?: string
  city?: string
  neighborhood?: string
  googleMapsUrl?: string
  showMap?: boolean
}

export default function BusinessInfoCard({
  phone,
  email,
  address,
  city = 'Asunción',
  neighborhood,
  googleMapsUrl,
  showMap = true
}: BusinessInfoCardProps) {
  const fullAddress = [address, neighborhood, city].filter(Boolean).join(', ')
  
  const handleDirections = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank')
    } else if (fullAddress) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Información de Contacto</h3>
      
      <div className="space-y-4">
        {phone && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a5.26 5.26 0 01-2.876-1.037l-.21-.289-3.81 1.003 1.005-3.699-.257-.207a5.214 5.214 0 01-1.065-2.887c0-.297.05-.597.14-.889l.49-1.67c.115-.394.06-.835-.115-1.196-.175-.361-.872-.788-1.826-.788H5.156c-.868 0-1.402.566-1.615.994-.213.428-.213 1.073 0 1.5l2.18 3.708c.214.366.427.732.61 1.024.183.292.395.578.795.892.4.314 1.07.697 1.867.697.796 0 1.467-.383 1.867-.697.4-.314.612-.6.795-.892.183-.292.396-.658.61-1.024l.61-.764c.114-.146.115-.328.084-.5-.03-.172-.11-.317-.24-.445-.13-.128-.872-.624-1.15-1.003-.276-.379-.467-.757-.467-1.236 0-.478.38-1.044.963-1.414 1.11-.703 2.616-1.132 3.87-1.132 1.253 0 2.76.43 3.87 1.132.584.37.964.936.964 1.414 0 .48-.19.858-.468 1.237-.277.378-.919 1.003-1.15 1.003z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <a href={`tel:${phone}`} className="font-medium text-[var(--primary)] hover:underline">
                {phone}
              </a>
            </div>
          </div>
        )}
        
        {address && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <button 
                onClick={handleDirections}
                className="font-medium text-[var(--primary)] hover:underline text-left"
              >
                {fullAddress}
              </button>
            </div>
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a href={`mailto:${email}`} className="font-medium text-[var(--primary)] hover:underline">
                {email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}