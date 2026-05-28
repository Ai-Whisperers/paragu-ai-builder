// NOTE: layout.tsx provides the sidebar shell. Do NOT import Layout here.
'use client'

import { useState, useEffect } from 'react'

const PLAN_COLOR: Record<string, string> = { 'Autónomo': '#6366f1', 'Profesional': '#8b5cf6', 'Empresa': '#ec4899' }
const STATUS_COLOR: Record<string, string> = { active: 'badge-up', trial: 'badge-warn', paused: 'badge-redirect', cancelled: 'badge-error', deleted: 'badge-error' }

function toGs(val: number): string {
  if (!val || val <= 0) return '-'
  const m = val / 1000000
  return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const now = new Date()
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

interface Client {
  id: number
  name: string
  domain: string
  plan: string
  status: string
  monthly_fee: number
  billing_cycle_day: number
  next_billing: string
  trial_end_date: string
  notes: string
  siteStatus?: string
}

function ClientRow({ c, onEdit, onDelete }: { c: Client; onEdit: (c: Client) => void; onDelete: (id: number) => void }) {
  const trialDays = c.trial_end_date ? daysUntil(c.trial_end_date) : null
  const overdueDays = (c as any).daysSinceDue > 0 ? (c as any).daysSinceDue : null

  return (
    <tr>
      <td style={{ fontWeight: 600, color: '#fff' }}>{c.name}</td>
      <td style={{ fontFamily: 'Menlo, monospace', fontSize: 12 }}>
        {c.domain ? (
          <a href={`https://${c.domain}`} target="_blank" rel="noopener" style={{ color: '#6366f1' }}>{c.domain}</a>
        ) : <span style={{ color: '#4a5568' }}>—</span>}
      </td>
      <td><span className="badge" style={{ background: (PLAN_COLOR[c.plan] || '#6366f1') + '22', color: PLAN_COLOR[c.plan] || '#6366f1' }}>{c.plan}</span></td>
      <td><span className={`badge ${STATUS_COLOR[c.status] || 'badge-redirect'}`}>{c.status}{c.status === 'trial' && trialDays !== null && trialDays <= 7 && <span style={{ marginLeft: 5, opacity: 0.8 }}>· {trialDays}d</span>}</span></td>
      <td style={{ fontFamily: 'Menlo, monospace', fontSize: 12 }}>{c.monthly_fee > 0 ? toGs(c.monthly_fee) : <span style={{ color: '#4a5568' }}>—</span>}</td>
      <td style={{ fontSize: 12 }}>
        {c.trial_end_date ? (
          <span style={{ color: trialDays !== null && trialDays <= 7 ? '#fbbf24' : '#6b7280' }}>{c.trial_end_date}{trialDays !== null && <span style={{ marginLeft: 4 }}>({trialDays > 0 ? `${trialDays}d` : 'expiró'})</span>}</span>
        ) : c.next_billing ? (
          <span style={{ color: overdueDays ? '#f87171' : '#6b7280' }}>{c.next_billing}{overdueDays && <span style={{ marginLeft: 4 }}>({overdueDays}d v.)</span>}</span>
        ) : <span style={{ color: '#4a5568' }}>—</span>}
      </td>
      <td style={{ fontSize: 11, maxWidth: 180, color: '#6b7280' }}>
        {c.notes ? <span title={c.notes}>{c.notes.slice(0, 60)}{c.notes.length > 60 ? '…' : ''}</span> : <span style={{ color: '#4a5568' }}>—</span>}
      </td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(c)}>Editar</button>
          {c.status !== 'deleted' && <button className="btn btn-sm btn-danger" onClick={() => onDelete(c.id)} style={{ opacity: 0.7 }}>✕</button>}
        </div>
      </td>
    </tr>
  )
}

function ClientModal({ client, onSave, onClose }: { client: Client | null; onSave: (form: any) => void; onClose: () => void }) {
  const [form, setForm] = useState(client || {
    name: '', domain: '', plan: 'Profesional', status: 'trial',
    monthly_fee: 1200000, next_billing: '', trial_end_date: '', notes: '', billing_cycle_day: 1,
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{client?.id ? 'Editar cliente' : 'Agregar cliente'}</div>
        <form onSubmit={async e => { e.preventDefault(); onSave(form); onClose() }}>
          <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label className="form-label">Dominio</label><input className="form-input" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} placeholder="ejemplo.paragu-ai.com" /></div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group"><label className="form-label">Plan</label><select className="form-select" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}><option>Autónomo</option><option>Profesional</option><option>Empresa</option></select></div>
            <div className="form-group"><label className="form-label">Estado</label><select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Activo</option><option value="trial">Trial</option><option value="paused">Pausado</option><option value="cancelled">Cancelado</option><option value="deleted">Eliminado</option></select></div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group"><label className="form-label">Fee mensual (Gs)</label><input className="form-input" type="number" value={form.monthly_fee} onChange={e => setForm({ ...form, monthly_fee: Number(e.target.value) })} /></div>
            <div className="form-group"><label className="form-label">Día facturación (1-28)</label><input className="form-input" type="number" min="1" max="28" value={form.billing_cycle_day} onChange={e => setForm({ ...form, billing_cycle_day: Number(e.target.value) })} /></div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group"><label className="form-label">Fecha fin trial</label><input className="form-input" type="date" value={form.trial_end_date} onChange={e => setForm({ ...form, trial_end_date: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Próximo pago</label><input className="form-input" type="date" value={form.next_billing} onChange={e => setForm({ ...form, next_billing: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Notas</label><textarea className="form-input" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="btn btn-primary">Guardar</button></div>
        </form>
      </div>
    </div>
  )
}

