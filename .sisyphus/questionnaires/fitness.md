# Fitness / Wellness — Intake Questionnaire

For gyms, yoga studios, pilates, crossfit boxes, dance studios, martial arts schools.

## Studio Info

```json
{
  "id": "studio_name",
  "kind": "text",
  "label": "Studio / gym name",
  "required": true
},
{
  "id": "studio_type",
  "kind": "select",
  "label": "Type of studio",
  "options": [
    { "value": "gym", "label": "Traditional gym" },
    { "value": "crossfit", "label": "CrossFit / Functional" },
    { "value": "yoga", "label": "Yoga / Pilates" },
    { "value": "dance", "label": "Dance studio" },
    { "value": "martial_arts", "label": "Martial arts" },
    { "value": "boxing", "label": "Boxing / Kickboxing" },
    { "value": "pilates", "label": "Pilates / Barre" },
    { "value": "personal_training", "label": "Personal training" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
},
{
  "id": "instructor_count",
  "kind": "number",
  "label": "Number of instructors",
  "min": 1,
  "max": 50
}
```

## Classes & Schedule

```json
{
  "id": "class_count",
  "kind": "number",
  "label": "Number of weekly classes",
  "min": 1,
  "max": 100
},
{
  "id": "class_types",
  "kind": "textarea",
  "label": "Types of classes offered",
  "placeholder": "e.g. Yoga Vinyasa, Pilates Mat, Zumba, Spinning"
},
{
  "id": "class_schedule",
  "kind": "radio",
  "label": "Show class schedule on website?",
  "options": [
    { "value": "yes", "label": "Yes, interactive schedule" },
    { "value": "simple", "label": "Yes, simple text schedule" },
    { "value": "no", "label": "No" }
  ]
}
```

## Membership

```json
{
  "id": "membership_tiers",
  "kind": "number",
  "label": "Number of membership tiers",
  "min": 1,
  "max": 10
},
{
  "id": "has_trial",
  "kind": "radio",
  "label": "Offer a free trial class?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No" }
  ]
},
{
  "id": "show_prices",
  "kind": "radio",
  "label": "Show membership prices?",
  "options": [
    { "value": "yes", "label": "Yes" },
    { "value": "no", "label": "No, contact for pricing" }
  ]
}
```

## Facilities

```json
{
  "id": "amenities",
  "kind": "checkbox",
  "label": "Amenities",
  "options": [
    { "value": "lockers", "label": "Lockers" },
    { "value": "showers", "label": "Showers" },
    { "value": "parking", "label": "Parking" },
    { "value": "wifi", "label": "WiFi" },
    { "value": "cafe", "label": "Café / Juice bar" },
    { "value": "kid_area", "label": "Kids area" },
    { "value": "pool", "label": "Pool" },
    { "value": "sauna", "label": "Sauna / Steam room" }
  ]
}
```
