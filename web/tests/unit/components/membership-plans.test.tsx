import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MembershipPlansSection } from '@/components/sections/commerce/membership-plans-section'

const mockPlans = [
  {
    name: 'Basico',
    price: '150.000',
    period: 'mes',
    description: 'Acceso a sala de pesas',
    features: ['Sala de pesas', 'Maquinas', 'Vestuarios'],
    popular: false,
  },
  {
    name: 'Premium',
    price: '300.000',
    period: 'mes',
    description: 'Todo incluido',
    features: ['Sala de pesas', 'Clases ilimitadas', 'Personal trainer'],
    popular: true,
  },
  {
    name: 'Elite',
    price: '500.000',
    period: 'mes',
    description: 'Ultimo nivel',
    features: ['Todo Premium', 'Sauna', 'Nutricionista'],
    popular: false,
  },
]

describe('membership-plans-section.tsx', () => {
  it('renders every plan name', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} />)
    expect(screen.getByText('Basico')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Elite')).toBeInTheDocument()
  })

  it('flags the popular plan with a badge', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} />)
    expect(screen.getByText('Más Popular')).toBeInTheDocument()
  })

  it('renders each price', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} />)
    expect(screen.getByText('150.000')).toBeInTheDocument()
    expect(screen.getByText('300.000')).toBeInTheDocument()
    expect(screen.getByText('500.000')).toBeInTheDocument()
  })

  it('lists features per plan', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} />)
    // "Sala de pesas" appears in 2 plans
    expect(screen.getAllByText('Sala de pesas').length).toBeGreaterThan(1)
    expect(screen.getByText('Clases ilimitadas')).toBeInTheDocument()
    expect(screen.getByText('Sauna')).toBeInTheDocument()
  })

  it('uses default CTA text when plan has no cta', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} />)
    expect(screen.getAllByRole('button', { name: 'Comprar' }).length).toBe(mockPlans.length)
  })

  it('uses per-plan cta when provided', () => {
    const plans = [{ ...mockPlans[0], cta: 'Suscribirse' }]
    render(<MembershipPlansSection title="Planes" plans={plans} />)
    expect(screen.getByRole('button', { name: 'Suscribirse' })).toBeInTheDocument()
  })

  it('invokes onSelectPlan when a CTA is clicked', () => {
    const onSelectPlan = vi.fn()
    render(
      <MembershipPlansSection
        title="Planes"
        plans={mockPlans}
        onSelectPlan={onSelectPlan}
      />,
    )
    fireEvent.click(screen.getAllByRole('button', { name: 'Comprar' })[0])
    expect(onSelectPlan).toHaveBeenCalledTimes(1)
    expect(onSelectPlan.mock.calls[0][0].name).toBe('Basico')
  })

  it('opens WhatsApp when no onSelectPlan and whatsappPhone is set', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => window)
    render(
      <MembershipPlansSection
        title="Planes"
        plans={mockPlans}
        whatsappPhone="+595981234567"
      />,
    )
    fireEvent.click(screen.getAllByRole('button', { name: 'Comprar' })[0])
    expect(openSpy).toHaveBeenCalled()
    const url = String(openSpy.mock.calls[0][0])
    expect(url).toContain('wa.me/595981234567')
    openSpy.mockRestore()
  })
})
