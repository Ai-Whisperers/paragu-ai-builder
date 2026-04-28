import Link from 'next/link'
import { listSiteSlugs } from '@/lib/engine/site-loader'
import { analyzeSectionUsage, generateContentGaps } from '@/lib/audit/section-analyzer'
import { generateCritique, generateCrossSiteAnalysis } from '@/lib/audit/critique-engine'
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"><CheckCircle className="h-3 w-3" />{score}</span>
  if (score >= 60) return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"><AlertTriangle className="h-3 w-3" />{score}</span>
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"><XCircle className="h-3 w-3" />{score}</span>
}

export default async function AuditReportPage() {
  const slugs = listSiteSlugs()
  const critiques = []
  for (const slug of slugs) {
    try {
      const report = analyzeSectionUsage(slug)
      const gaps = generateContentGaps(report)
      critiques.push(generateCritique(report, gaps))
    } catch {}
  }

  const demos = critiques.filter((c) => c.slug.startsWith('demo-') || c.slug.startsWith('preview-'))
  const real = critiques.filter((c) => !c.slug.startsWith('demo-') && !c.slug.startsWith('preview-'))
  const avgDemo = demos.length > 0 ? Math.round(demos.reduce((s, c) => s + c.score, 0) / demos.length) : 0
  const avgReal = real.length > 0 ? Math.round(real.reduce((s, c) => s + c.score, 0) / real.length) : 0
  const gap = avgReal - avgDemo
  const crossSite = slugs.length > 1 ? generateCrossSiteAnalysis(critiques) : ''

  const allWeaknesses = critiques.flatMap((c) => c.weaknesses)
  const topWeaknesses = Object.entries(
    allWeaknesses.reduce<Record<string, number>>((acc, w) => {
      const key = w.split('—')[0].trim()
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  ).sort(([, a], [, b]) => b - a).slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/admin/audit" className="text-sm text-gray-500 hover:underline">← Health Audit</Link>
            <h1 className="text-xl font-bold text-gray-900">AI Site Quality Report</h1>
            <p className="text-sm text-gray-500">Automated critique of all {slugs.length} sites</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-5">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Demo avg</p>
            <p className={`text-2xl font-bold ${avgDemo >= 80 ? 'text-green-600' : avgDemo >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{avgDemo}/100</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Real avg</p>
            <p className={`text-2xl font-bold ${avgReal >= 80 ? 'text-green-600' : avgReal >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{avgReal}/100</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Gap</p>
            <div className="flex items-center gap-1">
              {gap > 0 ? <TrendingUp className="h-5 w-5 text-red-500" /> : gap < 0 ? <TrendingDown className="h-5 w-5 text-green-500" /> : <Minus className="h-5 w-5 text-gray-400" />}
              <span className={`text-2xl font-bold ${Math.abs(gap) > 10 ? 'text-red-600' : 'text-gray-900'}`}>{gap > 0 ? '+' : ''}{gap}</span>
            </div>
            <p className="text-xs text-gray-400">{gap > 0 ? 'Demos need work' : gap < 0 ? 'Demos exceed real' : 'On par'}</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Demos</p>
            <p className="text-2xl font-bold text-gray-900">{demos.length}</p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Real</p>
            <p className="text-2xl font-bold text-gray-900">{real.length}</p>
          </div>
        </div>

        {/* Top issues */}
        {topWeaknesses.length > 0 && (
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Most common issues across all sites</h2>
            <div className="space-y-3">
              {topWeaknesses.map(([issue, count], i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">{i + 1}</span>
                    <span className="text-sm text-gray-700">{issue}</span>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">{count} site{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo critique cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Per-site critique</h2>
          {critiques.sort((a, b) => a.score - b.score).map((c) => (
            <div key={c.slug} className="rounded-xl border bg-white p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{c.slug}</h3>
                    <ScoreBadge score={c.score} />
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{c.summary}</p>
                </div>
                <a href={`/s/es/${c.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline flex-shrink-0">
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {c.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">Strengths</p>
                    <ul className="space-y-1">
                      {c.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{s}</li>)}
                    </ul>
                  </div>
                )}
                {c.weaknesses.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-2">Weaknesses</p>
                    <ul className="space-y-1">
                      {c.weaknesses.map((w, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><XCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />{w}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {c.recommendations.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">Recommendations</p>
                  <div className="flex flex-wrap gap-2">
                    {c.recommendations.map((r, i) => (
                      <span key={i} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{r}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
