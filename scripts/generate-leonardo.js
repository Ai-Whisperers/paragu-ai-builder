#!/usr/bin/env node
/**
 * Leonardo.Ai Image Generation Automation Script
 * Generates all images for Paragu-AI Builder using Leonardo.Ai API
 * 
 * Usage:
 *   export LEONARDO_API_KEY=your_key_here
 *   node generate-leonardo.js [batch-name]
 * 
 * Batches:
 *   - heroes (20 images) - Hero backgrounds
 *   - team (34 images) - Team headshots
   *   - services (20 images) - Service images
 *   - all (generates everything: 74 images)
 */

const fetch = globalThis.fetch || require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const API_KEY = process.env.LEONARDO_API_KEY || ''; // Get from Leonardo.Ai API Access
const BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';
const OUTPUT_BASE = 'sites/shared-images';
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds to respect rate limits
const POLLING_INTERVAL = 3000; // 3 seconds between status checks
const MAX_POLLING_ATTEMPTS = 30; // Max 90 seconds wait per image

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

// Function to generate image using Leonardo.Ai API
async function generateImage(prompt, outputPath, width, height) {
  try {
    console.log(`  🚀 Starting generation for: ${outputPath}`);
    
    // Step 1: Create generation
    const generationResponse = await fetch(`${BASE_URL}/generations`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${API_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        width: width,
        height: height,
        modelId: "de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3", // Leonardo Phoenix 1.0 (CORRECTED)
        num_images: 1,
        guidance_scale: 7,
        // Add contrast for better quality (required for Phoenix)
        contrast: 3.5,
        // Enhance prompt for better understanding
        enhancePrompt: false
      })
    });

    if (!generationResponse.ok) {
      const errorText = await generationResponse.text();
      throw new Error(`Generation failed: ${generationResponse.status} ${errorText}`);
    }

    const generationData = await generationResponse.json();
    const generationId = generationData.sdGenerationJob.generationId;
    
    console.log(`  📋 Generation ID: ${generationId}`);

    // Step 2: Poll for completion
    let attempts = 0;
    while (attempts < MAX_POLLING_ATTEMPTS) {
      await sleep(POLLING_INTERVAL);
      attempts++;
      
      const statusResponse = await fetch(`${BASE_URL}/generations/${generationId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${API_KEY}`
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      const generations = statusData.generations;
      
      if (generations && generations.length > 0) {
        const gen = generations[0];
        if (gen.status === "COMPLETE") {
          // Get the image URL
          const imageUrl = gen.url || gen.images[0]?.url;
          
          if (!imageUrl) {
            throw new Error('No image URL in completed generation');
          }
          
          console.log(`  🖼️  Image ready: ${imageUrl}`);
          
          // Step 3: Download the image
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) {
            throw new Error(`Image download failed: ${imageResponse.status}`);
          }
          
          const imageBuffer = await imageResponse.buffer();
          
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
        } else if (gen.status === "FAILED") {
          throw new Error(`Generation failed: ${gen.failureReason || 'Unknown reason'}`);
        }
        // Still processing, continue polling
        process.stdout.write(`  ⏳ Attempt ${attempts}/${MAX_POLLING_ATTEMPTS}... \r`);
      }
    }
    
    throw new Error(`Generation timed out after ${MAX_POLLING_ATTEMPTS * POLLING_INTERVAL / 1000} seconds`);
    
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
    
    // Rate limiting between generations
    if (i < prompts.length - 1) {
      process.stdout.write(`  ⏳ Waiting ${DELAY_BETWEEN_REQUESTS/1000}s before next generation...`);
      await sleep(DELAY_BETWEEN_REQUESTS);
      process.stdout.write('\r' + ' '.repeat(50) + '\r');
    }
  }
  
  return results;
}

async function main() {
  const batchName = process.argv[2] || 'all';
  
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🎨 Paragu-AI Image Generation Automation             ║');
  console.log('║   Powered by Leonardo.Ai API                           ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Validate API key
  if (!API_KEY) {
    console.error('❌ Error: No Leonardo.Ai API key provided');
    console.error('   Set LEONARDO_API_KEY environment variable');
    console.error('   Get your key from: https://cloud.leonardo.ai/api/rest-v1/account-info');
    console.error('   (Navigate to API Access in Leonardo web app)');
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