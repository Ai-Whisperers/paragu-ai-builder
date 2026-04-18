#!/usr/bin/env node
/**
 * Pollinations Image Generation Automation Script
 * Generates all images for Paragu-AI Builder using Pollinations API
 * 
 * Usage:
 *   export POLLINATIONS_API_KEY=sk_JNzA2U9q9lcGhUAPJBwk7pPL8bOCDlFK
 *   node generate-pollinations.js [batch-name]
 * 
 * Batches:
 *   - heroes (20 images) - Hero backgrounds
 *   - team (34 images) - Team headshots
 *   - services (20 images) - Service images
 *   - all (generates everything: 74 images)
 */

// Use native fetch (Node.js v24+)
const fetch = globalThis.fetch || (() => {
  const nodeFetch = require('node-fetch');
  return nodeFetch.default || nodeFetch;
})();
const fs = require('fs').promises;
const path = require('path');

// Configuration
const API_KEY = process.env.POLLINATIONS_API_KEY || 'sk_JNzA2U9q9lcGhUAPJBwk7pPL8bOCDlFK';
const OUTPUT_BASE = 'sites/shared-images';
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds to be nice to free API

// Image specifications
const SPECS = {
  hero: { width: 1920, height: 1080 },
  team: { width: 600, height: 600 },
  service: { width: 800, height: 600 }
};

