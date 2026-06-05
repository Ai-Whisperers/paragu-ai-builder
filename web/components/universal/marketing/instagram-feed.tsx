/* eslint-disable @next/next/no-img-element */
/**
 * ANNOTATION: InstagramFeed
 *
 * What it is: A 6-post Instagram grid fetched from the /api/instagram endpoint, with fallback to curated Unsplash images if no IG handle is configured. Shows post hover overlay with caption and likes.
 *
 * Why your business needs it: Active social proof beyond just the website. When clients see you post regularly, it signals you're alive and engaged — not a ghost business. Instagram also extends your reach to people who have never heard of you.
 *
 * What AI populates from your data: ParaguAI pulls posts from your connected Instagram handle via the API, or generates fallback captions from your business name and services if no IG is linked. Auto-fills handle from your business info.
 *
 * Your input: Share your Instagram handle via WhatsApp during onboarding (e.g., "@tuemprendimiento_asuncion"). AI connects it automatically.
 *
 * Plan availability: All plans (Prueba, Presencia, Crecimiento, Profesional)
 */

"use client"
import { useEffect, useState } from "react"
import { siteConfig, getSiteName } from "@/lib/config/config"

function IgIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

interface IgPost {
  id: string
  type: string
  url: string
  caption: string
  likes: number
  permalink: string
}

const SHOWN = 6

export function InstagramFeed({ lang = "es" as "es" | "en" }: { lang?: "es" | "en" }) {
  const [posts, setPosts] = useState<IgPost[] | null>(null)
  const [fallback, setFallback] = useState(false)

  const isEs = lang === "es"

  useEffect(() => {
    fetch(`/api/instagram?lang=${lang}`)
      .then(r => r.json())
      .then(d => {
        if (d.fallback || !d.posts) setFallback(true)
        else setPosts(d.posts.slice(0, SHOWN))
      })
      .catch(() => setFallback(true))
  }, [lang, isEs])

  // Fallback Unsplash data — generic business/workspace images that work for any industry
  const igHandle = siteConfig.business?.instagramHandle?.replace("@","") || "tu_emprendimiento"
  const fallbackPosts = [
    { id: "f1", type: "IMAGE", url: "https://images.unsplash.com/photo-1504384308090-c54be3855465?w=600&q=85", caption: "Día de trabajo en el local ✨", likes: 247, permalink: `https://instagram.com/${igHandle}` },
    { id: "f2", type: "IMAGE", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=85", caption: "Espacio de trabajo", likes: 189, permalink: `https://instagram.com/${igHandle}` },
    { id: "f3", type: "IMAGE", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=85", caption: "Proyecto completado", likes: 156, permalink: `https://instagram.com/${igHandle}` },
    { id: "f4", type: "IMAGE", url: "https://images.unsplash.com/photo-1521737604893-d14cd23729d4?w=600&q=85", caption: "Equipo feliz", likes: 312, permalink: `https://instagram.com/${igHandle}` },
    { id: "f5", type: "IMAGE", url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=85", caption: "Buena atención, mejores resultados", likes: 198, permalink: `https://instagram.com/${igHandle}` },
    { id: "f6", type: "IMAGE", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=85", caption: "Innovamos cada día", likes: 275, permalink: `https://instagram.com/${igHandle}` },
  ]
  const displayPosts = posts ?? fallbackPosts
  const showPreviewLabel = fallback

  return (
    <section className="py-16 bg-gradient-to-b from-primary to-primary-light">
      <div className="container-page">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 mb-6">
            <IgIcon />
            <span className="text-white font-semibold text-sm">@{siteConfig.business?.instagramHandle?.replace('@','') || 'tu_emprendimiento'}</span>
            {showPreviewLabel && (
              <span className="text-xs text-secondary">· preview</span>
            )}
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
            {isEs ? `Vida en ${getSiteName()}` : `Life at ${getSiteName()}`}
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            {isEs
              ? "Seguinos para ver trabajos diarios, tips de negocio y ofertas exclusivas."
              : "Follow us for daily work, business tips and exclusive offers."}
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {displayPosts.map((post) => (
            <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-white/5">
              {post.type === "VIDEO" && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
              <img
                src={post.url}
                alt={post.caption || "Instagram post"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
                <p className="text-white text-xs line-clamp-2">{post.caption}</p>
                {post.likes > 0 && (
                  <p className="text-white/70 text-xs mt-1">❤️ {post.likes}</p>
                )}
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a href={`https://instagram.com/${siteConfig.business?.instagramHandle?.replace('@','') || 'tu_emprendimiento'}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors">
            <IgIcon />
            <span>{isEs ? "Seguir en Instagram" : "Follow on Instagram"}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
