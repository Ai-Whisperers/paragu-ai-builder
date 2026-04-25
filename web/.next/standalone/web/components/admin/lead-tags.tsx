'use client'

import { useState } from 'react'
import { X, Plus, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TagData {
  id: string
  name: string
  color: string
}

interface LeadTagsProps {
  tags: string[]
  availableTags?: TagData[]
  onAddTag?: (tag: string) => void
  onRemoveTag?: (tag: string) => void
  onCreateTag?: (name: string, color: string) => void
  editable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const DEFAULT_TAGS: TagData[] = [
  { id: '1', name: 'VIP', color: '#EF4444' },
  { id: '2', name: 'Prioridad', color: '#F59E0B' },
  { id: '3', name: 'Frio', color: '#3B82F6' },
  { id: '4', name: 'Caliente', color: '#EF4444' },
  { id: '5', name: 'Presupuesto', color: '#10B981' },
  { id: '6', name: 'Demo', color: '#8B5CF6' },
  { id: '7', name: 'Seguimiento', color: '#6366F1' },
  { id: '8', name: 'WhatsApp', color: '#10B981' },
  { id: '9', name: 'Referido', color: '#EC4899' },
  { id: '10', name: 'Reunión', color: '#14B8A6' }
]

const TAG_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#F97316', // orange
  '#64748B'  // slate
]

function getTagColor(tagName: string, availableTags: TagData[]): string {
  const found = availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase())
  if (found) return found.color
  
  // Generate consistent color from tag name
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

export function LeadTags({
  tags,
  availableTags = DEFAULT_TAGS,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  editable = false,
  size = 'md',
  className
}: LeadTagsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0])

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  const handleAddTag = (tagName: string) => {
    if (tagName.trim() && onAddTag) {
      onAddTag(tagName.trim())
      setIsAdding(false)
      setNewTagName('')
    }
  }

  const handleCreateTag = () => {
    if (newTagName.trim() && onCreateTag) {
      onCreateTag(newTagName.trim(), selectedColor)
      handleAddTag(newTagName.trim())
      setShowColorPicker(false)
    }
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5 items-center", className)}>
      {tags.map((tag) => {
        const color = getTagColor(tag, availableTags)
        const textColor = getContrastColor(color)
        
        return (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center gap-1 rounded-full font-medium",
              sizeClasses[size]
            )}
            style={{
              backgroundColor: color + '20',
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            <span className="truncate max-w-[100px]">{tag}</span>
            {editable && onRemoveTag && (
              <button
                onClick={() => onRemoveTag(tag)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        )
      })}
      
      {editable && (
        <>
          {isAdding ? (
            <div className="flex items-center gap-1">
              <div className="relative">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nueva etiqueta..."
                  className="text-sm px-2 py-1 border rounded-md w-32 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (onCreateTag) {
                        setShowColorPicker(true)
                      } else {
                        handleAddTag(newTagName)
                      }
                    }
                    if (e.key === 'Escape') {
                      setIsAdding(false)
                      setNewTagName('')
                    }
                  }}
                  autoFocus
                />
                
                {showColorPicker && onCreateTag && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg 
                                shadow-lg border z-50 w-48">
                    <p className="text-xs text-gray-500 mb-2">Selecciona un color:</p>
                    <div className="grid grid-cols-5 gap-1 mb-3">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "w-6 h-6 rounded-full transition-transform",
                            selectedColor === color && "ring-2 ring-offset-1 ring-gray-400 scale-110"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateTag}
                        className="flex-1 bg-[var(--primary)] text-white text-xs py-1.5 rounded 
                                 hover:opacity-90 transition-colors"
                      >
                        Crear
                      </button>
                      <button
                        onClick={() => {
                          setShowColorPicker(false)
                          setNewTagName('')
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 text-xs py-1.5 rounded 
                                 hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewTagName('')
                  setShowColorPicker(false)
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors",
                sizeClasses[size]
              )}
            >
              <Plus className="w-3 h-3" />
              <span>Agregar</span>
            </button>
          )}
        </>
      )}
    </div>
  )
}

// Tag selector dropdown for bulk operations
interface TagSelectorProps {
  availableTags: TagData[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  className?: string
}

export function TagSelector({
  availableTags,
  selectedTags,
  onToggleTag,
  className
}: TagSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name)
        const textColor = getContrastColor(tag.color)
        
        return (
          <button
            key={tag.id}
            onClick={() => onToggleTag(tag.name)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full text-sm px-2.5 py-1 font-medium transition-all",
              isSelected 
                ? "ring-2 ring-offset-1" 
                : "opacity-60 hover:opacity-100"
            )}
            style={{
              backgroundColor: tag.color + '20',
              color: tag.color,
              border: `1px solid ${isSelected ? tag.color : tag.color + '40'}`,
              ['--tw-ring-color' as string]: tag.color
            }}
          >
            {isSelected && <span className="text-xs">✓</span>}
            {tag.name}
          </button>
        )
      })}
    </div>
  )
}

// Tag management panel for admin settings
interface TagManagementProps {
  tags: TagData[]
  onCreateTag: (name: string, color: string) => void
  onDeleteTag: (id: string) => void
  onUpdateTag: (id: string, updates: Partial<TagData>) => void
}

export function TagManagement({
  tags,
  onCreateTag,
  onDeleteTag,
  onUpdateTag
}: TagManagementProps) {
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0])
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreate = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), selectedColor)
      setNewTagName('')
    }
  }

  const handleUpdate = (tagId: string) => {
    if (editName.trim()) {
      onUpdateTag(tagId, { name: editName.trim() })
      setEditingTag(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Nombre de la etiqueta..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>
        <div className="flex gap-1">
          {TAG_COLORS.slice(0, 5).map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={cn(
                "w-6 h-6 rounded-full transition-transform",
                selectedColor === color && "ring-2 ring-offset-1 ring-gray-400 scale-110"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button
          onClick={handleCreate}
          disabled={!newTagName.trim()}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium 
                   hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-colors"
        >
          Crear
        </button>
      </div>

      <div className="space-y-2">
        {tags.map((tag) => {
          const textColor = getContrastColor(tag.color)
          
          return (
            <div 
              key={tag.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 
                       transition-colors"
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              
              {editingTag === tag.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate(tag.id)
                    if (e.key === 'Escape') setEditingTag(null)
                  }}
                  onBlur={() => handleUpdate(tag.id)}
                />
              ) : (
                <span 
                  className="flex-1 text-sm font-medium cursor-pointer"
                  onClick={() => {
                    setEditingTag(tag.id)
                    setEditName(tag.name)
                  }}
                >
                  {tag.name}
                </span>
              )}
              
              <button
                onClick={() => onDeleteTag(tag.id)}
                className="p-1 text-[var(--color-error)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-surface)] 
                         rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
