# Demo give-away script · prospect calls

> The exact phrasing for "let me build you a demo for free, no commitment".
> Sequenced for a WhatsApp / phone call. Per-vertical hooks at the bottom.
>
> Closes BUG_HUNT_500 #492.

## Why give the demo away

A static demo of *their* business name + their vertical is the fastest
way to bypass abstract objections ("I can't picture it"). Cost to us is
near zero (the engine generates it). Conversion lift is large because
they've now seen their own brand on a working site.

**Hard rule:** the giveaway demo points all CTAs at the ParaguAI sales
WhatsApp (`+595 981 324 569`), not at the prospect. The DemoBadge stays
on. Memory `payments-architecture.md` and `real-clients.md` track which
slugs are demos vs real.

## The script

### Opener (WhatsApp message or first 30s of a call)

> "Hola [Nombre], soy Iván de ParaguAI. Vi que tenés [negocio]. Te puedo
> armar un demo gratis de cómo te quedaría el sitio web — sin compromiso,
> sin pago. Si te gusta, vemos pasar a real. Si no, te queda el demo
> guardado por si lo necesitás más adelante. ¿Te interesa que te lo arme?"

**Why it works:** offers value first, no commitment, exit ramp built in.

### If they say "sí, dale"

> "Buenísimo. Necesito 4 cosas: nombre del negocio, en qué barrio/ciudad
> estás, tus 3-5 servicios principales con precio aprox, y un teléfono /
> WhatsApp si querés que aparezca. Te lo mando por WhatsApp en 30 minutos."

**Don't ask for:** logo files, photos, hours, social media. Get the
minimum viable info; we fill the rest with placeholders that look fine.

### If they hesitate ("no sé qué decirte")

> "Tranqui, te puedo armar uno con datos genéricos para que veas el
> formato. Si te gusta, después le ponemos tus datos reales. ¿Dale?"

Lower the friction further. Generic demo also works as a conversation
starter.

### If they push back on price ("¿y el precio?")

> "El demo es gratis. Si te gusta y querés pasarlo a sitio real con tu
> dominio propio, son [Gs 650K setup + Gs 250K/mes] en plan Profesional.
> Pero hablamos de eso *después* que veas el demo, ¿te parece?"

**Anchor on value first, not price.** Price after they've seen the demo
is much easier than price before.

## Delivering the demo

### Turnaround

- Aim for <2 hours from "sí dale" to "acá está el link".
- If you can't, send "lo estoy armando, te lo mando esta tarde" within 10
  minutes so they don't think you ghosted.

### What to send

```
Hola [Nombre], acá está tu demo:
https://paragu-ai.com/[slug]

Quedó así con los datos básicos. Si querés algún cambio (texto, color,
servicios) decime y lo ajusto. Si te gusta y querés pasarlo a sitio real
con tu dominio propio, hablamos.
```

**Don't send:** a price quote, a contract, a "buy now" button. Send the
link only. Pricing comes when they ask.

### What if they don't reply

- Day 1: send link
- Day 3 (no reply): "Hola [Nombre], ¿pudiste ver el demo? ¿Algo que
  cambiarías?" — open question, not a sales push
- Day 7 (no reply): "Te dejo activo el demo por 30 días por si lo
  querés ver tranqui. Avisá si necesitás algo." — graceful exit

After day 7, mark the lead as `disqualified` in admin and stop chasing.

## Per-vertical hooks (what to lead with)

| Vertical | Lead-with hook |
|---|---|
| **Peluquería / Salón** | "Las clientas pueden ver tu galería de cortes y reservar por WhatsApp con un toque." |
| **Gimnasio / Fitness** | "El plan + horario de clases + un botón de 'probar gratis' que te genera leads sin que vos hagas nada." |
| **Spa** | "Diseño premium que comunica calma. Las clientas reservan paquetes específicos sin tener que llamar." |
| **Barbería** | "Estética old-school o moderna, lista de precios clara, turnos por WhatsApp." |
| **Restaurant** | "Menú digital con fotos, reservas online, y delivery por WhatsApp sin pagar comisión a Mostrador." |
| **Tatuajes** | "Portfolio por artista, precios por tamaño, agendamiento de consulta gratis." |
| **Estética** | "Antes/después, tratamientos por categoría, política de cancelaciones — todo lo que las clientas preguntan antes de reservar." |
| **Inmobiliaria** | "Listado de propiedades con filtros, fichas técnicas, y consulta directa por WhatsApp." |
| **Servicios profesionales** | "Sitio que comunica seriedad sin parecer un PDF. Caso de éxito visible, contacto directo." |
| **Reubicación** | "Multi-idioma, proceso paso-a-paso, casos reales de clientes que ya se mudaron. Listo para clientes internacionales." |

## Variant: cold-prospect outreach

For prospects we contact first (not inbound), tweak the opener:

> "Hola [Nombre], soy Iván de ParaguAI. Estuve viendo tu Instagram de
> [negocio] y me parece bárbaro lo que hacés. Te aviso que armamos sitios
> web para negocios paraguayos en 48h — te quería ofrecer un demo gratis
> de cómo te quedaría a vos, sin compromiso. ¿Te interesa que lo arme?"

Add the genuine compliment + the discovery framing ("estuve viendo"). The
ask stays the same.

## Variant: existing-tenant referral

When a current pilot/client refers someone:

> "Hola [Nombre], me dijo [referente] que estás pensando en armar tu
> sitio. Te puedo armar el demo gratis para que veas qué tal queda — al
> ser referido de [referente] te incluyo el setup en el primer mes
> gratis si te gusta. ¿Lo armamos?"

The referral discount (free setup first month) creates urgency without
discounting the recurring fee.

## Things to NEVER do

- Send a price quote unsolicited. Always demo first.
- Promise a feature we don't have ("sí dale, lo agendo en Google
  Calendar" — we don't, only WhatsApp).
- Forget to point the demo CTAs at the sales line.
- Skip the DemoBadge ("queda más limpio sin el badge" — yes, but then
  prospects' contacts go to the wrong place).
- Send the demo link with the prospect's real WhatsApp number visible
  before they've agreed to be a paying tenant.
- Promise a turnaround you can't make. "30 minutes" is a strong promise;
  default to "esta tarde" if you're unsure.

## After they say yes (handoff)

1. Confirm slug + plan
2. Run the new-tenant flow per `docs/runbooks/ADD_NEW_TENANT.md`
   ("Promote a demo to a real tenant" section)
3. Send the welcome message with their `/admin` URL + first invoice link
4. Schedule a 15-min onboarding call within 7 days

## See also

- `docs/SALES_PLAYBOOK.md` — objection-handling for the rest of the call
- `docs/runbooks/ADD_NEW_TENANT.md` — what happens technically after yes
- `docs/03_PRICING_MODEL.md` — the 4 plans + commerce commission
- `docs/decisions/0004-payments-pagopar-first.md` — payment context
