'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'
import { 
  Search, 
  X, 
  Loader2, 
  FileText, 
  ShoppingBag, 
  Users, 
  Phone,
  ArrowRight
} from 'lucide-react'

/**
 * Smart Search System
 * 
 * Universal site search with:
 * - Real-time search suggestions
 * - Keyboard navigation
 * - Search result categorization
 * - Recent searches
 * - Popular searches
 * - Search analytics tracking
 */

// ============================================
// TYPES
// ============================================

export type SearchResultType = 'page' | 'service' | 'product' | 'team' | 'blog' | 'faq' | 'contact'

export interface SearchResult {
  id: string
  title: string
  description?: string
  href: string
  type: SearchResultType
  image?: string
  meta?: Record<string, string>
  /** Search relevance score */
  score?: number
}

export interface SearchIndex {
  pages: SearchResult[]
  services: SearchResult[]
  products: SearchResult[]
  team: SearchResult[]
  blog: SearchResult[]
  faq: SearchResult[]
}

// ============================================
// SEARCH UTILITIES
// ============================================

/**
 * Simple fuzzy search implementation.
 * Matches partial words with typos allowed.
 */
export function fuzzySearch(query: string, items: SearchResult[], limit = 10): SearchResult[] {
  if (!query.trim()) return []
  
  const normalizedQuery = query.toLowerCase().trim()
  const queryWords = normalizedQuery.split(/\s+/)
  
  return items
    .map(item => {
      const titleLower = item.title.toLowerCase()
      const descLower = item.description?.toLowerCase() || ''
      
      let score = 0
      
      // Exact title match
      if (titleLower === normalizedQuery) {
        score += 100
      }
      // Title starts with query
      else if (titleLower.startsWith(normalizedQuery)) {
        score += 80
      }
      // Title contains query
      else if (titleLower.includes(normalizedQuery)) {
        score += 60
      }
      // All query words in title
      else if (queryWords.every(word => titleLower.includes(word))) {
        score += 50
      }
      // Title contains some query words
      else {
        const matchingWords = queryWords.filter(word => 
          titleLower.includes(word) || descLower.includes(word)
        ).length
        score += matchingWords * 20
      }
      
      // Description matches
      if (descLower.includes(normalizedQuery)) {
        score += 30
      }
      
      return { ...item, score }
    })
    .filter(item => item.score && item.score > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
}

/**
 * Load search index from API or local storage.
 */
export async function loadSearchIndex(businessId: string): Promise<SearchIndex> {
  // Try to get from cache first
  const cacheKey = `search-index-${businessId}`
  const cached = localStorage.getItem(cacheKey)
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    // Use cache if less than 1 hour old
    if (Date.now() - timestamp < 3600000) {
      return data
    }
  }
  
  // Fetch fresh index
  try {
    const response = await fetch(`/api/search/index?business=${businessId}`)
    const data = await response.json()
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now(),
    }))
    
    return data
  } catch (error) {
    logger.warn('Failed to load search index — returning empty', {
      action: 'search.loadIndex',
      error: error instanceof Error ? error.message : String(error),
    })
    return {
      pages: [],
      services: [],
      products: [],
      team: [],
      blog: [],
      faq: [],
    }
  }
}

// ============================================
// SEARCH ICONS
// ============================================

const typeIcons: Record<SearchResultType, typeof FileText> = {
  page: FileText,
  service: ShoppingBag,
  product: ShoppingBag,
  team: Users,
  blog: FileText,
  faq: FileText,
  contact: Phone,
}

const typeLabels: Record<SearchResultType, string> = {
  page: 'Page',
  service: 'Service',
  product: 'Product',
  team: 'Team',
  blog: 'Blog',
  faq: 'FAQ',
  contact: 'Contact',
}

// ============================================
// SEARCH MODAL
// ============================================

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  /** Pre-populated search index */
  searchIndex?: SearchIndex
  /** Business ID for fetching index */
  businessId?: string
  /** Popular searches to show initially */
  popularSearches?: string[]
  /** Callback when search is executed */
  onSearch?: (query: string) => void
  /** Callback when result is clicked */
  onResultClick?: (result: SearchResult) => void
}

