#!/usr/bin/env node
/**
 * Gemini Image Generation Automation Script
 * Generates all images for Paragu-AI Builder using Gemini API
 * 
 * Usage:
 *   export GEMINI_API_KEY=AIzaSyBitObgYEugKf_UkaBdvBbh4FE1KJN7D-k
 *   node generate-images.js [batch-name]
 * 
 * Batches:
 *   - heroes (20 images) - Day 1
 *   - team (34 images) - Day 2-3
 *   - services (20 images) - Day 3
 *   - portfolios-tatuajes (50 images) - Day 4
 *   - portfolios-beauty (80 images) - Day 5
 *   - portfolios-creative (35 images) - Day 6
 *   - before-after (80 images) - Day 7
 *   - all (generates everything)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Configuration
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBitObgYEugKf_UkaBdvBbh4FE1KJN7D-k';
const OUTPUT_BASE = 'sites/shared-images';
const DELAY_BETWEEN_REQUESTS = 5000; // 5 seconds to avoid rate limits

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// Image specifications
const SPECS = {
  hero: { width: 1920, height: 1080, aspect: '16:9' },
  team: { width: 600, height: 600, aspect: '1:1' },
  service: { width: 800, height: 600, aspect: '4:3' },
  portfolio: { width: 1200, height: 800, aspect: '3:2' }
};

// ============================================================================
// BATCH 1: HERO BACKGROUNDS (20 images)
// ============================================================================
const HERO_IMAGES = [
  {
    id: 'hero-peluqueria',
    filename: 'heroes/hero-peluqueria.jpg',
    prompt: `Wide-angle interior of modern upscale hair salon in Latin America, sleek styling stations with large mirrors, professional hairdresser working on female client with long flowing hair, warm ambient lighting, contemporary design with exposed brick and pendant lights. Professional beauty photography, aspirational atmosphere, 8K quality.`
  },
  {
    id: 'hero-barberia',
    filename: 'heroes/hero-barberia.jpg',
    prompt: `Classic modern barbershop interior with vintage leather chairs, skilled barber giving precision fade haircut to male client, American traditional decor with warm wood tones, large mirrors, shaving station visible. Professional grooming photography, masculine yet welcoming atmosphere, golden hour lighting, 8K quality.`
  },
  {
    id: 'hero-salon-belleza',
    filename: 'heroes/hero-salon-belleza.jpg',
    prompt: `Luxurious full-service beauty salon interior in Latin America, multiple service stations - hair styling, manicure area, makeup station, elegant chandelier lighting, marble accents, female clients receiving various treatments simultaneously. High-end spa photography, feminine elegant atmosphere, soft natural light, 8K quality.`
  },
  {
    id: 'hero-spa',
    filename: 'heroes/hero-spa.jpg',
    prompt: `Serene luxury spa interior with massage treatment room, candlelit atmosphere, fresh white towels neatly arranged, tropical plants, massage therapist preparing treatment table with oils and stones. Tranquil wellness photography, zen peaceful atmosphere, soft diffused lighting, 8K quality.`
  },
  {
    id: 'hero-estetica',
    filename: 'heroes/hero-estetica.jpg',
    prompt: `Modern medical aesthetic clinic interior, clean clinical yet welcoming environment, advanced skincare equipment, female esthetician consulting with client over skincare products, white and soft pink color scheme, professional medical photography, trustworthy clinical atmosphere, bright even lighting, 8K quality.`
  },
  {
    id: 'hero-maquillaje',
    filename: 'heroes/hero-maquillaje.jpg',
    prompt: `Professional makeup studio with large ring lights and Hollywood-style vanity mirrors, makeup artist applying bridal makeup to beautiful Latina bride, organized makeup palette and brushes visible, elegant white and gold decor. Bridal beauty photography, glamorous professional atmosphere, perfect studio lighting, 8K quality.`
  },
  {
    id: 'hero-unas',
    filename: 'heroes/hero-unas.jpg',
    prompt: `Chic nail salon interior with modern minimalist design, nail technician meticulously applying gel polish to client's hands, colorful nail polish display wall, comfortable plush seating, Instagram-worthy decor with neon accent lighting. Trendy nail studio photography, fashionable aesthetic, bright crisp lighting, 8K quality.`
  },
  {
    id: 'hero-pestanas',
    filename: 'heroes/hero-pestanas.jpg',
    prompt: `Intimate lash studio setting, lash artist carefully applying individual eyelash extensions to reclining female client, magnifying lamp visible, ultra-clean white environment, precision tools organized on tray. Detailed beauty photography, focused meticulous atmosphere, clinical bright lighting, 8K quality.`
  },
  {
    id: 'hero-gimnasio',
    filename: 'heroes/hero-gimnasio.jpg',
    prompt: `Modern fitness gym interior during peak hours, diverse group of people training with professional equipment, personal trainer coaching client on squat rack, large windows with natural light, motivational atmosphere, contemporary industrial design with exposed beams. Dynamic fitness photography, energetic inspiring mood, dramatic lighting, 8K quality.`
  },
  {
    id: 'hero-depilacion',
    filename: 'heroes/hero-depilacion.jpg',
    prompt: `Clean modern laser hair removal clinic, advanced IPL/laser technology equipment, technician performing treatment on client, clinical white and silver color scheme, medical-grade cleanliness, soothing spa-like elements. Professional medical aesthetics photography, safe clinical atmosphere, bright clean lighting, 8K quality.`
  },
  {
    id: 'hero-consultoria',
    filename: 'heroes/hero-consultoria.jpg',
    prompt: `Professional business consulting office with panoramic city view through floor-to-ceiling windows, consultant reviewing documents with client at modern glass conference table, whiteboard with strategy diagrams visible, corporate but approachable atmosphere. Executive business photography, successful professional mood, natural window light, 8K quality.`
  },
  {
    id: 'hero-legal',
    filename: 'heroes/hero-legal.jpg',
    prompt: `Prestigious law firm interior with traditional wood-paneled walls, leather-bound legal books, attorney in formal suit reviewing contracts with client, scales of justice subtly visible, professional legal library atmosphere. Classic legal photography, trustworthy authoritative mood, warm ambient lighting, 8K quality.`
  },
  {
    id: 'hero-relocation',
    filename: 'heroes/hero-relocation.jpg',
    prompt: `International business traveler at modern airport lounge with laptop, rolling suitcase visible, world map or destination board in background, sense of journey and new beginnings, professional business attire, optimistic forward-looking mood. Travel business photography, aspirational global citizen atmosphere, bright modern lighting, 8K quality.`
  },
  {
    id: 'hero-meal-prep',
    filename: 'heroes/hero-meal-prep.jpg',
    prompt: `Professional meal prep kitchen with organized ingredient stations, chef portioning healthy meals into containers, fresh vegetables and proteins being prepared, stainless steel surfaces, meal containers with labels being arranged. Food service photography, healthy organized atmosphere, bright kitchen lighting, 8K quality.`
  },
  {
    id: 'hero-tatuajes',
    filename: 'heroes/hero-tatuajes.jpg',
    prompt: `Professional tattoo studio with dramatic lighting, tattoo artist carefully working on intricate design on client's arm, tattoo equipment and colorful ink caps organized, artistic dark interior with flash art on walls, creative focused atmosphere. Alternative art photography, edgy artistic mood, dramatic directional lighting, 8K quality.`
  },
  {
    id: 'hero-diseno-grafico',
    filename: 'heroes/hero-diseno-grafico.jpg',
    prompt: `Creative design studio with large iMac displays showing branding projects, designer working on digital tablet, mood boards and color swatches on wall, modern open workspace, creative tools and cameras visible. Creative professional photography, inspiring artistic atmosphere, bright colorful lighting, 8K quality.`
  },
  {
    id: 'hero-inmobiliaria',
    filename: 'heroes/hero-inmobiliaria.jpg',
    prompt: `Stunning luxury modern house exterior in premium Latin American neighborhood, contemporary architecture with clean lines, large glass windows, swimming pool with crystal clear water, manicured tropical garden, real estate sign visible. High-end real estate photography, aspirational lifestyle, golden hour lighting, 8K quality.`
  },
  {
    id: 'nexa-paraguay-hero-bg',
    filename: '../nexa-paraguay/images/nexa-paraguay-hero-bg.jpg',
    prompt: `Wide-angle professional photograph of modern Asunción Paraguay skyline at golden hour sunset, showing the iconic buildings and lush greenery. Warm golden light reflecting off glass buildings, clear blue sky with soft clouds. Professional business atmosphere, inviting and aspirational. High-end cityscape photography, shot from elevated vantage point. 8K quality.`
  },
  {
    id: 'nexa-uruguay-hero-bg',
    filename: '../nexa-uruguay/images/nexa-uruguay-hero-bg.jpg',
    prompt: `Breathtaking panoramic photograph of Montevideo Uruguay skyline at sunset, showing iconic Palacio Salvo and modern Torres Nauticas along Rambla. Golden hour light reflecting on Rio de la Plata, dramatic sky with pink and orange clouds. World-class cityscape photography, cinematic composition, ultra-wide angle, 8K quality.`
  },
  {
    id: 'nexa-propiedades-hero-bg',
    filename: '../nexa-propiedades/images/nexa-propiedades-hero-bg.jpg',
    prompt: `Stunning luxury modern house exterior in premium Asunción Paraguay neighborhood, contemporary architecture with clean lines, large glass windows, swimming pool with crystal clear water reflecting blue sky, manicured tropical garden with palm trees. Golden hour lighting, aspirational lifestyle. Professional real estate photography, wide angle, 8K ultra-detailed, magazine quality.`
  }
];

// ============================================================================
// BATCH 2: TEAM TEMPLATES (34 images)
// ============================================================================
const TEAM_IMAGES = [
  // Male Professionals (17)
  {
    id: 'team-male-business-1',
    filename: 'team/team-male-business-1.jpg',
    prompt: `Professional headshot of confident Hispanic businessman in his 40s, wearing navy blue suit with white shirt and burgundy tie, friendly approachable smile, neutral light gray studio background, soft professional lighting, corporate portrait style, high-end executive look. 8K ultra-detailed, sharp focus on face, shoulders visible.`
  },
  {
    id: 'team-male-business-2',
    filename: 'team/team-male-business-2.jpg',
    prompt: `Professional headshot of confident Hispanic businessman in his 30s, wearing charcoal gray suit with light blue shirt, no tie, warm genuine smile, neutral beige studio background, soft professional lighting, modern corporate portrait, approachable expert appearance. 8K ultra-detailed.`
  },
  {
    id: 'team-male-business-3',
    filename: 'team/team-male-business-3.jpg',
    prompt: `Professional headshot of confident Hispanic businessman in his 50s, silver hair, wearing black suit with white shirt, experienced authoritative smile, neutral studio background, soft professional lighting, senior executive portrait style. 8K ultra-detailed.`
  },
  {
    id: 'team-male-creative-1',
    filename: 'team/team-male-creative-1.jpg',
    prompt: `Professional headshot of Hispanic male designer in his 30s, wearing casual black turtleneck, artistic creative vibe, confident friendly smile, neutral studio background with subtle gradient, soft creative lighting, modern creative industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-male-barber-1',
    filename: 'team/team-male-barber-1.jpg',
    prompt: `Professional headshot of skilled Hispanic male barber in his late 20s, wearing black barber apron over white t-shirt, stylish modern haircut (fade), confident friendly smile holding scissors, barbershop background slightly blurred, grooming industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-male-trainer-1',
    filename: 'team/team-male-trainer-1.jpg',
    prompt: `Professional headshot of fit Hispanic male personal trainer in his early 30s, wearing athletic polo shirt in brand colors, muscular but approachable, confident motivating smile, gym background blurred, fitness industry portrait, energetic lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-tattoo-artist-1',
    filename: 'team/team-male-tattoo-artist-1.jpg',
    prompt: `Professional headshot of artistic Hispanic male tattoo artist in his 30s, wearing black sleeveless shirt showing arm tattoos, creative alternative vibe, confident artistic expression, tattoo studio background with art visible, creative industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-male-medical-1',
    filename: 'team/team-male-medical-1.jpg',
    prompt: `Professional headshot of Hispanic male doctor/medical professional in his 40s, wearing white medical coat with stethoscope, trustworthy caring smile, clinical clean background, medical industry portrait, reassuring professional lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-spa-therapist-1',
    filename: 'team/team-male-spa-therapist-1.jpg',
    prompt: `Professional headshot of Hispanic male massage therapist in his 30s, wearing spa uniform in earth tones, calm peaceful demeanor, gentle welcoming smile, spa background with plants, wellness industry portrait, soft natural lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-consultant-1',
    filename: 'team/team-male-consultant-1.jpg',
    prompt: `Professional headshot of Hispanic male business consultant in his late 30s, wearing smart casual blazer with open collar shirt, intellectual confident smile, modern office background blurred, consulting industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-male-realtor-1',
    filename: 'team/team-male-realtor-1.jpg',
    prompt: `Professional headshot of Hispanic male real estate agent in his mid-30s, wearing professional suit with branded name tag, trustworthy confident smile, upscale property background blurred, real estate industry portrait, professional lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-chef-1',
    filename: 'team/team-male-chef-1.jpg',
    prompt: `Professional headshot of Hispanic male chef in his late 30s, wearing white chef coat, holding wooden spoon, warm passionate smile, professional kitchen background blurred, culinary industry portrait, warm appetizing lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-makeup-artist-1',
    filename: 'team/team-male-makeup-artist-1.jpg',
    prompt: `Professional headshot of Hispanic male makeup artist in his late 20s, wearing stylish black shirt, creative artistic vibe, confident friendly smile, makeup tools subtly visible, beauty industry portrait, creative lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-designer-1',
    filename: 'team/team-male-designer-1.jpg',
    prompt: `Professional headshot of Hispanic male graphic designer in his early 30s, wearing casual creative attire with glasses, thoughtful intelligent expression, creative studio background, design industry portrait, artistic lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-lawyer-1',
    filename: 'team/team-male-lawyer-1.jpg',
    prompt: `Professional headshot of Hispanic male lawyer in his mid-40s, wearing formal dark suit with red tie, authoritative trustworthy expression, law office background with books, legal industry portrait, professional lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-male-relocation-1',
    filename: 'team/team-male-relocation-1.jpg',
    prompt: `Professional headshot of Hispanic male relocation advisor in his late 30s, wearing smart business casual, worldly experienced vibe, confident helpful smile, international map subtly visible in background, relocation industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-male-nail-tech-1',
    filename: 'team/team-male-nail-tech-1.jpg',
    prompt: `Professional headshot of Hispanic male nail technician in his late 20s, wearing modern black salon attire, stylish appearance with well-groomed nails visible, confident artistic smile, nail studio background, beauty industry portrait. 8K ultra-detailed.`
  },
  // Female Professionals (17)
  {
    id: 'team-female-business-1',
    filename: 'team/team-female-business-1.jpg',
    prompt: `Professional headshot of confident Hispanic businesswoman in her late 30s, wearing elegant navy blazer with white blouse, warm professional smile, neutral light gray studio background, soft professional lighting, corporate executive portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-business-2',
    filename: 'team/team-female-business-2.jpg',
    prompt: `Professional headshot of confident Hispanic businesswoman in her mid-30s, wearing sophisticated gray suit with light pink blouse, approachable confident smile, neutral beige studio background, modern corporate portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-stylist-1',
    filename: 'team/team-female-stylist-1.jpg',
    prompt: `Professional headshot of skilled Hispanic female hair stylist in her late 20s, wearing trendy salon attire, beautifully styled hair showcasing her work, confident creative smile, hair salon background blurred, beauty industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-makeup-artist-1',
    filename: 'team/team-female-makeup-artist-1.jpg',
    prompt: `Professional headshot of talented Hispanic female makeup artist in her early 30s, wearing all-black creative attire, flawless makeup demonstrating her skills, artistic confident smile, makeup brushes visible, beauty industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-spa-therapist-1',
    filename: 'team/team-female-spa-therapist-1.jpg',
    prompt: `Professional headshot of serene Hispanic female massage therapist in her 30s, wearing linen spa uniform in earth tones, peaceful calming presence, gentle welcoming smile, spa environment background, wellness industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-esthetician-1',
    filename: 'team/team-female-esthetician-1.jpg',
    prompt: `Professional headshot of professional Hispanic female esthetician in her late 30s, wearing white medical spa coat, flawless skin showcasing her work, trustworthy expert smile, clinical spa background, medical beauty industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-nail-artist-1',
    filename: 'team/team-female-nail-artist-1.jpg',
    prompt: `Professional headshot of creative Hispanic female nail artist in her mid-20s, wearing trendy salon attire, elaborately designed nails visible showcasing her art, fashionable confident smile, nail studio background, beauty industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-trainer-1',
    filename: 'team/team-female-trainer-1.jpg',
    prompt: `Professional headshot of fit Hispanic female personal trainer in her late 20s, wearing athletic wear, energetic motivating presence, confident strong smile, gym background blurred, fitness industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-realtor-1',
    filename: 'team/team-female-realtor-1.jpg',
    prompt: `Professional headshot of professional Hispanic female real estate agent in her mid-30s, wearing professional suit with branded name tag, trustworthy confident smile, modern home background blurred, real estate industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-medical-1',
    filename: 'team/team-female-medical-1.jpg',
    prompt: `Professional headshot of caring Hispanic female doctor in her early 40s, wearing white medical coat with stethoscope, warm compassionate smile, clinical clean background, medical industry portrait, reassuring lighting. 8K ultra-detailed.`
  },
  {
    id: 'team-female-lash-artist-1',
    filename: 'team/team-female-lash-artist-1.jpg',
    prompt: `Professional headshot of meticulous Hispanic female lash artist in her late 20s, wearing black salon attire, beautiful long lashes showcasing her work, precise professional smile, lash studio background, beauty industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-tattoo-artist-1',
    filename: 'team/team-female-tattoo-artist-1.jpg',
    prompt: `Professional headshot of artistic Hispanic female tattoo artist in her early 30s, wearing creative alternative attire with visible tattoos, confident artistic expression, tattoo studio background, creative industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-consultant-1',
    filename: 'team/team-female-consultant-1.jpg',
    prompt: `Professional headshot of sophisticated Hispanic female consultant in her late 30s, wearing smart business attire, intellectual confident smile, modern office background blurred, consulting industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-lawyer-1',
    filename: 'team/team-female-lawyer-1.jpg',
    prompt: `Professional headshot of authoritative Hispanic female lawyer in her mid-40s, wearing formal dark suit, confident professional expression, law office background with books, legal industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-relocation-1',
    filename: 'team/team-female-relocation-1.jpg',
    prompt: `Professional headshot of experienced Hispanic female relocation advisor in her late 30s, wearing smart business casual, worldly helpful vibe, confident supportive smile, international background elements, relocation industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-chef-1',
    filename: 'team/team-female-chef-1.jpg',
    prompt: `Professional headshot of passionate Hispanic female chef in her late 30s, wearing white chef coat with black apron, holding fresh vegetables, warm creative smile, professional kitchen background blurred, culinary industry portrait. 8K ultra-detailed.`
  },
  {
    id: 'team-female-designer-1',
    filename: 'team/team-female-designer-1.jpg',
    prompt: `Professional headshot of creative Hispanic female graphic designer in her early 30s, wearing artistic casual attire, thoughtful creative expression, design studio background, creative industry portrait, artistic lighting. 8K ultra-detailed.`
  }
];

// ============================================================================
// BATCH 3: SERVICE IMAGES (20 images)
// ============================================================================
const SERVICE_IMAGES = [
  {
    id: 'service-hair-cut',
    filename: 'services/service-hair-cut.jpg',
    prompt: `Professional hairdresser cutting female client's hair with precision, sectioning hair with comb and scissors, modern salon environment, focused professional atmosphere. Service photography, clean aesthetic, bright lighting. 800x600px, 4:3 aspect.`
  },
  {
    id: 'service-hair-color',
    filename: 'services/service-hair-color.jpg',
    prompt: `Professional colorist applying hair dye to client's sections with brush, foils visible, modern salon color station, chemical processing in progress. Service photography, technical precision, bright lighting. 800x600px.`
  },
  {
    id: 'service-blow-dry',
    filename: 'services/service-blow-dry.jpg',
    prompt: `Hair stylist blow drying and styling client's long hair with round brush and dryer, beautiful movement and shine, final styling stage, salon station setting. Service photography, glamorous result, warm lighting. 800x600px.`
  },
  {
    id: 'service-manicure',
    filename: 'services/service-manicure.jpg',
    prompt: `Nail technician carefully painting client's fingernails with polish, detailed close-up of hands, organized polish bottles visible, nail station setting. Service photography, meticulous detail, bright clean lighting. 800x600px.`
  },
  {
    id: 'service-facial',
    filename: 'services/service-facial.jpg',
    prompt: `Esthetician applying facial mask or treatment cream to reclining female client, spa bed setting, peaceful relaxing atmosphere, professional skincare products visible. Service photography, pampering experience, soft lighting. 800x600px.`
  },
  {
    id: 'service-massage',
    filename: 'services/service-massage.jpg',
    prompt: `Professional massage therapist giving back massage to client on spa table, peaceful spa room setting, proper draping, relaxation atmosphere. Service photography, wellness experience, soft natural lighting. 800x600px.`
  },
  {
    id: 'service-makeup',
    filename: 'services/service-makeup.jpg',
    prompt: `Makeup artist applying eyeshadow to client with brush, ring light visible, professional makeup station setup, artistic application process. Service photography, beauty transformation, perfect studio lighting. 800x600px.`
  },
  {
    id: 'service-lash-extensions',
    filename: 'services/service-lash-extensions.jpg',
    prompt: `Lash technician applying individual lash extensions with tweezers, close-up of eye area, precision application, lash studio setting with magnifying lamp. Service photography, detailed close-up, clinical bright lighting. 800x600px.`
  },
  {
    id: 'service-personal-training',
    filename: 'services/service-personal-training.jpg',
    prompt: `Personal trainer coaching client performing exercise with proper form, modern gym setting, motivating professional atmosphere, fitness equipment visible. Service photography, active lifestyle, energetic lighting. 800x600px.`
  },
  {
    id: 'service-group-class',
    filename: 'services/service-group-class.jpg',
    prompt: `Group of people participating in fitness class with instructor leading, modern studio with mirrors, energetic group atmosphere, synchronized movement. Service photography, community fitness, bright energetic lighting. 800x600px.`
  },
  {
    id: 'service-laser-treatment',
    filename: 'services/service-laser-treatment.jpg',
    prompt: `Technician performing laser hair removal treatment on client, professional IPL equipment visible, clinical clean setting, protective eyewear. Service photography, medical aesthetics, clinical bright lighting. 800x600px.`
  },
  {
    id: 'service-body-treatment',
    filename: 'services/service-body-treatment.jpg',
    prompt: `Spa therapist performing body wrap or scrub treatment on client, luxury spa setting, exfoliation process, pampering atmosphere. Service photography, body wellness, soft warm lighting. 800x600px.`
  },
  {
    id: 'service-consultation',
    filename: 'services/service-consultation.jpg',
    prompt: `Business consultant presenting strategy on laptop to client in modern office, professional meeting atmosphere, documents and charts visible. Service photography, professional advisory, office lighting. 800x600px.`
  },
  {
    id: 'service-legal-review',
    filename: 'services/service-legal-review.jpg',
    prompt: `Lawyer reviewing contract documents with client at conference table, professional legal office, important paperwork spread out, serious professional atmosphere. Service photography, legal services, professional lighting. 800x600px.`
  },
  {
    id: 'service-property-showing',
    filename: 'services/service-property-showing.jpg',
    prompt: `Real estate agent showing modern home interior to potential buyers, bright spacious living room, professional presentation, aspirational property. Service photography, real estate showing, natural lighting. 800x600px.`
  },
  {
    id: 'service-meal-prep',
    filename: 'services/service-meal-prep.jpg',
    prompt: `Chef portioning healthy prepared meals into containers, organized kitchen setup, fresh ingredients visible, professional meal prep process. Service photography, food service, bright kitchen lighting. 800x600px.`
  },
  {
    id: 'service-tattoo-session',
    filename: 'services/service-tattoo-session.jpg',
    prompt: `Tattoo artist tattooing detailed design on client's arm, close-up of tattoo machine in action, ink caps and equipment visible, professional tattoo studio. Service photography, artistic process, dramatic lighting. 800x600px.`
  },
  {
    id: 'service-design-work',
    filename: 'services/service-design-work.jpg',
    prompt: `Graphic designer working on digital tablet with stylus, large monitor showing design project, creative studio environment, artistic tools around. Service photography, creative process, bright creative lighting. 800x600px.`
  },
  {
    id: 'service-barber-cut',
    filename: 'services/service-barber-cut.jpg',
    prompt: `Barber giving precision haircut with clippers, client in classic barber chair, traditional barbershop atmosphere, grooming in progress. Service photography, barber craft, warm lighting. 800x600px.`
  },
  {
    id: 'service-barber-shave',
    filename: 'services/service-barber-shave.jpg',
    prompt: `Barber performing hot towel straight razor shave, classic grooming service, lather and brush visible, traditional barbering. Service photography, classic shave, warm intimate lighting. 800x600px.`
  }
];

// All batches
const ALL_BATCHES = {
  heroes: HERO_IMAGES,
  team: TEAM_IMAGES,
  services: SERVICE_IMAGES,
  'day-1': HERO_IMAGES,
  'day-2-3': TEAM_IMAGES,
  'day-3': SERVICE_IMAGES,
  all: [...HERO_IMAGES, ...TEAM_IMAGES, ...SERVICE_IMAGES]
};

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImage(prompt, outputPath) {
  try {
    // For Gemini 2.0 Flash (correct model name for API)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Check if we got an image
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error('No content generated');
    }

    // Find image part
    const imagePart = parts.find(part => part.inlineData);
    if (!imagePart) {
      throw new Error('No image generated - may have received text only');
    }

    // Decode and save image
    const imageData = imagePart.inlineData.data;
    const buffer = Buffer.from(imageData, 'base64');
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    
    // Save image
    await fs.writeFile(outputPath, buffer);
    
    return {
      success: true,
      size: buffer.length,
      path: outputPath
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function processBatch(images, batchName) {
  console.log(`\n🎨 Processing batch: ${batchName}`);
  console.log(`   Images to generate: ${images.length}`);
  console.log('');

  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const outputPath = path.join(OUTPUT_BASE, img.filename);
    
    console.log(`[${i + 1}/${images.length}] Generating: ${img.id}`);
    
    const result = await generateImage(img.prompt, outputPath);
    
    if (result.success) {
      const sizeKB = Math.round(result.size / 1024);
      console.log(`  ✅ Success (${sizeKB}KB) -> ${img.filename}`);
      results.success.push({ id: img.id, path: img.filename, size: sizeKB });
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
      results.failed.push({ id: img.id, error: result.error });
    }

    // Rate limiting - wait between requests
    if (i < images.length - 1) {
      process.stdout.write(`  ⏳ Waiting ${DELAY_BETWEEN_REQUESTS/1000}s...`);
      await sleep(DELAY_BETWEEN_REQUESTS);
      process.stdout.write('\r' + ' '.repeat(30) + '\r');
    }
  }

  return results;
}

async function main() {
  const batchName = process.argv[2] || 'heroes';
  
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎨 Paragu-AI Image Generation Automation             ║');
  console.log('║   Powered by Google Gemini 2.0 Flash                   ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Validate API key
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Error: No API key provided');
    console.error('   Set GEMINI_API_KEY environment variable or edit script');
    process.exit(1);
  }
  
  // Validate batch name
  if (!ALL_BATCHES[batchName]) {
    console.error(`❌ Error: Unknown batch "${batchName}"`);
    console.error('   Available batches:');
    console.error('     heroes     - Day 1: 20 hero backgrounds');
    console.error('     team       - Day 2-3: 34 team headshots');
    console.error('     services   - Day 3: 20 service images');
    console.error('     day-1      - Same as heroes');
    console.error('     day-2-3    - Same as team');
    console.error('     day-3      - Same as services');
    console.error('     all        - Everything (74 images)');
    process.exit(1);
  }
  
  const images = ALL_BATCHES[batchName];
  const startTime = Date.now();
  
  // Process batch
  const results = await processBatch(images, batchName);
  
  // Summary
  const duration = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   📊 BATCH COMPLETE                                    ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`   Success: ${results.success.length}/${images.length}`);
  console.log(`   Failed:  ${results.failed.length}/${images.length}`);
  console.log(`   Time:    ${minutes}m ${seconds}s`);
  console.log(`   Output:  ${OUTPUT_BASE}/`);
  console.log('');
  
  if (results.failed.length > 0) {
    console.log('⚠️  Failed images:');
    results.failed.forEach(f => {
      console.log(`   - ${f.id}: ${f.error}`);
    });
    console.log('');
    console.log('💡 Tip: Run the batch again to retry failed images');
    console.log('   Failed images will be skipped if already exist');
  }
  
  if (results.success.length > 0) {
    console.log('✅ Generated images:');
    results.success.forEach(s => {
      console.log(`   ✓ ${s.path} (${s.size}KB)`);
    });
    
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Review generated images');
    console.log('   2. Run: node optimize-images.js');
    console.log('   3. Run: node update-content-images.js');
    console.log('   4. Deploy: ./deploy-master.sh');
  }
}

// Run main
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
