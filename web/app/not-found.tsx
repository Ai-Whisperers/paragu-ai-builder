import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Página no encontrada</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)]"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
