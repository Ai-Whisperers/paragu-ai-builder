export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Panel de Administracion</h1>
        <p className="mb-8 text-gray-600">
          Gestiona negocios, genera sitios web y controla despliegues.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Negocios</h2>
            <p className="text-sm text-gray-500">Gestionar datos de negocios y generar sitios.</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Sitios Generados</h2>
            <p className="text-sm text-gray-500">Ver estado de generacion y previsualizaciones.</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Despliegues</h2>
            <p className="text-sm text-gray-500">Controlar publicacion y URLs de sitios.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
