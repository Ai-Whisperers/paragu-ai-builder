'use client'

interface BusinessHoursProps {
  hours?: Record<string, string>
  timezone?: string
}

export default function BusinessHours({ hours = {} }: BusinessHoursProps) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  
  const getToday = () => {
    const date = new Date()
    const dayIndex = date.getDay()
    return dayIndex === 0 ? 6 : dayIndex - 1
  }

  const isToday = (dayIndex: number) => dayIndex === getToday()
  
  const formatDay = (day: string) => day

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Horario de Atención</h3>
      
      <div className="space-y-2">
        {days.map((day, idx) => {
          const hoursText = hours[day] || hours[day.toLowerCase()] || 'Cerrado'
          const isClosed = hoursText.toLowerCase().includes('cerrado')
          
          return (
            <div 
              key={day}
              className={`flex justify-between items-center py-2 ${isToday(idx) ? 'bg-[var(--primary)]/5 -mx-4 px-4 rounded-lg' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isToday(idx) ? 'text-[var(--primary)]' : 'text-gray-700'}`}>
                  {formatDay(day)}
                </span>
                {isToday(idx) && (
                  <span className="text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded">Hoy</span>
                )}
              </div>
              <span className={`${isClosed ? 'text-gray-400' : 'text-gray-900'}`}>
                {hoursText}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}