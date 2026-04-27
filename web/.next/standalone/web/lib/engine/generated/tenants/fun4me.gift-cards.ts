// AUTO-GENERATED — do not edit.
export default {
  "_meta": {
    "description": "Gift card SKUs and flow configuration. Gift cards sold as products with SKU prefix GC-. Redeemable as discount codes at checkout."
  },
  "businessRules": {
    "accounting": "Gift cards emitidas aparecen como pasivo hasta canjeo. Ver docs/runbooks/gift-cards-accounting.md.",
    "commissionOnEarn": 0,
    "commissionOnRedeem": "Se cobra comisión solo al canjearlo (neutro para flujo de caja hasta el uso)."
  },
  "customAmount": {
    "enabled": true,
    "label": "Otro monto",
    "max": 5000000,
    "min": 50000,
    "step": 10000
  },
  "deliveryMethods": [
    {
      "description": "El destinatario recibe un email con el código. El asunto es genérico: 'Tenés un regalo'. Podés programar la fecha de envío.",
      "fee": 0,
      "fields": [
        "recipient_email",
        "recipient_name",
        "message",
        "delivery_date"
      ],
      "id": "email",
      "label": "Por email al destinatario"
    },
    {
      "description": "Recibís el código por WhatsApp y lo compartís cuando quieras. 100% discreto.",
      "fee": 0,
      "fields": [
        "message"
      ],
      "id": "whatsapp_forward",
      "label": "Te enviamos el código y vos lo reenviás"
    },
    {
      "description": "Enviamos una tarjeta física con el código, en sobre discreto. 3-5 días hábiles.",
      "fee": 35000,
      "fields": [
        "shipping_address",
        "message"
      ],
      "id": "physical_card",
      "label": "Tarjeta física impresa"
    }
  ],
  "denominations": [
    {
      "amount": 100000,
      "label": "Gs. 100.000",
      "popular": false,
      "sku": "GC-100K"
    },
    {
      "amount": 150000,
      "label": "Gs. 150.000",
      "popular": true,
      "sku": "GC-150K"
    },
    {
      "amount": 200000,
      "label": "Gs. 200.000",
      "popular": true,
      "sku": "GC-200K"
    },
    {
      "amount": 300000,
      "label": "Gs. 300.000",
      "popular": false,
      "sku": "GC-300K"
    },
    {
      "amount": 500000,
      "label": "Gs. 500.000",
      "popular": false,
      "sku": "GC-500K"
    },
    {
      "amount": 1000000,
      "label": "Gs. 1.000.000",
      "popular": false,
      "sku": "GC-1M"
    }
  ],
  "design": {
    "messageMaxLength": 250,
    "templates": [
      {
        "default": true,
        "id": "classic",
        "image": "/branding/fun4me/images/gift-cards/classic.svg",
        "name": "Clásica"
      },
      {
        "id": "birthday",
        "image": "/branding/fun4me/images/gift-cards/birthday.svg",
        "name": "Cumpleaños"
      },
      {
        "id": "anniversary",
        "image": "/branding/fun4me/images/gift-cards/anniversary.svg",
        "name": "Aniversario"
      },
      {
        "id": "valentines",
        "image": "/branding/fun4me/images/gift-cards/valentines.svg",
        "name": "San Valentín"
      },
      {
        "id": "minimal",
        "image": "/branding/fun4me/images/gift-cards/minimal.svg",
        "name": "Minimalista (ultra-discreta)"
      }
    ]
  },
  "displayConfig": {
    "ctaText": "Comprar gift card",
    "featureOnHomepage": true,
    "sectionSubtitle": "El regalo perfecto cuando no sabés qué elegir. Sin talles, sin preferencias, sin errores.",
    "sectionTitle": "Regala Placer"
  },
  "policy": {
    "combinableWithCoupons": true,
    "expiration": "24 meses desde la fecha de emisión",
    "lostCards": "Podemos reemplazar códigos no utilizados con comprobante de compra. Códigos ya canjeados no son reembolsables.",
    "nonRefundable": true,
    "partialUse": true,
    "partialUseNote": "Podés usar parte del saldo y el resto queda disponible para futuras compras hasta la expiración.",
    "transferable": true,
    "transferableNote": "El código puede ser compartido. Se acepta del primer comprador registrado."
  }
} as Record<string, unknown>
