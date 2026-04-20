# 🐔 Granja Cabral - Comprehensive Website Plan

> **Client:** Laura Cabral - Granja Cabral  
> **Location:** Coronel Oviedo, Paraguay (Ruta 2, Km 125-140)  
> **Business Type:** Egg Farm / Granja Avícola  
> **Status:** Active operation, needs digital presence

---

## Executive Summary

This document outlines a complete website implementation plan for Laura's egg farm business. The Paragu-AI Builder platform already has an `egg_farm` business type configured, but it needs enhancement to fully support Laura's specific needs, including her multi-product offerings (fresh eggs, poultry meat, derived products), B2B wholesale operations, and expansion plans.

---

## 1. Business Analysis

### 1.1 Current Operations (From GitHub Repository)

**Core Business:**
- 🥚 **Primary Product:** Fresh eggs from 500+ laying hens (initial target)
- 🐔 **Secondary:** Poultry meat (chickens for consumption)
- 🌱 **By-products:** Organic fertilizer from chicken manure

**Target Market:**
- Hotels and restaurants (Ruta 2 paradores)
- Supermarkets
- Bakeries
- Institutions
- Direct consumers

**Geographic Focus:**
- Coronel Oviedo city center
- Ruta 2 corridor (Km 125-140)
- Surrounding areas

**Immediate Priorities:**
1. Formalize relationship with Churrasquería DECO (existing contact)
2. Reach 500 laying hens production capacity
3. Establish 5 regular B2B clients
4. Achieve operational break-even

### 1.2 Expansion Plans

**Phase 2 Products (Derived/Value-Added):**
- Liquid egg products
- Egg powder
- Pasta products (egg noodles)
- Mayonnaise and sauces
- Feather products
- Processed poultry

**Future Growth:**
- Physical store at Coronel Oviedo market
- Organic certification
- Brand development ("Granja Cabral")
- Potential export market

### 1.3 Competitive Advantages

1. **Local Production:** Fresh, daily-harvested eggs
2. **Route 2 Access:** Strategic location for tourism/restaurant corridor
3. **Quality Control:** Personalized farm management
4. **Sustainability:** Composting and waste transformation plans
5. **Direct Supply:** No intermediaries, competitive pricing

---

## 2. Website Requirements Analysis

### 2.1 Must-Have Sections

| Section | Priority | Purpose |
|---------|----------|---------|
| Hero | Critical | First impression, farm branding |
| Product Catalog | Critical | Showcase egg products, poultry, fertilizer |
| About/Farm Story | High | Build trust, tell Laura's story |
| Services/Wholesale | High | B2B information, bulk orders |
| Testimonials | High | Social proof from existing clients |
| Contact + WhatsApp | Critical | Direct communication channel |
| FAQ | Medium | Common questions about eggs, delivery |
| Gallery | Medium | Farm photos, facilities, chickens |
| Location/Map | High | Physical presence verification |

### 2.2 B2B-Specific Features

**For Hotels/Restaurants:**
- Volume pricing display
- Delivery schedule information
- Quality certifications
- Order minimums
- Account management (future)

**For Supermarkets:**
- Packaging options
- Delivery logistics
- Consistent supply guarantees
- Price lists

### 2.3 E-commerce Considerations

**Phase 1 (Immediate):**
- Product catalog with WhatsApp ordering
- Price transparency
- Order inquiry forms

**Phase 2 (Future):**
- Online ordering with MercadoPago
- Subscription delivery (weekly eggs)
- Customer accounts
- Order history

---

## 3. Current System Status

### 3.1 Existing Configuration

**✅ Already Exists:**
- `src/registry/egg_farm.type.json` - Basic type definition
- `src/tokens/egg_farm.tokens.json` - Theme (inherits agriculture vertical)
- `src/content/egg_farm.content.json` - Content templates (basic)

**❌ Missing for Laura's Needs:**
- Detailed product catalog structure
- B2B-specific content
- Wholesale pricing templates
- Delivery/service area information
- Gallery section configuration
- Farm-specific testimonials

