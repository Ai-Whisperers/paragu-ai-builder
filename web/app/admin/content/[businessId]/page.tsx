import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { loadBusinessContent } from '@/lib/commerce/business-content'
import { ContentEditor } from '@/components/admin/content/content-editor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function ContentAdminPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const supabase = await createAdminClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('id, slug, name')
    .eq('id', businessId)
    .maybeSingle<{ id: string; slug: string; name: string }>()

  if (!business) notFound()

  const content = await loadBusinessContent(businessId)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-[color:var(--primary,#111)] underline">
          ← Volver al panel
        </Link>
        <a
          href={`/s/es/${business.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[color:var(--primary,#111)] underline"
        >
          Ver sitio en vivo →
        </a>
      </div>

      <h1 className="mb-1 text-2xl font-bold">Contenido — {business.name}</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Editá textos, testimonios y preguntas frecuentes sin tocar código. Cada sección se guarda por separado; podés publicar cambios parciales.
      </p>

      <ContentEditor businessId={businessId} initialContent={content} siteSlug={business.slug} />
    </div>
  )
}
