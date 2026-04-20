import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PortfolioSection } from '@/components/sections/portfolio-section'

// next/image's default loader validates URLs, so use real-looking paths.
const mockItems = [
  { title: 'Project 1', image: '/img/p1.jpg', category: 'Weddings' },
  { title: 'Project 2', image: '/img/p2.jpg', category: 'Editorial' },
  { title: 'Project 3', image: '/img/p3.jpg', category: 'Weddings' },
]

describe('portfolio-section.tsx', () => {
  it('renders the title', () => {
    render(<PortfolioSection title="Our Work" items={mockItems} />)
    expect(screen.getByRole('heading', { name: 'Our Work' })).toBeInTheDocument()
  })

  it('renders all items when no category is active', () => {
    render(<PortfolioSection title="Our Work" items={mockItems} />)
    // Titles live inside hover overlays — scoped with getAllByText to be order-agnostic
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
    expect(screen.getByText('Project 3')).toBeInTheDocument()
  })

  it('renders category filter buttons when categories are provided', () => {
    render(
      <PortfolioSection
        title="Our Work"
        items={mockItems}
        categories={['Weddings', 'Editorial']}
      />,
    )
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Weddings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editorial' })).toBeInTheDocument()
  })

  it('filters items when a category button is clicked', () => {
    render(
      <PortfolioSection
        title="Our Work"
        items={mockItems}
        categories={['Weddings', 'Editorial']}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Editorial' }))
    expect(screen.getByText('Project 2')).toBeInTheDocument()
    expect(screen.queryByText('Project 1')).not.toBeInTheDocument()
  })

  it('returns null when items array is empty', () => {
    const { container } = render(<PortfolioSection title="Work" items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows the title initial as a placeholder when no image is provided', () => {
    const itemsNoImage = [{ title: 'Adrian' }]
    render(<PortfolioSection title="Work" items={itemsNoImage} />)
    // First letter is rendered inside a gradient placeholder div
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
