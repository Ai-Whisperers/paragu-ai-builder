'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface BookingService {
  id: string
  name: string
  description?: string
  duration?: number
  price?: string
}

interface BookingStaff {
  id: string
  name: string
  role?: string
  imageUrl?: string
}

interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingWizardSectionProps {
  title?: string
  subtitle?: string
  services?: BookingService[]
  staff?: BookingStaff[]
  whatsapp?: string
  email?: string
  businessName?: string
}

type Step = 'service' | 'staff' | 'datetime' | 'confirm'

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function BookingWizardSection({
  title = 'Agendá tu cita',
  subtitle,
  services = [],
  staff = [],
  whatsapp,
  email,
  businessName,
}: BookingWizardSectionProps) {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate next 7 days
  const today = new Date()
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }

  // Mock time slots
  const timeSlots: TimeSlot[] = []
  for (let h = 8; h <= 17; h++) {
    timeSlots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: Math.random() > 0.3 })
    timeSlots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: Math.random() > 0.3 })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return `${DAYS_ES[d.getDay()]} ${d.getDate()} ${MONTHS_ES[d.getMonth()]}`
  }

  const canProceed = () => {
    switch (step) {
      case 'service': return selectedService !== null
      case 'staff': return true // optional
      case 'datetime': return selectedDate !== null && selectedTime !== null
      case 'confirm': return true
    }
  }

  const handleConfirm = () => {
    const service = services.find(s => s.id === selectedService)
    const msg = `Hola${businessName ? ' ' + businessName : ''}! Quiero agendar una consulta${service ? ' de ' + service.name : ''}${selectedDate ? ' para el ' + formatDate(selectedDate) + ' a las ' + selectedTime : ''}.`
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
    }
  }

  return (
    <section className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          {title && <Heading level={2} className="text-center">{title}</Heading>}
          {subtitle && <p className="mt-2 text-center text-[var(--text-muted)]">{subtitle}</p>}

          {/* Steps indicator */}
          <div className="flex justify-center gap-2 mt-8 mb-8">
            {(['service', 'staff', 'datetime', 'confirm'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-[var(--primary)] text-white' :
                  ['service', 'staff', 'datetime', 'confirm'].indexOf(step) > i ? 'bg-[var(--primary)]/20 text-[var(--primary)]' :
                  'bg-[var(--surface-light)] text-[var(--text-muted)]'
                }`}>
                  {['service', 'staff', 'datetime', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                {i < 3 && <div className="w-8 h-px bg-[var(--border)]" />}
              </div>
            ))}
          </div>

          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            {/* Step 1: Service */}
            {step === 'service' && (
              <div>
                <Heading level={3} className="mb-4">Elegí un servicio</Heading>
                <div className="space-y-3">
                  {(services.length > 0 ? services : [
                    { id: '1', name: 'Consulta General', description: 'Primera consulta sin costo', duration: 30 },
                    { id: '2', name: 'Asesoría Legal', description: 'Consultoría legal personalizada', duration: 60, price: 'Gs. 200.000' },
                    { id: '3', name: 'Revisión de Documentos', description: 'Análisis de contratos', duration: 45, price: 'Gs. 150.000' },
                  ]).map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => { setSelectedService(svc.id); setStep('staff') }}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedService === svc.id
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      <div className="font-medium">{svc.name}</div>
                      {svc.description && <div className="text-sm text-[var(--text-muted)]">{svc.description}</div>}
                      {svc.duration && <div className="text-xs text-[var(--text-muted)] mt-1">Duración: {svc.duration} min</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Staff */}
            {step === 'staff' && (
              <div>
                <Heading level={3} className="mb-4">Seleccioná un profesional (opcional)</Heading>
                <p className="text-sm text-[var(--text-muted)] mb-4">Podés elegir con quién querés agendar o dejarlo sin asignar.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setSelectedStaff(null); setStep('datetime') }}
                    className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] text-center"
                  >
                    <div className="font-medium">Sin preferencia</div>
                    <div className="text-xs text-[var(--text-muted)]">El primero disponible</div>
                  </button>
                  {(staff.length > 0 ? staff : []).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedStaff(s.id); setStep('datetime') }}
                      className={`p-4 rounded-lg border transition-colors text-center ${
                        selectedStaff === s.id ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      <div className="font-medium">{s.name}</div>
                      {s.role && <div className="text-xs text-[var(--text-muted)]">{s.role}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 'datetime' && (
              <div>
                <Heading level={3} className="mb-4">Elegí fecha y hora</Heading>
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                  {dates.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`flex-shrink-0 p-3 rounded-lg border text-center min-w-[80px] transition-colors ${
                        selectedDate === d ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      <div className="text-xs text-[var(--text-muted)]">{DAYS_ES[new Date(d + 'T12:00:00').getDay()]}</div>
                      <div className="text-lg font-bold">{new Date(d + 'T12:00:00').getDate()}</div>
                      <div className="text-xs">{MONTHS_ES[new Date(d + 'T12:00:00').getMonth()]}</div>
                    </button>
                  ))}
                </div>
                {selectedDate && (
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {timeSlots.map((slot, i) => (
                      <button
                        key={i}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 rounded-lg border text-sm transition-colors ${
                          !slot.available ? 'opacity-30 cursor-not-allowed' :
                          selectedTime === slot.time ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:border-[var(--primary)]'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 'confirm' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Heading level={3} className="mb-2">Confirmá tu reserva</Heading>
                <div className="text-left bg-[var(--surface-light)] rounded-lg p-4 mb-6 space-y-2">
                  {selectedService && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Servicio:</span><span>{services.find(s => s.id === selectedService)?.name || 'Seleccionado'}</span></div>}
                  {selectedDate && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Fecha:</span><span>{formatDate(selectedDate)}</span></div>}
                  {selectedTime && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Hora:</span><span>{selectedTime}</span></div>}
                </div>
                <button
                  onClick={handleConfirm}
                  className="w-full py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90"
                >
                  Confirmar por WhatsApp
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-[var(--border)]">
              {step !== 'service' && (
                <button
                  onClick={() => setStep(['service', 'staff', 'datetime', 'confirm'][['service', 'staff', 'datetime', 'confirm'].indexOf(step) - 1] as Step)}
                  className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  ← Atrás
                </button>
              )}
              {step !== 'confirm' && step !== 'service' && (
                <button
                  onClick={() => setStep(['service', 'staff', 'datetime', 'confirm'][['service', 'staff', 'datetime', 'confirm'].indexOf(step) + 1] as Step])}
                  disabled={!canProceed()}
                  className="ml-auto px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg disabled:opacity-50"
                >
                  Siguiente →
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
