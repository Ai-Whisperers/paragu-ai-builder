'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X } from 'lucide-react'

/**
 * Universal Navigation System
 * 
 * Supports multiple navigation patterns:
 * - Simple nav (flat list)
 * - Dropdown nav (nested items)
 * - Mega menu (multi-column dropdown)
 * - Anchor nav (scroll spy for sections)
 * - Mobile hamburger menu
 * 
 * All patterns work across all business types.
 */

// ============================================
// TYPES
// ============================================

export interface NavItem {
  label: string
  href: string
  /** For dropdown/mega menu */
  children?: NavItem[]
  /** Group mega menu items under columns */
  group?: string
  /** Icon (optional) */
  icon?: React.ReactNode
  /** External link */
  external?: boolean
  /** Active state override */
  active?: boolean
  /** Hide from main nav (only accessible via dropdown) */
  hidden?: boolean
}

export interface AnchorNavItem {
  id: string
  label: string
  /** Icon for anchor link */
  icon?: React.ReactNode
}

// ============================================
// ANCHOR NAVIGATION (Scroll Spy)
// ============================================

interface AnchorNavProps {
  items: AnchorNavItem[]
  className?: string
  /** Sticky position */
  sticky?: boolean
  /** Offset for scroll calculations (header height) */
  offset?: number
  /** Active item background */
  activeBg?: boolean
  /** Mobile drawer style */
  mobileDrawer?: boolean
  /** Current active section (controlled) */
  activeSection?: string
  /** Callback when active section changes */
  onActiveChange?: (sectionId: string) => void
}

/**
 * Anchor Navigation with scroll spy.
 * Automatically highlights the current section as user scrolls.
 * 
 * @example
 * // Basic anchor nav
 * <AnchorNav
 *   items={[
 *     { id: 'services', label: 'Services', icon: <Wrench /> },
 *     { id: 'about', label: 'About', icon: <Info /> },
 *     { id: 'contact', label: 'Contact', icon: <Phone /> },
 *   ]}
 *   sticky
 *   offset={80}
 * />
 */
export function AnchorNav({
  items,
  className,
  sticky = true,
  offset = 80,
  activeBg = true,
  mobileDrawer = false,
  activeSection: controlledActive,
  onActiveChange,
}: AnchorNavProps) {
  const [activeId, setActiveId] = useState<string>(controlledActive || items[0]?.id || '')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Scroll spy effect
  useEffect(() => {
    if (controlledActive) return // Don't spy if controlled

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 100

      // Find which section is currently in view
      for (let i = items.length - 1; i >= 0; i--) {
        const element = document.getElementById(items[i].id)
        if (element) {
          const offsetTop = element.offsetTop
          if (scrollPosition >= offsetTop) {
            if (activeId !== items[i].id) {
              setActiveId(items[i].id)
              onActiveChange?.(items[i].id)
            }
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [items, offset, activeId, controlledActive, onActiveChange])

  // Update controlled value
  useEffect(() => {
    if (controlledActive && controlledActive !== activeId) {
      setActiveId(controlledActive)
    }
  }, [controlledActive, activeId])

  // Click handler with smooth scroll
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - offset
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
      onActiveChange?.(id)
      setMobileOpen(false)
    }
  }, [offset, onActiveChange])

  const currentActive = controlledActive || activeId

  // Mobile drawer version
  if (mobileDrawer) {
    return (
      <>
        {/* Mobile toggle button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile drawer */}
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-40 transform bg-[var(--background)] shadow-2xl transition-transform duration-300 lg:hidden',
            mobileOpen ? 'translate-y-0' : 'translate-y-full'
          )}
          style={{ maxHeight: '60vh' }}
        >
          <nav className="p-6">
            <p className="mb-4 text-sm font-medium text-[var(--text-muted)]">Jump to section</p>
            <div className="space-y-2">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
                    currentActive === item.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--text)] hover:bg-[var(--surface-light)]'
                  )}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Desktop horizontal nav */}
        <nav
          className={cn(
            'hidden lg:block',
            sticky && 'sticky top-0 z-30',
            activeBg && 'bg-[var(--background)]/80 backdrop-blur-md',
            className
          )}
        >
          <Container>
            <div className="flex items-center gap-1 border-b border-[var(--border)] py-3">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    currentActive === item.id
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'text-[var(--text)] hover:bg-[var(--surface-light)]'
                  )}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </a>
              ))}
            </div>
          </Container>
        </nav>
      </>
    )
  }

  // Standard horizontal nav
  return (
    <nav
      className={cn(
        sticky && 'sticky top-0 z-30',
        activeBg && 'bg-[var(--background)]/80 backdrop-blur-md',
        className
      )}
    >
      <Container>
        <div className={cn(
          'flex items-center gap-1 overflow-x-auto py-3',
          'scrollbar-hide'
        )}>
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                currentActive === item.id
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-[var(--text)] hover:bg-[var(--surface-light)]'
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </a>
          ))}
        </div>
      </Container>
    </nav>
  )
}

