import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ClassScheduleSection } from '@/components/sections/class-schedule-section'

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
    classes: [{ time: '07:00', name: 'Funcional', instructor: 'Pedro', duration: 45 }],
  },
]

describe('class-schedule-section.tsx', () => {
  it('renders day tabs for the default week', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByRole('button', { name: 'Lunes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Martes' })).toBeInTheDocument()
  })

  it('shows classes for the initially selected day (Lunes)', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByText('Crossfit')).toBeInTheDocument()
    // Time appears once as a span in the Crossfit card, once in Yoga — grab any
    expect(screen.getAllByText('07:00').length).toBeGreaterThan(0)
    expect(screen.getByText(/Con Carlos/)).toBeInTheDocument()
  })

  it('switches to a different day when clicked', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    fireEvent.click(screen.getByRole('button', { name: 'Martes' }))
    expect(screen.getByText('Funcional')).toBeInTheDocument()
  })

  it('displays duration text when provided', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    // "45" and "min" render as separate text nodes — match via function
    expect(screen.getAllByText((content) => /45\s*min/.test(content)).length).toBeGreaterThan(0)
  })

  it('displays remaining spots when provided', () => {
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    expect(screen.getByText(/15 lugares disponibles/)).toBeInTheDocument()
  })

  it('shows empty-day copy when selected day has no classes', () => {
    // Default week includes Domingo; no schedule entry for Domingo → empty.
    render(<ClassScheduleSection title="Schedule" schedule={mockSchedule} />)
    fireEvent.click(screen.getByRole('button', { name: 'Domingo' }))
    expect(screen.getByText(/No hay clases programadas para este día/)).toBeInTheDocument()
  })
})

describe('class-schedule-section.tsx — edge cases', () => {
  it('handles empty schedule array', () => {
    render(<ClassScheduleSection title="Schedule" schedule={[]} />)
    expect(screen.getByText('Schedule')).toBeInTheDocument()
    expect(screen.getByText(/No hay clases programadas para este día/)).toBeInTheDocument()
  })

  it('falls back to the default title when not provided', () => {
    // @ts-expect-error — explicitly testing default-title rendering
    render(<ClassScheduleSection schedule={[]} />)
    expect(screen.getByText('Horario de Clases')).toBeInTheDocument()
  })
})
