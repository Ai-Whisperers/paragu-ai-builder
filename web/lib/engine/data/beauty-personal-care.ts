/** Auto-generated shard for vertical "beauty-personal-care". DO NOT EDIT MANUALLY. */

export const REGISTRY: Record<string, unknown> = {
  'acne_clinic': {
    "id": "acne_clinic",
    "nameEs": "Clinica del Acne",
    "nameEn": "Acne Clinic",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "acne_clinic",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Clinica del Acne en {{city}}",
      "descriptionTemplate": "Clinica del Acne profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "clinica del acne {{city}}",
        "acne clinic {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Clinica del Acne",
      "subheadlineTemplate": "Clinica del Acne profesional en {{city}}."
    }
  },
  'afro_textured_salon': {
    "id": "afro_textured_salon",
    "nameEs": "Cabello Afro Rizado",
    "nameEn": "Natural Hair Salon",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "afro_textured_salon",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Cabello Afro Rizado en {{city}}",
      "descriptionTemplate": "Cabello Afro Rizado profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "cabello afro rizado {{city}}",
        "natural hair salon {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Cabello Afro Rizado",
      "subheadlineTemplate": "Cabello Afro Rizado profesional en {{city}}."
    }
  },
  'airbrush_makeup_studio': {
    "id": "airbrush_makeup_studio",
    "nameEs": "Aerografia",
    "nameEn": "Airbrush Makeup",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "airbrush_makeup_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Aerografia en {{city}}",
      "descriptionTemplate": "Aerografia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "aerografia {{city}}",
        "airbrush makeup {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Aerografia",
      "subheadlineTemplate": "Aerografia profesional en {{city}}."
    }
  },
  'alisado_capilar': {
    "id": "alisado_capilar",
    "nameEs": "Alisado Capilar",
    "nameEn": "Hair Straightening",
    "verticalId": "beauty-personal-care",
    "extends": "peluqueria",
    "tokens": "alisado_capilar",
    "seo": {
      "schemaType": "HairSalon",
      "titleTemplate": "{{businessName}} - Alisado Capilar en {{city}}",
      "descriptionTemplate": "Alisado profesional con keratina y tecnicas sin formol en {{city}}.",
      "keywords": [
        "alisado {{city}}",
        "keratina {{city}}",
        "botox capilar {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Cabello liso, sano y brilloso",
      "subheadlineTemplate": "Alisado profesional con keratina y tecnicas sin formol en {{city}}."
    },
    "serviceCategories": [
      "keratina",
      "botox",
      "progresiva"
    ]
  },
  'aromatherapy_studio': {
    "id": "aromatherapy_studio",
    "nameEs": "Aromaterapia",
    "nameEn": "Aromatherapy",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "aromatherapy_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Aromaterapia en {{city}}",
      "descriptionTemplate": "Aromaterapia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "aromaterapia {{city}}",
        "aromatherapy {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Aromaterapia",
      "subheadlineTemplate": "Aromaterapia profesional en {{city}}."
    }
  },
  'barberia': {
    "id": "barberia",
    "nameEs": "Barberia",
    "nameEn": "Barbershop",
    "verticalId": "beauty-personal-care",
    "tokens": "barberia",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "services",
          "booking",
          "portfolio",
          "beforeAfter",
          "team",
          "contact",
          "testimonials",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "services": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "gallery": {
        "sections": [
          "header",
          "portfolio",
          "footer"
        ],
        "requiredSections": [
          "header",
          "portfolio",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": true,
        "method": "square",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "style": "traditional-list",
        "showPrices": true,
        "showDuration": true
      },
      "portfolio": {
        "enabled": true,
        "minImages": 20,
        "categories": [
          "fades",
          "clasico",
          "barbas"
        ],
        "noStockPhotos": true
      },
      "beforeAfter": {
        "enabled": true
      },
      "staffProfiles": {
        "enabled": true,
        "label": "Barberos"
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "walkInPolicy": {
        "enabled": true
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": false
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      }
    },
    "serviceCategories": [
      "cortes",
      "afeitado",
      "arreglo_barba",
      "paquetes"
    ],
    "targetAudience": {
      "primary": "Men 18-55, grooming-conscious",
      "secondary": "Boys, Grooms, Older gentlemen"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Barberia en {{city}} | Cortes y Afeitado",
      "descriptionTemplate": "Barberia en {{city}}. Cortes clasicos y modernos, afeitado profesional. Walk-ins bienvenidos.",
      "schemaType": "BarberShop",
      "keywords": [
        "barberia {{city}}",
        "corte de pelo hombre {{city}}",
        "barber shop {{city}}",
        "fade {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "cta": {
        "text": "Reservar",
        "action": "booking"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}} - El Arte del Corte",
      "subheadlineTemplate": "Tradicion y maestria en cada detalle",
      "ctaPrimary": {
        "text": "Reservar Cita",
        "action": "booking"
      },
      "ctaSecondary": {
        "text": "Walk-In",
        "action": "scrollTo:contact"
      }
    }
  },
  'beard_grooming_studio': {
    "id": "beard_grooming_studio",
    "nameEs": "Cuidado de Barba",
    "nameEn": "Beard Grooming",
    "verticalId": "beauty-personal-care",
    "subVertical": "mens-grooming",
    "extends": "beauty_base",
    "tokens": "beard_grooming_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Cuidado de Barba en {{city}}",
      "descriptionTemplate": "Cuidado de Barba profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "cuidado de barba {{city}}",
        "beard grooming {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Cuidado de Barba",
      "subheadlineTemplate": "Cuidado de Barba profesional en {{city}}."
    }
  },
  'beauty_base': {
    "id": "beauty_base",
    "nameEs": "Base Belleza",
    "nameEn": "Beauty Base",
    "verticalId": "beauty-personal-care",
    "abstract": true,
    "tokens": "beauty_base",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "servicesPreview",
          "portfolioGallery",
          "team",
          "testimonial",
          "ctaBanner",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "servicesPreview",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": true,
        "method": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "showPrices": true,
        "showDuration": true,
        "filterable": true
      },
      "portfolio": {
        "enabled": true,
        "minImages": 12
      },
      "staffProfiles": {
        "enabled": true,
        "showInstagram": true,
        "bookable": true
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      }
    },
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - {{nameEs}} en {{city}}",
      "descriptionTemplate": "Servicios profesionales en {{city}}. Reserva tu cita."
    },
    "nav": {
      "items": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Contacto"
      ],
      "cta": {
        "text": "Reservar",
        "action": "whatsapp"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}}",
      "subheadlineTemplate": "Tu belleza en buenas manos en {{city}}",
      "ctaPrimary": {
        "text": "Reservar",
        "action": "whatsapp"
      },
      "ctaSecondary": {
        "text": "Ver Servicios",
        "action": "scrollTo:services"
      }
    }
  },
  'beauty_supply_store': {
    "id": "beauty_supply_store",
    "nameEs": "Insumos de Belleza",
    "nameEn": "Beauty Supply Store",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "beauty_supply_store",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Insumos de Belleza en {{city}}",
      "descriptionTemplate": "Insumos de Belleza profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "insumos de belleza {{city}}",
        "beauty supply store {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Insumos de Belleza",
      "subheadlineTemplate": "Insumos de Belleza profesional en {{city}}."
    }
  },
  'blow_dry_bar': {
    "id": "blow_dry_bar",
    "nameEs": "Secado y Peinado",
    "nameEn": "Blow Dry Bar",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "blow_dry_bar",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Secado y Peinado en {{city}}",
      "descriptionTemplate": "Secado y Peinado profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "secado y peinado {{city}}",
        "blow dry bar {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Secado y Peinado",
      "subheadlineTemplate": "Secado y Peinado profesional en {{city}}."
    }
  },
  'body_piercing_studio': {
    "id": "body_piercing_studio",
    "nameEs": "Estudio de Piercings",
    "nameEn": "Piercing Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "tattoo-piercing",
    "extends": "beauty_base",
    "tokens": "body_piercing_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Estudio de Piercings en {{city}}",
      "descriptionTemplate": "Estudio de Piercings profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "estudio de piercings {{city}}",
        "piercing studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Estudio de Piercings",
      "subheadlineTemplate": "Estudio de Piercings profesional en {{city}}."
    }
  },
  'braiding_salon': {
    "id": "braiding_salon",
    "nameEs": "Salon de Trenzas",
    "nameEn": "Braiding Salon",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "braiding_salon",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Salon de Trenzas en {{city}}",
      "descriptionTemplate": "Salon de Trenzas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "salon de trenzas {{city}}",
        "braiding salon {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Salon de Trenzas",
      "subheadlineTemplate": "Salon de Trenzas profesional en {{city}}."
    }
  },
  'brazilian_wax_studio': {
    "id": "brazilian_wax_studio",
    "nameEs": "Depilacion Brasilena",
    "nameEn": "Brazilian Wax",
    "verticalId": "beauty-personal-care",
    "subVertical": "body-hair-removal",
    "extends": "beauty_base",
    "tokens": "brazilian_wax_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Depilacion Brasilena en {{city}}",
      "descriptionTemplate": "Depilacion Brasilena profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "depilacion brasilena {{city}}",
        "brazilian wax {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Depilacion Brasilena",
      "subheadlineTemplate": "Depilacion Brasilena profesional en {{city}}."
    }
  },
  'bridal_hair_specialist': {
    "id": "bridal_hair_specialist",
    "nameEs": "Peinados Novia",
    "nameEn": "Bridal Hair",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "bridal_hair_specialist",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Peinados Novia en {{city}}",
      "descriptionTemplate": "Peinados Novia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "peinados novia {{city}}",
        "bridal hair {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Peinados Novia",
      "subheadlineTemplate": "Peinados Novia profesional en {{city}}."
    }
  },
  'bridal_makeup_artist': {
    "id": "bridal_makeup_artist",
    "nameEs": "Maquillaje de Novia",
    "nameEn": "Bridal Makeup",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "bridal_makeup_artist",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Maquillaje de Novia en {{city}}",
      "descriptionTemplate": "Maquillaje de Novia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "maquillaje de novia {{city}}",
        "bridal makeup {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Maquillaje de Novia",
      "subheadlineTemplate": "Maquillaje de Novia profesional en {{city}}."
    }
  },
  'bronceado': {
    "id": "bronceado",
    "nameEs": "Bronceado / Tanning",
    "nameEn": "Tanning Studio",
    "verticalId": "beauty-personal-care",
    "extends": "beauty_base",
    "tokens": "bronceado",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Bronceado / Tanning en {{city}}",
      "descriptionTemplate": "Bronceado en cabina, spray tan y tratamientos corporales.",
      "keywords": [
        "bronceado {{city}}",
        "spray tan {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Piel bronceada todo el año",
      "subheadlineTemplate": "Bronceado en cabina, spray tan y tratamientos corporales."
    },
    "serviceCategories": [
      "cabina",
      "spray"
    ]
  },
  'brow_bar': {
    "id": "brow_bar",
    "nameEs": "Bar de Cejas",
    "nameEn": "Brow Bar",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "brow_bar",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Bar de Cejas en {{city}}",
      "descriptionTemplate": "Bar de Cejas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "bar de cejas {{city}}",
        "brow bar {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Bar de Cejas",
      "subheadlineTemplate": "Bar de Cejas profesional en {{city}}."
    }
  },
  'centro_integral_belleza': {
    "id": "centro_integral_belleza",
    "nameEs": "Centro Integral de Belleza",
    "nameEn": "Beauty Center",
    "verticalId": "beauty-personal-care",
    "extends": "salon_belleza",
    "tokens": "centro_integral_belleza",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Centro Integral de Belleza en {{city}}",
      "descriptionTemplate": "Peluqueria, estetica, uñas, masajes y tratamientos en {{city}}.",
      "keywords": [
        "centro belleza {{city}}",
        "salon integral {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Todo lo que necesitas, en un solo lugar",
      "subheadlineTemplate": "Peluqueria, estetica, uñas, masajes y tratamientos en {{city}}."
    }
  },
  'chemical_peel_studio': {
    "id": "chemical_peel_studio",
    "nameEs": "Peelings Quimicos",
    "nameEn": "Chemical Peel Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "chemical_peel_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Peelings Quimicos en {{city}}",
      "descriptionTemplate": "Peelings Quimicos profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "peelings quimicos {{city}}",
        "chemical peel studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Peelings Quimicos",
      "subheadlineTemplate": "Peelings Quimicos profesional en {{city}}."
    }
  },
  'childrens_hair_salon': {
    "id": "childrens_hair_salon",
    "nameEs": "Peluqueria Infantil",
    "nameEn": "Kids Hair Salon",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "childrens_hair_salon",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Peluqueria Infantil en {{city}}",
      "descriptionTemplate": "Peluqueria Infantil profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "peluqueria infantil {{city}}",
        "kids hair salon {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Peluqueria Infantil",
      "subheadlineTemplate": "Peluqueria Infantil profesional en {{city}}."
    }
  },
  'cosmetic_tattoo_studio': {
    "id": "cosmetic_tattoo_studio",
    "nameEs": "Tatuaje Cosmetico",
    "nameEn": "Cosmetic Tattoo",
    "verticalId": "beauty-personal-care",
    "subVertical": "tattoo-piercing",
    "extends": "beauty_base",
    "tokens": "cosmetic_tattoo_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Tatuaje Cosmetico en {{city}}",
      "descriptionTemplate": "Tatuaje Cosmetico profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "tatuaje cosmetico {{city}}",
        "cosmetic tattoo {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tatuaje Cosmetico",
      "subheadlineTemplate": "Tatuaje Cosmetico profesional en {{city}}."
    }
  },
  'cosmetics_boutique': {
    "id": "cosmetics_boutique",
    "nameEs": "Boutique de Cosmeticos",
    "nameEn": "Cosmetics Boutique",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "cosmetics_boutique",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Boutique de Cosmeticos en {{city}}",
      "descriptionTemplate": "Boutique de Cosmeticos profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "boutique de cosmeticos {{city}}",
        "cosmetics boutique {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Boutique de Cosmeticos",
      "subheadlineTemplate": "Boutique de Cosmeticos profesional en {{city}}."
    }
  },
  'cryotherapy_studio': {
    "id": "cryotherapy_studio",
    "nameEs": "Crioterapia",
    "nameEn": "Cryotherapy",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "cryotherapy_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Crioterapia en {{city}}",
      "descriptionTemplate": "Crioterapia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "crioterapia {{city}}",
        "cryotherapy {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Crioterapia",
      "subheadlineTemplate": "Crioterapia profesional en {{city}}."
    }
  },
  'day_spa': {
    "id": "day_spa",
    "nameEs": "Spa de Dia",
    "nameEn": "Day Spa",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "day_spa",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Spa de Dia en {{city}}",
      "descriptionTemplate": "Spa de Dia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "spa de dia {{city}}",
        "day spa {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Spa de Dia",
      "subheadlineTemplate": "Spa de Dia profesional en {{city}}."
    }
  },
  'depilacion': {
    "id": "depilacion",
    "nameEs": "Depilacion",
    "nameEn": "Hair Removal Clinic",
    "verticalId": "beauty-personal-care",
    "tokens": "depilacion",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "services",
          "beforeAfter",
          "quoteForm",
          "contact",
          "testimonials",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "treatments": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "technology": {
        "sections": [
          "header",
          "services",
          "faq",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": false,
        "method": "consultation_form",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "label": "Tratamientos",
        "showPrices": true,
        "areaBasedPricing": true
      },
      "portfolio": {
        "enabled": false
      },
      "beforeAfter": {
        "enabled": true,
        "label": "Resultados"
      },
      "staffProfiles": {
        "enabled": false,
        "optional": true
      },
      "pricingDisplay": {
        "enabled": true,
        "showPerSession": true,
        "showPackageDiscounts": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": true,
        "tiers": [
          6,
          8,
          10
        ],
        "discounts": [
          20,
          30,
          40
        ]
      },
      "aftercareInfo": {
        "enabled": true
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      },
      "freeConsultation": {
        "enabled": true,
        "prominent": true
      },
      "technologyShowcase": {
        "enabled": true,
        "showFdaBadge": true,
        "showSkinTypeInfo": true
      }
    },
    "serviceCategories": [
      "laser",
      "cera",
      "electrolisis",
      "paquetes"
    ],
    "targetAudience": {
      "primary": "Women 20-45, seeking permanent hair reduction",
      "secondary": "Men, PCOS transformations"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Depilacion Laser en {{city}} | Resultados Permanentes",
      "descriptionTemplate": "Depilacion laser definitiva en {{city}}. Tecnologia avanzada, resultados permanentes. Consulta gratis.",
      "schemaType": "MedicalBusiness",
      "keywords": [
        "depilacion laser {{city}}",
        "depilacion definitiva {{city}}",
        "laser hair removal {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Tratamientos",
        "Tecnologia",
        "Resultados",
        "Contacto"
      ],
      "cta": {
        "text": "Consulta Gratis",
        "action": "consultationForm"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}} - Depilacion Laser Definitiva",
      "subheadlineTemplate": "Tecnologia de ultima generacion, resultados permanentes",
      "ctaPrimary": {
        "text": "Consulta Sin Cargo",
        "action": "consultationForm"
      },
      "ctaSecondary": {
        "text": "Ver Tratamientos",
        "action": "scrollTo:treatments"
      }
    }
  },
  'dermaplaning_studio': {
    "id": "dermaplaning_studio",
    "nameEs": "Dermaplaning",
    "nameEn": "Dermaplaning Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "dermaplaning_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Dermaplaning en {{city}}",
      "descriptionTemplate": "Dermaplaning profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "dermaplaning {{city}}",
        "dermaplaning studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Dermaplaning",
      "subheadlineTemplate": "Dermaplaning profesional en {{city}}."
    }
  },
  'dip_powder_nail_studio': {
    "id": "dip_powder_nail_studio",
    "nameEs": "Unas Dip Powder",
    "nameEn": "Dip Powder Nails",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "dip_powder_nail_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Unas Dip Powder en {{city}}",
      "descriptionTemplate": "Unas Dip Powder profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "unas dip powder {{city}}",
        "dip powder nails {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Unas Dip Powder",
      "subheadlineTemplate": "Unas Dip Powder profesional en {{city}}."
    }
  },
  'dreadlocks_studio': {
    "id": "dreadlocks_studio",
    "nameEs": "Estudio de Rastas",
    "nameEn": "Dreadlock Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "dreadlocks_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Estudio de Rastas en {{city}}",
      "descriptionTemplate": "Estudio de Rastas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "estudio de rastas {{city}}",
        "dreadlock studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Estudio de Rastas",
      "subheadlineTemplate": "Estudio de Rastas profesional en {{city}}."
    }
  },
  'electrolysis_clinic': {
    "id": "electrolysis_clinic",
    "nameEs": "Electrolisis",
    "nameEn": "Electrolysis",
    "verticalId": "beauty-personal-care",
    "subVertical": "body-hair-removal",
    "extends": "beauty_base",
    "tokens": "electrolysis_clinic",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Electrolisis en {{city}}",
      "descriptionTemplate": "Electrolisis profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "electrolisis {{city}}",
        "electrolysis {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Electrolisis",
      "subheadlineTemplate": "Electrolisis profesional en {{city}}."
    }
  },
  'escuela_belleza': {
    "id": "escuela_belleza",
    "nameEs": "Escuela de Estetica",
    "nameEn": "Beauty Academy",
    "verticalId": "beauty-personal-care",
    "extends": "educacion",
    "tokens": "escuela_belleza",
    "seo": {
      "schemaType": "EducationalOrganization",
      "titleTemplate": "{{businessName}} - Escuela de Estetica en {{city}}",
      "descriptionTemplate": "Cursos de peluqueria, estetica, uñas y maquillaje con certificado.",
      "keywords": [
        "escuela estetica {{city}}",
        "curso peluqueria {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tu carrera en belleza empieza aqui",
      "subheadlineTemplate": "Cursos de peluqueria, estetica, uñas y maquillaje con certificado."
    },
    "serviceCategories": [
      "peluqueria",
      "estetica",
      "uñas"
    ]
  },
  'estetica': {
    "id": "estetica",
    "nameEs": "Estetica/Facial",
    "nameEn": "Aesthetic Clinic",
    "verticalId": "beauty-personal-care",
    "tokens": "estetica",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "services",
          "beforeAfter",
          "team",
          "testimonials",
          "contact",
          "quoteForm",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "treatments": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "results": {
        "sections": [
          "header",
          "beforeAfter",
          "footer"
        ],
        "requiredSections": [
          "header",
          "beforeAfter",
          "footer"
        ]
      },
      "team": {
        "sections": [
          "header",
          "team",
          "footer"
        ],
        "requiredSections": [
          "header",
          "team",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": false,
        "method": "consultation_form",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "label": "Tratamientos",
        "showPrices": "from",
        "showDescription": true
      },
      "portfolio": {
        "enabled": true,
        "label": "Resultados"
      },
      "beforeAfter": {
        "enabled": true,
        "prominent": true,
        "sliderStyle": true,
        "minPairs": 20
      },
      "staffProfiles": {
        "enabled": true,
        "label": "Equipo Medico",
        "showCredentials": true,
        "showTreatmentCount": true
      },
      "pricingDisplay": {
        "enabled": true,
        "showFromPrice": true,
        "note": "Precios varian segun evaluacion. Primera consulta sin cargo."
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": true
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      },
      "freeConsultation": {
        "enabled": true
      }
    },
    "serviceCategories": [
      "faciales",
      "inyectables",
      "corporales",
      "laser"
    ],
    "targetAudience": {
      "primary": "Women 30-60, seeking professional skincare/anti-aging",
      "secondary": "Younger (acne), Men, Post-procedure"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Estetica en {{city}} | Tratamientos Avanzados",
      "descriptionTemplate": "Clinica estetica en {{city}}. Tratamientos faciales, corporales y mas. Consulta sin cargo.",
      "schemaType": "MedicalBusiness",
      "keywords": [
        "estetica {{city}}",
        "tratamiento facial {{city}}",
        "botox {{city}}",
        "clinica estetica {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Tratamientos",
        "Resultados",
        "Equipo",
        "Contacto"
      ],
      "cta": {
        "text": "Consulta",
        "action": "consultationForm"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}} - Belleza y Ciencia",
      "subheadlineTemplate": "Tratamientos avanzados con tecnologia de punta y resultados reales",
      "ctaPrimary": {
        "text": "Reservar Consulta",
        "action": "consultationForm"
      },
      "ctaSecondary": {
        "text": "Ver Resultados",
        "action": "scrollTo:results"
      }
    }
  },
  'esthetician_solo': {
    "id": "esthetician_solo",
    "nameEs": "Esteticista Independiente",
    "nameEn": "Independent Esthetician",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "esthetician_solo",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Esteticista Independiente en {{city}}",
      "descriptionTemplate": "Esteticista Independiente profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "esteticista independiente {{city}}",
        "independent esthetician {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Esteticista Independiente",
      "subheadlineTemplate": "Esteticista Independiente profesional en {{city}}."
    }
  },
  'extensiones_cabello': {
    "id": "extensiones_cabello",
    "nameEs": "Extensiones de Cabello",
    "nameEn": "Hair Extensions",
    "verticalId": "beauty-personal-care",
    "extends": "peluqueria",
    "tokens": "extensiones_cabello",
    "seo": {
      "schemaType": "HairSalon",
      "titleTemplate": "{{businessName}} - Extensiones de Cabello en {{city}}",
      "descriptionTemplate": "Extensiones con cabello 100% natural aplicadas por expertas en {{city}}.",
      "keywords": [
        "extensiones cabello {{city}}",
        "extensiones pelo {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Mas volumen, mas largo, mas vos",
      "subheadlineTemplate": "Extensiones con cabello 100% natural aplicadas por expertas en {{city}}."
    },
    "serviceCategories": [
      "queratina",
      "microanillos",
      "clip"
    ]
  },
  'eyelash_extension_studio': {
    "id": "eyelash_extension_studio",
    "nameEs": "Extensiones de Pestanas",
    "nameEn": "Eyelash Extensions",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "eyelash_extension_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Extensiones de Pestanas en {{city}}",
      "descriptionTemplate": "Extensiones de Pestanas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "extensiones de pestanas {{city}}",
        "eyelash extensions {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Extensiones de Pestanas",
      "subheadlineTemplate": "Extensiones de Pestanas profesional en {{city}}."
    }
  },
  'eyelash_lift_tint_studio': {
    "id": "eyelash_lift_tint_studio",
    "nameEs": "Lifting de Pestanas",
    "nameEn": "Lash Lift and Tint",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "eyelash_lift_tint_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Lifting de Pestanas en {{city}}",
      "descriptionTemplate": "Lifting de Pestanas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "lifting de pestanas {{city}}",
        "lash lift and tint {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Lifting de Pestanas",
      "subheadlineTemplate": "Lifting de Pestanas profesional en {{city}}."
    }
  },
  'facial_spa': {
    "id": "facial_spa",
    "nameEs": "Spa Facial",
    "nameEn": "Facial Spa",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "facial_spa",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Spa Facial en {{city}}",
      "descriptionTemplate": "Spa Facial profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "spa facial {{city}}",
        "facial spa {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Spa Facial",
      "subheadlineTemplate": "Spa Facial profesional en {{city}}."
    }
  },
  'float_tank_center': {
    "id": "float_tank_center",
    "nameEs": "Centro de Flotacion",
    "nameEn": "Float Tank Center",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "float_tank_center",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Centro de Flotacion en {{city}}",
      "descriptionTemplate": "Centro de Flotacion profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "centro de flotacion {{city}}",
        "float tank center {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Centro de Flotacion",
      "subheadlineTemplate": "Centro de Flotacion profesional en {{city}}."
    }
  },
  'gel_acrylic_nail_studio': {
    "id": "gel_acrylic_nail_studio",
    "nameEs": "Unas de Gel Acrilico",
    "nameEn": "Gel Acrylic Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "gel_acrylic_nail_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Unas de Gel Acrilico en {{city}}",
      "descriptionTemplate": "Unas de Gel Acrilico profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "unas de gel acrilico {{city}}",
        "gel acrylic studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Unas de Gel Acrilico",
      "subheadlineTemplate": "Unas de Gel Acrilico profesional en {{city}}."
    }
  },
  'glam_bus_party_service': {
    "id": "glam_bus_party_service",
    "nameEs": "Glam Bus",
    "nameEn": "Glam Bus",
    "verticalId": "beauty-personal-care",
    "subVertical": "mobile-beauty",
    "extends": "beauty_base",
    "tokens": "glam_bus_party_service",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Glam Bus en {{city}}",
      "descriptionTemplate": "Glam Bus profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "glam bus {{city}}",
        "glam bus {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Glam Bus",
      "subheadlineTemplate": "Glam Bus profesional en {{city}}."
    }
  },
  'hair_color_studio': {
    "id": "hair_color_studio",
    "nameEs": "Estudio de Color",
    "nameEn": "Hair Color Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "hair_color_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Estudio de Color en {{city}}",
      "descriptionTemplate": "Estudio de Color profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "estudio de color {{city}}",
        "hair color studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Estudio de Color",
      "subheadlineTemplate": "Estudio de Color profesional en {{city}}."
    }
  },
  'hair_extensions_specialist': {
    "id": "hair_extensions_specialist",
    "nameEs": "Extensiones",
    "nameEn": "Hair Extensions Specialist",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "hair_extensions_specialist",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Extensiones en {{city}}",
      "descriptionTemplate": "Extensiones profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "extensiones {{city}}",
        "hair extensions specialist {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Extensiones",
      "subheadlineTemplate": "Extensiones profesional en {{city}}."
    }
  },
  'hair_loss_clinic': {
    "id": "hair_loss_clinic",
    "nameEs": "Clinica Capilar",
    "nameEn": "Hair Loss Clinic",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "hair_loss_clinic",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Clinica Capilar en {{city}}",
      "descriptionTemplate": "Clinica Capilar profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "clinica capilar {{city}}",
        "hair loss clinic {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Clinica Capilar",
      "subheadlineTemplate": "Clinica Capilar profesional en {{city}}."
    }
  },
  'hammam_turkish_bath': {
    "id": "hammam_turkish_bath",
    "nameEs": "Hamam",
    "nameEn": "Hammam",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "hammam_turkish_bath",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Hamam en {{city}}",
      "descriptionTemplate": "Hamam profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "hamam {{city}}",
        "hammam {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Hamam",
      "subheadlineTemplate": "Hamam profesional en {{city}}."
    }
  },
  'henna_artist': {
    "id": "henna_artist",
    "nameEs": "Artista de Henna",
    "nameEn": "Henna Artist",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "henna_artist",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Artista de Henna en {{city}}",
      "descriptionTemplate": "Artista de Henna profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "artista de henna {{city}}",
        "henna artist {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Artista de Henna",
      "subheadlineTemplate": "Artista de Henna profesional en {{city}}."
    }
  },
  'henna_tattoo_studio': {
    "id": "henna_tattoo_studio",
    "nameEs": "Tatuajes de Henna",
    "nameEn": "Henna Tattoo",
    "verticalId": "beauty-personal-care",
    "subVertical": "tattoo-piercing",
    "extends": "beauty_base",
    "tokens": "henna_tattoo_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Tatuajes de Henna en {{city}}",
      "descriptionTemplate": "Tatuajes de Henna profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "tatuajes de henna {{city}}",
        "henna tattoo {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tatuajes de Henna",
      "subheadlineTemplate": "Tatuajes de Henna profesional en {{city}}."
    }
  },
  'hydrafacial_studio': {
    "id": "hydrafacial_studio",
    "nameEs": "Hidrafacial",
    "nameEn": "HydraFacial Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "hydrafacial_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Hidrafacial en {{city}}",
      "descriptionTemplate": "Hidrafacial profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "hidrafacial {{city}}",
        "hydrafacial studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Hidrafacial",
      "subheadlineTemplate": "Hidrafacial profesional en {{city}}."
    }
  },
  'infrared_sauna_studio': {
    "id": "infrared_sauna_studio",
    "nameEs": "Sauna Infrarroja",
    "nameEn": "Infrared Sauna",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "infrared_sauna_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Sauna Infrarroja en {{city}}",
      "descriptionTemplate": "Sauna Infrarroja profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "sauna infrarroja {{city}}",
        "infrared sauna {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Sauna Infrarroja",
      "subheadlineTemplate": "Sauna Infrarroja profesional en {{city}}."
    }
  },
  'ipl_hair_removal': {
    "id": "ipl_hair_removal",
    "nameEs": "Depilacion IPL",
    "nameEn": "IPL Hair Removal",
    "verticalId": "beauty-personal-care",
    "subVertical": "body-hair-removal",
    "extends": "beauty_base",
    "tokens": "ipl_hair_removal",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Depilacion IPL en {{city}}",
      "descriptionTemplate": "Depilacion IPL profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "depilacion ipl {{city}}",
        "ipl hair removal {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Depilacion IPL",
      "subheadlineTemplate": "Depilacion IPL profesional en {{city}}."
    }
  },
  'japanese_hair_straightening': {
    "id": "japanese_hair_straightening",
    "nameEs": "Alisado Japones",
    "nameEn": "Japanese Straightening",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "japanese_hair_straightening",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Alisado Japones en {{city}}",
      "descriptionTemplate": "Alisado Japones profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "alisado japones {{city}}",
        "japanese straightening {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Alisado Japones",
      "subheadlineTemplate": "Alisado Japones profesional en {{city}}."
    }
  },
  'kbeauty_skincare_studio': {
    "id": "kbeauty_skincare_studio",
    "nameEs": "Skincare Coreano",
    "nameEn": "K-Beauty Skincare",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "kbeauty_skincare_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Skincare Coreano en {{city}}",
      "descriptionTemplate": "Skincare Coreano profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "skincare coreano {{city}}",
        "k-beauty skincare {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Skincare Coreano",
      "subheadlineTemplate": "Skincare Coreano profesional en {{city}}."
    }
  },
  'keratin_smoothing_studio': {
    "id": "keratin_smoothing_studio",
    "nameEs": "Alisado Keratina",
    "nameEn": "Keratin Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "keratin_smoothing_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Alisado Keratina en {{city}}",
      "descriptionTemplate": "Alisado Keratina profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "alisado keratina {{city}}",
        "keratin studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Alisado Keratina",
      "subheadlineTemplate": "Alisado Keratina profesional en {{city}}."
    }
  },
  'korean_beauty_retail': {
    "id": "korean_beauty_retail",
    "nameEs": "Tienda K-Beauty",
    "nameEn": "K-Beauty Retail",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "korean_beauty_retail",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Tienda K-Beauty en {{city}}",
      "descriptionTemplate": "Tienda K-Beauty profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "tienda k-beauty {{city}}",
        "k-beauty retail {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tienda K-Beauty",
      "subheadlineTemplate": "Tienda K-Beauty profesional en {{city}}."
    }
  },
  'korean_jjimjilbang': {
    "id": "korean_jjimjilbang",
    "nameEs": "Jjimjilbang Coreano",
    "nameEn": "Jjimjilbang",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "korean_jjimjilbang",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Jjimjilbang Coreano en {{city}}",
      "descriptionTemplate": "Jjimjilbang Coreano profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "jjimjilbang coreano {{city}}",
        "jjimjilbang {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Jjimjilbang Coreano",
      "subheadlineTemplate": "Jjimjilbang Coreano profesional en {{city}}."
    }
  },
  'laser_hair_removal_clinic': {
    "id": "laser_hair_removal_clinic",
    "nameEs": "Depilacion Laser",
    "nameEn": "Laser Hair Removal",
    "verticalId": "beauty-personal-care",
    "subVertical": "body-hair-removal",
    "extends": "beauty_base",
    "tokens": "laser_hair_removal_clinic",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Depilacion Laser en {{city}}",
      "descriptionTemplate": "Depilacion Laser profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "depilacion laser {{city}}",
        "laser hair removal {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Depilacion Laser",
      "subheadlineTemplate": "Depilacion Laser profesional en {{city}}."
    }
  },
  'led_light_therapy_studio': {
    "id": "led_light_therapy_studio",
    "nameEs": "Terapia LED",
    "nameEn": "LED Light Therapy",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "led_light_therapy_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Terapia LED en {{city}}",
      "descriptionTemplate": "Terapia LED profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "terapia led {{city}}",
        "led light therapy {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Terapia LED",
      "subheadlineTemplate": "Terapia LED profesional en {{city}}."
    }
  },
  'makeup_artist_studio': {
    "id": "makeup_artist_studio",
    "nameEs": "Maquilladora",
    "nameEn": "Makeup Artist",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "makeup_artist_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Maquilladora en {{city}}",
      "descriptionTemplate": "Maquilladora profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "maquilladora {{city}}",
        "makeup artist {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Maquilladora",
      "subheadlineTemplate": "Maquilladora profesional en {{city}}."
    }
  },
  'maquillaje': {
    "id": "maquillaje",
    "nameEs": "Maquillaje",
    "nameEn": "Makeup Artist",
    "verticalId": "beauty-personal-care",
    "tokens": "maquillaje",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "portfolio",
          "services",
          "beforeAfter",
          "team",
          "testimonials",
          "contact",
          "quoteForm",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "portfolio": {
        "sections": [
          "header",
          "portfolio",
          "footer"
        ],
        "requiredSections": [
          "header",
          "portfolio",
          "footer"
        ]
      },
      "services": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "about": {
        "sections": [
          "header",
          "team",
          "footer"
        ],
        "requiredSections": [
          "header",
          "team",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": false,
        "method": "inquiry_form",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "showPrices": true,
        "showInclusions": true
      },
      "portfolio": {
        "enabled": true,
        "minImages": 30,
        "categories": [
          "bridal",
          "eventos",
          "editorial",
          "lecciones"
        ],
        "beforeAfter": true
      },
      "beforeAfter": {
        "enabled": true
      },
      "staffProfiles": {
        "enabled": true,
        "label": "Artista",
        "singleArtist": true
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": false
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": false,
        "useServiceArea": true
      },
      "trialService": {
        "enabled": true,
        "label": "Prueba incluida"
      }
    },
    "serviceCategories": [
      "novia",
      "eventos",
      "editorial",
      "lecciones"
    ],
    "targetAudience": {
      "primary": "Women 22-40, special events (weddings, parties)",
      "secondary": "Editorial/Commercial, Bridal parties"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Maquillaje Profesional en {{city}}",
      "descriptionTemplate": "Maquillaje profesional en {{city}}. Novias, eventos y editorial. Reserva tu fecha.",
      "schemaType": "BeautySalon",
      "keywords": [
        "maquillaje {{city}}",
        "maquillaje novia {{city}}",
        "makeup artist {{city}}",
        "maquillaje profesional {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Portafolio",
        "Servicios",
        "Sobre Mi",
        "Contacto"
      ],
      "cta": {
        "text": "Contacto",
        "action": "inquiryForm"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "Resalta Tu Belleza Natural",
      "subheadlineTemplate": "Maquillaje profesional para tu momento especial",
      "ctaPrimary": {
        "text": "Reservar Fecha",
        "action": "inquiryForm"
      },
      "ctaSecondary": {
        "text": "Ver Portafolio",
        "action": "scrollTo:portfolio"
      }
    }
  },
  'masajes': {
    "id": "masajes",
    "nameEs": "Masajes",
    "nameEn": "Massage Therapy",
    "verticalId": "beauty-personal-care",
    "extends": "spa",
    "tokens": "masajes",
    "seo": {
      "schemaType": "HealthAndBeautyBusiness",
      "titleTemplate": "{{businessName}} - Masajes en {{city}}",
      "descriptionTemplate": "Masajes terapeuticos, descontracturantes y relajantes en {{city}}.",
      "keywords": [
        "masajes {{city}}",
        "masajista {{city}}",
        "masaje descontracturante {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Descansa, sana, renueva",
      "subheadlineTemplate": "Masajes terapeuticos, descontracturantes y relajantes en {{city}}."
    },
    "serviceCategories": [
      "relajante",
      "descontracturante",
      "terapeutico",
      "piedras"
    ]
  },
  'medical_pedicure': {
    "id": "medical_pedicure",
    "nameEs": "Podologia Estetica",
    "nameEn": "Medical Pedicure",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "medical_pedicure",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Podologia Estetica en {{city}}",
      "descriptionTemplate": "Podologia Estetica profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "podologia estetica {{city}}",
        "medical pedicure {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Podologia Estetica",
      "subheadlineTemplate": "Podologia Estetica profesional en {{city}}."
    }
  },
  'medical_spa': {
    "id": "medical_spa",
    "nameEs": "Spa Medico",
    "nameEn": "Medical Spa",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "medical_spa",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Spa Medico en {{city}}",
      "descriptionTemplate": "Spa Medico profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "spa medico {{city}}",
        "medical spa {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Spa Medico",
      "subheadlineTemplate": "Spa Medico profesional en {{city}}."
    },
    "flags": [
      "regulated"
    ]
  },
  'mens_barbershop': {
    "id": "mens_barbershop",
    "nameEs": "Barberia",
    "nameEn": "Barbershop",
    "verticalId": "beauty-personal-care",
    "subVertical": "mens-grooming",
    "extends": "beauty_base",
    "tokens": "mens_barbershop",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Barberia en {{city}}",
      "descriptionTemplate": "Barberia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "barberia {{city}}",
        "barbershop {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Barberia",
      "subheadlineTemplate": "Barberia profesional en {{city}}."
    }
  },
  'mens_grooming_lounge': {
    "id": "mens_grooming_lounge",
    "nameEs": "Lounge Masculino",
    "nameEn": "Mens Grooming Lounge",
    "verticalId": "beauty-personal-care",
    "subVertical": "mens-grooming",
    "extends": "beauty_base",
    "tokens": "mens_grooming_lounge",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Lounge Masculino en {{city}}",
      "descriptionTemplate": "Lounge Masculino profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "lounge masculino {{city}}",
        "mens grooming lounge {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Lounge Masculino",
      "subheadlineTemplate": "Lounge Masculino profesional en {{city}}."
    }
  },
  'mens_spa': {
    "id": "mens_spa",
    "nameEs": "Spa Masculino",
    "nameEn": "Mens Spa",
    "verticalId": "beauty-personal-care",
    "subVertical": "mens-grooming",
    "extends": "beauty_base",
    "tokens": "mens_spa",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Spa Masculino en {{city}}",
      "descriptionTemplate": "Spa Masculino profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "spa masculino {{city}}",
        "mens spa {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Spa Masculino",
      "subheadlineTemplate": "Spa Masculino profesional en {{city}}."
    }
  },
  'microblading_studio': {
    "id": "microblading_studio",
    "nameEs": "Microblading",
    "nameEn": "Microblading Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "microblading_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Microblading en {{city}}",
      "descriptionTemplate": "Microblading profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "microblading {{city}}",
        "microblading studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Microblading",
      "subheadlineTemplate": "Microblading profesional en {{city}}."
    }
  },
  'microdermabrasion_clinic': {
    "id": "microdermabrasion_clinic",
    "nameEs": "Microdermabrasion",
    "nameEn": "Microdermabrasion",
    "verticalId": "beauty-personal-care",
    "subVertical": "skin-aesthetic",
    "extends": "beauty_base",
    "tokens": "microdermabrasion_clinic",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Microdermabrasion en {{city}}",
      "descriptionTemplate": "Microdermabrasion profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "microdermabrasion {{city}}",
        "microdermabrasion {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Microdermabrasion",
      "subheadlineTemplate": "Microdermabrasion profesional en {{city}}."
    }
  },
  'micropigmentacion': {
    "id": "micropigmentacion",
    "nameEs": "Micropigmentacion",
    "nameEn": "Permanent Makeup",
    "verticalId": "beauty-personal-care",
    "extends": "beauty_base",
    "tokens": "micropigmentacion",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Micropigmentacion en {{city}}",
      "descriptionTemplate": "Cejas, labios y delineado con tecnicas de ultima generacion.",
      "keywords": [
        "micropigmentacion {{city}}",
        "cejas pelo a pelo {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Maquillaje que dura meses",
      "subheadlineTemplate": "Cejas, labios y delineado con tecnicas de ultima generacion."
    },
    "serviceCategories": [
      "cejas",
      "labios",
      "delineado"
    ]
  },
  'mobile_hair_stylist': {
    "id": "mobile_hair_stylist",
    "nameEs": "Peluqueria Domicilio",
    "nameEn": "Mobile Hair Stylist",
    "verticalId": "beauty-personal-care",
    "subVertical": "mobile-beauty",
    "extends": "beauty_base",
    "tokens": "mobile_hair_stylist",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Peluqueria Domicilio en {{city}}",
      "descriptionTemplate": "Peluqueria Domicilio profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "peluqueria domicilio {{city}}",
        "mobile hair stylist {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Peluqueria Domicilio",
      "subheadlineTemplate": "Peluqueria Domicilio profesional en {{city}}."
    }
  },
  'mobile_lash_tech': {
    "id": "mobile_lash_tech",
    "nameEs": "Pestanas a Domicilio",
    "nameEn": "Mobile Lash Tech",
    "verticalId": "beauty-personal-care",
    "subVertical": "mobile-beauty",
    "extends": "beauty_base",
    "tokens": "mobile_lash_tech",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Pestanas a Domicilio en {{city}}",
      "descriptionTemplate": "Pestanas a Domicilio profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "pestanas a domicilio {{city}}",
        "mobile lash tech {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Pestanas a Domicilio",
      "subheadlineTemplate": "Pestanas a Domicilio profesional en {{city}}."
    }
  },
  'mobile_makeup_artist': {
    "id": "mobile_makeup_artist",
    "nameEs": "Maquillaje Domicilio",
    "nameEn": "Mobile Makeup",
    "verticalId": "beauty-personal-care",
    "subVertical": "mobile-beauty",
    "extends": "beauty_base",
    "tokens": "mobile_makeup_artist",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Maquillaje Domicilio en {{city}}",
      "descriptionTemplate": "Maquillaje Domicilio profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "maquillaje domicilio {{city}}",
        "mobile makeup {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Maquillaje Domicilio",
      "subheadlineTemplate": "Maquillaje Domicilio profesional en {{city}}."
    }
  },
  'mobile_manicure_service': {
    "id": "mobile_manicure_service",
    "nameEs": "Manicura a Domicilio",
    "nameEn": "Mobile Manicure",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "mobile_manicure_service",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Manicura a Domicilio en {{city}}",
      "descriptionTemplate": "Manicura a Domicilio profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "manicura a domicilio {{city}}",
        "mobile manicure {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Manicura a Domicilio",
      "subheadlineTemplate": "Manicura a Domicilio profesional en {{city}}."
    }
  },
  'mobile_spray_tan': {
    "id": "mobile_spray_tan",
    "nameEs": "Bronceado a Domicilio",
    "nameEn": "Mobile Spray Tan",
    "verticalId": "beauty-personal-care",
    "subVertical": "mobile-beauty",
    "extends": "beauty_base",
    "tokens": "mobile_spray_tan",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Bronceado a Domicilio en {{city}}",
      "descriptionTemplate": "Bronceado a Domicilio profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "bronceado a domicilio {{city}}",
        "mobile spray tan {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Bronceado a Domicilio",
      "subheadlineTemplate": "Bronceado a Domicilio profesional en {{city}}."
    }
  },
  'nail_art_studio': {
    "id": "nail_art_studio",
    "nameEs": "Arte en Unas",
    "nameEn": "Nail Art Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "nail_art_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Arte en Unas en {{city}}",
      "descriptionTemplate": "Arte en Unas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "arte en unas {{city}}",
        "nail art studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Arte en Unas",
      "subheadlineTemplate": "Arte en Unas profesional en {{city}}."
    }
  },
  'nail_polish_boutique': {
    "id": "nail_polish_boutique",
    "nameEs": "Tienda de Esmaltes",
    "nameEn": "Nail Polish Shop",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "nail_polish_boutique",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Tienda de Esmaltes en {{city}}",
      "descriptionTemplate": "Tienda de Esmaltes profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "tienda de esmaltes {{city}}",
        "nail polish shop {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tienda de Esmaltes",
      "subheadlineTemplate": "Tienda de Esmaltes profesional en {{city}}."
    }
  },
  'nail_salon': {
    "id": "nail_salon",
    "nameEs": "Salon de Unas",
    "nameEn": "Nail Salon",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "nail_salon",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Salon de Unas en {{city}}",
      "descriptionTemplate": "Salon de Unas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "salon de unas {{city}}",
        "nail salon {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Salon de Unas",
      "subheadlineTemplate": "Salon de Unas profesional en {{city}}."
    }
  },
  'natural_soap_maker': {
    "id": "natural_soap_maker",
    "nameEs": "Jabones Artesanales",
    "nameEn": "Natural Soap Shop",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "natural_soap_maker",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Jabones Artesanales en {{city}}",
      "descriptionTemplate": "Jabones Artesanales profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "jabones artesanales {{city}}",
        "natural soap shop {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Jabones Artesanales",
      "subheadlineTemplate": "Jabones Artesanales profesional en {{city}}."
    }
  },
  'onsen_ryokan': {
    "id": "onsen_ryokan",
    "nameEs": "Onsen Ryokan",
    "nameEn": "Onsen Ryokan",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "onsen_ryokan",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Onsen Ryokan en {{city}}",
      "descriptionTemplate": "Onsen Ryokan profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "onsen ryokan {{city}}",
        "onsen ryokan {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Onsen Ryokan",
      "subheadlineTemplate": "Onsen Ryokan profesional en {{city}}."
    }
  },
  'pedicure_spa': {
    "id": "pedicure_spa",
    "nameEs": "Spa de Pies",
    "nameEn": "Pedicure Spa",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "pedicure_spa",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Spa de Pies en {{city}}",
      "descriptionTemplate": "Spa de Pies profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "spa de pies {{city}}",
        "pedicure spa {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Spa de Pies",
      "subheadlineTemplate": "Spa de Pies profesional en {{city}}."
    }
  },
  'peluqueria': {
    "id": "peluqueria",
    "nameEs": "Peluqueria",
    "nameEn": "Hair Salon",
    "verticalId": "beauty-personal-care",
    "tokens": "peluqueria",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "servicesPreview",
          "booking",
          "galleryPreview",
          "team",
          "locationBlock",
          "testimonial",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "servicesPreview",
          "contact",
          "footer"
        ]
      },
      "services": {
        "sections": [
          "header",
          "serviceMenu",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "serviceMenu",
          "footer"
        ]
      },
      "gallery": {
        "sections": [
          "header",
          "portfolioGallery",
          "footer"
        ],
        "requiredSections": [
          "header",
          "portfolioGallery",
          "footer"
        ]
      },
      "team": {
        "sections": [
          "header",
          "teamProfiles",
          "footer"
        ],
        "requiredSections": [
          "header",
          "teamProfiles",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contactSplit",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contactSplit",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": true,
        "method": "fresha",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "showPrices": true,
        "showDuration": true,
        "filterable": true
      },
      "portfolio": {
        "enabled": true,
        "minImages": 20,
        "categories": [
          "cortes",
          "color",
          "mechas",
          "peinados"
        ]
      },
      "beforeAfter": {
        "enabled": false,
        "optional": true
      },
      "staffProfiles": {
        "enabled": true,
        "showInstagram": true,
        "bookable": true
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": false
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      }
    },
    "serviceCategories": [
      "cortes",
      "coloracion",
      "tratamientos",
      "peinados",
      "extensiones"
    ],
    "targetAudience": {
      "primary": "Women 25-45, middle-class, repeat customers",
      "secondary": "Men, Youth 18-25 for trends"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Peluqueria en {{city}} | Servicios y Precios",
      "descriptionTemplate": "Cortes, coloracion y tratamientos en {{city}}. Reserva tu cita online. Precios desde {{lowestPrice}}.",
      "schemaType": "BeautySalon",
      "keywords": [
        "peluqueria {{city}}",
        "corte de cabello {{neighborhood}}",
        "salon de belleza {{city}}",
        "coloracion {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "cta": {
        "text": "Reservar",
        "action": "booking"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}} - Tu Mejor Look en {{city}}",
      "subheadlineTemplate": "Cortes profesionales, coloracion y tratamientos que transforman tu estilo",
      "ctaPrimary": {
        "text": "Reservar Cita",
        "action": "booking"
      },
      "ctaSecondary": {
        "text": "Ver Servicios",
        "action": "scrollTo:services"
      }
    }
  },
  'peluqueria_canina': {
    "id": "peluqueria_canina",
    "nameEs": "Peluqueria Canina",
    "nameEn": "Pet Grooming",
    "verticalId": "beauty-personal-care",
    "extends": "beauty_base",
    "tokens": "peluqueria_canina",
    "seo": {
      "schemaType": "PetStore",
      "titleTemplate": "{{businessName}} - Peluqueria Canina en {{city}}",
      "descriptionTemplate": "Bano, corte y estetica canina en {{city}} con productos hipoalergenicos.",
      "keywords": [
        "peluqueria canina {{city}}",
        "bano perros {{city}}",
        "estetica canina {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tu mascota siempre impecable",
      "subheadlineTemplate": "Bano, corte y estetica canina en {{city}} con productos hipoalergenicos."
    },
    "serviceCategories": [
      "bano",
      "corte",
      "desanudar"
    ]
  },
  'perfumery': {
    "id": "perfumery",
    "nameEs": "Perfumeria",
    "nameEn": "Perfumery",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "perfumery",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Perfumeria en {{city}}",
      "descriptionTemplate": "Perfumeria profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "perfumeria {{city}}",
        "perfumery {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Perfumeria",
      "subheadlineTemplate": "Perfumeria profesional en {{city}}."
    }
  },
  'permanent_makeup_studio': {
    "id": "permanent_makeup_studio",
    "nameEs": "Maquillaje Permanente",
    "nameEn": "Permanent Makeup",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "permanent_makeup_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Maquillaje Permanente en {{city}}",
      "descriptionTemplate": "Maquillaje Permanente profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "maquillaje permanente {{city}}",
        "permanent makeup {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Maquillaje Permanente",
      "subheadlineTemplate": "Maquillaje Permanente profesional en {{city}}."
    }
  },
  'pestanas': {
    "id": "pestanas",
    "nameEs": "Pestañas y Cejas",
    "nameEn": "Lashes & Brows",
    "verticalId": "beauty-personal-care",
    "tokens": "pestanas",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "services",
          "booking",
          "portfolio",
          "gallery",
          "testimonials",
          "contact",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "services": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "gallery": {
        "sections": [
          "header",
          "portfolio",
          "gallery",
          "footer"
        ],
        "requiredSections": [
          "header",
          "portfolio",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "whatsappFloat": {
        "enabled": true
      },
      "serviceMenu": {
        "enabled": true,
        "showPrices": true,
        "showDuration": true,
        "filterable": true
      },
      "portfolio": {
        "enabled": true,
        "minImages": 12,
        "categories": [
          "pestanas",
          "cejas",
          "microblading"
        ]
      },
      "beforeAfter": {
        "enabled": false,
        "optional": true
      },
      "staffProfiles": {
        "enabled": false
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": false
      },
      "onlineBooking": {
        "enabled": true,
        "method": "whatsapp",
        "fallback": "whatsapp"
      },
      "googleMapsEmbed": {
        "enabled": true
      }
    },
    "serviceCategories": [
      "pestanas",
      "cejas",
      "microblading",
      "lifting"
    ],
    "targetAudience": {
      "primary": "Women 20-40, Instagram-driven, beauty-conscious",
      "secondary": "Brides, event attendees, beauty professionals"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Pestañas y Cejas en {{city}}",
      "descriptionTemplate": "Extensiones de pestañas, microblading y diseño de cejas en {{city}}. Reserva tu cita por WhatsApp. Precios desde {{lowestPrice}}.",
      "schemaType": "BeautySalon",
      "keywords": [
        "pestañas {{city}}",
        "extensiones de pestañas {{city}}",
        "microblading {{city}}",
        "diseño de cejas {{city}}",
        "lash extensions {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Contacto"
      ],
      "cta": {
        "text": "Reservar",
        "action": "booking"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}} - Tu Mirada Perfecta en {{city}}",
      "subheadlineTemplate": "Extensiones de pestañas, microblading y diseño de cejas que realzan tu belleza natural",
      "ctaPrimary": {
        "text": "Reservar Cita",
        "action": "booking"
      },
      "ctaSecondary": {
        "text": "Ver Servicios",
        "action": "scrollTo:services"
      }
    }
  },
  'pharmacy_cosmetics': {
    "id": "pharmacy_cosmetics",
    "nameEs": "Dermofarmacia",
    "nameEn": "Pharmacy Cosmetics",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "pharmacy_cosmetics",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Dermofarmacia en {{city}}",
      "descriptionTemplate": "Dermofarmacia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "dermofarmacia {{city}}",
        "pharmacy cosmetics {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Dermofarmacia",
      "subheadlineTemplate": "Dermofarmacia profesional en {{city}}."
    }
  },
  'podologia_estetica': {
    "id": "podologia_estetica",
    "nameEs": "Podologia Estetica",
    "nameEn": "Podiatry & Pedicure",
    "verticalId": "beauty-personal-care",
    "extends": "beauty_base",
    "tokens": "podologia_estetica",
    "seo": {
      "schemaType": "HealthAndBeautyBusiness",
      "titleTemplate": "{{businessName}} - Podologia Estetica en {{city}}",
      "descriptionTemplate": "Pedicuria estetica y clinica: uñas encarnadas, callosidades, hongos.",
      "keywords": [
        "podologia {{city}}",
        "pedicuria {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Pies sanos, pies lindos",
      "subheadlineTemplate": "Pedicuria estetica y clinica: uñas encarnadas, callosidades, hongos."
    },
    "serviceCategories": [
      "pedicuria",
      "clinica"
    ]
  },
  'press_on_nails_maker': {
    "id": "press_on_nails_maker",
    "nameEs": "Unas Postizas",
    "nameEn": "Press-On Nails",
    "verticalId": "beauty-personal-care",
    "subVertical": "nails",
    "extends": "beauty_base",
    "tokens": "press_on_nails_maker",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Unas Postizas en {{city}}",
      "descriptionTemplate": "Unas Postizas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "unas postizas {{city}}",
        "press-on nails {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Unas Postizas",
      "subheadlineTemplate": "Unas Postizas profesional en {{city}}."
    }
  },
  'salon_belleza': {
    "id": "salon_belleza",
    "nameEs": "Salon de Belleza",
    "nameEn": "Beauty Salon",
    "verticalId": "beauty-personal-care",
    "tokens": "salon_belleza",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "services",
          "booking",
          "gallery",
          "portfolio",
          "team",
          "testimonials",
          "contact",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "services": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "gallery": {
        "sections": [
          "header",
          "portfolio",
          "gallery",
          "footer"
        ],
        "requiredSections": [
          "header",
          "portfolio",
          "footer"
        ]
      },
      "team": {
        "sections": [
          "header",
          "team",
          "footer"
        ],
        "requiredSections": [
          "header",
          "team",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": true,
        "method": "fresha",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "showPrices": true,
        "showDuration": true,
        "filterable": true,
        "filterableCategories": true
      },
      "portfolio": {
        "enabled": true,
        "minImages": 20,
        "categories": [
          "cabello",
          "unas",
          "maquillaje",
          "tratamientos"
        ]
      },
      "beforeAfter": {
        "enabled": false,
        "optional": true
      },
      "staffProfiles": {
        "enabled": true,
        "showInstagram": true,
        "bookable": true
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": false
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      }
    },
    "serviceCategories": [
      "cabello",
      "unas",
      "maquillaje",
      "tratamientos_faciales",
      "tratamientos_corporales",
      "paquetes"
    ],
    "targetAudience": {
      "primary": "Women 25-55, middle to upper-class, seeking premium multi-service beauty care",
      "secondary": "Brides, quinceañeras, event clients"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Salon de Belleza en {{city}} | Todos los Servicios",
      "descriptionTemplate": "Cabello, uñas, maquillaje y tratamientos faciales en {{city}}. Reserva tu cita online. Tu centro de belleza integral.",
      "schemaType": "BeautySalon",
      "keywords": [
        "salon de belleza {{city}}",
        "centro de belleza {{city}}",
        "maquillaje profesional {{city}}",
        "manicura {{city}}",
        "tratamiento facial {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "cta": {
        "text": "Reservar",
        "action": "booking"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}} - Tu Salon de Belleza en {{city}}",
      "subheadlineTemplate": "Cabello, uñas, maquillaje y tratamientos — todo en un solo lugar",
      "ctaPrimary": {
        "text": "Reservar Cita",
        "action": "booking"
      },
      "ctaSecondary": {
        "text": "Ver Servicios",
        "action": "scrollTo:services"
      }
    }
  },
  'salt_cave_halotherapy': {
    "id": "salt_cave_halotherapy",
    "nameEs": "Haloterapia",
    "nameEn": "Salt Cave",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "salt_cave_halotherapy",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Haloterapia en {{city}}",
      "descriptionTemplate": "Haloterapia profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "haloterapia {{city}}",
        "salt cave {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Haloterapia",
      "subheadlineTemplate": "Haloterapia profesional en {{city}}."
    }
  },
  'sauna_banya': {
    "id": "sauna_banya",
    "nameEs": "Sauna Rusa",
    "nameEn": "Sauna Banya",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "sauna_banya",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Sauna Rusa en {{city}}",
      "descriptionTemplate": "Sauna Rusa profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "sauna rusa {{city}}",
        "sauna banya {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Sauna Rusa",
      "subheadlineTemplate": "Sauna Rusa profesional en {{city}}."
    }
  },
  'scalp_care_studio': {
    "id": "scalp_care_studio",
    "nameEs": "Tratamiento Capilar",
    "nameEn": "Scalp Care",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "scalp_care_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Tratamiento Capilar en {{city}}",
      "descriptionTemplate": "Tratamiento Capilar profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "tratamiento capilar {{city}}",
        "scalp care {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tratamiento Capilar",
      "subheadlineTemplate": "Tratamiento Capilar profesional en {{city}}."
    }
  },
  'scarification_studio': {
    "id": "scarification_studio",
    "nameEs": "Escarificacion",
    "nameEn": "Scarification Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "tattoo-piercing",
    "extends": "beauty_base",
    "tokens": "scarification_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Escarificacion en {{city}}",
      "descriptionTemplate": "Escarificacion profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "escarificacion {{city}}",
        "scarification studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Escarificacion",
      "subheadlineTemplate": "Escarificacion profesional en {{city}}."
    },
    "flags": [
      "age-gated"
    ]
  },
  'sfx_makeup_artist': {
    "id": "sfx_makeup_artist",
    "nameEs": "Maquillaje FX",
    "nameEn": "SFX Makeup",
    "verticalId": "beauty-personal-care",
    "subVertical": "makeup",
    "extends": "beauty_base",
    "tokens": "sfx_makeup_artist",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Maquillaje FX en {{city}}",
      "descriptionTemplate": "Maquillaje FX profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "maquillaje fx {{city}}",
        "sfx makeup {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Maquillaje FX",
      "subheadlineTemplate": "Maquillaje FX profesional en {{city}}."
    }
  },
  'shaving_parlor': {
    "id": "shaving_parlor",
    "nameEs": "Salon de Afeitado",
    "nameEn": "Shaving Parlor",
    "verticalId": "beauty-personal-care",
    "subVertical": "mens-grooming",
    "extends": "beauty_base",
    "tokens": "shaving_parlor",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Salon de Afeitado en {{city}}",
      "descriptionTemplate": "Salon de Afeitado profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "salon de afeitado {{city}}",
        "shaving parlor {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Salon de Afeitado",
      "subheadlineTemplate": "Salon de Afeitado profesional en {{city}}."
    }
  },
  'spa': {
    "id": "spa",
    "nameEs": "Spa/Wellness",
    "nameEn": "Spa/Wellness",
    "verticalId": "beauty-personal-care",
    "tokens": "spa",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "services",
          "booking",
          "gallery",
          "team",
          "testimonials",
          "contact",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "treatments": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "packages": {
        "sections": [
          "header",
          "membershipPlans",
          "quoteForm",
          "footer"
        ],
        "requiredSections": [
          "header",
          "membershipPlans",
          "footer"
        ]
      },
      "team": {
        "sections": [
          "header",
          "team",
          "footer"
        ],
        "requiredSections": [
          "header",
          "team",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": true,
        "method": "fresha",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "label": "Tratamientos",
        "showPrices": true,
        "showDuration": true
      },
      "portfolio": {
        "enabled": false,
        "optional": true
      },
      "beforeAfter": {
        "enabled": false
      },
      "staffProfiles": {
        "enabled": true,
        "label": "Terapeutas"
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": true,
        "showSavings": true
      },
      "aftercareInfo": {
        "enabled": false
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      },
      "giftVouchers": {
        "enabled": true
      }
    },
    "serviceCategories": [
      "masajes",
      "faciales",
      "corporales",
      "paquetes"
    ],
    "targetAudience": {
      "primary": "Women 30-55, seeking relaxation and self-care",
      "secondary": "Couples, Business travelers, Mums"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Spa en {{city}} | Tratamientos y Paquetes",
      "descriptionTemplate": "Spa en {{city}}. Masajes, faciales y tratamientos corporales. Reserva tu experiencia de relajacion.",
      "schemaType": "HealthAndBeautyBusiness",
      "keywords": [
        "spa {{city}}",
        "masajes {{city}}",
        "tratamiento facial {{city}}",
        "relajacion {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Tratamientos",
        "Paquetes",
        "Equipo",
        "Contacto"
      ],
      "cta": {
        "text": "Reservar",
        "action": "booking"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "Tu Santuario de Bienestar",
      "subheadlineTemplate": "Relajate, renueva y reconnectate en {{businessName}}",
      "ctaPrimary": {
        "text": "Reservar Experiencia",
        "action": "booking"
      },
      "ctaSecondary": {
        "text": "Ver Tratamientos",
        "action": "scrollTo:treatments"
      }
    }
  },
  'sugaring_studio': {
    "id": "sugaring_studio",
    "nameEs": "Depilacion con Azucar",
    "nameEn": "Sugaring Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "body-hair-removal",
    "extends": "beauty_base",
    "tokens": "sugaring_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Depilacion con Azucar en {{city}}",
      "descriptionTemplate": "Depilacion con Azucar profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "depilacion con azucar {{city}}",
        "sugaring studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Depilacion con Azucar",
      "subheadlineTemplate": "Depilacion con Azucar profesional en {{city}}."
    }
  },
  'tanning_salon': {
    "id": "tanning_salon",
    "nameEs": "Salon de Bronceado",
    "nameEn": "Tanning Salon",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "tanning_salon",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Salon de Bronceado en {{city}}",
      "descriptionTemplate": "Salon de Bronceado profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "salon de bronceado {{city}}",
        "tanning salon {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Salon de Bronceado",
      "subheadlineTemplate": "Salon de Bronceado profesional en {{city}}."
    }
  },
  'tattoo_removal_clinic': {
    "id": "tattoo_removal_clinic",
    "nameEs": "Remocion de Tatuajes",
    "nameEn": "Tattoo Removal",
    "verticalId": "beauty-personal-care",
    "subVertical": "tattoo-piercing",
    "extends": "beauty_base",
    "tokens": "tattoo_removal_clinic",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Remocion de Tatuajes en {{city}}",
      "descriptionTemplate": "Remocion de Tatuajes profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "remocion de tatuajes {{city}}",
        "tattoo removal {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Remocion de Tatuajes",
      "subheadlineTemplate": "Remocion de Tatuajes profesional en {{city}}."
    }
  },
  'tattoo_studio': {
    "id": "tattoo_studio",
    "nameEs": "Estudio de Tatuajes",
    "nameEn": "Tattoo Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "tattoo-piercing",
    "extends": "beauty_base",
    "tokens": "tattoo_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Estudio de Tatuajes en {{city}}",
      "descriptionTemplate": "Estudio de Tatuajes profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "estudio de tatuajes {{city}}",
        "tattoo studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Estudio de Tatuajes",
      "subheadlineTemplate": "Estudio de Tatuajes profesional en {{city}}."
    }
  },
  'tatuajes': {
    "id": "tatuajes",
    "nameEs": "Tatuajes/Piercing",
    "nameEn": "Tattoo/Piercing Studio",
    "verticalId": "beauty-personal-care",
    "tokens": "tatuajes",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "portfolio",
          "team",
          "contact",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "portfolio",
          "contact",
          "footer"
        ]
      },
      "portfolio": {
        "sections": [
          "header",
          "portfolioGallery",
          "footer"
        ],
        "requiredSections": [
          "header",
          "portfolioGallery",
          "footer"
        ]
      },
      "artists": {
        "sections": [
          "header",
          "artistProfiles",
          "footer"
        ],
        "requiredSections": [
          "header",
          "artistProfiles",
          "footer"
        ]
      },
      "info": {
        "sections": [
          "header",
          "aftercareGuide",
          "faq",
          "consultationForm",
          "contactBlock",
          "footer"
        ],
        "requiredSections": [
          "header",
          "faq",
          "contactBlock",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": false,
        "method": "consultation_form",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": false
      },
      "portfolio": {
        "enabled": true,
        "minImages": 50,
        "categories": [
          "tradicional",
          "realismo",
          "blackwork",
          "japones",
          "minimal"
        ],
        "filterByArtist": true,
        "filterByStyle": true
      },
      "beforeAfter": {
        "enabled": true,
        "label": "Cover-ups"
      },
      "staffProfiles": {
        "enabled": true,
        "label": "Artistas",
        "showStyles": true
      },
      "pricingDisplay": {
        "enabled": false,
        "showBySize": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": true,
        "prominent": true
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      },
      "consultationForm": {
        "enabled": true,
        "fields": [
          "name",
          "phone",
          "email",
          "tattooType",
          "bodyLocation",
          "approximateSize",
          "referenceImage",
          "description",
          "isFirstTattoo",
          "howFoundUs"
        ]
      }
    },
    "serviceCategories": [
      "tatuajes_custom",
      "tatuajes_tradicional",
      "tatuajes_realismo",
      "tatuajes_blackwork",
      "piercing"
    ],
    "targetAudience": {
      "primary": "Adults 18-45, seeking custom tattoo or piercing",
      "secondary": "First-timers, Cover-up customers, Collectors"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Tatuajes en {{city}} | Estudio de Tatuaje",
      "descriptionTemplate": "Tatuajes personalizados en {{city}}. Artistas profesionales, higiene impecable. Agenda tu consulta.",
      "schemaType": "LocalBusiness",
      "keywords": [
        "tatuajes {{city}}",
        "tattoo {{city}}",
        "piercing {{city}}",
        "estudio tatuaje {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Portafolio",
        "Artistas",
        "Info",
        "Contacto"
      ],
      "cta": {
        "text": "Consulta",
        "action": "consultationForm"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "{{businessName}} - Arte en Tu Piel",
      "subheadlineTemplate": "Tatuajes personalizados, higiene impecable",
      "ctaPrimary": {
        "text": "Agendar Consulta",
        "action": "consultationForm"
      },
      "ctaSecondary": {
        "text": "Ver Portafolio",
        "action": "scrollTo:portfolio"
      }
    }
  },
  'thermal_spa': {
    "id": "thermal_spa",
    "nameEs": "Termas",
    "nameEn": "Thermal Spa",
    "verticalId": "beauty-personal-care",
    "subVertical": "wellness-spa",
    "extends": "beauty_base",
    "tokens": "thermal_spa",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Termas en {{city}}",
      "descriptionTemplate": "Termas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "termas {{city}}",
        "thermal spa {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Termas",
      "subheadlineTemplate": "Termas profesional en {{city}}."
    }
  },
  'threading_salon': {
    "id": "threading_salon",
    "nameEs": "Depilacion con Hilo",
    "nameEn": "Threading Salon",
    "verticalId": "beauty-personal-care",
    "subVertical": "body-hair-removal",
    "extends": "beauty_base",
    "tokens": "threading_salon",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Depilacion con Hilo en {{city}}",
      "descriptionTemplate": "Depilacion con Hilo profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "depilacion con hilo {{city}}",
        "threading salon {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Depilacion con Hilo",
      "subheadlineTemplate": "Depilacion con Hilo profesional en {{city}}."
    }
  },
  'traditional_ink_studio': {
    "id": "traditional_ink_studio",
    "nameEs": "Tatuaje Tradicional",
    "nameEn": "Traditional Ink Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "tattoo-piercing",
    "extends": "beauty_base",
    "tokens": "traditional_ink_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Tatuaje Tradicional en {{city}}",
      "descriptionTemplate": "Tatuaje Tradicional profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "tatuaje tradicional {{city}}",
        "traditional ink studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tatuaje Tradicional",
      "subheadlineTemplate": "Tatuaje Tradicional profesional en {{city}}."
    }
  },
  'turkish_barbershop': {
    "id": "turkish_barbershop",
    "nameEs": "Barberia Turca",
    "nameEn": "Turkish Barbershop",
    "verticalId": "beauty-personal-care",
    "subVertical": "mens-grooming",
    "extends": "beauty_base",
    "tokens": "turkish_barbershop",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Barberia Turca en {{city}}",
      "descriptionTemplate": "Barberia Turca profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "barberia turca {{city}}",
        "turkish barbershop {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Barberia Turca",
      "subheadlineTemplate": "Barberia Turca profesional en {{city}}."
    }
  },
  'unas': {
    "id": "unas",
    "nameEs": "Unas",
    "nameEn": "Nail Salon",
    "verticalId": "beauty-personal-care",
    "tokens": "unas",
    "pages": {
      "homepage": {
        "sections": [
          "header",
          "hero",
          "services",
          "booking",
          "portfolio",
          "gallery",
          "team",
          "contact",
          "testimonials",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "hero",
          "services",
          "contact",
          "footer"
        ]
      },
      "services": {
        "sections": [
          "header",
          "services",
          "faq",
          "ctaBanner",
          "footer"
        ],
        "requiredSections": [
          "header",
          "services",
          "footer"
        ]
      },
      "gallery": {
        "sections": [
          "header",
          "portfolio",
          "gallery",
          "footer"
        ],
        "requiredSections": [
          "header",
          "portfolio",
          "footer"
        ]
      },
      "contact": {
        "sections": [
          "header",
          "contact",
          "footer"
        ],
        "requiredSections": [
          "header",
          "contact",
          "footer"
        ]
      }
    },
    "features": {
      "onlineBooking": {
        "enabled": true,
        "method": "fresha",
        "fallback": "whatsapp"
      },
      "serviceMenu": {
        "enabled": true,
        "showPrices": true,
        "showDuration": true,
        "tabbed": true
      },
      "portfolio": {
        "enabled": true,
        "minImages": 30,
        "categories": [
          "natural",
          "gel",
          "acrilico",
          "nail_art",
          "bridal"
        ]
      },
      "beforeAfter": {
        "enabled": true
      },
      "staffProfiles": {
        "enabled": true,
        "label": "Nail Artists"
      },
      "pricingDisplay": {
        "enabled": true,
        "showExactPrice": true
      },
      "walkInPolicy": {
        "enabled": false
      },
      "classSchedule": {
        "enabled": false
      },
      "packageBuilder": {
        "enabled": false
      },
      "aftercareInfo": {
        "enabled": false
      },
      "whatsappFloat": {
        "enabled": true
      },
      "googleMapsEmbed": {
        "enabled": true
      }
    },
    "serviceCategories": [
      "manicure",
      "pedicure",
      "nail_art",
      "addons"
    ],
    "targetAudience": {
      "primary": "Women 20-45, beauty-conscious, nail art enthusiasts",
      "secondary": "Brides, Special events"
    },
    "seo": {
      "titleTemplate": "{{businessName}} - Unas en {{city}} | Manicure, Pedicure y Nail Art",
      "descriptionTemplate": "Unas perfectas en {{city}}. Diseno profesional, productos de calidad. Reserva tu cita.",
      "schemaType": "BeautySalon",
      "keywords": [
        "unas {{city}}",
        "manicure {{city}}",
        "nail art {{city}}",
        "pedicure {{city}}"
      ]
    },
    "nav": {
      "items": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "cta": {
        "text": "Reservar",
        "action": "booking"
      }
    },
    "hero": {
      "style": "image",
      "headlineTemplate": "Unas Perfectas en {{city}}",
      "subheadlineTemplate": "Diseno profesional, productos de calidad, higiene garantizada",
      "ctaPrimary": {
        "text": "Reservar Cita",
        "action": "booking"
      },
      "ctaSecondary": {
        "text": "Ver Galeria",
        "action": "scrollTo:gallery"
      }
    }
  },
  'waxing_studio': {
    "id": "waxing_studio",
    "nameEs": "Centro de Depilacion con Cera",
    "nameEn": "Waxing Studio",
    "verticalId": "beauty-personal-care",
    "subVertical": "body-hair-removal",
    "extends": "beauty_base",
    "tokens": "waxing_studio",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Centro de Depilacion con Cera en {{city}}",
      "descriptionTemplate": "Centro de Depilacion con Cera profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "centro de depilacion con cera {{city}}",
        "waxing studio {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Centro de Depilacion con Cera",
      "subheadlineTemplate": "Centro de Depilacion con Cera profesional en {{city}}."
    }
  },
  'wedding_beauty_squad': {
    "id": "wedding_beauty_squad",
    "nameEs": "Escuadron Novias",
    "nameEn": "Wedding Beauty Squad",
    "verticalId": "beauty-personal-care",
    "subVertical": "mobile-beauty",
    "extends": "beauty_base",
    "tokens": "wedding_beauty_squad",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Escuadron Novias en {{city}}",
      "descriptionTemplate": "Escuadron Novias profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "escuadron novias {{city}}",
        "wedding beauty squad {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Escuadron Novias",
      "subheadlineTemplate": "Escuadron Novias profesional en {{city}}."
    }
  },
  'wig_hair_piece_shop': {
    "id": "wig_hair_piece_shop",
    "nameEs": "Tienda de Pelucas",
    "nameEn": "Wig Shop",
    "verticalId": "beauty-personal-care",
    "subVertical": "beauty-retail",
    "extends": "beauty_base",
    "tokens": "wig_hair_piece_shop",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Tienda de Pelucas en {{city}}",
      "descriptionTemplate": "Tienda de Pelucas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "tienda de pelucas {{city}}",
        "wig shop {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Tienda de Pelucas",
      "subheadlineTemplate": "Tienda de Pelucas profesional en {{city}}."
    }
  },
  'wig_salon': {
    "id": "wig_salon",
    "nameEs": "Pelucas",
    "nameEn": "Wig Salon",
    "verticalId": "beauty-personal-care",
    "subVertical": "hair",
    "extends": "beauty_base",
    "tokens": "wig_salon",
    "seo": {
      "schemaType": "BeautySalon",
      "titleTemplate": "{{businessName}} - Pelucas en {{city}}",
      "descriptionTemplate": "Pelucas profesional en {{city}}. Servicios de calidad con atencion personalizada.",
      "keywords": [
        "pelucas {{city}}",
        "wig salon {{city}}"
      ]
    },
    "hero": {
      "headlineTemplate": "{{businessName}} - Pelucas",
      "subheadlineTemplate": "Pelucas profesional en {{city}}."
    }
  },
}

