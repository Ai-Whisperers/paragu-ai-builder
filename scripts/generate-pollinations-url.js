#!/usr/bin/env node
/**
 * Pollinations URL-based Image Generator
 * Uses direct image URLs - no API key required
 * More reliable than API endpoint
 * 
 * Usage:
 *   node generate-pollinations-url.js [batch-name]
 * 
 * Batches:
 *   - sushi (15 images)
 *   - kaiten (6 images)
 *   - all (21 images)
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const OUTPUT_BASE = '../sites/shared-images';
const DELAY_BETWEEN_REQUESTS = 3000; // 3 seconds

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

// All batches
const BATCHES = {
  sushi: SUSHI_IMAGES,
  kaiten: KAITEN_IMAGES,
  all: [...SUSHI_IMAGES, ...KAITEN_IMAGES]
};

// Sleep helper
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Download image from URL
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const request = client.get(url, { timeout: 60000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const dir = path.dirname(outputPath);
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(outputPath, buffer);
          resolve({ success: true, size: buffer.length });
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Generate image using Pollinations URL
async function generateImage(imageDef) {
  const outputPath = path.join(OUTPUT_BASE, imageDef.filename);
  
  // Build Pollinations URL
  // Format: https://image.pollinations.ai/prompt/{encoded_prompt}?width={w}&height={h}&nologo=true&seed={random}
  const encodedPrompt = encodeURIComponent(imageDef.prompt);
  const seed = Math.floor(Math.random() * 10000);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${imageDef.width}&height=${imageDef.height}&nologo=true&seed=${seed}`;
  
  try {
    const result = await downloadImage(url, outputPath);
    return {
      success: true,
      size: result.size,
      path: outputPath,
      url: url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: url
    };
  }
}

// Process a batch
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
    
    console.log(`[${i + 1}/${images.length}] Generating: ${img.id}`);
    console.log(`   Size: ${img.width}x${img.height}`);
    
    const result = await generateImage(img);
    
    if (result.success) {
      const sizeKB = Math.round(result.size / 1024);
      console.log(`  ✅ Success (${sizeKB}KB)`);
      console.log(`     File: ${img.filename}`);
      results.success.push({ id: img.id, filename: img.filename, size: sizeKB });
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
      console.log(`     URL: ${result.url.substring(0, 80)}...`);
      results.failed.push({ id: img.id, error: result.error });
    }

    // Rate limiting
    if (i < images.length - 1) {
      process.stdout.write(`  ⏳ Waiting ${DELAY_BETWEEN_REQUESTS/1000}s...`);
      await sleep(DELAY_BETWEEN_REQUESTS);
      process.stdout.write('\r' + ' '.repeat(40) + '\r');
    }
  }

  return results;
}

// Main function
async function main() {
  const batchName = process.argv[2] || 'sushi';
  
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎨 Pollinations Image Generator                      ║');
  console.log('║   Direct URL Method - No API Key Required              ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Validate batch
  if (!BATCHES[batchName]) {
    console.error(`❌ Error: Unknown batch "${batchName}"`);
    console.error('   Available batches:');
    console.error('     sushi  - 9 sushi bar images');
    console.error('     kaiten - 6 conveyor belt sushi images');
    console.error('     all    - All 15 images');
    process.exit(1);
  }
  
  const images = BATCHES[batchName];
  const startTime = Date.now();
  
  // Process
  const results = await processBatch(images, batchName);
  
  // Summary
  const duration = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   📊 GENERATION COMPLETE                               ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`   Success: ${results.success.length}/${images.length}`);
  console.log(`   Failed:  ${results.failed.length}/${images.length}`);
  console.log(`   Time:    ${minutes}m ${seconds}s`);
  console.log(`   Output:  ${OUTPUT_BASE}/`);
  console.log('');
  
  if (results.success.length > 0) {
    console.log('✅ Generated images:');
    results.success.forEach(s => {
      console.log(`   ✓ ${s.filename} (${s.size}KB)`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('');
    console.log('⚠️  Failed images (retry with: node generate-pollinations-url.js ' + batchName + '):');
    results.failed.forEach(f => {
      console.log(`   - ${f.id}: ${f.error}`);
    });
  }
  
  console.log('');
  console.log('💡 Tips:');
  console.log('   - Images save to: sites/shared-images/');
  console.log('   - Each generation uses a random seed for variety');
  console.log('   - Run again to get different versions');
  console.log('   - No watermark thanks to nologo=true parameter');
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
