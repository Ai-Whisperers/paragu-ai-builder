# Client Onboarding Flow

## Overview

This document defines the end-to-end workflow for onboarding a new client to the ParaguAI platform.

## Pre-Onboarding Checklist

Before starting onboarding, verify:

- [ ] Client has signed contract
- [ ] Domain is available (or client has custom domain)
- [ ] Client WhatsApp contact established
- [ ] Initial content gathered (via questionnaire)
- [ ] Payment method configured (Stripe)
- [ ] Subdomain ready on Cloudflare (if using *.paragu-ai.com)

---

## Phase 1: Discovery & Questionnaire (Day 0-1)

### Step 1.1: Send Questionnaire

Send the client questionnaire via WhatsApp:

```
👋 ¡Hola! Vamos a crear tu sitio web con ParaguAI.

Por favor, responde estas 7 preguntas rápidas:

1. **Nombre del negocio**
2. **Vertical / Rubro** (ej. restaurant, gimnasio, ecommerce)
3. **Ubicación** (barrio/ciudad)
4. **Teléfono de contacto**
5. **WhatsApp de contacto**
6. **Email de contacto**
7. **Link de Google Maps** (si existe)

Cuando tengas esto, te paso el borrador de tu sitio 🎨
```

### Step 1.2: Collect Client Content

Gather from client:
- Logo (PNG/SVG preferred)
- Hero image (high-res photo)
- Business description (2-3 sentences)
- Services/products list
- Contact info (address, phone, WhatsApp, email)
- Opening hours (if applicable)
- Social media links (if applicable)

### Step 1.3: Choose Template

Based on client's vertical, select from `demo-*` templates:

| Vertical | Template |
|----------|----------|
| Restaurant | `demo-restaurant` |
| Gym | `demo-gimnasio` |
| Barbería | `demo-barberia` |
| Bodega | `demo-bodega` |
| E-commerce | `demo-tienda` |
| Professional services | `demo-bufete-estudio` |

---

## Phase 2: Platform Setup (Day 1)

### Step 2.1: Create Supabase Tenant

Via Supabase Dashboard or API:

```sql
INSERT INTO site_content (tenant_slug, locale, key_path, content)
VALUES
  ('new-client', 'es', '__config__.vertical', 'restaurant'),
  ('new-client', 'es', '__config__.domain', 'newclient.com'),
  ('new-client', 'es', '__config__.locales', '["es"]'),
  ('new-client', 'es', '__config__.status', 'active'),
  ('new-client', 'es', '__config__.plan', 'starter');
```

### Step 2.2: Clone Template Content

Copy from demo template:

```bash
# For each locale
curl "https://qyvokpribmbrosafntqa.supabase.co/rest/v1/site_content?tenant_slug=eq.demo-restaurant&locale=eq.es" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" | \
  jq '.[] | .tenant_slug = "new-client"' | \
  curl -X POST "https://qyvokpribmbrosafntqa.supabase.co/rest/v1/site_content" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d @-
```

### Step 2.3: Configure DNS

**Option A: Subdomain (*.paragu-ai.com)**

In Cloudflare (use DNS panel, not API - token is read-only):
```
Type: A
Name: newclient
IPv4: 72.61.44.159
TTL: Auto
Proxy: Off (DNS only)
```

**Option B: Custom Domain**

1. Client logs into their domain registrar (GoDaddy, Namecheap, etc.)
2. Updates nameservers to Cloudflare (if using Cloudflare DNS)
3. Or creates A record pointing to `72.61.44.159`

### Step 2.4: Create GitHub Repo (Optional)

For marketing/SEO:

```bash
gh repo create new-client --public --description "Sitio web de new-client"
cd /tmp && gh repo clone Ai-Whisperers/new-client
cd new-client
cat > README.md << 'EOF'
# New Client

Sitio web de New Client.

## 🌐 Sitio en Vivo

https://newclient.com

## 🏗️ Gestión

Este sitio es gestionado a través de la plataforma ParaguAI. El contenido se actualiza en tiempo real vía CMS.

Para cambios de contenido, contactar a Ai-Whisperers:
- WhatsApp: +595 981 123 456
- Email: hola@paragu-ai.com
EOF
git add README.md
git commit -m "Initial commit - README only"
git push
```

---

## Phase 3: Content Customization (Day 1-2)

### Step 3.1: Update Basic Content

Via Supabase Dashboard or API:

```bash
# Update business name
curl -X PATCH "https://qyvokpribmbrosafntqa.supabase.co/rest/v1/site_content?tenant_slug=eq.new-client&locale=eq.es&key_path=eq.siteName" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content": "New Client Name"}'
```

