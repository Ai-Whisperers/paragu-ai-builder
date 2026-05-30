"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, Gift } from "lucide-react";
export function Packages({ packages, whatsapp, title = "Combos Especiales", subtitle = "Servicios combinados con descuento. Ahorrá en tu tratamiento completo.", actionText = "Consultar pack", whatsappMessageTemplate = (pkgName) => `Hola! Quiero el pack: ${pkgName}`, }) {
    const getColorMap = (color) => {
        const maps = {
            rose: { bg: "bg-rose-500", text: "text-rose-600", light: "from-rose-50" },
            violet: { bg: "bg-violet-500", text: "text-violet-600", light: "from-violet-50" },
            amber: { bg: "bg-amber-500", text: "text-amber-600", light: "from-amber-50" },
            green: { bg: "bg-green-500", text: "text-green-600", light: "from-green-50" },
            blue: { bg: "bg-blue-500", text: "text-blue-600", light: "from-blue-50" },
        };
        return maps[color] ?? maps.rose;
    };
    return (_jsx("div", { className: "py-16 bg-background", children: _jsxs("div", { className: "container-page", children: [_jsxs("div", { className: "text-center mb-10", children: [_jsxs("span", { className: "inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3", children: [_jsx(Gift, { className: "w-4 h-4" }), " Packs"] }), _jsx("h2", { className: "font-heading text-3xl font-bold text-primary", children: title }), _jsx("p", { className: "text-foreground-light text-sm mt-2 max-w-lg mx-auto", children: subtitle })] }), _jsx("div", { className: "grid gap-6 md:grid-cols-3 max-w-5xl mx-auto", children: packages.map((pkg, idx) => {
                        const Icon = pkg.icon;
                        const colors = getColorMap(pkg.color);
                        return (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col", children: [_jsx("div", { className: `absolute top-3 right-3 ${colors.bg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`, children: pkg.badge }), _jsxs("div", { className: `px-6 pt-6 pb-4 bg-gradient-to-br ${colors.light} to-white`, children: [_jsx("div", { className: `w-12 h-12 rounded-xl ${colors.bg}/10 flex items-center justify-center mb-3`, children: _jsx(Icon, { className: `w-6 h-6 ${colors.text}` }) }), _jsx("h3", { className: "font-heading text-xl font-bold text-primary", children: pkg.name })] }), _jsx("div", { className: "px-6 py-4 flex-1", children: _jsx("ul", { className: "space-y-2.5", children: pkg.services.map((s, si) => (_jsxs("li", { className: "flex items-start gap-2 text-sm text-foreground-light", children: [_jsx(CheckCircle, { className: `w-4 h-4 ${colors.text} shrink-0 mt-0.5` }), s] }, si))) }) }), _jsxs("div", { className: "px-6 pb-6 pt-2", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("span", { className: "text-sm text-foreground-muted line-through", children: pkg.originalPrice }), _jsx("span", { className: "text-xl font-bold text-primary", children: pkg.packagePrice })] }), _jsx("a", { href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessageTemplate(pkg.name))}`, target: "_blank", rel: "noopener noreferrer", className: "block w-full text-center bg-secondary text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-secondary-dark transition-colors", children: actionText })] })] }, idx));
                    }) })] }) }));
}
