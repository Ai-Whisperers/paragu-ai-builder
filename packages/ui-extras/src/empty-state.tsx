import Link from "next/link"

export interface EmptyStateProps {
  /**
   * Title for the empty state (default: "No hay resultados")
   */
  title?: string
  /**
   * Description text (default: "Probá con otra búsqueda o categoría.")
   */
  description?: string
  /**
   * Button text (default: "Ver todos los servicios")
   */
  actionText?: string
  /**
   * Button href (default: "/es/servicios")
   */
  actionHref?: string
  /**
   * Emoji icon (default: "🔍")
   */
  emoji?: string
}

export function EmptyState({
  title = "No hay resultados",
  description = "Probá con otra búsqueda o categoría.",
  actionText = "Ver todos los servicios",
  actionHref = "/es/servicios",
  emoji = "🔍",
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="font-heading text-xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-foreground-light text-sm mb-6 max-w-md mx-auto">{description}</p>
      <Link
        href={actionHref}
        className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm no-underline hover:bg-primary-light transition-colors"
      >
        {actionText}
      </Link>
    </div>
  )
}