export const CONTENT: Record<string, unknown> = {
  'barberia': {
    "id": "barberia",
    "locale": "es-PY",
    "hero": {
      "headline": "{{businessName}} - El Arte del Corte",
      "subheadline": "Tradicion y maestria en cada detalle",
      "ctaPrimary": "Reservar Cita",
      "ctaSecondary": "Walk-In"
    },
    "servicesPage": {
      "title": "Servicios",
      "categories": [
        {
          "key": "cortes",
          "title": "Cortes",
          "defaultServices": [
            {
              "name": "Corte Clasico",
              "price": null,
              "duration": 30,
              "description": "Tijera y peine, estilo terminado"
            },
            {
              "name": "Corte Fade",
              "price": null,
              "duration": 35,
              "description": "Skin fade, lineas de diseno"
            },
            {
              "name": "Barberia Completa",
              "price": null,
              "duration": 45,
              "description": "Corte + barba + toalla caliente"
            }
          ]
        },
        {
          "key": "barba",
          "title": "Barba y Afeitado",
          "defaultServices": [
            {
              "name": "Arreglo de Barba",
              "price": null,
              "duration": 20,
              "description": "Shape + line-up"
            },
            {
              "name": "Hot Towel Shave",
              "price": null,
              "duration": 30,
              "description": "Navaja tradicional con toalla caliente"
            },
            {
              "name": "Corte + Barba",
              "price": null,
              "duration": 50,
              "description": "Paquete completo"
            }
          ]
        }
      ]
    },
    "policy": {
      "title": "Politica del Local",
      "items": [
        "Aceptamos walk-ins segun disponibilidad",
        "Reservaciones recomendadas para fines de semana",
        "Cancelaciones: 24h de anticipacion",
        "Llegar 5 min antes de tu hora"
      ]
    },
    "galleryPage": {
      "title": "Nuestros Trabajos",
      "categories": [
        "Fades",
        "Clasico",
        "Barbas"
      ],
      "note": "Fotos reales de nuestros clientes"
    },
    "teamPage": {
      "title": "Nuestros Barberos",
      "memberTemplate": {
        "buttonText": "Reservar con {{name}}"
      }
    },
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera reservar un turno en {{businessName}}",
      "serviceMessage": "Hola! Quisiera reservar {{serviceName}} en {{businessName}}"
    }
  },
  'depilacion': {
    "id": "depilacion",
    "locale": "es-PY",
    "hero": {
      "headline": "{{businessName}} - Depilacion Laser Definitiva",
      "subheadline": "Tecnologia de ultima generacion, resultados permanentes",
      "ctaPrimary": "Consulta Sin Cargo",
      "ctaSecondary": "Ver Tratamientos"
    },
    "treatmentsPage": {
      "title": "Tratamientos y Precios",
      "areas": [
        {
          "name": "Bozo",
          "pricePerSession": null
        },
        {
          "name": "Axilas",
          "pricePerSession": null
        },
        {
          "name": "Ingles",
          "pricePerSession": null
        },
        {
          "name": "Ingles Completas",
          "pricePerSession": null
        },
        {
          "name": "Piernas Completas",
          "pricePerSession": null
        },
        {
          "name": "Cuerpo Completo",
          "pricePerSession": null
        }
      ],
      "packages": [
        {
          "sessions": 6,
          "discount": 20,
          "label": "6 sesiones - 20% descuento"
        },
        {
          "sessions": 8,
          "discount": 30,
          "label": "8 sesiones - 30% descuento"
        },
        {
          "sessions": 10,
          "discount": 40,
          "label": "10 sesiones - 40% descuento"
        }
      ],
      "waxingSection": {
        "title": "Depilacion con Cera",
        "note": "Cera tibia profesional. Depilacion masculina disponible."
      }
    },
    "technologyPage": {
      "title": "Nuestra Tecnologia",
      "highlights": [
        {
          "icon": "shield",
          "label": "FDA Approved",
          "description": "Equipo certificado internacionalmente"
        },
        {
          "icon": "dna",
          "label": "Alexandrite + Nd:YAG",
          "description": "Doble longitud de onda"
        },
        {
          "icon": "zap",
          "label": "Rapido y casi indoloro",
          "description": "Sesiones cortas y comodas"
        },
        {
          "icon": "leaf",
          "label": "Para todo tipo de piel",
          "description": "Tecnologia adaptativa"
        }
      ],
      "howItWorks": {
        "title": "Como funciona?",
        "facts": [
          "Sesiones: 6-8 para resultados optimos",
          "Intervalo: 4-6 semanas entre sesiones",
          "Compatible: todo tipo de piel",
          "Resultados: hasta 90% reduccion permanente"
        ]
      }
    },
    "faq": [
      {
        "q": "Cuantas sesiones necesito?",
        "a": "En promedio 6-8 sesiones para resultados optimos, dependiendo de la zona y tipo de piel."
      },
      {
        "q": "Es doloroso?",
        "a": "Con nuestra tecnologia, la sensacion es minima. La mayoria de los pacientes lo describen como un pequeno pellizco."
      },
      {
        "q": "Funciona en piel oscura?",
        "a": "Si, nuestra tecnologia Nd:YAG es segura y efectiva para todos los tipos de piel."
      }
    ],
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Tratamientos",
        "Tecnologia",
        "Resultados",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera agendar una consulta gratis de depilacion laser en {{businessName}}"
    }
  },
  'estetica': {
    "id": "estetica",
    "locale": "es-PY",
    "hero": {
      "headline": "{{businessName}} - Belleza y Ciencia",
      "subheadline": "Tratamientos avanzados con tecnologia de punta y resultados reales",
      "ctaPrimary": "Reservar Consulta",
      "ctaSecondary": "Ver Resultados"
    },
    "treatmentsPage": {
      "title": "Tratamientos",
      "pricingNote": "Precios varian segun evaluacion. Primera consulta sin cargo.",
      "categories": [
        {
          "key": "faciales",
          "title": "Tratamientos Faciales",
          "defaultServices": [
            {
              "name": "Hydrafacial",
              "priceFrom": null,
              "description": "Limpieza, hidratacion, luminosidad"
            },
            {
              "name": "Microagujas",
              "priceFrom": null,
              "description": "Estimula colageno, reduce cicatrices"
            },
            {
              "name": "Luz Pulsada",
              "priceFrom": null,
              "description": "Rejuvenecimiento, manchas"
            },
            {
              "name": "Botox",
              "priceFrom": null,
              "description": "Relaja lineas de expresion"
            }
          ]
        },
        {
          "key": "corporales",
          "title": "Tratamientos Corporales",
          "defaultServices": [
            {
              "name": "Criolipolis",
              "priceFrom": null,
              "description": "Eliminacion de grasa localizada"
            },
            {
              "name": "Radiofrecuencia",
              "priceFrom": null,
              "description": "Tensado de piel"
            },
            {
              "name": "Drenaje Linfatico",
              "priceFrom": null,
              "description": "Retencion de liquidos"
            }
          ]
        }
      ]
    },
    "resultsPage": {
      "title": "Resultados Reales",
      "subtitle": "Antes y Despues",
      "consentNote": "Fotos con consentimiento del paciente"
    },
    "teamPage": {
      "title": "Nuestro Equipo Medico",
      "credentialLabels": {
        "education": "Formacion",
        "certifications": "Certificaciones",
        "experience": "Experiencia",
        "treatmentCount": "Tratamientos realizados"
      },
      "memberTemplate": {
        "buttonText": "Reservar con {{name}}"
      }
    },
    "faq": [
      {
        "q": "La consulta tiene costo?",
        "a": "No, la primera consulta es sin cargo. Evaluamos tu caso y te recomendamos el mejor tratamiento."
      },
      {
        "q": "Los tratamientos son dolorosos?",
        "a": "La mayoria de los tratamientos son minima o nulamente dolorosos. Usamos tecnicas y productos para maximizar tu comodidad."
      }
    ],
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Tratamientos",
        "Resultados",
        "Equipo",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera agendar una consulta en {{businessName}}",
      "serviceMessage": "Hola! Quisiera consultar sobre {{serviceName}} en {{businessName}}"
    }
  },
  'maquillaje': {
    "id": "maquillaje",
    "locale": "es-PY",
    "hero": {
      "headline": "Resalta Tu Belleza Natural",
      "subheadline": "Maquillaje profesional para tu momento especial",
      "ctaPrimary": "Reservar Fecha",
      "ctaSecondary": "Ver Portafolio"
    },
    "servicesPage": {
      "title": "Servicios y Precios",
      "categories": [
        {
          "key": "novia",
          "title": "Maquillaje Novia",
          "defaultServices": [
            {
              "name": "Maquillaje de Novia",
              "price": null,
              "description": "Dia de tu boda, prueba incluida, kit de retoques"
            },
            {
              "name": "Paquete Novia + Mama",
              "price": null,
              "description": "Novia y madres"
            },
            {
              "name": "Bridal Party (por persona)",
              "price": null,
              "description": "Hasta 5 personas, looks coordinados"
            }
          ]
        },
        {
          "key": "eventos",
          "title": "Eventos Especiales",
          "defaultServices": [
            {
              "name": "Maquillaje Evento",
              "price": null,
              "description": "Fiesta, graduacion, photoshoot"
            },
            {
              "name": "Maquillaje de Fiesta",
              "price": null,
              "description": "Glam look, 2 horas"
            }
          ]
        },
        {
          "key": "editorial",
          "title": "Editorial/Comercial",
          "note": "Precios variables segun proyecto. Consultar."
        },
        {
          "key": "lecciones",
          "title": "Clases de Maquillaje",
          "defaultServices": [
            {
              "name": "Leccion Personal",
              "price": null,
              "description": "1 hora personalizada"
            },
            {
              "name": "Maquillaje Basico",
              "price": null,
              "description": "Tecnicas esenciales"
            }
          ]
        }
      ]
    },
    "portfolioPage": {
      "title": "Portafolio",
      "categories": [
        "Novia",
        "Eventos",
        "Editorial",
        "Lecciones"
      ]
    },
    "aboutPage": {
      "title": "Sobre Mi",
      "template": "{{yearsExperience}} anos de experiencia transformando miradas. Especialista en {{specialties}}."
    },
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Portafolio",
        "Servicios",
        "Sobre Mi",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera reservar maquillaje en {{businessName}}",
      "bridalMessage": "Hola! Quisiera consultar sobre maquillaje de novia con {{businessName}}"
    }
  },
  'peluqueria': {
    "id": "peluqueria",
    "locale": "es-PY",
    "hero": {
      "headline": "{{businessName}} - Tu Mejor Look en {{city}}",
      "subheadline": "Cortes profesionales, coloracion y tratamientos que transforman tu estilo",
      "ctaPrimary": "Reservar Cita",
      "ctaSecondary": "Ver Servicios"
    },
    "servicesPage": {
      "title": "Servicios y Precios",
      "categories": [
        {
          "key": "cortes",
          "title": "Cortes de Cabello",
          "description": "Cortes personalizados para cada tipo de rostro y estilo de vida",
          "defaultServices": [
            {
              "name": "Corte Dama",
              "price": null,
              "duration": 45,
              "description": "Corte y style profesional"
            },
            {
              "name": "Corte Caballero",
              "price": null,
              "duration": 30,
              "description": "Corte moderno y clasico"
            },
            {
              "name": "Corte Nino",
              "price": null,
              "duration": 25,
              "description": "Para los mas pequenos"
            },
            {
              "name": "Recorte de Bangs",
              "price": null,
              "duration": 15,
              "description": "Retoque de fleco"
            }
          ]
        },
        {
          "key": "coloracion",
          "title": "Coloracion y Cambios",
          "description": "Tecnicas avanzadas para un color perfecto y natural",
          "defaultServices": [
            {
              "name": "Coloracion Completa",
              "priceFrom": null,
              "duration": 90,
              "description": "Color base completo"
            },
            {
              "name": "Mechas/Highlighting",
              "priceFrom": null,
              "duration": 120,
              "description": "Para brillo natural"
            },
            {
              "name": "Balayage",
              "priceFrom": null,
              "duration": 150,
              "description": "Tecnica francesa de mano alzada"
            },
            {
              "name": "Ombre",
              "priceFrom": null,
              "duration": 120,
              "description": "Degradado natural"
            },
            {
              "name": "Retoque de Raices",
              "price": null,
              "duration": 60,
              "description": "Mantenimiento mensual"
            }
          ]
        },
        {
          "key": "tratamientos",
          "title": "Tratamientos Especiales",
          "description": "Cuidados intensivos para cabello danado y salud del cuero cabelludo",
          "defaultServices": [
            {
              "name": "Keratina Intensiva",
              "price": null,
              "duration": 120,
              "description": "Alisa y repara"
            },
            {
              "name": "Tratamiento Capilar",
              "price": null,
              "duration": 45,
              "description": "Hidratacion profunda"
            },
            {
              "name": "Masaje Scalp",
              "price": null,
              "duration": 30,
              "description": "Relajacion y salud capilar"
            }
          ]
        }
      ]
    },
    "teamPage": {
      "title": "Nuestro Equipo",
      "memberTemplate": {
        "buttonText": "Reservar con {{name}}"
      }
    },
    "galleryPage": {
      "title": "Galeria",
      "subtitle": "Descubre nuestro trabajo",
      "categories": [
        "Cortes",
        "Color",
        "Mechas",
        "Peinados"
      ],
      "ctaText": "Ver Galeria Completa"
    },
    "contactPage": {
      "title": "Contacto",
      "locationTitle": "Visitanos en {{neighborhood}}",
      "formFields": [
        "name",
        "phone",
        "service",
        "preferredDate",
        "message"
      ],
      "formSubmitText": "Enviar Consulta"
    },
    "faq": [
      {
        "q": "Cuanto tiempo dura un color?",
        "a": "Depende del tipo de color y cuidado. En promedio 4-6 semanas."
      },
      {
        "q": "Cuanto tiempo dura la keratina?",
        "a": "Con cuidado adecuado, puede durar 3-4 meses."
      }
    ],
    "ctaBanner": {
      "title": "Lista para tu nuevo look?",
      "buttonText": "Reservar Ahora"
    },
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera agendar una cita en {{businessName}}",
      "serviceMessage": "Hola! Quisiera reservar {{serviceName}} en {{businessName}}"
    },
    "seo": {
      "altTextTemplates": {
        "service": "{{serviceName}} en {{businessName}}, {{city}}",
        "portfolio": "Resultado de {{serviceName}} por {{businessName}}",
        "team": "{{memberName}} - {{memberTitle}} en {{businessName}}"
      }
    }
  },
  'pestanas': {
    "id": "pestanas",
    "locale": "es-PY",
    "hero": {
      "headline": "{{businessName}} - Tu Mirada Perfecta en {{city}}",
      "subheadline": "Extensiones de pestañas, microblading y diseño de cejas que realzan tu belleza natural",
      "ctaPrimary": "Reservar Cita",
      "ctaSecondary": "Ver Servicios"
    },
    "servicesPage": {
      "title": "Servicios y Precios",
      "categories": [
        {
          "key": "pestanas",
          "title": "Pestañas",
          "description": "Extensiones y tratamientos para una mirada irresistible",
          "defaultServices": [
            {
              "name": "Extensiones Clasicas",
              "price": null,
              "duration": 120,
              "description": "Pestañas pelo a pelo para un look natural y elegante"
            },
            {
              "name": "Extensiones Volumen",
              "price": null,
              "duration": 150,
              "description": "Mayor densidad con abanicos de 2-5 pestañas por pelo natural"
            },
            {
              "name": "Extensiones Mega Volumen",
              "price": null,
              "duration": 180,
              "description": "Maxima densidad y dramatismo para una mirada impactante"
            },
            {
              "name": "Lifting de Pestañas",
              "price": null,
              "duration": 60,
              "description": "Curvatura natural sin extensiones, incluye tinte"
            },
            {
              "name": "Tinte de Pestañas",
              "price": null,
              "duration": 30,
              "description": "Color intenso para pestañas mas definidas"
            }
          ]
        },
        {
          "key": "cejas",
          "title": "Cejas",
          "description": "Diseño y cuidado profesional para enmarcar tu mirada",
          "defaultServices": [
            {
              "name": "Diseño de Cejas",
              "price": null,
              "duration": 30,
              "description": "Diseño personalizado segun la forma de tu rostro"
            },
            {
              "name": "Depilacion con Hilo",
              "price": null,
              "duration": 20,
              "description": "Tecnica precisa y delicada para una forma perfecta"
            },
            {
              "name": "Microblading",
              "priceFrom": null,
              "duration": 120,
              "description": "Micropigmentacion pelo a pelo para cejas naturales y definidas"
            },
            {
              "name": "Laminado de Cejas",
              "price": null,
              "duration": 45,
              "description": "Cejas peinadas y fijadas con efecto laminado"
            },
            {
              "name": "Tinte de Cejas",
              "price": null,
              "duration": 20,
              "description": "Color y definicion para cejas mas expresivas"
            }
          ]
        }
      ]
    },
    "galleryPage": {
      "title": "Nuestro Trabajo",
      "subtitle": "Transformaciones que hablan por si solas",
      "categories": [
        "Pestañas",
        "Cejas",
        "Microblading"
      ],
      "ctaText": "Ver Galeria Completa"
    },
    "contactPage": {
      "title": "Contacto",
      "locationTitle": "Visitanos en {{neighborhood}}",
      "formFields": [
        "name",
        "phone",
        "service",
        "preferredDate",
        "message"
      ],
      "formSubmitText": "Enviar Consulta"
    },
    "faq": [
      {
        "q": "Cuanto duran las extensiones de pestañas?",
        "a": "Las extensiones duran entre 3 y 4 semanas. Recomendamos retoques cada 2-3 semanas para mantenerlas perfectas."
      },
      {
        "q": "Que cuidados debo tener despues de colocarme extensiones?",
        "a": "Evita mojarlas las primeras 24 horas, no uses productos oleosos cerca de los ojos y peinadas con el cepillito todos los dias."
      },
      {
        "q": "Cuanto tiempo tarda en sanar el microblading?",
        "a": "El proceso de cicatrizacion completo toma entre 4 y 6 semanas. Los primeros dias el color se vera mas intenso y luego se suavizara."
      },
      {
        "q": "Las extensiones dañan mis pestañas naturales?",
        "a": "No, cuando son aplicadas correctamente por una profesional, las extensiones no dañan las pestañas naturales."
      },
      {
        "q": "Cada cuanto debo hacer retoque de microblading?",
        "a": "Se recomienda un retoque entre 4 y 6 semanas despues de la primera sesion, y luego un mantenimiento anual."
      }
    ],
    "ctaBanner": {
      "title": "Lista para realzar tu mirada?",
      "buttonText": "Reservar Ahora"
    },
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera agendar una cita en {{businessName}}",
      "serviceMessage": "Hola! Quisiera reservar {{serviceName}} en {{businessName}}"
    },
    "seo": {
      "altTextTemplates": {
        "service": "{{serviceName}} en {{businessName}}, {{city}}",
        "portfolio": "Resultado de {{serviceName}} por {{businessName}}",
        "team": "{{memberName}} - {{memberTitle}} en {{businessName}}"
      }
    }
  },
  'salon_belleza': {
    "id": "salon_belleza",
    "locale": "es-PY",
    "hero": {
      "headline": "{{businessName}} - Tu Centro de Belleza en {{city}}",
      "subheadline": "Cabello, uñas, maquillaje y tratamientos — todo en un solo lugar",
      "ctaPrimary": "Reservar Cita",
      "ctaSecondary": "Ver Servicios"
    },
    "servicesPage": {
      "title": "Servicios y Precios",
      "categories": [
        {
          "key": "cabello",
          "title": "Cabello",
          "description": "Cortes, coloracion y tratamientos capilares para todo tipo de cabello",
          "defaultServices": [
            {
              "name": "Corte Dama",
              "price": null,
              "duration": 45,
              "description": "Corte y styling profesional"
            },
            {
              "name": "Coloracion Completa",
              "priceFrom": null,
              "duration": 90,
              "description": "Color base completo y personalizado"
            },
            {
              "name": "Mechas / Highlights",
              "priceFrom": null,
              "duration": 120,
              "description": "Iluminaciones y reflejos naturales"
            },
            {
              "name": "Keratina",
              "price": null,
              "duration": 120,
              "description": "Alisado y reparacion intensiva"
            }
          ]
        },
        {
          "key": "unas",
          "title": "Uñas",
          "description": "Manicura, pedicura y diseños personalizados",
          "defaultServices": [
            {
              "name": "Manicura Clasica",
              "price": null,
              "duration": 30,
              "description": "Limado, cutículas y esmaltado"
            },
            {
              "name": "Pedicura Completa",
              "price": null,
              "duration": 45,
              "description": "Cuidado completo de pies y esmaltado"
            },
            {
              "name": "Uñas en Gel",
              "price": null,
              "duration": 60,
              "description": "Aplicacion de gel con diseño a eleccion"
            },
            {
              "name": "Nail Art",
              "priceFrom": null,
              "duration": 75,
              "description": "Diseños personalizados y creativos"
            }
          ]
        },
        {
          "key": "maquillaje",
          "title": "Maquillaje",
          "description": "Maquillaje profesional para toda ocasion",
          "defaultServices": [
            {
              "name": "Maquillaje Social",
              "price": null,
              "duration": 45,
              "description": "Para eventos y reuniones especiales"
            },
            {
              "name": "Maquillaje de Novia",
              "price": null,
              "duration": 90,
              "description": "Look completo con prueba previa"
            },
            {
              "name": "Maquillaje Quinceañera",
              "price": null,
              "duration": 60,
              "description": "Diseño especial para tu gran dia"
            }
          ]
        },
        {
          "key": "tratamientos_faciales",
          "title": "Tratamientos Faciales",
          "description": "Cuidados profesionales para una piel radiante",
          "defaultServices": [
            {
              "name": "Limpieza Facial Profunda",
              "price": null,
              "duration": 60,
              "description": "Limpieza, extraccion y mascarilla"
            },
            {
              "name": "Tratamiento Anti-Age",
              "price": null,
              "duration": 75,
              "description": "Rejuvenecimiento y firmeza para la piel"
            },
            {
              "name": "Hidratacion Facial",
              "price": null,
              "duration": 45,
              "description": "Nutricion intensiva y luminosidad"
            }
          ]
        },
        {
          "key": "paquetes",
          "title": "Paquetes",
          "description": "Combina servicios y ahorra con nuestros paquetes especiales",
          "defaultServices": [
            {
              "name": "Spa Day",
              "priceFrom": null,
              "duration": 180,
              "description": "Facial + manicura + pedicura + masaje"
            },
            {
              "name": "Novia Completa",
              "priceFrom": null,
              "duration": 240,
              "description": "Maquillaje + peinado + manicura + prueba previa"
            },
            {
              "name": "Dia de Chicas",
              "priceFrom": null,
              "duration": 150,
              "description": "Paquete grupal: mani + pedi + facial para 3+ personas"
            }
          ]
        }
      ]
    },
    "teamPage": {
      "title": "Nuestro Equipo",
      "memberTemplate": {
        "buttonText": "Reservar con {{name}}"
      }
    },
    "galleryPage": {
      "title": "Galeria",
      "subtitle": "Conoce nuestro trabajo",
      "categories": [
        "Cabello",
        "Uñas",
        "Maquillaje",
        "Tratamientos"
      ],
      "ctaText": "Ver Galeria Completa"
    },
    "contactPage": {
      "title": "Contacto",
      "locationTitle": "Visitanos en {{neighborhood}}",
      "formFields": [
        "name",
        "phone",
        "service",
        "preferredDate",
        "message"
      ],
      "formSubmitText": "Enviar Consulta"
    },
    "faq": [
      {
        "q": "Puedo combinar varios servicios en una sola visita?",
        "a": "Si, ofrecemos paquetes combinados y podes agendar multiples servicios el mismo dia para mayor comodidad."
      },
      {
        "q": "Tienen paquetes para novias?",
        "a": "Si, nuestro paquete Novia Completa incluye maquillaje, peinado, manicura y una prueba previa para asegurar tu look perfecto."
      },
      {
        "q": "Ofrecen descuentos para grupos?",
        "a": "Si, tenemos el paquete Dia de Chicas y opciones especiales para despedidas, cumpleaños y eventos grupales."
      },
      {
        "q": "Cuanto tiempo dura un tratamiento facial?",
        "a": "Depende del tipo de tratamiento. Una limpieza facial profunda dura aproximadamente 60 minutos."
      },
      {
        "q": "Necesito reservar con anticipacion?",
        "a": "Recomendamos reservar con al menos 24 horas de anticipacion, especialmente para servicios de novia y paquetes."
      }
    ],
    "ctaBanner": {
      "title": "Lista para consentirte?",
      "buttonText": "Reservar Ahora"
    },
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera agendar una cita en {{businessName}}",
      "serviceMessage": "Hola! Quisiera reservar {{serviceName}} en {{businessName}}"
    },
    "seo": {
      "altTextTemplates": {
        "service": "{{serviceName}} en {{businessName}}, {{city}}",
        "portfolio": "Resultado de {{serviceName}} por {{businessName}}",
        "team": "{{memberName}} - {{memberTitle}} en {{businessName}}"
      }
    }
  },
  'spa': {
    "id": "spa",
    "locale": "es-PY",
    "hero": {
      "headline": "Tu Santuario de Bienestar",
      "subheadline": "Relajate, renueva y reconnectate en {{businessName}}",
      "ctaPrimary": "Reservar Experiencia",
      "ctaSecondary": "Ver Tratamientos"
    },
    "servicesPage": {
      "title": "Tratamientos y Servicios",
      "categories": [
        {
          "key": "masajes",
          "title": "Masajes",
          "defaultServices": [
            {
              "name": "Masaje Relajante",
              "price": "180.000 Gs",
              "duration": 60,
              "description": "Masaje suave para relajacion profunda"
            },
            {
              "name": "Masaje Terapeutico",
              "price": "220.000 Gs",
              "duration": 60,
              "description": "Alivio muscular y tension"
            },
            {
              "name": "Masaje Hot Stone",
              "price": "250.000 Gs",
              "duration": 75,
              "description": "Piedras calientes para maxima relajacion"
            },
            {
              "name": "Masaje de Parejas",
              "price": "350.000 Gs",
              "duration": 60,
              "description": "Experiencia compartida en cabina privada"
            }
          ]
        },
        {
          "key": "faciales",
          "title": "Faciales",
          "defaultServices": [
            {
              "name": "Limpieza Facial",
              "price": "150.000 Gs",
              "duration": 45,
              "description": "Limpieza profunda e hidratacion"
            },
            {
              "name": "Hydrafacial",
              "price": "280.000 Gs",
              "duration": 60,
              "description": "Tecnologia avanzada de limpieza"
            },
            {
              "name": "Anti-Aging",
              "price": "220.000 Gs",
              "duration": 60,
              "description": "Tratamiento rejuvenecedor"
            }
          ]
        },
        {
          "key": "corporales",
          "title": "Corporales",
          "defaultServices": [
            {
              "name": "Exfoliacion Corporal",
              "price": "120.000 Gs",
              "duration": 45,
              "description": "Renueva y suaviza la piel"
            },
            {
              "name": "Envoltura Corporal",
              "price": "180.000 Gs",
              "duration": 60,
              "description": "Desintoxicacion con arcilla"
            },
            {
              "name": "Aromaterapia",
              "price": "200.000 Gs",
              "duration": 75,
              "description": "Relajacion con aceites esenciales"
            }
          ]
        }
      ]
    },
    "membershipPlans": {
      "plans": [
        {
          "name": "Tratamiento Mensual",
          "price": "350.000",
          "period": "mes",
          "description": "1 tratamiento mensual a elegir",
          "features": [
            "1 facial o corporal/mes",
            "15% descuento extras",
            "Vale de regalo"
          ],
          "popular": false
        },
        {
          "name": "Relax Total",
          "price": "550.000",
          "period": "mes",
          "description": "2 tratamientos mensuales",
          "features": [
            "2 tratamientos/mes",
            "20% descuento extras",
            "Sauna ilimitado",
            "Vale de regalo"
          ],
          "popular": true
        },
        {
          "name": "Spa Premium",
          "price": "900.000",
          "period": "mes",
          "description": "Todo incluido",
          "features": [
            "Tratamientos ilimitados",
            "Sauna e hidromasaje",
            "Productos exclusivos",
            "4 vales/ano"
          ],
          "popular": false
        }
      ]
    },
    "galleryPage": {
      "title": "Galeria",
      "subtitle": "Nuestro espacio de relax y bienestar"
    },
    "teamPage": {
      "title": "Nuestro Equipo"
    },
    "contactPage": {
      "title": "Contacto"
    },
    "treatmentsPage": {
      "title": "Menu de Tratamientos",
      "categories": [
        {
          "key": "masajes",
          "title": "Masajes Terapeuticos",
          "defaultServices": [
            {
              "name": "Masaje Sueco",
              "duration": "60/90 min",
              "price": null,
              "description": "Tecnica suave para relajacion profunda"
            },
            {
              "name": "Masaje Deep Tissue",
              "duration": "60/90 min",
              "price": null,
              "description": "Alivio muscular profundo"
            },
            {
              "name": "Masaje Hot Stone",
              "duration": "75 min",
              "price": null,
              "description": "Piedras calientes para tension"
            },
            {
              "name": "Masaje de Parejas",
              "duration": "60 min",
              "price": null,
              "description": "Experiencia compartida"
            }
          ]
        },
        {
          "key": "faciales",
          "title": "Tratamientos Faciales",
          "defaultServices": [
            {
              "name": "Limpieza Facial",
              "duration": "45 min",
              "price": null,
              "description": "Profunda limpieza e hidratacion"
            },
            {
              "name": "Hydrafacial",
              "duration": "60 min",
              "price": null,
              "description": "Tecnologia avanzada"
            },
            {
              "name": "Anti-aging",
              "duration": "60 min",
              "price": null,
              "description": "Reduce lineas de expresion"
            }
          ]
        },
        {
          "key": "corporales",
          "title": "Tratamientos Corporales",
          "defaultServices": [
            {
              "name": "Exfoliacion Corporal",
              "duration": "45 min",
              "price": null,
              "description": "Renueva y suaviza la piel"
            },
            {
              "name": "Envoltura de Arcilla",
              "duration": "60 min",
              "price": null,
              "description": "Desintoxicacion natural"
            },
            {
              "name": "Aromaterapia",
              "duration": "75 min",
              "price": null,
              "description": "Relajacion con aceites esenciales"
            }
          ]
        }
      ]
    },
    "packagesPage": {
      "title": "Paquetes Especiales",
      "defaultPackages": [
        {
          "name": "Dia de Spa Completo",
          "includes": [
            "Masaje Relajante 60 min",
            "Facial Hidratante 45 min",
            "Sauna 30 min",
            "Hidromasaje"
          ],
          "price": null,
          "savings": null
        },
        {
          "name": "Experiencia Parejas",
          "includes": [
            "2 Masajes Relajantes",
            "Hidromasaje privado",
            "Te y frutas"
          ],
          "price": null,
          "savings": null
        },
        {
          "name": "Regalo Perfecto",
          "includes": [
            "Vale personalizado",
            "Presentacion de regalo"
          ],
          "price": null,
          "savings": null
        }
      ],
      "giftVoucher": {
        "title": "Vale de Regalo",
        "description": "El regalo perfecto para alguien especial"
      }
    },
    "aboutPage": {
      "title": "Nuestro Espacio",
      "storyPlaceholder": "Descubre un refugio donde el tiempo se detiene. En {{businessName}} creamos experiencias de bienestar que renuevan cuerpo y alma."
    },
    "faq": [
      {
        "q": "Necesito reservar con anticipacion?",
        "a": "Recomendamos reservar con al menos 24 horas de anticipacion, especialmente para fines de semana."
      },
      {
        "q": "Que debo traer?",
        "a": "Solo traete a ti. Nosotros proporcionamos todo lo necesario: bata, sandalias, toallas."
      }
    ],
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Tratamientos",
        "Paquetes",
        "Equipo",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera reservar una experiencia en {{businessName}}",
      "serviceMessage": "Hola! Quisiera reservar {{serviceName}} en {{businessName}}"
    }
  },
  'tatuajes': {
    "id": "tatuajes",
    "locale": "es-PY",
    "hero": {
      "headline": "{{businessName}} - Arte en Tu Piel",
      "subheadline": "Tatuajes personalizados, higiene impecable",
      "ctaPrimary": "Agendar Consulta",
      "ctaSecondary": "Ver Portafolio"
    },
    "portfolioPage": {
      "title": "Portafolio",
      "styleCategories": [
        "Tradicional",
        "Realismo",
        "Blackwork",
        "Japones",
        "Minimal"
      ],
      "filterLabels": {
        "style": "Estilo",
        "artist": "Artista",
        "bodyPart": "Zona del cuerpo"
      }
    },
    "artistsPage": {
      "title": "Nuestros Artistas",
      "memberTemplate": {
        "buttonText": "Ver Trabajo de {{name}}",
        "availabilityLabel": "Disponibilidad"
      }
    },
    "piercingSection": {
      "title": "Piercings",
      "defaultServices": [
        {
          "name": "Lobulo",
          "price": null
        },
        {
          "name": "Cartilago",
          "price": null
        },
        {
          "name": "Nariz",
          "price": null
        },
        {
          "name": "Ombligo",
          "price": null
        },
        {
          "name": "Industrial",
          "price": null
        }
      ]
    },
    "consultationForm": {
      "title": "Agenda Tu Consulta",
      "fields": [
        {
          "name": "fullName",
          "label": "Nombre completo",
          "type": "text",
          "required": true
        },
        {
          "name": "phone",
          "label": "Telefono",
          "type": "tel",
          "required": true
        },
        {
          "name": "email",
          "label": "Email",
          "type": "email",
          "required": false
        },
        {
          "name": "tattooType",
          "label": "Que tipo de tatuaje buscas?",
          "type": "select",
          "options": [
            "Custom",
            "Tradicional",
            "Realismo",
            "Blackwork",
            "Japones",
            "Minimal",
            "Cover-up"
          ]
        },
        {
          "name": "bodyLocation",
          "label": "Donde quieres el tatuaje?",
          "type": "text"
        },
        {
          "name": "approximateSize",
          "label": "Tamano aproximado?",
          "type": "text"
        },
        {
          "name": "referenceImage",
          "label": "Tienes referencia de diseno?",
          "type": "file"
        },
        {
          "name": "description",
          "label": "Descripcion de tu idea",
          "type": "textarea"
        },
        {
          "name": "isFirstTattoo",
          "label": "Es tu primer tatuaje?",
          "type": "select",
          "options": [
            "Si",
            "No"
          ]
        }
      ],
      "submitText": "Enviar Consulta",
      "confirmationText": "Te contactaremos en 24-48 horas para confirmar tu cita"
    },
    "aftercare": {
      "title": "Cuidados Post-Tatuaje",
      "steps": [
        "Mantener el vendaje por 2-4 horas",
        "Lavar suavemente con jabon antibacterial",
        "Aplicar crema cicatrizante 3 veces al dia",
        "Evitar sol directo por 2 semanas",
        "No rascarse durante la cicatrizacion",
        "Evitar piscinas y playa por 2 semanas"
      ]
    },
    "faq": [
      {
        "q": "Cuanto duele?",
        "a": "El dolor varia segun la zona y tolerancia personal. Las zonas con mas hueso tienden a doler mas."
      },
      {
        "q": "Cuanto tarda en sanar?",
        "a": "La cicatrizacion completa toma 2-4 semanas. Seguir los cuidados post-tatuaje es esencial."
      },
      {
        "q": "Hay limite de edad?",
        "a": "Debes ser mayor de 18 anos. Menores con autorizacion de padres."
      }
    ],
    "firstTimerCta": {
      "text": "Primer tatuaje?",
      "linkText": "Lee nuestra guia",
      "action": "scrollTo:aftercare"
    },
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Portafolio",
        "Artistas",
        "Info",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera agendar una consulta para tatuaje en {{businessName}}"
    }
  },
  'unas': {
    "id": "unas",
    "locale": "es-PY",
    "hero": {
      "headline": "Unas Perfectas en {{city}}",
      "subheadline": "Diseno profesional, productos de calidad, higiene garantizada",
      "ctaPrimary": "Reservar Cita",
      "ctaSecondary": "Ver Galeria"
    },
    "servicesPage": {
      "title": "Servicios y Precios",
      "categories": [
        {
          "key": "manicure",
          "title": "Manicure",
          "defaultServices": [
            {
              "name": "Clasico",
              "price": null,
              "duration": 30,
              "description": "Cuidado de cuticulas + esmalte"
            },
            {
              "name": "Gel",
              "price": null,
              "duration": 45,
              "description": "Esmalte gel duradero, sin chip"
            },
            {
              "name": "Acrilico",
              "price": null,
              "duration": 60,
              "description": "Extensiones acrilicas"
            },
            {
              "name": "Shellac",
              "price": null,
              "duration": 40,
              "description": "Brillo duradero"
            }
          ]
        },
        {
          "key": "pedicure",
          "title": "Pedicure",
          "defaultServices": [
            {
              "name": "Spa Pedicure",
              "price": null,
              "duration": 50,
              "description": "Exfoliacion + masaje + esmalte"
            },
            {
              "name": "Gel Pedicure",
              "price": null,
              "duration": 55,
              "description": "Esmalte gel en pies"
            },
            {
              "name": "Medico",
              "price": null,
              "duration": 40,
              "description": "Callosidades, cuidado del pie"
            }
          ]
        },
        {
          "key": "nail_art",
          "title": "Nail Art",
          "defaultServices": [
            {
              "name": "Diseno Simple",
              "price": null,
              "description": "French, puntos, basico"
            },
            {
              "name": "Diseno Especial",
              "price": null,
              "description": "Arte personalizado por una"
            },
            {
              "name": "Chrome/Foil",
              "price": null,
              "description": "Acabado metalico"
            },
            {
              "name": "3D Art",
              "price": null,
              "description": "Elementos decorativos en relieve"
            }
          ]
        }
      ]
    },
    "galleryPage": {
      "title": "Galeria de Disenos",
      "categories": [
        "Natural",
        "Gel",
        "Acrilico",
        "Nail Art",
        "Novia"
      ],
      "ctaText": "Ver Todos los Disenos"
    },
    "footer": {
      "columns": [
        "about",
        "quickLinks",
        "contact",
        "social"
      ],
      "quickLinks": [
        "Inicio",
        "Servicios",
        "Galeria",
        "Equipo",
        "Contacto"
      ],
      "copyright": "{{year}} {{businessName}}. Todos los derechos reservados."
    },
    "whatsapp": {
      "defaultMessage": "Hola! Quisiera agendar una cita en {{businessName}}",
      "serviceMessage": "Hola! Quisiera reservar {{serviceName}} en {{businessName}}"
    }
  },
}
