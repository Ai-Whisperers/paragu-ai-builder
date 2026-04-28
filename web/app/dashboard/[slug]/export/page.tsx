'use client'

import { Download, FileSpreadsheet } from 'lucide-react'

const EXPORT_TYPES = [
  {
    key: 'analytics',
    label: 'Analíticas (CSV)',
    desc: 'Eventos de los últimos 30 días: visitas, clics, conversiones',
    filename: 'analitica.csv',
  },
  {
    key: 'bookings',
    label: 'Reservas (CSV)',
    desc: 'Todas las reservas con cliente, fecha, hora y estado',
    filename: 'reservas.csv',
  },
  {
    key: 'orders',
    label: 'Pedidos (CSV)',
    desc: 'Todos los pedidos con monto, estado y fecha',
    filename: 'pedidos.csv',
  },
]

export default function ExportPage() {
  const handleExport = (type: string, filename: string) => {
    window.open(`/api/portal/export?type=${type}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exportar datos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Descargá los datos de tu negocio en formato CSV
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPORT_TYPES.map(({ key, label, desc, filename }) => (
          <button
            key={key}
            onClick={() => handleExport(key, filename)}
            className="group rounded-xl border bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
          >
            <div className="mb-3 rounded-lg bg-green-50 p-2.5 w-fit">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900 group-hover:text-blue-700">{label}</p>
            <p className="mt-1 text-sm text-gray-500">{desc}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="h-4 w-4" />
              Descargar
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-amber-50 p-4 text-sm text-amber-800">
        Los archivos CSV se pueden abrir en Excel, Google Sheets o cualquier editor de texto.
      </div>
    </div>
  )
}
