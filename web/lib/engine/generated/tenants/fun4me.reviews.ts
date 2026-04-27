// AUTO-GENERATED — do not edit.
export default {
  "_meta": {
    "description": "Product review system configuration. Reviews are pseudonymous and verified (linked to order). Moderation required before publishing."
  },
  "businessLogic": {
    "min_reviews_for_rating_display": 3,
    "review_affects_product_ranking": true,
    "review_feeds_homepage_testimonials": "opt-in per review",
    "review_triggers_loyalty_points": true
  },
  "config": {
    "allowAnonymousDisplayNames": true,
    "autoPublishThreshold": {
      "maxLength": 1000,
      "minLength": 20,
      "minRating": 3,
      "profanityCheck": true
    },
    "enabled": true,
    "moderationRequired": true,
    "pointsForReview": 50,
    "pointsTrigger": "review_approved",
    "requireVerifiedPurchase": true
  },
  "curatedPlaceholders": [
    {
      "productCategory": "vibradores",
      "samples": [
        {
          "body": "Primera vez comprando algo así. Me costó animarme pero el asesoramiento fue excelente. El producto llegó rápido y discreto. No me arrepiento para nada.",
          "displayName": "Mar L.",
          "rating": 5,
          "recommend": true,
          "title": "Superó mis expectativas",
          "verified": true
        },
        {
          "body": "El producto en sí es genial, calidad evidente. El único detalle es que la batería dura menos de lo que dice la caja (me aguantó unas 2 horas de uso continuo, decía 4). Igual lo recomiendo.",
          "displayName": "Pilar_27",
          "rating": 4,
          "recommend": true,
          "title": "Muy bueno pero la batería dura menos que lo anunciado",
          "verified": true
        }
      ]
    },
    {
      "productCategory": "lubricantes",
      "samples": [
        {
          "body": "Lubricante base agua, no mancha, no se pega, fácil de limpiar. Lo uso con juguetes de silicona sin problema. 10/10.",
          "displayName": "Anon_Asu",
          "rating": 5,
          "recommend": true,
          "title": "Perfecto para todo uso",
          "verified": true
        }
      ]
    }
  ],
  "displayConfig": {
    "defaultSort": "most_helpful",
    "photoReviewsSectionFirst": true,
    "reviewsPerPage": 10,
    "showPhotoReviews": true,
    "showRatingDistribution": true,
    "showVerifiedBadge": true,
    "sortOptions": [
      "most_helpful",
      "most_recent",
      "highest_rating",
      "lowest_rating"
    ]
  },
  "moderationPolicy": {
    "appealProcess": "Reviews rechazadas pueden ser apeladas por email a moderacion@fun4me.com.py",
    "rejectReasons": [
      "Contenido ofensivo o discriminatorio",
      "Información personal identificable (nombre real, teléfono, dirección)",
      "Promoción de otro vendedor o producto",
      "Contenido explícitamente sexual (fuera de reseña del producto)",
      "Spam o contenido generado automáticamente",
      "Fotos con caras identificables",
      "Difamación o ataque personal al personal de Fun4Me"
    ],
    "responseSLA": "Reviews aprobadas o rechazadas en 48 horas hábiles"
  },
  "reviewForm": {
    "disclaimer": "Al publicar esta review aceptás nuestros términos. Las reviews se moderan antes de publicar. Mantenete respetuoso/a — no publicamos contenido ofensivo o fuera de tema.",
    "fields": [
      {
        "id": "rating",
        "label": "Calificación",
        "required": true,
        "type": "stars"
      },
      {
        "id": "title",
        "label": "Título breve",
        "maxLength": 80,
        "required": true,
        "type": "text"
      },
      {
        "id": "body",
        "label": "Tu experiencia",
        "maxLength": 1000,
        "minLength": 20,
        "required": true,
        "type": "textarea"
      },
      {
        "helperText": "Tu nombre real NUNCA aparece en la review. Elegí un pseudónimo si preferís.",
        "id": "displayName",
        "label": "Nombre a mostrar",
        "maxLength": 30,
        "placeholder": "Puede ser un pseudónimo",
        "required": true,
        "type": "text"
      },
      {
        "id": "location",
        "label": "Ciudad (opcional)",
        "required": false,
        "type": "text"
      },
      {
        "id": "recommend",
        "label": "¿Lo recomendarías?",
        "required": true,
        "type": "boolean"
      },
      {
        "accept": "image/*",
        "helperText": "Sin caras ni identificadores. Las fotos se moderan antes de publicar.",
        "id": "photos",
        "label": "Fotos (opcional)",
        "maxCount": 3,
        "maxSize": 5000000,
        "type": "file"
      }
    ]
  }
} as Record<string, unknown>
