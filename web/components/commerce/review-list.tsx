import type { Review } from '@/lib/schemas/commerce/review'
import { ReviewStars } from './review-stars'

interface Props {
  reviews: Review[]
  averageRating?: number
  totalCount?: number
}

export function ReviewList({ reviews, averageRating, totalCount }: Props) {
  if (reviews.length === 0) {
    return (
      <section aria-labelledby="reviews-heading" className="mt-10">
        <h2 id="reviews-heading" className="mb-2 text-xl font-semibold text-[color:var(--text,#111)]">
          Reseñas
        </h2>
        <p className="text-sm text-[color:var(--text-muted,#6b7280)]">
          Todavía no hay reseñas aprobadas para este producto.
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="reviews-heading" className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="reviews-heading" className="text-xl font-semibold text-[color:var(--text,#111)]">
          Reseñas
        </h2>
        {typeof averageRating === 'number' && totalCount ? (
          <div className="flex items-center gap-2 text-sm">
            <ReviewStars rating={averageRating} size="md" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-[color:var(--text-muted,#6b7280)]">
              ({totalCount} {totalCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        ) : null}
      </div>

      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
            <div className="mb-2 flex items-center gap-2 text-sm">
              <ReviewStars rating={r.rating} size="sm" />
              <span className="font-medium text-[color:var(--text,#111)]">{r.authorName}</span>
              {r.isVerifiedPurchase ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Compra verificada
                </span>
              ) : null}
              <span className="ml-auto text-xs text-[color:var(--text-muted,#6b7280)]">
                {new Date(r.createdAt).toLocaleDateString('es-PY', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            {r.title ? (
              <p className="mb-1 font-semibold text-[color:var(--text,#111)]">{r.title}</p>
            ) : null}
            <p className="whitespace-pre-line text-sm text-[color:var(--text,#111)]">{r.content}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
