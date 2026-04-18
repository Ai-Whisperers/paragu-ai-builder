# 🎨 How to Generate Images with Google Gemini

**Tool**: Google Gemini (gemini.google.com)  
**Cost**: Free  
**Quality**: Professional-grade for web use

---

## 📋 Step-by-Step Guide

### Step 1: Access Gemini
1. Go to **gemini.google.com**
2. Sign in with your Google account
3. Make sure you're using **Gemini 2.0** or newer

### Step 2: Copy a Prompt
From the prompts below (or from `docs/IMAGE_PROMPTS_QUICK_REFERENCE.md`), copy one prompt at a time.

### Step 3: Generate
1. Paste the prompt into Gemini
2. Add at the end: `Generate high quality, photorealistic image. Professional photography style.`
3. Press Enter
4. Wait 10-30 seconds for generation

### Step 4: Download
1. Right-click on the generated image
2. Select "Save image as..."
3. Use the filename suggested below each prompt
4. Save to: `sites/{tenant}/images/`

### Step 5: Optimize
Run the optimization script:
```bash
cd /home/ai-whisperers/paragu-ai-builder

# Option A: Using Bash script (requires ImageMagick)
./scripts/optimize-images.sh sites sites-optimized

# Option B: Using Node.js script (requires sharp)
npm install sharp glob
node scripts/optimize-images.js sites sites-optimized
```

---

## 🔴 PRIORITY 1: Generate These 6 Images First

### 1. Nexa Paraguay Hero
**Filename**: `nexa-paraguay-hero-bg.jpg`  
**Save to**: `sites/nexa-paraguay/images/`

**Prompt**:
```
Wide-angle professional photograph of modern Asunción Paraguay skyline at golden hour sunset, showing the iconic buildings and lush greenery. Warm golden light reflecting off glass buildings, clear blue sky with soft clouds. Professional business atmosphere, inviting and aspirational. High-end real estate photography style. Shot from elevated vantage point. 8K quality, super detailed, professional color grading.

Generate high quality, photorealistic image. Professional photography style.
```

---

### 2. Nexa Uruguay Hero
**Filename**: `nexa-uruguay-hero-bg.jpg`  
**Save to**: `sites/nexa-uruguay/images/`

**Prompt**:
```
Breathtaking panoramic photograph of Montevideo Uruguay skyline at sunset, showing iconic Palacio Salvo and modern Torres Nauticas along Rambla. Golden hour light reflecting on Rio de la Plata, dramatic sky with pink and orange clouds. World-class cityscape photography. Cinematic composition, ultra-wide angle, 8K quality, professional color grading.

Generate high quality, photorealistic image. Professional photography style.
```

---

### 3. Nexa Propiedades Hero
**Filename**: `nexa-propiedades-hero-bg.jpg`  
**Save to**: `sites/nexa-propiedades/images/`

**Prompt**:
```
Stunning luxury modern house exterior in premium Asunción Paraguay neighborhood, contemporary architecture with clean lines, large glass windows, swimming pool with crystal clear water reflecting blue sky, manicured tropical garden with palm trees. Golden hour lighting, aspirational lifestyle. Professional real estate photography, wide angle, 8K ultra-detailed, magazine quality.

Generate high quality, photorealistic image. Professional photography style.
```

---

### 4. Male Agent Headshot
**Filename**: `agent-male-1.jpg`  
**Save to**: `sites/nexa-propiedades/images/agents/`

**Prompt**:
```
Professional headshot of confident male Paraguayan real estate agent in his 30s, wearing professional navy suit with tie, friendly approachable smile, neutral studio background, soft professional lighting. Corporate portrait style, high-end executive look. 8K ultra-detailed, sharp focus on face.

Generate high quality, photorealistic image. Professional photography style.
```

---

### 5. Female Agent Headshot
**Filename**: `agent-female-1.jpg`  
**Save to**: `sites/nexa-propiedades/images/agents/`

