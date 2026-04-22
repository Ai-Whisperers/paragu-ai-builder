# Nexa Paraguay — WhatsApp Integration
**Updated:** April 2026

> **Goal:** Convert website visitors via WhatsApp. Low effort, high conversion.

---

## 1. WhatsApp Business Setup

### Account Configuration

| Setting | Value |
|---------|-------|
| Business Name | Nexa Paraguay |
| Phone | +595 [see site content] |
| Category | Legal Services |
| Timezone | PY (UTC-3) |
| Language | ES primary, EN/NL/DE secondary |

### Profile

```
About: Residency & tax solutions in Paraguay. 10% IRE. 250+ clients.
Address: Asunción, Paraguay
Website: https://nexaparaguay.com
```

---

## 2. Quick Replies (Pre-set Responses)

### Greeting (Automated)

```
¡Hola! 👋

Gracias por contactarnos. Soy [Name] de Nexa Paraguay.

¿En qué puedo ayudarte hoy?

💬 Puedo responder preguntas sobre:
• Residency en Paraguay
• Optimización fiscal (10% IRE)
• Programas disponibles
• Proceso y timeline

📅 También puedes agendar una consulta gratuita aquí:
[Link to booking]

¿Te escribe en español, inglés, holandés o alemán?
```

### Initial Greeting (After Hours)

```
¡Hola! 👋

Gracias por tu mensaje. Nuestro equipo opera de lunes a viernes, 9:00-18:00 (hora Paraguay).

Respondemos todos los mensajes dentro de 24 horas hábiles.

📞 Para consultas urgentes:
• Tel: +595 [phone]
• Email: hello@nexaparaguay.com

Si ya conoces tu situación, puedes agendar aquí:
[Link to booking]

¡Gracias por tu interés en Paraguay!
```

### Qualification Questions

```
¡Perfecto! Para darte la mejor información, necesito conocer un poco tu situación:

1. ¿Cuál es tu país de residencia actual?
2. ¿Cuál es tu ingreso anual aproximado?
3. ¿Cuál es tu objetivo principal? (residencia fiscal, optimización de impuestos, negocio)
4. ¿Cuál es tu timeline? (pronto, este año, solo explorando)

También te invito a usar nuestra calculadora de ahorro fiscal:
[Link to calculator]

Mientras tanto, responderé tus preguntas. 😊
```

### Program Explanation

```
Nuestros programas:

📋 BASE — €2,900
   Residencia temporal + coordinación

💼 NEGOCIOS — €4,400+
   Arriba + empresa + RUC + cuenta bancaria

🚀 INVERSOR — €6,900+
   Arriba + SUACE + residencia permanente

Todos incluyen:
✓ 8-12 semanas timeline
✓ Un solo viaje
✓ Precio fijo (sin sorpresas)
✓ Equipo completo (abogados, contadores, notarios)

¿Cuál te interesa más? ¿O quieres que te ayude a elegir?
```

### Booking Confirmation

```
¡Excelente! 👇

Para confirmar tu consulta gratuita de 30 minutos:

📅 Agenda aquí:
[Calendly link]

Antes de la llamada, te enviamos un breve formulario para preparar temas.

¿Tienes alguna pregunta específica que quieras cubrir en la llamada?
```

### Calculator Follow-up

```
¡Hola! 👋

Vimos que usaste nuestra calculadora de ahorro fiscal. ¡Buenas noticias!

Según los datos que ingresaste, podrías ahorrar aproximadamente [X]€ al año con Paraguay.

💡 Esto es porque Paraguay tiene:
• 10% IRE (impuesto corporativo)
• Sistema territorial (ingresos extranjeros no gravan)
• No requiere inversión para residencia

¿Quieres hablar con un asesor sobre tu situación específica?
📅 Agenda aquí: [Calendly link]

O responde tus preguntas aquí. 😊
```

### Post-Consultation Follow-up

```
¡Hola! 👋

Gracias por nuestra llamada de hoy.

Resumen de lo que discutimos:
• Tu programa recomendado: [X]
• Inversión estimada: €[X]
• Timeline: [X] semanas

Próximos pasos:
1. Revisa los detalles del programa: [Link]
2. Si tienes preguntas, responde este mensaje
3. Si estás listo,firmamos el acuerdo y comenzamos

¿Alguna pregunta mientras lo reflexionas?
```

### Final Nudge (No Response)

```
¡Hola! 👋

Solo pasaba a recordar que estamos aquí cuando estés listo/a.

Resolver Paraguay tu situación fiscal no es una decisión pequeña, pero los números son claros:
• 10% vs 40-50% en impuestos
• Sistema territorial
• Residency en 8-12 semanas

📅 Agenda tu consulta cuando quieras:
[Calendly link]

¡Saludos!
[Nexa Paraguay]
```

---

## 3. Click-to-Chat Button

### Implementation Status: ✅ DONE

The WhatsApp floating button is already implemented at:
```
web/components/sections/whatsapp-float.tsx
```

