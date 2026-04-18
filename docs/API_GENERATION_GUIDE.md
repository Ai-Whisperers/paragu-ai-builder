# 🚀 Gemini API Image Generation - Quick Start

**Status**: ✅ Automation Ready  
**API Key**: Configured (AIzaSyBitObgYEugKf_UkaBdvBbh4FE1KJN7D-k)  
**Total Images to Generate**: 74 (Foundation Phase) → 444 (Complete Library)

---

## 📦 Prerequisites (Already Installed)

✅ `@google/generative-ai` - Gemini API client  
✅ `sharp` - Image optimization  
✅ `glob` - File pattern matching

---

## 🎯 Quick Start - Generate Images NOW

### **Step 1: Generate Day 1 Heroes (20 images)**

```bash
cd /home/ai-whisperers/paragu-ai-builder
node scripts/generate-images.js heroes
```

**What this does:**
- Generates all 17 business type hero backgrounds
- Generates 3 working tenant hero backgrounds  
- Saves to `sites/shared-images/heroes/`
- Takes ~20-25 minutes (with 5-second delays between requests)
- Shows progress in real-time

**Expected output:**
```
[1/20] Generating: hero-peluqueria
  ✅ Success (245KB) -> heroes/hero-peluqueria.jpg
[2/20] Generating: hero-barberia
  ✅ Success (198KB) -> heroes/hero-barberia.jpg
...
```

---

### **Step 2: Generate Team Templates (34 images)**

```bash
node scripts/generate-images.js team
```

**What this does:**
- Generates 17 male professional headshots
- Generates 17 female professional headshots
- Saves to `sites/shared-images/team/`
- Takes ~35-40 minutes

---

### **Step 3: Generate Service Images (20 images)**

```bash
node scripts/generate-images.js services
```

**What this does:**
- Generates 20 service category images
- Saves to `sites/shared-images/services/`
- Takes ~20-25 minutes

---

### **Step 4: Generate Everything at Once (74 images)**

```bash
node scripts/generate-images.js all
```

**⚠️ Warning**: This takes ~80-90 minutes (1.5 hours)

---

## 📊 Available Batches

| Command | Images | Time | Description |
|---------|--------|------|-------------|
| `heroes` | 20 | ~25 min | Day 1: All hero backgrounds |
| `team` | 34 | ~40 min | Day 2-3: Team headshots |
| `services` | 20 | ~25 min | Day 3: Service images |
| `day-1` | 20 | ~25 min | Same as heroes |
| `day-2-3` | 34 | ~40 min | Same as team |
| `day-3` | 20 | ~25 min | Same as services |
| `all` | 74 | ~90 min | Complete foundation |

---

## 🗂️ Generated File Structure

After running the scripts, you'll have:

```
sites/
├── shared-images/
│   ├── heroes/
│   │   ├── hero-peluqueria.jpg
│   │   ├── hero-barberia.jpg
│   │   ├── hero-salon-belleza.jpg
│   │   ├── hero-spa.jpg
│   │   ├── hero-estetica.jpg
│   │   ├── hero-maquillaje.jpg
│   │   ├── hero-unas.jpg
│   │   ├── hero-pestanas.jpg
│   │   ├── hero-gimnasio.jpg
│   │   ├── hero-depilacion.jpg
│   │   ├── hero-consultoria.jpg
│   │   ├── hero-legal.jpg
│   │   ├── hero-relocation.jpg
│   │   ├── hero-meal-prep.jpg
│   │   ├── hero-tatuajes.jpg
│   │   ├── hero-diseno-grafico.jpg
│   │   └── hero-inmobiliaria.jpg
│   ├── team/
│   │   ├── team-male-business-1.jpg
│   │   ├── team-male-business-2.jpg
│   │   ├── team-male-business-3.jpg
│   │   ├── team-male-creative-1.jpg
│   │   ├── team-male-barber-1.jpg
│   │   ├── team-male-trainer-1.jpg
│   │   ├── team-male-tattoo-artist-1.jpg
│   │   ├── team-male-medical-1.jpg
│   │   ├── team-male-spa-therapist-1.jpg
│   │   ├── team-male-consultant-1.jpg
│   │   ├── team-male-realtor-1.jpg
│   │   ├── team-male-chef-1.jpg
│   │   ├── team-male-makeup-artist-1.jpg
│   │   ├── team-male-designer-1.jpg
│   │   ├── team-male-lawyer-1.jpg
│   │   ├── team-male-relocation-1.jpg
│   │   ├── team-male-nail-tech-1.jpg
│   │   ├── team-female-business-1.jpg
│   │   ├── team-female-business-2.jpg
│   │   ├── team-female-stylist-1.jpg
│   │   ├── team-female-makeup-artist-1.jpg
│   │   ├── team-female-spa-therapist-1.jpg
│   │   ├── team-female-esthetician-1.jpg
│   │   ├── team-female-nail-artist-1.jpg
│   │   ├── team-female-trainer-1.jpg
│   │   ├── team-female-realtor-1.jpg
│   │   ├── team-female-medical-1.jpg
│   │   ├── team-female-lash-artist-1.jpg
│   │   ├── team-female-tattoo-artist-1.jpg
│   │   ├── team-female-consultant-1.jpg
│   │   ├── team-female-lawyer-1.jpg
│   │   ├── team-female-relocation-1.jpg
│   │   ├── team-female-chef-1.jpg
│   │   └── team-female-designer-1.jpg
│   └── services/
│       ├── service-hair-cut.jpg
│       ├── service-hair-color.jpg
│       ├── service-blow-dry.jpg
│       ├── service-manicure.jpg
│       ├── service-facial.jpg
│       ├── service-massage.jpg
│       ├── service-makeup.jpg
│       ├── service-lash-extensions.jpg
│       ├── service-personal-training.jpg
│       ├── service-group-class.jpg
│       ├── service-laser-treatment.jpg
│       ├── service-body-treatment.jpg
│       ├── service-consultation.jpg
│       ├── service-legal-review.jpg
│       ├── service-property-showing.jpg
│       ├── service-meal-prep.jpg
│       ├── service-tattoo-session.jpg
│       ├── service-design-work.jpg
│       ├── service-barber-cut.jpg
│       └── service-barber-shave.jpg
├── nexa-paraguay/images/
│   └── nexa-paraguay-hero-bg.jpg
├── nexa-uruguay/images/
│   └── nexa-uruguay-hero-bg.jpg
└── nexa-propiedades/images/
    └── nexa-propiedades-hero-bg.jpg
```

