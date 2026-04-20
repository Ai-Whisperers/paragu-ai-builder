'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SmartWhatsAppButton } from './smart-whatsapp-section'

export type AvailabilityStatus = 'available' | 'limited' | 'booked' | 'closed'

export interface DayAvailability {
  date: Date
  status: AvailabilityStatus
  availableSlots: number
  maxSlots: number
}

export interface PreOrderCalendarProps {
  availability: DayAvailability[]
  phone: string
  productName: string
  className?: string
}

export function PreOrderCalendar({ availability, phone, productName, className }: PreOrderCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getAvailabilityForDate = (date: Date): DayAvailability | undefined => {
    return availability.find(a => 
      a.date.getDate() === date.getDate() &&
      a.date.getMonth() === date.getMonth() &&
      a.date.getFullYear() === date.getFullYear()
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const statusConfig: Record<AvailabilityStatus, { label: string; color: string; bgColor: string }> = {
    available: { label: 'Disponible', color: '#27ae60', bgColor: 'bg-green-500' },
    limited: { label: 'Pocos cupos', color: '#f39c12', bgColor: 'bg-amber-500' },
    booked: { label: 'Agotado', color: '#e74c3c', bgColor: 'bg-red-500' },
    closed: { label: 'Cerrado', color: '#95a5a6', bgColor: 'bg-gray-400' }
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const selectedAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : null

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="w-5 h-5 text-[var(--primary)]" />
            Reservar {productName}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            24hs anticipacion
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-lg">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-[var(--text-muted)] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}
          {days.map(day => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const availability = getAvailabilityForDate(date)
            const isSelected = selectedDate?.getDate() === day && 
                              selectedDate?.getMonth() === currentMonth.getMonth()

            if (!availability) {
              return (
                <div
                  key={day}
                  className="aspect-square flex items-center justify-center rounded-lg text-[var(--text-muted)] opacity-50"
                >
                  {day}
                </div>
              )
            }

            const config = statusConfig[availability.status]

            return (
              <button
                key={day}
                onClick={() => availability.status !== 'booked' && availability.status !== 'closed' && setSelectedDate(date)}
                disabled={availability.status === 'booked' || availability.status === 'closed'}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center rounded-lg transition-all',
                  'hover:bg-[var(--surface)] relative',
                  isSelected && 'ring-2 ring-[var(--primary)]',
                  availability.status === 'booked' && 'opacity-50 cursor-not-allowed',
                  availability.status === 'closed' && 'opacity-30 cursor-not-allowed'
                )}
              >
                <span className={cn(
                  'text-sm font-medium',
                  isSelected && 'text-[var(--primary)]'
                )}>
                  {day}
                </span>
                <span className={cn(
                  'w-2 h-2 rounded-full mt-1',
                  config.bgColor
                )} />
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--border)]">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-1.5 text-sm">
              <span className={cn('w-2 h-2 rounded-full', config.bgColor)} />
              <span className="text-[var(--text-muted)]">{config.label}</span>
            </div>
          ))}
        </div>

        {/* Selected Date Info */}
        {selectedDate && selectedAvailability && (
          <div className="mt-6 bg-[var(--surface)] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {selectedDate.toLocaleDateString('es-PY', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </h4>
              <Badge 
                style={{ 
                  backgroundColor: statusConfig[selectedAvailability.status].color,
                  color: 'white'
                }}
              >
                {statusConfig[selectedAvailability.status].label}
              </Badge>
            </div>

            {selectedAvailability.status !== 'booked' && selectedAvailability.status !== 'closed' && (
              <>
                <p className="text-sm text-[var(--text-muted)]">
                  Cupos disponibles: {selectedAvailability.availableSlots} de {selectedAvailability.maxSlots}
                </p>
                <SmartWhatsAppButton
                  phone={phone}
                  context="chicken"
                  productName={productName}
                  className="w-full"
                >
                  Reservar para esta fecha
                </SmartWhatsAppButton>
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Los pollos se preparan el dia anterior a la fecha de retiro seleccionada. 
            Debes confirmar tu reserva via WhatsApp.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export interface PreOrderSectionProps {
  phone: string
  className?: string
}

// Generate sample availability for the next 30 days
export function generateSampleAvailability(): DayAvailability[] {
  const availability: DayAvailability[] = []
  const today = new Date()
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    // Skip Sundays
    if (date.getDay() === 0) {
      availability.push({
        date,
        status: 'closed',
        availableSlots: 0,
        maxSlots: 0
      })
      continue
    }
    
    // Random availability
    const rand = Math.random()
    let status: AvailabilityStatus
    let availableSlots: number
    
    if (rand < 0.6) {
      status = 'available'
      availableSlots = Math.floor(Math.random() * 5) + 5
    } else if (rand < 0.85) {
      status = 'limited'
      availableSlots = Math.floor(Math.random() * 3) + 1
    } else {
      status = 'booked'
      availableSlots = 0
    }
    
    availability.push({
      date,
      status,
      availableSlots,
      maxSlots: 10
    })
  }
  
  return availability
}

export function PreOrderSection({ phone, className }: PreOrderSectionProps) {
  const [availability] = useState(generateSampleAvailability())

  return (
    <section className={cn('py-16', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text)] mb-4">
            Reserva tu Pollo
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Selecciona la fecha de retiro. Los pollos se preparan frescos 
            con 24 horas de anticipacion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <PreOrderCalendar
            availability={availability}
            phone={phone}
            productName="Pollo Entero"
          />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opciones Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium">Pollo Entero</p>
                    <p className="text-sm text-[var(--text-muted)]">Aprox. 2-2.5kg</p>
                  </div>
                  <Badge>35.000 Gs</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Pollito Tierno</p>
                    <p className="text-sm text-[var(--text-muted)]">Aprox. 1-1.2kg</p>
                  </div>
                  <Badge>22.000 Gs</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informacion Importante</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[var(--text)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Pollos limpios y listos para cocinar
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Reserva con 24 horas de anticipacion
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Retiro en granja o delivery (costo adicional)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    Pago contra entrega o transferencia
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Nota:</strong> Los cupos son limitados para garantizar 
                frescura. Te recomendamos reservar con anticipacion, especialmente 
                para fines de semana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PreOrderCalendar
