'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface ClassSchedule {
  day: string
  classes: Array<{
    time: string
    name: string
    instructor?: string
    duration?: number
    spots?: number
  }>
}

interface ClassScheduleSectionProps {
  title?: string
  subtitle?: string
  schedule: ClassSchedule[]
  weekDays?: string[]
}

export function ClassScheduleSection({
  title = 'Horario de Clases',
  subtitle,
  schedule,
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
}: ClassScheduleSectionProps) {
  const [selectedDay, setSelectedDay] = useState(weekDays[0])

  const daySchedule = schedule.find(d => d.day === selectedDay)

  return (
    <section id="horarios" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {daySchedule?.classes && daySchedule.classes.length > 0 ? (
            <div className="space-y-3">
              {daySchedule.classes.map((cls, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-[var(--primary)]">
                      {cls.time}
                    </span>
                    <div>
                      <p className="font-medium text-[var(--text)]">{cls.name}</p>
                      {cls.instructor && (
                        <p className="text-sm text-[var(--text-muted)]">Con {cls.instructor}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {cls.duration && (
                      <span className="text-[var(--text-muted)]">{cls.duration} min</span>
                    )}
                    {cls.spots !== undefined && (
                      <p className={`text-xs ${cls.spots > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                        {cls.spots} lugares disponibles
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--text-muted)] py-8">
              No hay clases programadas para este día
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}