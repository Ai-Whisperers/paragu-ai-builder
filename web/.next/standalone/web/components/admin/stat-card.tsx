interface StatCardProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  trend?: string
  className?: string
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`rounded-lg border bg-white p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {trend && <p className="mt-1 text-xs text-gray-500">{trend}</p>}
    </div>
  )
}
