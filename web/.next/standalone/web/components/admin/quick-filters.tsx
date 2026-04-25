'use client'

import { cn } from '@/lib/utils'
import { 
  Phone, Star, Clock, MessageCircle, 
  MapPin, Globe, AlertCircle, CheckCircle2,
  Calendar, TrendingUp
} from 'lucide-react'

export type QuickFilterType = 
  | 'has_phone'
  | 'has_whatsapp'
  | 'no_website'
  | 'high_priority'
  | 'recent'
  | 'favorites'
  | 'responded'
  | 'pending_contact'
  | 'this_week'
  | 'unclaimed'

export interface QuickFilter {
  id: QuickFilterType
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'has_phone',
    label: 'Con Teléfono',
    description: 'Leads que tienen número de teléfono',
    icon: <Phone className="w-4 h-4" />,
    color: 'bg-[var(--color-info-surface)] text-[var(--color-info)] border-blue-200'
  },
  {
    id: 'has_whatsapp',
    label: 'Con WhatsApp',
    description: 'Leads que tienen WhatsApp disponible',
    icon: <MessageCircle className="w-4 h-4" />,
    color: 'bg-[var(--color-success-surface)] text-[var(--color-success)] border-[var(--color-success)]'
  },
  {
    id: 'no_website',
    label: 'Sin Web',
    description: 'Negocios que aún no tienen sitio web',
    icon: <Globe className="w-4 h-4" />,
    color: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-[var(--color-warning)]'
  },
  {
    id: 'high_priority',
    label: 'Prioridad Alta',
    description: 'Leads con prioridad A o B',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'bg-[var(--color-error-surface)] text-[var(--color-error)] border-[var(--color-error)]'
  },
  {
    id: 'recent',
    label: 'Recientes',
    description: 'Importados en los últimos 7 días',
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-[var(--color-info-surface)] text-[var(--color-info)] border-[var(--color-info)]'
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    description: 'Leads marcados como favoritos',
    icon: <Star className="w-4 h-4" />,
    color: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-[var(--color-warning)]'
  },
  {
    id: 'responded',
    label: 'Respondieron',
    description: 'Leads que han respondido al contacto',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'pending_contact',
    label: 'Pendientes',
    description: 'Leads que aún no han sido contactados',
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-slate-50 text-slate-700 border-slate-200'
  },
  {
    id: 'this_week',
    label: 'Esta Semana',
    description: 'Actividad programada esta semana',
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    id: 'unclaimed',
    label: 'Sin Asignar',
    description: 'Leads que no tienen asignación',
    icon: <MapPin className="w-4 h-4" />,
    color: 'bg-gray-50 text-gray-700 border-gray-200'
  }
]

interface QuickFiltersProps {
  selectedFilters: QuickFilterType[]
  onFilterToggle: (filterId: QuickFilterType) => void
  onClearFilters: () => void
  className?: string
  layout?: 'horizontal' | 'vertical' | 'compact'
  showCounts?: boolean
  counts?: Record<QuickFilterType, number>
}

export function QuickFilters({
  selectedFilters,
  onFilterToggle,
  onClearFilters,
  className,
  layout = 'horizontal',
  showCounts = false,
  counts = {} as Record<QuickFilterType, number>
}: QuickFiltersProps) {
  const hasActiveFilters = selectedFilters.length > 0

  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    compact: 'flex flex-wrap gap-1'
  }

  const buttonSizeClasses = {
    horizontal: 'px-3 py-2 text-sm',
    vertical: 'px-3 py-2.5 text-sm justify-start',
    compact: 'px-2 py-1 text-xs'
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Filtros Rápidos
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-[var(--color-info)] hover:text-[var(--color-info)] 
                     hover:underline transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className={layoutClasses[layout]}>
        {QUICK_FILTERS.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id)
          const count = counts[filter.id]

          return (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border transition-all",
                "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1",
                buttonSizeClasses[layout],
                isSelected 
                  ? cn(filter.color, 'ring-2 ring-offset-1') 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}
              title={filter.description}
            >
              <span className={cn(
                "transition-colors",
                isSelected ? '' : 'text-gray-400'
              )}>
                {filter.icon}
              </span>
              <span className="font-medium">{filter.label}</span>
              {showCounts && count !== undefined && (
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-xs",
                  isSelected ? 'bg-white/30' : 'bg-gray-100'
                )}>
                  {count}
                </span>
              )}
              {isSelected && layout !== 'compact' && (
                <span className="ml-auto text-xs opacity-70">✓</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Compact chip version for mobile or tight spaces
interface QuickFilterChipsProps {
  selectedFilters: QuickFilterType[]
  onRemoveFilter: (filterId: QuickFilterType) => void
  className?: string
}

export function QuickFilterChips({
  selectedFilters,
  onRemoveFilter,
  className
}: QuickFilterChipsProps) {
  if (selectedFilters.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {selectedFilters.map((filterId) => {
        const filter = QUICK_FILTERS.find(f => f.id === filterId)
        if (!filter) return null

        return (
          <span
            key={filter.id}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
              "font-medium border",
              filter.color
            )}
          >
            {filter.icon}
            <span>{filter.label}</span>
            <button
              onClick={() => onRemoveFilter(filter.id)}
              className="ml-1 hover:opacity-70 transition-opacity"
              aria-label={`Remove filter ${filter.label}`}
            >
              ×
            </button>
          </span>
        )
      })}
    </div>
  )
}

// Filter bar with active filters summary
interface FilterBarProps {
  selectedFilters: QuickFilterType[]
  onRemoveFilter: (filterId: QuickFilterType) => void
  onClearAll: () => void
  totalResults: number
  className?: string
}

export function FilterBar({
  selectedFilters,
  onRemoveFilter,
  onClearAll,
  totalResults,
  className
}: FilterBarProps) {
  if (selectedFilters.length === 0) return null

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 bg-[var(--color-info-surface)] rounded-lg",
      className
    )}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--color-info)]">
          <TrendingUp className="w-4 h-4 inline mr-1" />
          {totalResults} resultados
        </span>
        <span className="text-[var(--color-info)]">|</span>
        <QuickFilterChips
          selectedFilters={selectedFilters}
          onRemoveFilter={onRemoveFilter}
        />
      </div>
      <button
        onClick={onClearAll}
        className="text-sm text-[var(--color-info)] hover:text-[var(--color-info)] 
                 hover:underline transition-colors"
      >
        Limpiar todo
      </button>
    </div>
  )
}
