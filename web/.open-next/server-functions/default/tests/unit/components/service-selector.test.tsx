import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import ServiceSelector from '@/components/booking/service-selector'

interface Service {
  name: string
  price?: string
  duration?: number
  category?: string
}

describe('service-selector.tsx', () => {
  const mockServices: Service[] = [
    { name: 'Corte de Pelo', price: '50.000 Gs', duration: 30, category: 'Cortes' },
    { name: 'Corte Fade', price: '60.000 Gs', duration: 35, category: 'Cortes' },
    { name: 'Arreglo de Barba', price: '25.000 Gs', duration: 15, category: 'Barba' },
    { name: 'Afeitado', price: '30.000 Gs', duration: 20, category: 'Barba' },
  ]

  it('should render all services', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={mockServices} onSelect={onSelect} />)
    expect(screen.getByText('Corte de Pelo')).toBeInTheDocument()
    expect(screen.getByText('Corte Fade')).toBeInTheDocument()
  })

  it('should display category tabs', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={mockServices} onSelect={onSelect} />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Cortes')).toBeInTheDocument()
    expect(screen.getByText('Barba')).toBeInTheDocument()
  })

  it('should filter services by category', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={mockServices} onSelect={onSelect} />)
    // Click Cortes filter
    fireEvent.click(screen.getByText('Cortes'))
    expect(screen.getByText('Corte de Pelo')).toBeInTheDocument()
    expect(screen.getByText('Corte Fade')).toBeInTheDocument()
  })

  it('should show all services with "all" category', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={mockServices} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Todos'))
    // Show all services is expected
  })

  it('should call onSelect when service clicked', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={mockServices} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Corte de Pelo'))
    expect(onSelect).toHaveBeenCalledWith(mockServices[0])
  })

  it('should display price when provided', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={mockServices} onSelect={onSelect} />)
    expect(screen.getByText('50.000 Gs')).toBeInTheDocument()
  })

  it('should display duration when provided', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={mockServices} onSelect={onSelect} />)
    expect(screen.getByText('30 min')).toBeInTheDocument()
  })
})

describe('service-selector.tsx - edge cases', () => {
  it('should handle empty services array', () => {
    const onSelect = vi.fn()
    render(<ServiceSelector services={[]} onSelect={onSelect} />)
    expect(screen.queryByText('Corte')).not.toBeInTheDocument()
  })

  it('should handle services without category', () => {
    const servicesNoCategory = [{ name: 'Service', price: '50.000' }]
    const onSelect = vi.fn()
    render(<ServiceSelector services={servicesNoCategory} onSelect={onSelect} />)
    expect(screen.getByText('Service')).toBeInTheDocument()
  })
})