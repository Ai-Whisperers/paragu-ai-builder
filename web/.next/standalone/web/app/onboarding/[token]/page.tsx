'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function OnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState('')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    businessName: '', tagline: '', phone: '', whatsapp: '', email: '',
    address: '', city: '', instagram: '', facebook: '',
    services: [{ name: '', description: '', price: '' }],
    hours: { 'Lunes a Viernes': '09:00 - 19:00', 'Sábado': '09:00 - 17:00' },
  })

  useEffect(() => { params.then(p => setToken(p.token)) }, [params])

  const update = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }))

  const addService = () => setForm(f => ({ ...f, services: [...f.services, { name: '', description: '', price: '' }] }))

  const submit = async () => {
    await fetch('/api/onboarding/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...form }),
    })
    setStep(5)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <Container className="max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)]">Configurá tu sitio web</h1>
          <p className="text-[var(--text-muted)] mt-2">Completá estos datos y tendrás tu sitio listo en 24 horas</p>
        </div>

        {step === 1 && (
          <Card><CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">1. Información básica</h2>
            <input className="w-full border rounded-lg p-3" placeholder="Nombre del negocio" value={form.businessName} onChange={e => update('businessName', e.target.value)} />
            <input className="w-full border rounded-lg p-3" placeholder="Eslogan o frase corta" value={form.tagline} onChange={e => update('tagline', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full border rounded-lg p-3" placeholder="Teléfono" value={form.phone} onChange={e => update('phone', e.target.value)} />
              <input className="w-full border rounded-lg p-3" placeholder="WhatsApp" value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} />
            </div>
            <input className="w-full border rounded-lg p-3" placeholder="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
            <input className="w-full border rounded-lg p-3" placeholder="Dirección" value={form.address} onChange={e => update('address', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input className="w-full border rounded-lg p-3" placeholder="Ciudad" value={form.city} onChange={e => update('city', e.target.value)} />
              <input className="w-full border rounded-lg p-3" placeholder="Instagram (@usuario)" value={form.instagram} onChange={e => update('instagram', e.target.value)} />
            </div>
            <Button onClick={() => setStep(2)} className="w-full">Continuar</Button>
          </CardContent></Card>
        )}

        {step === 2 && (
          <Card><CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">2. Servicios</h2>
            {form.services.map((s, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <input className="w-full border rounded-lg p-2 text-sm" placeholder="Nombre del servicio" value={s.name} onChange={e => { const sv = [...form.services]; sv[i].name = e.target.value; update('services', sv) }} />
                <input className="w-full border rounded-lg p-2 text-sm" placeholder="Descripción breve" value={s.description} onChange={e => { const sv = [...form.services]; sv[i].description = e.target.value; update('services', sv) }} />
                <input className="w-full border rounded-lg p-2 text-sm" placeholder="Precio (ej: Gs. 50.000)" value={s.price} onChange={e => { const sv = [...form.services]; sv[i].price = e.target.value; update('services', sv) }} />
              </div>
            ))}
            <button onClick={addService} className="text-sm text-[var(--primary)]">+ Agregar otro servicio</button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>← Atrás</Button>
              <Button onClick={() => setStep(3)} className="flex-1">Continuar</Button>
            </div>
          </CardContent></Card>
        )}

        {step === 3 && (
          <Card><CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">3. Horarios</h2>
            {Object.entries(form.hours).map(([day, time]) => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-40 text-sm font-medium">{day}</span>
                <input className="flex-1 border rounded-lg p-2 text-sm" value={time as string} onChange={e => update('hours', { ...form.hours, [day]: e.target.value })} />
              </div>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>← Atrás</Button>
              <Button onClick={() => setStep(4)} className="flex-1">Continuar</Button>
            </div>
          </CardContent></Card>
        )}

        {step === 4 && (
          <Card><CardContent className="p-6 space-y-4 text-center">
            <h2 className="text-xl font-semibold">4. Casi listo! ✅</h2>
            <p className="text-[var(--text-muted)]">Revisá que todos los datos sean correctos y confirmá para recibir tu sitio web.</p>
            <div className="bg-[var(--surface)] rounded-lg p-4 text-left text-sm space-y-1">
              <p><strong>Negocio:</strong> {form.businessName}</p>
              <p><strong>Teléfono:</strong> {form.phone}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Dirección:</strong> {form.address}, {form.city}</p>
              <p><strong>Instagram:</strong> {form.instagram}</p>
              <p><strong>Servicios:</strong> {form.services.filter(s => s.name).length}</p>
            </div>
            <Button onClick={submit} className="w-full">Confirmar y recibir mi sitio</Button>
            <Button variant="outline" onClick={() => setStep(3)} className="w-full">← Editar</Button>
          </CardContent></Card>
        )}

        {step === 5 && (
          <Card><CardContent className="p-6 space-y-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold">Recibimos tus datos!</h2>
            <p className="text-[var(--text-muted)]">En las próximas 24 horas tendrás tu sitio web listo. Te vamos a notificar por WhatsApp cuando esté online.</p>
          </CardContent></Card>
        )}
      </Container>
    </div>
  )
}
