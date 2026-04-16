import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Paragu-AI Builder',
  description: 'Website generation engine for Paraguayan beauty and wellness businesses',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
