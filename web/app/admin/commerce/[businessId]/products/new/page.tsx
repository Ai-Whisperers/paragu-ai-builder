import { NewProductForm } from '@/components/admin/commerce/new-product-form'

export const runtime = 'nodejs'

export default async function NewProductPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Nuevo producto</h1>
      <NewProductForm businessId={businessId} />
    </div>
  )
}