**Prompt**:
```
Professional headshot of confident female Paraguayan real estate agent in her 30s, elegant professional attire in earth tones, warm genuine smile, neutral studio background, soft professional lighting. Approachable expert appearance. Corporate portrait style, 8K ultra-detailed.

Generate high quality, photorealistic image. Professional photography style.
```

---

### 6. Property Purchase Service
**Filename**: `service-property-purchase.jpg`  
**Save to**: `sites/nexa-propiedades/images/services/`

**Prompt**:
```
Happy couple receiving house keys from professional real estate agent in modern Paraguay home, all smiling, bright interior with natural light, house plants, professional attire. Celebrating successful purchase. Warm welcoming atmosphere, lifestyle photography, 8K quality, authentic emotions.

Generate high quality, photorealistic image. Professional photography style.
```

---

## 🚀 Quick Generation Checklist

```
□ 1. Open gemini.google.com
□ 2. Copy first prompt from above
□ 3. Paste and generate
□ 4. Download with correct filename
□ 5. Save to correct folder
□ 6. Repeat for all 6 critical images
□ 7. Run optimization script
□ 8. Update content JSON files
□ 9. Test on websites
```

---

## 💡 Pro Tips

### For Best Results:
- Use **Gemini 2.0 Flash** or **Gemini 2.0 Pro**
- Add "8K quality, ultra-detailed" to all prompts
- Generate one image at a time (better quality)
- Download in highest resolution available
- Use PNG if available, otherwise JPG

### File Naming Convention:
- Use lowercase
- Use hyphens (-) not spaces
- Include descriptive keywords
- Always use .jpg extension

### Example File Structure:
```
sites/
├── nexa-paraguay/
│   └── images/
│       ├── nexa-paraguay-hero-bg.jpg
│       ├── paraguay-business-district.jpg
│       ├── paraguay-real-estate-aerial.jpg
│       ├── paraguay-quality-of-life.jpg
│       ├── process-consultation.jpg
│       ├── process-documents.jpg
│       ├── process-arrival.jpg
│       ├── process-banking.jpg
│       ├── process-completion.jpg
│       └── blog-immigration-guide.jpg
├── nexa-uruguay/
│   └── images/
│       ├── nexa-uruguay-hero-bg.jpg
│       ├── uruguay-financial-district.jpg
│       ├── uruguay-culture-lifestyle.jpg
│       ├── uruguay-education.jpg
│       └── [process images]
└── nexa-propiedades/
    └── images/
        ├── nexa-propiedades-hero-bg.jpg
        ├── agents/
        │   ├── agent-male-1.jpg
        │   └── agent-female-1.jpg
        ├── services/
        │   ├── service-property-purchase.jpg
        │   ├── service-property-sale.jpg
        │   ├── service-rentals.jpg
        │   ├── service-legal.jpg
        │   ├── service-investment.jpg
        │   └── service-renovation.jpg
        ├── properties/
        │   ├── property-luxury-interior-1.jpg
        │   ├── property-kitchen-1.jpg
        │   └── property-exterior-1.jpg
        └── neighborhoods/
            ├── neighborhood-las-carmelitas.jpg
            └── neighborhood-villa-morra.jpg
```

---

## 🎯 Next Steps After Generation

1. **Create folders**:
```bash
mkdir -p sites/nexa-paraguay/images
mkdir -p sites/nexa-uruguay/images  
mkdir -p sites/nexa-propiedades/images/{agents,services,properties,neighborhoods}
```

2. **Move images** to correct folders

3. **Run optimization**:
```bash
./scripts/optimize-images.sh
```

4. **Update content files** (I can help with this step)

---

## 📊 Expected Time Investment

| Task | Time |
|------|------|
| Generate 6 critical images | 30-45 minutes |
| Download and organize | 10 minutes |
| Optimize images | 5 minutes |
| Update content files | 15 minutes |
| **Total** | **~1 hour** |

---

**Ready to start? Copy the first prompt and head to gemini.google.com!** 🎨
