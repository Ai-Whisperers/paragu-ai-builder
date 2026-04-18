#!/bin/bash
# Manual Image Download Organizer
# Run this after downloading images from gemini.google.com
# Usage: ./organize-downloads.sh [download_folder]

DOWNLOAD_DIR="${1:-$HOME/Downloads}"
TARGET_BASE="sites/shared-images"

echo "🗂️  Image Download Organizer"
echo "=============================="
echo "Source: $DOWNLOAD_DIR"
echo "Target: $TARGET_BASE"
echo ""

# Create all target directories
mkdir -p $TARGET_BASE/heroes
mkdir -p $TARGET_BASE/team
mkdir -p $TARGET_BASE/services
mkdir -p sites/nexa-paraguay/images
mkdir -p sites/nexa-uruguay/images
mkdir -p sites/nexa-propiedades/images

# Function to find and move images by pattern
organize_images() {
    local pattern=$1
    local target_dir=$2
    local description=$3
    
    echo "🔍 Looking for: $description"
    
    # Find matching files (jpg, jpeg, png, webp)
    found=$(find "$DOWNLOAD_DIR" -maxdepth 1 -type f \( -iname "*$pattern*" -o -iname "*${pattern//-/_}*" \) \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) 2>/dev/null | head -5)
    
    if [ -n "$found" ]; then
        echo "   Found: $(echo "$found" | wc -l) files"
        echo "$found" | while read file; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                # Clean up filename
                cleanname=$(echo "$filename" | sed 's/[^a-zA-Z0-9._-]/-/g' | tr '[:upper:]' '[:lower:]')
                cp "$file" "$target_dir/$cleanname"
                echo "   ✅ Copied: $cleanname"
            fi
        done
    else
        echo "   ⚠️  No files found"
    fi
    echo ""
}

# Organize Hero Images
echo "📸 Organizing Hero Images..."
organize_images "peluqueria" "$TARGET_BASE/heroes" "Peluqueria hero"
organize_images "barberia" "$TARGET_BASE/heroes" "Barberia hero"
organize_images "salon" "$TARGET_BASE/heroes" "Salon hero"
organize_images "spa" "$TARGET_BASE/heroes" "Spa hero"
organize_images "estetica" "$TARGET_BASE/heroes" "Estetica hero"
organize_images "maquillaje" "$TARGET_BASE/heroes" "Maquillaje hero"
organize_images "unas" "$TARGET_BASE/heroes" "Unas hero"
organize_images "pestanas" "$TARGET_BASE/heroes" "Pestanas hero"
organize_images "gimnasio" "$TARGET_BASE/heroes" "Gimnasio hero"
organize_images "depilacion" "$TARGET_BASE/heroes" "Depilacion hero"
organize_images "consultoria" "$TARGET_BASE/heroes" "Consultoria hero"
organize_images "legal" "$TARGET_BASE/heroes" "Legal hero"
organize_images "relocation" "$TARGET_BASE/heroes" "Relocation hero"
organize_images "meal" "$TARGET_BASE/heroes" "Meal prep hero"
organize_images "tatuajes" "$TARGET_BASE/heroes" "Tatuajes hero"
organize_images "diseno" "$TARGET_BASE/heroes" "Diseno hero"
organize_images "inmobiliaria" "$TARGET_BASE/heroes" "Inmobiliaria hero"
organize_images "paraguay" "sites/nexa-paraguay/images" "Nexa Paraguay hero"
organize_images "uruguay" "sites/nexa-uruguay/images" "Nexa Uruguay hero"
organize_images "propiedades" "sites/nexa-propiedades/images" "Nexa Propiedades hero"

# Organize Team Images
echo "👥 Organizing Team Images..."
organize_images "male-business-1" "$TARGET_BASE/team" "Male business 1"
organize_images "male-business-2" "$TARGET_BASE/team" "Male business 2"
organize_images "male-business-3" "$TARGET_BASE/team" "Male business 3"
organize_images "team-male" "$TARGET_BASE/team" "Male team photos"
organize_images "team-female" "$TARGET_BASE/team" "Female team photos"

# Organize Service Images
echo "🛠️  Organizing Service Images..."
organize_images "service" "$TARGET_BASE/services" "Service images"

echo ""
echo "=============================="
echo "✅ Organization Complete!"
echo ""
echo "Next steps:"
echo "1. Review organized images in $TARGET_BASE/"
echo "2. Rename any files that need better names"
echo "3. Run: node scripts/optimize-images.js"
echo "4. Run: node scripts/update-content-images.js"
