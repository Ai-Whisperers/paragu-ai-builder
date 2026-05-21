# ROADMAP — Beauty Vertical (HairSalon)

## Status: May 2026

## ✅ COMPLETED

### Fase 0 — Cleanup
- [x] Eliminado `hair_salon.type.json` (duplicado de 22 lines del `peluqueria` de 205 lines)
- [x] Eliminado `hair_salon.schema.json` (properties vacio)
- [x] Eliminado `hair_salon.content.json` (generico de 50 lines)
- [x] Eliminado `hair_salon.tokens.json` (solo extends)
- [x] Eliminada referencia en `web/lib/engine/data/index.ts` (auto-generated shard)
- [x] Eliminada referencia en `web/lib/engine/data/beauty-personal-care.ts` (auto-generated shard)
- [x] Eliminada referencia en `src/registry/stub-catalog.json`
- [x] Actualizado `docs/GLOBAL_BUSINESS_TYPE_ENUMERATION.md`
- `peluqueria` es ahora el unico tipo canonico para Hair Salon

### Fase 1 — Supabase Seeding
- [x] Seed de contenido template en `site_content` (tenant_slug=`__template__`)
- [x] 39 rows seedeados: 16 de peluqueria, 12 de barberia, 11 de salon_belleza
- [x] Product catalog seed: shampoo, acondicionador, cera, spray, mascarilla
- [x] FAQ con preguntas reales de peluqueria y barberia
- [x] WhatsApp templates con placeholders para cada business type

## 🔲 PENDING

### Fase 2 — WhatsApp Outreach
- [ ] 10 leads calientes identificados (todos priority 95+)
- [ ] Mensajes de outreach pre-generados en `sites/outreach-messages.json`
- [ ] WA links generados para cada lead
- [ ] **Pendiente:** QR code pairing en WhatsApp Connect (http://72.61.44.159:30003)
- [ ] **Pendiente:** Envio de mensajes via Evolution API
- [ ] **Pendiente:** Seguimiento a los 5 con preview ya generado (guillen-barber, galilea, etc.)

### Fase 3 — Productizar Vertical
- [ ] Pricing tier especifico para beauty (peluquerias/barberias/spas)
- [ ] Pack de imagenes stock de Paraguay para galerias (WebP, <200KB, 4:3)
- [ ] Integracion Fresha/Square para booking online
- [ ] Templates de WhatsApp para follow-up post-outreach
- [ ] Pagina de precios generica: desde 50.000 Gs/mes (hosting + dominio + mantenimiento)

### Fase 4 — Escalar
- [ ] Reactivar 27 leads del _archive (todos hair/beauty)
- [ ] Reactivar outreach completo: ~82 leads beauty del total de 99
- [ ] Configurar cron para lead discovery semanal (Google Maps + Firecrawl)
- [ ] Automatizar outreach con Evolution API (cuando este conectado)
- [ ] Dashboard leads en admin para Kiki

## 📊 Metricas

- 3 demos funcionales en prod (peluqueria, barberia, salon_belleza)
- 3 business types con registry completo (peluqueria=205 lines, barberia=191, salon_belleza=187)
- 1 preview activo con lead real (guillen-barber, Fernando de la Mora)
- 99 leads totales en outreach-messages.json
- 82 leads beauty (57 peluqueria, 6 barberia, 12 spa, 4 depilacion, 3 maquillaje)
- 27 previews beauty en _archive
- 39 rows seedeados en Supabase site_content

## 🔗 Links

- Demo Peluqueria: https://paragu-ai.com/s/es/demo-peluqueria
- Demo Barberia: https://paragu-ai.com/s/es/demo-barberia
- Demo Salon Belleza: https://paragu-ai.com/s/es/demo-salon-belleza
- Preview Guillen Barber: https://paragu-ai.com/s/es/preview-guillen-barber
- Preview Galilea Estetica: https://paragu-ai.com/s/es/preview-galilea-estetica
- WhatsApp Connect: http://72.61.44.159:30003 (necesita QR pairing)
