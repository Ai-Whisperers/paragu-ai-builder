const Replicate = require('replicate');
const fs = require('fs').promises;
const path = require('path');

// Initialize Replicate with API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// PREMIUM TIER 1: Hero Backgrounds (Most Important - 20 images)
const HERO_IMAGES = [
  {
    id: 'hero-peluqueria',
    filename: 'heroes/hero-peluqueria.jpg',
    prompt: 'Cinematic wide-angle interior of modern upscale hair salon in Latin America, sleek styling stations with large mirrors reflecting warm golden light, professional hairdresser working on female client with long flowing hair, contemporary design with exposed brick and designer pendant lights. Architectural Digest photography, aspirational luxury atmosphere, 8K ultra-detailed, professional color grading, golden hour lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-barberia',
    filename: 'heroes/hero-barberia.jpg',
    prompt: 'Cinematic interior of classic modern barbershop, vintage leather barber chairs, skilled barber giving precision fade haircut to male client, American traditional decor with warm mahogany wood tones, large ornate mirrors, shaving station with hot towel setup. Professional grooming photography, masculine luxury atmosphere, 8K ultra-detailed, golden hour lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-salon-belleza',
    filename: 'heroes/hero-salon-belleza.jpg',
    prompt: 'Cinematic luxurious full-service beauty salon interior in Latin America, multiple service stations including hair styling, manicure area, makeup station, elegant chandelier lighting, marble accents, female clients receiving various premium treatments simultaneously. High-end spa photography, feminine elegant atmosphere, 8K ultra-detailed, soft natural light',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-spa',
    filename: 'heroes/hero-spa.jpg',
    prompt: 'Cinematic serene luxury spa interior with private massage treatment room, candlelit atmosphere with soft ambient lighting, fresh white towels neatly arranged on bamboo shelves, tropical plants, professional massage therapist preparing treatment table with essential oils and hot stones. Tranquil wellness photography, zen peaceful atmosphere, 8K ultra-detailed, soft diffused lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-estetica',
    filename: 'heroes/hero-estetica.jpg',
    prompt: 'Cinematic modern medical aesthetic clinic interior, clean clinical yet welcoming environment, advanced skincare laser equipment, female esthetician in white coat consulting with client over premium skincare products, white and soft pink color scheme, professional medical photography, trustworthy clinical atmosphere, 8K ultra-detailed, bright even lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-maquillaje',
    filename: 'heroes/hero-maquillaje.jpg',
    prompt: 'Cinematic professional makeup studio with large ring lights and Hollywood-style vanity mirrors, makeup artist applying bridal makeup to beautiful Latina bride, organized premium makeup palette and brushes visible, elegant white and gold decor. Bridal beauty photography, glamorous professional atmosphere, perfect studio lighting, 8K ultra-detailed',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-unas',
    filename: 'heroes/hero-unas.jpg',
    prompt: 'Cinematic chic nail salon interior with modern minimalist design, nail technician meticulously applying gel polish to clients hands, colorful premium nail polish display wall, comfortable plush seating, Instagram-worthy decor with subtle neon accent lighting. Trendy nail studio photography, fashionable aesthetic, 8K ultra-detailed, bright crisp lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-pestanas',
    filename: 'heroes/hero-pestanas.jpg',
    prompt: 'Cinematic intimate lash studio setting, lash artist carefully applying individual eyelash extensions to reclining female client, professional magnifying lamp visible, ultra-clean white environment, precision tools organized on sterile tray. Detailed beauty photography, focused meticulous atmosphere, 8K ultra-detailed, clinical bright lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-gimnasio',
    filename: 'heroes/hero-gimnasio.jpg',
    prompt: 'Cinematic modern fitness gym interior during peak hours, diverse group of athletic people training with professional equipment, personal trainer coaching client on squat rack, large industrial windows with natural light, motivational atmosphere, contemporary design with exposed beams. Dynamic fitness photography, energetic inspiring mood, 8K ultra-detailed, dramatic lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-depilacion',
    filename: 'heroes/hero-depilacion.jpg',
    prompt: 'Cinematic clean modern laser hair removal clinic, advanced IPL laser technology equipment, professional technician performing treatment on client, clinical white and silver color scheme, medical-grade cleanliness, soothing spa-like elements. Professional medical aesthetics photography, safe clinical atmosphere, 8K ultra-detailed, bright clean lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-consultoria',
    filename: 'heroes/hero-consultoria.jpg',
    prompt: 'Cinematic professional business consulting office with panoramic city view through floor-to-ceiling windows, consultant reviewing documents with client at modern glass conference table, whiteboard with strategy diagrams visible, corporate but approachable atmosphere. Executive business photography, successful professional mood, 8K ultra-detailed, natural window light',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-legal',
    filename: 'heroes/hero-legal.jpg',
    prompt: 'Cinematic prestigious law firm interior with traditional wood-paneled walls, floor-to-ceiling leather-bound legal books, senior attorney in formal suit reviewing contracts with client, scales of justice subtly visible, professional legal library atmosphere. Classic legal photography, trustworthy authoritative mood, 8K ultra-detailed, warm ambient lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-relocation',
    filename: 'heroes/hero-relocation.jpg',
    prompt: 'Cinematic international business traveler at modern airport lounge with laptop, premium rolling suitcase visible, world map and destination displays in background, sense of journey and new beginnings, professional business attire, optimistic forward-looking mood. Travel business photography, aspirational global citizen atmosphere, 8K ultra-detailed, bright modern lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-meal-prep',
    filename: 'heroes/hero-meal-prep.jpg',
    prompt: 'Cinematic professional meal prep kitchen with organized ingredient stations, professional chef portioning healthy gourmet meals into eco-friendly containers, fresh organic vegetables and proteins being prepared, stainless steel surfaces, meal containers with professional labels being arranged. Food service photography, healthy organized atmosphere, 8K ultra-detailed, bright kitchen lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-tatuajes',
    filename: 'heroes/hero-tatuajes.jpg',
    prompt: 'Cinematic professional tattoo studio with dramatic atmospheric lighting, skilled tattoo artist carefully working on intricate detailed design on clients arm, tattoo equipment and colorful ink caps organized on workstation, artistic dark interior with flash art on walls, creative focused atmosphere. Alternative art photography, edgy artistic mood, 8K ultra-detailed, dramatic directional lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-diseno-grafico',
    filename: 'heroes/hero-diseno-grafico.jpg',
    prompt: 'Cinematic creative design studio with large professional iMac displays showing branding projects, talented designer working on digital tablet with stylus, mood boards and color swatches on wall, modern open workspace, creative tools and cameras visible. Creative professional photography, inspiring artistic atmosphere, 8K ultra-detailed, bright colorful lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'hero-inmobiliaria',
    filename: 'heroes/hero-inmobiliaria.jpg',
    prompt: 'Cinematic stunning luxury modern house exterior in premium Latin American neighborhood, contemporary architecture with clean lines and floor-to-ceiling glass windows, infinity swimming pool with crystal clear water, manicured tropical garden with palm trees, professional real estate sign visible. High-end real estate photography, aspirational luxury lifestyle, 8K ultra-detailed, golden hour lighting',
    width: 1920,
    height: 1080
  },
  {
    id: 'nexa-paraguay-hero-bg',
    filename: '../nexa-paraguay/images/nexa-paraguay-hero-bg.jpg',
    prompt: 'Cinematic wide-angle professional photograph of modern Asunción Paraguay skyline at golden hour sunset, showing iconic buildings and lush tropical greenery. Warm golden light reflecting off contemporary glass buildings, clear blue sky with soft clouds. Professional business atmosphere, inviting and aspirational. High-end cityscape photography, shot from elevated vantage point, 8K ultra-detailed',
    width: 1920,
    height: 1080
  },
  {
    id: 'nexa-uruguay-hero-bg',
    filename: '../nexa-uruguay/images/nexa-uruguay-hero-bg.jpg',
    prompt: 'Cinematic breathtaking panoramic photograph of Montevideo Uruguay skyline at sunset, showing iconic Palacio Salvo and modern Torres Nauticas along the Rambla. Golden hour light reflecting on Rio de la Plata, dramatic sky with pink and orange clouds. World-class cityscape photography, cinematic composition, ultra-wide angle, 8K ultra-detailed',
    width: 1920,
    height: 1080
  },
  {
    id: 'nexa-propiedades-hero-bg',
    filename: '../nexa-propiedades/images/nexa-propiedades-hero-bg.jpg',
    prompt: 'Cinematic stunning luxury modern house exterior in premium Asunción Paraguay neighborhood, contemporary architecture with clean lines, large glass windows reflecting blue sky, infinity swimming pool with crystal clear water, manicured tropical garden with palm trees. Golden hour lighting, aspirational luxury lifestyle. Professional real estate photography, wide angle, 8K ultra-detailed, magazine quality',
    width: 1920,
    height: 1080
  }
];

