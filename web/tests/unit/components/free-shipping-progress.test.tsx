import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FreeShippingProgress } from '@/components/commerce/free-shipping-progress'

// viajero-comercio: Gs. 300.000 → 30_000_000 cents
// fun4me:          Gs. 200.000 → 20_000_000 cents
// (see web/lib/commerce/tenant-config.ts)

describe('free-shipping-progress.tsx', () => {
  it('renders nothing when the tenant has no threshold configured', () => {
    const { container } = render(
      <FreeShippingProgress siteSlug="unknown-tenant" subtotalCents={5_000_000} currency="PYG" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the cart currency is not PYG', () => {
    const { container } = render(
      <FreeShippingProgress siteSlug="viajero-comercio" subtotalCents={5_000_000} currency="USD" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows remaining gap and a partial progress bar below the threshold', () => {
    render(<FreeShippingProgress siteSlug="viajero-comercio" subtotalCents={15_000_000} currency="PYG" />)
    expect(screen.getByText(/Te faltan .* para envío gratis/)).toBeInTheDocument()
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '50')
  })

  it('shows the reached message and a full bar at or above the threshold', () => {
    render(<FreeShippingProgress siteSlug="fun4me" subtotalCents={25_000_000} currency="PYG" />)
    expect(screen.getByText(/¡Ya tenés envío gratis!/)).toBeInTheDocument()
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '100')
  })

  it('caps the progress percentage at 100 when subtotal exceeds the threshold', () => {
    render(<FreeShippingProgress siteSlug="fun4me" subtotalCents={1_000_000_000} currency="PYG" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '100')
  })
})
