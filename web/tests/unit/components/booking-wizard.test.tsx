import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookingWizard from '@/components/booking/booking-wizard'

const defaultProps = {
  services: [
    { name: 'Corte de Pelo', price: '50.000 Gs', duration: 30 },
    { name: 'Barba', price: '30.000 Gs', duration: 20 },
    { name: 'Corte + Barba', price: '70.000 Gs', duration: 45 },
  ],
  staff: [
    { name: 'Carlos', role: 'Barbero', bio: '10 anos de experiencia' },
    { name: 'Maria', role: 'Estilista', bio: 'Especialista en cortes' },
  ],
  workingHours: { start: '08:00', end: '20:00' },
  whatsappPhone: '+595981234567',
  onComplete: vi.fn(),
}

describe('booking-wizard.tsx', () => {
  beforeEach(() => {
    defaultProps.onComplete.mockClear()
  })

  it('renders the 4-step indicator', () => {
    render(<BookingWizard {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders the step 1 headline and service list', () => {
    render(<BookingWizard {...defaultProps} />)
    expect(screen.getByText('1. Selecciona un servicio')).toBeInTheDocument()
    expect(screen.getByText('Corte de Pelo')).toBeInTheDocument()
    expect(screen.getByText('Barba')).toBeInTheDocument()
    // Price shows up once per service selector render
    expect(screen.getAllByText(/50\.000 Gs/).length).toBeGreaterThan(0)
  })

  it('Continuar is disabled until a service is selected', () => {
    render(<BookingWizard {...defaultProps} />)
    const continueBtn = screen.getByRole('button', { name: /continuar/i })
    expect(continueBtn).toBeDisabled()
    fireEvent.click(screen.getByText('Corte de Pelo'))
    expect(continueBtn).not.toBeDisabled()
  })

  it('advances to step 2 (date + time) after selecting and continuing', () => {
    render(<BookingWizard {...defaultProps} />)
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(screen.getByText('2. Selecciona fecha y hora')).toBeInTheDocument()
  })

  it('step 2 exposes a Volver button that returns to step 1', () => {
    render(<BookingWizard {...defaultProps} />)
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    // The back control uses an arrow + "Volver"
    const back = screen.getByRole('button', { name: /volver/i })
    fireEvent.click(back)
    expect(screen.getByText('1. Selecciona un servicio')).toBeInTheDocument()
  })
})

describe('booking-wizard.tsx — without staff', () => {
  it('still renders step 1 with services', () => {
    const propsWithoutStaff = {
      services: [{ name: 'Corte', price: '50.000 Gs' }],
      staff: [],
      workingHours: { start: '08:00', end: '20:00' },
      whatsappPhone: '+595981234567',
      onComplete: vi.fn(),
    }
    render(<BookingWizard {...propsWithoutStaff} />)
    expect(screen.getByText('Corte')).toBeInTheDocument()
    expect(screen.getByText('1. Selecciona un servicio')).toBeInTheDocument()
  })

  it('works with minimal props (no workingHours, no staff)', () => {
    const propsMinimal = {
      services: [{ name: 'Corte', price: '50.000 Gs' }],
      whatsappPhone: '+595981234567',
      onComplete: vi.fn(),
    }
    render(<BookingWizard {...propsMinimal} />)
    expect(screen.getByText('Corte')).toBeInTheDocument()
  })
})
