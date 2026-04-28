# Salon / Beauty / Barber — Intake Questionnaire

For hair salons, barbershops, beauty centers, nail studios, estheticians, barbers.

## Business Info

```json
{
  "id": "business_name",
  "kind": "text",
  "label": "Salon name",
  "placeholder": "e.g. Estética Mary",
  "required": true
},
{
  "id": "owner_name",
  "kind": "text",
  "label": "Owner / lead stylist name",
  "placeholder": "e.g. María González"
},
{
  "id": "years_open",
  "kind": "number",
  "label": "Years in business",
  "min": 0,
  "max": 60
}
```

## Services Offered (select all that apply)

```json
{
  "id": "services_hair",
  "kind": "checkbox",
  "label": "Hair services offered",
  "options": [
    { "value": "cuts", "label": "Haircuts" },
    { "value": "color", "label": "Coloring" },
    { "value": "highlights", "label": "Highlights / Balayage" },
    { "value": "blowout", "label": "Blowouts / Styling" },
    { "value": "keratin", "label": "Keratin treatments" },
    { "value": "extensions", "label": "Extensions" },
    { "value": "perms", "label": "Perms" },
    { "value": "braids", "label": "Braids / Trenzas" }
  ]
},
{
  "id": "services_nails",
  "kind": "checkbox",
  "label": "Nail services offered",
  "options": [
    { "value": "manicure", "label": "Manicure" },
    { "value": "pedicure", "label": "Pedicure" },
    { "value": "acrylic", "label": "Acrylic nails" },
    { "value": "gel", "label": "Gel polish" },
    { "value": "nail_art", "label": "Nail art" }
  ]
},
{
  "id": "services_esthetics",
  "kind": "checkbox",
  "label": "Esthetics / skin services",
  "options": [
    { "value": "facials", "label": "Facials" },
    { "value": "waxing", "label": "Waxing" },
    { "value": "lashes", "label": "Lash extensions / lift" },
    { "value": "brows", "label": "Brow shaping / microblading" },
    { "value": "makeup", "label": "Makeup application" },
    { "value": "massage", "label": "Massage" }
  ]
},
{
  "id": "services_barber",
  "kind": "checkbox",
  "label": "Barber services",
  "options": [
    { "value": "classic_cut", "label": "Classic haircuts" },
    { "value": "beard", "label": "Beard trimming / shaping" },
    { "value": "shave", "label": "Straight razor shave" },
    { "value": "fade", "label": "Fade / modern cuts" },
    { "value": "hot_towel", "label": "Hot towel treatment" }
  ]
}
```

## Pricing

```json
{
  "id": "price_level",
  "kind": "select",
  "label": "Price range",
  "options": [
    { "value": "budget", "label": "Economy (Gs 20,000-50,000)" },
    { "value": "mid", "label": "Mid-range (Gs 50,000-150,000)" },
    { "value": "premium", "label": "Premium (Gs 150,000+)" }
  ],
  "required": true
},
{
  "id": "show_prices",
  "kind": "radio",
  "label": "Show prices on website?",
  "options": [
    { "value": "yes", "label": "Yes, full price list" },
    { "value": "range", "label": "Show starting prices (Desde)" },
    { "value": "no", "label": "No prices — consulta only" }
  ],
  "required": true
}
```

## Booking & Appointments

```json
{
  "id": "booking_method",
  "kind": "select",
  "label": "How do clients book appointments?",
  "options": [
    { "value": "whatsapp", "label": "WhatsApp only" },
    { "value": "phone", "label": "Phone call" },
    { "value": "instagram", "label": "Instagram DM" },
    { "value": "walkin", "label": "Walk-ins only" },
    { "value": "multiple", "label": "All of the above" }
  ],
  "required": true
},
{
  "id": "online_booking",
  "kind": "radio",
  "label": "Would you like online booking on your website?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No, keep current method" }
  ],
  "required": true
},
{
  "id": "staff_count",
  "kind": "number",
  "label": "Number of stylists/barbers",
  "min": 1,
  "max": 30,
  "helpText": "For the team section. Don't count yourself if you're solo."
}
```

## Portfolio

```json
{
  "id": "has_photos",
  "kind": "radio",
  "label": "Do you have before/after photos of your work?",
  "options": [
    { "value": "yes_many", "label": "Yes, many (10+)" },
    { "value": "yes_few", "label": "Yes, a few (3-9)" },
    { "value": "no", "label": "No, but I can take some" }
  ],
  "required": true
},
{
  "id": "instagram_link",
  "kind": "text",
  "label": "Instagram URL (we'll use your posts as a gallery)",
  "placeholder": "e.g. https://instagram.com/misalon"
}
```
