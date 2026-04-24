'use client'

import { Heart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { FilterOptions } from './lead-constants'

interface LeadsBulkActionsProps {
  selectedCount: number
  filterOptions: FilterOptions
  onBulkUpdateStatus: (status: string) => void
  onBulkFavorite: () => void
  onClearSelection: () => void
}

export function LeadsBulkActions({
  selectedCount,
  filterOptions,
  onBulkUpdateStatus,
  onBulkFavorite,
  onClearSelection,
}: LeadsBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className={cn(
      "rounded-lg shadow-sm border p-3 mb-4 flex items-center justify-between",
      "bg-[var(--color-info-surface)] border-blue-200"
    )}>
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-sm font-medium",
          "text-[var(--color-info)]"
        )}>
          {selectedCount} leads seleccionados
        </span>
        <div className="flex gap-2">
          <Select onValueChange={onBulkUpdateStatus}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue placeholder="Cambiar estado" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.statuses.map(s => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            size="sm"
            onClick={onBulkFavorite}
          >
            <Heart className="w-4 h-4 mr-1" />
            Favorito
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearSelection}
          >
            <X className="w-4 h-4 mr-1" />
            Deseleccionar
          </Button>
        </div>
      </div>
    </div>
  )
}
