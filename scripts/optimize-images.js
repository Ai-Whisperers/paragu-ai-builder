/**
 * Image Optimization Tool - Node.js Version
 * Cross-platform image compression and resizing
 * 
 * Usage:
 *   node optimize-images.js [input_folder] [output_folder]
 * 
 * Requirements:
 *   npm install sharp glob
 */

const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs').promises;
const path = require('path');

// Configuration for different image types
const IMAGE_CONFIGS = {
  hero: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    format: 'jpg'
  },
  agent: {
    maxWidth: 600,
    maxHeight: 600,
    quality: 90,
    format: 'jpg'
  },
  service: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 85,
    format: 'jpg'
  },
  property: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 85,
    format: 'jpg'
  },
  process: {
    maxWidth: 600,
    maxHeight: 400,
    quality: 85,
    format: 'jpg'
  },
  blog: {
    maxWidth: 1200,
    maxHeight: 630,
    quality: 85,
    format: 'jpg'
  },
  default: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    format: 'jpg'
  }
};

function getImageConfig(filename) {
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('hero')) return IMAGE_CONFIGS.hero;
  if (lowerName.includes('agent') || lowerName.includes('headshot')) return IMAGE_CONFIGS.agent;
  if (lowerName.includes('service')) return IMAGE_CONFIGS.service;
  if (lowerName.includes('property') || lowerName.includes('neighborhood')) return IMAGE_CONFIGS.property;
  if (lowerName.includes('process')) return IMAGE_CONFIGS.process;
  if (lowerName.includes('blog')) return IMAGE_CONFIGS.blog;
  
  return IMAGE_CONFIGS.default;
}

async function optimizeImage(inputPath, outputPath) {
  const filename = path.basename(inputPath);
  const config = getImageConfig(filename);
  
  try {
    // Get original stats
    const originalStats = await fs.stat(inputPath);
    const originalSize = originalStats.size;
    
    // Process image with Sharp
    let pipeline = sharp(inputPath);
    
    // Get metadata
    const metadata = await pipeline.metadata();
    const { width, height } = metadata;
    
    // Resize if needed
    if (width > config.maxWidth || height > config.maxHeight) {
      pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Apply output settings
    pipeline = pipeline
      .jpeg({
        quality: config.quality,
        progressive: true,
        mozjpeg: true,
        force: false
      })
      .png({
        quality: config.quality,
        progressive: true,
        compressionLevel: 9,
        force: false
      })
      .webp({
        quality: config.quality,
        effort: 6,
        force: false
      });
    
    // Save optimized image
    await pipeline.toFile(outputPath);
    
    // Get new stats
    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    const saved = originalSize - newSize;
    const percent = Math.round((saved / originalSize) * 100);
    
    return {
      success: true,
      filename,
      originalSize: Math.round(originalSize / 1024),
      newSize: Math.round(newSize / 1024),
      saved: Math.round(saved / 1024),
      percent
    };
  } catch (error) {
    return {
      success: false,
      filename,
      error: error.message
    };
  }
}

async function main() {
  const inputDir = process.argv[2] || 'sites';
  const outputDir = process.argv[3] || 'sites-optimized';
  
  console.log('🔧 Paragu-AI Image Optimizer (Node.js)');
  console.log('=====================================');
  console.log(`Input: ${inputDir}`);
  console.log(`Output: ${outputDir}\n`);
  
  // Find all images
  const patterns = [
    `${inputDir}/**/*.jpg`,
    `${inputDir}/**/*.jpeg`,
    `${inputDir}/**/*.png`,
    `${inputDir}/**/*.webp`
  ];
  
  let allImages = [];
  for (const pattern of patterns) {
    const matches = glob.sync(pattern);
    allImages = allImages.concat(matches);
  }
  
  // Remove duplicates
  allImages = [...new Set(allImages)];
  
  if (allImages.length === 0) {
    console.log('❌ No images found in input directory');
    console.log('\nMake sure you have:');
    console.log('1. Generated images using Gemini');
    console.log('2. Placed them in the sites/{tenant}/images/ folders');
    process.exit(1);
  }
  
  console.log(`🔍 Found ${allImages.length} images to optimize\n`);
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  
  // Process each image
  const results = [];
  let totalSaved = 0;
  let successCount = 0;
  
  for (let i = 0; i < allImages.length; i++) {
    const inputPath = allImages[i];
    const relativePath = path.relative(inputDir, inputPath);
    const outputPath = path.join(outputDir, relativePath);
    
    // Create output subdirectory
    const outputSubdir = path.dirname(outputPath);
    await fs.mkdir(outputSubdir, { recursive: true });
    
    // Show progress
    process.stdout.write(`[${i + 1}/${allImages.length}] Processing ${path.basename(inputPath)}... `);
    
    const result = await optimizeImage(inputPath, outputPath);
    results.push(result);
    
    if (result.success) {
      console.log(`✓ ${result.originalSize}KB → ${result.newSize}KB (${result.percent}% smaller)`);
      totalSaved += result.saved;
      successCount++;
    } else {
      console.log(`✗ Error: ${result.error}`);
    }
  }
  
  // Summary
  console.log('\n=====================================');
  console.log('✅ Optimization Complete!');
  console.log(`Images processed: ${successCount}/${allImages.length}`);
  console.log(`Total size saved: ${totalSaved} KB`);
  console.log(`\nOptimized images saved to: ${outputDir}/`);
  console.log('\nNext steps:');
  console.log('1. Review optimized images');
  console.log('2. Copy to sites/{tenant}/images/ folders');
  console.log('3. Update content JSON files');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
