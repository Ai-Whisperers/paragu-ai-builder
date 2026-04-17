'use client'

interface EmergencyIndicatorProps {
  service: '24h' | 'emergencia' | 'urgencia'
  phone?: string
  description?: string
}

export default function EmergencyIndicator({ 
  phone, 
  description = 'Servicio de emergencia disponible' 
}: EmergencyIndicatorProps) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      <div>
        <p className="font-medium text-red-800">Servicio de Emergencia</p>
        <p className="text-sm text-red-600">{description}</p>
        {phone && (
          <a 
            href={`tel:${phone}`}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            {phone}
          </a>
        )}
      </div>
    </div>
  )
}