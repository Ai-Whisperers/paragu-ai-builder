/**
 * ANNOTATION: ProductCard
 *
 * What it is: Individual product card for the storefront grid.
 * Shows product image, category badge, name, description, price, and add-to-cart button.
 *
 * What AI populates from your data:
 *   - All product data sourced from content/_shared/products.json
 *
 * Your input: Send your product list during onboarding setup.
 *
 * Plan availability: Crecimiento, Profesional
 */

/**
 * @component ProductCard
 * @description Single product card with image, category badge, price, and add-to-cart with visual feedback.
 * @featureFlags tienda
 * @requires formatGs from @/lib/config, useCart
 * @implementation useState for added animation, localStorage cart via CartStore
 */

"use client"
import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Check } from "lucide-react"
import { formatGs } from "@/lib/config/config"
import { useCart } from "@/components/shared/cart-store"

const CATEGORY_COLORS: Record<string, string> = {
  recursos: "bg-rose-100 text-rose-700",
  plantillas: "bg-violet-100 text-violet-700",
  cursos: "bg-amber-100 text-amber-700",
  servicios: "bg-sky-100 text-sky-700",
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    featured?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const colorClass = CATEGORY_COLORS[product.category] || "bg-gray-100 text-gray-700"

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative h-48 bg-gray-50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colorClass}`}>
          {product.category}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-lg font-bold text-primary mb-1">{product.name}</h3>
        <p className="text-sm text-foreground-muted flex-1 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="font-heading text-2xl font-bold text-primary">{formatGs(product.price)}</span>
        </div>
        <button
          onClick={handleAdd}
          className={`w-full inline-flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all text-sm ${
            added
              ? "bg-green-500 text-white"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          {added ? "¡Agregado!" : "Añadir al carrito"}
        </button>
      </div>
    </div>
  )
}