'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Shield, UserCog } from 'lucide-react'

interface TeamUser {
  id: string
  email: string
  name: string
  role: string
  last_login_at: string | null
  invited_at: string | null
}

export default function TeamPage() {
  const [users, setUsers] = useState<TeamUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = () => {
    fetch('/api/portal/invite')
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(loadUsers, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSent(false)
    const res = await fetch('/api/portal/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })
    const data = await res.json()
    if (data.ok) {
      setSent(true)
      setEmail('')
      setName('')
      loadUsers()
      setTimeout(() => setShowInvite(false), 1500)
    } else {
      setError(data.error || 'Error al invitar')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="mt-1 text-sm text-gray-500">
            {users.length} miembro{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Invitar
        </button>
      </div>

      {showInvite && (
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Invitar miembro del equipo</h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {sent && <p className="text-sm text-green-600">Invitación enviada correctamente</p>}
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Enviar invitación
            </button>
          </form>
        </div>
      )}

      <div className="rounded-xl border bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aún no hay miembros del equipo. Invitá a tus colaboradores.
          </div>
        ) : (
          <div className="divide-y">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {u.role === 'owner' ? <Shield className="h-3 w-3" /> : <UserCog className="h-3 w-3" />}
                    {u.role === 'owner' ? 'Dueño' : 'Gestor'}
                  </span>
                  {u.last_login_at ? (
                    <span className="text-xs text-gray-400">
                      Último acceso: {new Date(u.last_login_at).toLocaleDateString('es-PY')}
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600">Sin acceso aún</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
