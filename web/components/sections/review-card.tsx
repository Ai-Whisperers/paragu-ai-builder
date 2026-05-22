'use client'

import { useState } from 'react'
import { Star, CheckCircle, ThumbsUp, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Review, ReviewType, ReviewCardProps } from './reviews-section'

export function ReviewCard({ review, className, onHelpful }: ReviewCardProps) {
  const [liked, setLiked] = useState(false)

  const handleHelpful = () => {
    if (!liked) {
      setLiked(true)
      onHelpful?.(review.id)
    }
  }

  const typeLabels: Record<ReviewType, string> = {
    cliente: 'Cliente',
    negocio: 'Negocio',
    restaurante: 'Restaurante'
  }

  const typeColors: Record<ReviewType, string> = {
    cliente: 'bg-green-100 text-green-800',
    negocio: 'bg-blue-100 text-blue-800',
    restaurante: 'bg-purple-100 text-purple-800'
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-[var(--primary)] text-white text-sm">
                {review.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-[var(--text)]">{review.author}</p>
              <p className="text-sm text-[var(--text-muted)]">{review.location}</p>
            </div>
          </div>
          <Badge className={cn('text-xs', typeColors[review.type])}>
            {typeLabels[review.type]}
          </Badge>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-4 h-4',
                i < review.rating 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-[var(--text-light)]'
              )}
            />
          ))}
          {review.verified && (
            <Badge variant="outline" className="ml-2 text-xs flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verificado
            </Badge>
          )}
        </div>

        {/* Quote */}
        <div className="relative mb-4">
          <Quote className="absolute -top-2 -left-2 w-6 h-6 text-[var(--border)]" />
          <p className="text-[var(--text)] pl-4 italic">
            {review.text}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <span className="text-sm text-[var(--text-muted)]">
            {new Date(review.date).toLocaleDateString('es-PY', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            className={cn(
              'text-sm',
              liked && 'text-[var(--primary)]'
            )}
          >
            <ThumbsUp className={cn('w-4 h-4 mr-1', liked && 'fill-current')} />
            Util ({review.helpful || 0})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export interface ReviewFormProps {
  onSubmit: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void
  className?: string
}
