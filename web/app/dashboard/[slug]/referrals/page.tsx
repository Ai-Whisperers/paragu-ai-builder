'use client'

import { useEffect, useState } from 'react'
import { Gift, Copy, Check, ExternalLink, Users } from 'lucide-react'

interface Referral {
  id: string
  referred_name: string
  referred_email: string
  code: string
  status: string
  created_at: string
  redeemed_at: string | null
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [lastLink, setLastLink] = useState('')
  const [copied, setCopied] = useState(false)

  const load = () => {
    fetch('/api/portal/referrals')
      .then((r) => r.json())
      .then((d) => { setReferrals(d.referrals ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(load, [])

  const handleRefer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSent(false)
    const res = await fetch('/api/portal/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referredEmail: email, referredName: name }),
    })
    const data = await res.json()
    if (data.ok) {
      setSent(true)
      setLastLink(data.shareLink)
      setEmail('')
      setName('')
      load()
    } else {
      setError(data.error || 'Error al referir')
    }
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Gift className="h-6 w-6 text-amber-500" />
          Programa de referidos
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Invitá a otros negocios y ayudalos a tener su sitio web
        </p>
      </div>

      <div className="rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50 p-6">
        <h2 className="font-semibold text-gray-900 mb-2">¿Cómo funciona?</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>1. Invitá a otro negocio a tener su sitio con ParaguAI</li>
          <li>2. Cuando se registren, ambos reciben un mes gratis</li>
          <li>3. Sin límite de referidos — cuantos más invites, más beneficios</li>
        </ul>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Invitar por correo</h2>
        <form onSubmit={handleRefer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {sent && (
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-700 mb-2">¡Invitación enviada! Compartí este link:</p>
              <div className="flex gap-2">
                <input type="text" readOnly value={lastLink}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs bg-gray-50" />
                <button type="button" onClick={() => copyLink(lastLink)}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
          <button type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Enviar invitación
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Mis referidos</h2>
        </div>
        {referrals.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">Aún no invitaste a nadie.</p>
          </div>
        ) : (
          <div className="divide-y">
            {referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{r.referred_name}</p>
                  <p className="text-sm text-gray-500">{r.referred_email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  r.status === 'redeemed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {r.status === 'redeemed' ? 'Completado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
