import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    leads: [
      { id: 1, name: 'Restaurant San Antonio', source: 'WhatsApp cold outreach', contact: '+595981...', stage: 'contactado', last_update: '2026-05-24', notes: 'Interesado, quiere demo' },
      { id: 2, name: 'Gimnasio PowerFit', source: 'Referido Kiki', contact: '+595981...', stage: 'demo', last_update: '2026-05-23', notes: 'Demo agendada para martes' },
      { id: 3, name: 'Peluquería Estilo', source: 'Instagram', contact: '+595981...', stage: 'negociando', last_update: '2026-05-22', notes: 'Cerrando precio, espera respuesta' },
      { id: 4, name: 'Superspuma', source: 'Leads tracker', contact: 'ivan@paragu-ai.com', stage: 'negociando', last_update: '2026-05-25', notes: 'EN PRIORIDAD - Ivan wants this closed' },
      { id: 5, name: 'Estudio Jurídico Lopez', source: 'WhatsApp cold outreach', contact: '+595981...', stage: 'perdido', last_update: '2026-05-20', notes: 'Presupuesto muy alto para ellos' },
      { id: 6, name: 'Café Del Valle', source: 'Google Maps', contact: '+595981...', stage: 'ganado', last_update: '2026-05-18', notes: 'Contrató plan Profesional' },
    ]
  })
}