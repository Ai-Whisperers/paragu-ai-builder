'use client'

import { useState, useEffect } from 'react'

interface TimeSlot {
  time: string
  available: boolean
}

interface DateTimePickerProps {
  onSelect: (date: Date, time: string) => void
  minDate?: Date
  maxDate?: Date
  workingHours?: { start: string; end: string }
  duration?: number
  excludeTimes?: string[]
}

export default function DateTimePicker({
  onSelect,
  minDate,
  workingHours = { start: '08:00', end: '20:00' },
  duration = 60,
  excludeTimes = []
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])

  const today = minDate || new Date()
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return date
  })

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    const [startHour] = workingHours.start.split(':').map(Number)
    const [endHour] = workingHours.end.split(':').map(Number)

    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      slots.push({
        time,
        available: !excludeTimes.includes(time)
      })
      
      const halfHour = `${hour.toString().padStart(2, '0')}:30`
      slots.push({
        time: halfHour,
        available: !excludeTimes.includes(halfHour)
      })
    }
    return slots
  }

  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots(generateTimeSlots())
      setSelectedTime('')
    }
  }, [selectedDate])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-PY', { weekday: 'short', day: 'numeric' })
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const dateTime = new Date(selectedDate)
      dateTime.setHours(hours, minutes, 0, 0)
      onSelect(dateTime, selectedTime)
    }
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Selecciona una fecha</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border text-center transition-all ${
                isDateSelected(date)
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-gray-200 hover:border-[var(--primary)]'
              }`}
            >
              <div className="text-xs uppercase">{date.toLocaleDateString('es-PY', { weekday: 'short' })}</div>
              <div className="text-lg font-bold">{date.getDate()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selecciona un horario</h4>
          <div className="grid grid-cols-4 gap-2">
            {availableSlots.map((slot, idx) => (
              <button
                key={idx}
                disabled={!slot.available}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                className={`py-2 px-3 rounded-lg text-sm transition-all ${
                  selectedTime === slot.time
                    ? 'bg-[var(--primary)] text-white'
                    : slot.available
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {selectedDate && selectedTime && (
        <button
          onClick={handleConfirm}
          className="w-full bg-[var(--primary)] text-white font-medium py-3 rounded-lg hover:opacity-90"
        >
          Confirmar turno: {selectedDate.toLocaleDateString('es-PY', { day: 'numeric', month: 'short' })} a las {selectedTime}
        </button>
      )}
    </div>
  )
}