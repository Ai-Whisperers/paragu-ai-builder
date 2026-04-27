#!/bin/bash
# Image Optimization Script for Paragu-AI Builder
# Compresses and resizes images for web use
# Usage: ./optimize-images.sh [input_folder] [output_folder]

set -e

INPUT_DIR="${1:-sites}"
OUTPUT_DIR="${2:-sites-optimized}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Paragu-AI Image Optimizer${NC}"
echo "================================"
echo "Input: $INPUT_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ Error: ImageMagick not found${NC}"
    echo "Install with: sudo apt-get install imagemagick"
    exit 1
fi

# Check if jpegoptim is installed
if ! command -v jpegoptim &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: jpegoptim not found (optional but recommended)${NC}"
    echo "Install with: sudo apt-get install jpegoptim"
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Counter for stats
TOTAL=0
OPTIMIZED=0
SAVED_SIZE=0

# Function to optimize a single image
optimize_image() {
    local input_file="$1"
    local output_file="$2"
    local filename=$(basename "$input_file")
    
    # Get original size
    local original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
    
    # Determine image type and dimensions
    local dimensions=$(identify -format "%w %h" "$input_file" 2>/dev/null)
    local width=$(echo $dimensions | cut -d' ' -f1)
    local height=$(echo $dimensions | cut -d' ' -f2)
    
    # Determine max dimensions based on usage
    local max_width=1920
    local max_height=1080
    local quality=85
    
    # Adjust settings based on filename patterns
    if [[ "$filename" == *"hero"* ]]; then
        max_width=1920
        max_height=1080
        quality=85
    elif [[ "$filename" == *"agent"* ]] || [[ "$filename" == *"headshot"* ]]; then
        max_width=600
        max_height=600
        quality=90
    elif [[ "$filename" == *"service"* ]] || [[ "$filename" == *"card"* ]]; then
        max_width=800
        max_height=600
        quality=85
    elif [[ "$filename" == *"property"* ]] || [[ "$filename" == *"neighborhood"* ]]; then
        max_width=1200
        max_height=800
        quality=85
    elif [[ "$filename" == *"process"* ]]; then
        max_width=600
        max_height=400
        quality=85
    fi
    
    # Resize if needed while maintaining aspect ratio
    if [ "$width" -gt "$max_width" ] || [ "$height" -gt "$max_height" ]; then
        convert "$input_file" \
            -resize "${max_width}x${max_height}>" \
            -strip \
            -interlace Plane \
            -sampling-factor 4:2:0 \
            -quality $quality \
            "$output_file"
    else
        # Just optimize without resizing
        convert "$input_file" \
            -strip \
            -interlace Plane \
            -sampling-factor 4:2:0 \
            -quality $quality \
            "$output_file"
    fi
    
    # Additional optimization with jpegoptim if available
    if command -v jpegoptim &> /dev/null; then
        jpegoptim --strip-all --max=$quality -q "$output_file" 2>/dev/null || true
    fi
    
    # Get new size
    local new_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
    local saved=$((original_size - new_size))
    local percent=$((saved * 100 / original_size))
    
    echo -e "${GREEN}✓${NC} $filename: $(($original_size/1024))KB → $(($new_size/1024))KB (${percent}% smaller)"
    
    # Update counters
    OPTIMIZED=$((OPTIMIZED + 1))
    SAVED_SIZE=$((SAVED_SIZE + saved))
}

# Find and process all images
echo -e "${YELLOW}🔍 Scanning for images...${NC}"
echo ""

find "$INPUT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r file; do
    # Create relative path for output
    rel_path="${file#$INPUT_DIR/}"
    output_file="$OUTPUT_DIR/$rel_path"
    
    # Create output directory structure
    output_dir=$(dirname "$output_file")
    mkdir -p "$output_dir"
    
    # Optimize the image
    optimize_image "$file" "$output_file"
    
    TOTAL=$((TOTAL + 1))
done

echo ""
echo "================================"
echo -e "${GREEN}✅ Optimization Complete!${NC}"
echo "Images processed: $TOTAL"
echo "Total size saved: $(($SAVED_SIZE/1024)) KB"
echo ""
echo "Optimized images are in: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review optimized images"
echo "2. Copy to sites/{tenant}/images/ folders"
echo "3. Update content JSON files with image paths"
