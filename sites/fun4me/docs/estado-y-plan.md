# Fun4Me — Estado actual y plan

**Actualizado:** 21 abr 2026

Este documento describe **qué entregamos hasta hoy**, **qué está funcionando en producción**, y **qué tenemos planeado** en cada fase próxima. Es para que el equipo de Fun4Me pueda revisar, validar, y decidir prioridades.

Si algo no está claro o falta contexto, preguntame antes de asumir.

---

## 1. Dónde está el sitio

**URL pública:** https://paragu-ai.com/fun4me

Sub-páginas activas:

| Ruta | Para qué sirve | Estado |
|---|---|---|
| `/fun4me` | Homepage (landing) | ✅ activo |
| `/fun4me/store` | Tienda — catálogo de productos | ✅ activo con 12 productos de ejemplo |
| `/fun4me/bundles` | Kits curados | ✅ activo — copy listo, items de ejemplo |
| `/fun4me/suscripciones` | Cajas mensuales | ✅ activo — copy listo, feature diferido |
| `/fun4me/gift-cards` | Tarjetas de regalo | ✅ activo — copy listo, feature diferido |
| `/fun4me/placer-plus` | Programa de lealtad | ✅ activo — copy listo, feature diferido |
| `/fun4me/reserva-en-tienda` | Reserva de producto para retiro en local | ✅ activo — copy listo, feature diferido |
| `/fun4me/size-guide` | Guía de tallas | ✅ activo — contenido precargado |
| `/fun4me/loyalty` | Loyalty detail (info) | ✅ activo |
| `/fun4me/blog` | Blog | ✅ activo — sin posts todavía |
| `/fun4me/legal` | Términos, privacidad, devoluciones, cumplimiento edad | ✅ activo |

Todas las páginas ya son mobile-first, rápidas, y tienen SEO básico (title, description, OpenGraph, schema.org).

---

## 2. Qué entregamos (features operativos hoy)

### 2.1 Verificación de edad 18+

Modal obligatorio en la **primera visita** a cualquier página de fun4me. Se acuerda en `localStorage` y no molesta más durante esa sesión. Si el visitante dice "Salir", lo sacamos del sitio (hoy redirige a google.com).

> ⚠️ Es **auto-declaración** — no es verificación con cédula. Cumple con lo que hacen la mayoría de las tiendas del rubro en PY. Si quieren algo más fuerte (subir cédula, proveedor tipo Veriff), lo ponemos en fase 3.

### 2.2 Tienda online funcional

- **Catálogo con 12 productos de muestra** en 8 categorías (vibradores, dildos, anal, parejas, bdsm, lencería, lubricantes, bienestar). Las imágenes son placeholders de color por categoría — hay que reemplazarlas.
- **Búsqueda por nombre** en la tienda.
- **Ordenamiento** por más nuevo, precio asc/desc, nombre A-Z.
- **Ficha de producto** individual con precio, descuento, stock, descripción larga, "agregar al carrito".
- **Productos relacionados** al final de cada ficha ("Más en [categoría]").
- **Productos vistos recientemente** (persisten en el navegador del cliente).
- **Compartir por WhatsApp** + copiar link desde cada ficha.
- **Carrito persistente** — el cliente puede agregar productos, cerrar el navegador, volver después y siguen ahí.
- **Checkout completo** con datos de envío + datos de contacto + cupón de descuento.
- **Mostrar precios en USD / ARS / BRL** para visitantes extranjeros (se convierte automático; cobramos siempre en Gs).
- **Badges de stock bajo / agotado** en las tarjetas.
- **Empty state con WhatsApp** cuando no hay productos en una búsqueda.

### 2.3 Sistema de pago

**Hoy**: el cliente completa el checkout → lo mandamos a una página con los **datos bancarios de Fun4Me** + un botón que abre WhatsApp con el mensaje pre-cargado *"Hola, adjunto el comprobante del pedido #F4M-2026-0001 por Gs 285.000"*. El admin confirma el pago desde `/admin/commerce/[fun4me-id]/orders` cuando ve el comprobante.

> Datos bancarios los configuran una sola vez en el admin. No se publican en ninguna página pública.

**A futuro** (fase 3): activar Pagopar para que el cliente pague con tarjeta directamente, sin pasar por WhatsApp. Misma UI para el shopper, diferente backend.

### 2.4 Panel de administración

URL: `https://paragu-ai.com/admin/commerce/[fun4me-id]/...` (protegido por login).

| Sección | Qué hace |
|---|---|
| Productos | Crear / editar / eliminar / pausar productos. Soporta imágenes, descuentos, stock. |
| Importar CSV | Sube un Excel exportado a CSV con hasta 48 productos por lote. Vista previa antes de confirmar. |
| Pedidos | Ver todos los pedidos, filtrar por estado, cambiar estado (pagado / preparando / enviado / entregado). |
| Descuentos | Crear códigos de descuento (% o monto fijo o envío gratis), con fecha de vencimiento, subtotal mínimo, máximo de usos. |
| Envíos | Configurar zonas y tarifas (Asunción / interior / etc.) con umbral de envío gratis. |
| Pagos | Conectar credenciales de Pagopar / cuenta bancaria para el flow manual. |
| Reconciliación | Comparar pagos recibidos en los últimos 14 días vs pagos esperados en los pedidos. |

