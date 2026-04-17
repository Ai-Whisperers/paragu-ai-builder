import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MembershipPlansSection } from '@/components/sections/membership-plans-section'

describe('membership-plans-section.tsx', () => {
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

  it('should render all plans', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} whatsappPhone="+595981234567" />)
    expect(screen.getByText('Basico')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Elite')).toBeInTheDocument()
  })

  it('should display popular badge on popular plan', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} whatsappPhone="+595981234567" />)
    expect(screen.getByText('Mas Popular')).toBeInTheDocument()
  })

  it('should display price for each plan', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} whatsappPhone="+595981234567" />)
    expect(screen.getByText('150.000')).toBeInTheDocument()
    expect(screen.getByText('300.000')).toBeInTheDocument()
  })

  it('should display features for each plan', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} whatsappPhone="+595981234567" />)
    expect(screen.getByText('Sala de pesas')).toBeInTheDocument()
    expect(screen.getByText('Clases ilimitadas')).toBeInTheDocument()
  })

  it('should call onSelectPlan when CTA clicked', () => {
    const onSelectPlan = vi.fn()
    render(
      <MembershipPlansSection 
        title="Planes" 
        plans={mockPlans} 
        whatsappPhone="+595981234567"
        onSelectPlan={onSelectPlan}
      />
    )
    fireEvent.click(screen.getAllByText('Comprar')[0])
    expect(onSelectPlan).toHaveBeenCalled()
  })

  it('should open WhatsApp with message when CTA clicked without handler', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => window)
    render(<MembershipPlansSection title="Planes" plans={mockPlans} whatsappPhone="+595981234567" />)
    fireEvent.click(screen.getAllByText('Comprar')[0])
    expect(windowOpenSpy).toHaveBeenCalled()
    windowOpenSpy.mockRestore()
  })

  it('should display default CTA text', () => {
    render(<MembershipPlansSection title="Planes" plans={mockPlans} whatsappPhone="+595981234567" />)
    expect(screen.getAllByText('Comprar')[0]).toBeInTheDocument()
  })

  it('should display custom CTA from plan', () => {
    const plansWithCustomCta = [
      { ...mockPlans[0], cta: 'Suscribirse' },
    ]
    render(<MembershipPlansSection title="Planes" plans={plansWithCustomCta} whatsappPhone="+595981234567" />)
    expect(screen.getByText('Suscribirse')).toBeInTheDocument()
  })
})