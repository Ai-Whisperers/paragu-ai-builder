export interface PackageItem {
    name: string;
    originalPrice: string;
    packagePrice: string;
    badge: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    color: string;
    services: string[];
}
export interface PackagesProps {
    /**
     * Array of packages to display
     */
    packages: PackageItem[];
    /**
     * WhatsApp number for booking
     */
    whatsapp: string;
    /**
     * Section title (default: "Combos Especiales")
     */
    title?: string;
    /**
     * Section subtitle (default: "Servicios combinados con descuento. Ahorrá en tu tratamiento completo.")
     */
    subtitle?: string;
    /**
     * Button text (default: "Consultar pack")
     */
    actionText?: string;
    /**
     * Message template for WhatsApp (receives package name)
     */
    whatsappMessageTemplate?: (pkgName: string) => string;
}
export declare function Packages({ packages, whatsapp, title, subtitle, actionText, whatsappMessageTemplate, }: PackagesProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=packages.d.ts.map