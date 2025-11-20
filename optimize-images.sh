#!/bin/bash

# Image Optimization Script for Web
# Converts images to WebP format with proper compression and resizing
# Requires: imagemagick (for convert command)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default settings
DEFAULT_QUALITY=85
DEFAULT_MAX_WIDTH=1920
DEFAULT_MAX_HEIGHT=1080

# Help message
show_help() {
    cat << EOF
Usage: ./optimize-images.sh [OPTIONS] <input_file_or_directory>

Optimizes images for web use by converting to WebP format with compression.

OPTIONS:
    -q, --quality NUM       Quality setting (1-100, default: ${DEFAULT_QUALITY})
    -w, --max-width NUM     Maximum width in pixels (default: ${DEFAULT_MAX_WIDTH})
    -h, --max-height NUM    Maximum height in pixels (default: ${DEFAULT_MAX_HEIGHT})
    -o, --output DIR        Output directory (default: ./optimized)
    -r, --recursive         Process directories recursively
    -k, --keep-original     Keep original files (don't delete)
    --hero                  Optimize for hero images (1920x800, quality 90)
    --card                  Optimize for card images (800x600, quality 85)
    --thumbnail             Optimize for thumbnails (400x300, quality 80)
    --help                  Show this help message

EXAMPLES:
    ./optimize-images.sh image.jpg
    ./optimize-images.sh -q 90 --hero hero-image.jpg
    ./optimize-images.sh -r --card public/uploads/
    ./optimize-images.sh --thumbnail -o public/thumbs image.png

PRESETS:
    --hero:      1920x800px, quality 90 (for hero/banner images)
    --card:      800x600px, quality 85 (for card/preview images)
    --thumbnail: 400x300px, quality 80 (for small thumbnails)

EOF
}

# Check if ImageMagick is installed
check_dependencies() {
    if ! command -v convert &> /dev/null; then
        echo -e "${RED}Error: ImageMagick is not installed.${NC}"
        echo "Please install it:"
        echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
        echo "  Fedora: sudo dnf install ImageMagick"
        echo "  macOS: brew install imagemagick"
        exit 1
    fi
    
    if ! command -v cwebp &> /dev/null; then
        echo -e "${YELLOW}Warning: cwebp is not installed. Using ImageMagick for WebP conversion.${NC}"
        echo "For better results, install webp tools:"
        echo "  Ubuntu/Debian: sudo apt-get install webp"
        echo "  Fedora: sudo dnf install libwebp-tools"
        echo "  macOS: brew install webp"
    fi
}

# Initialize variables
QUALITY=$DEFAULT_QUALITY
MAX_WIDTH=$DEFAULT_MAX_WIDTH
MAX_HEIGHT=$DEFAULT_MAX_HEIGHT
OUTPUT_DIR="./optimized"
RECURSIVE=false
KEEP_ORIGINAL=false
INPUT_PATH=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -q|--quality)
            QUALITY="$2"
            shift 2
            ;;
        -w|--max-width)
            MAX_WIDTH="$2"
            shift 2
            ;;
        -h|--max-height)
            MAX_HEIGHT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -r|--recursive)
            RECURSIVE=true
            shift
            ;;
        -k|--keep-original)
            KEEP_ORIGINAL=true
            shift
            ;;
        --hero)
            MAX_WIDTH=1920
            MAX_HEIGHT=800
            QUALITY=90
            shift
            ;;
        --card)
            MAX_WIDTH=800
            MAX_HEIGHT=600
            QUALITY=85
            shift
            ;;
        --thumbnail)
            MAX_WIDTH=400
            MAX_HEIGHT=300
            QUALITY=80
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        -*)
            echo -e "${RED}Error: Unknown option $1${NC}"
            show_help
            exit 1
            ;;
        *)
            INPUT_PATH="$1"
            shift
            ;;
    esac
done

# Check if input path is provided
if [ -z "$INPUT_PATH" ]; then
    echo -e "${RED}Error: No input file or directory specified${NC}"
    show_help
    exit 1
fi

# Check dependencies
check_dependencies

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to optimize a single image
optimize_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local name="${filename%.*}"
    local extension="${filename##*.}"
    
    # Skip if already WebP
    if [[ "$extension" == "webp" ]]; then
        echo -e "${YELLOW}Skipping $filename (already WebP)${NC}"
        return
    fi
    
    # Skip non-image files
    if [[ ! "$extension" =~ ^(jpg|jpeg|png|gif|bmp|tiff|tif)$ ]]; then
        echo -e "${YELLOW}Skipping $filename (not a supported image)${NC}"
        return
    fi
    
    local output_file="$OUTPUT_DIR/${name}.webp"
    
    echo -e "${BLUE}Processing: $filename${NC}"
    
    # Get original size
    local original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
    local original_size_kb=$((original_size / 1024))
    
    # Get original dimensions
    local dimensions=$(identify -format "%wx%h" "$input_file" 2>/dev/null)
    echo "  Original: ${dimensions} (${original_size_kb} KB)"
    
    # Convert and optimize
    if command -v cwebp &> /dev/null; then
        # Use cwebp for better WebP conversion
        convert "$input_file" \
            -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
            -strip \
            PNG:- | \
        cwebp -q "$QUALITY" -o "$output_file" -- - 2>/dev/null
    else
        # Fallback to ImageMagick
        convert "$input_file" \
            -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
            -strip \
            -quality "$QUALITY" \
            "$output_file"
    fi
    
    # Get new size
    local new_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
    local new_size_kb=$((new_size / 1024))
    local savings=$((original_size - new_size))
    local savings_kb=$((savings / 1024))
    local savings_percent=$((savings * 100 / original_size))
    
    # Get new dimensions
    local new_dimensions=$(identify -format "%wx%h" "$output_file" 2>/dev/null)
    
    echo -e "  ${GREEN}Optimized: ${new_dimensions} (${new_size_kb} KB)${NC}"
    echo -e "  ${GREEN}Saved: ${savings_kb} KB (${savings_percent}% reduction)${NC}"
    echo
}

# Process files
if [ -f "$INPUT_PATH" ]; then
    # Single file
    optimize_image "$INPUT_PATH"
elif [ -d "$INPUT_PATH" ]; then
    # Directory
    echo -e "${BLUE}Processing directory: $INPUT_PATH${NC}"
    echo -e "${BLUE}Output directory: $OUTPUT_DIR${NC}"
    echo -e "${BLUE}Settings: ${MAX_WIDTH}x${MAX_HEIGHT}px, quality ${QUALITY}${NC}"
    echo
    
    if [ "$RECURSIVE" = true ]; then
        # Recursive processing
        find "$INPUT_PATH" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" -o -iname "*.tiff" -o -iname "*.tif" \) | while read -r file; do
            optimize_image "$file"
        done
    else
        # Non-recursive
        for file in "$INPUT_PATH"/*.{jpg,jpeg,png,gif,bmp,tiff,tif} 2>/dev/null; do
            [ -f "$file" ] && optimize_image "$file"
        done
    fi
else
    echo -e "${RED}Error: $INPUT_PATH is not a valid file or directory${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Optimization complete!${NC}"
echo -e "${GREEN}Optimized images saved to: $OUTPUT_DIR${NC}"
