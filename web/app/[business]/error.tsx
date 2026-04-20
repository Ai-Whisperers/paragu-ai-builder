'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/obs/sentry'

export default function BusinessPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Business page render failed', {
      action: 'businessErrorBoundary',
      errorName: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })
    captureException(error, {
      tags: { boundary: 'business' },
      extra: { digest: error.digest },
    })
  }, [error])

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          No pudimos cargar esta página
        </h1>
        <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
          Si el problema persiste, contactá al equipo incluyendo el ID abajo.
        </p>
        {error.digest && (
          <p style={{ fontSize: '0.75rem', opacity: 0.6, fontFamily: 'monospace', marginBottom: '1.5rem' }}>
            {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            background: 'var(--primary, #111)',
            color: 'var(--primary-foreground, #fff)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
