/**
 * Skeleton loading state for the /tienda page.
 * Matches the exact grid layout of the real page.
 */
export default function TiendaLoading() {
  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      {/* Skeleton header */}
      <header className="sticky top-0 z-30 border-b border-[color:var(--border,#e5e7eb)] bg-surface shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="h-6 w-48 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-32 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
            <div className="h-6 w-6 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
          </div>
        </div>
      </header>

      {/* Skeleton breadcrumbs */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <div className="h-4 w-24 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
        <div className="h-4 w-4 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
        <div className="h-4 w-16 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
      </div>

      <main className="mx-auto px-4 py-8">
        {/* Skeleton hero */}
        <div className="mb-8 aspect-video w-full animate-pulse rounded-xl bg-[color:var(--border,#e5e7eb)] sm:aspect-[21/9]" />

        {/* Skeleton trust strip — 4 pills */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
              <div className="h-6 w-6 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
                <div className="h-3 w-full animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton category tiles */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
              <div className="mb-2 h-10 w-10 animate-pulse rounded-lg bg-[color:var(--border,#e5e7eb)]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
              <div className="mt-1 h-3 w-1/2 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
            </div>
          ))}
        </div>

        {/* Skeleton toolbar */}
        <div className="mb-6 h-20 w-full animate-pulse rounded-lg bg-[color:var(--border,#e5e7eb)]" />

        {/* Skeleton product grid — 6 cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[4/5] w-full animate-pulse rounded-lg bg-[color:var(--border,#e5e7eb)]" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[color:var(--border,#e5e7eb)]" />
                <div className="mt-2 h-10 w-full animate-pulse rounded-md bg-[color:var(--border,#e5e7eb)]" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
