'use client'

import EmergencyIndicatorComponent from '@/components/location/emergency-indicator'

interface EmergencyIndicatorSectionProps {
  type?: '24h' | 'emergencia' | 'urgencia'
  phone?: string
  description?: string
}

export function EmergencyIndicatorSection({
  type = 'emergencia',
  phone,
  description = 'Servicio de emergencia disponible 24/7'
}: EmergencyIndicatorSectionProps) {
  if (!phone) return null

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <EmergencyIndicatorComponent
          service={type}
          phone={phone}
          description={description}
        />
      </div>
    </section>
  )
}