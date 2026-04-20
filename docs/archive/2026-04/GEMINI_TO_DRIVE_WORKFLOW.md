# Gemini Image Generation → Google Drive Workflow

## Overview
This guide explains how to save images generated in Gemini (gemini.google.com) to Google Drive so they can be downloaded and organized automatically.

---

## Why Use Google Drive?

**Problems with direct downloads:**
- ❌ Chrome downloads go to Downloads folder (messy)
- ❌ Files have random names
- ❌ Hard to organize 15+ images
- ❌ Manual sorting required

**Google Drive solution:**
- ✅ Files automatically synced
- ✅ Can use Google Drive Desktop app
- ✅ Files appear in local folder automatically
- ✅ Can run scripts to auto-organize

---

## METHOD 1: Google Drive Desktop App (Recommended)

### Step 1: Install Google Drive Desktop
1. Go to https://google.com/drive/download/
2. Download and install Google Drive for Desktop
3. Sign in with your Google account
4. Choose "Stream files" or "Mirror files" mode

### Step 2: Create Organized Folders

In your Google Drive, create this structure:
```
My Drive/
└── paragu-ai-images/
    ├── sushi_bar/
    │   ├── 01-hero/
    │   ├── 02-interior/
    │   ├── 03-food/
    │   └── 04-team/
    └── kaiten_zushi/
        ├── 01-hero/
        ├── 02-conveyor/
        └── 03-dining/
```

### Step 3: Set Up Auto-Sync

With Google Drive Desktop installed:
1. The `paragu-ai-images` folder appears at:
   - **Windows**: `C:\Users\[YourName]\Google Drive\paragu-ai-images`
   - **Mac**: `/Users/[YourName]/Google Drive/paragu-ai-images`
   - **Linux**: `~/Google Drive/paragu-ai-images`

2. When you save images to these folders, they sync automatically

---

## METHOD 2: Browser Extension (Quick Save)

### Using "Save to Google Drive" Chrome Extension

1. Install the extension:
   - Go to Chrome Web Store
   - Search "Save to Google Drive"
   - Install the official Google extension

2. When Gemini generates an image:
   - Right-click on the image
   - Select "Save to Google Drive"
   - Choose the folder (e.g., `paragu-ai-images/sushi_bar`)
   - Rename the file immediately

### Best Practice Naming Convention:
```
sushi-bar-hero-01.jpg
sushi-bar-interior-01.jpg
sushi-bar-sashimi-01.jpg
kaiten-hero-01.jpg
```

---

## METHOD 3: Direct Upload (Manual)

1. Generate image in Gemini (gemini.google.com)
2. Download to Downloads folder
3. Open Google Drive in browser (drive.google.com)
4. Navigate to your organized folder
5. Click "New" → "File upload"
6. Select the downloaded image
7. Rename it properly

---

## WORKFLOW FOR PARAGU-AI BUILDER

### For Sushi Bar Images

1. **Open Gemini**: https://gemini.google.com

2. **Copy prompt** from `prompts/batch-4-sushi.txt`

3. **Generate image**

4. **Save to Drive** (choose method):
   
   **Option A - Right-click method:**
   - Right-click on generated image
   - "Save image as..."
   - Navigate to `Google Drive/paragu-ai-images/sushi_bar/`
   - Name: `sushi-bar-hero-01.png`
   
   **Option B - Drag & Drop:**
   - Download to desktop first
   - Open drive.google.com
   - Drag file into correct folder
   - Rename

5. **Verify sync**: Check that file appears in local Google Drive folder

6. **Run organization script**:
   ```bash
   cd /home/ai-whisperers/paragu-ai-builder
   ./scripts/organize-downloads.sh
   ```

---

## AUTOMATION SCRIPT

### Script: `scripts/import-from-drive.sh`

Create this script to auto-import from Google Drive:

