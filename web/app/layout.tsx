import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ParaguAI Builder — Sitios Web para Belleza y Bienestar en Paraguay',
  description:
    'Motor de generacion con IA que crea sitios web profesionales para peluquerias, spas, gimnasios y negocios de belleza en Paraguay. 11 plantillas especializadas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
