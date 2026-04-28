# General Business Website — Intake Questionnaire

For any small-to-medium business getting their first website.

## Business Info

```json
{
  "id": "business_name",
  "kind": "text",
  "label": "What is your business name?",
  "placeholder": "e.g. Taller Mecánico Pérez",
  "required": true
},
{
  "id": "business_tagline",
  "kind": "text",
  "label": "Tagline (one-liner describing what you do)",
  "placeholder": "e.g. Reparación y mantenimiento de confianza desde 1990",
  "required": false
},
{
  "id": "business_type",
  "kind": "select",
  "label": "Business type",
  "options": [
    { "value": "salon", "label": "Salon / Beauty" },
    { "value": "restaurant", "label": "Restaurant / Food" },
    { "value": "store", "label": "Retail store" },
    { "value": "service", "label": "Professional service" },
    { "value": "health", "label": "Health / Medical" },
    { "value": "fitness", "label": "Fitness / Wellness" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
},
{
  "id": "years_in_operation",
  "kind": "number",
  "label": "Years in operation",
  "placeholder": "e.g. 5",
  "min": 0,
  "max": 100
}
```

## Contact & Location

```json
{
  "id": "address",
  "kind": "text",
  "label": "Address",
  "placeholder": "e.g. Av. España 1234, Asunción",
  "required": true
},
{
  "id": "neighborhood",
  "kind": "text",
  "label": "Neighborhood",
  "placeholder": "e.g. Villa Morra",
  "required": false
},
{
  "id": "city",
  "kind": "text",
  "label": "City",
  "placeholder": "e.g. Asunción",
  "required": true
},
{
  "id": "phone",
  "kind": "text",
  "label": "Phone number",
  "placeholder": "e.g. +595 981 123 456",
  "required": true
},
{
  "id": "whatsapp",
  "kind": "text",
  "label": "WhatsApp number (if different from phone)",
  "placeholder": "e.g. +595 981 123 456",
  "required": false
},
{
  "id": "email",
  "kind": "text",
  "label": "Email address",
  "placeholder": "e.g. contacto@negocio.com.py",
  "required": true
}
```

## Services / Products

```json
{
  "id": "service_count",
  "kind": "number",
  "label": "How many services or products do you offer?",
  "placeholder": "e.g. 6",
  "min": 1,
  "max": 50,
  "helpText": "List each one in the next step. We recommend 4-8 for the homepage."
},
{
  "id": "has_prices",
  "kind": "radio",
  "label": "Do you want to show prices on the website?",
  "options": [
    { "value": "yes", "label": "Yes, show prices" },
    { "value": "no", "label": "No, prices by consultation only" },
    { "value": "range", "label": "Show price ranges (Desde...)" }
  ],
  "required": true
}
```

## Design & Branding

```json
{
  "id": "has_logo",
  "kind": "radio",
  "label": "Do you have a logo?",
  "options": [
    { "value": "yes", "label": "Yes, I have a logo" },
    { "value": "no", "label": "No, I need one designed" }
  ],
  "required": true
},
{
  "id": "brand_colors",
  "kind": "text",
  "label": "Brand colors (hex codes or description)",
  "placeholder": "e.g. Blue and white, or #1A3A5C",
  "helpText": "If you have brand colors, list them. Otherwise we'll recommend a palette."
},
{
  "id": "reference_sites",
  "kind": "textarea",
  "label": "Reference websites you like (URLs)",
  "placeholder": "e.g. https://competitor.com, https://inspiration.com",
  "helpText": "Share 1-3 websites whose style you admire — even from other industries."
},
{
  "id": "photos_available",
  "kind": "radio",
  "label": "Do you have photos of your business/location?",
  "options": [
    { "value": "yes", "label": "Yes, professional photos" },
    { "value": "phone", "label": "Yes, phone photos" },
    { "value": "no", "label": "No, I need stock photos" }
  ],
  "required": true
}
```

## Social Media

```json
{
  "id": "instagram",
  "kind": "text",
  "label": "Instagram handle",
  "placeholder": "e.g. @tallerperez"
},
{
  "id": "facebook",
  "kind": "text",
  "label": "Facebook page URL",
  "placeholder": "e.g. https://facebook.com/tallerperez"
},
{
  "id": "tiktok",
  "kind": "text",
  "label": "TikTok handle",
  "placeholder": "e.g. @tallerperez"
}
```

## Budget & Timeline

```json
{
  "id": "budget_range",
  "kind": "select",
  "label": "Budget range",
  "options": [
    { "value": "starter", "label": "Gs 650.000 (setup)" },
    { "value": "growth", "label": "Gs 1.200.000 (setup)" },
    { "value": "professional", "label": "Gs 2.200.000 (setup)" },
    { "value": "unsure", "label": "Not sure yet" }
  ],
  "required": true
},
{
  "id": "timeline",
  "kind": "select",
  "label": "Desired launch timeline",
  "options": [
    { "value": "urgent", "label": "ASAP (within 48 hours)" },
    { "value": "week", "label": "Within a week" },
    { "value": "month", "label": "Within a month" },
    { "value": "researching", "label": "Just researching" }
  ],
  "required": true
}
```