### Step 3.2: Upload Assets

Via Supabase Storage:
- Upload logo to `public/tenants/new-client/logo.png`
- Upload hero image to `public/tenants/new-client/hero.jpg`
- Update content to reference new URLs

### Step 3.3: Customize Sections

Edit page sections (hero, services, contact, etc.) with client-specific content.

---

## Phase 4: QA & Testing (Day 2)

### Step 4.1: Functional Tests

```bash
# Test subdomain resolves
curl -I https://newclient.paragu-ai.com

# Test mobile responsiveness
# (Manual: open in mobile browser or use Chrome DevTools)

# Test all links work
# (Manual: click through navigation)

# Test contact form submits
# (Manual: fill out and submit form)

# Test WhatsApp button works
# (Manual: click button, verify link)
```

### Step 4.2: SEO Checklist

```bash
# Check meta tags
curl -s https://newclient.paragu-ai.com | grep -E "<title|<meta name=description"

# Check sitemap exists
curl -I https://newclient.paragu-ai.com/sitemap.xml

# Check robots.txt exists
curl -I https://newclient.paragu-ai.com/robots.txt
```

### Step 4.3: Performance

```bash
# Run Lighthouse (via Chrome DevTools or lighthouse CLI)
lighthouse https://newclient.paragu-ai.com --view
```

**Targets:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >100

---

## Phase 5: Launch & Handoff (Day 3)

### Step 5.1: Client Review

Send client link + checklist:

```
🎉 ¡Tu sitio está listo para revisar!

🌐 Sitio: https://newclient.paragu-ai.com

Por favor, revisa:
- ✅ Nombre del negocio correcto
- ✅ Teléfono y WhatsApp funcionan
- ✅ Dirección correcta
- ✅ Horarios correctos (si aplica)
- ✅ Links de redes sociales funcionan

¿Todo bien? Confirma y lo publicamos oficialmente 🚀
```

### Step 5.2: Final Tweaks

Make any client-requested changes (minor edits only).

### Step 5.3: Publish

- Update status in Supabase: `__config__.status = "published"`
- Confirm DNS is live
- Verify SSL certificate (auto-provisioned by Cloudflare)

### Step 5.4: Client Handoff

Send final message:

```
🚀 ¡Tu sitio está publicado!

🌐 Sitio en vivo: https://newclient.paragu-ai.com

📱 Para cambios de contenido:
- Texto, fotos, productos → Pedir via WhatsApp
- Actualización en 24 horas

🔒 Tu cuenta:
- Panel de administración: (URL pendiente)
- Login: (pendiente)

¿Preguntas? Estamos aquí 💬
```

---

## Phase 6: Post-Launch (Ongoing)

### Step 6.1: Monitoring

- Check uptime (via Cron health check)
- Monitor performance (via Lighthouse CI)
- Track SEO ranking (via weekly audit)

### Step 6.2: Content Updates

Client requests content changes → Submit via WhatsApp → Update via Supabase → Live instantly.

### Step 6.3: Monthly Check-in

Send monthly performance report:

```
📊 Reporte mensual - newclient.com

👁️ Visitas este mes: X
📱 Dispositivos: X% móvil, X% desktop
⏱️ Tiempo promedio: X segundos
🔍 Ranking Google: (si aplica)

¿Quieres cambios en tu sitio?
```

---

## Automation Opportunities

### Automated Onboarding Script

```bash
./scripts/onboard-client.sh \
  --tenant new-client \
  --vertical restaurant \
  --domain newclient.com \
  --locales es \
  --template demo-restaurant
```

This would:
1. Create Supabase tenant
2. Clone template content
3. Create DNS record (via Cloudflare API if we have write access)
4. Send WhatsApp confirmation
5. Create GitHub repo (optional)

### Automated QA

```bash
./scripts/test-tenant.sh --tenant new-client
```

This would run all functional + SEO + performance tests automatically.

---

## Summary

**Timeline: 3 days**

- Day 0-1: Discovery & questionnaire
- Day 1: Platform setup + DNS
- Day 1-2: Content customization
- Day 2: QA & testing
- Day 3: Launch & handoff

**Touchpoints with client:**
1. Questionnaire (WhatsApp)
2. Preview link (WhatsApp)
3. Launch confirmation (WhatsApp)
4. Monthly reports (WhatsApp/Email)

**Client Git involvement:**
- None (unless specifically requested)
- Content managed via CMS only
- GitHub is marketing artifact, not operational