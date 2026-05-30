"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function BottomNav({ lang = "es", items, hiddenRoutes = ["/admin"], }) {
    const pathname = usePathname();
    if (hiddenRoutes.some(route => pathname?.startsWith(route))) {
        return null;
    }
    return (_jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden safe-area-bottom", children: _jsx("div", { className: "flex items-center justify-around py-1", children: items.map((item) => {
                const isActive = item.href === `/${lang}`
                    ? pathname === `/${lang}`
                    : pathname?.startsWith(item.href) ?? false;
                const El = item.isExternal ? "a" : Link;
                return (_jsxs(El, { href: item.href, ...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}), className: `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${isActive ? "text-secondary" : "text-foreground-muted"}`, children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: item.icon }) }), _jsx("span", { className: "text-[10px] font-medium", children: item.label })] }, item.label));
            }) }) }));
}
