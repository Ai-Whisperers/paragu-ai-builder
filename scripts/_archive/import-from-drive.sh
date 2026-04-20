#!/bin/bash
# import-from-drive.sh
# Copies images from Google Drive to project shared-images folders
# Usage: ./scripts/import-from-drive.sh

set -e

# Configuration
DRIVE_PATH="$HOME/Google Drive/paragu-ai-images"
DRIVE_PATH_ALT="$HOME/drive/paragu-ai-images"
PROJECT_PATH="/home/ai-whisperers/paragu-ai-builder/sites/shared-images"

echo "🔄 Importing images from Google Drive..."
echo ""

# Find the correct Drive path
if [ -d "$DRIVE_PATH" ]; then
    SOURCE_PATH="$DRIVE_PATH"
elif [ -d "$DRIVE_PATH_ALT" ]; then
    SOURCE_PATH="$DRIVE_PATH_ALT"
else
    echo "❌ Error: Google Drive folder not found"
    echo "   Looked for:"
    echo "   - $DRIVE_PATH"
    echo "   - $DRIVE_PATH_ALT"
    echo ""
    echo "💡 Make sure Google Drive Desktop is installed and synced"
    exit 1
fi

echo "📍 Found Drive at: $SOURCE_PATH"
echo "📍 Project path: $PROJECT_PATH"
echo ""

# Function to copy images
copy_images() {
    local source_dir="$1"
    local dest_dir="$2"
    local name="$3"
    
    if [ -d "$source_dir" ]; then
        local count=$(find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | wc -l)
        if [ "$count" -gt 0 ]; then
            echo "📁 Copying $name images ($count files)..."
            mkdir -p "$dest_dir"
            find "$source_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) -exec cp -v {} "$dest_dir/" \;
            echo "  ✅ Copied $count images to $name/"
        else
            echo "  ⚠️  No images found in $name folder"
        fi
    else
        echo "  ⚠️  Folder not found: $source_dir"
    fi
}

# Copy sushi bar images
copy_images "$SOURCE_PATH/sushi_bar" "$PROJECT_PATH/sushi_bar" "sushi_bar"
echo ""

# Copy kaiten zushi images
copy_images "$SOURCE_PATH/kaiten_zushi" "$PROJECT_PATH/kaiten_zushi" "kaiten_zushi"
echo ""

# Copy any batch folders
for batch_dir in "$SOURCE_PATH"/batch-*; do
    if [ -d "$batch_dir" ]; then
        batch_name=$(basename "$batch_dir")
        echo "📁 Found batch folder: $batch_name"
        
        # Try to determine destination from folder contents
        if ls "$batch_dir" | grep -q "sushi"; then
            copy_images "$batch_dir" "$PROJECT_PATH/sushi_bar" "batch-$batch_name"
        elif ls "$batch_dir" | grep -q "kaiten"; then
            copy_images "$batch_dir" "$PROJECT_PATH/kaiten_zushi" "batch-$batch_name"
        else
            # Copy to generic batch folder
            copy_images "$batch_dir" "$PROJECT_PATH/batch-imports/$batch_name" "$batch_name"
        fi
        echo ""
    fi
done

echo "✅ Import complete!"
echo ""
echo "📊 Summary:"
echo "   - Sushi bar: $(ls -1 $PROJECT_PATH/sushi_bar/*.{jpg,jpeg,png,webp} 2>/dev/null | wc -l) images"
echo "   - Kaiten zushi: $(ls -1 $PROJECT_PATH/kaiten_zushi/*.{jpg,jpeg,png,webp} 2>/dev/null | wc -l) images"
echo ""
echo "🚀 Next steps:"
echo "   1. Review imported images"
echo "   2. Run: npm run optimize-images (if available)"
echo "   3. Update content files if needed"
echo "   4. Commit changes: git add sites/shared-images/ && git commit -m 'Add new images'"