// ============================================
// MEGA MENU NAVIGATION
// ============================================

interface MegaMenuNavProps {
  items: NavItem[]
  logo?: React.ReactNode
  cta?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary'
  }
  className?: string
  /** Number of columns in mega menu (2-4) */
  columns?: 2 | 3 | 4
  /** Mobile breakpoint */
  mobileBreakpoint?: 'sm' | 'md' | 'lg'
}

/**
 * Mega Menu Navigation for businesses with many services/categories.
 * Supports multi-column dropdowns with grouped items.
 * 
 * @example
 * <MegaMenuNav
 *   items={[
 *     { label: 'Home', href: '/' },
 *     {
 *       label: 'Services',
 *       href: '/services',
 *       children: [
 *         { label: 'Hair Styling', href: '/services/hair', group: 'Hair' },
 *         { label: 'Coloring', href: '/services/color', group: 'Hair' },
 *         { label: 'Manicure', href: '/services/nails', group: 'Nails' },
 *       ]
 *     },
 *   ]}
 *   cta={{ label: 'Book Now', href: '/book' }}
 * />
 */
export function MegaMenuNav({
  items,
  logo,
  cta,
  className,
  columns = 3,
  mobileBreakpoint = 'lg',
}: MegaMenuNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)

  // Group items by their group property
  const groupByCategory = (children: NavItem[]) => {
    const groups: Record<string, NavItem[]> = {}
    children.forEach((item) => {
      const group = item.group || 'General'
      if (!groups[group]) groups[group] = []
      groups[group].push(item)
    })
    return groups
  }

  const columnsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns]

  const breakpointClass = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  }[mobileBreakpoint]

  return (
    <header className={cn('relative z-50 bg-[var(--background)]', className)}>
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo || <span className="text-xl font-bold">Logo</span>}
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden ${breakpointClass}:flex items-center gap-8`}>
            {items.filter(item => !item.hidden).map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <>
                    <button
                      className="flex items-center gap-1 py-2 text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={cn(
                          'transition-transform',
                          activeDropdown === item.label && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {activeDropdown === item.label && (
                      <div className="absolute left-1/2 top-full z-50 w-screen max-w-3xl -translate-x-1/2 pt-4">
                        <div className="rounded-xl bg-[var(--surface)] shadow-card-hover p-6">
                          <div className={cn('grid gap-8', columnsClass)}>
                            {Object.entries(groupByCategory(item.children)).map(([groupName, groupItems]) => (
                              <div key={groupName}>
                                <h4 className="mb-3 text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                                  {groupName}
                                </h4>
                                <ul className="space-y-2">
                                  {groupItems.map((child) => (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        className="flex items-center gap-2 text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                                      >
                                        {child.icon}
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'py-2 transition-colors',
                      item.active
                        ? 'text-[var(--primary)] font-medium'
                        : 'text-[var(--text)] hover:text-[var(--primary)]'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          {cta && (
            <div className={`hidden ${breakpointClass}:block`}>
              <Button
                href={cta.href}
                variant={cta.variant || 'primary'}
              >
                {cta.label}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className={`${breakpointClass}:hidden p-2`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`${breakpointClass}:hidden bg-[var(--surface)] border-t border-[var(--border)]`}>
          <Container>
            <nav className="py-4">
              {items.filter(item => !item.hidden).map((item) => (
                <div key={item.href} className="border-b border-[var(--border)] last:border-0">
                  {item.children ? (
                    <>
                      <button
                        className="flex w-full items-center justify-between py-3 text-[var(--text)]"
                        onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={cn(
                            'transition-transform',
                            mobileSubmenu === item.label && 'rotate-180'
                          )}
                        />
                      </button>
                      {mobileSubmenu === item.label && (
                        <div className="pb-3 pl-4">
                          {Object.entries(groupByCategory(item.children)).map(([groupName, groupItems]) => (
                            <div key={groupName} className="mb-3">
                              <p className="mb-2 text-sm text-[var(--text-muted)]">{groupName}</p>
                              {groupItems.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block py-2 text-[var(--text)] hover:text-[var(--primary)]"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.icon && <span className="mr-2">{child.icon}</span>}
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 text-[var(--text)] hover:text-[var(--primary)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {cta && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <Button
                    href={cta.href}
                    variant={cta.variant || 'primary'}
                    className="w-full"
                  >
                    {cta.label}
                  </Button>
                </div>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}

// ============================================
// BREADCRUMB NAVIGATION
// ============================================

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  className?: string
  /** Show home icon for first item */
  showHomeIcon?: boolean
  /** Separator style */
  separator?: 'chevron' | 'slash' | 'arrow' | 'dot'
  /** Include schema.org JSON-LD */
  includeSchema?: boolean
}

/**
 * Breadcrumb navigation with structured data support.
 * 
 * @example
 * <BreadcrumbNav
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Services', href: '/services' },
 *     { label: 'Hair Styling' }, // Current page (no href)
 *   ]}
 *   includeSchema
 * />
 */
export function BreadcrumbNav({
  items,
  className,
  showHomeIcon = true,
  separator = 'chevron',
  includeSchema = true,
}: BreadcrumbNavProps) {
  const separators = {
    chevron: <span className="text-[var(--text-muted)]">/</span>,
    slash: <span className="text-[var(--text-muted)]">/</span>,
    arrow: <span className="text-[var(--text-muted)]">→</span>,
    dot: <span className="text-[var(--text-muted)]">•</span>,
  }

  // Schema.org BreadcrumbList JSON-LD
  const schemaData = includeSchema ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? {
        '@type': 'WebPage',
        '@id': item.href,
      } : undefined,
    })),
  } : null

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && separators[separator]}
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {index === 0 && showHomeIcon && item.icon}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-[var(--text)] font-medium" aria-current="page">
                  {index === 0 && showHomeIcon && item.icon}
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// ============================================
// PAGINATION
// ============================================

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** URL pattern with :page placeholder */
  hrefPattern: string
  /** Show first/last buttons */
  showFirstLast?: boolean
  /** Number of page buttons to show */
  siblingCount?: number
  className?: string
}

/**
 * Pagination with accessible navigation.
 * 
 * @example
 * <Pagination
 *   currentPage={3}
 *   totalPages={10}
 *   hrefPattern="/blog/page/:page"
 * />
 */
export function Pagination({
  currentPage,
  totalPages,
  hrefPattern,
  showFirstLast = true,
  siblingCount = 2,
  className,
}: PaginationProps) {
  const getHref = (page: number) => hrefPattern.replace(':page', String(page))

  // Generate page range with ellipsis
  const getPageRange = () => {
    const pages: (number | string)[] = []
    
    const startPage = Math.max(1, currentPage - siblingCount)
    const endPage = Math.min(totalPages, currentPage + siblingCount)

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageRange()

  return (
    <nav aria-label="Pagination" className={className}>
      <div className="flex items-center gap-2">
        {/* Previous */}
        {showFirstLast && currentPage > 1 && (
          <Link
            href={getHref(currentPage - 1)}
            className="rounded-lg px-3 py-2 text-[var(--text)] hover:bg-[var(--surface-light)] transition-colors"
            aria-label="Previous page"
          >
            ← Prev
          </Link>
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => (
            page === '...' ? (
              <span key={index} className="px-3 py-2 text-[var(--text-muted)]">...</span>
            ) : (
              <Link
                key={page}
                href={getHref(page as number)}
                className={cn(
                  'min-w-[40px] rounded-lg px-3 py-2 text-center transition-colors',
                  page === currentPage
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-medium'
                    : 'text-[var(--text)] hover:bg-[var(--surface-light)]'
                )}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )
          ))}
        </div>

        {/* Next */}
        {showFirstLast && currentPage < totalPages && (
          <Link
            href={getHref(currentPage + 1)}
            className="rounded-lg px-3 py-2 text-[var(--text)] hover:bg-[var(--surface-light)] transition-colors"
            aria-label="Next page"
          >
            Next →
          </Link>
        )}
      </div>
    </nav>
  )
}

// ============================================
// LOAD MORE / INFINITE SCROLL
// ============================================

interface LoadMoreProps {
  hasMore: boolean
  loading?: boolean
  onLoadMore: () => void
  /** Button text */
  buttonText?: string
  /** Loading text */
  loadingText?: string
  /** Use intersection observer for infinite scroll */
  infiniteScroll?: boolean
  /** Trigger when this many pixels from bottom */
  scrollThreshold?: number
  className?: string
}

/**
 * Load more button with optional infinite scroll.
 * 
 * @example
 * <LoadMore
 *   hasMore={hasMorePages}
 *   loading={isLoading}
 *   onLoadMore={loadNextPage}
 *   infiniteScroll
 * />
 */
export function LoadMore({
  hasMore,
  loading = false,
  onLoadMore,
  buttonText = 'Load More',
  loadingText = 'Loading...',
  infiniteScroll = false,
  scrollThreshold = 200,
  className,
}: LoadMoreProps) {
  const observerRef = useCallback((node: HTMLDivElement) => {
    if (!infiniteScroll || loading || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: `${scrollThreshold}px` }
    )

    if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [infiniteScroll, loading, hasMore, onLoadMore, scrollThreshold])

  if (!hasMore) return null

  return (
    <div ref={observerRef} className={cn('flex justify-center py-8', className)}>
      <Button
        onClick={onLoadMore}
        disabled={loading}
        variant="secondary"
      >
        {loading ? loadingText : buttonText}
      </Button>
    </div>
  )
}