---

## 🔄 Complete Workflow

### **Phase 1: Generate (Now)**
```bash
# Generate all foundation images
node scripts/generate-images.js all
```

### **Phase 2: Optimize**
```bash
# Compress and resize for web
node scripts/optimize-images.js sites/shared-images sites/shared-images-optimized
```

### **Phase 3: Integrate**
```bash
# Update content JSON files with image paths
node scripts/update-content-images.js
```

### **Phase 4: Deploy**
```bash
# Build and deploy updated sites
npm run build
./deploy-master.sh
```

---

## 💰 Cost Estimation

**Your API Key**: Free tier with postpay  
**Cost per image**: ~$0.0025 (very cheap!)  
**74 images**: ~$0.19 total  
**444 images**: ~$1.11 total

**Practically free!** 💸

---

## ⚡ Tips for Best Results

### **1. Run During Off-Peak Hours**
- Gemini API may be slower during peak US hours
- Best times: Early morning or late night Paraguay time

### **2. If Generation Fails**
The script will:
- ✅ Show which images failed
- ✅ Continue with next image
- ✅ You can re-run the same batch
- ✅ Already-generated images will be skipped

### **3. Rate Limiting**
- Script waits 5 seconds between requests (automatic)
- Prevents API rate limit errors
- Keeps your account healthy

### **4. Image Quality**
- All images are generated at high resolution
- Gemini 2.0 Flash creates professional-quality images
- Perfect for business websites

---

## 🛠️ Troubleshooting

### **"Error: No API key provided"**
```bash
# Set API key as environment variable
export GEMINI_API_KEY=AIzaSyBitObgYEugKf_UkaBdvBbh4FE1KJN7D-k

# Or edit the script and replace YOUR_API_KEY_HERE
nano scripts/generate-images.js
```

### **"Error: No image generated"**
- This happens occasionally with AI generation
- Just re-run the batch - failed images will retry
- Some prompts may need tweaking (let me know which ones fail)

### **Images look weird or distorted**
- AI isn't perfect - some images may have artifacts
- You can manually regenerate specific images
- Or use them anyway - web resolution hides small issues

### **Process takes too long**
- This is normal - 5-second delays prevent rate limits
- Let it run in the background
- Or run smaller batches (heroes, then team, then services)

---

## 📈 Next Steps After Foundation (74 images)

Want to generate the remaining 370+ portfolio images? I can create additional batches:

### **Phase 2: Portfolio Images (Day 4-7)**
- Tatuajes portfolio: 50 images
- Maquillaje portfolio: 30 images  
- Uñas portfolio: 30 images
- Peluqueria portfolio: 20 images
- Barberia portfolio: 20 images
- etc.

### **Phase 3: Before/After (Day 7)**
- Estetica: 20 before/after pairs
- Maquillaje: 5 pairs
- Uñas: 5 pairs
- Barberia: 5 pairs
- Depilacion: 5 pairs

**Just ask and I'll create the additional batch scripts!**

---

## 🎉 You're Ready!

**Run this command to start generating:**

```bash
cd /home/ai-whisperers/paragu-ai-builder && node scripts/generate-images.js heroes
```

**Then watch the magic happen!** ✨

The script will:
1. Connect to Gemini API
2. Generate images one by one
3. Show progress
4. Save to correct folders
5. Report results

---

## 📞 Need Help?

**If something goes wrong, tell me:**
- Which batch you ran
- What error message appeared
- Which specific images failed

I can help troubleshoot and fix any issues!

---

**Ready to generate your first batch of 20 hero images?** 🚀