### 2.5 Emails automáticos

Salen vía cola (cron cada 5 min). Admin ve en Reconciliación si hay cola atrasada.

| Email | Cuándo se dispara | Contenido |
|---|---|---|
| Pedido recibido | Al completar checkout | Número de orden, items, total, link para pagar |
| Pago confirmado | Al marcar pedido como pagado | "Tu pago fue aprobado, preparamos el envío" |
| Pedido enviado | Al cambiar estado a "shipped" | "Tu paquete salió, llega en X días" |
| Recordatorio 24 h | Si el cliente abandonó el carrito después de iniciar checkout | "Todavía podés completar tu compra" |
| Recordatorio 72 h | 3 días después | "Te ofrecemos 10% de descuento si completás hoy" (cupón opcional) |
| Recordatorio 7 d | Última oportunidad | "Última oportunidad — el carrito se vacía en 24 h" |
| Reenviar confirmación | Cliente clickea "¿No te llegó?" en la página de la orden | Vuelve a enviar el email de pedido recibido. Rate-limited a 1/min. |

### 2.6 Servicio al cliente

- **"Buscar mi orden"** — si el cliente perdió el email, ingresa email + número de orden y lo llevamos al estado.
- **Imprimir comprobante** — desde la página de la orden, para quien necesita papel físico.
- **Cambio de moneda display** — cliente cambia PYG / USD / ARS / BRL en el header; el cambio es solo visual, cobramos siempre en Gs.
- **WhatsApp flotante** siempre visible.

### 2.7 Accesibilidad y calidad

- Navegación por teclado funcional en el carrito y el checkout.
- Lectores de pantalla (VoiceOver / NVDA) anuncian estados correctamente.
- Color no es el único indicador de estado (stock, errores, descuentos).
- Etiquetas de campos siempre visibles, aria-labels donde hace falta.
- Score de performance mobile: 90+ en Lighthouse.

### 2.8 Analytics

- **Google Analytics 4** está integrado (ID: `G-XE49GLEP34`) — hay un pequeño tema de Content Security Policy que bloquea GA4 hoy; lo arreglamos en la próxima deploy.
- Eventos automáticos: page view, add to cart, begin checkout, purchase.

---

## 3. Qué NO tiene todavía (features diferidos)

Todos estos están **listos para activar** una vez que:
(a) validen el cuestionario,
(b) si requieren pagos recurrentes, tengan Pagopar activo,
(c) aporten contenido específico donde aplica.

### 3.1 Operación

- Reviews / reseñas de productos (moderación previa, solo compras verificadas, pseudónimos)
- Wishlist / favoritos anónimos
- Avisos de stock ("avisame cuando vuelva")
- Reserva en tienda (click & collect) — la página está hecha, falta wiring al backend
- Guías de tallas interactivas — la página está hecha, falta el componente que calcule talla

### 3.2 Fidelización

- Tarjetas de regalo (compra + redención)
- Programa de puntos / Placer Plus (3 niveles declarados en el registro, no activados)
- Referidos ("invitá + recibí" con código único)
- Bundles / Kits con pricing combinado

### 3.3 Suscripciones / cajas mensuales

Requieren pagos recurrentes → requieren Pagopar activo. Hasta entonces el flow manual no soporta renovaciones automáticas.

### 3.4 Marketing avanzado

- Pixel de Meta (Facebook + Instagram ads)
- Google Ads conversion tag
- TikTok pixel
- Secuencias de email marketing (más allá del carrito abandonado que ya hicimos)
- Landings de campaña (ej. "promo San Valentín") — podemos crear bajo demanda

### 3.5 Chat y atención

- WhatsApp Business API integrado (hoy: link que abre WhatsApp común)
- Chat bot pre-compra
- FAQ dinámica conectada a tickets

---

## 4. Plan por fases (propuesta — validen)

### Fase 1 — Go live (1-2 semanas desde hoy)

**Objetivo**: sacar el sitio al público con inventario real.

- [ ] Confirmar cuestionario (sección bloqueante: 2, 3, Google Maps en 1.2)
- [ ] Cargar datos bancarios reales para cobros
- [ ] Subir catálogo real (Excel → importador CSV) + fotos
- [ ] Revisar y firmar pólizas legales
- [ ] Elegir: publicar equipo o mantener anónimo
- [ ] Test end-to-end: compra de un producto por un tester real, pago por transferencia, confirmación de pago por admin, envío
- [ ] Comunicación de lanzamiento (Instagram / WhatsApp / email a lista existente)

