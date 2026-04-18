/**
 * Static config with embedded JSON content
 * Generated at build time - DO NOT EDIT MANUALLY
 * 
 * Generated: 2026-04-18T20:45:59.797Z
 */

export const REGISTRY_MAP: Record<string, unknown> = {
  'salon_belleza': {
    'id': 'salon_belleza',
    'nameEs': 'Salon de Belleza',
    'nameEn': 'Beauty Salon',
    'tokens': 'salon_belleza',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'booking',
          'gallery',
          'portfolio',
          'team',
          'testimonials',
          'contact',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'contact',
          'footer'
        ]
      },
      'services': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'gallery': {
        'sections': [
          'header',
          'portfolio',
          'gallery',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolio',
          'footer'
        ]
      },
      'team': {
        'sections': [
          'header',
          'team',
          'footer'
        ],
        'requiredSections': [
          'header',
          'team',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': true,
        'method': 'fresha',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'showPrices': true,
        'showDuration': true,
        'filterable': true,
        'filterableCategories': true
      },
      'portfolio': {
        'enabled': true,
        'minImages': 20,
        'categories': [
          'cabello',
          'unas',
          'maquillaje',
          'tratamientos'
        ]
      },
      'beforeAfter': {
        'enabled': false,
        'optional': true
      },
      'staffProfiles': {
        'enabled': true,
        'showInstagram': true,
        'bookable': true
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': false
      },
      'aftercareInfo': {
        'enabled': false
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'cabello',
      'unas',
      'maquillaje',
      'tratamientos_faciales',
      'tratamientos_corporales',
      'paquetes'
    ],
    'targetAudience': {
      'primary': 'Women 25-55, middle to upper-class, seeking premium multi-service beauty care',
      'secondary': 'Brides, quinceañeras, event clients'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Salon de Belleza en {{city}} | Todos los Servicios',
      'descriptionTemplate': 'Cabello, uñas, maquillaje y tratamientos faciales en {{city}}. Reserva tu cita online. Tu centro de belleza integral.',
      'schemaType': 'BeautySalon',
      'keywords': [
        'salon de belleza {{city}}',
        'centro de belleza {{city}}',
        'maquillaje profesional {{city}}',
        'manicura {{city}}',
        'tratamiento facial {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'cta': {
        'text': 'Reservar',
        'action': 'booking'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': '{{businessName}} - Tu Salon de Belleza en {{city}}',
      'subheadlineTemplate': 'Cabello, uñas, maquillaje y tratamientos — todo en un solo lugar',
      'ctaPrimary': {
        'text': 'Reservar Cita',
        'action': 'booking'
      },
      'ctaSecondary': {
        'text': 'Ver Servicios',
        'action': 'scrollTo:services'
      }
    }
  },
  'peluqueria': {
    'id': 'peluqueria',
    'nameEs': 'Peluqueria',
    'nameEn': 'Hair Salon',
    'tokens': 'peluqueria',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'servicesPreview',
          'booking',
          'galleryPreview',
          'team',
          'locationBlock',
          'testimonial',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'servicesPreview',
          'contact',
          'footer'
        ]
      },
      'services': {
        'sections': [
          'header',
          'serviceMenu',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'serviceMenu',
          'footer'
        ]
      },
      'gallery': {
        'sections': [
          'header',
          'portfolioGallery',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolioGallery',
          'footer'
        ]
      },
      'team': {
        'sections': [
          'header',
          'teamProfiles',
          'footer'
        ],
        'requiredSections': [
          'header',
          'teamProfiles',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contactSplit',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contactSplit',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': true,
        'method': 'fresha',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'showPrices': true,
        'showDuration': true,
        'filterable': true
      },
      'portfolio': {
        'enabled': true,
        'minImages': 20,
        'categories': [
          'cortes',
          'color',
          'mechas',
          'peinados'
        ]
      },
      'beforeAfter': {
        'enabled': false,
        'optional': true
      },
      'staffProfiles': {
        'enabled': true,
        'showInstagram': true,
        'bookable': true
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': false
      },
      'aftercareInfo': {
        'enabled': false
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'cortes',
      'coloracion',
      'tratamientos',
      'peinados',
      'extensiones'
    ],
    'targetAudience': {
      'primary': 'Women 25-45, middle-class, repeat customers',
      'secondary': 'Men, Youth 18-25 for trends'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Peluqueria en {{city}} | Servicios y Precios',
      'descriptionTemplate': 'Cortes, coloracion y tratamientos en {{city}}. Reserva tu cita online. Precios desde {{lowestPrice}}.',
      'schemaType': 'BeautySalon',
      'keywords': [
        'peluqueria {{city}}',
        'corte de cabello {{neighborhood}}',
        'salon de belleza {{city}}',
        'coloracion {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'cta': {
        'text': 'Reservar',
        'action': 'booking'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': '{{businessName}} - Tu Mejor Look en {{city}}',
      'subheadlineTemplate': 'Cortes profesionales, coloracion y tratamientos que transforman tu estilo',
      'ctaPrimary': {
        'text': 'Reservar Cita',
        'action': 'booking'
      },
      'ctaSecondary': {
        'text': 'Ver Servicios',
        'action': 'scrollTo:services'
      }
    }
  },
  'gimnasio': {
    'id': 'gimnasio',
    'nameEs': 'Gimnasio/Fitness',
    'nameEn': 'Gym/Fitness Center',
    'tokens': 'gimnasio',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'classSchedule',
          'membershipPlans',
          'team',
          'contact',
          'testimonials',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'membershipPlans',
          'contact',
          'footer'
        ]
      },
      'pricing': {
        'sections': [
          'header',
          'membershipPlans',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'membershipPlans',
          'footer'
        ]
      },
      'schedule': {
        'sections': [
          'header',
          'classSchedule',
          'footer'
        ],
        'requiredSections': [
          'header',
          'classSchedule',
          'footer'
        ]
      },
      'team': {
        'sections': [
          'header',
          'team',
          'footer'
        ],
        'requiredSections': [
          'header',
          'team',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': true,
        'method': 'mindbody',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'showPrices': true
      },
      'portfolio': {
        'enabled': false,
        'optional': true
      },
      'beforeAfter': {
        'enabled': false
      },
      'staffProfiles': {
        'enabled': true,
        'label': 'Entrenadores',
        'showCertifications': true
      },
      'pricingDisplay': {
        'enabled': true,
        'showTiers': true,
        'highlightPopular': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': true,
        'filterByDay': true,
        'filterByType': true,
        'filterByInstructor': true
      },
      'packageBuilder': {
        'enabled': true
      },
      'aftercareInfo': {
        'enabled': false
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      },
      'freeTrial': {
        'enabled': true,
        'days': 7
      }
    },
    'serviceCategories': [
      'membresias',
      'clases_grupales',
      'entrenamiento_personal',
      'amenidades'
    ],
    'targetAudience': {
      'primary': 'Adults 25-45, fitness-conscious, comparing options',
      'secondary': 'Athletes, Seniors, Youth'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Gimnasio en {{city}} | Membresias y Clases',
      'descriptionTemplate': 'Gimnasio en {{city}} con equipamiento de ultima generacion. Clases ilimitadas. Membresias desde {{lowestPrice}}/mes.',
      'schemaType': 'SportsActivityLocation',
      'keywords': [
        'gimnasio {{city}}',
        'gym cerca de mi',
        'clases de fitness {{city}}',
        'entrenador personal {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Clases',
        'Planes',
        'Equipo',
        'Contacto'
      ],
      'cta': {
        'text': 'Prueba Free',
        'action': 'freeTrial'
      }
    },
    'hero': {
      'style': 'video',
      'headlineTemplate': 'TRANSFORMA TU CUERPO EN {{businessName}}',
      'subheadlineTemplate': 'Entrena con los mejores profesionales en instalaciones de primera',
      'stats': [
        '{{memberCount}}+ MIEMBROS',
        '{{classCount}}+ CLASES SEMANALES',
        '{{accessHours}} DISPONIBLE'
      ],
      'ctaPrimary': {
        'text': 'PRUEBA 7 DIAS FREE',
        'action': 'freeTrial'
      },
      'ctaSecondary': {
        'text': 'VER MEMBRESIAS',
        'action': 'scrollTo:pricing'
      }
    }
  },
  'spa': {
    'id': 'spa',
    'nameEs': 'Spa/Wellness',
    'nameEn': 'Spa/Wellness',
    'tokens': 'spa',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'booking',
          'gallery',
          'team',
          'testimonials',
          'contact',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'contact',
          'footer'
        ]
      },
      'treatments': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'packages': {
        'sections': [
          'header',
          'membershipPlans',
          'quoteForm',
          'footer'
        ],
        'requiredSections': [
          'header',
          'membershipPlans',
          'footer'
        ]
      },
      'team': {
        'sections': [
          'header',
          'team',
          'footer'
        ],
        'requiredSections': [
          'header',
          'team',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': true,
        'method': 'fresha',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'label': 'Tratamientos',
        'showPrices': true,
        'showDuration': true
      },
      'portfolio': {
        'enabled': false,
        'optional': true
      },
      'beforeAfter': {
        'enabled': false
      },
      'staffProfiles': {
        'enabled': true,
        'label': 'Terapeutas'
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': true,
        'showSavings': true
      },
      'aftercareInfo': {
        'enabled': false
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      },
      'giftVouchers': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'masajes',
      'faciales',
      'corporales',
      'paquetes'
    ],
    'targetAudience': {
      'primary': 'Women 30-55, seeking relaxation and self-care',
      'secondary': 'Couples, Business travelers, Mums'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Spa en {{city}} | Tratamientos y Paquetes',
      'descriptionTemplate': 'Spa en {{city}}. Masajes, faciales y tratamientos corporales. Reserva tu experiencia de relajacion.',
      'schemaType': 'HealthAndBeautyBusiness',
      'keywords': [
        'spa {{city}}',
        'masajes {{city}}',
        'tratamiento facial {{city}}',
        'relajacion {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Tratamientos',
        'Paquetes',
        'Equipo',
        'Contacto'
      ],
      'cta': {
        'text': 'Reservar',
        'action': 'booking'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': 'Tu Santuario de Bienestar',
      'subheadlineTemplate': 'Relajate, renueva y reconnectate en {{businessName}}',
      'ctaPrimary': {
        'text': 'Reservar Experiencia',
        'action': 'booking'
      },
      'ctaSecondary': {
        'text': 'Ver Tratamientos',
        'action': 'scrollTo:treatments'
      }
    }
  },
  'barberia': {
    'id': 'barberia',
    'nameEs': 'Barberia',
    'nameEn': 'Barbershop',
    'tokens': 'barberia',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'booking',
          'portfolio',
          'beforeAfter',
          'team',
          'contact',
          'testimonials',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'contact',
          'footer'
        ]
      },
      'services': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'gallery': {
        'sections': [
          'header',
          'portfolio',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolio',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': true,
        'method': 'square',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'style': 'traditional-list',
        'showPrices': true,
        'showDuration': true
      },
      'portfolio': {
        'enabled': true,
        'minImages': 20,
        'categories': [
          'fades',
          'clasico',
          'barbas'
        ],
        'noStockPhotos': true
      },
      'beforeAfter': {
        'enabled': true
      },
      'staffProfiles': {
        'enabled': true,
        'label': 'Barberos'
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'walkInPolicy': {
        'enabled': true
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': false
      },
      'aftercareInfo': {
        'enabled': false
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'cortes',
      'afeitado',
      'arreglo_barba',
      'paquetes'
    ],
    'targetAudience': {
      'primary': 'Men 18-55, grooming-conscious',
      'secondary': 'Boys, Grooms, Older gentlemen'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Barberia en {{city}} | Cortes y Afeitado',
      'descriptionTemplate': 'Barberia en {{city}}. Cortes clasicos y modernos, afeitado profesional. Walk-ins bienvenidos.',
      'schemaType': 'BarberShop',
      'keywords': [
        'barberia {{city}}',
        'corte de pelo hombre {{city}}',
        'barber shop {{city}}',
        'fade {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'cta': {
        'text': 'Reservar',
        'action': 'booking'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': '{{businessName}} - El Arte del Corte',
      'subheadlineTemplate': 'Tradicion y maestria en cada detalle',
      'ctaPrimary': {
        'text': 'Reservar Cita',
        'action': 'booking'
      },
      'ctaSecondary': {
        'text': 'Walk-In',
        'action': 'scrollTo:contact'
      }
    }
  },
  'unas': {
    'id': 'unas',
    'nameEs': 'Unas',
    'nameEn': 'Nail Salon',
    'tokens': 'unas',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'booking',
          'portfolio',
          'gallery',
          'team',
          'contact',
          'testimonials',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'contact',
          'footer'
        ]
      },
      'services': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'gallery': {
        'sections': [
          'header',
          'portfolio',
          'gallery',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolio',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': true,
        'method': 'fresha',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'showPrices': true,
        'showDuration': true,
        'tabbed': true
      },
      'portfolio': {
        'enabled': true,
        'minImages': 30,
        'categories': [
          'natural',
          'gel',
          'acrilico',
          'nail_art',
          'bridal'
        ]
      },
      'beforeAfter': {
        'enabled': true
      },
      'staffProfiles': {
        'enabled': true,
        'label': 'Nail Artists'
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': false
      },
      'aftercareInfo': {
        'enabled': false
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'manicure',
      'pedicure',
      'nail_art',
      'addons'
    ],
    'targetAudience': {
      'primary': 'Women 20-45, beauty-conscious, nail art enthusiasts',
      'secondary': 'Brides, Special events'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Unas en {{city}} | Manicure, Pedicure y Nail Art',
      'descriptionTemplate': 'Unas perfectas en {{city}}. Diseno profesional, productos de calidad. Reserva tu cita.',
      'schemaType': 'BeautySalon',
      'keywords': [
        'unas {{city}}',
        'manicure {{city}}',
        'nail art {{city}}',
        'pedicure {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'cta': {
        'text': 'Reservar',
        'action': 'booking'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': 'Unas Perfectas en {{city}}',
      'subheadlineTemplate': 'Diseno profesional, productos de calidad, higiene garantizada',
      'ctaPrimary': {
        'text': 'Reservar Cita',
        'action': 'booking'
      },
      'ctaSecondary': {
        'text': 'Ver Galeria',
        'action': 'scrollTo:gallery'
      }
    }
  },
  'tatuajes': {
    'id': 'tatuajes',
    'nameEs': 'Tatuajes/Piercing',
    'nameEn': 'Tattoo/Piercing Studio',
    'tokens': 'tatuajes',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'portfolio',
          'team',
          'contact',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'portfolio',
          'contact',
          'footer'
        ]
      },
      'portfolio': {
        'sections': [
          'header',
          'portfolioGallery',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolioGallery',
          'footer'
        ]
      },
      'artists': {
        'sections': [
          'header',
          'artistProfiles',
          'footer'
        ],
        'requiredSections': [
          'header',
          'artistProfiles',
          'footer'
        ]
      },
      'info': {
        'sections': [
          'header',
          'aftercareGuide',
          'faq',
          'consultationForm',
          'contactBlock',
          'footer'
        ],
        'requiredSections': [
          'header',
          'faq',
          'contactBlock',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': false,
        'method': 'consultation_form',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': false
      },
      'portfolio': {
        'enabled': true,
        'minImages': 50,
        'categories': [
          'tradicional',
          'realismo',
          'blackwork',
          'japones',
          'minimal'
        ],
        'filterByArtist': true,
        'filterByStyle': true
      },
      'beforeAfter': {
        'enabled': true,
        'label': 'Cover-ups'
      },
      'staffProfiles': {
        'enabled': true,
        'label': 'Artistas',
        'showStyles': true
      },
      'pricingDisplay': {
        'enabled': false,
        'showBySize': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': false
      },
      'aftercareInfo': {
        'enabled': true,
        'prominent': true
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      },
      'consultationForm': {
        'enabled': true,
        'fields': [
          'name',
          'phone',
          'email',
          'tattooType',
          'bodyLocation',
          'approximateSize',
          'referenceImage',
          'description',
          'isFirstTattoo',
          'howFoundUs'
        ]
      }
    },
    'serviceCategories': [
      'tatuajes_custom',
      'tatuajes_tradicional',
      'tatuajes_realismo',
      'tatuajes_blackwork',
      'piercing'
    ],
    'targetAudience': {
      'primary': 'Adults 18-45, seeking custom tattoo or piercing',
      'secondary': 'First-timers, Cover-up customers, Collectors'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Tatuajes en {{city}} | Estudio de Tatuaje',
      'descriptionTemplate': 'Tatuajes personalizados en {{city}}. Artistas profesionales, higiene impecable. Agenda tu consulta.',
      'schemaType': 'LocalBusiness',
      'keywords': [
        'tatuajes {{city}}',
        'tattoo {{city}}',
        'piercing {{city}}',
        'estudio tatuaje {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Portafolio',
        'Artistas',
        'Info',
        'Contacto'
      ],
      'cta': {
        'text': 'Consulta',
        'action': 'consultationForm'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': '{{businessName}} - Arte en Tu Piel',
      'subheadlineTemplate': 'Tatuajes personalizados, higiene impecable',
      'ctaPrimary': {
        'text': 'Agendar Consulta',
        'action': 'consultationForm'
      },
      'ctaSecondary': {
        'text': 'Ver Portafolio',
        'action': 'scrollTo:portfolio'
      }
    }
  },
  'estetica': {
    'id': 'estetica',
    'nameEs': 'Estetica/Facial',
    'nameEn': 'Aesthetic Clinic',
    'tokens': 'estetica',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'beforeAfter',
          'team',
          'testimonials',
          'contact',
          'quoteForm',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'contact',
          'footer'
        ]
      },
      'treatments': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'results': {
        'sections': [
          'header',
          'beforeAfter',
          'footer'
        ],
        'requiredSections': [
          'header',
          'beforeAfter',
          'footer'
        ]
      },
      'team': {
        'sections': [
          'header',
          'team',
          'footer'
        ],
        'requiredSections': [
          'header',
          'team',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': false,
        'method': 'consultation_form',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'label': 'Tratamientos',
        'showPrices': 'from',
        'showDescription': true
      },
      'portfolio': {
        'enabled': true,
        'label': 'Resultados'
      },
      'beforeAfter': {
        'enabled': true,
        'prominent': true,
        'sliderStyle': true,
        'minPairs': 20
      },
      'staffProfiles': {
        'enabled': true,
        'label': 'Equipo Medico',
        'showCredentials': true,
        'showTreatmentCount': true
      },
      'pricingDisplay': {
        'enabled': true,
        'showFromPrice': true,
        'note': 'Precios varian segun evaluacion. Primera consulta sin cargo.'
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': false
      },
      'aftercareInfo': {
        'enabled': true
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      },
      'freeConsultation': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'faciales',
      'inyectables',
      'corporales',
      'laser'
    ],
    'targetAudience': {
      'primary': 'Women 30-60, seeking professional skincare/anti-aging',
      'secondary': 'Younger (acne), Men, Post-procedure'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Estetica en {{city}} | Tratamientos Avanzados',
      'descriptionTemplate': 'Clinica estetica en {{city}}. Tratamientos faciales, corporales y mas. Consulta sin cargo.',
      'schemaType': 'MedicalBusiness',
      'keywords': [
        'estetica {{city}}',
        'tratamiento facial {{city}}',
        'botox {{city}}',
        'clinica estetica {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Tratamientos',
        'Resultados',
        'Equipo',
        'Contacto'
      ],
      'cta': {
        'text': 'Consulta',
        'action': 'consultationForm'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': '{{businessName}} - Belleza y Ciencia',
      'subheadlineTemplate': 'Tratamientos avanzados con tecnologia de punta y resultados reales',
      'ctaPrimary': {
        'text': 'Reservar Consulta',
        'action': 'consultationForm'
      },
      'ctaSecondary': {
        'text': 'Ver Resultados',
        'action': 'scrollTo:results'
      }
    }
  },
  'diseno_grafico': {
    'id': 'diseno_grafico',
    'nameEs': 'Diseno Grafico',
    'nameEn': 'Graphic Design',
    'tokens': 'diseno_grafico',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'productCatalog',
          'portfolio',
          'testimonials',
          'quoteForm',
          'contact',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'portfolio',
          'contact',
          'footer'
        ]
      },
      'portfolio': {
        'sections': [
          'header',
          'portfolio',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolio',
          'footer'
        ]
      },
      'catalog': {
        'sections': [
          'header',
          'productCatalog',
          'footer'
        ],
        'requiredSections': [
          'header',
          'productCatalog',
          'footer'
        ]
      },
      'services': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': false,
        'method': 'whatsapp',
        'fallback': 'email'
      },
      'serviceMenu': {
        'enabled': true,
        'showPrices': true
      },
      'productCatalog': {
        'enabled': true,
        'showPrices': true,
        'whatsappOrder': true
      },
      'portfolio': {
        'enabled': true,
        'minImages': 12,
        'categories': [
          'portadas',
          'premade',
          'mockups',
          'branding'
        ]
      },
      'staffProfiles': {
        'enabled': false
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': false
      },
      'testimonials': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'portadas_personalizadas',
      'portadas_premade',
      'mockups_3d',
      'branding'
    ],
    'targetAudience': {
      'primary': 'Independent authors, self-publishing writers',
      'secondary': 'Small publishers, content creators, bloggers'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Diseno Grafico Profesional en {{city}}',
      'descriptionTemplate': 'Diseno grafico profesional en {{city}}. Portadas de libros, diseno editorial y branding creativo. Consulta nuestro catalogo.',
      'schemaType': 'ProfessionalService',
      'keywords': [
        'diseno grafico {{city}}',
        'portadas de libros {{city}}',
        'diseno editorial {{city}}',
        'book cover design {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Servicios',
        'Catalogo',
        'Portafolio',
        'Contacto'
      ],
      'cta': {
        'text': 'Contactame',
        'action': 'whatsapp'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': 'Donde la fantasia se convierte en realidad',
      'subheadlineTemplate': 'Diseno de portadas y arte visual para tu proyecto',
      'ctaPrimary': {
        'text': 'Ver Catalogo',
        'action': 'scrollTo:catalogo'
      },
      'ctaSecondary': {
        'text': 'Trabajemos Juntos',
        'action': 'whatsapp'
      }
    }
  },
  'pestanas': {
    'id': 'pestanas',
    'nameEs': 'Pestañas y Cejas',
    'nameEn': 'Lashes & Brows',
    'tokens': 'pestanas',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'booking',
          'portfolio',
          'gallery',
          'testimonials',
          'contact',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'contact',
          'footer'
        ]
      },
      'services': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'gallery': {
        'sections': [
          'header',
          'portfolio',
          'gallery',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolio',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'whatsappFloat': {
        'enabled': true
      },
      'serviceMenu': {
        'enabled': true,
        'showPrices': true,
        'showDuration': true,
        'filterable': true
      },
      'portfolio': {
        'enabled': true,
        'minImages': 12,
        'categories': [
          'pestanas',
          'cejas',
          'microblading'
        ]
      },
      'beforeAfter': {
        'enabled': false,
        'optional': true
      },
      'staffProfiles': {
        'enabled': false
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': false
      },
      'aftercareInfo': {
        'enabled': false
      },
      'onlineBooking': {
        'enabled': true,
        'method': 'whatsapp',
        'fallback': 'whatsapp'
      },
      'googleMapsEmbed': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'pestanas',
      'cejas',
      'microblading',
      'lifting'
    ],
    'targetAudience': {
      'primary': 'Women 20-40, Instagram-driven, beauty-conscious',
      'secondary': 'Brides, event attendees, beauty professionals'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Pestañas y Cejas en {{city}}',
      'descriptionTemplate': 'Extensiones de pestañas, microblading y diseño de cejas en {{city}}. Reserva tu cita por WhatsApp. Precios desde {{lowestPrice}}.',
      'schemaType': 'BeautySalon',
      'keywords': [
        'pestañas {{city}}',
        'extensiones de pestañas {{city}}',
        'microblading {{city}}',
        'diseño de cejas {{city}}',
        'lash extensions {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Contacto'
      ],
      'cta': {
        'text': 'Reservar',
        'action': 'booking'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': '{{businessName}} - Tu Mirada Perfecta en {{city}}',
      'subheadlineTemplate': 'Extensiones de pestañas, microblading y diseño de cejas que realzan tu belleza natural',
      'ctaPrimary': {
        'text': 'Reservar Cita',
        'action': 'booking'
      },
      'ctaSecondary': {
        'text': 'Ver Servicios',
        'action': 'scrollTo:services'
      }
    }
  },
  'depilacion': {
    'id': 'depilacion',
    'nameEs': 'Depilacion',
    'nameEn': 'Hair Removal Clinic',
    'tokens': 'depilacion',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'services',
          'beforeAfter',
          'quoteForm',
          'contact',
          'testimonials',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'services',
          'contact',
          'footer'
        ]
      },
      'treatments': {
        'sections': [
          'header',
          'services',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'technology': {
        'sections': [
          'header',
          'services',
          'faq',
          'footer'
        ],
        'requiredSections': [
          'header',
          'services',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contact',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contact',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': false,
        'method': 'consultation_form',
        'fallback': 'whatsapp'
      },
      'serviceMenu': {
        'enabled': true,
        'label': 'Tratamientos',
        'showPrices': true,
        'areaBasedPricing': true
      },
      'portfolio': {
        'enabled': false
      },
      'beforeAfter': {
        'enabled': true,
        'label': 'Resultados'
      },
      'staffProfiles': {
        'enabled': false,
        'optional': true
      },
      'pricingDisplay': {
        'enabled': true,
        'showPerSession': true,
        'showPackageDiscounts': true
      },
      'walkInPolicy': {
        'enabled': false
      },
      'classSchedule': {
        'enabled': false
      },
      'packageBuilder': {
        'enabled': true,
        'tiers': [
          6,
          8,
          10
        ],
        'discounts': [
          20,
          30,
          40
        ]
      },
      'aftercareInfo': {
        'enabled': true
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      },
      'freeConsultation': {
        'enabled': true,
        'prominent': true
      },
      'technologyShowcase': {
        'enabled': true,
        'showFdaBadge': true,
        'showSkinTypeInfo': true
      }
    },
    'serviceCategories': [
      'laser',
      'cera',
      'electrolisis',
      'paquetes'
    ],
    'targetAudience': {
      'primary': 'Women 20-45, seeking permanent hair reduction',
      'secondary': 'Men, PCOS transformations'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Depilacion Laser en {{city}} | Resultados Permanentes',
      'descriptionTemplate': 'Depilacion laser definitiva en {{city}}. Tecnologia avanzada, resultados permanentes. Consulta gratis.',
      'schemaType': 'MedicalBusiness',
      'keywords': [
        'depilacion laser {{city}}',
        'depilacion definitiva {{city}}',
        'laser hair removal {{city}}'
      ]
    },
    'nav': {
      'items': [
        'Inicio',
        'Tratamientos',
        'Tecnologia',
        'Resultados',
        'Contacto'
      ],
      'cta': {
        'text': 'Consulta Gratis',
        'action': 'consultationForm'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': '{{businessName}} - Depilacion Laser Definitiva',
      'subheadlineTemplate': 'Tecnologia de ultima generacion, resultados permanentes',
      'ctaPrimary': {
        'text': 'Consulta Sin Cargo',
        'action': 'consultationForm'
      },
      'ctaSecondary': {
        'text': 'Ver Tratamientos',
        'action': 'scrollTo:treatments'
      }
    }
  },
  'meal_prep': {
    'id': 'meal_prep',
    'nameEs': 'Meal Prep & Compras',
    'nameEn': 'Meal Prep & Personal Shopping',
    'tokens': 'meal_prep',
    'pages': {
      'homepage': {
        'sections': [
          'header',
          'hero',
          'servicesPreview',
          'savingsCalculator',
          'galleryPreview',
          'team',
          'testimonial',
          'faq',
          'contact',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'hero',
          'servicesPreview',
          'contact',
          'footer'
        ]
      },
      'services': {
        'sections': [
          'header',
          'serviceMenu',
          'faq',
          'ctaBanner',
          'footer'
        ],
        'requiredSections': [
          'header',
          'serviceMenu',
          'footer'
        ]
      },
      'gallery': {
        'sections': [
          'header',
          'portfolioGallery',
          'footer'
        ],
        'requiredSections': [
          'header',
          'portfolioGallery',
          'footer'
        ]
      },
      'team': {
        'sections': [
          'header',
          'teamProfiles',
          'footer'
        ],
        'requiredSections': [
          'header',
          'teamProfiles',
          'footer'
        ]
      },
      'contact': {
        'sections': [
          'header',
          'contactSplit',
          'footer'
        ],
        'requiredSections': [
          'header',
          'contactSplit',
          'footer'
        ]
      }
    },
    'features': {
      'onlineBooking': {
        'enabled': false
      },
      'serviceMenu': {
        'enabled': true,
        'showPrices': true,
        'showDuration': true,
        'filterable': true
      },
      'portfolio': {
        'enabled': true,
        'minImages': 6,
        'categories': [
          'cortes_de_carne',
          'mise_en_place',
          'freezer_meals',
          'mercado'
        ]
      },
      'beforeAfter': {
        'enabled': false
      },
      'staffProfiles': {
        'enabled': true,
        'showInstagram': true,
        'bookable': false
      },
      'pricingDisplay': {
        'enabled': true,
        'showExactPrice': true
      },
      'savingsCalculator': {
        'enabled': true,
        'defaultTierMonthlyGs': 1600000,
        'defaultHourlyValueGs': 25000
      },
      'seasonalCalendar': {
        'enabled': false,
        'optional': true
      },
      'whatsappFloat': {
        'enabled': true
      },
      'googleMapsEmbed': {
        'enabled': true
      }
    },
    'serviceCategories': [
      'compras',
      'prep',
      'cocinado',
      'add-on'
    ],
    'targetAudience': {
      'primary': 'Remote workers 25-45 in San Lorenzo, USD earners, time-poor professionals',
      'secondary': 'Busy households, couples, clinic doctors, students'
    },
    'seo': {
      'titleTemplate': '{{businessName}} - Meal Prep y Compras en {{city}} | Tu tiempo vale mas',
      'descriptionTemplate': 'Hacemos tu mercado, prep semanal y comidas listas. Whole-animal, mayorista, sin conservantes. Entregamos en {{city}}. Calcula tu ahorro.',
      'schemaType': 'FoodService',
      'keywords': [
        'meal prep {{city}}',
        'compras personalizadas {{city}}',
        'mercado {{neighborhood}}',
        'comida saludable San Lorenzo Paraguay',
        'prep semanal'
      ]
    },
    'nav': {
      'items': [
        'Servicios',
        'Calculadora',
        'Galeria',
        'FAQ',
        'Contacto'
      ],
      'cta': {
        'text': 'Pedir por WhatsApp',
        'action': 'whatsapp'
      }
    },
    'hero': {
      'style': 'image',
      'headlineTemplate': 'Convertimos el caos del mercado en comida lista',
      'subheadlineTemplate': '{{businessName}}: compras, prep y freezer meals puerta a puerta en {{city}}. Whole-animal, mayorista, sin humo.',
      'ctaPrimary': {
        'text': 'Calcula tu ahorro',
        'action': 'scrollTo:calculadora'
      },
      'ctaSecondary': {
        'text': 'Pedir por WhatsApp',
        'action': 'whatsapp'
      }
    }
  }
}

export const CONTENT_MAP: Record<string, unknown> = {
  'salon_belleza': {
    'id': 'salon_belleza',
    'locale': 'es-PY',
    'hero': {
      'headline': '{{businessName}} - Tu Centro de Belleza en {{city}}',
      'subheadline': 'Cabello, uñas, maquillaje y tratamientos — todo en un solo lugar',
      'ctaPrimary': 'Reservar Cita',
      'ctaSecondary': 'Ver Servicios'
    },
    'servicesPage': {
      'title': 'Servicios y Precios',
      'categories': [
        {
          'key': 'cabello',
          'title': 'Cabello',
          'description': 'Cortes, coloracion y tratamientos capilares para todo tipo de cabello',
          'defaultServices': [
            {
              'name': 'Corte Dama',
              'price': null,
              'duration': 45,
              'description': 'Corte y styling profesional'
            },
            {
              'name': 'Coloracion Completa',
              'priceFrom': null,
              'duration': 90,
              'description': 'Color base completo y personalizado'
            },
            {
              'name': 'Mechas / Highlights',
              'priceFrom': null,
              'duration': 120,
              'description': 'Iluminaciones y reflejos naturales'
            },
            {
              'name': 'Keratina',
              'price': null,
              'duration': 120,
              'description': 'Alisado y reparacion intensiva'
            }
          ]
        },
        {
          'key': 'unas',
          'title': 'Uñas',
          'description': 'Manicura, pedicura y diseños personalizados',
          'defaultServices': [
            {
              'name': 'Manicura Clasica',
              'price': null,
              'duration': 30,
              'description': 'Limado, cutículas y esmaltado'
            },
            {
              'name': 'Pedicura Completa',
              'price': null,
              'duration': 45,
              'description': 'Cuidado completo de pies y esmaltado'
            },
            {
              'name': 'Uñas en Gel',
              'price': null,
              'duration': 60,
              'description': 'Aplicacion de gel con diseño a eleccion'
            },
            {
              'name': 'Nail Art',
              'priceFrom': null,
              'duration': 75,
              'description': 'Diseños personalizados y creativos'
            }
          ]
        },
        {
          'key': 'maquillaje',
          'title': 'Maquillaje',
          'description': 'Maquillaje profesional para toda ocasion',
          'defaultServices': [
            {
              'name': 'Maquillaje Social',
              'price': null,
              'duration': 45,
              'description': 'Para eventos y reuniones especiales'
            },
            {
              'name': 'Maquillaje de Novia',
              'price': null,
              'duration': 90,
              'description': 'Look completo con prueba previa'
            },
            {
              'name': 'Maquillaje Quinceañera',
              'price': null,
              'duration': 60,
              'description': 'Diseño especial para tu gran dia'
            }
          ]
        },
        {
          'key': 'tratamientos_faciales',
          'title': 'Tratamientos Faciales',
          'description': 'Cuidados profesionales para una piel radiante',
          'defaultServices': [
            {
              'name': 'Limpieza Facial Profunda',
              'price': null,
              'duration': 60,
              'description': 'Limpieza, extraccion y mascarilla'
            },
            {
              'name': 'Tratamiento Anti-Age',
              'price': null,
              'duration': 75,
              'description': 'Rejuvenecimiento y firmeza para la piel'
            },
            {
              'name': 'Hidratacion Facial',
              'price': null,
              'duration': 45,
              'description': 'Nutricion intensiva y luminosidad'
            }
          ]
        },
        {
          'key': 'paquetes',
          'title': 'Paquetes',
          'description': 'Combina servicios y ahorra con nuestros paquetes especiales',
          'defaultServices': [
            {
              'name': 'Spa Day',
              'priceFrom': null,
              'duration': 180,
              'description': 'Facial + manicura + pedicura + masaje'
            },
            {
              'name': 'Novia Completa',
              'priceFrom': null,
              'duration': 240,
              'description': 'Maquillaje + peinado + manicura + prueba previa'
            },
            {
              'name': 'Dia de Chicas',
              'priceFrom': null,
              'duration': 150,
              'description': 'Paquete grupal: mani + pedi + facial para 3+ personas'
            }
          ]
        }
      ]
    },
    'teamPage': {
      'title': 'Nuestro Equipo',
      'memberTemplate': {
        'buttonText': 'Reservar con {{name}}'
      }
    },
    'galleryPage': {
      'title': 'Galeria',
      'subtitle': 'Conoce nuestro trabajo',
      'categories': [
        'Cabello',
        'Uñas',
        'Maquillaje',
        'Tratamientos'
      ],
      'ctaText': 'Ver Galeria Completa'
    },
    'contactPage': {
      'title': 'Contacto',
      'locationTitle': 'Visitanos en {{neighborhood}}',
      'formFields': [
        'name',
        'phone',
        'service',
        'preferredDate',
        'message'
      ],
      'formSubmitText': 'Enviar Consulta'
    },
    'faq': [
      {
        'q': 'Puedo combinar varios servicios en una sola visita?',
        'a': 'Si, ofrecemos paquetes combinados y podes agendar multiples servicios el mismo dia para mayor comodidad.'
      },
      {
        'q': 'Tienen paquetes para novias?',
        'a': 'Si, nuestro paquete Novia Completa incluye maquillaje, peinado, manicura y una prueba previa para asegurar tu look perfecto.'
      },
      {
        'q': 'Ofrecen descuentos para grupos?',
        'a': 'Si, tenemos el paquete Dia de Chicas y opciones especiales para despedidas, cumpleaños y eventos grupales.'
      },
      {
        'q': 'Cuanto tiempo dura un tratamiento facial?',
        'a': 'Depende del tipo de tratamiento. Una limpieza facial profunda dura aproximadamente 60 minutos.'
      },
      {
        'q': 'Necesito reservar con anticipacion?',
        'a': 'Recomendamos reservar con al menos 24 horas de anticipacion, especialmente para servicios de novia y paquetes.'
      }
    ],
    'ctaBanner': {
      'title': 'Lista para consentirte?',
      'buttonText': 'Reservar Ahora'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera agendar una cita en {{businessName}}',
      'serviceMessage': 'Hola! Quisiera reservar {{serviceName}} en {{businessName}}'
    },
    'seo': {
      'altTextTemplates': {
        'service': '{{serviceName}} en {{businessName}}, {{city}}',
        'portfolio': 'Resultado de {{serviceName}} por {{businessName}}',
        'team': '{{memberName}} - {{memberTitle}} en {{businessName}}'
      }
    }
  },
  'peluqueria': {
    'id': 'peluqueria',
    'locale': 'es-PY',
    'hero': {
      'headline': '{{businessName}} - Tu Mejor Look en {{city}}',
      'subheadline': 'Cortes profesionales, coloracion y tratamientos que transforman tu estilo',
      'ctaPrimary': 'Reservar Cita',
      'ctaSecondary': 'Ver Servicios'
    },
    'servicesPage': {
      'title': 'Servicios y Precios',
      'categories': [
        {
          'key': 'cortes',
          'title': 'Cortes de Cabello',
          'description': 'Cortes personalizados para cada tipo de rostro y estilo de vida',
          'defaultServices': [
            {
              'name': 'Corte Dama',
              'price': null,
              'duration': 45,
              'description': 'Corte y style profesional'
            },
            {
              'name': 'Corte Caballero',
              'price': null,
              'duration': 30,
              'description': 'Corte moderno y clasico'
            },
            {
              'name': 'Corte Nino',
              'price': null,
              'duration': 25,
              'description': 'Para los mas pequenos'
            },
            {
              'name': 'Recorte de Bangs',
              'price': null,
              'duration': 15,
              'description': 'Retoque de fleco'
            }
          ]
        },
        {
          'key': 'coloracion',
          'title': 'Coloracion y Cambios',
          'description': 'Tecnicas avanzadas para un color perfecto y natural',
          'defaultServices': [
            {
              'name': 'Coloracion Completa',
              'priceFrom': null,
              'duration': 90,
              'description': 'Color base completo'
            },
            {
              'name': 'Mechas/Highlighting',
              'priceFrom': null,
              'duration': 120,
              'description': 'Para brillo natural'
            },
            {
              'name': 'Balayage',
              'priceFrom': null,
              'duration': 150,
              'description': 'Tecnica francesa de mano alzada'
            },
            {
              'name': 'Ombre',
              'priceFrom': null,
              'duration': 120,
              'description': 'Degradado natural'
            },
            {
              'name': 'Retoque de Raices',
              'price': null,
              'duration': 60,
              'description': 'Mantenimiento mensual'
            }
          ]
        },
        {
          'key': 'tratamientos',
          'title': 'Tratamientos Especiales',
          'description': 'Cuidados intensivos para cabello danado y salud del cuero cabelludo',
          'defaultServices': [
            {
              'name': 'Keratina Intensiva',
              'price': null,
              'duration': 120,
              'description': 'Alisa y repara'
            },
            {
              'name': 'Tratamiento Capilar',
              'price': null,
              'duration': 45,
              'description': 'Hidratacion profunda'
            },
            {
              'name': 'Masaje Scalp',
              'price': null,
              'duration': 30,
              'description': 'Relajacion y salud capilar'
            }
          ]
        }
      ]
    },
    'teamPage': {
      'title': 'Nuestro Equipo',
      'memberTemplate': {
        'buttonText': 'Reservar con {{name}}'
      }
    },
    'galleryPage': {
      'title': 'Galeria',
      'subtitle': 'Descubre nuestro trabajo',
      'categories': [
        'Cortes',
        'Color',
        'Mechas',
        'Peinados'
      ],
      'ctaText': 'Ver Galeria Completa'
    },
    'contactPage': {
      'title': 'Contacto',
      'locationTitle': 'Visitanos en {{neighborhood}}',
      'formFields': [
        'name',
        'phone',
        'service',
        'preferredDate',
        'message'
      ],
      'formSubmitText': 'Enviar Consulta'
    },
    'faq': [
      {
        'q': 'Cuanto tiempo dura un color?',
        'a': 'Depende del tipo de color y cuidado. En promedio 4-6 semanas.'
      },
      {
        'q': 'Cuanto tiempo dura la keratina?',
        'a': 'Con cuidado adecuado, puede durar 3-4 meses.'
      }
    ],
    'ctaBanner': {
      'title': 'Lista para tu nuevo look?',
      'buttonText': 'Reservar Ahora'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera agendar una cita en {{businessName}}',
      'serviceMessage': 'Hola! Quisiera reservar {{serviceName}} en {{businessName}}'
    },
    'seo': {
      'altTextTemplates': {
        'service': '{{serviceName}} en {{businessName}}, {{city}}',
        'portfolio': 'Resultado de {{serviceName}} por {{businessName}}',
        'team': '{{memberName}} - {{memberTitle}} en {{businessName}}'
      }
    }
  },
  'gimnasio': {
    'id': 'gimnasio',
    'locale': 'es-PY',
    'hero': {
      'headline': 'TRANSFORMA TU CUERPO EN {{businessName}}',
      'subheadline': 'Entrena con los mejores profesionales en instalaciones de primera',
      'stats': [
        '{{memberCount}}+ MIEMBROS',
        '{{classCount}}+ CLASES SEMANALES',
        '{{accessHours}} DISPONIBLE'
      ],
      'ctaPrimary': 'PRUEBA 7 DIAS FREE',
      'ctaSecondary': 'VER MEMBRESIAS'
    },
    'servicesPage': {
      'title': 'Servicios y Membresias',
      'categories': [
        {
          'key': 'membresias',
          'title': 'Membresias',
          'defaultServices': [
            {
              'name': 'Plan Basico',
              'price': '150.000 Gs/mes',
              'description': 'Acceso a sala de pesas y maquinas'
            },
            {
              'name': 'Plan Clases',
              'price': '200.000 Gs/mes',
              'description': 'Acceso a todas las clases grupales'
            },
            {
              'name': 'Plan Full',
              'price': '300.000 Gs/mes',
              'description': 'Todo incluido + sesiones de trainer'
            },
            {
              'name': 'Personal Trainer',
              'price': '400.000 Gs/mes',
              'description': 'Entrenamiento personalizado'
            }
          ]
        },
        {
          'key': 'clases',
          'title': 'Clases Grupales',
          'defaultServices': [
            {
              'name': 'Crossfit',
              'price': 'Incluido',
              'duration': 45,
              'description': 'Alta intensidad funcional'
            },
            {
              'name': 'Yoga',
              'price': 'Incluido',
              'duration': 60,
              'description': 'Yoga Vinyasa y restaurativo'
            },
            {
              'name': 'Spinning',
              'price': 'Incluido',
              'duration': 45,
              'description': 'Clases de bicicleta estatica'
            },
            {
              'name': 'Pilates',
              'price': 'Incluido',
              'duration': 50,
              'description': 'Core y flexibilidad'
            },
            {
              'name': 'Boxeo',
              'price': 'Incluido',
              'duration': 45,
              'description': 'Tecnica y cardio'
            }
          ]
        }
      ]
    },
    'classSchedule': {
      'schedule': [
        {
          'day': 'Lunes',
          'classes': [
            {
              'time': '07:00',
              'name': 'Crossfit',
              'instructor': 'Carlos',
              'duration': 45
            },
            {
              'time': '09:00',
              'name': 'Yoga',
              'instructor': 'Lucia',
              'duration': 60
            },
            {
              'time': '12:00',
              'name': 'Spinning',
              'instructor': 'Maria',
              'duration': 45
            },
            {
              'time': '18:00',
              'name': 'HIIT',
              'instructor': 'Carlos',
              'duration': 30
            },
            {
              'time': '19:30',
              'name': 'Pilates',
              'instructor': 'Lucia',
              'duration': 50
            }
          ]
        },
        {
          'day': 'Martes',
          'classes': [
            {
              'time': '07:00',
              'name': 'Funcional',
              'instructor': 'Pedro',
              'duration': 45
            },
            {
              'time': '09:00',
              'name': 'Yoga Principiantes',
              'instructor': 'Lucia',
              'duration': 60
            },
            {
              'time': '12:00',
              'name': 'Musculacion',
              'instructor': 'Carlos',
              'duration': 60
            },
            {
              'time': '18:00',
              'name': 'Boxeo',
              'instructor': 'Pedro',
              'duration': 45
            },
            {
              'time': '20:00',
              'name': 'Stretching',
              'instructor': 'Lucia',
              'duration': 45
            }
          ]
        },
        {
          'day': 'Miercoles',
          'classes': [
            {
              'time': '07:00',
              'name': 'Crossfit',
              'instructor': 'Carlos',
              'duration': 45
            },
            {
              'time': '09:00',
              'name': 'Yoga Vinyasa',
              'instructor': 'Lucia',
              'duration': 60
            },
            {
              'time': '12:00',
              'name': 'Spinning',
              'instructor': 'Maria',
              'duration': 45
            },
            {
              'time': '18:00',
              'name': 'TRX',
              'instructor': 'Pedro',
              'duration': 45
            },
            {
              'time': '19:30',
              'name': 'Yoga Restaurativo',
              'instructor': 'Lucia',
              'duration': 60
            }
          ]
        },
        {
          'day': 'Jueves',
          'classes': [
            {
              'time': '07:00',
              'name': 'Funcional',
              'instructor': 'Pedro',
              'duration': 45
            },
            {
              'time': '09:00',
              'name': 'Yoga Flow',
              'instructor': 'Lucia',
              'duration': 60
            },
            {
              'time': '12:00',
              'name': 'Musculacion',
              'instructor': 'Carlos',
              'duration': 60
            },
            {
              'time': '18:00',
              'name': 'HIIT',
              'instructor': 'Carlos',
              'duration': 30
            },
            {
              'time': '20:00',
              'name': 'Boxeo',
              'instructor': 'Pedro',
              'duration': 45
            }
          ]
        },
        {
          'day': 'Viernes',
          'classes': [
            {
              'time': '07:00',
              'name': 'Crossfit',
              'instructor': 'Carlos',
              'duration': 45
            },
            {
              'time': '09:00',
              'name': 'Yoga Principiantes',
              'instructor': 'Lucia',
              'duration': 60
            },
            {
              'time': '12:00',
              'name': 'Spinning',
              'instructor': 'Maria',
              'duration': 45
            },
            {
              'time': '18:00',
              'name': 'Funcional',
              'instructor': 'Pedro',
              'duration': 45
            }
          ]
        },
        {
          'day': 'Sabado',
          'classes': [
            {
              'time': '09:00',
              'name': 'Crossfit',
              'instructor': 'Carlos',
              'duration': 60
            },
            {
              'time': '11:00',
              'name': 'Yoga',
              'instructor': 'Lucia',
              'duration': 60
            }
          ]
        }
      ]
    },
    'membershipPlans': {
      'plans': [
        {
          'name': 'Basico',
          'price': '150.000',
          'period': 'mes',
          'description': 'Acceso a sala de pesas',
          'features': [
            'Sala de pesas',
            'Maquinas',
            'Vestuarios',
            'Agua'
          ],
          'popular': false
        },
        {
          'name': 'Clases Ilimitadas',
          'price': '220.000',
          'period': 'mes',
          'description': 'Acceso total a clases',
          'features': [
            'Sala de pesas',
            'Todas las clases',
            'Spinning',
            'Acceso 24/7',
            'App de workouts'
          ],
          'popular': true
        },
        {
          'name': 'Premium',
          'price': '380.000',
          'period': 'mes',
          'description': 'Todo incluido + trainer',
          'features': [
            'Plan Clases',
            '4 trainer/mes',
            'Plan nutricional',
            'Analisis corporal',
            'Sauna'
          ],
          'popular': false
        }
      ]
    },
    'galleryPage': {
      'title': 'Galeria',
      'subtitle': 'Conoce nuestras instalaciones y metodologia'
    },
    'teamPage': {
      'title': 'Nuestro Equipo'
    },
    'contactPage': {
      'title': 'Contacto'
    },
    'whyUs': {
      'title': 'Por que elegirnos?',
      'defaultItems': [
        'Equipamiento de ultima generacion',
        'Entrenadores certificados',
        'Clases ilimitadas incluidas',
        'Horarios flexibles'
      ]
    },
    'pricingPage': {
      'title': 'Membresias',
      'tiers': [
        {
          'key': 'basico',
          'name': 'BASICO',
          'price': null,
          'frequency': 'Facturacion mensual',
          'features': {
            'included': [
              'Acceso a sala de maquinas',
              '2 clases grupales por semana',
              'Area de vestuarios'
            ],
            'excluded': [
              'Toallas',
              'Acceso sauna'
            ]
          },
          'cta': 'ELEGIR BASICO'
        },
        {
          'key': 'pro',
          'name': 'PRO',
          'badge': 'MAS POPULAR',
          'price': null,
          'frequency': 'Facturacion mensual',
          'features': {
            'included': [
              'Acceso ilimitado a sala',
              'Clases ilimitadas',
              '1 sesion PT/mes',
              'Toallas incluidas'
            ],
            'excluded': [
              'Acceso sauna'
            ]
          },
          'cta': 'ELEGIR PRO',
          'highlighted': true
        },
        {
          'key': 'elite',
          'name': 'ELITE',
          'price': null,
          'frequency': 'Facturacion mensual',
          'features': {
            'included': [
              'Acceso 24/7',
              'Clases ilimitadas',
              '4 sesiones PT/mes',
              'Toallas y amenities',
              'Acceso sauna y vapor'
            ],
            'excluded': []
          },
          'cta': 'ELEGIR ELITE'
        }
      ],
      'dayPass': {
        'label': 'Pase Diario',
        'price': null
      }
    },
    'schedulePage': {
      'title': 'Horario de Clases',
      'filters': {
        'day': [
          'Lun',
          'Mar',
          'Mie',
          'Jue',
          'Vie',
          'Sab',
          'Dom'
        ],
        'classType': [
          'Todas',
          'Yoga',
          'HIIT',
          'Spinning',
          'Pilates',
          'Boxeo'
        ],
        'instructor': 'dynamic'
      },
      'statusLabels': {
        'available': 'Disponible',
        'full': 'Completo',
        'waitlist': 'Waitlist'
      }
    },
    'trainersPage': {
      'title': 'Nuestros Entrenadores',
      'memberTemplate': {
        'buttonText': 'Reservar Sesion'
      }
    },
    'faq': [
      {
        'q': 'Hay permanencia?',
        'a': 'Puedes cancelar en cualquier momento con 30 dias de anticipacion.'
      },
      {
        'q': 'Puedo congelar mi membresia?',
        'a': 'Si, puedes congelar hasta 2 meses al ano.'
      },
      {
        'q': 'Puedo ir con un invitado?',
        'a': 'Si, con nuestra politica de invitados puedes traer a un amigo.'
      }
    ],
    'ctaBanner': {
      'title': 'Empieza tu transformacion hoy',
      'buttonText': 'PRUEBA FREE'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Clases',
        'Planes',
        'Equipo',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera informacion sobre membresias en {{businessName}}',
      'trialMessage': 'Hola! Quisiera agendar mi prueba gratis en {{businessName}}'
    }
  },
  'spa': {
    'id': 'spa',
    'locale': 'es-PY',
    'hero': {
      'headline': 'Tu Santuario de Bienestar',
      'subheadline': 'Relajate, renueva y reconnectate en {{businessName}}',
      'ctaPrimary': 'Reservar Experiencia',
      'ctaSecondary': 'Ver Tratamientos'
    },
    'servicesPage': {
      'title': 'Tratamientos y Servicios',
      'categories': [
        {
          'key': 'masajes',
          'title': 'Masajes',
          'defaultServices': [
            {
              'name': 'Masaje Relajante',
              'price': '180.000 Gs',
              'duration': 60,
              'description': 'Masaje suave para relajacion profunda'
            },
            {
              'name': 'Masaje Terapeutico',
              'price': '220.000 Gs',
              'duration': 60,
              'description': 'Alivio muscular y tension'
            },
            {
              'name': 'Masaje Hot Stone',
              'price': '250.000 Gs',
              'duration': 75,
              'description': 'Piedras calientes para maxima relajacion'
            },
            {
              'name': 'Masaje de Parejas',
              'price': '350.000 Gs',
              'duration': 60,
              'description': 'Experiencia compartida en cabina privada'
            }
          ]
        },
        {
          'key': 'faciales',
          'title': 'Faciales',
          'defaultServices': [
            {
              'name': 'Limpieza Facial',
              'price': '150.000 Gs',
              'duration': 45,
              'description': 'Limpieza profunda e hidratacion'
            },
            {
              'name': 'Hydrafacial',
              'price': '280.000 Gs',
              'duration': 60,
              'description': 'Tecnologia avanzada de limpieza'
            },
            {
              'name': 'Anti-Aging',
              'price': '220.000 Gs',
              'duration': 60,
              'description': 'Tratamiento rejuvenecedor'
            }
          ]
        },
        {
          'key': 'corporales',
          'title': 'Corporales',
          'defaultServices': [
            {
              'name': 'Exfoliacion Corporal',
              'price': '120.000 Gs',
              'duration': 45,
              'description': 'Renueva y suaviza la piel'
            },
            {
              'name': 'Envoltura Corporal',
              'price': '180.000 Gs',
              'duration': 60,
              'description': 'Desintoxicacion con arcilla'
            },
            {
              'name': 'Aromaterapia',
              'price': '200.000 Gs',
              'duration': 75,
              'description': 'Relajacion con aceites esenciales'
            }
          ]
        }
      ]
    },
    'membershipPlans': {
      'plans': [
        {
          'name': 'Tratamiento Mensual',
          'price': '350.000',
          'period': 'mes',
          'description': '1 tratamiento mensual a elegir',
          'features': [
            '1 facial o corporal/mes',
            '15% descuento extras',
            'Vale de regalo'
          ],
          'popular': false
        },
        {
          'name': 'Relax Total',
          'price': '550.000',
          'period': 'mes',
          'description': '2 tratamientos mensuales',
          'features': [
            '2 tratamientos/mes',
            '20% descuento extras',
            'Sauna ilimitado',
            'Vale de regalo'
          ],
          'popular': true
        },
        {
          'name': 'Spa Premium',
          'price': '900.000',
          'period': 'mes',
          'description': 'Todo incluido',
          'features': [
            'Tratamientos ilimitados',
            'Sauna e hidromasaje',
            'Productos exclusivos',
            '4 vales/ano'
          ],
          'popular': false
        }
      ]
    },
    'galleryPage': {
      'title': 'Galeria',
      'subtitle': 'Nuestro espacio de relax y bienestar'
    },
    'teamPage': {
      'title': 'Nuestro Equipo'
    },
    'contactPage': {
      'title': 'Contacto'
    },
    'treatmentsPage': {
      'title': 'Menu de Tratamientos',
      'categories': [
        {
          'key': 'masajes',
          'title': 'Masajes Terapeuticos',
          'defaultServices': [
            {
              'name': 'Masaje Sueco',
              'duration': '60/90 min',
              'price': null,
              'description': 'Tecnica suave para relajacion profunda'
            },
            {
              'name': 'Masaje Deep Tissue',
              'duration': '60/90 min',
              'price': null,
              'description': 'Alivio muscular profundo'
            },
            {
              'name': 'Masaje Hot Stone',
              'duration': '75 min',
              'price': null,
              'description': 'Piedras calientes para tension'
            },
            {
              'name': 'Masaje de Parejas',
              'duration': '60 min',
              'price': null,
              'description': 'Experiencia compartida'
            }
          ]
        },
        {
          'key': 'faciales',
          'title': 'Tratamientos Faciales',
          'defaultServices': [
            {
              'name': 'Limpieza Facial',
              'duration': '45 min',
              'price': null,
              'description': 'Profunda limpieza e hidratacion'
            },
            {
              'name': 'Hydrafacial',
              'duration': '60 min',
              'price': null,
              'description': 'Tecnologia avanzada'
            },
            {
              'name': 'Anti-aging',
              'duration': '60 min',
              'price': null,
              'description': 'Reduce lineas de expresion'
            }
          ]
        },
        {
          'key': 'corporales',
          'title': 'Tratamientos Corporales',
          'defaultServices': [
            {
              'name': 'Exfoliacion Corporal',
              'duration': '45 min',
              'price': null,
              'description': 'Renueva y suaviza la piel'
            },
            {
              'name': 'Envoltura de Arcilla',
              'duration': '60 min',
              'price': null,
              'description': 'Desintoxicacion natural'
            },
            {
              'name': 'Aromaterapia',
              'duration': '75 min',
              'price': null,
              'description': 'Relajacion con aceites esenciales'
            }
          ]
        }
      ]
    },
    'packagesPage': {
      'title': 'Paquetes Especiales',
      'defaultPackages': [
        {
          'name': 'Dia de Spa Completo',
          'includes': [
            'Masaje Relajante 60 min',
            'Facial Hidratante 45 min',
            'Sauna 30 min',
            'Hidromasaje'
          ],
          'price': null,
          'savings': null
        },
        {
          'name': 'Experiencia Parejas',
          'includes': [
            '2 Masajes Relajantes',
            'Hidromasaje privado',
            'Te y frutas'
          ],
          'price': null,
          'savings': null
        },
        {
          'name': 'Regalo Perfecto',
          'includes': [
            'Vale personalizado',
            'Presentacion de regalo'
          ],
          'price': null,
          'savings': null
        }
      ],
      'giftVoucher': {
        'title': 'Vale de Regalo',
        'description': 'El regalo perfecto para alguien especial'
      }
    },
    'aboutPage': {
      'title': 'Nuestro Espacio',
      'storyPlaceholder': 'Descubre un refugio donde el tiempo se detiene. En {{businessName}} creamos experiencias de bienestar que renuevan cuerpo y alma.'
    },
    'faq': [
      {
        'q': 'Necesito reservar con anticipacion?',
        'a': 'Recomendamos reservar con al menos 24 horas de anticipacion, especialmente para fines de semana.'
      },
      {
        'q': 'Que debo traer?',
        'a': 'Solo traete a ti. Nosotros proporcionamos todo lo necesario: bata, sandalias, toallas.'
      }
    ],
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Tratamientos',
        'Paquetes',
        'Equipo',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera reservar una experiencia en {{businessName}}',
      'serviceMessage': 'Hola! Quisiera reservar {{serviceName}} en {{businessName}}'
    }
  },
  'barberia': {
    'id': 'barberia',
    'locale': 'es-PY',
    'hero': {
      'headline': '{{businessName}} - El Arte del Corte',
      'subheadline': 'Tradicion y maestria en cada detalle',
      'ctaPrimary': 'Reservar Cita',
      'ctaSecondary': 'Walk-In'
    },
    'servicesPage': {
      'title': 'Servicios',
      'categories': [
        {
          'key': 'cortes',
          'title': 'Cortes',
          'defaultServices': [
            {
              'name': 'Corte Clasico',
              'price': null,
              'duration': 30,
              'description': 'Tijera y peine, estilo terminado'
            },
            {
              'name': 'Corte Fade',
              'price': null,
              'duration': 35,
              'description': 'Skin fade, lineas de diseno'
            },
            {
              'name': 'Barberia Completa',
              'price': null,
              'duration': 45,
              'description': 'Corte + barba + toalla caliente'
            }
          ]
        },
        {
          'key': 'barba',
          'title': 'Barba y Afeitado',
          'defaultServices': [
            {
              'name': 'Arreglo de Barba',
              'price': null,
              'duration': 20,
              'description': 'Shape + line-up'
            },
            {
              'name': 'Hot Towel Shave',
              'price': null,
              'duration': 30,
              'description': 'Navaja tradicional con toalla caliente'
            },
            {
              'name': 'Corte + Barba',
              'price': null,
              'duration': 50,
              'description': 'Paquete completo'
            }
          ]
        }
      ]
    },
    'policy': {
      'title': 'Politica del Local',
      'items': [
        'Aceptamos walk-ins segun disponibilidad',
        'Reservaciones recomendadas para fines de semana',
        'Cancelaciones: 24h de anticipacion',
        'Llegar 5 min antes de tu hora'
      ]
    },
    'galleryPage': {
      'title': 'Nuestros Trabajos',
      'categories': [
        'Fades',
        'Clasico',
        'Barbas'
      ],
      'note': 'Fotos reales de nuestros clientes'
    },
    'teamPage': {
      'title': 'Nuestros Barberos',
      'memberTemplate': {
        'buttonText': 'Reservar con {{name}}'
      }
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera reservar un turno en {{businessName}}',
      'serviceMessage': 'Hola! Quisiera reservar {{serviceName}} en {{businessName}}'
    }
  },
  'unas': {
    'id': 'unas',
    'locale': 'es-PY',
    'hero': {
      'headline': 'Unas Perfectas en {{city}}',
      'subheadline': 'Diseno profesional, productos de calidad, higiene garantizada',
      'ctaPrimary': 'Reservar Cita',
      'ctaSecondary': 'Ver Galeria'
    },
    'servicesPage': {
      'title': 'Servicios y Precios',
      'categories': [
        {
          'key': 'manicure',
          'title': 'Manicure',
          'defaultServices': [
            {
              'name': 'Clasico',
              'price': null,
              'duration': 30,
              'description': 'Cuidado de cuticulas + esmalte'
            },
            {
              'name': 'Gel',
              'price': null,
              'duration': 45,
              'description': 'Esmalte gel duradero, sin chip'
            },
            {
              'name': 'Acrilico',
              'price': null,
              'duration': 60,
              'description': 'Extensiones acrilicas'
            },
            {
              'name': 'Shellac',
              'price': null,
              'duration': 40,
              'description': 'Brillo duradero'
            }
          ]
        },
        {
          'key': 'pedicure',
          'title': 'Pedicure',
          'defaultServices': [
            {
              'name': 'Spa Pedicure',
              'price': null,
              'duration': 50,
              'description': 'Exfoliacion + masaje + esmalte'
            },
            {
              'name': 'Gel Pedicure',
              'price': null,
              'duration': 55,
              'description': 'Esmalte gel en pies'
            },
            {
              'name': 'Medico',
              'price': null,
              'duration': 40,
              'description': 'Callosidades, cuidado del pie'
            }
          ]
        },
        {
          'key': 'nail_art',
          'title': 'Nail Art',
          'defaultServices': [
            {
              'name': 'Diseno Simple',
              'price': null,
              'description': 'French, puntos, basico'
            },
            {
              'name': 'Diseno Especial',
              'price': null,
              'description': 'Arte personalizado por una'
            },
            {
              'name': 'Chrome/Foil',
              'price': null,
              'description': 'Acabado metalico'
            },
            {
              'name': '3D Art',
              'price': null,
              'description': 'Elementos decorativos en relieve'
            }
          ]
        }
      ]
    },
    'galleryPage': {
      'title': 'Galeria de Disenos',
      'categories': [
        'Natural',
        'Gel',
        'Acrilico',
        'Nail Art',
        'Novia'
      ],
      'ctaText': 'Ver Todos los Disenos'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Equipo',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera agendar una cita en {{businessName}}',
      'serviceMessage': 'Hola! Quisiera reservar {{serviceName}} en {{businessName}}'
    }
  },
  'tatuajes': {
    'id': 'tatuajes',
    'locale': 'es-PY',
    'hero': {
      'headline': '{{businessName}} - Arte en Tu Piel',
      'subheadline': 'Tatuajes personalizados, higiene impecable',
      'ctaPrimary': 'Agendar Consulta',
      'ctaSecondary': 'Ver Portafolio'
    },
    'portfolioPage': {
      'title': 'Portafolio',
      'styleCategories': [
        'Tradicional',
        'Realismo',
        'Blackwork',
        'Japones',
        'Minimal'
      ],
      'filterLabels': {
        'style': 'Estilo',
        'artist': 'Artista',
        'bodyPart': 'Zona del cuerpo'
      }
    },
    'artistsPage': {
      'title': 'Nuestros Artistas',
      'memberTemplate': {
        'buttonText': 'Ver Trabajo de {{name}}',
        'availabilityLabel': 'Disponibilidad'
      }
    },
    'piercingSection': {
      'title': 'Piercings',
      'defaultServices': [
        {
          'name': 'Lobulo',
          'price': null
        },
        {
          'name': 'Cartilago',
          'price': null
        },
        {
          'name': 'Nariz',
          'price': null
        },
        {
          'name': 'Ombligo',
          'price': null
        },
        {
          'name': 'Industrial',
          'price': null
        }
      ]
    },
    'consultationForm': {
      'title': 'Agenda Tu Consulta',
      'fields': [
        {
          'name': 'fullName',
          'label': 'Nombre completo',
          'type': 'text',
          'required': true
        },
        {
          'name': 'phone',
          'label': 'Telefono',
          'type': 'tel',
          'required': true
        },
        {
          'name': 'email',
          'label': 'Email',
          'type': 'email',
          'required': false
        },
        {
          'name': 'tattooType',
          'label': 'Que tipo de tatuaje buscas?',
          'type': 'select',
          'options': [
            'Custom',
            'Tradicional',
            'Realismo',
            'Blackwork',
            'Japones',
            'Minimal',
            'Cover-up'
          ]
        },
        {
          'name': 'bodyLocation',
          'label': 'Donde quieres el tatuaje?',
          'type': 'text'
        },
        {
          'name': 'approximateSize',
          'label': 'Tamano aproximado?',
          'type': 'text'
        },
        {
          'name': 'referenceImage',
          'label': 'Tienes referencia de diseno?',
          'type': 'file'
        },
        {
          'name': 'description',
          'label': 'Descripcion de tu idea',
          'type': 'textarea'
        },
        {
          'name': 'isFirstTattoo',
          'label': 'Es tu primer tatuaje?',
          'type': 'select',
          'options': [
            'Si',
            'No'
          ]
        }
      ],
      'submitText': 'Enviar Consulta',
      'confirmationText': 'Te contactaremos en 24-48 horas para confirmar tu cita'
    },
    'aftercare': {
      'title': 'Cuidados Post-Tatuaje',
      'steps': [
        'Mantener el vendaje por 2-4 horas',
        'Lavar suavemente con jabon antibacterial',
        'Aplicar crema cicatrizante 3 veces al dia',
        'Evitar sol directo por 2 semanas',
        'No rascarse durante la cicatrizacion',
        'Evitar piscinas y playa por 2 semanas'
      ]
    },
    'faq': [
      {
        'q': 'Cuanto duele?',
        'a': 'El dolor varia segun la zona y tolerancia personal. Las zonas con mas hueso tienden a doler mas.'
      },
      {
        'q': 'Cuanto tarda en sanar?',
        'a': 'La cicatrizacion completa toma 2-4 semanas. Seguir los cuidados post-tatuaje es esencial.'
      },
      {
        'q': 'Hay limite de edad?',
        'a': 'Debes ser mayor de 18 anos. Menores con autorizacion de padres.'
      }
    ],
    'firstTimerCta': {
      'text': 'Primer tatuaje?',
      'linkText': 'Lee nuestra guia',
      'action': 'scrollTo:aftercare'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Portafolio',
        'Artistas',
        'Info',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera agendar una consulta para tatuaje en {{businessName}}'
    }
  },
  'estetica': {
    'id': 'estetica',
    'locale': 'es-PY',
    'hero': {
      'headline': '{{businessName}} - Belleza y Ciencia',
      'subheadline': 'Tratamientos avanzados con tecnologia de punta y resultados reales',
      'ctaPrimary': 'Reservar Consulta',
      'ctaSecondary': 'Ver Resultados'
    },
    'treatmentsPage': {
      'title': 'Tratamientos',
      'pricingNote': 'Precios varian segun evaluacion. Primera consulta sin cargo.',
      'categories': [
        {
          'key': 'faciales',
          'title': 'Tratamientos Faciales',
          'defaultServices': [
            {
              'name': 'Hydrafacial',
              'priceFrom': null,
              'description': 'Limpieza, hidratacion, luminosidad'
            },
            {
              'name': 'Microagujas',
              'priceFrom': null,
              'description': 'Estimula colageno, reduce cicatrices'
            },
            {
              'name': 'Luz Pulsada',
              'priceFrom': null,
              'description': 'Rejuvenecimiento, manchas'
            },
            {
              'name': 'Botox',
              'priceFrom': null,
              'description': 'Relaja lineas de expresion'
            }
          ]
        },
        {
          'key': 'corporales',
          'title': 'Tratamientos Corporales',
          'defaultServices': [
            {
              'name': 'Criolipolis',
              'priceFrom': null,
              'description': 'Eliminacion de grasa localizada'
            },
            {
              'name': 'Radiofrecuencia',
              'priceFrom': null,
              'description': 'Tensado de piel'
            },
            {
              'name': 'Drenaje Linfatico',
              'priceFrom': null,
              'description': 'Retencion de liquidos'
            }
          ]
        }
      ]
    },
    'resultsPage': {
      'title': 'Resultados Reales',
      'subtitle': 'Antes y Despues',
      'consentNote': 'Fotos con consentimiento del paciente'
    },
    'teamPage': {
      'title': 'Nuestro Equipo Medico',
      'credentialLabels': {
        'education': 'Formacion',
        'certifications': 'Certificaciones',
        'experience': 'Experiencia',
        'treatmentCount': 'Tratamientos realizados'
      },
      'memberTemplate': {
        'buttonText': 'Reservar con {{name}}'
      }
    },
    'faq': [
      {
        'q': 'La consulta tiene costo?',
        'a': 'No, la primera consulta es sin cargo. Evaluamos tu caso y te recomendamos el mejor tratamiento.'
      },
      {
        'q': 'Los tratamientos son dolorosos?',
        'a': 'La mayoria de los tratamientos son minima o nulamente dolorosos. Usamos tecnicas y productos para maximizar tu comodidad.'
      }
    ],
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Tratamientos',
        'Resultados',
        'Equipo',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera agendar una consulta en {{businessName}}',
      'serviceMessage': 'Hola! Quisiera consultar sobre {{serviceName}} en {{businessName}}'
    }
  },
  'diseno_grafico': {
    'id': 'diseno_grafico',
    'locale': 'es-PY',
    'hero': {
      'headline': 'Donde la Fantasia se Convierte en Realidad',
      'subheadline': 'Diseno de portadas y arte visual que da vida a tus historias',
      'ctaPrimary': 'Ver Catalogo',
      'ctaSecondary': 'Trabajemos Juntos'
    },
    'servicesPage': {
      'title': 'Servicios',
      'categories': [
        {
          'key': 'portadas_personalizadas',
          'title': 'Portadas Personalizadas',
          'description': 'Diseno unico y exclusivo para tu libro',
          'defaultServices': [
            {
              'name': 'Portada Personalizada - Ebook',
              'price': null,
              'description': 'Diseno exclusivo para tu ebook, incluye revisiones'
            },
            {
              'name': 'Portada Personalizada - Tapa Blanda',
              'price': null,
              'description': 'Portada completa (frente, lomo y contra) para impresion'
            },
            {
              'name': 'Portada Personalizada - Tapa Dura',
              'price': null,
              'description': 'Diseno premium con sobrecubierta y guardas'
            }
          ]
        },
        {
          'key': 'portadas_premade',
          'title': 'Portadas Pre-hechas',
          'description': 'Disenos listos para personalizar con tu titulo',
          'defaultServices': [
            {
              'name': 'Portada Premade - Ebook',
              'price': null,
              'description': 'Diseno listo, se personaliza con tu titulo y nombre'
            },
            {
              'name': 'Portada Premade - Pack Completo',
              'price': null,
              'description': 'Ebook + Tapa blanda, mismo diseno'
            }
          ]
        },
        {
          'key': 'mockups_3d',
          'title': 'Mockups y Videos 3D',
          'description': 'Visualizaciones profesionales de tu libro',
          'defaultServices': [
            {
              'name': 'Mockup 3D Estatico',
              'price': null,
              'description': 'Imagen realista de tu libro en 3D'
            },
            {
              'name': 'Video Mockup 3D',
              'price': null,
              'description': 'Animacion profesional de tu portada'
            }
          ]
        },
        {
          'key': 'branding',
          'title': 'Branding para Autores',
          'description': 'Identidad visual completa para tu marca como autor',
          'defaultServices': [
            {
              'name': 'Logo + Marca Personal',
              'price': null,
              'description': 'Logo, paleta de colores y tipografias'
            },
            {
              'name': 'Kit Redes Sociales',
              'price': null,
              'description': 'Templates para Instagram, Facebook y mas'
            }
          ]
        }
      ]
    },
    'productCatalogPage': {
      'title': 'Catalogo',
      'subtitle': 'Explora nuestros disenos disponibles',
      'orderButtonText': 'Consultar por WhatsApp',
      'orderMessageTemplate': 'Hola! Me interesa el diseno: {{productName}} (${{productPrice}}). Quisiera mas informacion.',
      'categories': [
        'Romance',
        'Fantasia',
        'Thriller',
        'No Ficcion',
        'Ciencia Ficcion',
        'Terror'
      ]
    },
    'galleryPage': {
      'title': 'Portafolio',
      'subtitle': 'Una muestra de nuestro trabajo'
    },
    'contactPage': {
      'title': 'Contacto'
    },
    'faq': [
      {
        'q': 'Cuanto tiempo toma una portada personalizada?',
        'a': 'El proceso completo toma entre 1 a 3 semanas, dependiendo de la complejidad del diseno y las revisiones.'
      },
      {
        'q': 'Que necesito para empezar?',
        'a': 'El titulo de tu libro, una sinopsis breve, el genero, y cualquier referencia visual que te guste. Cuanto mas detalle, mejor!'
      },
      {
        'q': 'Puedo pedir cambios al diseno?',
        'a': 'Si! Todas las portadas personalizadas incluyen rondas de revision para que quedes satisfecho/a con el resultado.'
      },
      {
        'q': 'Cual es la diferencia entre premade y personalizada?',
        'a': 'Las portadas premade son disenos ya creados que se personalizan con tu titulo. Las personalizadas se crean desde cero para tu libro.'
      },
      {
        'q': 'Hacen envios internacionales?',
        'a': 'Trabajamos de forma 100% digital. Recibis tus archivos por email, listos para publicar o imprimir.'
      }
    ],
    'ctaBanner': {
      'title': 'Listo para darle vida a tu historia?',
      'buttonText': 'Empecemos'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Servicios',
        'Catalogo',
        'Portafolio',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera consultar sobre servicios de diseno con {{businessName}}'
    }
  },
  'pestanas': {
    'id': 'pestanas',
    'locale': 'es-PY',
    'hero': {
      'headline': '{{businessName}} - Tu Mirada Perfecta en {{city}}',
      'subheadline': 'Extensiones de pestañas, microblading y diseño de cejas que realzan tu belleza natural',
      'ctaPrimary': 'Reservar Cita',
      'ctaSecondary': 'Ver Servicios'
    },
    'servicesPage': {
      'title': 'Servicios y Precios',
      'categories': [
        {
          'key': 'pestanas',
          'title': 'Pestañas',
          'description': 'Extensiones y tratamientos para una mirada irresistible',
          'defaultServices': [
            {
              'name': 'Extensiones Clasicas',
              'price': null,
              'duration': 120,
              'description': 'Pestañas pelo a pelo para un look natural y elegante'
            },
            {
              'name': 'Extensiones Volumen',
              'price': null,
              'duration': 150,
              'description': 'Mayor densidad con abanicos de 2-5 pestañas por pelo natural'
            },
            {
              'name': 'Extensiones Mega Volumen',
              'price': null,
              'duration': 180,
              'description': 'Maxima densidad y dramatismo para una mirada impactante'
            },
            {
              'name': 'Lifting de Pestañas',
              'price': null,
              'duration': 60,
              'description': 'Curvatura natural sin extensiones, incluye tinte'
            },
            {
              'name': 'Tinte de Pestañas',
              'price': null,
              'duration': 30,
              'description': 'Color intenso para pestañas mas definidas'
            }
          ]
        },
        {
          'key': 'cejas',
          'title': 'Cejas',
          'description': 'Diseño y cuidado profesional para enmarcar tu mirada',
          'defaultServices': [
            {
              'name': 'Diseño de Cejas',
              'price': null,
              'duration': 30,
              'description': 'Diseño personalizado segun la forma de tu rostro'
            },
            {
              'name': 'Depilacion con Hilo',
              'price': null,
              'duration': 20,
              'description': 'Tecnica precisa y delicada para una forma perfecta'
            },
            {
              'name': 'Microblading',
              'priceFrom': null,
              'duration': 120,
              'description': 'Micropigmentacion pelo a pelo para cejas naturales y definidas'
            },
            {
              'name': 'Laminado de Cejas',
              'price': null,
              'duration': 45,
              'description': 'Cejas peinadas y fijadas con efecto laminado'
            },
            {
              'name': 'Tinte de Cejas',
              'price': null,
              'duration': 20,
              'description': 'Color y definicion para cejas mas expresivas'
            }
          ]
        }
      ]
    },
    'galleryPage': {
      'title': 'Nuestro Trabajo',
      'subtitle': 'Transformaciones que hablan por si solas',
      'categories': [
        'Pestañas',
        'Cejas',
        'Microblading'
      ],
      'ctaText': 'Ver Galeria Completa'
    },
    'contactPage': {
      'title': 'Contacto',
      'locationTitle': 'Visitanos en {{neighborhood}}',
      'formFields': [
        'name',
        'phone',
        'service',
        'preferredDate',
        'message'
      ],
      'formSubmitText': 'Enviar Consulta'
    },
    'faq': [
      {
        'q': 'Cuanto duran las extensiones de pestañas?',
        'a': 'Las extensiones duran entre 3 y 4 semanas. Recomendamos retoques cada 2-3 semanas para mantenerlas perfectas.'
      },
      {
        'q': 'Que cuidados debo tener despues de colocarme extensiones?',
        'a': 'Evita mojarlas las primeras 24 horas, no uses productos oleosos cerca de los ojos y peinadas con el cepillito todos los dias.'
      },
      {
        'q': 'Cuanto tiempo tarda en sanar el microblading?',
        'a': 'El proceso de cicatrizacion completo toma entre 4 y 6 semanas. Los primeros dias el color se vera mas intenso y luego se suavizara.'
      },
      {
        'q': 'Las extensiones dañan mis pestañas naturales?',
        'a': 'No, cuando son aplicadas correctamente por una profesional, las extensiones no dañan las pestañas naturales.'
      },
      {
        'q': 'Cada cuanto debo hacer retoque de microblading?',
        'a': 'Se recomienda un retoque entre 4 y 6 semanas despues de la primera sesion, y luego un mantenimiento anual.'
      }
    ],
    'ctaBanner': {
      'title': 'Lista para realzar tu mirada?',
      'buttonText': 'Reservar Ahora'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Servicios',
        'Galeria',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera agendar una cita en {{businessName}}',
      'serviceMessage': 'Hola! Quisiera reservar {{serviceName}} en {{businessName}}'
    },
    'seo': {
      'altTextTemplates': {
        'service': '{{serviceName}} en {{businessName}}, {{city}}',
        'portfolio': 'Resultado de {{serviceName}} por {{businessName}}',
        'team': '{{memberName}} - {{memberTitle}} en {{businessName}}'
      }
    }
  },
  'depilacion': {
    'id': 'depilacion',
    'locale': 'es-PY',
    'hero': {
      'headline': '{{businessName}} - Depilacion Laser Definitiva',
      'subheadline': 'Tecnologia de ultima generacion, resultados permanentes',
      'ctaPrimary': 'Consulta Sin Cargo',
      'ctaSecondary': 'Ver Tratamientos'
    },
    'treatmentsPage': {
      'title': 'Tratamientos y Precios',
      'areas': [
        {
          'name': 'Bozo',
          'pricePerSession': null
        },
        {
          'name': 'Axilas',
          'pricePerSession': null
        },
        {
          'name': 'Ingles',
          'pricePerSession': null
        },
        {
          'name': 'Ingles Completas',
          'pricePerSession': null
        },
        {
          'name': 'Piernas Completas',
          'pricePerSession': null
        },
        {
          'name': 'Cuerpo Completo',
          'pricePerSession': null
        }
      ],
      'packages': [
        {
          'sessions': 6,
          'discount': 20,
          'label': '6 sesiones - 20% descuento'
        },
        {
          'sessions': 8,
          'discount': 30,
          'label': '8 sesiones - 30% descuento'
        },
        {
          'sessions': 10,
          'discount': 40,
          'label': '10 sesiones - 40% descuento'
        }
      ],
      'waxingSection': {
        'title': 'Depilacion con Cera',
        'note': 'Cera tibia profesional. Depilacion masculina disponible.'
      }
    },
    'technologyPage': {
      'title': 'Nuestra Tecnologia',
      'highlights': [
        {
          'icon': 'shield',
          'label': 'FDA Approved',
          'description': 'Equipo certificado internacionalmente'
        },
        {
          'icon': 'dna',
          'label': 'Alexandrite + Nd:YAG',
          'description': 'Doble longitud de onda'
        },
        {
          'icon': 'zap',
          'label': 'Rapido y casi indoloro',
          'description': 'Sesiones cortas y comodas'
        },
        {
          'icon': 'leaf',
          'label': 'Para todo tipo de piel',
          'description': 'Tecnologia adaptativa'
        }
      ],
      'howItWorks': {
        'title': 'Como funciona?',
        'facts': [
          'Sesiones: 6-8 para resultados optimos',
          'Intervalo: 4-6 semanas entre sesiones',
          'Compatible: todo tipo de piel',
          'Resultados: hasta 90% reduccion permanente'
        ]
      }
    },
    'faq': [
      {
        'q': 'Cuantas sesiones necesito?',
        'a': 'En promedio 6-8 sesiones para resultados optimos, dependiendo de la zona y tipo de piel.'
      },
      {
        'q': 'Es doloroso?',
        'a': 'Con nuestra tecnologia, la sensacion es minima. La mayoria de los pacientes lo describen como un pequeno pellizco.'
      },
      {
        'q': 'Funciona en piel oscura?',
        'a': 'Si, nuestra tecnologia Nd:YAG es segura y efectiva para todos los tipos de piel.'
      }
    ],
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Inicio',
        'Tratamientos',
        'Tecnologia',
        'Resultados',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}}. Todos los derechos reservados.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Quisiera agendar una consulta gratis de depilacion laser en {{businessName}}'
    }
  },
  'meal_prep': {
    'id': 'meal_prep',
    'locale': 'es-PY',
    'hero': {
      'headline': 'Convertimos el caos del mercado en comida lista',
      'subheadline': 'Compras, prep y freezer meals puerta a puerta en {{city}}. Whole-animal, mayorista, sin conservantes.',
      'ctaPrimary': 'Calcula tu ahorro',
      'ctaSecondary': 'Pedir por WhatsApp'
    },
    'servicesPage': {
      'title': 'Nuestros Niveles de Servicio',
      'subtitle': 'Elegi lo que se adapta a tu semana. Precios referenciales, ajustables segun tu hogar.',
      'categories': [
        {
          'key': 'compras',
          'title': 'Nivel 1 - Compra por Lista (Raw)',
          'description': 'Vos nos mandas la lista, nosotros traemos los ingredientes enteros desde Abasto y mercado. Vos cocinas.',
          'defaultServices': [
            {
              'name': 'Basico',
              'price': '250.000 Gs/semana',
              'duration': 120,
              'description': 'Lista corta, 1 proveedor. Hasta 15 productos. Delivery incluido.'
            },
            {
              'name': 'Completo',
              'price': '400.000 Gs/semana',
              'duration': 180,
              'description': 'Lista completa + Abasto + mercado + almacen. Delivery y organizado en cocina.'
            }
          ]
        },
        {
          'key': 'prep',
          'title': 'Nivel 2 - Mise-en-Place Semanal (mas elegido)',
          'description': 'Compramos, lavamos, porcionamos y organizamos tu heladera y freezer. Listo para cocinar en minutos.',
          'defaultServices': [
            {
              'name': 'Individual (1 persona)',
              'price': '400.000 Gs/semana',
              'duration': 240,
              'description': 'Prep basico. Proteina + carbos + vegetales porcionados y sellados al vacio.'
            },
            {
              'name': 'Pareja (2 personas)',
              'price': '650.000 Gs/semana',
              'duration': 300,
              'description': 'Prep completo para 2. Organizacion de heladera y freezer.'
            },
            {
              'name': 'Familia (3-4 personas)',
              'price': '900.000 Gs/semana',
              'duration': 360,
              'description': 'Prep familiar. Variedad, porciones y sustituciones incluidas.'
            }
          ]
        },
        {
          'key': 'cocinado',
          'title': 'Nivel 3 - Comidas Listas (proximamente)',
          'description': 'Comidas completas selladas al vacio, listas para recalentar. Requiere habilitacion INAN en curso.',
          'defaultServices': [
            {
              'name': '10 comidas/semana',
              'priceFrom': '1.200.000 Gs/semana',
              'duration': 480,
              'description': '5 almuerzos + 5 cenas para 1 persona. Variedad rotativa.'
            },
            {
              'name': '15 comidas/semana',
              'priceFrom': '1.700.000 Gs/semana',
              'duration': 540,
              'description': 'Pack familiar. 3 comidas/dia durante 5 dias laborables.'
            }
          ]
        },
        {
          'key': 'add-on',
          'title': 'Add-ons opcionales',
          'description': 'Sumables a cualquier nivel.',
          'defaultServices': [
            {
              'name': 'Desayunos',
              'price': '+400.000 Gs/mes',
              'description': 'Desayunos listos para la semana.'
            },
            {
              'name': 'Postres',
              'price': '+200.000 Gs/mes',
              'description': 'Postres caseros sumados al pack.'
            },
            {
              'name': 'Bebidas / snacks',
              'price': '+300.000 Gs/mes',
              'description': 'Bebidas y snacks saludables.'
            }
          ]
        }
      ]
    },
    'teamPage': {
      'title': 'Quien esta detras',
      'memberTemplate': {
        'buttonText': 'Escribile a {{name}}'
      }
    },
    'galleryPage': {
      'title': 'Cortes y calidad',
      'subtitle': 'Whole-animal, mayorista, lo mejor del mercado.',
      'categories': [
        'Cortes de Carne',
        'Mise en Place',
        'Freezer Meals',
        'Mercado'
      ],
      'ctaText': 'Ver mas'
    },
    'contactPage': {
      'title': 'Pedinos tu propuesta',
      'locationTitle': 'Cobertura en {{city}}',
      'formFields': [
        'name',
        'phone',
        'plan',
        'message'
      ],
      'formSubmitText': 'Enviar Consulta'
    },
    'faq': [
      {
        'q': 'Que incluye el servicio?',
        'a': 'Incluye: compras en Abasto + mercado, prep (lavado, cortado, porcionado), sellado al vacio, 2 entregas por mes puerta a puerta con cadena de frio, sustituciones hasta 3 menus por mes, precio fijo 6 meses y pausa de vacaciones. No incluye desayunos, bebidas ni postres (disponibles como add-on).'
      },
      {
        'q': 'Como son las entregas?',
        'a': 'Compramos martes y jueves. Entregamos el mismo dia, puerta a puerta, con cadena de frio. Coordinamos horario por WhatsApp.'
      },
      {
        'q': 'Puedo pausar el servicio?',
        'a': 'Si. Tenes 1 mes por ano de pausa sin costo (vacaciones, viajes, etc). Avisanos con 48 hrs.'
      },
      {
        'q': 'Que pasa si no me gusta una comida?',
        'a': 'Garantia de satisfaccion: si algo sale mal, lo reemplazamos sin cargo en la proxima entrega.'
      },
      {
        'q': 'En que casos NO me conviene?',
        'a': 'Honestidad total: si te encanta cocinar, si tu gasto actual es menor a Gs. 2M/mes para 3 personas, o si no tenes freezer. Mejor no te suscribas.'
      },
      {
        'q': 'Como pago?',
        'a': 'Transferencia bancaria o efectivo. Sin compromiso en el primer mes. Precio fijo 6 meses al suscribirte.'
      },
      {
        'q': 'Atienden fuera de San Lorenzo?',
        'a': 'Por ahora solo San Lorenzo (ciudad completa). Proximamente Asuncion centro.'
      },
      {
        'q': 'Tienen habilitacion INAN?',
        'a': 'Nivel 1 y Nivel 2 no requieren habilitacion especial (solo compra y prep). Nivel 3 (comidas cocidas listas) esta en proceso de habilitacion INAN.'
      }
    ],
    'ctaBanner': {
      'title': 'Pedi tu propuesta en 5 min por WhatsApp',
      'buttonText': 'Escribir ahora'
    },
    'footer': {
      'columns': [
        'about',
        'quickLinks',
        'contact',
        'social'
      ],
      'quickLinks': [
        'Servicios',
        'Calculadora',
        'Galeria',
        'FAQ',
        'Contacto'
      ],
      'copyright': '{{year}} {{businessName}} - San Lorenzo, Paraguay.'
    },
    'whatsapp': {
      'defaultMessage': 'Hola! Vi el sitio de {{businessName}} y quiero saber mas sobre Nivel 2 (mise-en-place).',
      'serviceMessage': 'Hola! Me interesa {{serviceName}} de {{businessName}}. Podemos conversar?'
    },
    'savingsCalculator': {
      'title': 'Calcula tu ahorro real',
      'subtitle': 'Numeros honestos. Si no te conviene, te lo decimos.',
      'inputs': {
        'groceriesLabel': 'Super + carniceria + feria (mes)',
        'deliveryLabel': 'Delivery + comer afuera (mes)',
        'wasteLabel': 'Comida tirada + compras impulsivas (mes)',
        'utilitiesLabel': 'Gas/luz extra cocinando (mes)',
        'householdLabel': 'Personas en el hogar',
        'hourlyValueLabel': 'Valor de tu hora en Gs.',
        'hoursPerMonthLabel': 'Horas por mes cocinando + comprando',
        'tierLabel': 'Nivel a comparar'
      },
      'tierOptions': [
        {
          'key': 'nivel1_completo',
          'label': 'Nivel 1 Completo (1.600.000 Gs/mes)',
          'monthlyGs': 1600000
        },
        {
          'key': 'nivel2_individual',
          'label': 'Nivel 2 Individual (1.600.000 Gs/mes)',
          'monthlyGs': 1600000
        },
        {
          'key': 'nivel2_pareja',
          'label': 'Nivel 2 Pareja (2.600.000 Gs/mes)',
          'monthlyGs': 2600000
        },
        {
          'key': 'nivel2_familia',
          'label': 'Nivel 2 Familia (3.600.000 Gs/mes)',
          'monthlyGs': 3600000
        }
      ],
      'outputs': {
        'cashTotalLabel': 'Plata real hoy',
        'timeValueLabel': 'Valor de tu tiempo hoy',
        'totalTodayLabel': 'Costo TOTAL hoy',
        'ourServiceLabel': 'Nuestro servicio (mes)',
        'savingsLabel': 'Ahorro mensual estimado',
        'hoursRecoveredLabel': 'Horas recuperadas por mes',
        'negativeCopy': 'Hoy ya sos muy eficiente. Probablemente no te conviene - pero si queres probar 1 mes sin compromiso, escribinos igual.',
        'positiveCopy': 'Si tu ahorro es grande, tiene sentido probar 1 mes sin compromiso.',
        'ctaText': 'Seguir por WhatsApp con mis numeros'
      },
      'disclaimer': 'Estimacion referencial. Precios finales se ajustan segun tu hogar y nivel de servicio.'
    },
    'howItWorks': {
      'title': 'Como funciona',
      'steps': [
        {
          'num': '01',
          'title': 'Conversamos',
          'desc': '10 min por WhatsApp. Armamos tu plan segun presupuesto, personas y dias que queres recibir.'
        },
        {
          'num': '02',
          'title': 'Planeamos tu semana',
          'desc': 'Menu base, sustituciones, proveedores, horarios de compra y entrega.'
        },
        {
          'num': '03',
          'title': 'Compramos y prepeamos',
          'desc': 'Martes y jueves en Abasto y mercado. Prep en cocina certificada. Sellado al vacio.'
        },
        {
          'num': '04',
          'title': 'Entregamos',
          'desc': 'Puerta a puerta, con cadena de frio. Organizamos tu heladera y freezer si lo pedis.'
        }
      ]
    },
    'qualitySourcing': {
      'title': 'Como compramos',
      'pillars': [
        {
          'title': 'Whole-animal',
          'desc': 'Animales enteros, cortados y porcionados por nosotros. Mejor calidad, mejor precio por kilo.'
        },
        {
          'title': 'Mayorista Abasto',
          'desc': 'Proveedores directos, sin intermediarios. Precios de mercado mayorista trasladados al cliente.'
        },
        {
          'title': 'Estacional',
          'desc': 'Respetamos el calendario de Paraguay. Compramos lo que esta en temporada, mas barato y mas rico.'
        },
        {
          'title': 'Sin conservantes',
          'desc': 'Congelamos al instante despues del prep. Nunca usamos aditivos ni conservantes.'
        }
      ]
    },
    'seo': {
      'altTextTemplates': {
        'service': '{{serviceName}} en {{businessName}}, {{city}}',
        'portfolio': '{{serviceName}} de {{businessName}} - Paraguay',
        'team': '{{memberName}} - {{memberTitle}} en {{businessName}}'
      }
    }
  }
}

export function getRegistry(type: string): unknown | null {
  return REGISTRY_MAP[type] || null
}

export function getContent(type: string): unknown | null {
  return CONTENT_MAP[type] || null
}
