export interface PromoItem {
    /**
     * Optional badge text (e.g., "NUEVO", "-30%")
     */
    badge?: string;
    /**
     * Main title
     */
    title: string;
    /**
     * Optional subtitle
     */
    subtitle?: string;
}
export interface PromoCarouselProps {
    /**
     * Array of promotions
     */
    promotions: PromoItem[];
    /**
     * Auto-rotation interval in ms (default: 5000)
     */
    interval?: number;
    /**
     * Current locale (for routing)
     */
    lang?: string;
    /**
     * URL for "View offers" link (default: `/${lang}/ofertas`)
     */
    offersHref?: string;
    /**
     * Label for "View offers" button
     */
    viewOffersLabel?: string;
    /**
     * Emoji icons to cycle through (default: ["🎉", "✨", "🔥", "💅", "🌟"])
     */
    icons?: string[];
}
export declare function PromoCarousel({ promotions, interval, lang, offersHref, viewOffersLabel, icons, }: PromoCarouselProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=promo-carousel.d.ts.map