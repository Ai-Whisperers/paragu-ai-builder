export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold text-[var(--primary)]">Paragu-AI Builder</h1>
      <p className="mb-8 max-w-lg text-center text-lg text-[var(--secondary)]">
        Motor de generacion de sitios web para negocios de belleza y bienestar en Paraguay.
      </p>
      <div className="flex gap-4">
        <a
          href="/admin"
          className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] shadow-button transition-all duration-normal hover:shadow-card-hover"
        >
          Panel Admin
        </a>
      </div>
    </main>
  )
}
