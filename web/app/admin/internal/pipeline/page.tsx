'use client'

import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'

const stages = ['contactado', 'demo', 'negociando', 'ganado', 'perdido']
const stageOrder: Record<string, number> = { contactado: 0, demo: 1, negociando: 2, ganado: 3, perdido: 4 }
const stageColor: Record<string, string> = {
  contactado: '#6b7280', demo: '#3b82f6', negociando: '#f59e0b', ganado: '#22c55e', perdido: '#ef4444',
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/admin/internal/api/pipeline')
      .then(r => r.json())
      .then(d => setLeads(d.leads || []))
      .catch(() => setLeads([
        { id: 1, name: 'Restaurant San Antonio', source: 'WhatsApp cold outreach', contact: '+595981...', stage: 'contactado', last_update: '2026-05-24', notes: 'Interesado, quiere demo' },
        { id: 2, name: 'Gimnasio PowerFit', source: 'Referido Kiki', contact: '+595981...', stage: 'demo', last_update: '2026-05-23', notes: 'Demo agendada para martes' },
        { id: 3, name: 'Peluquería Estilo', source: 'Instagram', contact: '+595981...', stage: 'negociando', last_update: '2026-05-22', notes: 'Cerrando precio, espera respuesta' },
        { id: 4, name: 'Superspuma', source: 'Leads tracker', contact: 'ivan@paragu-ai.com', stage: 'negociando', last_update: '2026-05-25', notes: 'EN PRIORIDAD - Ivan wants this closed' },
        { id: 5, name: 'Estudio Jurídico Lopez', source: 'WhatsApp cold outreach', contact: '+595981...', stage: 'perdido', last_update: '2026-05-20', notes: 'Presupuesto muy alto para ellos' },
        { id: 6, name: 'Café Del Valle', source: 'Google Maps', contact: '+595981...', stage: 'ganado', last_update: '2026-05-18', notes: 'Contrató plan Profesional' },
      ]))
  }, [])

  const filtered = leads.filter((l: any) => {
    const matchSearch = l.name.toLowerCase().includes(filter.toLowerCase()) || (l.source || '').toLowerCase().includes(filter.toLowerCase())
    const matchStage = stageFilter === 'all' || l.stage === stageFilter
    return matchSearch && matchStage
  })

  const countByStage = (s: string) => leads.filter((l: any) => l.stage === s).length
  const potencialRevenue = leads.filter((l: any) => ['demo', 'negociando'].includes(l.stage)).length * 1200000

  return (
    <div className="p-8">
      <div className="flex-between mb-4">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Pipeline de ventas</h1>
          <p className="page-subtitle" style={{ marginTop: 0 }}>Seguimiento de leads y negociaciones</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Agregar lead</button>
      </div>

      <div className="grid-5 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {stages.map(s => (
          <div key={s} className="card" style={{ padding: '14px', cursor: 'pointer' }} onClick={() => setStageFilter(stageFilter === s ? 'all' : s)}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: stageColor[s], marginBottom: 6 }}>{s}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stageColor[s] }}>{countByStage(s)}</div>
          </div>
        ))}
      </div>

      <div className="card mb-4" style={{ background: '#1a1a2e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Potencial de ingresos</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fbbf24', marginTop: 4 }}>
              {filtered.filter((l: any) => ['demo', 'negociando'].includes(l.stage)).length} leads × Gs 1.2M = <span style={{ fontSize: 18 }}>{(potencialRevenue / 1000000).toFixed(1)}M Gs</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>en stage demo + negociando</div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input className="search-bar" placeholder="Buscar lead..." value={filter} onChange={e => setFilter(e.target.value)} />
        <select className="form-select" style={{ width: 160 }} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="all">Todos</option>
          {stages.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Lead</th><th>Fuente</th><th>Contacto</th><th>Stage</th><th>Última actualización</th><th>Notas</th></tr></thead>
            <tbody>
              {filtered.sort((a: any, b: any) => (stageOrder[a.stage] ?? 5) - (stageOrder[b.stage] ?? 5)).map((l: any, i: number) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{l.name}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{l.source}</td>
                  <td style={{ fontFamily: 'Menlo, monospace', fontSize: 11, color: '#6366f1' }}>{l.contact}</td>
                  <td><span className="badge" style={{ background: stageColor[l.stage] + '22', color: stageColor[l.stage], textTransform: 'capitalize' }}>{l.stage}</span></td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{l.last_update ? new Date(l.last_update).toLocaleDateString('es-PY') : '-'}</td>
                  <td style={{ fontSize: 12, maxWidth: 220, color: '#9ca3af' }}>{l.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Agregar lead</div>
            <form onSubmit={async e => {
              e.preventDefault()
              const fd = new FormData(e.target)
              const data = Object.fromEntries(fd.entries())
              const newLead = { id: Date.now(), ...data, last_update: new Date().toISOString().slice(0, 10) }
              setLeads(prev => [...prev, newLead])
              setShowModal(false)
            }}>
              <div className="form-group"><label className="form-label">Nombre / Empresa</label><input name="name" className="form-input" required /></div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group"><label className="form-label">Fuente</label><input name="source" className="form-input" placeholder="WhatsApp, Instagram, referido..." /></div>
                <div className="form-group"><label className="form-label">Contacto</label><input name="contact" className="form-input" placeholder="+595981..." /></div>
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group"><label className="form-label">Stage</label><select name="stage" className="form-select"><option value="contactado">Contactado</option><option value="demo">Demo</option><option value="negociando">Negociando</option><option value="ganado">Ganado</option><option value="perdido">Perdido</option></select></div>
                <div className="form-group"><label className="form-label">Última actualización</label><input name="last_update" type="date" className="form-input" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Notas</label><textarea name="notes" className="form-input" rows={3} /></div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button><button type="submit" className="btn btn-primary">Agregar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}