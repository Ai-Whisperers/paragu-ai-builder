'use client'

import { useState } from 'react'
import { Star, Send, CheckCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Container } from '@/components/ui/container'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Review, ReviewType } from './reviews-section'

export interface ReviewFormProps {
  onSubmit?: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void
  className?: string
}

export function ReviewForm({ onSubmit, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [formData, setFormData] = useState({
    author: '',
    location: '',
    text: '',
    type: 'cliente' as ReviewType
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      ...formData,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      verified: false,
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[var(--success)]" />
        </div>
        <h4 className="font-semibold text-lg mb-2">Gracias por tu opinion!</h4>
        <p className="text-[var(--text-muted)]">
          Tu reseña sera revisada y publicada pronto.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {/* Rating */}
      <div>
        <Label className="mb-2 block">Tu calificacion</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={cn(
                  'w-8 h-8',
                  i < (hoverRating || rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-[var(--text-light)]'
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-[var(--text-muted)]">
            {rating > 0 && ['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'][rating - 1]}
          </span>
        </div>
      </div>

      {/* Type */}
      <div>
        <Label className="mb-2 block">Tipo de cliente</Label>
        <div className="flex gap-2">
          {(['cliente', 'negocio', 'restaurante'] as ReviewType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type }))}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm capitalize transition-all',
                formData.type === type
                  ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Name & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author" className="mb-2 block">Tu nombre</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Ej: Maria Gonzalez"
            required
          />
        </div>
        <div>
          <Label htmlFor="location" className="mb-2 block">Ubicacion</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Ej: Coronel Oviedo"
            required
          />
        </div>
      </div>

      {/* Review Text */}
      <div>
        <Label htmlFor="text" className="mb-2 block">Tu experiencia</Label>
        <Textarea
          id="text"
          value={formData.text}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Cuentanos sobre tu experiencia con nuestros huevos y servicio..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={rating === 0}>
        <Send className="w-4 h-4 mr-2" />
        Enviar Resena
      </Button>
    </form>
  )
}

export interface ReviewsSectionProps {
  reviews?: Review[]
  className?: string
  phone?: string
}
