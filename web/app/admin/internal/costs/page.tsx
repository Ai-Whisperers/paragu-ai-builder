'use client'

import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'

export default function CostsPage() {
  const [data, setData] = useState<any>(null)
  const [period, setPeriod] = useState('today')

  useEffect(() => {
    fetch('/admin/internal/api/costs')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ daily: [], total: 0, models: {} }))
  }, [])

  if (!data) return <div className="p-8"><div className="loading">Cargando...</div></div>

  const costs = data.daily || [
    { date: '2026-05-25', deepseek: 2.34, openrouter: 0.45, claude: 0, total: 2.79 },
    { date: '2026-05-24', deepseek: 2.12, openrouter: 0.52, claude: 0, total: 2.64 },
    { date: '2026-05-23', deepseek: 1.89, openrouter: 0.41, claude: 0.12, total: 2.42 },
    { date: '2026-05-22', deepseek: 2.01, openrouter: 0.38, claude: 0, total: 2.39 },
    { date: '2026-05-21', deepseek: 2.45, openrouter: 0.55, claude: 0, total: 3.00 },
    { date: '2026-05-20', deepseek: 1.78, openrouter: 0.42, claude: 0.08, total: 2.28 },
    { date: '2026-05-19', deepseek: 2.22, openrouter: 0.48, claude: 0, total: 2.70 },
  ]

  const maxVal = Math.max(...costs.map((d: any) => d.total))
  const monthTotal = costs.reduce((s: number, d: any) => s + d.total, 0)
  const modelBreakdown = data.models || {
    'deepseek-chat': { cost: 14.23, tokens: 2340000, calls: 1847 },
    'openrouter/gpt-4': { cost: 2.34, tokens: 89000, calls: 234 },
    'openrouter/claude-sonnet': { cost: 1.12, tokens: 45000, calls: 189 },
    'openrouter/gemini': { cost: 0.45, tokens: 120000, calls: 567 },
  }

  return (
    <div className="p-8">
      <div className="flex-between mb-4">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Costos AI</h1>
          <p className="page-subtitle" style={{ marginTop: 0 }}>Gasto en modelos de lenguaje</p>
        </div>
        <div className="flex gap-2">
          {['today', 'week', 'month'].map(p => (
            <button key={p} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPeriod(p)}>{p === 'today' ? 'Hoy' : p === 'week' ? 'Semana' : 'Mes'}</button>
          ))}
        </div>
      </div>

      <div className="grid-4 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="card"><div className="card-title">Total mes</div><div className="card-value">${monthTotal.toFixed(2)}</div><div className="card-sub">USD</div></div>
        <div className="card"><div className="card-title">DeepSeek</div><div className="card-value" style={{ fontSize: 20 }}>${costs.reduce((s: number, d: any) => s + (d.deepseek || 0), 0).toFixed(2)}</div><div className="card-sub">principal modelo</div></div>
        <div className="card"><div className="card-title">OpenRouter</div><div className="card-value" style={{ fontSize: 20 }}>${costs.reduce((s: number, d: any) => s + (d.openrouter || 0), 0).toFixed(2)}</div><div className="card-sub">GPT-4, Claude, Gemini</div></div>
        <div className="card"><div className="card-title">Proyección mensual</div><div className="card-value" style={{ fontSize: 20 }}>${(monthTotal * 30 / 7).toFixed(0)}</div><div className="card-sub">basado en 7 días</div></div>
      </div>

      <div className="card mb-4">
        <div className="card-title">Gasto diario (últimos 7 días)</div>
        <div style={{ marginTop: 16 }}>
          <div className="bar-chart">
            {costs.map((d: any, i: number) => {
              const h = Math.round((d.total / maxVal) * 80)
              return (
                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ height: `${h}px`, background: '#6366f1', borderRadius: '3px 3px 0 0', marginBottom: 4, minHeight: 2 }} title={`$${d.total.toFixed(2)}`} />
                  <span style={{ fontSize: 9, color: '#6b7280' }}>{new Date(d.date).toLocaleDateString('es-PY', { weekday: 'short' }).slice(0, 3)}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#6b7280' }}>7 días atrás</span>
            <span style={{ fontSize: 11, color: '#6b7280' }}>hoy</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Por modelo</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Modelo</th><th>Costo total</th><th>Tokens</th><th>Llamadas</th><th>Costo/1K tokens</th></tr></thead>
            <tbody>
              {Object.entries(modelBreakdown).map(([model, info]: [string, any]) => (
                <tr key={model}>
                  <td style={{ fontFamily: 'Menlo, monospace', fontSize: 12, color: '#6366f1' }}>{model}</td>
                  <td style={{ fontFamily: 'Menlo, monospace', fontSize: 12 }}>${info.cost.toFixed(2)}</td>
                  <td style={{ fontFamily: 'Menlo, monospace', fontSize: 12 }}>{(info.tokens / 1000000).toFixed(2)}M</td>
                  <td style={{ fontFamily: 'Menlo, monospace', fontSize: 12 }}>{info.calls.toLocaleString()}</td>
                  <td style={{ fontFamily: 'Menlo, monospace', fontSize: 12 }}>${(info.cost / (info.tokens / 1000000)).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}