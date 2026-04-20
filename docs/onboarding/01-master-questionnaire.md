# Cuestionario completo de onboarding — universal

> Todo cliente nuevo completa este cuestionario. Toma entre **2 y 4 horas** responder con cuidado. Es largo a propósito: cada pregunta evita 3 idas y vueltas luego.
>
> **Convención**: cada sección tiene un ID (A, B, C…). La columna "JSON" indica en qué archivo de la configuración del tenant aterriza la respuesta — útil para el equipo técnico; se puede ignorar como cliente.
>
> **Idioma**: Por defecto español paraguayo. Si operan en otros idiomas, se indica en la Sección C.

---

## A. Identidad del negocio

Esta información aparece en el header, footer, meta tags de SEO, JSON-LD, y es la base de todo lo demás.

| # | Pregunta | Formato | Ejemplo | JSON |
|---|---|---|---|---|
| A1 | Nombre comercial (como aparece en rótulos, Instagram, etc.) | texto ≤ 50 chars | "Salón María" | `content.siteName` |
| A2 | Tagline / frase corta que resume qué hacen | texto ≤ 80 chars | "Peluquería profesional en el centro de Asunción" | `content.tagline` |
| A3 | Descripción larga (para meta description + Sección Sobre) | texto 150–300 chars | (párrafo completo) | `content.home.seo.description` |
| A4 | Slug preferido para la URL (paragu-ai.com/**slug**) | kebab-case, 3-40 chars | `salon-maria` | `sites/<slug>/` |
| A5 | ¿Tienen dominio propio registrado? | sí/no + URL | `salonmaria.com.py` | `site.json › domain` |
| A6 | Si no: ¿quieren que los ayudemos a comprarlo? | sí/no + nombre preferido | `salonmaria.com.py` | — |
| A7 | Ciudad principal de operación | texto | "Asunción" | `content.footer.city` |
| A8 | País | texto | "Paraguay" | `site.json › country` |
| A9 | ¿Operan en otras ciudades/sucursales? | lista | "Asunción, Ciudad del Este" | `content.locations` |
| A10 | Año de fundación | yyyy | 2015 | `content.foundedYear` |
| A11 | Número de empleados (orientativo) | número | 8 | — |
| A12 | CUIT / RUC / identificador fiscal | texto | `80012345-6` | `content.legal.taxId` |
| A13 | ¿Empresa formal registrada? | sí / no / en trámite | sí — S.A. / E.I.R.L. / unipersonal | `content.legal.formalName` |
| A14 | Razón social completa (si difiere del nombre comercial) | texto | "Servicios Estéticos María S.A." | `content.legal.formalName` |

---

## B. Marca y diseño

Aplica a todos los componentes visuales: colores de botones, fondos, títulos, tipografías.

### B.1 Logo

| # | Pregunta | Formato | Notas |
|---|---|---|---|
| B1 | ¿Tienen logo? | sí / no | — |
| B2 | Si sí: entregar archivo | SVG preferido, sino PNG transparente 1024×1024+ | `sites/<slug>/assets/logo.svg` |
| B3 | Variantes disponibles | marcar: versión horizontal, isotipo, blanco sobre negro, RGB, CMYK | — |
| B4 | Si no tienen logo: ¿quieren que lo diseñemos? | sí / no | costo adicional |

### B.2 Paleta de colores

Si tienen manual de marca, lo adjuntan y saltamos estas preguntas.

| # | Pregunta | Formato | Ejemplo | JSON |
|---|---|---|---|---|
| B5 | Color primario (botones, enlaces, header) | hex | `#0A5C36` | `tokens.colors.primary` |
| B6 | Color secundario (acentos, CTAs) | hex | `#F2B544` | `tokens.colors.secondary` |
| B7 | Color de fondo | hex | `#FAFAF9` | `tokens.colors.background` |
| B8 | Color de texto principal | hex | `#1F2937` | `tokens.colors.text` |
| B9 | Color de texto secundario / apagado | hex | `#6B7280` | `tokens.colors.textLight` |
| B10 | Color de superficie / tarjetas | hex | `#FFFFFF` | `tokens.colors.surface` |
| B11 | ¿Tienen preferencia por tema claro o oscuro por defecto? | claro / oscuro | — | `tokens.theme` |

### B.3 Tipografías

| # | Pregunta | Formato | Ejemplo | JSON |
|---|---|---|---|---|
| B12 | Tipografía para títulos | nombre de Google Font | "Playfair Display" | `tokens.fonts.heading` |
| B13 | Tipografía para texto corrido | nombre de Google Font | "Inter" | `tokens.fonts.body` |
| B14 | ¿Necesitan tipografía custom (no de Google)? | sí + archivo | (webfonts .woff2 subidos) | — |

**Sugerencias por rubro si no tienen preferencia:**
- Elegante / lujo: Playfair Display + Inter
- Moderno / tech: Inter + Inter
- Amigable / casual: Poppins + Nunito
- Tradicional / confianza: Merriweather + Source Sans
- Energético / deportivo: Rubik + Rubik

### B.4 Voz y tono

| # | Pregunta | Formato | Ejemplo |
|---|---|---|---|
| B15 | ¿Tratan al cliente de **tú** o **usted**? | tú / usted / ustedes | Paraguay: usualmente usted; redes: tú |
| B16 | Tono de voz | seleccionar: formal / cercano / divertido / técnico / experto | — |
| B17 | 3 adjetivos que describen la marca | lista | "profesional, cálido, confiable" |
| B18 | ¿Usan emojis en comunicaciones? | sí / no / con moderación | — |
| B19 | Palabras que DEBEN aparecer en el sitio | lista | "orgánico, artesanal, paraguayo" |
| B20 | Palabras que NO deben aparecer | lista | "barato, rápido" (por ejemplo) |

---

## C. Idiomas / locales

| # | Pregunta | Formato | Ejemplo | JSON |
|---|---|---|---|---|
| C1 | Idioma principal del sitio | `es` / `en` / `pt` / `nl` / `de` | `es` | `site.json › defaultLocale` |
| C2 | Idiomas adicionales (si aplica) | lista | `["en", "pt"]` | `site.json › locales` |
| C3 | Si incluyen otros idiomas: ¿tienen el copy traducido? | sí / parcial / no | — | — |
| C4 | Si no: ¿prefieren traducción automática (revisable) o profesional (con costo)? | auto / pro | — | — |
| C5 | ¿Quieren selector de idioma visible en el header? | sí / no / solo en footer | — | `site.json › features.languageSelector` |

---

## D. Dominio, email, contacto

### D.1 Dominio

| # | Pregunta | Formato | Ejemplo | JSON |
|---|---|---|---|---|
| D1 | Dominio principal | URL | `salonmaria.com.py` | `site.json › hostnames[0]` |
| D2 | Dominio de redirección (si aplica) | URL | `www.salonmaria.com.py` | `site.json › hostnames[]` |
| D3 | Staging deseado | URL | `staging.salonmaria.com.py` | — |
| D4 | ¿Mudarán DNS a Cloudflare? | sí / no | (nosotros lo manejamos si sí) | — |

### D.2 Contacto

| # | Pregunta | Formato | Ejemplo | JSON |
|---|---|---|---|---|
| D5 | Teléfono principal | `+595 ...` | `+595 21 555-0123` | `content.contact.phone` |
| D6 | WhatsApp para clientes | `+595 ...` | `+595 975 550 123` | `content.whatsapp.phone` |
| D7 | Mensaje pre-relleno al hacer click en WhatsApp | texto | "Hola, vi su sitio y quería consultar…" | `content.whatsapp.message` |
| D8 | Email comercial | email | `contacto@salonmaria.com.py` | `content.contact.email` |
| D9 | Email técnico (para alertas del sistema) | email | `admin@salonmaria.com.py` | — |
| D10 | Dirección física (si atienden clientes ahí) | texto completo | "Avda. España 1234 c/ Brasil, Asunción" | `content.contact.address` |
| D11 | Link a Google Maps de la ubicación | URL corto de Google Maps | `https://maps.app.goo.gl/...` | `content.contact.googleMapsUrl` |
| D12 | Horario de atención — lunes a viernes | `HH:mm - HH:mm` | `08:00 - 18:00` | `content.contact.hours.weekdays` |
| D13 | Horario — sábado | `HH:mm - HH:mm` o `cerrado` | `09:00 - 13:00` | `content.contact.hours.saturday` |
| D14 | Horario — domingo | `HH:mm - HH:mm` o `cerrado` | `cerrado` | `content.contact.hours.sunday` |
| D15 | ¿Cierran por feriados paraguayos? | sí / no / parcial | | `content.contact.hours.holidays` |

### D.3 Redes sociales

Si tienen perfil, darlo. Si no, dejar en blanco (no creamos vacíos).

| # | Red | URL completo | JSON |
|---|---|---|---|
| D16 | Instagram | `https://instagram.com/salonmaria` | `content.social.instagram` |
| D17 | Facebook | | `content.social.facebook` |
| D18 | TikTok | | `content.social.tiktok` |
| D19 | LinkedIn (empresa) | | `content.social.linkedin` |
| D20 | YouTube | | `content.social.youtube` |
| D21 | Twitter/X | | `content.social.twitter` |
| D22 | WhatsApp Catalog | | `content.social.whatsappCatalog` |

---

## E. Servicios / ofertas

> El corazón del sitio. Completar con el mismo nivel de detalle que usan al explicar a un cliente nuevo.

### E.1 Lista de servicios (o productos, planes, programas, paquetes — según rubro)

Para **cada** servicio:

| # | Campo | Formato |
|---|---|---|
| E1.1 | Nombre del servicio | texto ≤ 40 chars |
| E1.2 | Descripción corta (para tarjeta) | texto 80–140 chars |
| E1.3 | Descripción larga (para página de detalle) | texto 300–600 chars |
| E1.4 | Precio | "Gs 150.000" / "Desde Gs 150k" / "A consultar" |
| E1.5 | Duración o cantidad | "1 hora" / "4 sesiones" / "mensual" |
| E1.6 | Categoría (si tienen varias) | "corte", "coloración", etc. |
| E1.7 | ¿Es el servicio destacado / estrella? | sí/no (máx 3 destacados) |
| E1.8 | Icono o imagen | opcional, link o archivo |
| E1.9 | ¿Permite reserva online? | sí/no |

**Mínimo 3, máximo 20. Si tienen más de 20, agruparlos por categoría.**

### E.2 Precios y paquetes (si ofrecen)

| # | Pregunta | Formato |
|---|---|---|
| E10 | ¿Ofrecen paquetes / planes mensuales? | sí / no |
| E11 | Si sí: listar por tier (nombre, precio, lo que incluye) | tabla |
| E12 | ¿Tienen promociones de lanzamiento / primer cliente? | sí — descripción |
| E13 | ¿Aceptan cuotas sin interés? | sí + cuántas |

### E.3 Zonas de cobertura (si entregan a domicilio o atienden fuera de la ciudad)

| # | Pregunta | Formato |
|---|---|---|
| E14 | Ciudades / barrios donde entregan | lista |
| E15 | Costo de envío | fijo / variable por zona |
| E16 | Tiempo de entrega / lead time | "24h" / "3 días hábiles" |

---

## F. Equipo / quienes somos

Si no quieren mostrar el equipo, saltar esta sección.

Para **cada** persona:

| # | Campo | Formato |
|---|---|---|
| F1 | Nombre y apellido | texto |
| F2 | Cargo / rol | texto ≤ 60 chars |
| F3 | Bio corta (2–3 oraciones) | texto 100–200 chars |
| F4 | Foto profesional | JPG/PNG ≥ 800×800, idealmente cuadrada, fondo neutro |
| F5 | Especialidades / certificaciones | lista |
| F6 | Instagram / LinkedIn personal | URL |
| F7 | ¿Es visible en el sitio? | sí (mostrar) / no (solo admin interno) |

**Cantidad típica:** 3–8 personas. Si son más, priorizar líderes.

---

## G. Testimonios / prueba social

Clientes reales que dieron permiso explícito para usar su nombre o foto.

Para **cada** testimonio:

| # | Campo | Formato |
|---|---|---|
| G1 | Nombre del cliente (o iniciales si prefieren anonimato) | texto |
| G2 | Texto del testimonio (literal, no editarlo mucho) | 100–250 chars |
| G3 | Cargo / contexto (qué servicio usaron) | texto |
| G4 | ¿Foto del cliente disponible con permiso? | sí + link / no |
| G5 | ¿Calificación en estrellas? | 1–5 |
| G6 | Fecha aproximada del testimonio | mm/yyyy |

**Mínimo 3, ideal 6–10.**

### G.1 Otras pruebas de confianza

| # | Pregunta | Formato |
|---|---|---|
| G7 | ¿Tienen logos de clientes grandes / medios / partners para mostrar? | lista de nombres + logos |
| G8 | ¿Tienen certificaciones profesionales? | lista (nombre, emisor, año) |
| G9 | ¿Tienen premios / reconocimientos? | lista |
| G10 | ¿Tienen menciones en prensa? | lista (medio, fecha, URL) |
| G11 | ¿Número de clientes atendidos a la fecha? | número o rango |
| G12 | ¿Años de experiencia del equipo líder? | número |

---

## H. FAQ — Preguntas frecuentes

Las **15 preguntas que reciben más seguido** por WhatsApp / email / en persona. Si reciben menos de 15, listar las que reciban.

Para **cada** pregunta:

| # | Campo | Formato |
|---|---|---|
| H1 | Pregunta (formulada como la haría el cliente) | "¿Atienden los sábados?" |
| H2 | Respuesta (directa, 1–3 oraciones) | texto 50–200 chars |
| H3 | Categoría (opcional) | "Horarios" / "Precios" / "Entrega" |

**Orden sugerido:** las 3 más urgentes primero (hora, precio, zona), el resto por frecuencia.

---

## I. Proceso / cómo trabajamos

Para rubros donde el cliente necesita entender los pasos: reubicación, consultoría, reformas, servicios médicos, etc.

| # | Campo | Formato |
|---|---|---|
| I1 | ¿Tienen un proceso definido de trabajo? | sí / no |
| I2 | Si sí: listar pasos (3–8 pasos) | número + título + descripción corta |
| I3 | Tiempo estimado total | "2 semanas" / "3 meses" |
| I4 | Entregables finales | lista |

Ejemplo (para relocación):
1. **Consulta inicial (gratis, 30 min)** — entendemos su caso, explicamos opciones.
2. **Propuesta personalizada (48h)** — enviamos paquete recomendado con precio fijo.
3. **Firma y pago inicial** — 30% de anticipo.
4. **Trámites** (8–12 semanas) — residencia + cédula + cuenta bancaria.
5. **Entrega** — documentos finalizados + asesoría de seguimiento 6 meses.

---

## J. Llamada a la acción (CTA)

La acción principal que queremos que haga un visitante.

| # | Pregunta | Formato | Ejemplo |
|---|---|---|---|
| J1 | CTA primario del sitio | "Agendar consulta" / "Contactar por WhatsApp" / "Ver menú" / "Comprar" | `content.navigation.cta` |
| J2 | CTA del hero (botón principal arriba) | texto ≤ 25 chars | "Reserva tu turno" |
| J3 | CTA secundario (si hay 2 botones) | texto ≤ 25 chars | "Ver servicios" |
| J4 | ¿El CTA principal lleva a…? | WhatsApp / formulario / Calendly / teléfono / email | URL o número |

---

## K. Imágenes y media

| # | Pregunta | Formato | Notas |
|---|---|---|---|
| K1 | ¿Tienen fotos profesionales del negocio? | sí / no | — |
| K2 | ¿Cuántas fotos disponibles? | número | Ideal 20+ |
| K3 | Resolución mínima | ≥ 1920×1080 para hero, ≥ 1200×800 para galería | — |
| K4 | Carpeta compartida con las imágenes | Google Drive / Dropbox | — |
| K5 | ¿Permiso para modificar (crop, color grade)? | sí / no | — |
| K6 | Si no tienen fotos: ¿hacen sesión profesional o usamos IA/stock? | sesión / IA / stock | sesión ~Gs 800k–2M |
| K7 | ¿Tienen video de presentación? | sí + link | YouTube/Vimeo preferido |
| K8 | Branding adicional (patrones, ilustraciones, iconos custom) | archivos | — |

### K.1 Imágenes específicas requeridas

| Sección | Cantidad | Formato | Notas |
|---|---|---|---|
| Hero (imagen de fondo de la portada) | 1 | 1920×1080 mínimo, 16:9 | Debe tolerar texto encima |
| Galería | 6–12 | 1200×800 mínimo | Mix: espacio, personas, producto, acción |
| Equipo | 1 por persona | 800×800 cuadrada | Fondo neutro, bien iluminada |
| Iconos de servicios | 1 por servicio | 128×128 SVG/PNG transparente | Si no, usamos lucide-react |
| OG image (preview al compartir en redes) | 1 | 1200×630 | Nombre + tagline encima |
| Favicon | 1 | PNG 512×512 cuadrado | Lo convertimos a .ico |

---

## L. Blog / contenido editorial

Saltar si no quieren blog.

| # | Pregunta | Formato | JSON |
|---|---|---|---|
| L1 | ¿Quieren blog? | sí / no | `site.json › features.blog` |
| L2 | ¿En qué idiomas? | lista | — |
| L3 | ¿Tienen artículos escritos para el lanzamiento? | sí + cantidad / no | — |
| L4 | Si sí: categorías / temas | lista | — |
| L5 | Cadencia de publicación post-lanzamiento | semanal / quincenal / mensual / cuando podamos | — |
| L6 | ¿Quién escribe? | cliente / nuestro equipo | — |
| L7 | 10 ideas de artículos iniciales | lista de títulos | — |

---

## M. Formulario de contacto y CRM

| # | Pregunta | Formato | JSON |
|---|---|---|---|
| M1 | Campos deseados en el formulario | marcar: nombre, email, teléfono, ciudad, servicio de interés, mensaje libre, presupuesto, cómo nos conoció | `site.json › features.leadForm.fields` |
| M2 | ¿Campo consentimiento GDPR obligatorio? | sí / no / depende | `site.json › compliance.cookieConsent` |
| M3 | ¿A qué email llegan los leads? | lista de emails | `site.json › integrations.leadNotifyEmail` |
| M4 | ¿Usan algún CRM? | HubSpot / Pipedrive / Zoho / Notion / ninguno | `site.json › integrations.crm` |
| M5 | Si usan CRM: credenciales | API key / portal ID / access token | (secreto, por canal seguro) |
| M6 | ¿Quieren que se envíe un email de confirmación al cliente? | sí / no + template | `site.json › features.leadAutoReply` |
| M7 | Mensaje de éxito tras enviar el formulario | texto 40–120 chars | "Gracias, te contactamos en 24h." |

---

## N. Integraciones externas

Ver [`03-features-addenda.md`](./03-features-addenda.md) para setup detallado. Aquí solo marcamos cuáles activar.

| Integración | ¿Usan? | Credencial / dato | JSON |
|---|---|---|---|
| Calendly / Cal.com (reservas) | sí / no | URL de booking público | `integrations.booking` |
| HubSpot (CRM + forms) | sí / no | portal ID | `integrations.crm` |
| Pipedrive (CRM) | sí / no | API token | `integrations.crm` |
| Mailchimp (newsletter) | sí / no | API key + list ID | `integrations.email` |
| Resend (email transaccional) | sí / no | API key | `integrations.email` |
| Google Analytics 4 | sí / no | Measurement ID (G-xxx) | `integrations.analytics.ga4` |
| Plausible | sí / no | dominio configurado | `integrations.analytics.plausible` |
| Meta Pixel / Facebook Pixel | sí / no | Pixel ID | `integrations.analytics.meta` |
| WhatsApp Business API | sí / no | phone ID + access token | `integrations.messaging.whatsapp` |
| Instagram Basic Display | sí / no | access token | `integrations.social.instagram` |
| Google Reviews widget | sí / no | Place ID | `integrations.social.googleReviews` |
| Google Maps embed | sí / no | (ya viene) | `content.contact.googleMapsUrl` |
| MercadoPago (pagos) | sí / no | access token + public key | `integrations.payments` |
| Stripe (pagos USD) | sí / no | secret + publishable | `integrations.payments` |

---

## O. Legal y compliance

### O.1 Política de privacidad

Paraguay tiene ley de datos personales (Ley 1.682/01) más actualizaciones recientes (Ley 6.534/20 sobre datos crediticios).

| # | Pregunta | Formato |
|---|---|---|
| O1 | ¿Tienen política de privacidad propia? | sí — envíanla · no — usamos plantilla PY |
| O2 | Si no: ¿aprueban uso de nuestra plantilla? | sí / revisar primero |
| O3 | Nombre legal / razón social a aparecer en la política | texto |
| O4 | ¿Email de consultas sobre datos personales? | email |
| O5 | Países donde guardan datos | "Paraguay" / "EEUU (Supabase)" / etc |

### O.2 Términos y condiciones

| # | Pregunta | Formato |
|---|---|---|
| O6 | ¿Tienen T&C propios? | sí — envíanlos · no — plantilla |
| O7 | Si venden online: política de devolución | texto o "no aplica" |
| O8 | Política de cancelación (si hay reservas) | texto |

### O.3 Cookies y consentimiento

| # | Pregunta | Formato | JSON |
|---|---|---|---|
| O9 | ¿Quieren banner de cookies? | sí / no | `site.json › compliance.cookieConsent` |
| O10 | ¿Tienen audiencia europea? | sí / no | GDPR aplica si sí |
| O11 | Cookies de analytics pre-aprobadas (cargan sin consent) | solo strictly-necessary / también analytics | — |

### O.4 Específico por rubro

| # | Pregunta | Cuando aplica |
|---|---|---|
| O12 | ¿Ofrecen servicios financieros / de inversión? | Sí → requiere disclosure SEPRELAD/AML |
| O13 | ¿Venden comida / bebida? | Sí → registro INAN, disclaimer requerido |
| O14 | ¿Son profesionales de salud? | Sí → disclaimer de "no sustituye consejo médico" |
| O15 | ¿Atienden a menores? | Sí → consentimiento parental |
| O16 | ¿Trabajan con datos sensibles (salud, biometría)? | Sí → LPDP categoría sensible |

---

## P. SEO y marketing

| # | Pregunta | Formato |
|---|---|---|
| P1 | 5 palabras clave para las que quieren aparecer en Google | lista | Ej: "peluquería asunción centro" |
| P2 | 3 competidores directos (web) | URLs | |
| P3 | ¿Están posicionados actualmente? | sí + posición / no | |
| P4 | ¿Tienen Google My Business activo? | sí + URL / no | |
| P5 | ¿Quieren que lo configuremos? | sí / no | |
| P6 | ¿Hacen ads en Meta / Google? | sí + historial / no | |
| P7 | Slogan o título SEO preferido para home | texto ≤ 60 chars | |
| P8 | Meta description preferida para home | texto 140–160 chars | |

---

## Q. Operaciones y lead handling

Una vez lanzado, ¿qué pasa cuando llega un lead?

| # | Pregunta | Formato |
|---|---|---|
| Q1 | ¿Quién recibe la notificación de un lead nuevo? | nombre + email + WhatsApp |
| Q2 | SLA de respuesta comprometido | "dentro de 2h hábiles" |
| Q3 | Template de respuesta inicial | texto o "a redactar" |
| Q4 | ¿Turno / equipo de soporte o solo el dueño? | — |
| Q5 | Horario para recibir WhatsApp | 24/7 / horario laboral |
| Q6 | ¿Fuera de horario: mensaje automático? | texto |

---

## R. Cronograma y lanzamiento

| # | Pregunta | Formato |
|---|---|---|
| R1 | Fecha objetivo de lanzamiento | dd/mm/yyyy |
| R2 | ¿Soft launch (sin anuncio) o lanzamiento publicitado? | soft / grande |
| R3 | Si publicitado: ¿campaña en redes? ¿presupuesto? | — |
| R4 | ¿Evento físico de lanzamiento? | sí / no |
| R5 | ¿Quieren staging URL antes? | sí (recomendado) / no |
| R6 | ¿Cuántas rondas de revisión incluye el paquete? | 1–3 típico |

---

## S. Post-lanzamiento

| # | Pregunta | Formato |
|---|---|---|
| S1 | ¿Quieren mantenimiento mensual? | sí + scope / no |
| S2 | ¿Con qué frecuencia cambiarán contenido? | raramente / mensual / semanal |
| S3 | ¿Necesitan panel admin para editar ellos mismos? | sí (costo extra) / no |
| S4 | ¿Quieren reporte de analytics mensual? | sí / no |
| S5 | Contacto de soporte una vez lanzado | nombre + email + horario |

---

## T. Observaciones finales

```
(Espacio libre: contexto que no encaja en las preguntas anteriores,
inquietudes, expectativas particulares, lo que nos ayudaría saber)




```

## Aprobación y firma

| Campo | Respuesta |
|---|---|
| Fecha de completado | |
| Completado por (nombre + cargo) | |
| Firma / aprobación explícita para proceder | |

---

_Versión 1.0 — abril 2026. Cualquier campo sin respuesta se asume con el valor por defecto del template. Si tienen dudas sobre un campo, marcarlo `??` y lo resolvemos juntos._
