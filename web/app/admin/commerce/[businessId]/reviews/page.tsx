import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Review } from '@/lib/schemas/commerce/review'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ReviewWithProduct extends Review {
  productName: string
  productSlug: string
}

async function listReviewsForAdmin(
  businessId: string,
  opts: { approved?: boolean; limit?: number } = {},
): Promise<ReviewWithProduct[]> {
  const supabase = await createAdminClient()
  const limit = opts.limit ?? 100
  let q = supabase
    .from('reviews')
    .select('*, products!inner(name, slug)')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (typeof opts.approved === 'boolean') q = q.eq('is_approved', opts.approved)
  const { data } = await q
  const rows = (Array.isArray(data) ? data : []) as Array<{
    id: string
    business_id: string
    product_id: string
    author_name: string
    author_email: string | null
    rating: number
    title: string | null
    content: string
    is_verified_purchase: boolean | null
    is_approved: boolean | null
    created_at: string
    updated_at: string
    products: { name: string; slug: string } | { name: string; slug: string }[] | null
  }>
  return rows.map((r) => {
    const p = Array.isArray(r.products) ? r.products[0] : r.products
    return {
      id: r.id,
      businessId: r.business_id,
      productId: r.product_id,
      authorName: r.author_name,
      authorEmail: r.author_email,
      rating: r.rating,
      title: r.title,
      content: r.content,
      isVerifiedPurchase: Boolean(r.is_verified_purchase),
      isApproved: Boolean(r.is_approved),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      productName: p?.name ?? 'Producto desconocido',
      productSlug: p?.slug ?? '',
    }
  })
}

async function approveReview(reviewId: string, businessId: string) {
  'use server'
  const supabase = await createAdminClient()
  await supabase
    .from('reviews')
    .update({ is_approved: true, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .eq('business_id', businessId)
  revalidatePath(`/admin/commerce/${businessId}/reviews`)
}

async function rejectReview(reviewId: string, businessId: string) {
  'use server'
  const supabase = await createAdminClient()
  await supabase.from('reviews').delete().eq('id', reviewId).eq('business_id', businessId)
  revalidatePath(`/admin/commerce/${businessId}/reviews`)
}

async function unapproveReview(reviewId: string, businessId: string) {
  'use server'
  const supabase = await createAdminClient()
  await supabase
    .from('reviews')
    .update({ is_approved: false, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .eq('business_id', businessId)
  revalidatePath(`/admin/commerce/${businessId}/reviews`)
}

function ReviewCard({
  review,
  businessId,
  pending,
}: {
  review: ReviewWithProduct
  businessId: string
  pending: boolean
}) {
  return (
    <li className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-mono text-amber-500">{'★'.repeat(review.rating)}</span>
        <span className="font-medium text-[color:var(--text,#111)]">{review.authorName}</span>
        {review.isVerifiedPurchase ? (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            Compra verificada
          </span>
        ) : null}
        <span className="ml-auto text-xs text-[color:var(--text-muted,#6b7280)]">
          {new Date(review.createdAt).toLocaleString('es-PY')}
        </span>
      </div>
      <p className="mb-1 text-xs text-[color:var(--text-muted,#6b7280)]">
        Producto: <span className="font-medium">{review.productName}</span>
      </p>
      {review.title ? <p className="mb-1 font-semibold">{review.title}</p> : null}
      <p className="mb-3 whitespace-pre-line text-sm text-[color:var(--text,#111)]">{review.content}</p>
      <div className="flex flex-wrap gap-2">
        {pending ? (
          <form action={approveReview.bind(null, review.id, businessId)}>
            <button
              type="submit"
              className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Aprobar
            </button>
          </form>
        ) : (
          <form action={unapproveReview.bind(null, review.id, businessId)}>
            <button
              type="submit"
              className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)]"
            >
              Despublicar
            </button>
          </form>
        )}
        <form action={rejectReview.bind(null, review.id, businessId)}>
          <button
            type="submit"
            className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </form>
      </div>
    </li>
  )
}

export default async function AdminReviewsPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const [pending, approved] = await Promise.all([
    listReviewsForAdmin(businessId, { approved: false, limit: 50 }),
    listReviewsForAdmin(businessId, { approved: true, limit: 50 }),
  ])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-muted,#6b7280)]">
        <Link href={`/admin/commerce/${businessId}/products`} className="hover:underline">Productos</Link>
        <Link href={`/admin/commerce/${businessId}/orders`} className="hover:underline">Pedidos</Link>
        <Link href={`/admin/commerce/${businessId}/discounts`} className="hover:underline">Descuentos</Link>
        <Link href={`/admin/commerce/${businessId}/shipping`} className="hover:underline">Envíos</Link>
        <Link href={`/admin/commerce/${businessId}/search-analytics`} className="hover:underline">Búsquedas</Link>
        <Link href={`/admin/commerce/${businessId}/reviews`} className="font-semibold text-[color:var(--text,#111)] underline">
          Reseñas
        </Link>
      </nav>

      <h1 className="mb-2 text-2xl font-bold">Moderación de reseñas</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Aprobá reseñas antes de que aparezcan en los productos. Las reseñas
        pendientes no son visibles para los visitantes.
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          Pendientes ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
            No hay reseñas esperando moderación.
          </p>
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <ReviewCard key={r.id} review={r} businessId={businessId} pending />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Publicadas ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
            Todavía no hay reseñas publicadas.
          </p>
        ) : (
          <ul className="space-y-3">
            {approved.map((r) => (
              <ReviewCard key={r.id} review={r} businessId={businessId} pending={false} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
