import { ImageResponse } from 'next/og'
import { LIVE_TEMPLATES } from '@/lib/landing/marketing-data'

export const runtime = 'nodejs'
export const alt = 'ParaguAI — Sitios web por rubro'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Pre-render OG for every live vertical at build time. */
export function generateImageMetadata() {
  return LIVE_TEMPLATES.map((t) => ({
    id: t.seoSlug ?? t.id.replace(/_/g, '-'),
    contentType,
    size,
    alt: `Sitio web para ${t.name.toLowerCase()} en Paraguay`,
  }))
}

export default async function Image({ params }: { params: { rubro: string } }) {
  const t = LIVE_TEMPLATES.find(
    (x) => (x.seoSlug ?? x.id.replace(/_/g, '-')) === params.rubro,
  )
  const name = t?.name ?? 'tu rubro'
  const color = t?.color ?? '#6366f1'
  const headline = t?.seoHeadline ?? `Sitio web para ${name.toLowerCase()} en 48 horas`

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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 32,
            fontWeight: 700,
          }}
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
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginBottom: 16,
            }}
          >
            Plantilla {name}
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
            {headline}
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
            {t && t.leads > 0 && <span>· {t.leads.toLocaleString('es-PY')} negocios mapeados</span>}
            <span>· Demo gratis en 48h</span>
          </div>
          <div>paragu-ai.com</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
