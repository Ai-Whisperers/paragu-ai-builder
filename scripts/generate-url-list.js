#!/usr/bin/env node
/**
 * Generate Pollinations URLs for manual download
 * Creates a list of URLs that can be opened in browser to download images
 * 
 * Usage:
 *   node generate-url-list.js
 * 
 * Output: pollinations-urls.txt - Open each URL in browser, save image
 */

const fs = require('fs').promises;
const path = require('path');

// Sushi bar images
const SUSHI_IMAGES = [
  {
    id: 'sushi-bar-hero',
    filename: 'sushi_bar/sushi-bar-hero.jpg',
    prompt: 'Elegant traditional Japanese sushi bar interior, chef preparing sushi behind wooden counter, warm ambient lighting with paper lanterns, fresh fish display case, minimalist zen decor with bamboo accents. Authentic Japanese restaurant atmosphere, dark wood tones with subtle red accents, professional food photography, 8K quality, wide angle',
    width: 1920,
    height: 1080
  },
  {
    id: 'sushi-bar-interior',
    filename: 'sushi_bar/sushi-bar-interior.jpg',
    prompt: 'Upscale sushi restaurant dining area with modern Japanese aesthetic, wooden tables with clean lines, subtle lighting creating intimate atmosphere, sake bottles displayed on shelves, shoji screen dividers. Contemporary Japanese interior design, warm wood and black accents, architectural photography',
    width: 1200,
    height: 800
  },
  {
    id: 'sushi-bar-chef-action',
    filename: 'sushi_bar/sushi-bar-chef-action.jpg',
    prompt: 'Master sushi chef in white uniform carefully preparing nigiri at counter, skilled hands shaping rice and placing fresh fish, focused concentration, wooden counter with fresh ingredients organized, traditional Japanese kitchen atmosphere. Professional culinary photography, dramatic lighting',
    width: 1200,
    height: 800
  },
  {
    id: 'sushi-bar-sashimi',
    filename: 'sushi_bar/sushi-bar-sashimi.jpg',
    prompt: 'Artistic sashimi platter with fresh fish slices arranged beautifully on black slate, garnished with shredded daikon and shiso leaves, wasabi and ginger accents, dark wooden table background. Premium Japanese cuisine photography, vibrant colors of fresh tuna salmon and yellowtail',
    width: 1200,
    height: 800
  },
  {
    id: 'sushi-bar-nigiri',
    filename: 'sushi_bar/sushi-bar-nigiri.jpg',
    prompt: 'Close-up of assorted nigiri sushi pieces on wooden board, glistening fresh fish atop perfectly formed rice, variety including salmon tuna shrimp and eel, slight soy sauce glaze visible. Traditional Edomae style sushi photography, shallow depth of field, warm lighting',
    width: 1200,
    height: 800
  },
  {
    id: 'sushi-bar-maki',
    filename: 'sushi_bar/sushi-bar-maki.jpg',
    prompt: 'Colorful maki sushi rolls arranged in artistic pattern on ceramic plate, inside-out California rolls and traditional hosomaki visible, sesame seeds and fish roe toppings, soy sauce dish nearby. Fresh sushi photography, vibrant appetizing colors, clean composition',
    width: 1200,
    height: 800
  },
  {
    id: 'sushi-bar-temaki',
    filename: 'sushi_bar/sushi-bar-temaki.jpg',
    prompt: 'Hand roll temaki cones standing upright on wooden holder, crispy nori seaweed filled with rice and fresh ingredients, salmon and avocado visible, traditional Japanese presentation. Casual sushi dining photography, natural lighting, appetizing food styling',
    width: 1200,
    height: 800
  },
  {
    id: 'sushi-bar-omakase',
    filename: 'sushi_bar/sushi-bar-omakase.jpg',
    prompt: 'Premium omakase dining experience, chef presenting curated selection of sushi pieces to customer at counter, elegant progression of dishes on dark ceramic plates, sake glass visible. Luxury Japanese dining photography, intimate counter seating atmosphere, refined presentation',
    width: 1200,
    height: 800
  },
  {
    id: 'sushi-bar-sake',
    filename: 'sushi_bar/sushi-bar-sake.jpg',
    prompt: 'Traditional sake service with ceramic tokkuri flask and ochoko cups, premium Japanese sake bottles displayed, warm amber liquid, elegant minimalist presentation on wooden tray. Japanese beverage photography, refined drinking culture aesthetic, warm ambient lighting',
    width: 1200,
    height: 800
  }
];

