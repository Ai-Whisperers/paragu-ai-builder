import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precios — sitios web profesionales en guaraníes (PYG)',
  description:
    'Setup único + cuota mensual baja, sin permanencia. 4 planes desde gratis hasta multi-sucursal. Mercado Pago o transferencia bancaria. 30 días de garantía.',
  alternates: { canonical: '/precios' },
}

export default function PreciosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