### 3.2 Gap Analysis

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Registry file | ⚠️ Basic | Add sections array, features config |
| Tokens file | ⚠️ Inherits only | Customize for farm brand colors |
| Content file | ❌ Generic | Rewrite with egg farm specifics |
| Product categories | ❌ Missing | Define egg types, sizes, poultry |
| Pricing templates | ❌ Missing | Add retail and wholesale prices |
| Service areas | ❌ Missing | Define delivery zones |
| Gallery content | ❌ Missing | Photo placeholders |

---

## 4. Detailed Implementation Plan

### Phase 1: Enhanced Configuration (Week 1)

#### 4.1 Update Registry File

**File:** `src/registry/egg_farm.type.json`

```json
{
  "id": "egg_farm",
  "nameEs": "Granja de Huevos",
  "nameEn": "Egg Farm",
  "verticalId": "agriculture-agribusiness",
  "subVertical": "livestock-ranch",
  "extends": "agriculture_base",
  "tokens": "egg_farm",
  "category": "food_production",
  "sections": [
    "header",
    "hero",
    "productCatalog",
    "about",
    "services",
    "gallery",
    "testimonials",
    "faq",
    "contact",
    "footer",
    "whatsappFloat"
  ],
  "pages": {
    "homepage": {
      "sections": ["header", "hero", "productCatalog", "about", "services", "testimonials", "contact", "footer"],
      "requiredSections": ["header", "hero", "contact"]
    },
    "products": {
      "sections": ["header", "productCatalog", "faq", "footer"],
      "requiredSections": ["productCatalog"]
    },
    "about": {
      "sections": ["header", "about", "gallery", "footer"],
      "requiredSections": ["about"]
    }
  },
  "features": {
    "onlineBooking": { "enabled": false },
    "ecommerce": { "enabled": false, "future": true },
    "wholesale": { 
      "enabled": true,
      "label": "Venta por Mayor",
      "minimumOrder": "100 unidades"
    },
    "delivery": {
      "enabled": true,
      "label": "Delivery Disponible",
      "areas": ["Coronel Oviedo", "Ruta 2 Km 120-150"]
    },
    "whatsappFloat": { "enabled": true }
  },
  "nav": {
    "items": ["Inicio", "Productos", "Servicios", "Galería", "Contacto"],
    "cta": {
      "text": "Pedir por WhatsApp",
      "action": "whatsapp"
    }
  },
  "hero": {
    "headlineTemplate": "{{businessName}} - Huevos Frescos de Granja",
    "subheadlineTemplate": "Producción local en {{city}}. Calidad garantizada desde nuestra granja a tu mesa.",
    "ctaPrimary": { "text": "Hacer Pedido" },
    "ctaSecondary": { "text": "Ver Productos" }
  },
  "seo": {
    "schemaType": "LocalBusiness",
    "titleTemplate": "{{businessName}} | Huevos Frescos en {{city}} - Granja Local",
    "descriptionTemplate": "Huevos frescos de granja en {{city}}. Producción local, entrega a domicilio. Mayoristas y minoristas. ¡Contactanos!",
    "keywords": [
      "huevos frescos {{city}}",
      "granja de huevos {{city}}",
      "huevos de gallina {{city}}",
      "venta de huevos {{city}}",
      "huevo de granja {{city}}",
      "pollo para consumo {{city}}",
      "fertilizante organico {{city}}"
    ]
  }
}
```

#### 4.2 Update Tokens File

**File:** `src/tokens/egg_farm.tokens.json`

```json
{
  "$comment": "Granja Cabral - Warm, earthy farm aesthetic",
  "extends": "vertical:agriculture-agribusiness",
  "id": "egg_farm",
  "name": "Granja Cabral Theme",
  "colors": {
    "primary": "#e67e22",
    "primaryForeground": "#ffffff",
    "primaryLight": "#f39c12",
    "secondary": "#27ae60",
    "secondaryForeground": "#ffffff",
    "accent": "#f1c40f",
    "accentForeground": "#2c3e50",
    "background": "#fefcf8",
    "backgroundAlt": "#f9f7f2",
    "surface": "#ffffff",
    "surfaceAlt": "#f5f3ef",
    "text": "#2c3e50",
    "textMuted": "#7f8c8d",
    "border": "#e8e4dc",
    "success": "#27ae60",
    "warning": "#f39c12",
    "error": "#e74c3c"
  },
  "typography": {
    "fontHeading": "Merriweather",
    "fontBody": "Inter",
    "fontAccent": "Merriweather"
  },
  "theme": "light",
  "images": {
    "hero": { 
      "style": "farm-aerial",
      "keywords": ["chicken farm", "egg production", "free range chickens"]
    },
    "product": {
      "style": "product-photography",
      "background": "white",
      "lighting": "natural"
    },
    "gallery": {
      "categories": ["farm", "chickens", "eggs", "facilities", "team"]
    }
  }
}
```

