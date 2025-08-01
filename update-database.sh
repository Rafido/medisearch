#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 MediSearch Database Update Script${NC}"
echo "======================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Drugs.xlsx exists
if [ ! -f "public/Drugs.xlsx" ]; then
    print_error "Drugs.xlsx not found in public/ directory"
    echo "Please place your Excel file at: public/Drugs.xlsx"
    exit 1
fi

print_info "Found Drugs.xlsx file"

# Backup current JSON file if it exists
if [ -f "public/medicines.json" ]; then
    BACKUP_FILE="public/medicines.json.backup.$(date +%Y%m%d_%H%M%S)"
    cp public/medicines.json "$BACKUP_FILE"
    print_status "Created backup: $BACKUP_FILE"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "Dependencies not installed, installing now..."
    pnpm install
fi

# Run the conversion
print_info "Converting Excel to JSON..."
pnpm run convert-excel

# Check if conversion was successful
if [ -f "public/medicines.json" ]; then
    # Run validation
    print_info "Validating converted data..."
    if pnpm run validate-data > /dev/null 2>&1; then
        print_status "Data validation passed!"
    else
        print_warning "Data validation warnings detected (but proceeding)"
    fi
    
    # Get record count
    RECORD_COUNT=$(grep -c '^  {' public/medicines.json)
    FILE_SIZE=$(du -h public/medicines.json | cut -f1)
    
    print_status "Conversion successful!"
    print_info "📊 Records processed: $RECORD_COUNT"
    print_info "📄 File size: $FILE_SIZE"
    
    # Show category breakdown if available
    if [ -f "excel-analysis.txt" ]; then
        print_info "📋 Conversion details saved to: excel-analysis.txt"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Database update completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start the development server: ${BLUE}pnpm dev${NC}"
    echo "2. Or build for production: ${BLUE}pnpm build${NC}"
    echo "3. Check the application at: ${BLUE}http://localhost:5173${NC}"
    echo "4. Validate data anytime: ${BLUE}pnpm run validate-data${NC}"
    
else
    print_error "Conversion failed!"
    
    # Restore backup if it exists
    if [ -f "$BACKUP_FILE" ]; then
        cp "$BACKUP_FILE" public/medicines.json
        print_status "Restored previous data from backup"
    fi
    
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Check if Excel file has a 'Drugs' sheet"
    echo "2. Verify Excel file is not corrupted"
    echo "3. Run: ${BLUE}node scripts/analyzeExcel.cjs${NC} to analyze the file"
    echo "4. Check error logs above"
    
    exit 1
fi

# Optional: Clean up old backups (keep only 5 most recent)
BACKUP_COUNT=$(ls public/medicines.json.backup.* 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 5 ]; then
    print_info "Cleaning up old backups (keeping 5 most recent)..."
    ls -t public/medicines.json.backup.* | tail -n +6 | xargs rm -f
fi

echo ""
print_status "Update process completed!"
