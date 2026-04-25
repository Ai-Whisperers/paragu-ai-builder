import { ImageResponse } from 'next/og'
import { CITIES } from '@/lib/landing/cities'

export const runtime = 'nodejs'
export const alt = 'ParaguAI — Sitios web por ciudad'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateImageMetadata() {
  return CITIES.map((c) => ({
    id: c.slug,
    contentType,
    size,
    alt: `Sitios web para negocios en ${c.name}, Paraguay`,
  }))
}

export default async function Image({ params }: { params: { ciudad: string } }) {
  const city = CITIES.find((c) => c.slug === params.ciudad)
  const name = city?.name ?? 'tu ciudad'
  const businesses = city?.businesses ?? 0
  const noWebPct = city?.noWebPct ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d6a4f88 50%, #2d6a4f 100%)',
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
            📍
          </div>
          <div>
            <span style={{ color: 'white' }}>Paragu</span>
            <span style={{ color: '#a78bfa' }}>AI</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginBottom: 16,
            }}
          >
            {name}, Paraguay
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1,
              marginBottom: 24,
            }}
          >
            Sitios web para negocios de {name}
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
            {businesses > 0 && <span>{businesses.toLocaleString('es-PY')} negocios mapeados</span>}
            {noWebPct > 0 && <span>· {noWebPct}% sin web</span>}
            <span>· Demo gratis 48h</span>
          </div>
          <div>paragu-ai.com</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
