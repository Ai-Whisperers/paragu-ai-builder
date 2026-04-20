# Adding Business Types

Guide for adding new business types to Paragu-AI Builder.

## Overview

Each business type requires 4 configuration files:

1. **Registry** (`src/registry/[type].type.json`) - Sections and features
2. **Tokens** (`src/tokens/[type].tokens.json`) - Colors and typography
3. **Content** (`src/content/[type].content.json`) - Copy templates
4. **Schema** (`src/schemas/[type].schema.json`) - Validation (optional)

## Step-by-Step Guide

### 1. Create Registry File

```bash
# Create registry file
touch src/registry/plumber.type.json
```

```json
{
  "id": "plumber",
  "nameEs": "Servicios de Plomería",
  "nameEn": "Plumbing Services",
  "tokens": "plumber",
  "category": "home_services",
  "sections": [
    "header",
    "hero",
    "services",
    "emergencyIndicator",
    "testimonials",
    "contact",
    "footer",
    "whatsappFloat"
  ],
  "pages": {
    "homepage": {
      "sections": ["header", "hero", "services", "emergencyIndicator", "testimonials", "contact", "footer"],
      "requiredSections": ["header", "hero", "contact"]
    },
    "services": {
      "sections": ["header", "services", "quoteForm", "footer"],
      "requiredSections": ["services"]
    }
  },
  "features": {
    "onlineBooking": {
      "enabled": false
    },
    "emergency": {
      "enabled": true,
      "label": "Emergencias 24hs"
    },
    "whatsappFloat": {
      "enabled": true
    }
  },
  "nav": {
    "items": ["Inicio", "Servicios", "Testimonios", "Contacto"],
    "cta": {
      "text": "Llamar Ahora",
      "action": "tel"
    }
  },
  "hero": {
    "headlineTemplate": "{{businessName}} - Plomero Profesional en {{city}}",
    "subheadlineTemplate": "Servicio rápido, garantizado y sin sorpresas",
    "ctaPrimary": {
      "text": "Solicitar Presupuesto"
    },
    "ctaSecondary": {
      "text": "Ver Servicios"
    }
  },
  "seo": {
    "titleTemplate": "{{businessName}} | Plomero en {{city}} - Servicio 24hs",
    "descriptionTemplate": "Servicios de plomería profesional en {{city}}. Reparaciones, instalaciones y emergencias 24 horas. ¡Llámanos ahora!"
  }
}
```

### 2. Create Tokens File

```bash
touch src/tokens/plumber.tokens.json
```

```json
{
  "id": "plumber",
  "extends": "base",
  "name": "Plumber Theme",
  "colors": {
    "primary": "#1e40af",
    "primaryForeground": "#ffffff",
    "secondary": "#3b82f6",
    "secondaryForeground": "#ffffff",
    "surfaceLight": "#eff6ff",
    "success": "#22c55e",
    "warning": "#f59e0b",
    "error": "#ef4444"
  },
  "typography": {
    "fontHeading": "Inter",
    "fontBody": "Inter",
    "fontAccent": "Roboto Slab"
  },
  "theme": "light"
}
```

### 3. Create Content File

```bash
touch src/content/plumber.content.json
```

```json
{
  "hero": {
    "headline": "{{businessName}} - Plomero Profesional en {{city}}",
    "subheadline": "Solucionamos cualquier problema de plomería con rapidez y profesionalismo",
    "ctaPrimary": "Solicitar Presupuesto",
    "ctaSecondary": "Ver Servicios"
  },
  "servicesPage": {
    "title": "Nuestros Servicios",
    "categories": [
      {
        "key": "repairs",
        "title": "Reparaciones",
        "description": "Arreglamos fugas, destapamos cañerías y más",
        "defaultServices": [
          {
            "name": "Destape de cañerías",
            "priceFrom": "150.000 Gs",
            "duration": 60,
            "description": "Destape profesional con equipos modernos"
          },
          {
            "name": "Reparación de fugas",
            "priceFrom": "200.000 Gs",
            "duration": 90,
            "description": "Detección y reparación de fugas"
          }
        ]
      },
      {
        "key": "installations",
        "title": "Instalaciones",
        "description": "Instalación de sanitarios, calentadores y más",
        "defaultServices": [
          {
            "name": "Instalación de sanitarios",
            "priceFrom": "300.000 Gs",
            "duration": 120,
            "description": "Instalación completa con garantía"
          }
        ]
      }
    ]
  },
  "contactPage": {
    "title": "Contáctanos",
    "subtitle": "Disponibles 24 horas para emergencias"
  },
  "ctaBanner": {
    "title": "¿Emergencia de plomería? ¡Llámanos ahora!",
    "buttonText": "Llamar"
  },
  "footer": {
    "quickLinks": ["Inicio", "Servicios", "Contacto"],
    "copyright": "© {{year}} {{businessName}}. Todos los derechos reservados."
  },
  "whatsapp": {
    "defaultMessage": "Hola! Tengo un problema de plomería y necesito ayuda. ¿Podés atenderme?"
  }
}
```

