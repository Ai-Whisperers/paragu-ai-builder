export interface DarkModeToggleProps {
    /**
     * localStorage key for theme persistence (default: "theme")
     */
    storageKey?: string;
    /**
     * ARIA label when dark mode is active (default: "Activar modo claro")
     */
    lightLabel?: string;
    /**
     * ARIA label when light mode is active (default: "Activar modo oscuro")
     */
    darkLabel?: string;
}
export declare function DarkModeToggle({ storageKey, lightLabel, darkLabel, }: DarkModeToggleProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=dark-mode-toggle.d.ts.map