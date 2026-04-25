interface AdminTableProps<T> {
  headers: { label: string; className?: string }[]
  rows: T[]
  renderRow: (item: T, idx: number) => React.ReactNode
  emptyMessage?: string
}

export function AdminTable<T>({
  headers,
  rows,
  renderRow,
  emptyMessage = 'Sin resultados',
}: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-3 font-medium text-gray-600 ${h.className ?? ''}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((item, idx) => renderRow(item, idx))
          )}
        </tbody>
      </table>
    </div>
  )
}

interface PaginationProps {
  page: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ page, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null
  const buildUrl = (p: number) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(searchParams)) {
      if (v) params.set(k, v)
    }
    params.set('page', String(p))
    return `${basePath}?${params.toString()}`
  }
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-gray-500">
        Página {page} de {totalPages}
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <a
            href={buildUrl(page - 1)}
            className="rounded border px-3 py-1 text-gray-600 hover:bg-gray-50"
          >
            ← Anterior
          </a>
        )}
        {page < totalPages && (
          <a
            href={buildUrl(page + 1)}
            className="rounded border px-3 py-1 text-gray-600 hover:bg-gray-50"
          >
            Siguiente →
          </a>
        )}
      </div>
    </div>
  )
}
