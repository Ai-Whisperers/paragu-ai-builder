"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Link from "next/link";
export function PromoCarousel({ promotions, interval = 5000, lang = "es", offersHref, viewOffersLabel, icons = ["🎉", "✨", "🔥", "💅", "🌟"], }) {
    const [idx, setIdx] = useState(0);
    const len = promotions.length;
    useEffect(() => {
        if (len < 2)
            return;
        const timer = setInterval(() => setIdx((i) => (i + 1) % len), interval);
        return () => clearInterval(timer);
    }, [len, interval]);
    if (len === 0)
        return null;
    const promo = promotions[idx];
    const label = viewOffersLabel ?? (lang === "en" ? "View offers" : "Ver ofertas");
    const href = offersHref ?? `/${lang}/ofertas`;
    return (_jsxs("div", { className: "bg-primary/5 border-b border-border", children: [_jsxs("div", { className: "mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx("span", { className: "text-xl shrink-0", children: icons[idx % icons.length] }), _jsxs("div", { className: "min-w-0", children: [promo.badge && (_jsx("span", { className: "bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full mr-1.5 align-middle", children: promo.badge })), _jsx("span", { className: "text-sm font-medium text-foreground align-middle", children: promo.title }), promo.subtitle && (_jsx("span", { className: "hidden sm:inline text-xs text-foreground-muted ml-2 align-middle", children: promo.subtitle }))] })] }), _jsxs(Link, { href: href, className: "text-xs font-semibold text-secondary hover:underline shrink-0 whitespace-nowrap", children: [label, " \u2192"] })] }), len > 1 && (_jsx("div", { className: "flex justify-center gap-1 pb-1", children: promotions.map((_, i) => (_jsx("button", { onClick: () => setIdx(i), className: `h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-secondary" : "w-1.5 bg-border"}` }, i))) }))] }));
}
