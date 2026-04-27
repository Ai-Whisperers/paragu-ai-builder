import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
      <h1 className="text-6xl font-bold text-[var(--primary)]">404</h1>
      <p className="mt-4 text-lg text-[var(--text-muted)]">Página no encontrada</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)]"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
