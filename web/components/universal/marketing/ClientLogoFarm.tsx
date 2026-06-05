/**
 * ANNOTATION: ClientLogoFarm
 *
 * What it is: A horizontally auto-scrolling logo carousel displaying partner/client
 * logos in a grayscale-to-color-on-hover effect.
 *
 * Why your business needs it: Social proof through client logos builds trust and
 * credibility — visitors see recognizable brands and think "if they work with X, I should too."
 *
 * What AI populates from your data: ParaguAI reads logo images and URLs from
 * content/_shared/logos.json — you provide the SVG/PNG files.
 *
 * Your input: 6-8 client/partner logos as SVG or PNG files.
 *
 * Plan availability: Crecimiento, Profesional
 */

import Image from "next/image"
import logosData from "@/content/_shared/logos.json"

export function ClientLogoFarm() {
  const logos = logosData.logos

  if (!logos || logos.length === 0) return null

  return (
    <section
      aria-label="Empresas que confían en nosotros"
      className="py-16 bg-white overflow-hidden"
    >
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="text-sm font-bold text-primary/50 uppercase tracking-widest mb-2 block">
            Empresas que confían en nosotros
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
            Nuestros Clientes
          </h2>
        </div>

        <div className="logo-carousel-track group" role="list">
          {Array.from({ length: 4 }).map((_, copyIdx) => (
            <div key={copyIdx} className="logo-carousel-row">
              {logos.map((logo) => (
                <a
                  key={`${copyIdx}-${logo.name}`}
                  href={logo.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar sitio web de ${logo.name}`}
                  className="logo-carousel-item flex-shrink-0 flex items-center justify-center h-16 w-40"
                  role="listitem"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt || logo.name}
                    width={160}
                    height={64}
                    className="max-h-full max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .logo-carousel-track {
          display: flex;
          width: max-content;
          animation: logoScroll 40s linear infinite;
        }

        .logo-carousel-track:hover {
          animation-play-state: paused;
        }

        .logo-carousel-row {
          display: flex;
          gap: 3rem;
          padding-right: 3rem;
        }

        @keyframes logoScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}