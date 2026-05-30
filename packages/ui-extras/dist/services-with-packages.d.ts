export interface ServiceItem {
    name: string;
    desc: string;
    price: string;
    duration: string;
    popular?: boolean;
}
export interface ServiceCategory {
    name: string;
    icon: "scissors" | "palette" | "sparkles" | "sparkle";
    color: string;
    items: ServiceItem[];
}
export interface ServicesWithPackagesProps {
    /**
     * Service categories
     */
    services: ServiceCategory[];
    /**
     * Packages to display (optional)
     */
    packages?: {
        name: string;
        originalPrice: string;
        packagePrice: string;
        badge: string;
        color: string;
        services: string[];
    }[];
    /**
     * WhatsApp number for booking
     */
    whatsapp: string;
    /**
     * Language (default: "es")
     */
    lang?: "es" | "en";
    /**
     * WhatsApp message template for services
     */
    serviceMessageTemplate?: (serviceName: string) => string;
    /**
     * WhatsApp message template for packages
     */
    packageMessageTemplate?: (packageName: string) => string;
}
export declare function ServicesWithPackages({ services, packages, whatsapp, lang, serviceMessageTemplate, packageMessageTemplate, }: ServicesWithPackagesProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=services-with-packages.d.ts.map