"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ShareWhatsApp({ whatsapp, title, url, siteName = "nuestro negocio", }) {
    const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Mirá esto de ${siteName}: ${title}${url ? ` - ${url}` : ""}`)}`;
    return (_jsxs("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground-light hover:text-primary hover:bg-primary/5 transition-colors", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" }) }), "Compartir"] }));
}
