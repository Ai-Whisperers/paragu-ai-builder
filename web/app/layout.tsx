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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Inter',sans-serif] antialiased">{children}</body>
    </html>
  )
}
