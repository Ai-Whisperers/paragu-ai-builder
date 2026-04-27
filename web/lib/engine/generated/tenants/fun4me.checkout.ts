// AUTO-GENERATED — do not edit.
export default {
  "_meta": {
    "description": "Checkout flow copy and configuration for Fun4Me. Consumed by web/app/[business]/checkout/* components via the site-loader."
  },
  "discretion": {
    "billing": {
      "text": "El cargo en tu tarjeta y la factura electronica aparecen como 'F4M COMERCIAL'. Podes editar la razon social que queres que aparezca en la factura (sujeto a validacion con datos SET).",
      "title": "Facturacion discreta"
    },
    "packaging": {
      "bulletpoints": [
        "Caja o sobre sin logos ni nombre de la tienda",
        "Remitente generico: 'F4M Comercial'",
        "Sin referencias al contenido en el exterior"
      ],
      "title": "Empaque 100% discreto"
    }
  },
  "emptyCart": {
    "ctaHref": "/fun4me/tienda",
    "ctaText": "Ir a la Tienda",
    "text": "Explorá nuestras categorías y agregá productos.",
    "title": "Tu carrito esta vacio"
  },
  "errors": {
    "age_not_verified": "Tenés que confirmar que sos mayor de 18 años antes de finalizar la compra.",
    "delivery_unavailable": "No hacemos delivery a esta zona todavia. Podes elegir retiro en tienda o contactarnos.",
    "out_of_stock": "Este producto ya no esta disponible. Lo removemos de tu carrito.",
    "payment_declined": "El pago fue rechazado. Probá con otro metodo o contactanos por WhatsApp."
  },
  "fulfillment": {
    "options": [
      {
        "availableZones": [
          "Asuncion"
        ],
        "cutoff": "15:00",
        "fee": 50000,
        "id": "delivery_same_day",
        "label": "Envio express (mismo dia en Asuncion)"
      },
      {
        "availableZones": [
          "Asuncion",
          "Fernando de la Mora",
          "San Lorenzo",
          "Lambare",
          "Luque"
        ],
        "fee": 25000,
        "freeThreshold": 200000,
        "id": "delivery_gran_asu",
        "label": "Delivery Gran Asuncion (24-48hs)"
      },
      {
        "availableZones": [
          "resto_pais"
        ],
        "fee": 45000,
        "freeThreshold": 200000,
        "id": "delivery_interior",
        "label": "Envio al interior (3-5 dias habiles)"
      },
      {
        "availableZones": [
          "Asuncion"
        ],
        "fee": 0,
        "id": "pickup_in_store",
        "instructions": "Te avisamos cuando este listo. Retiras con el codigo de tu pedido.",
        "label": "Retiro en tienda (Herrera 875)"
      }
    ]
  },
  "giftFlow": {
    "enabled": true,
    "fields": [
      {
        "id": "recipient_name",
        "label": "Nombre de quien lo recibe",
        "required": false
      },
      {
        "conditionalOn": "shipToOther",
        "id": "recipient_address",
        "label": "Direccion diferente a la de envio",
        "required": false
      },
      {
        "id": "gift_message",
        "label": "Mensaje (se imprime en tarjeta discreta)",
        "maxLength": 200,
        "required": false
      },
      {
        "default": true,
        "id": "hide_prices",
        "label": "Ocultar precios en factura",
        "type": "toggle"
      }
    ],
    "giftWrap": {
      "available": true,
      "fee": 15000,
      "label": "Envoltorio de regalo discreto"
    },
    "toggleLabel": "Es un regalo"
  },
  "orderFlow": {
    "steps": [
      {
        "id": "cart",
        "label": "Carrito"
      },
      {
        "id": "shipping",
        "label": "Envio"
      },
      {
        "id": "gift",
        "label": "Regalo",
        "optional": true
      },
      {
        "id": "payment",
        "label": "Pago"
      },
      {
        "id": "confirmation",
        "label": "Confirmacion"
      }
    ]
  },
  "payment": {
    "methods": [
      {
        "enabled": true,
        "icon": "credit-card",
        "id": "card",
        "label": "Tarjeta de credito/debito"
      },
      {
        "enabled": true,
        "icon": "bank",
        "id": "transfer",
        "label": "Transferencia bancaria"
      },
      {
        "enabled": true,
        "icon": "wallet",
        "id": "tigo_money",
        "label": "Tigo Money"
      },
      {
        "enabled": true,
        "icon": "wallet",
        "id": "personal_pay",
        "label": "Personal Pay"
      },
      {
        "availableInZones": [
          "Asuncion"
        ],
        "enabled": true,
        "icon": "cash",
        "id": "cash_on_delivery",
        "label": "Efectivo contra entrega"
      }
    ],
    "provider": "pagopar",
    "providerOptions": {
      "countryCode": "PY",
      "currency": "PYG",
      "statementDescriptor": "F4M COMERCIAL"
    }
  },
  "trustBadges": [
    {
      "icon": "lock",
      "text": "Pago 100% seguro via Pagopar"
    },
    {
      "icon": "shield",
      "text": "Datos no compartidos con terceros"
    },
    {
      "icon": "package",
      "text": "Empaque discreto garantizado"
    },
    {
      "icon": "refresh",
      "text": "Cambios en 7 dias (lenceria sin uso)"
    }
  ]
} as Record<string, unknown>
