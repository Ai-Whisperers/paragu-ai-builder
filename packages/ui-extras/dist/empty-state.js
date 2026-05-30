import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
export function EmptyState({ title = "No hay resultados", description = "Probá con otra búsqueda o categoría.", actionText = "Ver todos los servicios", actionHref = "/es/servicios", emoji = "🔍", }) {
    return (_jsxs("div", { className: "py-16 text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: emoji }), _jsx("h3", { className: "font-heading text-xl font-bold text-primary mb-2", children: title }), _jsx("p", { className: "text-foreground-light text-sm mb-6 max-w-md mx-auto", children: description }), _jsx(Link, { href: actionHref, className: "inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm no-underline hover:bg-primary-light transition-colors", children: actionText })] }));
}