// TIER 2: Team Headshots (34 images - professional diversity)
const TEAM_IMAGES = [
  // Male Professionals (17)
  {
    id: 'team-male-business-1',
    filename: 'team/team-male-business-1.jpg',
    prompt: 'Professional studio headshot of confident Hispanic businessman in his 40s, wearing perfectly tailored navy blue suit with crisp white shirt and burgundy silk tie, friendly approachable smile showing confidence, neutral light gray studio background with soft gradient, soft professional Rembrandt lighting, corporate executive portrait, high-end business photography, 8K ultra-detailed, sharp focus on face, magazine quality',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-business-2',
    filename: 'team/team-male-business-2.jpg',
    prompt: 'Professional studio headshot of confident Hispanic businessman in his 30s, wearing charcoal gray suit with light blue shirt, no tie, warm genuine smile, neutral beige studio background, soft professional lighting, modern corporate portrait, approachable expert appearance, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-barber-1',
    filename: 'team/team-male-barber-1.jpg',
    prompt: 'Professional headshot of skilled Hispanic male barber in his late 20s, wearing black barber apron over white t-shirt, stylish modern haircut with perfect fade, confident friendly smile holding professional scissors, barbershop background slightly blurred, grooming industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-trainer-1',
    filename: 'team/team-male-trainer-1.jpg',
    prompt: 'Professional headshot of fit Hispanic male personal trainer in his early 30s, wearing athletic polo shirt, muscular but approachable physique, confident motivating smile, gym background blurred, fitness industry portrait, energetic lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-tattoo-artist-1',
    filename: 'team/team-male-tattoo-artist-1.jpg',
    prompt: 'Professional headshot of artistic Hispanic male tattoo artist in his 30s, wearing black sleeveless shirt showing arm tattoos, creative alternative vibe, confident artistic expression, tattoo studio background with art visible, creative industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-medical-1',
    filename: 'team/team-male-medical-1.jpg',
    prompt: 'Professional headshot of Hispanic male doctor in his 40s, wearing white medical coat with stethoscope, trustworthy caring smile, clinical clean background, medical industry portrait, reassuring professional lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-spa-therapist-1',
    filename: 'team/team-male-spa-therapist-1.jpg',
    prompt: 'Professional headshot of Hispanic male massage therapist in his 30s, wearing spa uniform in earth tones, calm peaceful demeanor, gentle welcoming smile, spa background with plants, wellness industry portrait, soft natural lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-consultant-1',
    filename: 'team/team-male-consultant-1.jpg',
    prompt: 'Professional headshot of Hispanic male business consultant in his late 30s, wearing smart casual blazer with open collar shirt, intellectual confident smile, modern office background blurred, consulting industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-realtor-1',
    filename: 'team/team-male-realtor-1.jpg',
    prompt: 'Professional headshot of Hispanic male real estate agent in his mid-30s, wearing professional suit with branded name tag, trustworthy confident smile, upscale property background blurred, real estate industry portrait, professional lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-chef-1',
    filename: 'team/team-male-chef-1.jpg',
    prompt: 'Professional headshot of Hispanic male chef in his late 30s, wearing white chef coat, holding wooden spoon, warm passionate smile, professional kitchen background blurred, culinary industry portrait, warm appetizing lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-makeup-artist-1',
    filename: 'team/team-male-makeup-artist-1.jpg',
    prompt: 'Professional headshot of Hispanic male makeup artist in his late 20s, wearing stylish black shirt, creative artistic vibe, confident friendly smile, makeup tools subtly visible, beauty industry portrait, creative lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-designer-1',
    filename: 'team/team-male-designer-1.jpg',
    prompt: 'Professional headshot of Hispanic male graphic designer in his early 30s, wearing casual creative attire with glasses, thoughtful intelligent expression, creative studio background, design industry portrait, artistic lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-lawyer-1',
    filename: 'team/team-male-lawyer-1.jpg',
    prompt: 'Professional headshot of Hispanic male lawyer in his mid-40s, wearing formal dark suit with red tie, authoritative trustworthy expression, law office background with books, legal industry portrait, professional lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-relocation-1',
    filename: 'team/team-male-relocation-1.jpg',
    prompt: 'Professional headshot of Hispanic male relocation advisor in his late 30s, wearing smart business casual, worldly experienced vibe, confident helpful smile, international map subtly visible in background, relocation industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-nail-tech-1',
    filename: 'team/team-male-nail-tech-1.jpg',
    prompt: 'Professional headshot of Hispanic male nail technician in his late 20s, wearing modern black salon attire, stylish appearance with well-groomed nails visible, confident artistic smile, nail studio background, beauty industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-creative-1',
    filename: 'team/team-male-creative-1.jpg',
    prompt: 'Professional headshot of Hispanic male designer in his 30s, wearing casual black turtleneck, artistic creative vibe, confident friendly smile, neutral studio background with subtle gradient, soft creative lighting, modern creative industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-male-business-3',
    filename: 'team/team-male-business-3.jpg',
    prompt: 'Professional headshot of confident Hispanic businessman in his 50s, silver hair, wearing black suit with white shirt, experienced authoritative smile, neutral studio background, soft professional lighting, senior executive portrait style, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  // Female Professionals (17)
  {
    id: 'team-female-business-1',
    filename: 'team/team-female-business-1.jpg',
    prompt: 'Professional studio headshot of confident Hispanic businesswoman in her late 30s, wearing elegant navy blazer with white blouse, warm professional smile, neutral light gray studio background, soft professional lighting, corporate executive portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-business-2',
    filename: 'team/team-female-business-2.jpg',
    prompt: 'Professional headshot of confident Hispanic businesswoman in her mid-30s, wearing sophisticated gray suit with light pink blouse, approachable confident smile, neutral beige studio background, modern corporate portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-stylist-1',
    filename: 'team/team-female-stylist-1.jpg',
    prompt: 'Professional headshot of skilled Hispanic female hair stylist in her late 20s, wearing trendy salon attire, beautifully styled hair showcasing her work, confident creative smile, hair salon background blurred, beauty industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-makeup-artist-1',
    filename: 'team/team-female-makeup-artist-1.jpg',
    prompt: 'Professional headshot of talented Hispanic female makeup artist in her early 30s, wearing all-black creative attire, flawless makeup demonstrating her skills, artistic confident smile, makeup brushes visible, beauty industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-spa-therapist-1',
    filename: 'team/team-female-spa-therapist-1.jpg',
    prompt: 'Professional headshot of serene Hispanic female massage therapist in her 30s, wearing linen spa uniform in earth tones, peaceful calming presence, gentle welcoming smile, spa environment background, wellness industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-esthetician-1',
    filename: 'team/team-female-esthetician-1.jpg',
    prompt: 'Professional headshot of professional Hispanic female esthetician in her late 30s, wearing white medical spa coat, flawless skin showcasing her work, trustworthy expert smile, clinical spa background, medical beauty industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-nail-artist-1',
    filename: 'team/team-female-nail-artist-1.jpg',
    prompt: 'Professional headshot of creative Hispanic female nail artist in her mid-20s, wearing trendy salon attire, elaborately designed nails visible showcasing her art, fashionable confident smile, nail studio background, beauty industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-trainer-1',
    filename: 'team/team-female-trainer-1.jpg',
    prompt: 'Professional headshot of fit Hispanic female personal trainer in her late 20s, wearing athletic wear, energetic motivating presence, confident strong smile, gym background blurred, fitness industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-realtor-1',
    filename: 'team/team-female-realtor-1.jpg',
    prompt: 'Professional headshot of professional Hispanic female real estate agent in her mid-30s, wearing professional suit with branded name tag, trustworthy confident smile, modern home background blurred, real estate industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-medical-1',
    filename: 'team/team-female-medical-1.jpg',
    prompt: 'Professional headshot of caring Hispanic female doctor in her early 40s, wearing white medical coat with stethoscope, warm compassionate smile, clinical clean background, medical industry portrait, reassuring lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-lash-artist-1',
    filename: 'team/team-female-lash-artist-1.jpg',
    prompt: 'Professional headshot of meticulous Hispanic female lash artist in her late 20s, wearing black salon attire, beautiful long lashes showcasing her work, precise professional smile, lash studio background, beauty industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-tattoo-artist-1',
    filename: 'team/team-female-tattoo-artist-1.jpg',
    prompt: 'Professional headshot of artistic Hispanic female tattoo artist in her early 30s, wearing creative alternative attire with visible tattoos, confident artistic expression, tattoo studio background, creative industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-consultant-1',
    filename: 'team/team-female-consultant-1.jpg',
    prompt: 'Professional headshot of sophisticated Hispanic female consultant in her late 30s, wearing smart business attire, intellectual confident smile, modern office background blurred, consulting industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-lawyer-1',
    filename: 'team/team-female-lawyer-1.jpg',
    prompt: 'Professional headshot of authoritative Hispanic female lawyer in her mid-40s, wearing formal dark suit, confident professional expression, law office background with books, legal industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-relocation-1',
    filename: 'team/team-female-relocation-1.jpg',
    prompt: 'Professional headshot of experienced Hispanic female relocation advisor in her late 30s, wearing smart business casual, worldly helpful vibe, confident supportive smile, international background elements, relocation industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-chef-1',
    filename: 'team/team-female-chef-1.jpg',
    prompt: 'Professional headshot of passionate Hispanic female chef in her late 30s, wearing white chef coat with black apron, holding fresh vegetables, warm creative smile, professional kitchen background blurred, culinary industry portrait, 8K ultra-detailed',
    width: 1024,
    height: 1024
  },
  {
    id: 'team-female-designer-1',
    filename: 'team/team-female-designer-1.jpg',
    prompt: 'Professional headshot of creative Hispanic female graphic designer in her early 30s, wearing artistic casual attire, thoughtful creative expression, design studio background, creative industry portrait, artistic lighting, 8K ultra-detailed',
    width: 1024,
    height: 1024
  }
];

// TIER 3: Service Images (20 images)
const SERVICE_IMAGES = [
  {
    id: 'service-hair-cut',
    filename: 'services/service-hair-cut.jpg',
    prompt: 'Professional hairdresser performing precision haircut on female client, sectioning hair with high-quality comb and professional scissors, modern luxury salon environment with marble countertops, focused professional atmosphere, perfect studio lighting, service photography, clean aesthetic, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-hair-color',
    filename: 'services/service-hair-color.jpg',
    prompt: 'Professional colorist applying premium hair dye to clients sections with brush, aluminum foils visible, modern salon color station, chemical processing in progress, technical precision, bright professional lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-blow-dry',
    filename: 'services/service-blow-dry.jpg',
    prompt: 'Hair stylist blow drying and styling clients long hair with round brush and professional dryer, beautiful movement and shine, final styling stage, luxury salon station setting, glamorous result, warm professional lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-manicure',
    filename: 'services/service-manicure.jpg',
    prompt: 'Nail technician carefully painting clients fingernails with premium polish, detailed close-up of hands, organized professional polish bottles visible, modern nail station setting, meticulous detail, bright clean lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-facial',
    filename: 'services/service-facial.jpg',
    prompt: 'Professional esthetician applying facial mask or treatment cream to reclining female client, luxury spa bed setting, peaceful relaxing atmosphere, premium skincare products visible, pampering experience, soft professional lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-massage',
    filename: 'services/service-massage.jpg',
    prompt: 'Professional massage therapist giving therapeutic back massage to client on premium spa table, peaceful spa room setting, proper draping, relaxation atmosphere, wellness experience, soft natural lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-makeup',
    filename: 'services/service-makeup.jpg',
    prompt: 'Professional makeup artist applying eyeshadow to client with precision brush, ring light visible, professional makeup station setup, artistic application process, beauty transformation, perfect studio lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-lash-extensions',
    filename: 'services/service-lash-extensions.jpg',
    prompt: 'Lash technician applying individual lash extensions with professional tweezers, close-up of eye area, precision application, lash studio setting with magnifying lamp, detailed close-up, clinical bright lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-personal-training',
    filename: 'services/service-personal-training.jpg',
    prompt: 'Personal trainer coaching client performing exercise with proper form, modern gym setting, motivating professional atmosphere, professional fitness equipment visible, active lifestyle, energetic lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-group-class',
    filename: 'services/service-group-class.jpg',
    prompt: 'Group of people participating in fitness class with professional instructor leading, modern studio with mirrors, energetic group atmosphere, synchronized movement, community fitness, bright energetic lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-laser-treatment',
    filename: 'services/service-laser-treatment.jpg',
    prompt: 'Technician performing laser hair removal treatment on client, professional IPL equipment visible, clinical clean setting, protective eyewear, medical aesthetics, clinical bright lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-body-treatment',
    filename: 'services/service-body-treatment.jpg',
    prompt: 'Spa therapist performing body wrap or scrub treatment on client, luxury spa setting, exfoliation process, pampering atmosphere, body wellness, soft warm lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-consultation',
    filename: 'services/service-consultation.jpg',
    prompt: 'Business consultant presenting strategy on laptop to client in modern office, professional meeting atmosphere, documents and charts visible, professional advisory, office lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-legal-review',
    filename: 'services/service-legal-review.jpg',
    prompt: 'Lawyer reviewing contract documents with client at conference table, professional legal office, important paperwork spread out, serious professional atmosphere, legal services, professional lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-property-showing',
    filename: 'services/service-property-showing.jpg',
    prompt: 'Real estate agent showing modern home interior to potential buyers, bright spacious living room, professional presentation, aspirational property, real estate showing, natural lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-meal-prep',
    filename: 'services/service-meal-prep.jpg',
    prompt: 'Chef portioning healthy prepared meals into containers, organized kitchen setup, fresh ingredients visible, professional meal prep process, food service, bright kitchen lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-tattoo-session',
    filename: 'services/service-tattoo-session.jpg',
    prompt: 'Tattoo artist tattooing detailed design on clients arm, close-up of tattoo machine in action, ink caps and equipment visible, professional tattoo studio, artistic process, dramatic lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-design-work',
    filename: 'services/service-design-work.jpg',
    prompt: 'Graphic designer working on digital tablet with stylus, large monitor showing design project, creative studio environment, artistic tools around, creative process, bright creative lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-barber-cut',
    filename: 'services/service-barber-cut.jpg',
    prompt: 'Barber giving precision haircut with clippers, client in classic barber chair, traditional barbershop atmosphere, grooming in progress, barber craft, warm lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  },
  {
    id: 'service-barber-shave',
    filename: 'services/service-barber-shave.jpg',
    prompt: 'Barber performing hot towel straight razor shave, classic grooming service, lather and brush visible, traditional barbering, classic shave, warm intimate lighting, 8K ultra-detailed',
    width: 1024,
    height: 768
  }
];

// Combine all images
const ALL_IMAGES = [
  ...HERO_IMAGES.map(img => ({ ...img, tier: 1 })),
  ...TEAM_IMAGES.map(img => ({ ...img, tier: 2 })),
  ...SERVICE_IMAGES.map(img => ({ ...img, tier: 3 }))
];

// Cost calculation
const COST_PER_IMAGE = 0.04; // FLUX-1.1-Pro pricing
const TOTAL_ESTIMATED_COST = ALL_IMAGES.length * COST_PER_IMAGE;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generatePremiumImage(imageSpec) {
  const startTime = Date.now();
  
  console.log(`\n🎨 [Tier ${imageSpec.tier}] ${imageSpec.id}`);
  console.log(`   Model: FLUX-1.1-Pro (Premium)`);
  console.log(`   Size: ${imageSpec.width}x${imageSpec.height}`);
  console.log(`   Est. Cost: $${COST_PER_IMAGE}`);
  
  try {
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: imageSpec.prompt,
          width: imageSpec.width,
          height: imageSpec.height,
          aspect_ratio: imageSpec.width > imageSpec.height ? "16:9" : 
                       imageSpec.width === imageSpec.height ? "1:1" : "4:3",
          output_format: "jpg",
          output_quality: 100,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      }
    );
    
    const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Download the image
    const imageUrl = output[0];
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    // Save to file
    const outputPath = path.join('sites/shared-images', imageSpec.filename);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, Buffer.from(buffer));
    
    const sizeKB = Math.round(buffer.byteLength / 1024);
    
    console.log(`   ✅ Success! (${generationTime}s, ${sizeKB}KB)`);
    console.log(`   💾 Saved: ${imageSpec.filename}`);
    
    return {
      success: true,
      id: imageSpec.id,
      size: sizeKB,
      time: generationTime,
      cost: COST_PER_IMAGE,
      path: imageSpec.filename
    };
    
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    return {
      success: false,
      id: imageSpec.id,
      error: error.message
    };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎨 PREMIUM IMAGE GENERATION - FLUX-1.1-Pro           ║');
  console.log('║   Quality over Quantity - Museum-Grade Results          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log(`📊 Configuration:`);
  console.log(`   Total Images: ${ALL_IMAGES.length}`);
  console.log(`   Model: FLUX-1.1-Pro (State-of-the-art)`);
  console.log(`   Cost per image: $${COST_PER_IMAGE}`);
  console.log(`   Estimated total: $${TOTAL_ESTIMATED_COST.toFixed(2)}`);
  console.log(`   Budget: $20.00`);
  console.log(`   Remaining after: $${(20 - TOTAL_ESTIMATED_COST).toFixed(2)}\n`);
  
  const results = {
    success: [],
    failed: [],
    totalCost: 0,
    startTime: Date.now()
  };
  
  // Generate by tier (1 = heroes first, then team, then services)
  for (const tier of [1, 2, 3]) {
    const tierImages = ALL_IMAGES.filter(img => img.tier === tier);
    const tierNames = { 1: 'HERO BACKGROUNDS', 2: 'TEAM HEADSHOTS', 3: 'SERVICE IMAGES' };
    
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📸 TIER ${tier}: ${tierNames[tier]} (${tierImages.length} images)`);
    console.log(`${'═'.repeat(60)}`);
    
    for (let i = 0; i < tierImages.length; i++) {
      const image = tierImages[i];
      console.log(`\n[${i + 1}/${tierImages.length}]`);
      
      const result = await generatePremiumImage(image);
      
      if (result.success) {
        results.success.push(result);
        results.totalCost += result.cost;
      } else {
        results.failed.push(result);
      }
      
      // Rate limiting - be respectful to the API
      if (i < tierImages.length - 1) {
        await sleep(3000); // 3 seconds between requests
      }
    }
  }
  
  // Summary
  const totalTime = ((Date.now() - results.startTime) / 60000).toFixed(1);
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   📊 GENERATION COMPLETE                               ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`   Success: ${results.success.length}/${ALL_IMAGES.length}`);
  console.log(`   Failed:  ${results.failed.length}/${ALL_IMAGES.length}`);
  console.log(`   Total Cost: $${results.totalCost.toFixed(2)}`);
  console.log(`   Remaining Budget: $${(20 - results.totalCost).toFixed(2)}`);
  console.log(`   Total Time: ${totalTime} minutes`);
  console.log('\n✨ All images saved to sites/shared-images/');
  
  if (results.failed.length > 0) {
    console.log('\n⚠️  Failed images:');
    results.failed.forEach(f => {
      console.log(`   - ${f.id}: ${f.error}`);
    });
  }
  
  console.log('\n🚀 Next steps:');
  console.log('   1. Review generated images');
  console.log('   2. Run: node scripts/optimize-images.js');
  console.log('   3. Run: node scripts/update-content-images.js');
  console.log('   4. Deploy: ./deploy-master.sh');
}

// Check for API token
if (!process.env.REPLICATE_API_TOKEN) {
  console.error('❌ Error: REPLICATE_API_TOKEN not set');
  console.error('   Get your token from: https://replicate.com/account/api-tokens');
  console.error('   Then run: export REPLICATE_API_TOKEN=your_token_here');
  process.exit(1);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
