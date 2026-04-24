'use client'

import { Filter, Search, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { TYPE_LABELS } from '@/lib/admin/utils'
import { cn } from '@/lib/utils'
import type { FilterOptions, LeadFilters } from './lead-constants'

interface LeadsFiltersProps {
  filterOptions: FilterOptions
  currentFilters: LeadFilters
  search: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (e: React.FormEvent) => void
  onFilterChange: (key: string, value: string | undefined) => void
  onExportCSV: () => void
  disabled?: boolean
}

export function LeadsFilters({
  filterOptions,
  currentFilters,
  search,
  onSearchChange,
  onSearchSubmit,
  onFilterChange,
  onExportCSV,
  disabled,
}: LeadsFiltersProps) {
  return (
    <div className={cn(
      "rounded-lg shadow-sm border p-4 mb-6",
      "bg-white border-gray-200"
    )}>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Filtrar:</span>
        </div>

        <Select
          value={currentFilters.status || 'all'}
          onValueChange={(v) => onFilterChange('status', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {filterOptions.statuses.map(s => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.type || 'all'}
          onValueChange={(v) => onFilterChange('type', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {filterOptions.types.map(t => (
              <SelectItem key={t} value={t}>
                {TYPE_LABELS[t] || t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.city || 'all'}
          onValueChange={(v) => onFilterChange('city', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las ciudades</SelectItem>
            {filterOptions.cities.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.priority || 'all'}
          onValueChange={(v) => onFilterChange('priority', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {filterOptions.priorities.map(p => (
              <SelectItem key={p} value={p}>
                Prioridad {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={onSearchSubmit} className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre... (Cmd+K)"
              className="pl-10"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </form>

        <Button
          variant="secondary"
          onClick={onExportCSV}
          disabled={disabled}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>
    </div>
  )
}