#### 4.3 Update Content File

**File:** `src/content/egg_farm.content.json`

```json
{
  "id": "egg_farm",
  "locale": "es-PY",
  "hero": {
    "headline": "{{businessName}} - Huevos Frescos de Granja",
    "subheadline": "Producción local en {{city}}. Huevos frescos recolectados diariamente de nuestras gallinas criadas con cuidado y dedicación.",
    "ctaPrimary": "Hacer Pedido por WhatsApp",
    "ctaSecondary": "Ver Nuestros Productos"
  },
  "productCatalog": {
    "title": "Nuestros Productos",
    "subtitle": "Directo de nuestra granja a tu mesa",
    "categories": [
      {
        "id": "huevos",
        "name": "Huevos Frescos",
        "description": "Huevos de gallina criadas en ambiente natural, alimentación balanceada y cuidado diario.",
        "products": [
          {
            "name": "Huevos por Unidad",
            "description": "Huevos frescos recién recolectados",
            "priceRetail": "800 Gs",
            "priceWholesale": "600 Gs (docena+)",
            "image": "egg_single"
          },
          {
            "name": "Maple de 30 Huevos",
            "description": "Caja de 30 unidades - ideal para familias",
            "priceRetail": "22.000 Gs",
            "priceWholesale": "18.000 Gs",
            "image": "egg_carton_30"
          },
          {
            "name": "Bandeja de 12 Huevos",
            "description": "Docena fresca - perfecto para probar",
            "priceRetail": "9.500 Gs",
            "priceWholesale": "7.200 Gs",
            "image": "egg_dozen"
          }
        ]
      },
      {
        "id": "pollo",
        "name": "Pollo para Consumo",
        "description": "Pollos criados en nuestra granja, alimentados naturalmente, disponibles por pedido.",
        "products": [
          {
            "name": "Pollo Entero",
            "description": "Pollo limpio y listo para cocinar (aprox. 2-2.5kg)",
            "priceRetail": "35.000 Gs",
            "priceWholesale": "30.000 Gs (5+ unidades)",
            "image": "whole_chicken",
            "note": "Pedido con 24hs de anticipación"
          },
          {
            "name": "Pollito Tierno",
            "description": "Pollo joven, carne suave (aprox. 1-1.2kg)",
            "priceRetail": "22.000 Gs",
            "image": "young_chicken",
            "note": "Pedido con 24hs de anticipación"
          }
        ]
      },
      {
        "id": "fertilizante",
        "name": "Fertilizante Orgánico",
        "description": "Gallinaza compostada, excelente para huertas y jardines.",
        "products": [
          {
            "name": "Bolsa de 10kg",
            "description": "Fertilizante orgánico compostado",
            "priceRetail": "15.000 Gs",
            "priceWholesale": "12.000 Gs (5+ bolsas)",
            "image": "fertilizer_bag"
          }
        ]
      }
    ],
    "orderButtonText": "Consultar por WhatsApp",
    "orderMessageTemplate": "Hola! Me interesa {{productName}} ({{productPrice}}). ¿Está disponible?",
    "wholesaleCta": {
      "title": "¿Necesitas cantidades mayores?",
      "description": "Ofrecemos precios especiales para restaurantes, hoteles, panaderías y supermercados.",
      "buttonText": "Consultar Precios Mayoristas"
    }
  },
  "about": {
    "title": "Sobre {{businessName}}",
    "content": "Somos una granja familiar dedicada a la producción de huevos frescos de alta calidad. Ubicados en {{city}}, nos enorgullece ofrecer productos locales, frescos y saludables a nuestra comunidad.",
    "sections": [
      {
        "title": "Producción Local",
        "content": "Nuestras gallinas son criadas en ambiente natural, con alimentación balanceada y cuidado diario. Recolectamos los huevos todos los días para garantizar máxima frescura."
      },
      {
        "title": "Calidad Garantizada",
        "content": "Cada huevo es revisado antes de la venta. Nos comprometemos a ofrecer productos frescos y de la mejor calidad a precios justos."
      },
      {
        "title": "Compromiso con la Comunidad",
        "content": "Apoyamos la economía local y nos esforzamos por ser un proveedor confiable para familias, restaurantes y comercios de la zona."
      }
    ],
    "stats": [
      { "value": "500+", "label": "Gallinas ponedoras" },
      { "value": "100%", "label": "Producción local" },
      { "value": "Diario", "label": "Recolección fresca" }
    ]
  },
  "services": {
    "title": "Servicios",
    "subtitle": "Además de nuestros productos, ofrecemos:",
    "items": [
      {
        "name": "Delivery a Domicilio",
        "description": "Llevamos tus huevos frescos hasta tu puerta en Coronel Oviedo y zonas cercanas de Ruta 2.",
        "icon": "truck",
        "details": "Consultar zonas de cobertura y costos de envío"
      },
      {
        "name": "Venta por Mayor",
        "description": "Suministro regular para restaurantes, hoteles, panaderías y supermercados.",
        "icon": "building",
        "details": "Descuentos especiales desde 100 unidades"
      },
      {
        "name": "Pedidos Programados",
        "description": "Establece una rutina de entrega semanal o quincenal para tu hogar o negocio.",
        "icon": "calendar",
        "details": "Garantizamos suministro constante"
      }
    ]
  },
  "testimonials": [
    {
      "quote": "Los huevos son fresquísimos, se nota la diferencia. El delivery es muy puntual.",
      "author": "María G.",
      "location": "Coronel Oviedo",
      "rating": 5,
      "type": "cliente"
    },
    {
      "quote": "Excelente calidad para mi panadería. Mis clientes notan la diferencia en los productos horneados.",
      "author": "Don José",
      "location": "Panadería San José",
      "rating": 5,
      "type": "negocio"
    },
    {
      "quote": "Proveedor confiable, siempre cumplen con los pedidos y la calidad es consistente.",
      "author": "Restaurante La Tradición",
      "location": "Ruta 2",
      "rating": 5,
      "type": "restaurante"
    }
  ],
  "faq": [
    {
      "q": "¿De dónde vienen sus huevos?",
      "a": "Todos nuestros huevos provienen de nuestra granja ubicada en {{city}}, Ruta 2 Km 125-140. Las gallinas son criadas localmente con alimentación balanceada y cuidado diario."
    },
    {
      "q": "¿Hacen delivery? ¿A qué zonas?",
      "a": "Sí, realizamos delivery en Coronel Oviedo y zonas cercanas de Ruta 2 (Km 120-150). El costo depende de la distancia. Consultanos por WhatsApp para confirmar tu zona."
    },
    {
      "q": "¿Tienen precios especiales para negocios?",
      "a": "Sí, ofrecemos precios mayoristas para restaurantes, hoteles, panaderías y supermercados. Los descuentos aplican desde 100 unidades. Contactanos para más detalles."
    },
    {
      "q": "¿Cómo puedo hacer un pedido?",
      "a": "Podés hacer tu pedido por WhatsApp al {{whatsapp}}. Respondemos rápido y coordinamos entrega. También podés pasar a retirar directamente en nuestra granja."
    },
    {
      "q": "¿Cuánto duran los huevos?",
      "a": "Nuestros huevos son recolectados diariamente. Si se mantienen refrigerados, duran hasta 4-5 semanas. En temperatura ambiente, se recomienda consumirlos dentro de 2-3 semanas."
    },
    {
      "q": "¿Venden pollos vivos o procesados?",
      "a": "Vendemos pollos limpios y listos para cocinar. Los pedidos deben hacerse con 24 horas de anticipación. No vendemos pollos vivos."
    }
  ],
  "gallery": {
    "title": "Nuestra Granja",
    "subtitle": "Conocé dónde producimos tus huevos",
    "categories": [
      { "name": "La Granja", "description": "Instalaciones y galpones" },
      { "name": "Gallinas", "description": "Nuestras ponedoras" },
      { "name": "Productos", "description": "Huevos frescos" },
      { "name": "Equipo", "description": "Quienes hacemos Granja Cabral" }
    ]
  },
  "contact": {
    "title": "Contactanos",
    "subtitle": "Estamos listos para atenderte",
    "methods": [
      {
        "type": "whatsapp",
        "label": "WhatsApp",
        "description": "La forma más rápida de hacer pedidos",
        "action": "Escribir Ahora"
      },
      {
        "type": "phone",
        "label": "Teléfono",
        "description": "Llamanos para consultas",
        "hours": "Lunes a Sábado, 7:00 a 18:00"
      },
      {
        "type": "visit",
        "label": "Visitanos",
        "description": "Ruta 2, Km 125-140, Coronel Oviedo",
        "hours": "Lunes a Sábado, 8:00 a 17:00"
      }
    ],
    "formFields": {
      "name": "Tu Nombre",
      "phone": "Teléfono",
      "email": "Email (opcional)",
      "message": "¿Qué necesitás?",
      "submit": "Enviar Mensaje"
    }
  },
  "whatsapp": {
    "defaultMessage": "Hola! Vi su página web y me interesa hacer un pedido de huevos. ¿Me podés dar más información?",
    "wholesaleMessage": "Hola! Represento a un negocio/restaurante y me interesa conocer sus precios mayoristas. ¿Podemos coordinar?"
  },
  "footer": {
    "tagline": "{{businessName}} - Huevos frescos de granja en {{city}}",
    "description": "Producción local, calidad garantizada. Desde nuestra granja a tu mesa.",
    "quickLinks": ["Inicio", "Productos", "Servicios", "Contacto"],
    "socialLinks": ["whatsapp"],
    "copyright": "© {{year}} {{businessName}}. Todos los derechos reservados."
  }
}
```

