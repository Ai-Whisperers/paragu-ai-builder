export interface EmptyStateProps {
    /**
     * Title for the empty state (default: "No hay resultados")
     */
    title?: string;
    /**
     * Description text (default: "Probá con otra búsqueda o categoría.")
     */
    description?: string;
    /**
     * Button text (default: "Ver todos los servicios")
     */
    actionText?: string;
    /**
     * Button href (default: "/es/servicios")
     */
    actionHref?: string;
    /**
     * Emoji icon (default: "🔍")
     */
    emoji?: string;
}
export declare function EmptyState({ title, description, actionText, actionHref, emoji, }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=empty-state.d.ts.map