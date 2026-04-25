import { ImageResponse } from 'next/og'
import { CITIES } from '@/lib/landing/cities'
import { LIVE_TEMPLATES } from '@/lib/landing/marketing-data'

export const runtime = 'nodejs'
export const alt = 'ParaguAI — Sitio web por ciudad y rubro'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateImageMetadata() {
  // 5 cities × 16 verticals = 80 OG images.
  return CITIES.flatMap((c) =>
    LIVE_TEMPLATES.map((t) => ({
      id: `${c.slug}__${t.seoSlug ?? t.id.replace(/_/g, '-')}`,
      contentType,
      size,
      alt: `Sitio web para ${t.name.toLowerCase()} en ${c.name}, Paraguay`,
    })),
  )
}

export default async function Image({
  params,
}: {
  params: { ciudad: string; rubro: string }
}) {
  const city = CITIES.find((c) => c.slug === params.ciudad)
  const t = LIVE_TEMPLATES.find(
    (x) => (x.seoSlug ?? x.id.replace(/_/g, '-')) === params.rubro,
  )
  const cityName = city?.name ?? 'tu ciudad'
  const vertical = t?.name ?? 'tu rubro'
  const color = t?.color ?? '#6366f1'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, #1a1a2e 0%, ${color}88 50%, ${color} 100%)`,
          padding: 80,
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 700 }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
            }}
          >
            ✨
          </div>
          <div>
            <span style={{ color: 'white' }}>Paragu</span>
            <span style={{ color: '#a78bfa' }}>AI</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              fontSize: 26,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginBottom: 14,
            }}
          >
            📍 {cityName} · {vertical}
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -1,
              marginBottom: 24,
            }}
          >
            Sitio web para {vertical.toLowerCase()} en {cityName}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <div style={{ display: 'flex', gap: 24 }}>
            <span>🇵🇾 Paraguay</span>
            <span>· Demo gratis en 48h</span>
            <span>· WhatsApp + dominio incluidos</span>
          </div>
          <div>paragu-ai.com</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