---

## 5. Visual Design Recommendations

### 5.1 Color Palette

Based on the farm/egg business nature:

**Primary Colors:**
- `#e67e22` - Carrot Orange (warm, appetizing)
- `#f39c12` - Sunflower Yellow (egg yolk inspired)
- `#27ae60` - Farm Green (natural, organic)

**Secondary Colors:**
- `#f5f3ef` - Eggshell White
- `#fefcf8` - Cream Background
- `#2c3e50` - Dark Text

### 5.2 Typography

- **Headings:** Merriweather (serif, trustworthy, traditional)
- **Body:** Inter (clean, modern, readable)

### 5.3 Image Strategy

**Required Images (Phase 1):**

1. **Hero Image:** Aerial view of chicken farm or golden eggs in basket
2. **Product Images:**
   - Eggs in carton (30 pack)
   - Single fresh egg (yolk visible)
   - Dozen eggs
   - Whole chicken (prepared)
3. **Gallery Images:**
   - Chicken coop facilities
   - Happy chickens free-ranging
   - Laura working at the farm
   - Egg collection process

**Image Style:**
- Warm, natural lighting
- Earthy tones
- Authentic farm aesthetic
- High quality but not overly polished (authenticity matters)

---

## 6. Content Strategy

### 6.1 Key Messages

