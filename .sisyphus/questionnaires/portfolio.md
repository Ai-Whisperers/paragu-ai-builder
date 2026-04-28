# Portfolio / Creative — Intake Questionnaire

For photographers, designers, artists, musicians, architects, videographers.

## Artist Info

```json
{
  "id": "name",
  "kind": "text",
  "label": "Your name / stage name",
  "required": true
},
{
  "id": "creative_field",
  "kind": "select",
  "label": "Creative field",
  "options": [
    { "value": "photography", "label": "Photography" },
    { "value": "design", "label": "Graphic design" },
    { "value": "illustration", "label": "Illustration" },
    { "value": "music", "label": "Music / Band" },
    { "value": "film", "label": "Film / Video" },
    { "value": "architecture", "label": "Architecture" },
    { "value": "art", "label": "Fine arts" },
    { "value": "fashion", "label": "Fashion design" },
    { "value": "writing", "label": "Writing / Publishing" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
}
```

## Portfolio

```json
{
  "id": "portfolio_items",
  "kind": "number",
  "label": "Number of portfolio pieces to feature",
  "min": 1,
  "max": 100,
  "helpText": "We recommend 6-12 for the initial launch."
},
{
  "id": "has_high_res",
  "kind": "radio",
  "label": "Do you have high-resolution images of your work?",
  "options": [
    { "value": "yes", "label": "Yes, professional quality" },
    { "value": "phone", "label": "Phone photos" },
    { "value": "instagram", "label": "We'll pull from Instagram" },
    { "value": "no", "label": "No, need help" }
  ],
  "required": true
},
{
  "id": "instagram",
  "kind": "text",
  "label": "Instagram handle (for auto-gallery)",
  "placeholder": "e.g. @myart"
},
{
  "id": "has_video",
  "kind": "radio",
  "label": "Do you have video content?",
  "options": [
    { "value": "youtube", "label": "YouTube channel" },
    { "value": "vimeo", "label": "Vimeo" },
    { "value": "tiktok", "label": "TikTok" },
    { "value": "no", "label": "No video" }
  ]
}
```

## Services / Commissions

```json
{
  "id": "accepts_commissions",
  "kind": "radio",
  "label": "Do you accept commissions or custom work?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "limited", "label": "Limited availability" },
    { "value": "no", "label": "No" }
  ]
},
{
  "id": "price_range",
  "kind": "text",
  "label": "Price range",
  "placeholder": "e.g. $50 - $500 USD"
}
```

## Events (for musicians/bands)

```json
{
  "id": "upcoming_shows",
  "kind": "radio",
  "label": "Do you have upcoming shows/events to promote?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
},
{
  "id": "booking_contact",
  "kind": "text",
  "label": "Booking contact email or WhatsApp",
  "placeholder": "e.g. booking@myband.com"
}
```
