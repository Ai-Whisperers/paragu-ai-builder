'use client'

import { useState } from 'react'
import ServiceSelector from './service-selector'
import DateTimePicker from './date-time-picker'
import StaffSelector from './staff-selector'
import BookingForm from './booking-form'

interface Service { name: string; price?: string; duration?: number; category?: string }
interface Staff { name: string; role?: string; image?: string; bio?: string; specialties?: string[] }
interface BookingData { date: Date; time: string; service?: Service; staff?: Staff | null }
interface BookingFormData { name: string; email: string; phone: string; notes?: string }

interface BookingWizardProps {
  services: Service[]
  categories?: string[]
  staff?: Staff[]
  workingHours?: { start: string; end: string }
  onComplete: (data: BookingFormData & Partial<BookingData>) => Promise<void>
  whatsappPhone?: string
}

export default function BookingWizard({
  services,
  categories = [],
  staff = [],
  workingHours,
  onComplete,
  whatsappPhone
}: BookingWizardProps) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | undefined>()
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
  }

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBookingData({ date, time, service: selectedService, staff: selectedStaff })
    setStep(4)
  }

  const handleStaffSelect = (staffMember: Staff | null) => {
    setSelectedStaff(staffMember)
    setStep(3)
  }

  const handleFormSubmit = async (formData: BookingFormData) => {
    // If WhatsApp enabled, open WhatsApp with booking details
    if (whatsappPhone && selectedService && bookingData) {
      const message = `Hola! Quiero reservar:\n\n*Servicio:* ${selectedService.name}\n*Fecha:* ${bookingData.date.toLocaleDateString('es-PY')}\n*Hora:* ${bookingData.time}\n*Cliente:* ${formData.name}\n*Teléfono:* ${formData.phone}`
      window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }
    await onComplete({ ...formData, service: selectedService, ...bookingData })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Progress Steps */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s ? 'bg-[var(--primary)] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-[var(--primary)]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">1. Selecciona un servicio</h3>
          <ServiceSelector
            services={services}
            categories={categories}
            onSelect={handleServiceSelect}
            selectedService={selectedService}
          />
          <button
            onClick={() => selectedService && setStep(2)}
            disabled={!selectedService}
            className="mt-6 w-full bg-[var(--primary)] text-white font-medium py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">2. Selecciona fecha y hora</h3>
          <DateTimePicker
            onSelect={handleDateTimeSelect}
            workingHours={workingHours}
            duration={selectedService?.duration}
          />
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-sm text-gray-600 hover:underline"
          >
            ← Volver
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">3. Selecciona profesional (opcional)</h3>
          {staff.length > 0 ? (
            <StaffSelector
              staff={staff}
              onSelect={handleStaffSelect}
              selectedStaff={selectedStaff}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No hay personal específico disponible.</p>
              <button
                onClick={() => handleStaffSelect(null)}
                className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg"
              >
                Continuar
              </button>
            </div>
          )}
          <button
            onClick={() => setStep(2)}
            className="mt-4 text-sm text-gray-600 hover:underline"
          >
            ← Volver
          </button>
        </div>
      )}

      {step === 4 && bookingData && (
        <div>
          <h3 className="text-lg font-semibold mb-4">4. Confirma tus datos</h3>
          <BookingForm
            service={selectedService}
            date={bookingData.date}
            time={bookingData.time}
            staff={selectedStaff}
            onSubmit={handleFormSubmit}
          />
          <button
            onClick={() => setStep(3)}
            className="mt-4 text-sm text-gray-600 hover:underline"
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
  )
}