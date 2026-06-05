/* eslint-disable @next/next/no-img-element */
/**
 * @component Gallery
 * @description Responsive photo gallery grid with filter tabs by service tag and fullscreen lightbox for viewing images up close.
 * @featureFlags gallery
 * @requires galleryData, waLink from @/lib/config
 * @implementation CSS Grid for layout, filter state for tag filtering, fixed overlay div for lightbox
 */


/**
 * ANNOTATION: Gallery
 *
 * What it is: A responsive photo grid with a click-to-expand lightbox.
 * Shows your real work — finished cuts, products, the space, happy clients.
 *
 * Why your business needs it: For visual businesses (restaurants, gyms, spas)
 photos sell better than words. A gallery of real work is
 * proof you deliver. Visitors who view a gallery stay 2x longer on the page.
 *
 * What AI populates from your data: You send photos via WhatsApp; AI selects
 * the highest-quality images by composition/lighting scoring, orders them for
 * visual flow, and crops them to consistent aspect ratios.
 *
 * Your input: A batch of photos via WhatsApp (even phone photos work).
 *
 * Plan availability: All plans.
 */
"use client"
import { useState } from "react"
import { Camera, ExternalLink, X } from "lucide-react"
import { galleryData, waLink } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const gallerySection = galleryData
  const images: { src: string; alt: string; tag?: string }[] = Array.isArray(gallerySection) ? gallerySection : (gallerySection as unknown as {images?: {src: string; alt: string; tag?: string}[]}).images ?? []

  const tags: string[] = ["all", ...Array.from(new Set(images.map(img => img.tag).filter(Boolean) as string[]))]
  const filtered = filter === "all" ? images : images.filter(img => img.tag === filter)

  return (
    <>
      <section className="py-20 bg-white">
        <div className="container-page">
          {/* Header */}
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-4">
                <Camera className="w-4 h-4" /> Nuestros Trabajos
              </span>
              <h2 className="font-heading text-4xl font-bold text-primary mb-4">Resultados que Hablan</h2>
              <p className="text-foreground-light max-w-xl mx-auto">
                Cada trabajo es único. Consultanos para encontrar el estilo que mejor se adapte a vos.
              </p>
            </div>
          </ScrollReveal>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tags.map(tag => (
              <button key={tag} onClick={() => setFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === tag ? "bg-primary text-white" : "bg-gray-100 text-foreground-muted hover:bg-gray-200"
                }`}>
                {tag === "all" ? "Todos" : tag}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((img, i) => (
              <div key={i}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100 cursor-pointer"
                onClick={() => setSelected(i)}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 text-primary text-xs font-bold px-3 py-1 rounded-full shadow">
                    {img.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a href={waLink("Hola! Quiero ver más trabajos de sus servicios")}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:text-secondary-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Ver más en Instagram
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected !== null && (
        <div role="dialog" aria-modal="true" aria-label="Image lightbox" className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <img
            src={filtered[selected]?.src.replace("w=600", "w=1200")}
            alt={filtered[selected]?.alt}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-white text-center text-sm">{filtered[selected]?.alt}</p>
        </div>
      )}
    </>
  )
}