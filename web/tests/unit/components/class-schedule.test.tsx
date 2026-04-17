import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ClassScheduleSection from '@/components/sections/class-schedule-section'

describe('class-schedule-section.tsx', () => {
  const mockSchedule = [
    {
      day: 'Lunes',
      classes: [
        { time: '07:00', name: 'Crossfit', instructor: 'Carlos', duration: 45, spots: 15 },
        { time: '09:00', name: 'Yoga', instructor: 'Lucia', duration: 60, spots: 20 },
      ],
    },
    {
      day: 'Martes',
      classes: [
        { time: '07:00', name: 'Funcional', instructor: 'Pedro', duration: 45 },
      ],
    },
  ]

  it('should render day tabs', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
  })

  it('should show classes for selected day', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByText('Crossfit')).toBeInTheDocument()
    expect(screen.getByText('07:00')).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
  })

  it('should switch to different day when clicked', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    fireEvent.click(screen.getByText('Martes'))
    expect(screen.getByText('Funcional')).toBeInTheDocument()
  })

  it('should display time and instructor', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByText('07:00')).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
  })

  it('should display duration when provided', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByText('45 min')).toBeInTheDocument()
  })

  it('should display spots when provided', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByText('15 lugares disponibles')).toBeInTheDocument()
  })

  it('should show "no classes" for empty day', () => {
    const scheduleWithEmptyDay = [
      { day: 'Domingo', classes: [] },
    ]
    render(<ClassScheduleSection title="Schedule" schedule={scheduleWithEmptyDay} />)
    fireEvent.click(screen.getByText('Domingo'))
    expect(screen.getByText('No hay clases programadas para este dia')).toBeInTheDocument()
  })
})

describe('class-schedule-section.tsx - edge cases', () => {
  it('should handle empty schedule array', () => {
    render(<ClassScheduleSection title="Schedule" schedule={[]} />)
    expect(screen.getByText('Horario de Clases')).toBeInTheDocument()
  })
})