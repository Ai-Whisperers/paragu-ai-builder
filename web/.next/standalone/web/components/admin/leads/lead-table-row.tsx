'use client'

import {
  Star, MapPin, Heart, MessageCircle, Phone, Smartphone,
  MoreHorizontal, CheckSquare, Square,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { LeadTags } from '@/components/admin/lead-tags'
import {
  type Lead,
  STATUS_COLORS,
  STATUS_ICONS,
  PRIORITY_COLORS,
  AVAILABLE_TAGS,
  generateWhatsAppLink,
} from './lead-constants'
import { LeadDetailPanel } from './lead-detail-panel'

interface Note {
  id: string
  content: string
  type: string
  createdAt: string
}

interface LeadTableRowProps {
  lead: Lead
  isSelected: boolean
  notes: Note[]
  newNote: string
  setNewNote: (value: string) => void
  onAddNote: () => void
  isAddingNote: boolean
  onSelect: (id: string) => void
  onToggleFavorite: (id: string) => void
  onAddTag: (leadId: string, tag: string) => void
  onRemoveTag: (leadId: string, tag: string) => void
  onSetSelectedLead: (lead: Lead) => void
}

export function LeadTableRow({
  lead,
  isSelected,
  notes,
  newNote,
  setNewNote,
  onAddNote,
  isAddingNote,
  onSelect,
  onToggleFavorite,
  onAddTag,
  onRemoveTag,
  onSetSelectedLead,
}: LeadTableRowProps) {
  return (
    <tr
      key={lead.id}
      className={cn(
        "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
        isSelected && "bg-[var(--color-info-surface)] dark:bg-blue-900/20"
      )}
    >
      <td className="py-3 px-2 text-center">
        <button
          onClick={() => onSelect(lead.id)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {lead.business_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={cn("font-medium", "text-gray-900")}>
              {lead.business_name}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={cn("text-xs", PRIORITY_COLORS[lead.priority_tier])}>
                {lead.priority_tier}
              </Badge>
              {lead.has_website === false && (
                <Badge className="text-xs bg-[var(--color-error-surface)] text-[var(--color-error)]">
                  Sin web
                </Badge>
              )}
              {lead.rating && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <Star className="w-3 h-3 fill-current" />
                  {lead.rating} ({lead.review_count})
                </span>
              )}
              {lead.isFavorite && (
                <Heart className="w-3 h-3 text-[var(--color-error)] fill-current" />
              )}
            </div>
            {lead.tags && lead.tags.length > 0 && (
              <div className="mt-1">
                <LeadTags tags={lead.tags} availableTags={AVAILABLE_TAGS} size="sm" />
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-gray-700">{lead.business_type}</span>
      </td>
      <td className="py-3 px-4">
        <div className={cn("flex items-center gap-1", "text-gray-600")}>
          <MapPin className="w-3 h-3" />
          {lead.city}
          {lead.neighborhood && (
            <span className="text-gray-400">• {lead.neighborhood}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <div className="inline-flex items-center gap-1">
          <div
            className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden"
            title={`Score: ${lead.priority_score}`}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${lead.priority_score}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 ml-1">{lead.priority_score}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <Badge className={`${STATUS_COLORS[lead.status]} capitalize`}>
          <span className="flex items-center gap-1">
            {STATUS_ICONS[lead.status]}
            {lead.status.replace(/_/g, ' ')}
          </span>
        </Badge>
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {lead.whatsapp && (
            <a
              href={generateWhatsAppLink(lead) || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-success)] hover:text-[var(--color-success)] focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="text-blue-600 hover:text-[var(--color-info)] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              title="Llamar"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          {lead.instagram && (
            <a
              href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded"
              title="Instagram"
            >
              <Smartphone className="w-4 h-4" />
            </a>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onToggleFavorite(lead.id)}
            className={cn(
              "p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500",
              lead.isFavorite
                ? "text-[var(--color-error)] hover:bg-[var(--color-error-surface)]"
                : "text-gray-400 hover:text-[var(--color-error)] hover:bg-gray-100"
            )}
            title={lead.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={cn("w-4 h-4", lead.isFavorite && "fill-current")} />
          </button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetSelectedLead(lead)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {lead.business_name}
                  <Badge className={PRIORITY_COLORS[lead.priority_tier]}>
                    {lead.priority_tier}
                  </Badge>
                </SheetTitle>
              </SheetHeader>
              <LeadDetailPanel
                lead={lead}
                notes={notes}
                newNote={newNote}
                setNewNote={setNewNote}
                onAddNote={onAddNote}
                isAddingNote={isAddingNote}
                onAddTag={(tag) => onAddTag(lead.id, tag)}
                onRemoveTag={(tag) => onRemoveTag(lead.id, tag)}
                onToggleFavorite={() => onToggleFavorite(lead.id)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </td>
    </tr>
  )
}
