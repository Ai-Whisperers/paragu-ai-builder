'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Unhandled client error (app/error.tsx)', {
      action: 'rootErrorBoundary',
      errorName: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: 'var(--background, #fff)',
        color: 'var(--text, #111)',
      }}
    >
      <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>
          Algo salió mal
        </h1>
        <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
          Ocurrió un error inesperado. El equipo fue notificado.
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
            background: 'var(--primary, #111)',
            color: 'var(--primary-foreground, #fff)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
