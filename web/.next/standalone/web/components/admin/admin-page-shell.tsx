import Link from 'next/link'

interface AdminPageShellProps {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  maxWidth?: string
  children: React.ReactNode
}

const WIDTH_MAP: Record<string, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
}

export function AdminPageShell({
  title,
  subtitle,
  backHref,
  backLabel = '← Volver',
  maxWidth = 'xl',
  children,
}: AdminPageShellProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-4`}>
          <div>
            {backHref && (
              <Link
                href={backHref}
                className="mb-1 block text-sm text-gray-500 hover:text-gray-700"
              >
                {backLabel}
              </Link>
            )}
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </header>
      <div className={`mx-auto ${WIDTH_MAP[maxWidth] ?? maxWidth} px-6 py-8`}>
        {children}
      </div>
    </main>
  )
}
