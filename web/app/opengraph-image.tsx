import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const alt = 'ParaguAI Builder — Sitios web profesionales en 48 horas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
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
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 24,
            }}
          >
            Tu sitio web{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              profesional
            </span>{' '}
            en 48 horas
          </div>
          <div style={{ fontSize: 30, color: '#cbd5e1', lineHeight: 1.4 }}>
            Todo incluido: diseño, dominio .com.py, SEO y WhatsApp. Demo gratis antes de pagar.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', gap: 32 }}>
            <span>🇵🇾 Paraguay</span>
            <span>· 16 plantillas listas</span>
            <span>· 7.4K negocios mapeados</span>
          </div>
          <div>paragu-ai.com</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
