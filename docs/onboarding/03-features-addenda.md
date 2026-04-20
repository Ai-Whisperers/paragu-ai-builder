# Addenda de integraciones, features y compliance

> Complementa los [cuestionarios anteriores](./README.md). El cliente marca las secciones que necesite activar.

## Índice

- [1. Reservas / booking (Calendly, Cal.com)](#1-reservas--booking)
- [2. CRM (HubSpot, Pipedrive, Notion)](#2-crm)
- [3. Email & newsletter (Mailchimp, Resend)](#3-email--newsletter)
- [4. Analytics (GA4, Plausible, Meta Pixel)](#4-analytics)
- [5. WhatsApp Business](#5-whatsapp-business)
- [6. Instagram feed + Google Reviews widget](#6-redes-embebidas)
- [7. Blog multi-locale](#7-blog-multi-locale)
- [8. Multi-moneda (PYG / USD / EUR)](#8-multi-moneda)
- [9. Pagos online (MercadoPago, Stripe)](#9-pagos-online)
- [10. Panel admin + exportación de leads](#10-panel-admin)
- [11. Compliance — Política de privacidad (PY LPDP)](#11-privacy)
- [12. Compliance — AML / SEPRELAD (relocation + financieros)](#12-aml)
- [13. Compliance — INAN (food & beverage)](#13-inan)
- [14. Compliance — GDPR / cookies](#14-gdpr)
- [15. Accesibilidad (a11y) y rendimiento (perf)](#15-a11y--perf)

---

## 1. Reservas / booking

JSON: `site.json › integrations.booking` + una sección `booking` o `booking-embed` en la página.

### 1.1 Decisión del proveedor

| Provider | Costo | Mejor para | Limitaciones |
|---|---|---|---|
| **Calendly** | Free tier: 1 event type. Pro $10/mes. | Consultorías, 1-a-1, profesionales | No reserva recursos (salas); no cobra seña nativamente |
| **Cal.com** | Free individual; $15 self-hosted team | Mismo que Calendly, open-source | Menos plantillas estéticas |
| **Fresha** | Free (cobra 2% en pagos) | Peluquerías, spas, clínicas estéticas | Fuerte opinión de UI, poco customizable |
| **Booksy** | $30+/mes | Cadenas de salones, multi-staff | Caro si solos |
| **Formulario interno + WhatsApp** | Gratis | Negocios simples que ya gestionan por WhatsApp | No es reserva "de verdad" |

### 1.2 Setup Calendly / Cal.com

Si el cliente elige uno de estos:

| # | Campo | Formato | Notas |
|---|---|---|---|
| 1.2.1 | URL pública del event type | `https://calendly.com/miusuario/consulta-inicial` | — |
| 1.2.2 | Embebido o redirect? | inline / popup / redirect | embebido = mejor UX |
| 1.2.3 | Color del botón | hex | — |
| 1.2.4 | ¿Requiere webhook a nuestro backend para guardar el lead? | sí / no | `/api/calendly-webhook` ya listo |
| 1.2.5 | Si sí: signing key | (secret, por canal seguro) | — |
| 1.2.6 | Campos custom en el formulario de Calendly | marcar: teléfono, empresa, mensaje | — |

### 1.3 Booking interno (sin tercero)

Solo si rubro tiene bookings muy custom (clases grupales, reserva de salas, etc.). Actualmente soportado parcialmente — ver sección `sample-week-preview`, `weekly-cadence-calendar`, `delivery-slot-picker` en `docs/reference/SECTIONS.md`.

---

## 2. CRM

JSON: `site.json › integrations.crm` + `integrations.crm.config.*`

### 2.1 Comparativa

| CRM | Costo | Mejor para | Integración actual |
|---|---|---|---|
| **HubSpot** | Free tier: 1M contactos. Pro ~$45/mes. | Pymes que crecerán, multi-user | ✅ Lead sync + cron sync |
| **Pipedrive** | $15-50/mes/user | Ventas B2B clásicas | ✅ Lead create |
| **Notion** | Gratis con cuenta personal | Pequeño negocio o freelance | ✅ Como database |
| **Sin CRM** | Gratis | Solo WhatsApp + email | Leads llegan a `/api/leads` y por email |

### 2.2 Setup HubSpot

| # | Campo | Dónde obtenerlo |
|---|---|---|
| 2.2.1 | Portal ID | HubSpot dashboard → Settings → Account → "Hub ID" |
| 2.2.2 | Private App token | Settings → Integrations → Private Apps → Create |
| 2.2.3 | Lista/pipeline destino | ID de la lista o pipeline |
| 2.2.4 | Campos custom a mapear | tabla: campo formulario → propiedad HubSpot |
| 2.2.5 | Lead source tag | "paragu-ai" |

### 2.3 Setup Pipedrive

| # | Campo | Dónde obtenerlo |
|---|---|---|
| 2.3.1 | API token | Personal → Personal preferences → API |
| 2.3.2 | Company domain | `miempresa.pipedrive.com` |
| 2.3.3 | Owner ID (asignar leads a...) | API o dashboard |
| 2.3.4 | Default pipeline + stage | |

### 2.4 Setup Notion como CRM

| # | Campo |
|---|---|
| 2.4.1 | Integration secret token (from notion.com/my-integrations) |
| 2.4.2 | Database ID del CRM table |
| 2.4.3 | Schema de columnas esperadas (nombre, email, teléfono, fuente, fecha, estado) |

---

## 3. Email & newsletter

### 3.1 Mailchimp

Para newsletter + automations.

| # | Campo | Dónde |
|---|---|---|
| 3.1.1 | API key | Account → Extras → API keys |
| 3.1.2 | List / Audience ID | Audience → Settings → Audience name and defaults |
| 3.1.3 | Tags iniciales | ej: "leads-paragu-ai-web" |
| 3.1.4 | ¿Double opt-in? | sí (recomendado, menos spam) / no |
| 3.1.5 | Template de welcome email | ya diseñado / a diseñar |

### 3.2 Resend (email transaccional — confirmaciones, notificaciones)

| # | Campo |
|---|---|
| 3.2.1 | API key |
| 3.2.2 | Dominio verificado para envío (SPF + DKIM) |
| 3.2.3 | From name + from email por defecto |

### 3.3 Plantillas de correo

Para cada email automático:

| Email | Cuando dispara | Asunto | Body (300 chars) |
|---|---|---|---|
| Confirmación de lead | Tras enviar formulario | | |
| Confirmación de reserva | Tras Calendly | | |
| Bienvenida newsletter | Tras doble opt-in | | |
| Notificación interna (a nosotros) | Lead nuevo recibido | | |
| Reminder de cita | 24h antes | | |

---

## 4. Analytics

### 4.1 GA4

| # | Campo |
|---|---|
| 4.1.1 | Measurement ID | `G-XXXXXXXXXX` |
| 4.1.2 | Eventos custom a trackear | marcar: cta_click, lead_submit, booking_start, booking_complete, whatsapp_click, blog_read, faq_open |
| 4.1.3 | E-commerce events (si vende) | purchase, add_to_cart, etc. |
| 4.1.4 | Goals en GA4 | listar (lead = conversión, etc.) |

### 4.2 Plausible (privacy-first, sin cookies)

| # | Campo |
|---|---|
| 4.2.1 | Dominio a trackear |
| 4.2.2 | API key (si quieren reportes via webhook) |

### 4.3 Meta Pixel (si hace ads en Meta)

| # | Campo |
|---|---|
| 4.3.1 | Pixel ID |
| 4.3.2 | Conversiones estándar a trackear |
| 4.3.3 | Conversiones custom |
| 4.3.4 | ¿CAPI server-side? | requiere setup adicional |

### 4.4 ¿Qué trackear cuáles?

Recomendación:
- **GA4**: default para todo tráfico / reportes
- **Plausible**: si tienen audiencia sensible a privacidad (Europa, tech)
- **Meta Pixel**: solo si corren ads en Meta / Instagram
- **No más de 2 simultáneamente** para no inflar el bundle ni confundir el consentimiento de cookies

---

## 5. WhatsApp Business

Botón flotante + mensajes con pre-fill.

### 5.1 WhatsApp Click-to-chat (básico, sin API)

| # | Campo | Formato |
|---|---|---|
| 5.1.1 | Número de WhatsApp | `+595...` en formato internacional |
| 5.1.2 | Mensaje pre-relleno | texto 80–160 chars |
| 5.1.3 | Mensaje para rubro comercial (desde sección servicios) | texto |
| 5.1.4 | Mensaje desde FAQ (no encontré respuesta) | texto |
| 5.1.5 | Posición del botón flotante | bottom-right / bottom-left / header / none |
| 5.1.6 | ¿Mostrar en móvil solamente o también desktop? | ambos / solo móvil |

### 5.2 WhatsApp Business API (avanzado — requiere BSP o Meta Cloud API)

| # | Campo |
|---|---|
| 5.2.1 | ¿Ya tienen WABA (WhatsApp Business Account) aprobado? | sí + Account ID / no |
| 5.2.2 | Phone number ID |
| 5.2.3 | Access token (long-lived) |
| 5.2.4 | Verify token (para webhooks) |
| 5.2.5 | Templates aprobados (listar) |
| 5.2.6 | BSP si usan uno | Twilio / 360Dialog / Evolution API (tenemos instalado) |

**Nota**: WABA requiere verificación de negocio por Meta (1-3 semanas). Si el cliente no tiene urgencia, arrancar con click-to-chat y migrar luego.

### 5.3 Auto-reply / horario no laboral

| # | Campo |
|---|---|
| 5.3.1 | ¿Quieren auto-reply fuera de horario? | sí / no |
| 5.3.2 | Horarios de atención WhatsApp | |
| 5.3.3 | Mensaje auto-reply | texto |
| 5.3.4 | ¿Mensaje de saludo al entrar a la conversación? | texto |

---

## 6. Redes embebidas

### 6.1 Instagram feed

| # | Campo |
|---|---|
| 6.1.1 | Handle de IG | `@miusuario` |
| 6.1.2 | Mostrar últimos N posts | 6 / 9 / 12 |
| 6.1.3 | Estilo | grid cuadrado / masonry / carrusel |
| 6.1.4 | ¿Solo destacados o también stories? | posts / stories / ambos |
| 6.1.5 | Access token Instagram Basic Display | (por canal seguro) |
| 6.1.6 | Refresh cadence | cada hora / día |

### 6.2 Google Reviews widget

| # | Campo |
|---|---|
| 6.2.1 | Google Place ID | (buscar en Place ID finder de Google) |
| 6.2.2 | Cantidad de reseñas a mostrar | 3 / 5 / 10 |
| 6.2.3 | ¿Filtrar por estrellas mínimas? | sí (ej: 4+) / no |
| 6.2.4 | ¿Mostrar rating agregado? | sí / no |

### 6.3 TikTok feed (si aplica)

Similar a IG. Nota: TikTok embed requiere más setup — consultar antes de prometer.

---

## 7. Blog multi-locale

### 7.1 Estructura

| # | Pregunta | Formato | JSON |
|---|---|---|---|
| 7.1.1 | ¿Blog activado? | sí / no | `site.json › features.blog` |
| 7.1.2 | Locales con blog | marcar cada uno | `site.json › locales` |
| 7.1.3 | Categorías iniciales | lista | `content.blog.categories` |
| 7.1.4 | ¿Mostrar autor en cada post? | sí / no | `content.blog.showAuthor` |
| 7.1.5 | ¿Mostrar tiempo de lectura? | sí / no | |
| 7.1.6 | ¿Mostrar fecha? | sí / no | |
| 7.1.7 | ¿Tags por post? | sí (dentro de categorías) / no | |

### 7.2 Contenido inicial (lanzamiento)

Para que el blog no quede vacío al lanzar:

| # | Campo | Formato |
|---|---|---|
| 7.2.1 | ¿Cuántos posts listos para el lanzamiento? | 0 / 3 / 5 / 10 |
| 7.2.2 | Para cada post: título, slug, resumen (150 chars), cuerpo markdown (800–2000 palabras), imagen destacada, autor, fecha | (tabla aparte) |
| 7.2.3 | ¿Traducción a otros locales? | automática / profesional / no |

### 7.3 Post-lanzamiento

| # | Pregunta | Formato |
|---|---|---|
| 7.3.1 | Cadencia | semanal / quincenal / mensual |
| 7.3.2 | ¿Quién escribe? | cliente / nosotros (costo extra) |
| 7.3.3 | ¿Revisión SEO por post? | sí / no |
| 7.3.4 | ¿Newsletter al publicar nuevo post? | sí + con Mailchimp |

---

## 8. Multi-moneda

Útil para tenants con clientes internacionales (relocation, turismo, exportación).

| # | Pregunta | Formato | JSON |
|---|---|---|---|
| 8.1 | Monedas soportadas | marcar: PYG, USD, EUR, BRL, ARS, CLP, UYU | `tokens.currencies` |
| 8.2 | Moneda por defecto | | `site.json › defaultCurrency` |
| 8.3 | ¿Detección automática por país del visitante? | sí / no | |
| 8.4 | ¿Selector visible (toggle en header)? | sí / no | |
| 8.5 | ¿Tasa de cambio fija o dinámica? | fija (manual) / dinámica (requiere API de FX) | |
| 8.6 | Si dinámica: API a usar | openexchangerates / exchangerate-api / propia | |

---

## 9. Pagos online

### 9.1 MercadoPago (PY, LATAM)

| # | Campo | Dónde |
|---|---|---|
| 9.1.1 | Access token | developers.mercadopago.com/panel/credentials |
| 9.1.2 | Public key | ídem |
| 9.1.3 | ¿Cuotas sin interés? | sí + cuántas / no |
| 9.1.4 | ¿Aceptan débito, crédito, transferencia? | marcar |
| 9.1.5 | Cuenta de depósito | CVU o alias |
| 9.1.6 | Webhook URL (para confirmación de pago) | `https://<dominio>/api/mercadopago-webhook` |

### 9.2 Stripe (internacional, USD/EUR)

| # | Campo |
|---|---|
| 9.2.1 | Secret key (sk_live_...) |
| 9.2.2 | Publishable key (pk_live_...) |
| 9.2.3 | Webhook signing secret |
| 9.2.4 | Products / Prices configurados en Stripe (listar) |
| 9.2.5 | ¿Subscriptions o one-time? | |
| 9.2.6 | Tax configuration (si aplica) | |

### 9.3 Transferencia manual (pago contra factura)

| # | Campo |
|---|---|
| 9.3.1 | Banco + tipo de cuenta + número |
| 9.3.2 | Nombre del titular |
| 9.3.3 | RUC para facturación |
| 9.3.4 | ¿Cuántos días de gracia antes de anular orden? |

### 9.4 Billing / facturación

| # | Pregunta |
|---|---|
| 9.4.1 | ¿Emiten factura automática? |
| 9.4.2 | Sistema contable (Siigo, ContaBilidad, Excel) |
| 9.4.3 | ¿Necesitan envío de factura electrónica por email tras pago? |

---

## 10. Panel admin

Actualmente `/admin` muestra leads + analytics. Es funcional pero básico.

| # | Pregunta | Formato |
|---|---|---|
| 10.1 | ¿Quién debe tener acceso al panel admin? | lista de emails |
| 10.2 | ¿Un solo rol o diferencian admin/editor? | — (actualmente solo admin) |
| 10.3 | ¿Quieren exportar leads a CSV regularmente? | sí + frecuencia |
| 10.4 | ¿Notificaciones push / email al llegar lead? | sí + destinatarios |
| 10.5 | ¿Dashboard custom con KPIs específicos? | lista de KPIs |

---

## 11. Privacy — Política de privacidad (PY LPDP) {#11-privacy}

**Obligatorio para todo sitio que capta datos personales.**

Base legal en Paraguay:
- Ley 1.682/01 — Protección de datos personales
- Ley 5.543/15 — Datos en redes sociales
- Ley 6.534/20 — Protección de datos crediticios (si aplica)

| # | Campo | Formato |
|---|---|---|
| 11.1 | ¿Tienen política de privacidad propia redactada? | sí — envíanla / no — usamos plantilla `src/compliance/privacy-policy-py.template.md` |
| 11.2 | Responsable del tratamiento de datos (razón social + CUIT) | |
| 11.3 | Domicilio legal | |
| 11.4 | Email para ejercicio de derechos (acceso, rectificación, cancelación, oposición — "ARCO") | |
| 11.5 | ¿Con qué finalidad recolectan datos? | lista: "atender consulta", "enviar newsletter", "mejorar servicio" |
| 11.6 | ¿Comparten datos con terceros? | lista: Supabase (EEUU), HubSpot (EEUU), Calendly (EEUU), GA4 (EEUU) |
| 11.7 | ¿Transferencia internacional explicada? | (la plantilla lo cubre) |
| 11.8 | Tiempo de retención de datos | ej: "5 años o hasta solicitud de eliminación" |
| 11.9 | Medidas de seguridad | (la plantilla lo cubre; alinear con realidad) |
| 11.10 | Revisión legal independiente | sí (recomendado para clientes B2B grandes) / no |

### 11.1 Derechos del titular (ARCO)

El endpoint `/api/data-request` maneja solicitudes de acceso, rectificación, eliminación y portabilidad. El cliente decide:

| # | Pregunta |
|---|---|
| 11.1.1 | ¿Procesan las solicitudes ARCO manualmente o automatizado? |
| 11.1.2 | SLA de respuesta | 15 días hábiles (obligatorio) |
| 11.1.3 | ¿Quién es el Oficial de Datos (si aplica)? | nombre + email |

---

## 12. AML / SEPRELAD {#12-aml}

**Obligatorio para**: servicios financieros, inversiones, relocation, inmobiliarias, joyerías, casinos, casas de cambio, remesas.

Base legal: Ley 1015/97 + SEPRELAD Resoluciones (Paraguay).

| # | Campo | Formato |
|---|---|---|
| 12.1 | ¿Están registrados ante SEPRELAD? | número + fecha |
| 12.2 | Oficial de Cumplimiento designado | nombre + cédula + título |
| 12.3 | Manual de KYC (Know Your Customer) | sí (enviar) / en proceso |
| 12.4 | Política de PEP (Persona Expuesta Políticamente) | sí / no |
| 12.5 | Listas sancionadas que consultan | OFAC, UN, EU, INTERPOL, locales |
| 12.6 | Umbrales de reporte (por operación, por cliente) | |
| 12.7 | ¿Aceptan efectivo? | no (recomendado) / sí + umbrales |
| 12.8 | Disclosure público en el sitio | (usar plantilla `src/compliance/aml-disclosure-nexa.template.md`) |
| 12.9 | Capacitación AML del equipo (últimos 12 meses) | sí / no |

---

## 13. INAN {#13-inan}

**Obligatorio para**: restaurantes, panaderías, catering, productores de alimentos, meal prep, productores de bebidas, suplementos.

Base legal: Decreto 21376/98 (Paraguay).

| # | Campo | Formato |
|---|---|---|
| 13.1 | Registro INAN del establecimiento | número + fecha vencimiento |
| 13.2 | Registro INAN de cada producto (si aplica) | número por producto |
| 13.3 | Habilitación municipal | sí |
| 13.4 | Manipuladores con curso vigente | sí + cantidad |
| 13.5 | Certificación HACCP | sí / no / en proceso |
| 13.6 | ¿Hacen análisis microbiológicos periódicos? | sí + frecuencia |
| 13.7 | Disclaimer visible en sitio | (usar plantilla `src/compliance/inan-food-disclaimer.template.md`) |
| 13.8 | Alergenos obligatorios en el menú | sí (los marca el sistema) / no |
| 13.9 | Claims de salud del producto (ej: "reduce colesterol") | requiere aval científico + INAN |

---

## 14. GDPR / cookies {#14-gdpr}

Si tienen audiencia europea (incluso accidentalmente — turistas, nómades digitales que contratan desde afuera), GDPR aplica.

| # | Pregunta | Formato |
|---|---|---|
| 14.1 | ¿Se dirigen explícitamente a mercado europeo? | sí / no / accidental |
| 14.2 | ¿Implementar banner de consentimiento? | sí (recomendado) / no |
| 14.3 | Cookies a clasificar (el sistema usa `src/compliance/cookie-classification.json`) | (revisar) |
| 14.4 | Categorías a ofrecer al visitante | "estrictamente necesarias" (siempre on), "analytics", "marketing", "personalización" |
| 14.5 | ¿Pre-checked o opt-in explícito? | opt-in (GDPR lo requiere) |
| 14.6 | "Rechazar todo" con un click | sí (obligatorio GDPR) / no |
| 14.7 | Re-consentimiento cada X meses | 12 meses recomendado |

---

## 15. A11y + Performance {#15-a11y--perf}

Todos los sitios corren `lighthouserc.json` en CI — mantener scores 90+.

### 15.1 Accesibilidad

| # | Pregunta | Formato |
|---|---|---|
| 15.1.1 | ¿Requisito legal específico? (ley de accesibilidad, licitación pública) | sí — detallar |
| 15.1.2 | ¿Clientes con discapacidad visual / motora / auditiva relevantes? | sí / no |
| 15.1.3 | ¿Skip-to-content link en el header? | sí (default) |
| 15.1.4 | ¿Tamaño de texto mínimo aceptable? | 16px default / más grande |
| 15.1.5 | Alt text en imágenes: ¿provee cliente o redactamos nosotros? | cliente / nosotros |

### 15.2 Performance

| # | Pregunta | Formato |
|---|---|---|
| 15.2.1 | ¿Audiencia principal en móvil o desktop? | (influye prioridades) |
| 15.2.2 | ¿Conexión típica del público? | 4G urbano / 3G rural / fibra / mixed |
| 15.2.3 | ¿Hay videos auto-play en el sitio? | no (default) / sí — justificar |
| 15.2.4 | Máximo peso aceptado del hero image | 300 KB / 500 KB / 1 MB |

### 15.3 SEO técnico

| # | Pregunta | Formato |
|---|---|---|
| 15.3.1 | Sitemap — ¿submitear a Google Search Console? | sí (default) |
| 15.3.2 | Robots.txt — ¿alguna ruta a excluir? | `/admin/`, `/api/` (default) |
| 15.3.3 | JSON-LD schemas — ¿tipo principal? | LocalBusiness, Restaurant, Service, Professional, Store, Article |
| 15.3.4 | Verificación DNS de Google Search Console | TXT record a agregar |

---

## Referencias

- [Cuestionario universal](./01-master-questionnaire.md)
- [Addenda por vertical](./02-vertical-addenda.md)
- [Docs arquitectura](../../ARCHITECTURE.md)
- [Catálogo de sections](../reference/SECTIONS.md)
- [Catálogo de API routes](../reference/API.md)
- [Plantillas de compliance](../../src/compliance/)

---

_Versión 1.0 — abril 2026._
