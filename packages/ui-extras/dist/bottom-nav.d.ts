export interface BottomNavItem {
    label: string;
    href: string;
    /**
     * SVG path string for the icon
     */
    icon: string;
    /**
     * Whether this is an external link (opens in new tab)
     */
    isExternal?: boolean;
}
export interface BottomNavProps {
    /**
     * Current locale (for routing)
     */
    lang?: string;
    /**
     * Navigation items
     */
    items: BottomNavItem[];
    /**
     * Routes to hide the bottom nav on (e.g., "/admin")
     */
    hiddenRoutes?: string[];
}
export declare function BottomNav({ lang, items, hiddenRoutes, }: BottomNavProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=bottom-nav.d.ts.map