async function getClients() {
  const res = await fetch('/admin/internal/api/clients')
  if (!res.ok) return null
  return res.json()
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any>(null)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [msg, setMsg] = useState('')

  const load = () => getClients().then(setClients).catch(() => {})

  useEffect(() => { load() }, [])

  if (!clients) return (
    <div className="p-8"><div className="loading">Cargando...</div></div>
  )

  const filtered = (clients.clients as Client[]).filter((c: Client) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (planFilter !== 'all' && c.plan !== planFilter) return false
    if (!filter) return true
    const q = filter.toLowerCase()
    return (c.name || '').toLowerCase().includes(q) || (c.domain || '').toLowerCase().includes(q)
  })

  const activeClients = (clients.clients as Client[]).filter((c: Client) => c.status === 'active')
  const trialClients = (clients.clients as Client[]).filter((c: Client) => c.status === 'trial')
  const totalMrr = activeClients.reduce((s: number, c: Client) => s + Number(c.monthly_fee || 0), 0)
  const downSites = (clients.clients as Client[]).filter((c: Client) => c.siteStatus === 'DOWN').length

  return (
    <div className="p-8">
      <div className="flex-between mb-4">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Clientes</h1>
          <p className="page-subtitle" style={{ marginTop: 0 }}>{clients.total} total · {clients.active} activos · {clients.trial} trials · {clients.overdue || 0} vencidos</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingClient(null); setShowModal(true) }}>+ Agregar cliente</button>
      </div>

      {msg && <div className="alert-bar mb-4">{msg}</div>}

      <div className="grid-4 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="card"><div className="card-title">Clientes activos</div><div className="card-value">{clients.active}</div><div className="card-sub">paying</div></div>
        <div className="card"><div className="card-title">Trial</div><div className="card-value" style={{ color: '#fbbf24' }}>{clients.trial}</div><div className="card-sub">{clients.trialEndingSoon || 0} expiran ≤7d</div></div>
        <div className="card"><div className="card-title">Ingresos mensuales</div><div className="card-value" style={{ fontSize: 22 }}>{toGs(totalMrr)} Gs</div><div className="card-sub">active clients only</div></div>
        <div className="card"><div className="card-title">Sites caídos</div><div className="card-value" style={{ color: downSites > 0 ? '#f87171' : '#6ee7b7' }}>{downSites}</div><div className="card-sub">necesitan atención</div></div>
      </div>

      <div className="flex gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
        <input className="search-bar" placeholder="Buscar por nombre o dominio..." value={filter} onChange={e => setFilter(e.target.value)} />
        <select className="form-select" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="all">Todos los estados</option><option value="active">Activos</option><option value="trial">Trial</option><option value="paused">Pausados</option><option value="cancelled">Cancelados</option></select>
        <select className="form-select" style={{ width: 140 }} value={planFilter} onChange={e => setPlanFilter(e.target.value)}><option value="all">Todos los planes</option><option value="Autónomo">Autónomo</option><option value="Profesional">Profesional</option><option value="Empresa">Empresa</option></select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Cliente</th><th>Dominio</th><th>Plan</th><th>Estado</th><th>Fee/mes</th><th>Vencimiento</th><th>Notas</th><th>Acción</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: '#4a5568', padding: 24 }}>No hay clientes que coincidan</td></tr>}
              {filtered.map((c: Client) => (
                <ClientRow key={c.id} c={c} onEdit={(client) => { setEditingClient(client); setShowModal(true) }}
                  onDelete={async (id) => { if (!confirm('¿Eliminar este cliente?')) return; await fetch(`/admin/internal/api/clients/${id}`, { method: 'DELETE' }).catch(() => {}); load() }} />
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 12, color: '#4a5568', padding: '8px 0 0', borderTop: '1px solid var(--line-soft)', marginTop: 8 }}>{filtered.length} de {clients.clients.length} clientes mostrados</div>
      </div>

      {showModal && (
        <ClientModal client={editingClient} onClose={() => { setShowModal(false); setEditingClient(null) }}
          onSave={async (form) => {
            try {
              if (editingClient?.id) {
                await fetch(`/admin/internal/api/clients/${editingClient.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
                setMsg('Cliente actualizado')
              } else {
                await fetch('/admin/internal/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
                setMsg('Cliente agregado')
              }
              setTimeout(() => setMsg(''), 3000)
              load()
            } catch { setMsg('Error al guardar') }
          }} />
      )}
    </div>
  )
}