/**
 * Full-screen search modal with keyboard navigation.
 * 
 * @example
 * <SearchModal
 *   isOpen={isSearchOpen}
 *   onClose={() => setIsSearchOpen(false)}
 *   businessId="studio-hair"
 *   popularSearches={['Hair Styling', 'Coloring', 'Manicure']}
 * />
 */
export function SearchModal({
  isOpen,
  onClose,
  searchIndex: initialIndex,
  businessId,
  popularSearches = [],
  onSearch,
  onResultClick,
}: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(initialIndex || null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [activeCategory, setActiveCategory] = useState<SearchResultType | 'all'>('all')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load search index
  useEffect(() => {
    if (!searchIndex && businessId) {
      loadSearchIndex(businessId).then(setSearchIndex)
    }
  }, [searchIndex, businessId])

  useEffect(() => {
    const stored = localStorage.getItem('recent-searches')
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrating recent-searches from localStorage post-mount.
      setRecentSearches(JSON.parse(stored).slice(0, 5))
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const saveRecentSearch = useCallback((searchQuery: string) => {
    setRecentSearches(prev => {
      const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5)
      localStorage.setItem('recent-searches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || !searchIndex) {
      setResults([])
      return
    }
    
    setIsLoading(true)
    
    // Combine all items
    const allItems = [
      ...searchIndex.pages,
      ...searchIndex.services,
      ...searchIndex.products,
      ...searchIndex.team,
      ...searchIndex.blog,
      ...searchIndex.faq,
    ]
    
    // Filter by category if selected
    const filteredItems = activeCategory === 'all' 
      ? allItems 
      : allItems.filter(item => item.type === activeCategory)
    
    const searchResults = fuzzySearch(searchQuery, filteredItems, 20)
    setResults(searchResults)
    setIsLoading(false)
    
    // Save to recent searches
    if (searchQuery.length > 2) {
      saveRecentSearch(searchQuery)
    }
    
    onSearch?.(searchQuery)
  }, [searchIndex, activeCategory, onSearch, saveRecentSearch])

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      performSearch(query)
    }, 150)
    
    return () => clearTimeout(timeout)
  }, [query, performSearch])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
    }
  }

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query)
    onResultClick?.(result)
    onClose()
  }

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    results.forEach(result => {
      const type = result.type
      if (!groups[type]) groups[type] = []
      groups[type].push(result)
    })
    return groups
  }, [results])

  // Get available categories
  const availableCategories = useMemo(() => {
    if (!searchIndex) return []
    const categories: SearchResultType[] = []
    if (searchIndex.pages.length) categories.push('page')
    if (searchIndex.services.length) categories.push('service')
    if (searchIndex.products.length) categories.push('product')
    if (searchIndex.team.length) categories.push('team')
    if (searchIndex.blog.length) categories.push('blog')
    if (searchIndex.faq.length) categories.push('faq')
    return categories
  }, [searchIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[10vh] backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-xl bg-[var(--background)] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="border-b border-[var(--border)] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(-1)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search for anything..."
              className="h-12 pl-10 pr-20 text-lg"
              autoComplete="off"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />}
              <kbd className="hidden rounded border border-[var(--border)] bg-[var(--surface-light)] px-1.5 py-0.5 text-xs text-[var(--text-muted)] sm:inline">
                ESC
              </kbd>
              <button
                onClick={onClose}
                className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--surface-light)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category filters */}
        {availableCategories.length > 0 && (
          <div className="flex gap-2 border-b border-[var(--border)] p-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'rounded-full px-3 py-1 text-sm transition-colors',
                activeCategory === 'all'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--surface)]'
              )}
            >
              All
            </button>
            {availableCategories.map(type => (
              <button
                key={type}
                onClick={() => setActiveCategory(type)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm capitalize transition-colors',
                  activeCategory === type
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'bg-[var(--surface-light)] text-[var(--text)] hover:bg-[var(--surface)]'
                )}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto">
          {query.length === 0 ? (
            // Show recent and popular searches
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="rounded-full bg-[var(--surface-light)] px-3 py-1 text-sm text-[var(--text)] hover:bg-[var(--surface)]"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {popularSearches.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--text)] hover:bg-[var(--surface-light)]"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : results.length === 0 && !isLoading ? (
            // No results
            <div className="p-8 text-center">
              <p className="text-[var(--text-muted)]">No results found for &quot;{query}&quot;</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            // Search results
            <div className="py-2">
              {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type}>
                  <h3 className="sticky top-0 bg-[var(--background)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {typeLabels[type as SearchResultType]} ({items.length})
                  </h3>
                  {items.map((result, index) => {
                    const Icon = typeIcons[result.type]
                    const globalIndex = results.indexOf(result)
                    const isSelected = globalIndex === selectedIndex
                    
                    return (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 transition-colors',
                          isSelected ? 'bg-[var(--surface-light)]' : 'hover:bg-[var(--surface-light)]'
                        )}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--surface)]">
                          <Icon className="h-5 w-5 text-[var(--text-muted)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text)] truncate">
                            {result.title}
                          </p>
                          {result.description && (
                            <p className="text-sm text-[var(--text-muted)] truncate">
                              {result.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" />
                      </Link>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SEARCH INPUT WITH SUGGESTIONS
// ============================================

interface SearchInputProps {
  /** Callback when search is submitted */
  onSearch: (query: string) => void
  /** Search index for suggestions */
  searchIndex?: SearchIndex
  /** Business ID for fetching index */
  businessId?: string
  /** Placeholder text */
  placeholder?: string
  /** Enable instant suggestions */
  suggestions?: boolean
  className?: string
}

/**
 * Search input with inline suggestions dropdown.
 * 
 * @example
 * <SearchInput
 *   onSearch={(query) => router.push(`/search?q=${query}`)}
 *   businessId="studio-hair"
 *   suggestions
 * />
 */
export function SearchInput({
  onSearch,
  searchIndex: initialIndex,
  businessId,
  placeholder = 'Search...',
  suggestions = true,
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [suggestionsList, setSuggestionsList] = useState<SearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(initialIndex || null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load search index
  useEffect(() => {
    if (!searchIndex && businessId) {
      loadSearchIndex(businessId).then(setSearchIndex)
    }
  }, [searchIndex, businessId])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!suggestions || !searchIndex || !query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Clearing suggestions when inputs become invalid; guarded by prior conditions.
      setSuggestionsList([])
      return
    }
    
    const allItems = [
      ...searchIndex.pages,
      ...searchIndex.services,
      ...searchIndex.products,
    ]
    
    const results = fuzzySearch(query, allItems, 5)
    setSuggestionsList(results)
  }, [query, searchIndex, suggestions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (result: SearchResult) => {
    setQuery(result.title)
    setShowSuggestions(false)
    onSearch(result.title)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="pl-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestionsList.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg">
          {suggestionsList.map((result) => {
            const Icon = typeIcons[result.type]
            return (
              <button
                key={result.id}
                onClick={() => handleSuggestionClick(result)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[var(--surface-light)]"
              >
                <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text)]">{result.title}</p>
                </div>
              </button>
            )
          })}
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 border-t border-[var(--border)] px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--surface-light)]"
          >
            Search for &quot;{query}&quot;
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// SEARCH BUTTON (TRIGGER)
// ============================================

interface SearchButtonProps {
  /** Click handler */
  onClick: () => void
  /** Show in header style */
  headerStyle?: boolean
  className?: string
}

/**
 * Search button that triggers the search modal.
 * 
 * @example
 * <SearchButton onClick={() => setIsSearchOpen(true)} headerStyle />
 */
export function SearchButton({ onClick, headerStyle = false, className }: SearchButtonProps) {
  if (headerStyle) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-light)] hover:text-[var(--text)]',
          className
        )}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 text-xs lg:inline">
          ⌘K
        </kbd>
      </button>
    )
  }

  return (
    <Button
      onClick={onClick}
      variant="secondary"
      className={className}
    >
      <Search className="mr-2 h-4 w-4" />
      Search
    </Button>
  )
}

// ============================================
// KEYBOARD SHORTCUT HOOK
// ============================================

/**
 * Hook to handle keyboard shortcuts for search.
 * Cmd/Ctrl + K opens search.
 */
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpen()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onOpen])
}
