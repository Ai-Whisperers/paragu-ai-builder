'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/obs/sentry'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Unhandled root layout error (app/global-error.tsx)', {
      action: 'globalErrorBoundary',
      errorName: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
    captureException(error, {
      tags: { boundary: 'global' },
      extra: { digest: error.digest },
      level: 'fatal',
    })
  }, [error])

  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#fff',
            color: '#111',
          }}
        >
          <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>
              Error crítico
            </h1>
            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
              La aplicación no pudo cargar. Intenta recargar la página.
            </p>
            {error.digest && (
              <p style={{ fontSize: '0.75rem', opacity: 0.6, fontFamily: 'monospace', marginBottom: '1.5rem' }}>
                ID de error: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                background: '#111',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Recargar
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
