import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { listSiteSlugs, loadSite, listPageSlugs } from '@/lib/engine/site-loader'
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEMO_SLUGS = new Set([
  'demo-peluqueria', 'demo-salon-belleza', 'demo-spa', 'demo-barberia',
  'demo-unas', 'demo-restaurant', 'demo-clinica-integral', 'demo-odontologia',
  'demo-psicologia', 'demo-panaderia', 'demo-taller-mecanico', 'demo-ferreteria',
  'demo-farmacia', 'demo-electricista', 'demo-plomero', 'demo-inmobiliaria',
  'demo-contador', 'demo-carniceria', 'demo-gomeria', 'demo-lavadero',
  'demo-parrilla', 'demo-cafeteria', 'demo-bodega', 'demo-cerrajero',
  'demo-veterinaria', 'demo-herreria', 'demo-depilacion', 'demo-maquillaje',
])

export default async function AuditPage() {
  const slugs = listSiteSlugs()
  const issues: Array<{ slug: string; type: string; message: string; isDemo: boolean }> = []

  for (const slug of slugs) {
    const isDemo = DEMO_SLUGS.has(slug)

    try {
      const site = loadSite(slug)
      const pageSlugs = listPageSlugs(slug)

      if (pageSlugs.length === 0) {
        issues.push({ slug, type: 'warning', message: 'No pages defined', isDemo })
      }

      if (!site.vertical) {
        issues.push({ slug, type: 'error', message: 'No vertical configured', isDemo })
      }

      if (!site.locales || site.locales.length === 0) {
        issues.push({ slug, type: 'error', message: 'No locales configured', isDemo })
      }
    } catch (err) {
      issues.push({ slug, type: 'error', message: `Site load failed: ${err instanceof Error ? err.message : 'unknown'}`, isDemo })
    }
  }

  // Check DB for all demo sites
  const supabase = await createClient('service_role')

  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, name, type, status')
    .in('slug', [...DEMO_SLUGS])

  const dbSlugs = new Set((businesses ?? []).map((b) => b.slug))
  const missingFromDb = [...DEMO_SLUGS].filter((s) => !dbSlugs.has(s))
  for (const slug of missingFromDb) {
    issues.push({ slug, type: 'error', message: 'NOT IN Supabase businesses table — will 404', isDemo: true })
  }

  const errorCount = issues.filter((i) => i.type === 'error').length
  const warnCount = issues.filter((i) => i.type === 'warning').length
  const demoIssues = issues.filter((i) => i.isDemo)
  const realIssues = issues.filter((i) => !i.isDemo)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/admin" className="text-sm text-gray-500 hover:underline">← Admin</Link>
            <h1 className="text-xl font-bold text-gray-900">Site Health Audit</h1>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="rounded-lg bg-red-50 px-3 py-1.5 text-red-700 font-medium">{errorCount} errors</span>
            <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-amber-700 font-medium">{warnCount} warnings</span>
            <span className="rounded-lg bg-green-50 px-3 py-1.5 text-green-700 font-medium">{slugs.length} total sites</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Demo sites</p>
            <p className="text-2xl font-bold text-gray-900">{DEMO_SLUGS.size}</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Demos in DB</p>
            <p className="text-2xl font-bold text-gray-900">{DEMO_SLUGS.size - missingFromDb.length}</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Demos NOT in DB</p>
            <p className="text-2xl font-bold text-red-600">{missingFromDb.length}</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Demo issues</p>
            <p className="text-2xl font-bold text-amber-600">{demoIssues.length}</p>
          </div>
        </div>

        {/* Demo issues */}
        {demoIssues.length > 0 && (
          <div className="rounded-xl border bg-white">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Demo site issues</h2>
            </div>
            <div className="divide-y">
              {demoIssues.map((issue) => (
                <div key={`${issue.slug}-${issue.type}`} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {issue.type === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{issue.slug}</p>
                      <p className="text-sm text-gray-500">{issue.message}</p>
                    </div>
                  </div>
                  <a href={`/s/es/${issue.slug}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline flex-shrink-0 ml-4">
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real tenant issues */}
        {realIssues.length > 0 && (
          <div className="rounded-xl border bg-white">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Real tenant issues</h2>
            </div>
            <div className="divide-y">
              {realIssues.map((issue) => (
                <div key={`${issue.slug}-${issue.type}`} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {issue.type === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{issue.slug}</p>
                      <p className="text-sm text-gray-500">{issue.message}</p>
                    </div>
                  </div>
                  <a href={`/s/es/${issue.slug}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline flex-shrink-0 ml-4">
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Healthy sites */}
        {missingFromDb.length === 0 && demoIssues.length === 0 && (
          <div className="rounded-xl border bg-white p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">All sites healthy</h2>
            <p className="mt-2 text-gray-500">No issues found across {slugs.length} sites.</p>
          </div>
        )}
      </div>
    </div>
  )
}
