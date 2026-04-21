export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-[var(--primary-foreground)] focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent)]"
    >
      Saltar al contenido principal
    </a>
  )
}
