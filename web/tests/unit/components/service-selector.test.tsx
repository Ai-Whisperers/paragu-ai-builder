import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  it('displays category tabs when categories prop is provided', () => {
    const onSelect = vi.fn()
    render(
      <ServiceSelector
        services={mockServices}
        categories={['Cortes', 'Barba']}
        onSelect={onSelect}
      />,
    )
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Cortes')).toBeInTheDocument()
    expect(screen.getByText('Barba')).toBeInTheDocument()
  })

  it('filters services when a category tab is clicked', () => {
    const onSelect = vi.fn()
    render(
      <ServiceSelector
        services={mockServices}
        categories={['Cortes', 'Barba']}
        onSelect={onSelect}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Barba' }))
    expect(screen.getByText('Arreglo de Barba')).toBeInTheDocument()
    expect(screen.queryByText('Corte de Pelo')).not.toBeInTheDocument()
  })

  it('resets to all services when "Todos" tab is clicked', () => {
    const onSelect = vi.fn()
    render(
      <ServiceSelector
        services={mockServices}
        categories={['Cortes', 'Barba']}
        onSelect={onSelect}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Barba' }))
    fireEvent.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getByText('Corte de Pelo')).toBeInTheDocument()
    expect(screen.getByText('Arreglo de Barba')).toBeInTheDocument()
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