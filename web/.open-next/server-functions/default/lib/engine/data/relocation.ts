/**
 * Relocation Data — Tax brackets, cost of living, timelines, neighborhoods
 *
 * Used by Nexa Paraguay calculators:
 * - Tax Savings Calculator (personal income)
 * - Cost of Living Estimator
 * - Timeline Estimator
 * - Residency Qualifier
 * - ROI Calculator
 * - Comparison Tool
 */

export const relocationData = {
  tax: {
    nl: {
      name: { es: 'Países Bajos', en: 'Netherlands', nl: 'Nederland', de: 'Niederlande' },
      currency: 'EUR',
      brackets: [
        { min: 0, max: 36999, rate: 36.97 },
        { min: 36999, max: 75993, rate: 37.47 },
        { min: 75993, max: 124999, rate: 49.5 },
        { min: 124999, max: 239999, rate: 51.95 },
        { min: 239999, max: Infinity, rate: 49.5 },
      ],
      notes: 'Progressive with standard deduction. Box 3 (savings) at ~36% deemed return.',
    },
    de: {
      name: { es: 'Alemania', en: 'Germany', nl: 'Duitsland', de: 'Deutschland' },
      currency: 'EUR',
      brackets: [
        { min: 0, max: 11604, rate: 0 },
        { min: 11604, max: 17005, rate: 14 },
        { min: 17005, max: 66760, rate: 24 },
        { min: 66760, max: 277825, rate: 42 },
        { min: 277825, max: Infinity, rate: 45 },
      ],
      notes: 'Plus 5.5% solidarity surcharge on income tax. Capital gains at 25%.',
    },
    be: {
      name: { es: 'Bélgica', en: 'Belgium', nl: 'België', de: 'Belgien' },
      currency: 'EUR',
      brackets: [
        { min: 0, max: 15470, rate: 25 },
        { min: 15470, max: 29070, rate: 40 },
        { min: 29070, max: 55460, rate: 45 },
        { min: 55460, max: Infinity, rate: 50 },
      ],
      notes: 'Municipal + provincial supplements add 2-10%.',
    },
    at: {
      name: { es: 'Austria', en: 'Austria', nl: 'Oostenrijk', de: 'Österreich' },
      currency: 'EUR',
      brackets: [
        { min: 0, max: 11693, rate: 0 },
        { min: 11693, max: 19134, rate: 20 },
        { min: 19134, max: 32075, rate: 30 },
        { min: 32075, max: 62110, rate: 40 },
        { min: 62110, max: 93120, rate: 48 },
        { min: 93120, max: Infinity, rate: 50 },
      ],
      notes: 'Plus 5.5% solidarity surcharge above certain threshold.',
    },
    es: {
      name: { es: 'España', en: 'Spain', nl: 'Spanje', de: 'Spanien' },
      currency: 'EUR',
      brackets: [
        { min: 0, max: 12450, rate: 19 },
        { min: 12450, max: 20200, rate: 24 },
        { min: 20200, max: 35200, rate: 30 },
        { min: 35200, max: 60000, rate: 37 },
        { min: 60000, max: 300000, rate: 45 },
        { min: 300000, max: Infinity, rate: 47 },
      ],
      notes: 'Autonomous communities add 0-13.5%. NHR terminated in 2024.',
    },
    py: {
      name: { es: 'Paraguay', en: 'Paraguay', nl: 'Paraguay', de: 'Paraguay' },
      currency: 'USD',
      brackets: [
        { min: 0, max: 7434, rate: 0 },
        { min: 7434, max: 11285, rate: 8 },
        { min: 11285, max: 17902, rate: 10 },
        { min: 17902, max: Infinity, rate: 10 },
      ],
      notes: 'Territorial system: 0% on foreign-sourced income. Only local income taxed.',
    },
  },

  costOfLiving: {
    Asunción: {
      neighborhoods: [
        {
          id: 'villa-morra',
          name: { es: 'Villa Morra', en: 'Villa Morra' },
          description: { es: 'Zona premium, embajadas, restaurantes finos', en: 'Premium zone, embassies, fine dining' },
          rent2br: { min: 800, max: 1500, avg: 1100 },
          rent3br: { min: 1200, max: 2500, avg: 1800 },
          safety: 9,
          familyScore: 9,
        },
        {
          id: 'carmelitas',
          name: { es: 'Carmelitas', en: 'Carmelitas' },
          description: { es: 'Moderno, malls, vida nocturna', en: 'Modern, malls, nightlife' },
          rent2br: { min: 600, max: 1200, avg: 850 },
          rent3br: { min: 900, max: 1800, avg: 1300 },
          safety: 8,
          familyScore: 7,
        },
        {
          id: 'recoleta',
          name: { es: 'Recoleta', en: 'Recoleta' },
          description: { es: 'Residencial, tranquilo, cerca centro', en: 'Residential, quiet, near center' },
          rent2br: { min: 500, max: 900, avg: 700 },
          rent3br: { min: 700, max: 1400, avg: 1000 },
          safety: 8,
          familyScore: 8,
        },
        {
          id: 'las-mercedes',
          name: { es: 'Las Mercedes', en: 'Las Mercedes' },
          description: { es: 'Exclusivo, casas, zonas verdes', en: 'Exclusive, houses, green areas' },
          rent2br: { min: 1000, max: 2000, avg: 1500 },
          rent3br: { min: 1500, max: 3500, avg: 2500 },
          safety: 9,
          familyScore: 9,
        },
        {
          id: 'maria-auxiliadora',
          name: { es: 'María Auxiliadora', en: 'María Auxiliadora' },
          description: { es: 'Tradicional, familiar, económico', en: 'Traditional, family-friendly, affordable' },
          rent2br: { min: 350, max: 600, avg: 450 },
          rent3br: { min: 500, max: 900, avg: 650 },
          safety: 7,
          familyScore: 7,
        },
        {
          id: 'manuel-guerreño',
          name: { es: 'Manuel Güeñu', en: 'Manuel Güeñu' },
          description: { es: 'Nuevo desarrollo, moderno', en: 'New development, modern' },
          rent2br: { min: 450, max: 800, avg: 600 },
          rent3br: { min: 650, max: 1200, avg: 900 },
          safety: 7,
          familyScore: 8,
        },
      ],
      schools: [
        {
          id: 'american',
          name: 'American School of Asunción',
          type: 'international',
          annualFee: { min: 12000, max: 25000 },
          grades: 'K-12',
        },
        {
          id: 'british',
          name: 'British School Asunción',
          type: 'international',
          annualFee: { min: 10000, max: 22000 },
          grades: 'K-12',
        },
        {
          id: 'european',
          name: 'Colegio Europeo',
          type: 'international',
          annualFee: { min: 8000, max: 18000 },
          grades: 'K-12',
        },
        {
          id: 'panamerican',
          name: 'Panamerican School',
          type: 'bilingual',
          annualFee: { min: 5000, max: 12000 },
          grades: 'K-12',
        },
        {
          id: 'public',
          name: 'Public Schools',
          type: 'public',
          annualFee: { min: 0, max: 500 },
          grades: 'K-12',
        },
      ],
      monthlyBudget: {
        single: {
          budget: { min: 1200, max: 2000, avg: 1600 },
          breakdown: {
            rent: 40,
            utilities: 8,
            food: 20,
            transport: 10,
            dining: 10,
            misc: 12,
          },
        },
        couple: {
          budget: { min: 1800, max: 3000, avg: 2400 },
          breakdown: {
            rent: 35,
            utilities: 6,
            food: 18,
            transport: 8,
            dining: 8,
            misc: 15,
          },
        },
        family2: {
          budget: { min: 2500, max: 4000, avg: 3200 },
          breakdown: {
            rent: 35,
            utilities: 5,
            food: 18,
            transport: 6,
            dining: 6,
            education: 12,
            misc: 13,
          },
        },
        family3: {
          budget: { min: 3200, max: 5000, avg: 4000 },
          breakdown: {
            rent: 33,
            utilities: 4,
            food: 17,
            transport: 5,
            dining: 5,
            education: 16,
            misc: 15,
          },
        },
      },
      comparison: {
        amsterdam: { multiplier: 2.8 },
        berlin: { multiplier: 2.2 },
        rotterdam: { multiplier: 2.4 },
        brussels: { multiplier: 2.1 },
        vienna: { multiplier: 1.9 },
        madrid: { multiplier: 1.8 },
      },
    },
  },

  timeline: {
    temporary: {
      minWeeks: 8,
      maxWeeks: 16,
      steps: [
        { name: { es: 'Preparación documental', en: 'Document preparation' }, weeks: 2 },
        { name: { es: 'Cita en inmigración', en: 'Immigration appointment' }, weeks: 2 },
        { name: { es: 'Tramitación', en: 'Processing' }, weeks: 4 },
        { name: { es: 'Emisión de residencias', en: 'Residency issuance' }, weeks: 2 },
      ],
    },
    permanent: {
      minWeeks: 6,
      maxWeeks: 12,
      steps: [
        { name: { es: 'Preparación documental', en: 'Document preparation' }, weeks: 1 },
        { name: { es: 'Cita en inmigración', en: 'Immigration appointment' }, weeks: 1 },
        { name: { es: 'Tramitación', en: 'Processing' }, weeks: 4 },
        { name: { es: 'Emisión de residencias', en: 'Residency issuance' }, weeks: 2 },
      ],
    },
    suace: {
      minWeeks: 10,
      maxWeeks: 20,
      steps: [
        { name: { es: 'Preparación documental', en: 'Document preparation' }, weeks: 2 },
        { name: { es: 'Inversión en proyecto', en: 'Investment in project' }, weeks: 2 },
        { name: { es: 'Tramitación SUACE', en: 'SUACE processing' }, weeks: 6 },
        { name: { es: 'Emisión de residencia', en: 'Residency issuance' }, weeks: 4 },
      ],
    },
  },

  comparison: {
    destinations: [
      {
        id: 'paraguay',
        name: { es: 'Paraguay', en: 'Paraguay', de: 'Paraguay' },
        taxRatePersonal: 10,
        taxRateCorporate: 10,
        daysRequired: 0,
        minInvestment: 0,
        workPermit: 'Automatic with residency',
        pathToCitizenship: '3 years',
        costOfLivingIndex: 45,
        safetyIndex: 8,
      },
      {
        id: 'portugal',
        name: { es: 'Portugal', en: 'Portugal', de: 'Portugal' },
        taxRatePersonal: 48,
        taxRateCorporate: 21,
        daysRequired: 183,
        minInvestment: 500000,
        workPermit: 'Golden visa (suspended)',
        pathToCitizenship: '5 years',
        costOfLivingIndex: 75,
        safetyIndex: 8,
      },
      {
        id: 'dubai',
        name: { es: 'EAU / Dubái', en: 'UAE / Dubai', de: 'VAE / Dubai' },
        taxRatePersonal: 0,
        taxRateCorporate: 9,
        daysRequired: 90,
        minInvestment: 200000,
        workPermit: 'Freelance visa',
        pathToCitizenship: '10 years',
        costOfLivingIndex: 80,
        safetyIndex: 9,
      },
      {
        id: 'georgia',
        name: { es: 'Georgia', en: 'Georgia', de: 'Georgien' },
        taxRatePersonal: 1,
        taxRateCorporate: 1,
        daysRequired: 180,
        minInvestment: 100000,
        workPermit: 'Self-employment register',
        pathToCitizenship: '10 years',
        costOfLivingIndex: 40,
        safetyIndex: 8,
      },
      {
        id: 'panama',
        name: { es: 'Panamá', en: 'Panama', de: 'Panama' },
        taxRatePersonal: 0,
        taxRateCorporate: 25,
        daysRequired: 0,
        minInvestment: 300000,
        workPermit: 'Friendly Nations visa',
        pathToCitizenship: '5 years',
        costOfLivingIndex: 60,
        safetyIndex: 7,
      },
    ],
  },

  qualifier: {
    questions: [
      {
        id: 'goal',
        question: { es: '¿Cuál es su objetivo principal?', en: 'What is your primary goal?' },
        type: 'select',
        options: [
          { value: 'tax', label: { es: 'Reducir carga fiscal', en: 'Reduce tax burden' }, weight: 25 },
          { value: 'lifestyle', label: { es: 'Mejor calidad de vida', en: 'Better quality of life' }, weight: 20 },
          { value: 'business', label: { es: 'Iniciar negocio', en: 'Start a business' }, weight: 20 },
          { value: 'investment', label: { es: 'Invertir en bienes raíces', en: 'Invest in real estate' }, weight: 20 },
          { value: 'retirement', label: { es: 'Jubilación', en: 'Retirement' }, weight: 15 },
        ],
      },
      {
        id: 'budget',
        question: { es: '¿Cuál es su presupuesto disponible?', en: 'What is your available budget?' },
        type: 'select',
        options: [
          { value: '50k', label: { es: 'Menos de $50,000', en: 'Under $50,000' }, weight: 5 },
          { value: '50-150k', label: { es: '$50,000 - $150,000', en: '$50,000 - $150,000' }, weight: 15 },
          { value: '150-500k', label: { es: '$150,000 - $500,000', en: '$150,000 - $500,000' }, weight: 25 },
          { value: '500k+', label: { es: 'Más de $500,000', en: 'Over $500,000' }, weight: 25 },
        ],
      },
      {
        id: 'timeline',
        question: { es: '¿Cuándo desea mudarse?', en: 'When do you want to relocate?' },
        type: 'select',
        options: [
          { value: 'immediate', label: { es: 'Inmediatamente', en: 'Immediately' }, weight: 20 },
          { value: '6months', label: { es: 'En 6 meses', en: 'Within 6 months' }, weight: 20 },
          { value: '1year', label: { es: 'En 1 año', en: 'Within 1 year' }, weight: 15 },
          { value: 'exploring', label: { es: 'Solo explorando', en: 'Just exploring' }, weight: 5 },
        ],
      },
      {
        id: 'businessInterest',
        question: { es: '¿Está interesado en operar un negocio en Paraguay?', en: 'Are you interested in operating a business in Paraguay?' },
        type: 'select',
        options: [
          { value: 'yes', label: { es: 'Sí', en: 'Yes' }, weight: 15 },
          { value: 'maybe', label: { es: 'Quizás', en: 'Maybe' }, weight: 10 },
          { value: 'no', label: { es: 'No', en: 'No' }, weight: 0 },
        ],
      },
      {
        id: 'dependents',
        question: { es: '¿Tiene dependientes?', en: 'Do you have dependents?' },
        type: 'select',
        options: [
          { value: 'yes', label: { es: 'Sí, familia completa', en: 'Yes, full family' }, weight: 15 },
          { value: 'spouse', label: { es: 'Solo cónyuge', en: 'Spouse only' }, weight: 10 },
          { value: 'no', label: { es: 'Solo / Soltero', en: 'Single' }, weight: 5 },
        ],
      },
    ],
    thresholds: [
      { minScore: 80, recommendation: 'business', message: { es: '¡Ideal para Paraguay Business!', en: 'Ideal for Paraguay Business!' } },
      { minScore: 60, recommendation: 'base', message: { es: 'Buen candidato. Le consultamos.', en: 'Good candidate. Let us consult.' } },
      { minScore: 40, recommendation: 'consult', message: { es: 'Requiere evaluación.', en: 'Requires evaluation.' } },
      { minScore: 0, recommendation: 'none', message: { es: 'Consulte alternativas.', en: 'Explore alternatives.' } },
    ],
  },

  documents: {
    passport: {
      name: { es: 'Pasaporte válido', en: 'Valid passport' },
      required: true,
      validity: 6,
      originNotes: { es: 'Mínimo 6 meses de validez', en: 'Minimum 6 months validity' },
    },
    birthCert: {
      name: { es: 'Certificado de nacimiento', en: 'Birth certificate' },
      required: true,
      legalization: 'apostille',
      processingWeeks: 2,
    },
    criminalRecord: {
      name: { es: 'Antecedentes penales', en: 'Criminal background check' },
      required: true,
      legalization: 'apostille',
      processingWeeks: 2,
    },
    photos: {
      name: { es: 'Fotos 4x4 fondo blanco', en: 'Photos 4x4 white background' },
      required: true,
      processingWeeks: 0,
    },
    bankStatement: {
      name: { es: 'Estado de cuenta bancario', en: 'Bank statement' },
      required: true,
      legalization: 'notarized',
      processingWeeks: 1,
    },
    marriageCert: {
      name: { es: 'Certificado de matrimonio', en: 'Marriage certificate' },
      required: false,
      legalization: 'apostille',
      processingWeeks: 2,
    },
  },

  roi: {
    realEstate: {
      rentalYield: { min: 5, max: 8 },
      appreciation: { min: 3, max: 5 },
      taxes: 0,
    },
    business: {
      corporateTax: 10,
    },
    comparison: {
      nl: { corporate: 25 },
      de: { corporate: 30 },
      be: { corporate: 25 },
    },
  },
}

export type RelocationData = typeof relocationData