// Kaiten zushi images
const KAITEN_IMAGES = [
  {
    id: 'kaiten-hero',
    filename: 'kaiten_zushi/kaiten-hero.jpg',
    prompt: 'Modern conveyor belt sushi restaurant interior, colorful sushi plates moving on rotating belt, customers seated around counter selecting dishes, bright contemporary lighting, Japanese pop culture decor elements. Fun casual dining atmosphere, clean modern design, energetic environment',
    width: 1920,
    height: 1080
  },
  {
    id: 'kaiten-conveyor',
    filename: 'kaiten_zushi/kaiten-conveyor.jpg',
    prompt: 'Close-up of sushi plates moving on conveyor belt system, variety of sushi types on color-coded plates passing by, steam rising from hot dishes, modern restaurant setting. Dynamic food service photography, appetizing presentation',
    width: 1200,
    height: 800
  },
  {
    id: 'kaiten-family',
    filename: 'kaiten_zushi/kaiten-family.jpg',
    prompt: 'Family enjoying conveyor belt sushi together, parents and children selecting plates from moving belt, happy casual dining experience, colorful plates accumulated on table, modern family restaurant atmosphere. Lifestyle food photography, warm candid moments',
    width: 1200,
    height: 800
  },
  {
    id: 'kaiten-tablet',
    filename: 'kaiten_zushi/kaiten-tablet.jpg',
    prompt: 'Customer using touchscreen tablet to order custom sushi at table, modern technology meets traditional cuisine, clean interface showing menu options, conveyor belt visible in background. Tech-integrated dining photography, contemporary restaurant experience',
    width: 1200,
    height: 800
  },
  {
    id: 'kaiten-plates',
    filename: 'kaiten_zushi/kaiten-plates.jpg',
    prompt: 'Stack of colorful conveyor belt sushi plates accumulated on table, tower of empty plates showing satisfying meal completion, variety of plate colors representing different prices, casual fun atmosphere. Satisfying food photography, playful dining experience',
    width: 1200,
    height: 800
  },
  {
    id: 'kaiten-guests',
    filename: 'kaiten_zushi/kaiten-guests.jpg',
    prompt: 'Diverse group of customers seated at conveyor belt sushi counter, selecting fresh plates as they pass by, engaged and happy dining experience, modern open restaurant design. Social dining photography, casual restaurant atmosphere',
    width: 1200,
    height: 800
  }
];

function generateUrl(prompt, width, height, seed) {
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}

async function main() {
  console.log('🎨 Generating Pollinations URL List...\n');
  
  const output = [];
  
  // Sushi bar URLs
  output.push('# SUSHI BAR IMAGES (9 images)');
  output.push('# Open each URL in browser, save image, then rename according to filename');
  output.push('');
  
  SUSHI_IMAGES.forEach((img, i) => {
    const seed = Math.floor(Math.random() * 10000);
    const url = generateUrl(img.prompt, img.width, img.height, seed);
    output.push(`## ${i + 1}. ${img.id}`);
    output.push(`# Filename: ${img.filename}`);
    output.push(`# Size: ${img.width}x${img.height}`);
    output.push(url);
    output.push('');
  });
  
  // Kaiten URLs
  output.push('');
  output.push('# KAITEN ZUSHI IMAGES (6 images)');
  output.push('');
  
  KAITEN_IMAGES.forEach((img, i) => {
    const seed = Math.floor(Math.random() * 10000);
    const url = generateUrl(img.prompt, img.width, img.height, seed);
    output.push(`## ${i + 1}. ${img.id}`);
    output.push(`# Filename: ${img.filename}`);
    output.push(`# Size: ${img.width}x${img.height}`);
    output.push(url);
    output.push('');
  });
  
  // Instructions
  output.push('');
  output.push('# INSTRUCTIONS:');
  output.push('# 1. Copy each URL');
  output.push('# 2. Paste into browser address bar');
  output.push('# 3. Wait for image to load (10-30 seconds)');
  output.push('# 4. Right-click → Save image as...');
  output.push('# 5. Navigate to sites/shared-images/');
  output.push('# 6. Save with correct filename');
  output.push('# 7. Repeat for all images');
  output.push('#');
  output.push('# ALTERNATIVE: Use bulk download tool or wget:');
  output.push('# wget -O sites/shared-images/sushi_bar/sushi-bar-hero.jpg "URL_HERE"');
  
  const content = output.join('\n');
  const outputPath = path.join(__dirname, '../pollinations-urls.txt');
  
  await fs.writeFile(outputPath, content);
  
  console.log('✅ URL list generated!');
  console.log(`   File: ${outputPath}`);
  console.log(`   Total URLs: ${SUSHI_IMAGES.length + KAITEN_IMAGES.length}`);
  console.log('');
  console.log('💡 How to use:');
  console.log('   1. Open pollinations-urls.txt');
  console.log('   2. Copy each URL (one at a time)');
  console.log('   3. Paste into browser');
  console.log('   4. Wait for image, then save');
  console.log('   5. Save to correct folder with correct filename');
  console.log('');
  console.log('⚠️  Note: Pollinations generates images on-demand');
  console.log('   Each URL produces a unique image each time you open it');
  console.log('   Wait times: 10-30 seconds per image');
  console.log('   Rate limit: ~1 image per 10-15 seconds');
}

main().catch(console.error);