### 4. Add Demo Data (Optional)

Add a demo business to `lib/engine/demo-data.ts`:

```typescript
export const DEMO_BUSINESSES: Record<string, BusinessData> = {
  // ... existing businesses
  
  'plumber-demo': {
    slug: 'plumber-demo',
    name: 'Plomero Express',
    type: 'plumber',
    tagline: 'Servicio 24 horas',
    city: 'Asunción',
    neighborhood: 'Villa Morra',
    address: 'Av. Aviadores del Chaco 1234',
    phone: '+595 21 123 4567',
    whatsapp: '+595 981 123 456',
    email: 'contacto@plomeroexpress.com',
    hours: {
      'Lunes - Viernes': '08:00 - 20:00',
      'Sábado': '08:00 - 14:00',
      'Domingo': 'Emergencias 24hs'
    },
    services: [
      { name: 'Destape de cañerías', price: 'Desde 150.000 Gs' },
      { name: 'Reparación de fugas', price: 'Desde 200.000 Gs' },
      { name: 'Instalación de sanitarios', price: 'Desde 300.000 Gs' }
    ]
  }
}
```

### 5. Register Business Type

Add the type to `lib/types.ts`:

```typescript
export type BusinessType =
  | 'peluqueria'
  | 'salon_belleza'
  | 'gimnasio'
  | 'spa'
  // ... other types
  | 'plumber'  // Add new type
```

### 6. Add Section Mapping (if needed)

Update `SECTION_MAP` in `lib/engine/compose.ts`:

```typescript
export const SECTION_MAP: Record<string, SectionType> = {
  // ... existing mappings
  emergencyIndicator: 'emergencyIndicator',
  emergency: 'emergencyIndicator',
}
```

### 7. Build Section Component (if needed)

If your business type needs a custom section:

```bash
touch components/sections/emergency-indicator-section.tsx
```

```typescript
interface EmergencyIndicatorSectionProps {
  phone: string
  description?: string
}

export function EmergencyIndicatorSection({ 
  phone, 
  description 
}: EmergencyIndicatorSectionProps) {
  return (
    <section className="py-12 bg-red-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full">
          <Phone className="w-5 h-5" />
          <span className="font-semibold">Emergencia 24hs: {phone}</span>
        </div>
        {description && (
          <p className="mt-4 text-red-800">{description}</p>
        )}
      </div>
    </section>
  )
}
```

### 8. Test the New Type

```bash
# Type check
npm run typecheck

# Build
npm run build

# Test locally
npm run dev
# Visit: http://localhost:3000/plumber-demo
```

## Available Sections Reference

| Section | Description | Common For |
|---------|-------------|------------|
| `header` | Navigation header | All |
| `hero` | Hero banner | All |
| `services` | Service listings | Service businesses |
| `booking` | Online booking | Appointments |
| `team` | Team profiles | Agencies, clinics |
| `testimonials` | Customer reviews | All |
| `portfolio` | Project gallery | Creative businesses |
| `gallery` | Photo gallery | Retail, venues |
| `pricing` | Pricing tables | SaaS, memberships |
| `contact` | Contact form + info | All |
| `faq` | FAQ accordion | All |
| `ctaBanner` | Call-to-action banner | All |
| `footer` | Site footer | All |
| `whatsappFloat` | WhatsApp button | All |

## Best Practices

1. **Reuse existing sections** when possible
2. **Keep tokens minimal** - extend base and override only what's needed
3. **Use placeholder data** that makes sense for Paraguay
4. **Test on mobile** - most traffic comes from phones
5. **Add to demo-data.ts** for testing without Supabase

## Examples

See existing implementations:

- **Simple:** `peluqueria` - 5 sections, basic features
- **Medium:** `gimnasio` - 8 sections, schedules + memberships
- **Complex:** `relocation` - Custom sections, calculators

## Troubleshooting

### Type not recognized

```bash
# Restart TypeScript server
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Sections not rendering

```typescript
// Check SECTION_MAP includes your section key
console.log(SECTION_MAP['yourSectionKey'])
```

### Styles not applying

```bash
# Verify tokens file is valid JSON
npx jsonlint src/tokens/your-type.tokens.json
```