**Main Value Proposition:**
> "Huevos frescos de granja, recolectados diariamente en Coronel Oviedo. Directo de nuestras gallinas a tu mesa."

**Supporting Messages:**
- Producción local = frescura garantizada
- Alimentación natural de las gallinas
- Apoyo a la economía local
- Precios justos, calidad superior

### 6.2 Tone of Voice

- **Warm and friendly** (like a neighbor)
- **Trustworthy and professional** (businesses need reliability)
- **Proud but humble** (family farm, not corporate)
- **Community-focused** (local pride)

### 6.3 SEO Keywords (Spanish)

**Primary:**
- huevos frescos coronel oviedo
- granja de huevos paraguay
- huevos de granja ruta 2

**Secondary:**
- venta de huevos al por mayor
- pollo para consumo coronel oviedo
- fertilizante organico paraguay
- proveedor de huevos restaurantes

**Long-tail:**
- donde comprar huevos frescos en coronel oviedo
- huevos de gallina criada libre paraguay
- delivery de huevos coronel oviedo

---

## 7. Technical Implementation Checklist

### 7.1 Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `src/registry/egg_farm.type.json` | Update with sections & features | High |
| `src/tokens/egg_farm.tokens.json` | Customize colors & typography | High |
| `src/content/egg_farm.content.json` | Rewrite with specific content | High |
| `web/lib/engine/demo-data.ts` | Add Laura's demo business | Medium |
| `web/lib/types.ts` | Ensure egg_farm in BusinessType enum | Low (exists) |

