/* eslint-disable @next/next/no-img-element */
/**
 * @component BeforeAfterSection
 * @description Interactive before/after image comparison slider with drag divider. Displays service transformation photos with reveal animation and descriptive labels.
 * @featureFlags core
 * @requires beforeAfter data from @/lib/config, ScrollReveal component
 * @implementation CSS clip-path for before image reveal, touch and mouse event handlers for slider positioning
 */


/**
 * ANNOTATION: BeforeAfter
 *
 * What it is: An interactive before/after image slider — drag to reveal the
 * transformation between two photos.
 *
 * Why your business needs it: For results-driven businesses (gyms, aesthetics,
 * fitness, renovation), before/after is the single most persuasive proof you
 * can show. It demonstrates your impact in a way words and prices can't.
 *
 * What AI populates from your data: AI pairs your before/after photo uploads,
 * aligns and crops them to matching dimensions for a clean slider effect.
 *
 * Your input: Matched before/after photo pairs via WhatsApp.
 *
 * Plan availability: All plans.
 */
"use client"
import { useState } from "react"
import { beforeAfter } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

function BeforeAfterSlider({ item, index }: { item: (typeof beforeAfter)[number]; index: number }) {
  const [slider, setSlider] = useState(50)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setSlider(Math.min(Math.max(x, 0), 100))
  }

  return (
    <ScrollReveal delay={index * 150} direction="up">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="relative h-72 md:h-96 cursor-ew-resize select-none overflow-hidden"
          onMouseMove={handleMove}
          onTouchMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
            setSlider(Math.min(Math.max(x, 0), 100))
          }}
        >
          {/* AFTER (full image, base layer) */}
          <img src={item.after} alt={`Despues: ${item.afterTitle || item.title || ""}`} className="absolute inset-0 w-full h-full object-cover" />

          {/* BEFORE (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${slider}%` }}
          >
            <img src={item.before} alt={`Antes: ${item.beforeTitle || item.title || ""}`} className="absolute inset-0 w-full h-full object-cover" style={{ width: `${Math.max(slider, 0.1) < 1 ? 100 / (Math.max(slider, 0.1) / 100) : 100}%` }} />
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] z-10"
            style={{ left: `${slider}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M8 12H4l4-4m0 8l-4-4M20 12h-4l-4-4m0 8l-4-4" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">ANTES</div>
          <div className="absolute bottom-3 right-3 bg-white/80 text-primary text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">DESPUES</div>
        </div>

        <div className="p-5 text-center">
          <h3 className="font-heading text-lg font-bold text-primary mb-1">{item.title}</h3>
          <p className="text-sm text-foreground-light">{item.description}</p>
          <p className="text-xs text-foreground-muted mt-2 italic">Desliza para comparar</p>
        </div>
      </div>
    </ScrollReveal>
  )
}

export function BeforeAfterSection() {
  const items = [
    ...beforeAfter,
    {
      id: "extra-1",
      before: "https://images.unsplash.com/photo-1583445095369-9c651e7e5d34?w=800&q=80",
      after: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      title: "Corte Transformador",
      description: "Corte moderno con acabado profesional y styled de volumen"
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">Galería de Resultados</span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">Antes y Después</h2>
            <p className="text-foreground-light max-w-lg mx-auto">La diferencia que logra nuestro equipo en cada transformación. Deslizá para comparar.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => <BeforeAfterSlider key={i} item={item} index={i} />)}
        </div>
      </div>
    </section>
  )
}
