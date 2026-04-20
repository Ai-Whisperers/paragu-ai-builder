'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Google reviews widget. Content is passed in — the server-side fetcher
 * against Google Places API lives in /api/google-reviews and is stubbed.
 * If `fetchedFromApi=false`, this renders whatever curated content the tenant provides.
 */

export interface GoogleReviewsWidgetProps {
  title?: string
  subtitle?: string
  avgRating?: number
  reviewCount?: number
  reviews: Array<{ author: string; rating: number; text: string; date?: string }>
  placeUrl?: string
  writeReviewUrl?: string
}

function stars(rating: number): string {
  const full = '★'.repeat(Math.round(rating))
  const empty = '☆'.repeat(5 - Math.round(rating))
  return full + empty
}

export function GoogleReviewsWidgetSection({
  title = 'Lo que dicen en Google',
  subtitle,
  avgRating,
  reviewCount,
  reviews,
  placeUrl,
  writeReviewUrl,
}: GoogleReviewsWidgetProps) {
  if (!reviews?.length) return null
  return (
    <section className="py-14 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
          {avgRating !== undefined && (
            <div className="mt-2 text-[var(--primary)]">
              <span className="text-2xl">{stars(avgRating)}</span>
              <span className="ml-2 text-[var(--text-muted)]">
                {avgRating.toFixed(1)}{' '}
                {reviewCount && <>({reviewCount} reseñas)</>}
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
          {reviews.slice(0, 6).map((r, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="text-[var(--primary)] text-sm mb-1">{stars(r.rating)}</div>
                <p className="text-sm text-[var(--text)]">{r.text}</p>
                <div className="mt-3 text-xs text-[var(--text-muted)]">
                  {r.author}
                  {r.date && <> · {r.date}</>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(placeUrl || writeReviewUrl) && (
          <div className="text-center mt-6 space-x-4 text-sm">
            {placeUrl && (
              <a href={placeUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)]">
                Ver todas las reseñas
              </a>
            )}
            {writeReviewUrl && (
              <a href={writeReviewUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)]">
                Escribir una reseña
              </a>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}