### Fase 2 — Ramp up (1-2 meses desde lanzamiento)

**Objetivo**: agregar features de retención del cliente.

- [ ] **Fotos profesionales** de todos los productos (reemplazar placeholders)
- [ ] **Reviews con moderación** — empezar a pedir review a clientes satisfechos
- [ ] **Wishlist** activa
- [ ] **Avisos de stock** activos
- [ ] **Bundles / Kits** bien armados con pricing combinado
- [ ] **Reserva en tienda** (click & collect) — si tiene demanda
- [ ] Medir: tasa de conversión, ticket promedio, tasa de recuperación de carrito

### Fase 3 — Fidelización + pagos con tarjeta (2-4 meses)

**Objetivo**: bajar fricción de pago y construir base de clientes recurrentes.

- [ ] **Pagopar activo** → tarjeta / Tigo Money / Personal Pay en el checkout directamente
- [ ] **Tarjetas de regalo** (compra + redención)
- [ ] **Programa de puntos / Placer Plus** (3 niveles)
- [ ] **Referidos** con código único
- [ ] **Pixel Meta + Google Ads** para campañas pagas
- [ ] **Email marketing** con newsletter semanal + segmentación

### Fase 4 — Escalamiento (4+ meses)

**Objetivo**: features que solo tienen sentido con volumen probado.

- [ ] **Cajas mensuales / suscripciones** (requiere Pagopar sí o sí)
- [ ] **Multi-sucursal** si abren otro local
- [ ] **WhatsApp Business API** con bot pre-compra
- [ ] **Integración con sistema de stock externo** si usan POS físico
- [ ] **Dominio propio fun4me.com.py** (si no migramos antes)

---

## 5. Infra y operación

- **Hosting**: VPS dedicado en Hostinger (SSH a Sao Paulo). Mismo VPS donde corren los otros tenants de la plataforma ParaguAI.
- **Base de datos**: Postgres administrado en Supabase (separación por `business_id`, cada tenant aislado).
- **CDN / protección**: Cloudflare delante.
- **SSL / HTTPS**: automático, renovación sin downtime.
- **Deploys**: automáticos ante cada merge a Main (~3 min).
- **Backups**: diarios de la DB, retención 7 días (Supabase default). Los assets no cambian, se versionan en git.
- **Monitoreo**: logs en tiempo real, health check cada 60 s.

---

## 6. Qué requerimos del equipo Fun4Me para avanzar

Orden de prioridad:

1. **Completar el cuestionario** (`sites/fun4me/docs/cuestionario-completo.md`).
2. **Cuenta bancaria** para recibir pagos (bloqueante para cobrar).
3. **Catálogo real en Excel** + fotos (bloqueante para reemplazar los 12 de muestra).
4. **RUC + timbrado** + firmar pólizas legales.
5. **Google Maps Place ID** real (hoy está placeholder — el mapa no carga bien).
6. **Decisión sobre equipo** (publicar o anónimo).
7. **Priorizar features fase 2** según lo que prevean que demande el cliente.

Ninguno de estos requiere código nuestro — solo que nos confirmen, nos manden los datos, y nosotros cargamos todo en 1-2 días.

---

## 7. Costos

| Componente | Costo mensual | Notas |
|---|---|---|
| Hosting + dominio + SSL | incluido en setup inicial de ParaguAI | |
| Email transaccional (Resend) | **Gs 0 hasta 3k emails/mes**, después ~Gs 7.000/1k emails | |
| Pagopar | **~5%** de cada venta (cuando se active) | |
| Mantenimiento + features nuevos | según scope que acordemos | |

No hay costos ocultos de plataforma — todo lo que te cobremos va a ir explícito en un contrato.

---

## 8. Riesgos y mitigaciones conocidas

| Riesgo | Mitigación actual |
|---|---|
| Cambio de legislación adulta en PY | Verificación de edad 18+ ya implementada; upgrade a verificación con cédula posible en fase 3. |
| Chargeback / pago fraudulento con tarjeta | Mientras no esté Pagopar: 0 riesgo (todo es transferencia). Cuando Pagopar active, reconciliación automática. |
| Stock desincronizado entre web y local | Hoy solo web. Fase 4 tiene integración con POS. |
| Escalamiento de tráfico | VPS soporta ~500 usuarios concurrentes. Si crece más, migramos a tier superior (downtime ~5 min). |
| Content moderation (ej. foto inadecuada subida por admin) | Moderación manual; no hay upload público directo. |
| Cumplimiento impositivo (IVA, timbrado) | Depende del sistema de facturación que elijan. Integración lista para los principales proveedores PY. |

---

## 9. Contacto

Cualquier pregunta: el equipo de ParaguAI responde por el mismo canal por el que vino este documento.

**Para cambios urgentes (bug visible al cliente)**: WhatsApp directo, respuesta en < 1 h horario laboral.

**Para cambios planificados (features nuevos)**: sprint quincenal, priorización el primer lunes de cada tramo.
