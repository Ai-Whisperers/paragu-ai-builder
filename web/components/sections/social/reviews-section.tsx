'use client'

import { useState } from 'react'
import { Star, Quote, ThumbsUp, CheckCircle, Send } from 'lucide-react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Heading } from '@/components/ui/heading'

export type ReviewType = 'cliente' | 'negocio' | 'restaurante'

export interface Review {
  id: string
  author: string
  location: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  date: string
  type: ReviewType
  verified: boolean
  helpful?: number
}

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Maria G.',
    location: 'Coronel Oviedo',
    rating: 5,
    text: 'Los huevos son fresquisimos, se nota la diferencia con los de supermercado. El delivery siempre es puntual y los huevos llegan perfectos. Totalmente recomendados!',
    date: '2026-04-10',
    type: 'cliente',
    verified: true,
    helpful: 12
  },
  {
    id: '2',
    author: 'Don Jose',
    location: 'Panaderia San Jose',
    rating: 5,
    text: 'Excelente calidad para mi panaderia. Mis clientes notan la diferencia en los productos horneados. El color de la yema es incomparable. Llevo 6 meses comprando y nunca fallan.',
    date: '2026-04-05',
    type: 'negocio',
    verified: true,
    helpful: 8
  },
  {
    id: '3',
    author: 'Restaurante La Tradicion',
    location: 'Ruta 2',
    rating: 5,
    text: 'Proveedor confiable, siempre cumplen con los pedidos y la calidad es consistente. El servicio mayorista es excelente, precios justos y flexibilidad en las entregas.',
    date: '2026-03-28',
    type: 'restaurante',
    verified: true,
    helpful: 15
  },
  {
    id: '4',
    author: 'Carmen R.',
    location: 'Km 135, Ruta 2',
    rating: 5,
    text: 'Hago el pedido por WhatsApp y en 40 minutos estan en mi puerta. Los huevos duran mucho mas frescos que los del super. Gran servicio!',
    date: '2026-04-12',
    type: 'cliente',
    verified: true,
    helpful: 6
  },
  {
    id: '5',
    author: 'Hotel Paraiso',
    location: 'Coronel Oviedo',
    rating: 4,
    text: 'Muy buena calidad para nuestro desayuno buffet. Los huéspedes siempre elogian los huevos. El único punto a mejorar sería tener más horarios de entrega.',
    date: '2026-03-15',
    type: 'negocio',
    verified: true,
    helpful: 4
  }
]

export interface ReviewCardProps {
  review: Review
  className?: string
  onHelpful?: (id: string) => void
}

export interface ReviewsSectionProps {
  reviews?: Review[]
  className?: string
  phone?: string
}

import { ReviewCard } from './review-card'
export type { ReviewCard }
import { ReviewForm } from './review-form'

export function ReviewsSection({ 
  reviews = SAMPLE_REVIEWS, 
  className,
  phone 
}: ReviewsSectionProps) {
  const [filter, setFilter] = useState<ReviewType | 'all'>('all')
  const [showForm, setShowForm] = useState(false)

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.type === filter)

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

  const ratingCounts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const handleNewReview = (review: Omit<Review, 'id' | 'date' | 'verified'>) => {
    logger.info('New review submitted', { review })
  }

  return (
    <section className={cn('py-16', className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
            Lo que dicen nuestros clientes
          </Heading>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Calidad comprobada por familias, panaderias y restaurantes de la zona
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[var(--surface)] rounded-2xl p-8 text-center">
            <div className="text-5xl font-bold text-[var(--primary)] mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-6 h-6',
                    i < Math.round(averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-[var(--text-light)]'
                  )}
                />
              ))}
            </div>
            <p className="text-[var(--text-muted)]">
              Basado en {reviews.length} resenas
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating] || 0
              const percentage = (count / reviews.length) * 100
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-[var(--text-muted)] w-10 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Filter & Add Review */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas ({reviews.length})
          </Button>
          <Button
            variant={filter === 'cliente' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('cliente')}
          >
            Clientes ({reviews.filter(r => r.type === 'cliente').length})
          </Button>
          <Button
            variant={filter === 'negocio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('negocio')}
          >
            Negocios ({reviews.filter(r => r.type === 'negocio').length})
          </Button>
          <Button
            variant={filter === 'restaurante' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('restaurante')}
          >
            Restaurantes ({reviews.filter(r => r.type === 'restaurante').length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Ver resenas' : 'Escribir resena'}
          </Button>
        </div>

        {/* Content */}
        {showForm ? (
          <div className="max-w-xl mx-auto">
            <ReviewForm onSubmit={handleNewReview} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* CTA */}
        {!showForm && phone && (
          <div className="mt-12 text-center">
            <p className="text-[var(--text-muted)] mb-4">
              Ya probaste nuestros huevos? Comparte tu experiencia
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline" size="lg">
              Escribir una resena
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewsSection
