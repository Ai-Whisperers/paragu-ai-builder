/**
 * Update Content JSON Files with Image Paths
 * Automatically adds image references to site content files
 * 
 * Usage:
 *   node update-content-images.js
 * 
 * This script will:
 * 1. Scan sites/{tenant}/images/ folders
 * 2. Update corresponding content/*.json files
 * 3. Add backgroundImage and imageUrl references
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

const SITES = [
  {
    name: 'nexa-paraguay',
    contentFile: 'sites/nexa-paraguay/content/es.json',
    imagesDir: 'sites/nexa-paraguay/images'
  },
  {
    name: 'nexa-uruguay',
    contentFile: 'sites/nexa-uruguay/content/es.json',
    imagesDir: 'sites/nexa-uruguay/images'
  },
  {
    name: 'nexa-propiedades',
    contentFile: 'sites/nexa-propiedades/content/es.json',
    imagesDir: 'sites/nexa-propiedades/images'
  }
];

async function getImagesForSite(imagesDir) {
  const patterns = [
    `${imagesDir}/**/*.jpg`,
    `${imagesDir}/**/*.jpeg`,
    `${imagesDir}/**/*.png`,
    `${imagesDir}/**/*.webp`
  ];
  
  let images = [];
  for (const pattern of patterns) {
    const matches = glob.sync(pattern);
    images = images.concat(matches);
  }
  
  return [...new Set(images)].map(img => ({
    fullPath: img,
    relativePath: path.relative(imagesDir, img),
    filename: path.basename(img, path.extname(img)),
    category: path.dirname(path.relative(imagesDir, img))
  }));
}

async function updateNexaParaguay(content, images) {
  const heroImage = images.find(i => i.filename.includes('hero') || i.filename.includes('paraguay-hero'));
  if (heroImage) {
    content.home.hero.backgroundImage = `/sites/nexa-paraguay/images/${heroImage.relativePath}`;
    console.log('  ✓ Added hero background image');
  }
  
  // Update Why Paraguay cards
  if (content.home.trust && content.home.trust.items) {
    const businessImg = images.find(i => i.filename.includes('business') || i.filename.includes('economic'));
    const investmentImg = images.find(i => i.filename.includes('investment') || i.filename.includes('real-estate'));
    const lifestyleImg = images.find(i => i.filename.includes('lifestyle') || i.filename.includes('quality'));
    
    if (businessImg) content.home.trust.items[0].imageUrl = `/sites/nexa-paraguay/images/${businessImg.relativePath}`;
    if (investmentImg) content.home.trust.items[1].imageUrl = `/sites/nexa-paraguay/images/${investmentImg.relativePath}`;
    if (lifestyleImg) content.home.trust.items[2].imageUrl = `/sites/nexa-paraguay/images/${lifestyleImg.relativePath}`;
    
    console.log('  ✓ Updated Why Paraguay card images');
  }
  
  // Update process timeline
  const processImages = images.filter(i => i.filename.includes('process'));
  if (content.home.process && content.home.process.steps) {
    content.home.process.steps.forEach((step, index) => {
      if (processImages[index]) {
        step.imageUrl = `/sites/nexa-paraguay/images/${processImages[index].relativePath}`;
      }
    });
    console.log('  ✓ Updated process timeline images');
  }
  
  return content;
}

async function updateNexaUruguay(content, images) {
  const heroImage = images.find(i => i.filename.includes('hero') || i.filename.includes('uruguay-hero'));
  if (heroImage) {
    content.home.hero.backgroundImage = `/sites/nexa-uruguay/images/${heroImage.relativePath}`;
    console.log('  ✓ Added hero background image');
  }
  
  // Update Why Uruguay cards
  if (content.home.whyCountry && content.home.whyCountry.features) {
    const financialImg = images.find(i => i.filename.includes('financial') || i.filename.includes('economic'));
    const cultureImg = images.find(i => i.filename.includes('culture') || i.filename.includes('lifestyle'));
    const educationImg = images.find(i => i.filename.includes('education') || i.filename.includes('safety'));
    
    if (financialImg) content.home.whyCountry.features[0].imageUrl = `/sites/nexa-uruguay/images/${financialImg.relativePath}`;
    if (cultureImg) content.home.whyCountry.features[1].imageUrl = `/sites/nexa-uruguay/images/${cultureImg.relativePath}`;
    if (educationImg) content.home.whyCountry.features[2].imageUrl = `/sites/nexa-uruguay/images/${educationImg.relativePath}`;
    
    console.log('  ✓ Updated Why Uruguay card images');
  }
  
  return content;
}

async function updateNexaPropiedades(content, images) {
  const heroImage = images.find(i => i.filename.includes('hero') || i.filename.includes('propiedades-hero'));
  if (heroImage) {
    content.home.hero.backgroundImage = `/sites/nexa-propiedades/images/${heroImage.relativePath}`;
    console.log('  ✓ Added hero background image');
  }
  
  // Update services
  if (content.services && content.services.services) {
    content.services.services.forEach(service => {
      const serviceName = service.name.toLowerCase().replace(/\s+/g, '-');
      const serviceImg = images.find(i => 
        i.filename.includes(serviceName) || 
        i.filename.includes(service.name.toLowerCase().split(' ')[0])
      );
      
      if (serviceImg) {
        service.imageUrl = `/sites/nexa-propiedades/images/${serviceImg.relativePath}`;
      }
    });
    console.log('  ✓ Updated service images');
  }
  
  return content;
}

async function updateSite(site) {
  console.log(`\n📝 Updating ${site.name}...`);
  
  try {
    // Check if content file exists
    await fs.access(site.contentFile);
    
    // Read content file
    const contentData = await fs.readFile(site.contentFile, 'utf8');
    let content = JSON.parse(contentData);
    
    // Get images
    const images = await getImagesForSite(site.imagesDir);
    
    if (images.length === 0) {
      console.log(`  ⚠️  No images found in ${site.imagesDir}`);
      return;
    }
    
    console.log(`  📸 Found ${images.length} images`);
    
    // Update based on site type
    switch (site.name) {
      case 'nexa-paraguay':
        content = await updateNexaParaguay(content, images);
        break;
      case 'nexa-uruguay':
        content = await updateNexaUruguay(content, images);
        break;
      case 'nexa-propiedades':
        content = await updateNexaPropiedades(content, images);
        break;
    }
    
    // Backup original
    const backupFile = `${site.contentFile}.backup.${Date.now()}`;
    await fs.copyFile(site.contentFile, backupFile);
    
    // Write updated content
    await fs.writeFile(site.contentFile, JSON.stringify(content, null, 2));
    
    console.log(`  ✅ Updated ${site.contentFile}`);
    console.log(`  💾 Backup saved to ${backupFile}`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`  ⚠️  Content file not found: ${site.contentFile}`);
    } else {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🎨 Content Image Updater');
  console.log('========================\n');
  
  for (const site of SITES) {
    await updateSite(site);
  }
  
  console.log('\n✨ Done!');
  console.log('\nNext steps:');
  console.log('1. Review the updated content files');
  console.log('2. Test the sites to ensure images load correctly');
  console.log('3. If issues, restore from backup files');
}

main().catch(console.error);
