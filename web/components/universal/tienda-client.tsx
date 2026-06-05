/**
 * ANNOTATION: TiendaClient
 *
 * What it is: Full storefront page with product grid, category filters, search, and cart drawer with checkout.
 * Shows all products from the catalog with filtering by category and search query.
 *
 * Why your business needs it: The store is how you sell products and services directly from your website.
 * Customers can browse, add to cart, and check out via Stripe or WhatsApp — no separate platform needed.
 *
 * What AI populates from your data:
 *   - Product catalog loaded from content/_shared/products.json
 *   - Product names, descriptions, prices, categories, images all from products.json
 *   - Checkout WhatsApp messages generated from cart contents
 *
 * Your input: Send your product/service list with names, descriptions, prices, and photos via WhatsApp.
 * We create the full store catalog and configure Stripe payments.
 *
 * Plan availability: Crecimiento, Profesional
 */

/**
 * @component TiendaClient
 * @description Product storefront with category filters, search, cart, and checkout (Stripe or WhatsApp fallback).
 * @featureFlags tienda
 * @requires products, formatGs, waLink from @/lib/config, ProductCard, useCart
 * @implementation Category filter via URL params, cart persisted via CartStore context, Stripe checkout or wa.me fallback
 */

"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ShoppingCart, X, CreditCard, MessageCircle, Loader2 } from "lucide-react"
import { products, formatGs, waLink } from "@/lib/config/config"
import { ProductCard } from "@/components/ui/product-card"
import { useCart } from "@/components/shared/cart-store"

const CATEGORIES = ["todos", "recursos", "plantillas", "cursos", "servicios"]

export function TiendaClient() {
  const searchParams = useSearchParams()
  const cat = searchParams.get("cat") || "todos"
  const q = searchParams.get("q") || ""
  const { items, totalPrice, clearCart } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const filtered = useMemo(() => {
    return (products as { id: string; name: string; description: string; price: number; image: string; category: string; featured?: boolean }[]).filter((p) => {
      const matchCat = cat === "todos" || p.category === cat
      const matchQ = q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase())
      return matchCat && matchQ
    })
  }, [cat, q])

  async function handleCheckout() {
    if (items.length === 0) return
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, denomination: "Carrito" }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error === "stripe_not_configured") {
        const summary = items.map((i) => `${i.name} x${i.quantity} — ${formatGs(i.price * i.quantity)}`).join("\n")
        window.open(waLink(`Hola! Quiero comprar:\n${summary}\n\nTotal: ${formatGs(totalPrice)}`), "_blank")
      }
    } catch {
      const summary = items.map((i) => `${i.name} x${i.quantity} — ${formatGs(i.price * i.quantity)}`).join("\n")
      window.open(waLink(`Hola! Quiero comprar:\n${summary}\n\nTotal: ${formatGs(totalPrice)}`), "_blank")
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <>
      <div className="bg-[#0F1624] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">Nuestra Tienda</h1>
          <p className="mt-3 text-blue-200">Explorá nuestros productos y servicios</p>
        </div>
      </div>

      <div className="bg-[#EFF2F7] py-10 pb-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-3 mb-8">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/es/tienda${c !== "todos" ? `?cat=${c}` : ""}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                  cat === c ? "bg-primary text-white" : "bg-white text-foreground-muted hover:bg-primary/10"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          {q && (
            <p className="mb-4 text-sm text-foreground-muted">
              Resultados para &ldquo;{q}&rdquo;: {filtered.length} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground-muted">No hay productos en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <div>
                <span className="font-bold text-primary">{items.reduce((s, i) => s + i.quantity, 0)} </span>
                <span className="text-foreground-muted text-sm">artículo{items.length !== 1 ? "s" : ""}</span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="font-bold text-primary">{formatGs(totalPrice)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearCart} className="text-sm text-foreground-muted hover:text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                Vaciar
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {checkoutLoading ? "Redirigiendo..." : "Finalizar Compra"}
              </button>
              <a
                href={waLink(`Hola! Quiero comprar: ${items.map((i) => `${i.name} x${i.quantity}`).join(", ")} — Total: ${formatGs(totalPrice)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-4 py-3 rounded-xl hover:bg-green-600 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}