### 7.2 Database Setup

**Supabase Tables Needed:**
- `businesses` - Laura's business record
- `generated_sites` - Website configuration
- `site_pages` - Individual pages
- `site_assets` - Images (if using CMS)

**Sample Business Record:**
```json
{
  "slug": "granja-cabral",
  "name": "Granja Cabral",
  "type": "egg_farm",
  "tagline": "Huevos frescos de granja en Coronel Oviedo",
  "city": "Coronel Oviedo",
  "address": "Ruta 2, Km 125-140",
  "phone": "+595 981 000 000",
  "whatsapp": "+595 981 000 000",
  "email": "info@granjacabral.com",
  "hours": {
    "Lunes - Sábado": "07:00 - 18:00",
    "Domingo": "Cerrado"
  },
  "social": {
    "whatsapp": "+595981000000"
  }
}
```

### 7.3 Section Components Mapping

| Content Section | Component | Status |
|-----------------|-----------|--------|
| Header | header-section | ✅ Exists |
| Hero | hero-section | ✅ Exists |
| Product Catalog | product-catalog-section | ✅ Exists |
| About | features-section (modified) | ✅ Exists |
| Services | services-section | ✅ Exists |
| Gallery | gallery-section | ✅ Exists |
| Testimonials | testimonials-section | ✅ Exists |
| FAQ | faq-section | ✅ Exists |
| Contact | contact-section | ✅ Exists |
| Footer | footer-section | ✅ Exists |
| WhatsApp Float | whatsapp-float | ✅ Exists |

---

## 8. Launch Checklist

### Pre-Launch (Week 1)

- [ ] Update registry file with complete configuration
- [ ] Customize tokens with farm-appropriate colors
- [ ] Write complete content templates
- [ ] Add Laura's business to demo-data.ts
- [ ] Test site generation locally
- [ ] Review mobile responsiveness

### Content Preparation (Week 1-2)

- [ ] Get Laura's actual contact information
- [ ] Collect high-quality photos:
  - [ ] Farm aerial/overview shot
  - [ ] Chicken coop
  - [ ] Eggs (cartons, individual)
  - [ ] Laura at work
  - [ ] Chicken close-ups
- [ ] Verify product pricing with Laura
- [ ] Confirm delivery areas and fees
- [ ] Get any existing customer testimonials

### Launch Week (Week 2)

- [ ] Deploy to Cloudflare Pages
- [ ] Configure custom domain (if desired)
- [ ] Set up Google Analytics
- [ ] Test all WhatsApp links
- [ ] Verify contact form delivery
- [ ] Test mobile experience
- [ ] Submit to Google Search Console

### Post-Launch (Week 3+)

- [ ] Monitor site analytics
- [ ] Collect user feedback
- [ ] Optimize based on search performance
- [ ] Add more testimonials as they come
- [ ] Update product photos seasonally
- [ ] Consider adding online ordering (Phase 2)

---

## 9. Future Enhancements (Phase 2)

### 9.1 E-commerce Integration

- MercadoPago integration for online payments
- Shopping cart functionality
- Subscription ordering (weekly delivery)
- Order tracking

### 9.2 B2B Portal

- Customer account login
- Order history
- Automated reordering
- Invoice generation
- Credit terms for established clients

### 9.3 Content Marketing

- Blog/recipe section
- Nutritional information
- Farm updates/newsletter
- Social media integration
- Email marketing signup

### 9.4 Advanced Features

- Live chat support
- Multi-language (Guaraní)
- Delivery route optimization
- Inventory management integration
- QR codes for product traceability

---

## 10. Budget & Timeline Estimate

### Development Time

| Task | Hours | Cost (if outsourced) |
|------|-------|---------------------|
| Configuration updates | 4 hrs | $100-200 |
| Content writing | 6 hrs | $150-300 |
| Image sourcing/editing | 4 hrs | $100-200 |
| Testing & QA | 3 hrs | $75-150 |
| Deployment & setup | 2 hrs | $50-100 |
| **Total** | **~20 hrs** | **$475-950** |