```bash
#!/bin/bash
# import-from-drive.sh
# Copies images from Google Drive to project folders

DRIVE_PATH="$HOME/Google Drive/paragu-ai-images"
PROJECT_PATH="/home/ai-whisperers/paragu-ai-builder/sites/shared-images"

echo "🔄 Importing images from Google Drive..."

# Copy sushi bar images
if [ -d "$DRIVE_PATH/sushi_bar" ]; then
    echo "📁 Copying sushi_bar images..."
    cp -v "$DRIVE_PATH/sushi_bar"/* "$PROJECT_PATH/sushi_bar/"
fi

# Copy kaiten images
if [ -d "$DRIVE_PATH/kaiten_zushi" ]; then
    echo "📁 Copying kaiten_zushi images..."
    cp -v "$DRIVE_PATH/kaiten_zushi"/* "$PROJECT_PATH/kaiten_zushi/"
fi

echo "✅ Import complete!"
echo "Run 'npm run optimize-images' to compress if needed."
```

Make it executable:
```bash
chmod +x scripts/import-from-drive.sh
```

---

## FILE ORGANIZATION GUIDE

### Recommended Folder Structure in Drive

```
paragu-ai-images/
├── README.txt (keep notes here)
├── batch-4-sushi/ (temporary workspace)
│   ├── 01-sushi-bar-hero.png
│   ├── 02-sushi-bar-interior.png
│   ├── 03-sushi-chef-action.png
│   ├── 04-sushi-sashimi.png
│   ├── 05-sushi-nigiri.png
│   ├── 06-sushi-maki.png
│   ├── 07-sushi-temaki.png
│   ├── 08-sushi-omakase.png
│   ├── 09-sushi-sake.png
│   ├── 10-kaiten-hero.png
│   ├── 11-kaiten-family.png
│   ├── 12-kaiten-tablet.png
│   └── ...
├── approved/ (final selected images)
└── archive/ (rejected alternatives)
```

---

## ALTERNATIVE: Use Shared Drive (Team Access)

If multiple people generating images:

1. Create a **Shared Drive** in Google Drive
2. Name it "Paragu-AI Images"
3. Add team members with "Editor" access
4. Everyone can save images there
5. You can download from shared drive anytime

---

## CHECKLIST FOR IMAGE GENERATION SESSION

Before starting:
- [ ] Open gemini.google.com in browser
- [ ] Open Google Drive in another tab
- [ ] Have prompts/batch-4-sushi.txt open
- [ ] Create batch folder in Drive

During generation:
- [ ] Generate one image at a time
- [ ] Save immediately to Drive (don't wait)
- [ ] Use consistent naming
- [ ] Verify file appears in Drive

After session:
- [ ] Run import-from-drive.sh
- [ ] Check files in sites/shared-images/
- [ ] Run optimize if needed
- [ ] Commit to git

---

## TIPS FOR BEST RESULTS

1. **Quality over quantity**: Generate 2-3 versions, pick best
2. **Check dimensions**: Gemini images vary in size
3. **Consistent style**: Use similar prompts for cohesive look
4. **Save immediately**: Don't lose work if browser crashes
5. **Name descriptively**: You'll forget which is which later

---

## QUICK REFERENCE

| Action | Windows | Mac | Linux |
|--------|---------|-----|-------|
| Open Google Drive | `Win + E` → Google Drive | Finder → Google Drive | `~/Google Drive` |
| Save image | Right-click → Save as | Right-click → Save | Right-click → Save |
| Sync status | Check Drive app | Check Finder | Check `ls -la` |
| Run import script | Git Bash | Terminal | Terminal |

---

## TROUBLESHOOTING

**Images not syncing?**
- Check Google Drive Desktop is running
- Check internet connection
- Look for sync status icons on files

**Wrong file names?**
- Rename in Drive before downloading
- Use consistent naming pattern
- Avoid spaces, use hyphens

**Can't find Drive folder?**
- Windows: Check `C:\Users\[name]\Google Drive`
- Mac: Check Finder sidebar
- Linux: Check `~/Google Drive` or `~/drive`

---

## NEXT STEPS

1. Set up Google Drive folder structure
2. Install Google Drive Desktop (if not already)
3. Start generating images with Gemini
4. Save directly to organized Drive folders
5. Run import script to bring into project
6. Optimize and deploy!

---

*Last updated: April 2026*
*For: Paragu-AI Builder Project*
