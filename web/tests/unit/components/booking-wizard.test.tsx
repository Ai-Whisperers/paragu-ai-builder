import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookingWizard from '@/components/booking/booking-wizard'

describe('booking-wizard.tsx', () => {
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

  beforeEach(() => {
    defaultProps.onComplete.mockClear()
  })

  it('should render step indicator', () => {
    render(<BookingWizard {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('should render services in step 1', () => {
    render(<BookingWizard {...defaultProps} />)
    expect(screen.getByText('Corte de Pelo')).toBeInTheDocument()
    expect(screen.getByText('50.000 Gs')).toBeInTheDocument()
  })

  it('should allow service selection', () => {
    render(<BookingWizard {...defaultProps} />)
    const serviceButton = screen.getByText('Corte de Pelo')
    fireEvent.click(serviceButton)
    expect(screen.getByText('Barra')).toBeInTheDocument()
  })

  it('should proceed to step 2 after service selection', () => {
    render(<BookingWizard {...defaultProps} />)
    const serviceButton = screen.getByText('Corte de Pelo')
    fireEvent.click(serviceButton)
    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)
    expect(screen.getByText('Selecciona una fecha')).toBeInTheDocument()
  })

  it('should allow date selection', () => {
    render(<BookingWizard {...defaultProps} />)
    // Select service first
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByText('Continuar'))
    // Should show date picker
    expect(screen.getByText('Selecciona una fecha')).toBeInTheDocument()
  })

  it('should show staff selection when staff provided', () => {
    render(<BookingWizard {...defaultProps} />)
    // Select service
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByText('Continuar'))
    // Select date
    fireEvent.click(screen.getByText('Continuar'))
    expect(screen.getByText('Selecciona un profesional')).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
  })

  it('should proceed to form step', () => {
    render(<BookingWizard {...defaultProps} />)
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Continuar'))
    expect(screen.getByText('Datos de contacto')).toBeInTheDocument()
  })

  it('should show form fields in final step', () => {
    render(<BookingWizard {...defaultProps} />)
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Continuar'))
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tu telefono')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tu email')).toBeInTheDocument()
  })

  it('should validate form before submission', async () => {
    render(<BookingWizard {...defaultProps} />)
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Continuar'))
    // Try to submit without filling form
    fireEvent.click(screen.getByText('Confirmar Reserva'))
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
  })

  it('should allow going back', () => {
    render(<BookingWizard {...defaultProps} />)
    fireEvent.click(screen.getByText('Corte de Pelo'))
    fireEvent.click(screen.getByText('Continuar'))
    expect(screen.getByText('Selecciona una fecha')).toBeInTheDocument()
    const backButton = screen.getByText('Atras')
    fireEvent.click(backButton)
    expect(screen.getByText('Corte de Pelo')).toBeInTheDocument()
  })
})

describe('booking-wizard.tsx - without optional params', () => {
  it('should work without staff', () => {
    const propsWithoutStaff = {
      services: [{ name: 'Corte', price: '50.000 Gs' }],
      staff: [],
      workingHours: { start: '08:00', end: '20:00' },
      whatsappPhone: '+595981234567',
      onComplete: vi.fn(),
    }
    render(<BookingWizard {...propsWithoutStaff} />)
    fireEvent.click(screen.getByText('Corte'))
    fireEvent.click(screen.getByText('Continuar'))
    // Should skip staff step and go to form
    expect(screen.getByText('Datos de contacto')).toBeInTheDocument()
  })

  it('should use default working hours', () => {
    const propsMinimal = {
      services: [{ name: 'Corte', price: '50.000 Gs' }],
      whatsappPhone: '+595981234567',
      onComplete: vi.fn(),
    }
    render(<BookingWizard {...propsMinimal} />)
    expect(screen.getByText('Corte')).toBeInTheDocument()
  })
})