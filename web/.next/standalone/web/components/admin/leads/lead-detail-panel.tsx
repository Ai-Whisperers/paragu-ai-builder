'use client'

import {
  Eye, Heart, Phone, MessageCircle, Smartphone,
  MapPin, ExternalLink, Plus, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ActivityFeedCompact } from '@/components/admin/activity-feed'
import { LeadTags } from '@/components/admin/lead-tags'
import {
  type Lead,
  PRIORITY_COLORS,
  AVAILABLE_TAGS,
  generateWhatsAppLink,
} from './lead-constants'

interface Note {
  id: string
  content: string
  type: string
  createdAt: string
}

interface LeadDetailPanelProps {
  lead: Lead
  notes: Note[]
  newNote: string
  setNewNote: (value: string) => void
  onAddNote: () => void
  isAddingNote: boolean
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onToggleFavorite: () => void
}

export function LeadDetailPanel({
  lead,
  notes,
  newNote,
  setNewNote,
  onAddNote,
  isAddingNote,
  onAddTag,
  onRemoveTag,
  onToggleFavorite,
}: LeadDetailPanelProps) {
  const waLink = generateWhatsAppLink(lead)

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button className="flex-1 focus:ring-2 focus:ring-blue-500" disabled>
          <Eye className="w-4 h-4 mr-2" />
          Generar Preview
        </Button>
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full bg-[var(--color-success)] hover:opacity-90 focus:ring-2 focus:ring-[var(--color-success)]">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </a>
        )}
        <Button
          variant="secondary"
          onClick={onToggleFavorite}
          className={cn(
            "focus:ring-2 focus:ring-red-500",
            lead.isFavorite && "border-[var(--color-error)] bg-[var(--color-error-surface)]"
          )}
        >
          <Heart className={cn("w-4 h-4", lead.isFavorite && "fill-red-500 text-[var(--color-error)]")} />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Etiquetas</h3>
        </div>
        <LeadTags
          tags={lead.tags || []}
          availableTags={AVAILABLE_TAGS}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          editable
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Información de Contacto</h3>
        <div className="grid gap-3 text-sm">
          {lead.phone && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>Teléfono</span>
              </div>
              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                {lead.phone}
              </a>
            </div>
          )}
          {lead.whatsapp && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </div>
              <a
                href={waLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-success)] hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                {lead.whatsapp}
              </a>
            </div>
          )}
          {lead.instagram && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <Smartphone className="w-4 h-4" />
                <span>Instagram</span>
              </div>
              <a
                href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 rounded flex items-center gap-1"
              >
                @{lead.instagram.replace('@', '')}
              </a>
            </div>
          )}
          {lead.google_maps_url && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Google Maps</span>
              </div>
              <a
                href={lead.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Ver <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Notas</h3>
        <div className="space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Agregar una nota..."
            className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                onAddNote()
              }
            }}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Cmd+Enter para guardar</span>
            <Button
              size="sm"
              onClick={onAddNote}
              disabled={!newNote.trim() || isAddingNote}
            >
              {isAddingNote ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Agregar Nota
            </Button>
          </div>
        </div>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No hay notas aún
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-3 bg-[var(--color-warning-surface)] rounded-lg border border-[var(--color-warning)]">
                <p className="text-sm text-gray-700">{note.content}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(note.createdAt).toLocaleDateString('es-PY', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Detalles</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Ciudad</div>
            <div className="font-medium">{lead.city}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Barrio</div>
            <div className="font-medium">{lead.neighborhood || '—'}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Tipo</div>
            <div className="font-medium">
              {lead.business_type}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Score</div>
            <div className="font-medium">{lead.priority_score}/100</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Rating</div>
            <div className="font-medium">
              {lead.rating ? `${lead.rating} ⭐ (${lead.review_count})` : '—'}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Tiene Web</div>
            <div className="font-medium">
              {lead.has_website ? (
                <span className="text-[var(--color-success)]">Sí</span>
              ) : (
                <span className="text-[var(--color-error)]">No (oportunidad!)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Actividad Reciente</h3>
        <ActivityFeedCompact leadId={lead.id} limit={3} />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Línea de Tiempo</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            <div>
              <div className="font-medium">Lead importado</div>
              <div className="text-gray-500">
                {new Date(lead.created_at).toLocaleDateString('es-PY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          {lead.last_contacted_at && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] mt-1.5" />
              <div>
                <div className="font-medium">Último contacto</div>
                <div className="text-gray-500">
                  {new Date(lead.last_contacted_at).toLocaleDateString('es-PY', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
