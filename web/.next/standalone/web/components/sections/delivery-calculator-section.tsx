'use client'

import { useState, useMemo } from 'react'
import { MapPin, Truck, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface DeliveryZone {
  id: string
  name: string
  fee: number
  minOrder: number
  freeDeliveryOver: number
  estimatedTime: string
  description?: string
  coordinates?: {
    lat: number
    lng: number
    radiusKm: number
  }
}

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'centro',
    name: 'Coronel Oviedo Centro',
    fee: 5000,
    minOrder: 15000,
    freeDeliveryOver: 50000,
    estimatedTime: '30-45 min',
    description: 'Centro de Coronel Oviedo y alrededores'
  },
  {
    id: 'ruta2_cerca',
    name: 'Ruta 2 (Km 120-140)',
    fee: 8000,
    minOrder: 20000,
    freeDeliveryOver: 70000,
    estimatedTime: '45-60 min',
    description: 'Desde Km 120 hasta Km 140 de Ruta 2'
  },
  {
    id: 'ruta2_lejos',
    name: 'Ruta 2 (Km 140-150)',
    fee: 12000,
    minOrder: 30000,
    freeDeliveryOver: 100000,
    estimatedTime: '60-90 min',
    description: 'Desde Km 140 hasta Km 150 de Ruta 2'
  },
  {
    id: 'retiro',
    name: 'Retiro en Granja',
    fee: 0,
    minOrder: 0,
    freeDeliveryOver: 0,
    estimatedTime: 'Inmediato',
    description: 'Retiro personal en Ruta 2, Km 125-140'
  }
]

export interface DeliveryCalculatorProps {
  zones?: DeliveryZone[]
  className?: string
  onZoneSelect?: (zone: DeliveryZone) => void
}

export function DeliveryCalculator({
  zones = DEFAULT_DELIVERY_ZONES,
  className,
  onZoneSelect
}: DeliveryCalculatorProps) {
  const [selectedZone, setSelectedZone] = useState<string>('')
  const [orderTotal, setOrderTotal] = useState<string>('')

  const zone = useMemo(() => 
    zones.find(z => z.id === selectedZone),
    [selectedZone, zones]
  )

  const calculation = useMemo(() => {
    if (!zone || !orderTotal) return null
    
    const total = parseInt(orderTotal) || 0
    const freeDelivery = total >= zone.freeDeliveryOver && zone.freeDeliveryOver > 0
    const meetsMinimum = total >= zone.minOrder || zone.minOrder === 0
    const fee = freeDelivery ? 0 : zone.fee
    
    return {
      total,
      fee,
      freeDelivery,
      meetsMinimum,
      finalTotal: total + fee
    }
  }, [zone, orderTotal])

  const handleZoneChange = (value: string) => {
    setSelectedZone(value)
    const zone = zones.find(z => z.id === value)
    if (zone) onZoneSelect?.(zone)
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-[var(--surface)] border-b border-[var(--border)]">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="w-5 h-5 text-[var(--primary)]" />
          Calculadora de Delivery
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Zone Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text)]">
            Selecciona tu zona
          </label>
          <Select onValueChange={handleZoneChange} value={selectedZone}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elige tu ubicacion" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  <div className="flex flex-col items-start">
                    <span>{zone.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {zone.fee === 0 ? 'Gratis' : `${zone.fee.toLocaleString()} Gs`}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Order Total Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text)]">
            Total de tu pedido (Gs)
          </label>
          <div className="relative">
            <Input
              type="number"
              placeholder="Ej: 35000"
              value={orderTotal}
              onChange={(e) => setOrderTotal(e.target.value)}
              className="pl-12"
              min={0}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              Gs
            </span>
          </div>
        </div>

        {/* Results */}
        {calculation && zone && (
          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            {/* Delivery Fee */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Costo de envio:</span>
              <div className="flex items-center gap-2">
                {calculation.freeDelivery ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    GRATIS
                  </Badge>
                ) : (
                  <span className="font-semibold">
                    {zone.fee.toLocaleString()} Gs
                  </span>
                )}
              </div>
            </div>

            {/* Minimum Order Check */}
            {!calculation.meetsMinimum && zone.minOrder > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    Pedido minimo no alcanzado
                  </p>
                  <p className="text-sm text-amber-700">
                    Necesitas ${(zone.minOrder - calculation.total).toLocaleString()} Gs mas 
                    (minimo: {zone.minOrder.toLocaleString()} Gs)
                  </p>
                </div>
              </div>
            )}

            {/* Free Delivery Threshold */}
            {!calculation.freeDelivery && zone.freeDeliveryOver > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Te faltan ${(zone.freeDeliveryOver - calculation.total).toLocaleString()} Gs 
                  para envio gratis!
                </p>
              </div>
            )}

            {/* Estimated Time */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[var(--text-muted)]">Tiempo estimado:</span>
              <span className="font-medium">{zone.estimatedTime}</span>
            </div>

            {/* Final Total */}
            <div className="pt-3 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text)]">Total con envio:</span>
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {calculation.finalTotal.toLocaleString()} Gs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Zone Info */}
        {zone && !calculation && (
          <div className="bg-[var(--surface)] rounded-lg p-4 space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              {zone.name}
            </h4>
            {zone.description && (
              <p className="text-sm text-[var(--text-muted)]">{zone.description}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm pt-2">
              <div>
                <span className="text-[var(--text-muted)]">Costo:</span>
                <p className="font-medium">
                  {zone.fee === 0 ? 'Gratis' : `${zone.fee.toLocaleString()} Gs`}
                </p>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Minimo:</span>
                <p className="font-medium">
                  {zone.minOrder === 0 ? 'Sin minimo' : `${zone.minOrder.toLocaleString()} Gs`}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export interface DeliveryZoneBadgeProps {
  zone: DeliveryZone
  className?: string
}

export function DeliveryZoneBadge({ zone, className }: DeliveryZoneBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
      'bg-[var(--surface)] border border-[var(--border)]',
      className
    )}>
      <MapPin className="w-4 h-4 text-[var(--primary)]" />
      <span className="font-medium">{zone.name}</span>
      <span className="text-[var(--text-muted)]">
        ({zone.fee === 0 ? 'Gratis' : `+${zone.fee.toLocaleString()} Gs`})
      </span>
    </div>
  )
}

export default DeliveryCalculator
