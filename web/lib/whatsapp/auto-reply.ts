const COMMON_QUESTIONS: Array<{ pattern: RegExp; getReply: (biz: Record<string, unknown>) => string }> = [
  {
    pattern: /horario|horarios|abren|cierran|abierto/i,
    getReply: (biz) => {
      const hours = biz.hours as Record<string, string> | null
      if (!hours) return 'Nuestros horarios de atención están publicados en nuestro sitio web.'
      const lines = Object.entries(hours).map(([day, time]) => `  • ${day}: ${time}`).join('\n')
      return `📍 *Horarios de atención* ${biz.name ? `— ${biz.name}` : ''}\n\n${lines}\n\nPodés ver más detalles en nuestro sitio web.`
    },
  },
  {
    pattern: /precio|precios|cuánto|cuesta|valor|tarifa/i,
    getReply: (biz) => {
      return `Los precios y servicios de ${biz.name || 'nuestro negocio'} están disponibles en nuestro sitio web. Visitános para ver la lista completa con precios actualizados.`
    },
  },
  {
    pattern: /dirección|direccion|ubicación|ubicacion|dónde|donde estás/i,
    getReply: (biz) => {
      const loc = biz.location as Record<string, string> | undefined
      if (loc?.address) return `📍 Estamos en ${loc.address}, ${loc.city || 'Asunción'}.`
      if (biz.address) return `📍 ${biz.address}`
      return 'Nuestra dirección está publicada en nuestro sitio web.'
    },
  },
  {
    pattern: /teléfono|telefono|whatsapp|contacto|llamar|llamarte/i,
    getReply: (biz) => {
      if (biz.whatsapp) return `📱 Podés contactarnos al ${biz.whatsapp}.`
      if (biz.phone) return `📱 Nuestro teléfono: ${biz.phone}.`
      return 'Nuestros datos de contacto están en nuestro sitio web.'
    },
  },
  {
    pattern: /reservar|turno|cita|agendar|agendá|reserva/i,
    getReply: (biz) => {
      const wa = biz.whatsapp as string
      if (wa) return `📅 Para reservar un turno, escribinos y te confirmamos disponibilidad. O visitá nuestro sitio web para más información.`
      return '📅 Para reservar un turno, visitá nuestro sitio web o contactanos por este medio.'
    },
  },
  {
    pattern: /sitio|web|página|pagina|demo|preview/i,
    getReply: (biz) => {
      const slug = biz.slug as string
      if (slug) return `🌐 Nuestro sitio web: https://paragu-ai.com/s/es/${slug}`
      return '🌐 Nuestro sitio web está disponible online.'
    },
  },
  {
    pattern: /gracias|graciass|muchas gracias|thanks/i,
    getReply: () => '¡De nada! 😊 Ante cualquier consulta, estamos acá para ayudarte.',
  },
]

export function getAutoReply(message: string, business: Record<string, unknown>): string | null {
  for (const q of COMMON_QUESTIONS) {
    if (q.pattern.test(message)) {
      return q.getReply(business)
    }
  }
  return null
}

export function buildAutoReplySystemPrompt(instanceName: string): string {
  return `Eres un asistente de atención al cliente para negocios en Paraguay. 
Respondes SOLO preguntas sobre horarios, precios, dirección, teléfono, reservas y el sitio web del negocio.

REGLAS:
- Respondé siempre en español paraguayo, cortés y breve.
- Si te preguntan algo que no sabés, decí "Consultá con el negocio directamente para más detalles."
- NO inventes información que no tengas.
- NO vendas ni promociones.
- Máximo 3 oraciones por respuesta.`
}
