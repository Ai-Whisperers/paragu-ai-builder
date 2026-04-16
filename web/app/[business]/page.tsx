import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ business: string }>
}

/**
 * Generated business site landing page.
 * Each business type gets themed via CSS variables from design tokens.
 *
 * TODO: Implement with template composition engine:
 * 1. Load business data from Supabase
 * 2. Resolve business type from registry
 * 3. Load tokens and inject CSS variables
 * 4. Compose sections from registry definition
 * 5. Render with content template placeholders filled
 */
export default async function BusinessPage({ params }: Props) {
  const { business } = await params

  // Placeholder until generation engine is built
  if (!business) notFound()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-2xl font-bold text-[var(--primary)]">
        {business}
      </h1>
      <p className="text-[var(--secondary)]">
        Sitio en construccion. Vuelva pronto.
      </p>
    </main>
  )
}
