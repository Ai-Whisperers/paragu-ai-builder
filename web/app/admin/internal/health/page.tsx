'use client'

import Layout from '@/components/Layout'
import { useEffect, useMemo, useState } from 'react'

async function getJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`)
  return json
}

export default function HealthPage() {
  const [health, setHealth] = useState<any>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [msg, setMsg] = useState('')
  const [busyDomain, setBusyDomain] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    setRefreshing(true)
    try {
      const [h, i] = await Promise.all([
        getJson('/admin/internal/api/health'),
        getJson('/admin/internal/api/incidents?limit=100').catch(() => ({ incidents: [] }))
      ])
      setHealth(h)
      setIncidents(i.incidents || [])
      setLastRefresh(new Date())
    } finally { setRefreshing(false) }
  }

  useEffect(() => {
    load().catch(e => setMsg(e.message))
    const id = setInterval(() => load().catch(() => {}), 60000)
    return () => clearInterval(id)
  }, [])

  const ackIncident = async (id: string) => {
    try {
      await getJson(`/admin/internal/api/incidents/${id}/acknowledge`, { method: 'POST' })
      setMsg('Incidente acknowledged'); load()
    } catch (e: any) { setMsg(`Error: ${e.message}`) }
  }
  const resolveIncident = async (id: string) => {
    try {
      await getJson(`/admin/internal/api/incidents/${id}/resolve`, { method: 'POST' })
      setMsg('Incidente resuelto'); load()
    } catch (e: any) { setMsg(`Error: ${e.message}`) }
  }
  const redeploy = async (domain: string) => {
    try {
      setBusyDomain(domain); setMsg('')
      const token = typeof window !== 'undefined' ? localStorage.getItem('redeploy_token') || '' : ''
      const out = await getJson(`/admin/internal/api/sites/redeploy?domain=${encodeURIComponent(domain)}`, {
        method: 'POST',
        headers: token ? { 'x-redeploy-token': token } : {}
      })
      setMsg(out.message + (out.mode ? ` (${out.mode})` : '')); await load()
    } catch (e: any) { setMsg(`Redeploy error: ${e.message}`) } finally { setBusyDomain('') }
  }

  const filtered = useMemo(() => (health?.sites || []).filter((s: any) => filter === 'all' || s.status === filter), [health, filter])

  if (!health) return <div className="p-8"><div className="loading">Cargando...</div></div>

  return (
    <div className="p-8">
      <div className="flex-between mb-4">
        <div>
          <h1 className="page-title">Salud e Incidentes</h1>
          <p className="page-subtitle">
            {health.updated ? `Check: ${new Date(health.updated).toLocaleString('es-PY')}` : 'Cargando...'}
            {lastRefresh && <span style={{ marginLeft: 12, fontSize: 11, color: '#4a5568' }}>Live · próximo refresh ~60s</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => { const t = window.prompt('Set redeploy token:'); if (t !== null) localStorage.setItem('redeploy_token', t) }}>Set token</button>
          <button className="btn btn-primary" disabled={refreshing} onClick={() => load().catch(e => setMsg(e.message))}>{refreshing ? '⟳ Refrescando...' : '⟳ Refrescar'}</button>
        </div>
      </div>

      {msg && <div className="alert-bar mb-4">{msg}</div>}

      <div className="grid-4 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="card"><div className="card-title">UP</div><div className="card-value kpi-good">{health.up}</div></div>
        <div className="card"><div className="card-title">DOWN</div><div className="card-value kpi-danger">{health.down}</div></div>
        <div className="card"><div className="card-title">REDIRECT</div><div className="card-value kpi-warn">{health.redirect}</div></div>
        <div className="card"><div className="card-title">Incidentes activos</div><div className="card-value kpi-danger">{(health.activeIncidents || []).length}</div></div>
      </div>

      <div className="tabs mb-4">
        {['all', 'UP', 'DOWN', 'REDIRECT'].map(f => (
          <div key={f} className={`tab ${filter === f ? 'tab-active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `Todos (${(health.sites || []).length})` : `${f} (${(health.sites || []).filter((s: any) => s.status === f).length})`}
          </div>
        ))}
      </div>

      <div className="card mb-4">
        <div className="card-title">Estado de sitios (priorizado por impacto)</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Dominio</th><th>Estado</th><th>Cliente</th><th>MRR</th><th>Latencia</th><th>Acción</th></tr></thead>
            <tbody>
              {filtered.map((s: any) => (
                <tr key={s.domain}>
                  <td className="mono">{s.domain}</td>
                  <td><span className={`badge ${s.status === 'UP' ? 'badge-up' : s.status === 'DOWN' ? 'badge-down' : 'badge-redirect'}`}>{s.status} {s.code ? `(${s.code})` : ''}</span></td>
                  <td>{s.client_name || '-'}</td>
                  <td className="mono">{s.monthly_fee ? `${(s.monthly_fee / 1000000).toFixed(1)}M` : '-'}</td>
                  <td className="mono">{s.latency_ms || 0}ms</td>
                  <td>
                    {s.status === 'DOWN' ? (
                      <button className="btn btn-sm btn-danger" disabled={busyDomain === s.domain} onClick={() => redeploy(s.domain)}>
                        {busyDomain === s.domain ? 'Deploying...' : 'Redeploy'}
                      </button>
                    ) : <span className="text-muted">OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Timeline de incidentes</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Dominio</th><th>Severidad</th><th>Estado</th><th>Inicio</th><th>Resolución</th><th>Acción</th></tr></thead>
            <tbody>
              {incidents.slice(0, 25).map((i: any) => (
                <tr key={i.id}>
                  <td className="mono">{i.domain}</td>
                  <td><span className="badge badge-error">{i.severity || 'P1'}</span></td>
                  <td><span className={`badge ${i.status === 'active' ? 'badge-down' : 'badge-up'}`}>{i.status}</span></td>
                  <td>{i.started_at ? new Date(i.started_at).toLocaleString('es-PY') : '-'}</td>
                  <td>{i.resolved_at ? new Date(i.resolved_at).toLocaleString('es-PY') : '-'}</td>
                  <td>
                    {i.status === 'active' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!i.acknowledged_at && <button className="btn btn-sm btn-secondary" onClick={() => ackIncident(i.id)}>ACK</button>}
                        <button className="btn btn-sm btn-primary" onClick={() => resolveIncident(i.id)}>Resolver</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!incidents.length && <tr><td colSpan={6} className="text-muted">Sin incidentes todavía</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}