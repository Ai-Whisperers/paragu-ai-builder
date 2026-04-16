import { loadBusiness } from '@/lib/engine/data-loader'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Wand2, ArrowLeft } from 'lucide-react'
import EditForm from './edit-form'

interface EditPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditBusinessPage({ params }: EditPageProps) {
  const { slug } = await params
  const business = await loadBusiness(slug)

  if (!business) {
    return (
      <main className="min-h-screen bg-surface-light">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-nav">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">
                ParaguAI
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Negocio no encontrado
          </h1>
          <p className="mt-2 text-muted-foreground">
            No existe un negocio con el slug &ldquo;{slug}&rdquo;.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-button transition-colors hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-light">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">
              ParaguAI
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
            <span className="rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              Editar
            </span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground transition-colors">
            Panel
          </Link>
          <span>/</span>
          <span className="text-foreground">{business.name}</span>
        </div>

        <EditForm business={business} />
      </div>
    </main>
  )
}
