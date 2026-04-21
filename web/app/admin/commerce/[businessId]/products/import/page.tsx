import Link from 'next/link'
import { CsvImporter } from '@/components/admin/commerce/csv-importer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function ImportProductsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href={`/admin/commerce/${businessId}/products`}
        className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline"
      >
        ← Volver a productos
      </Link>
      <h1 className="mb-1 text-2xl font-bold">Importar productos (CSV)</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Subí un archivo CSV exportado de Excel o Google Sheets. Te mostramos una vista previa antes de guardar.
      </p>
      <CsvImporter businessId={businessId} />
    </div>
  )
}