### Ongoing Costs

| Service | Monthly Cost |
|---------|-------------|
| Cloudflare Pages | Free |
| Supabase (hobby) | Free - $25 |
| Domain (optional) | $10-15/year |
| **Total Monthly** | **$0-25** |

### Recommended Investment Priority

1. **Phase 1 (Immediate):** $0-100 - Use existing platform, free hosting
2. **Phase 2 (3-6 months):** $200-500 - E-commerce, custom domain, marketing
3. **Phase 3 (6-12 months):** $500-1000 - B2B portal, advanced features

---

## 11. Success Metrics

### Website KPIs

| Metric | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|
| Monthly visitors | 100 | 300 |
| WhatsApp inquiries | 20/month | 50/month |
| Contact form submissions | 5/month | 15/month |
| Average session duration | 2+ min | 3+ min |
| Mobile traffic | 70%+ | 70%+ |

### Business KPIs

| Metric | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|
| New B2B clients acquired | 2 | 5 |
| Direct consumer orders | 10/week | 30/week |
| Brand recognition | Local | Regional |

---

## 12. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Laura too busy to provide content | Medium | Medium | Provide templates, do interviews |
| Poor quality photos | Medium | High | Hire local photographer or use stock |
| Low initial traffic | Low | Low | Focus on WhatsApp/SEO, word-of-mouth |
| Technical issues | Low | Medium | Test thoroughly, have backup plan |
| Competitors copy site | Medium | Low | Keep content fresh, build brand loyalty |

---

## 13. Next Steps

### Immediate Actions (This Week)

1. **Review this plan** with Laura and get feedback
2. **Gather assets:**
   - High-resolution farm photos
   - Laura's contact details
   - Current pricing information
   - Any existing customer testimonials
3. **Approve design direction** - colors, tone, imagery
4. **Prioritize features** - must-haves vs nice-to-haves

### Week 1 Tasks

1. Update egg_farm type configuration files
2. Generate initial website preview
3. Review with Laura for feedback
4. Iterate based on feedback

### Week 2 Tasks

1. Finalize content and images
2. Deploy production website
3. Configure domain and analytics
4. Train Laura on basic updates

---

## Appendix A: Content Templates

### WhatsApp Message Templates

**Retail Inquiry:**
```
Hola! Vi tu página web y me interesa hacer un pedido de huevos. 
¿Me podés dar más información sobre precios y delivery?
```

**Wholesale Inquiry:**
```
Hola! Represento a [nombre del negocio] y estamos buscando 
proveedor de huevos. Me interesa conocer sus precios mayoristas. 
¿Podemos coordinar una llamada?
```

**Order Template:**
```
Hola! Quiero hacer un pedido:
- [ ] Maple de 30 huevos
- [ ] Bandeja de 12 huevos  
- [ ] Pollo entero
- [ ] Bolsa de fertilizante

Dirección: [tu dirección]
```

### Email Templates

**Order Confirmation:**
```
Asunto: Confirmación de pedido - Granja Cabral

Hola [Nombre],

Gracias por tu pedido. Te confirmamos:

Productos: [lista]
Total: [monto]
Dirección: [dirección]
Fecha estimada de entrega: [fecha]

Cualquier consulta, escribinos por WhatsApp.

Saludos,
Laura - Granja Cabral
```

---

## Appendix B: Technical Notes

### Section Mapping for egg_farm

```typescript
// In web/lib/engine/compose.ts
const SECTION_MAP: Record<string, string> = {
  // ... existing mappings
  productCatalog: 'product-catalog-section',
  products: 'product-catalog-section',
  about: 'features-section',
  services: 'services-section',
  gallery: 'gallery-section',
  testimonials: 'testimonials-section',
  faq: 'faq-section',
  contact: 'contact-section',
  whatsappFloat: 'whatsapp-float',
}
```

### Type Definition Addition

```typescript
// In web/lib/types.ts (if not exists)
export type BusinessType = 
  | 'egg_farm'
  | 'dairy_farm'
  | 'poultry_farm'
  // ... other types
```

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Prepared by:** Paragu-AI Builder Team  
**For:** Laura Cabral - Granja Cabral