**Features:**
- ✅ Multi-language support (ES/EN/NL/DE/PT)
- ✅ Context-aware messages (home, programas, proceso, calculadora, contacto)
- ✅ Analytics tracking (`whatsapp_cta_click` event)
- ✅ Configured on all major pages via `pages/*.json`
- ✅ Phone number in `site.json`: `595982515138`

**Usage:**
```tsx
<WhatsAppFloat 
  phone="595982515138"
  __locale="es"
  __context="home" // auto-selects contextual message
  __track={true}
/>
```

**Context Messages:**
| Page Context | Message |
|-------------|---------|
| home | Calculator follow-up |
| programas | Program info request |
| proceso | Process questions |
| calculadora | Post-calculator inquiry |
| contacto | Booking request |

### CTA Options (Pre-filled Message)

| Context | Pre-filled Message |
|---------|-------------------|
| General | "Hola! Estoy interesado en información sobre Paraguay" |
| Calculator | "Hola! Acabo de usar la calculadora y quiero saber más" |
| Specific program | "Hola! Quiero información del programa [BASE/NEGOCIOS/INVERSOR]" |
| Tax question | "Hola! Tengo una pregunta específica sobre impuestos" |
| Callback | "Hola! Prefiero que me llamen" |

---

## 4. Labels & Pipeline

### WhatsApp Business Labels

| Label | Color | Use |
|-------|-------|-----|
| 🔴 Hot | Red | Ready to book / high intent |
| 🟡 Warm | Yellow | In conversation / nurturing |
| 🔵 Cold | Blue | New lead / not responded |
| ✅ Closed | Green | Converted to client |
| 📅 Booked | Purple | Has consultation booked |
| ❌ Not Interested | Gray | Explicit no |

### Automation Rules

```
1. New contact → Label "Cold"
2. Replied within 1 hour → Label "Warm"  
3. Booked consultation → Label "Booked"
4. Closed to client → Label "Closed" + move to CRM
5. No response in 48h → Add to email nurture sequence
6. "Stop" / "No thanks" → Label "Not Interested" + suppress
```

---

## 5. Analytics Events

### Track

| Event | When |
|-------|------|
| `whatsapp_message_received` | Incoming message |
| `whatsapp_quick_reply_sent` | Quick reply used |
| `whatsapp_cta_clicked` | Clicked Calendly link |
| `whatsapp_booked` | Consultation booked via WhatsApp |
| `whatsapp_response_time` | Time from lead to first response |

### Response Time Targets

| Lead Type | Target Response |
|-----------|----------------|
| Hot (booked call) | Within 15 minutes |
| Warm | Within 1 hour |
| Cold | Within 4 hours |

---

## 6. Multi-Language Support

### Language Detection

```
If message contains NL keywords → Reply in Dutch
If message contains DE keywords → Reply in German  
If message contains EN keywords → Reply in English
Else → Reply in Spanish
```

### NL Keywords
```
belasting, belastingen, Niederlande, Nederlands, emigreren, exitbelasting, box 3
```

### DE Keywords
```
Steuer, Deutschland, emigration, Steuern,exitsteuer, deutsche
```

### EN Keywords
```
tax, residency, moving, Netherlands, Belgium, Germany, process
```

---

## 7. Away Messages

### Business Hours

```
Mon-Fri: 9:00-18:00 PY (UTC-3)
```

### Away Message (Weekend)

```
¡Hola! 👋

Gracias por tu mensaje. Es fin de semana y nuestro equipo descansa (como todo el mundo 😄).

Respondemos el lunes a primera hora.

💡 Mientras tanto:
• Mira nuestra calculadora: [Link]
• Lee sobre nuestros programas: [Link]
• Preguntas frecuentes: [Link]

¡Que tengas un buen fin de semana! 👋
```

### Away Message (Night)

```
¡Hola! 👋

Gracias por tu mensaje. Ya es de noche en Paraguay (son las [TIME] hrs).

Nuestro equipo responde de lunes a viernes, 9:00-18:00 PY.

Si tienes prisa, escríbenos un email: hello@nexaparaguay.com

¡Hasta pronto! 👋
```

---

## 8. Integration with CRM

### Flow

```
WhatsApp → Webhook → Supabase
           ↓
     Lead created/updated
           ↓
     Tag: whatsapp_lead
           ↓
     Email sequence triggered
```

### Supabase Schema

```sql
CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY,
  phone VARCHAR(20),
  lead_id UUID REFERENCES leads(id),
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  status 'active' | 'closed',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID,
  direction 'inbound' | 'outbound',
  content TEXT,
  quick_reply_used BOOLEAN,
  created_at TIMESTAMPTZ
);
```

---

## 9. Campaign Tracking

### UTM Parameters

```
Source: whatsapp
Medium: chat
Campaign: [specific_campaign]
Content: [cta_button_variant]
```

### Attribution

```
Lead source = whatsapp
  → Attribution: WhatsApp
  → Revenue: attributed to WhatsApp conversions
```

---

*Document Version: 1.0 — Updated April 2026*
*For Nexa Paraguay marketing team*
