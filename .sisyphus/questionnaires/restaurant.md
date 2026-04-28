# Restaurant / Food Business — Intake Questionnaire

For restaurants, cafes, pizzerias, bars, food trucks, bakeries, meal prep services.

## Business Info

```json
{
  "id": "business_name",
  "kind": "text",
  "label": "Restaurant / business name",
  "placeholder": "e.g. Pizzería Napoli",
  "required": true
},
{
  "id": "cuisine_type",
  "kind": "select",
  "label": "Type of cuisine",
  "options": [
    { "value": "paraguaya", "label": "Paraguayan / Traditional" },
    { "value": "italian", "label": "Italian / Pizza" },
    { "value": "mexican", "label": "Mexican" },
    { "value": "japanese", "label": "Japanese / Sushi" },
    { "value": "chinese", "label": "Chinese" },
    { "value": "fast_food", "label": "Fast food / Hamburgers" },
    { "value": "cafe", "label": "Café / Bakery" },
    { "value": "bar", "label": "Bar / Pub" },
    { "value": "meal_prep", "label": "Meal prep / Delivery" },
    { "value": "other", "label": "Other" }
  ],
  "required": true
},
{
  "id": "service_types",
  "kind": "checkbox",
  "label": "Service types",
  "options": [
    { "value": "dine_in", "label": "Dine-in" },
    { "value": "takeout", "label": "Takeout / To go" },
    { "value": "delivery", "label": "Delivery" },
    { "value": "catering", "label": "Catering / Events" }
  ],
  "required": true
}
```

## Menu

```json
{
  "id": "menu_items",
  "kind": "number",
  "label": "How many menu items?",
  "min": 1,
  "max": 100,
  "helpText": "We'll list them on the website. Most restaurants feature 6-12 items."
},
{
  "id": "has_specials",
  "kind": "radio",
  "label": "Do you have daily/weekly specials?",
  "options": [
    { "value": "daily", "label": "Yes, daily specials" },
    { "value": "weekly", "label": "Yes, weekly menu" },
    { "value": "seasonal", "label": "Seasonal menu only" },
    { "value": "fixed", "label": "Fixed menu, no specials" }
  ],
  "required": true
},
{
  "id": "show_prices",
  "kind": "radio",
  "label": "Show prices on the website?",
  "options": [
    { "value": "yes_gs", "label": "Yes, in Guaraníes" },
    { "value": "yes_usd", "label": "Yes, in USD" },
    { "value": "yes_both", "label": "Yes, both currencies" },
    { "value": "no", "label": "No prices" }
  ],
  "required": true
},
{
  "id": "has_delivery_menu",
  "kind": "radio",
  "label": "Is the delivery menu different from dine-in?",
  "options": [
    { "value": "same", "label": "Same menu" },
    { "value": "different", "label": "Different delivery menu" }
  ]
}
```

## Delivery & Hours

```json
{
  "id": "delivery_area",
  "kind": "textarea",
  "label": "Delivery area / zones",
  "placeholder": "e.g. San Lorenzo, Capiatá, and downtown Asunción"
},
{
  "id": "delivery_fee",
  "kind": "text",
  "label": "Delivery fee or minimum order",
  "placeholder": "e.g. Gs 5,000 or free over Gs 50,000"
},
{
  "id": "hours_weekdays",
  "kind": "text",
  "label": "Weekday hours",
  "placeholder": "e.g. Mon-Fri 9:00 - 22:00"
},
{
  "id": "hours_weekends",
  "kind": "text",
  "label": "Weekend hours",
  "placeholder": "e.g. Sat 9:00 - 23:00, Sun 10:00 - 21:00"
},
{
  "id": "closed_days",
  "kind": "text",
  "label": "Closed days (if any)",
  "placeholder": "e.g. Tuesdays"
}
```

## Photos

```json
{
  "id": "food_photos",
  "kind": "radio",
  "label": "Do you have photos of your food?",
  "options": [
    { "value": "professional", "label": "Yes, professional food photos" },
    { "value": "phone", "label": "Yes, phone photos" },
    { "value": "instagram", "label": "We'll pull from Instagram" },
    { "value": "no", "label": "No, we need photos" }
  ],
  "required": true
},
{
  "id": "instagram",
  "kind": "text",
  "label": "Instagram URL",
  "placeholder": "e.g. https://instagram.com/pizzerianapoli"
}
```
