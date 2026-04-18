#!/usr/bin/env node
/**
 * Robust Pollinations Image Generation Automation Script
 * Handles timeouts, retries, and rate limiting for reliable generation
 * 
 * Usage:
 *   export POLLINATIONS_API_KEY=sk_JNzA2U9q9lcGhUAPJBwk7pPL8bOCDlFK
 *   node generate-pollinations-robust.js [batch-name]
 * 
 * Batches:
 *   - heroes (20 images) - Hero backgrounds
 *   - team (34 images) - Team headshots
 *   - services (20 images) - Service images
 *   - all (generates everything: 74 images)
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const API_KEY = process.env.POLLINATIONS_API_KEY || 'sk_JNzA2U9q9lcGhUAPJBwk7pPL8bOCDlFK';
const OUTPUT_BASE = 'sites/shared-images';

// Image specifications
const SPECS = {
  hero: { width: 1024, height: 576 },  // 16:9 ratio, smaller to reduce timeout
  team: { width: 512, height: 512 },   // 1:1 ratio
  service: { width: 800, height: 600 } // 4:3 ratio
};

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // Base delay between requests
const TIMEOUT_MS = 30000;   // 30 second timeout per request

// Helper function to sleep
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to generate image using Pollinations API with retry logic
async function generateImageWithRetry(prompt, outputPath, width, height) {
  let lastError = null;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`    🔄 Retry ${attempt}/${MAX_RETRIES} after ${delay}ms delay...`);
        await sleep(delay);
      }
      
      const result = await generateImage(prompt, outputPath, width, height);
      if (result.success) {
        return result;
      }
      lastError = result.error;
      
    } catch (error) {
      lastError = error.message;
      console.log(`    ⚠️  Attempt ${attempt + 1} failed: ${error.message}`);
    }
  }
  
  return {
    success: false,
    error: `Failed after ${MAX_RETRIES + 1} attempts. Last error: ${lastError}`
  };
}

// Function to generate image using Pollinations API
async function generateImage(prompt, outputPath, width, height) {
  return new Promise((resolve, reject) => {
    // URL encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux&private=false&enhance=true`;
    
    const req = https.get(url, (res) => {
      // Handle redirect (Pollinations sometimes redirects)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        https.get(res.headers.location, (redirectRes) => {
          handleResponse(redirectRes, resolve, reject, outputPath);
        }).on('error', (e) => reject(e));
        return;
      }
      
      handleResponse(res, resolve, reject, outputPath);
    });
    
    req.on('error', (e) => reject(e));
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      reject(new Error(`Request timeout after ${TIMEOUT_MS}ms`));
    });
  });
}

// Helper to handle HTTP response
function handleResponse(res, resolve, reject, outputPath) {
  if (res.statusCode === 200) {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        
        // Basic validation: check if it's likely an image
        if (buffer.length < 100) {
          reject(new Error(`Response too small (${buffer.length} bytes) - likely not an image`));
          return;
        }
        
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        await fs.mkdir(dir, { recursive: true });
        
        // Save image
        await fs.writeFile(outputPath, buffer);
        
        resolve({
          success: true,
          size: buffer.length,
          path: outputPath
        });
      } catch (error) {
        reject(error);
      }
    });
  } else if (res.statusCode === 429) {
    // Rate limited
    res.resume(); // consume response data
    reject(new Error('Rate limited (HTTP 429) - please wait before retrying'));
  } else if (res.statusCode >= 500) {
    // Server error
    res.resume(); // consume response data
    reject(new Error(`Server error (HTTP ${res.statusCode})`));
  } else {
    // Other client errors
    res.resume(); // consume response data
    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
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
  console.log(`   Settings: ${SPECS[batch.type].width}x${SPECS[batch.type].height}, max ${MAX_RETRIES} retries`);
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
    
    const result = await generateImageWithRetry(prompt, outputPath, spec.width, spec.height);
    
    if (result.success) {
      const sizeKB = Math.round(result.size / 1024);
      console.log(`  ✅ Success (${sizeKB}KB) -> ${filename}`);
      results.success.push({ id, path: filename, size: sizeKB });
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
      results.failed.push({ id, error: result.error });
    }
    
    // Rate limiting between generations (be nice to the free API)
    if (i < prompts.length - 1) {
      process.stdout.write(`  ⏳ Waiting ${BASE_DELAY_MS/1000}s before next generation...`);
      await sleep(BASE_DELAY_MS);
      process.stdout.write('\r' + ' '.repeat(50) + '\r');
    }
  }
  
  return results;
}

async function main() {
  const batchName = process.argv[2] || 'all';
  
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎨 Paragu-AI Image Generation Automation             ║');
  console.log('║   Powered by Pollinations AI (Robust Version)          ║');
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
    console.log('   You can retry failed batches later (they may succeed on retry).');
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