// Helper function to sleep
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to generate image using Pollinations API
async function generateImage(prompt, outputPath, width, height) {
  try {
    // Pollinations API endpoint with API key
    const url = `https://api.pollinations.ai/generate/image`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        width: width,
        height: height,
        model: 'flux', // Using FLUX model for quality
        nologo: true, // No watermark
        private: false, // Allow public access
        enhance: true // Enhance prompt understanding
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${await response.text()}`);
    }

    // Get the image data as ArrayBuffer, then convert to Buffer
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    
    // Save image
    await fs.writeFile(outputPath, imageBuffer);
    
    return {
      success: true,
      size: imageBuffer.length,
      path: outputPath
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to parse prompt files and extract actual prompts
function parsePromptFile(content) {
  const lines = content.split('\n');
  const prompts = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip comments, empty lines, and metadata lines
    if (trimmed && 
        !trimmed.startsWith('#') && 
        !trimmed.startsWith('##') && 
        !trimmed.startsWith('Save as:') && 
        !trimmed.startsWith('Location:') && 
        !trimmed.startsWith('---')) {
      prompts.push(trimmed);
    }
  }
  
  return prompts;
}

// Load prompts from files
async function loadPromptsFromFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const prompts = parsePromptFile(content);
    return prompts;
  } catch (error) {
    console.error(`Error reading prompts from ${filePath}:`, error.message);
    return [];
  }
}

// Define batches with their prompt files
const BATCHES = {
  heroes: {
    name: 'Hero Backgrounds',
    promptFile: 'prompts/batch-1-heroes.txt',
    type: 'hero',
    count: 20
  },
  team: {
    name: 'Team Headshots',
    promptFile: 'prompts/batch-2-team.txt',
    type: 'team',
    count: 34
  },
  services: {
    name: 'Service Images',
    promptFile: 'prompts/batch-3-services.txt',
    type: 'service',
    count: 20
  }
};

async function processBatch(batchKey) {
  const batch = BATCHES[batchKey];
  if (!batch) {
    throw new Error(`Unknown batch: ${batchKey}`);
  }
  
  console.log(`\n🎨 Processing batch: ${batch.name}`);
  console.log(`   Prompt file: ${batch.promptFile}`);
  console.log(`   Expected images: ${batch.count}`);
  console.log('');
  
  // Load prompts
  const prompts = await loadPromptsFromFile(batch.promptFile);
  if (prompts.length === 0) {
    console.error(`❌ No prompts loaded from ${batch.promptFile}`);
    return { success: [], failed: [] };
  }
  
  console.log(`   Loaded ${prompts.length} prompts`);
  
  const results = {
    success: [],
    failed: []
  };
  
  const spec = SPECS[batch.type];
  
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i].trim();
    if (!prompt) continue;
    
    // Generate a descriptive ID
    const id = `${batch.type}-${i + 1}`;
    const filename = `${batch.type}/${batch.type}-${i + 1}.jpg`;
    const outputPath = path.join(OUTPUT_BASE, filename);
    
    console.log(`[${i + 1}/${prompts.length}] Generating: ${id}`);
    
    const result = await generateImage(prompt, outputPath, spec.width, spec.height);
    
    if (result.success) {
      const sizeKB = Math.round(result.size / 1024);
      console.log(`  ✅ Success (${sizeKB}KB) -> ${filename}`);
      results.success.push({ id, path: filename, size: sizeKB });
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
      results.failed.push({ id, error: result.error });
    }
    
    // Rate limiting
    if (i < prompts.length - 1) {
      process.stdout.write(`  ⏳ Waiting ${DELAY_BETWEEN_REQUESTS/1000}s...`);
      await sleep(DELAY_BETWEEN_REQUESTS);
      process.stdout.write('\r' + ' '.repeat(30) + '\r');
    }
  }
  
  return results;
}

async function main() {
  const batchName = process.argv[2] || 'all';
  
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎨 Paragu-AI Image Generation Automation             ║');
  console.log('║   Powered by Pollinations AI with FLUX model           ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Validate API key
  if (!API_KEY || API_KEY.includes('YOUR_API_KEY')) {
    console.error('❌ Error: No valid Pollinations API key provided');
    console.error('   Set POLLINATIONS_API_KEY environment variable');
    console.error('   Get your key from: https://pollinations.ai/');
    process.exit(1);
  }
  
  let batchesToProcess;
  if (batchName === 'all') {
    batchesToProcess = Object.keys(BATCHES);
  } else if (BATCHES[batchName]) {
    batchesToProcess = [batchName];
  } else {
    console.error(`❌ Error: Unknown batch "${batchName}"`);
    console.error('   Available batches:');
    for (const [key, batch] of Object.entries(BATCHES)) {
      console.error(`     ${key.padEnd(10)} - ${batch.name}`);
    }
    process.exit(1);
  }
  
  const startTime = Date.now();
  let totalSuccess = 0;
  let totalFailed = 0;
  
  // Process each batch
  for (const batchKey of batchesToProcess) {
    const results = await processBatch(batchKey);
    totalSuccess += results.success.length;
    totalFailed += results.failed.length;
    
    // Show batch summary
    console.log(`\n📊 ${BATCHES[batchKey].name} Summary:`);
    console.log(`   Success: ${results.success.length}`);
    console.log(`   Failed:  ${results.failed.length}`);
    
    if (results.failed.length > 0) {
      console.log('   Failed items:');
      results.failed.slice(0, 5).forEach(f => { // Show first 5 failures
        console.log(`     - ${f.id}: ${f.error}`);
      });
      if (results.failed.length > 5) {
        console.log(`     ... and ${results.failed.length - 5} more`);
      }
    }
  }
  
  // Final summary
  const duration = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   📊 GENERATION COMPLETE                               ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`   Total Success: ${totalSuccess}`);
  console.log(`   Total Failed:  ${totalFailed}`);
  console.log(`   Time:          ${minutes}m ${seconds}s`);
  console.log(`   Output:        ${OUTPUT_BASE}/`);
  console.log('');
  
  if (totalFailed > 0) {
    console.log('⚠️  Some images failed to generate.');
    console.log('   You can retry failed batches later.');
  }
  
  if (totalSuccess > 0) {
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Review generated images in sites/shared-images/');
    console.log('   2. Run: node optimize-images.js (to compress images)');
    console.log('   3. Run: node update-content-images.js (to update JSON)');
    console.log('   4. Deploy your sites!');
  }
}

// Run main
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});