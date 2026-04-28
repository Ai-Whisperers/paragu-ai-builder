'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'

const RUBROS = [
  { id: 'peluqueria', label: 'Peluquería' },
  { id: 'salon_belleza', label: 'Salón de Belleza' },
  { id: 'barberia', label: 'Barbería' },
  { id: 'gimnasio', label: 'Gimnasio' },
  { id: 'spa', label: 'Spa' },
  { id: 'restaurant', label: 'Restaurante' },
  { id: 'taller_mecanico', label: 'Taller Mecánico' },
  { id: 'inmobiliaria', label: 'Inmobiliaria' },
  { id: 'clinica_integral', label: 'Clínica' },
  { id: 'veterinaria', label: 'Veterinaria' },
  { id: 'contador', label: 'Contador' },
  { id: 'panaderia', label: 'Panadería' },
  { id: 'ferreteria', label: 'Ferretería' },
  { id: 'farmacia', label: 'Farmacia' },
  { id: 'electricista', label: 'Electricista' },
]

export default function DemoPersonalizePage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [rubro, setRubro] = useState('peluqueria')
  const [city, setCity] = useState('Asunción')

  const handleSeeDemo = () => {
    const demoSlugs: Record<string, string> = {
      peluqueria: 'demo-peluqueria', salon_belleza: 'demo-salon-belleza',
      barberia: 'demo-barberia', gimnasio: 'demo-taller-mecanico',
      spa: 'demo-spa', restaurant: 'demo-restaurant',
      taller_mecanico: 'demo-taller-mecanico', inmobiliaria: 'demo-inmobiliaria',
      clinica_integral: 'demo-clinica-integral', veterinaria: 'demo-veterinaria',
      contador: 'demo-contador', panaderia: 'demo-panaderia',
      ferreteria: 'demo-ferreteria', farmacia: 'demo-farmacia',
      electricista: 'demo-electricista',
    }
    const demoSlug = demoSlugs[rubro] || 'demo-peluqueria'
    const demoUrl = businessName
      ? `/s/es/${demoSlug}?demo_name=${encodeURIComponent(businessName)}&demo_city=${encodeURIComponent(city)}`
      : `/s/es/${demoSlug}`
    window.open(demoUrl, '_blank')
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Sparkles className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Personalizá tu demo</h1>
        <p className="mt-2 text-sm text-gray-500">
          Poné el nombre de tu negocio y elegí tu rubro para ver una demo con tu información
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de tu negocio</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Ej: Salón María"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
          <select
            value={rubro}
            onChange={(e) => setRubro(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {RUBROS.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          onClick={handleSeeDemo}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Ver mi demo <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        La demo se abre en una nueva pestaña. No guardamos ningún dato hasta que solicites tu sitio.
      </p>
    </div>
  )
}
