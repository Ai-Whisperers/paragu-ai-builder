// AUTO-GENERATED — do not edit.
export default {
  "_meta": {
    "description": "Subscription box tiers for Fun4Me. Each tier ships monthly with curated products. Requires recurring billing integration — see docs/runbooks/subscriptions.md."
  },
  "boxes": [
    {
      "cancellationPolicy": "Cancelas cuando quieras, sin penalidad. Avisa antes del 25 para evitar el cargo del mes siguiente.",
      "customization": "minimal",
      "description": "Para quienes quieren explorar sin compromiso. Una caja mensual con 3-4 productos de valor de mercado Gs. 200-280k: un juguete pequeño o lencería + accesorios + lubricante + sorpresa.",
      "headline": "Una pequeña sorpresa cada mes.",
      "id": "box-discovery",
      "includes": [
        "1 juguete pequeño o pieza de lencería",
        "1 accesorio (antifaz, plumas, dados, etc.)",
        "1 lubricante (alternado entre agua y silicona)",
        "1 sorpresa seleccionada por el equipo"
      ],
      "mailerValue": "Gs. 200.000 - 280.000",
      "mainImage": "/branding/fun4me/images/subscriptions/discovery.jpg",
      "name": "Caja Discovery",
      "personalizationQuestions": [
        "Preferencia de uso: solo / con pareja",
        "Sensibilidad (alta/media/baja) para evitar productos muy fuertes"
      ],
      "priceMonthly": 149000,
      "priceQuarterly": 420000,
      "priceYearly": 1590000,
      "shippingIncluded": true,
      "sku": "SUB-DISC-MO",
      "tier": "discovery",
      "yearlySavings": 198000
    },
    {
      "cancellationPolicy": "Cancelas cuando quieras. Aviso antes del 25 para el próximo mes.",
      "customization": "medium",
      "description": "Cada mes, una caja curada con productos de marcas premium. Valor de mercado Gs. 450-550k. Incluye un juguete de marca reconocida (Satisfyer, We-Vibe, LELO) + accesorios premium.",
      "featured": true,
      "headline": "Un placer cuidado, seleccionado y enviado a tu puerta.",
      "id": "box-premium",
      "includes": [
        "1 juguete premium de marca reconocida (rotación mensual)",
        "2 complementos de alta gama",
        "1 accesorio sensorial o lencería premium",
        "1 cupón de 15% off para compra adicional en la tienda"
      ],
      "mailerValue": "Gs. 450.000 - 550.000",
      "mainImage": "/branding/fun4me/images/subscriptions/premium.jpg",
      "name": "Caja Premium",
      "personalizationQuestions": [
        "Preferencia de uso: solo / con pareja",
        "Categorías preferidas (vibradores, BDSM, lencería, etc.)",
        "Categorías que NO queres recibir",
        "Talle de lencería (si aplica)"
      ],
      "priceMonthly": 299000,
      "priceQuarterly": 849000,
      "priceYearly": 3190000,
      "shippingIncluded": true,
      "sku": "SUB-PREM-MO",
      "tier": "premium",
      "yearlySavings": 398000
    },
    {
      "cancellationPolicy": "Cancelas cuando quieras. Compromiso mínimo: ninguno.",
      "capacity": 20,
      "capacityNote": "Solo 20 cupos por mes para garantizar personalización.",
      "customization": "high",
      "description": "Experiencia máxima. Caja mensual con consulta previa: te llamamos (o WhatsApp) antes de armar la caja para personalizar. Valor de mercado Gs. 900k+. Incluye un producto flagship + complementos premium + bonus.",
      "headline": "Lo mejor de lo mejor, personalizado para vos.",
      "id": "box-vip",
      "includes": [
        "1 producto flagship (LELO, We-Vibe top, Satisfyer signature)",
        "3-4 complementos premium seleccionados a medida",
        "1 accesorio de lujo (lencería de diseñador, seda, cuero premium)",
        "1 consulta de 30min con nuestro equipo pre-box",
        "1 cupón de 25% off",
        "Envío express prioritario"
      ],
      "mailerValue": "Gs. 900.000+",
      "mainImage": "/branding/fun4me/images/subscriptions/vip.jpg",
      "name": "Caja VIP",
      "personalizationQuestions": [
        "Consulta previa via WhatsApp o llamada discreta",
        "Preferencias detalladas (materiales, intensidad, uso)",
        "Historial de productos que te gustaron / no"
      ],
      "priceMonthly": 599000,
      "priceQuarterly": 1699000,
      "priceYearly": 6490000,
      "shippingIncluded": true,
      "sku": "SUB-VIP-MO",
      "tier": "vip",
      "waitlist": true,
      "yearlySavings": 698000
    }
  ],
  "displayConfig": {
    "comparisonMode": "table",
    "highlightTier": "premium",
    "sectionSubtitle": "Sorpresa y curaduría todos los meses. Cancelas cuando quieras.",
    "sectionTitle": "Suscripción Mensual"
  },
  "globalPolicy": {
    "ageVerificationRequired": true,
    "customerPortalUrl": "/fun4me/account/subscriptions",
    "pauseSupported": true,
    "privacyNote": "Todas las cajas llegan en empaque discreto. El cargo aparece como 'F4M COMERCIAL'.",
    "shippingFrequency": "monthly_on_10th",
    "skipMonthSupported": true
  }
} as Record<string, unknown>
