import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PortfolioSection from '@/components/sections/portfolio-section'

describe('portfolio-section.tsx', () => {
  const mockItems = [
    { title: 'Project 1', image: 'img1.jpg', category: ' weddings' },
    { title: 'Project 2', image: 'img2.jpg', category: 'Editorial' },
    { title: 'Project 3', image: 'img3.jpg', category: ' weddings' },
  ]

  it('should render all items when category is all', () => {
    render(<PortfolioSection title="Our Work" items={mockItems} />)
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
    expect(screen.getByText('Project 3')).toBeInTheDocument()
  })

  it('should render category filter buttons', () => {
    const categories = [' weddings', 'Editorial']
    render(
      <PortfolioSection title="Our Work" items={mockItems} categories={categories} />
    )
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText(' weddings')).toBeInTheDocument()
    expect(screen.getByText('Editorial')).toBeInTheDocument()
  })

  it('should filter items by category', () => {
    const categories = [' weddings', 'Editorial']
    render(
      <PortfolioSection title="Our Work" items={mockItems} categories={categories} />
    )
    // Click wedding filter
    fireEvent.click(screen.getByText(' weddings'))
    // wedding items should show
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 3')).toBeInTheDocument()
  })

  it('should show "no results" when category has no items', () => {
    const itemsWithCategory = [
      { title: 'P1', category: 'A' },
    ]
    const categories = ['B']
    render(
      <PortfolioSection title="Work" items={itemsWithCategory} categories={categories} />
    )
    // Select category with no items - component should handle gracefully
  })

  it('should return null when no items provided', () => {
    const result = render(
      <PortfolioSection title="Work" items={[]} />
    )
    expect(result).toBeNull()
  })

  it('should show placeholder for items without images', () => {
    const itemsNoImage = [
      { title: 'Project A' },
      { title: 'Project B' },
    ]
    render(<PortfolioSection title="Work" items={itemsNoImage} />)
    expect(screen.getByText('P')).toBeInTheDocument()
    expect(screen.getByText('P')).toBeInTheDocument()
  })
})