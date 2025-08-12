const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Fixed Excel to JSON converter with proper column mapping
function convertExcelToJsonFixed() {
  try {
    console.log('🔧 FIXED Excel to JSON Converter');
    console.log('=====================================');
    
    const excelPath = path.join(process.cwd(), 'public', 'Drugs_latest.xlsx');
    const jsonPath = path.join(process.cwd(), 'public', 'medicines.json');
    
    // Check if Excel file exists
    if (!fs.existsSync(excelPath)) {
      console.error('❌ Drugs_latest.xlsx file not found in public directory');
      return;
    }

    // Read the Excel file
    const workbook = XLSX.readFile(excelPath);
    console.log(`📋 Available sheets: ${workbook.SheetNames.join(', ')}`);
    
    // Use the Drugs sheet
    const worksheet = workbook.Sheets['Drugs'];
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📈 Found ${rawData.length} records`);

    if (rawData.length === 0) {
      console.error('❌ No data found in the Drugs sheet');
      return;
    }

    // Transform data using proper column mapping
    console.log('🔄 Transforming data with correct mapping...');
    const medicines = rawData.map((row, index) => {
      try {
        return transformRecordFixed(row);
      } catch (error) {
        console.warn(`⚠️  Error processing row ${index + 1}:`, error.message);
        return null;
      }
    }).filter(medicine => medicine && medicine.id && medicine.name);

    console.log(`✅ Successfully processed ${medicines.length} valid medicines`);

    // Sort medicines by priority score and price
    const sortedMedicines = medicines.sort((a, b) => {
      if (a.priorityScore !== b.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      if (a.price !== b.price) {
        return b.price - a.price;
      }
      return a.name.localeCompare(b.name);
    });

    // Write to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(sortedMedicines, null, 2));
    
    console.log(`💾 JSON file saved to: ${jsonPath}`);
    generateStatistics(sortedMedicines);

  } catch (error) {
    console.error('❌ Error converting Excel to JSON:', error);
  }
}

// Transform a record using the correct Excel column names
function transformRecordFixed(row) {
  // Helper function to safely parse numbers
  const parseNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Helper function to parse Yes/No values
  const parseYesNo = (value) => {
    if (!value) return false;
    return String(value).toLowerCase() === 'yes';
  };

  // Helper function to parse date values (Excel serial dates)
  const parseExcelDate = (value) => {
    if (!value || value === '') return null;
    try {
      // Excel dates are stored as serial numbers (days since 1900-01-01)
      const excelEpoch = new Date(1900, 0, 1);
      const days = parseNumber(value) - 1; // Subtract 1 because Excel incorrectly treats 1900 as a leap year
      const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    } catch (error) {
      return null;
    }
  };

  // Extract values using exact Excel column names
  const drugCode = row['Drug Code'] || '';
  const packageName = row['Package Name'] || '';
  const genericName = row['Generic Name'] || '';
  const strength = row['Strength'] || '';
  const dosageForm = row['Dosage Form'] || '';
  const packageSize = row['Package Size'] || '';
  const manufacturerName = row['Manufacturer Name'] || '';
  const agentName = row['Agent Name'] || '';
  const status = row['Status'] || '';
  const dispenseMode = row['Dispense Mode'] || '';
  const insurancePlan = row['Insurance Plan'] || '';
  const insuranceCoverage = row['Insurance Coverage For Government Funded Program'] || '';

  // Parse pricing information
  const packagePriceToPublic = parseNumber(row['Package Price to Public']);
  const packagePriceToPharmacy = parseNumber(row['Package Price to Pharmacy']);
  const unitPriceToPublic = parseNumber(row['Unit Price to Public']);
  const unitPriceToPharmacy = parseNumber(row['Unit Price to Pharmacy']);
  
  // Use actual Package Markup from Excel only - don't calculate if blank
  let packageMarkup = parseNumber(row['Package Markup']);
  
  // Use actual Unit Markup from Excel only - don't calculate if blank  
  let unitMarkup = parseNumber(row['Unit Markup']);

  // Parse coverage information from actual Excel columns
  const uppScope = parseYesNo(row['UPP Scope']);
  const thiqaFormulary = parseYesNo(row['Included in Thiqa/ ABM - other than 1&7- Drug Formulary']);
  const basicFormulary = parseYesNo(row['Included In Basic Drug Formulary']);
  const abm1Formulary = parseYesNo(row['Included In ABM 1 Drug Formulary']);
  const abm7Formulary = parseYesNo(row['Included In ABM 7 Drug Formulary']);

  // Set thiqa and basic flags based on formulary inclusion
  const thiqa = thiqaFormulary;
  const basic = basicFormulary;

  // Parse reimbursement amounts
  const thiqaMaxReimbursement = parseNumber(row['Thiqa Max. Reimbursement Price (Package)']);
  const thiqaCopay = parseNumber(row['Thiqa co-pay amount (package)']);
  const basicCopay = parseNumber(row['Basic co-pay amount (package)']);

  // Parse UPP dates
  const uppEffectiveDate = parseNumber(row['UPP Effective Date']);
  const uppUpdatedDate = parseNumber(row['UPP Updated Date']);
  const uppExpiryDate = parseNumber(row['UPP Expiry Date']);

  // Parse other dates
  const lastChangeDate = parseNumber(row['Last Change Date']);
  const deleteEffectiveDate = row['Delete Effective Date'] || '';

  // Calculate priority score based on actual coverage
  let priorityScore = 0;
  if (uppScope) priorityScore += 4;
  if (thiqa) priorityScore += 2;
  if (basic) priorityScore += 1;
  
  // Determine category
  const category = determineDrugCategory(dosageForm, genericName);
  
  // Determine if in stock based on status
  const inStock = status.toLowerCase() === 'active';
  
  const medicine = {
    // Core fields for UI
    id: drugCode,
    name: packageName,
    genericName,
    strength,
    dosageForm,
    packageSize,
    price: packagePriceToPublic,
    category,
    dosage: `${strength} ${dosageForm}`.trim(),
    inStock,
    manufacturer: manufacturerName,
    
    // Insurance/formulary fields (using actual Excel data)
    uppScope,
    thiqa,
    basic,
    priorityScore,
    
    // Detailed Excel fields
    drugCode,
    genericCode: row['Generic Code'] || '',
    insurancePlan,
    insuranceCoverage,
    dispenseMode,
    packagePriceToPublic,
    packagePriceToPharmacy,
    unitPriceToPublic,
    unitPriceToPharmacy,
    packageMarkup,
    unitMarkup,
    status,
    deleteEffectiveDate,
    lastChangeDate,
    agentName,
    manufacturerName,
    
    // Formulary details
    thiqaFormulary,
    basicFormulary,
    abm1Formulary,
    abm7Formulary,
    
    // Reimbursement information
    thiqaMaxReimbursement,
    thiqaCopay,
    basicCopay,
    
    // UPP dates (Excel serial format)
    uppEffectiveDate,
    uppUpdatedDate,
    uppExpiryDate
  };
  
  return medicine;
}

// Helper function for drug categorization
function determineDrugCategory(dosageForm, genericName) {
  const form = (dosageForm || '').toLowerCase();
  const generic = (genericName || '').toLowerCase();
  
  if (generic.includes('homeopathy')) return 'Homeopathy';
  if (form.includes('cream') || form.includes('ointment') || form.includes('gel')) return 'Topical';
  if (form.includes('tablet') || form.includes('capsule')) return 'Oral';
  if (form.includes('injection') || form.includes('syringe')) return 'Injectable';
  if (form.includes('drops') || form.includes('solution')) return 'Liquid';
  if (form.includes('suppository')) return 'Suppository';
  if (form.includes('inhaler') || form.includes('spray')) return 'Respiratory';
  
  return 'Prescription';
}

// Generate statistics
function generateStatistics(medicines) {
  console.log(`\n📊 CORRECTED DATA STATISTICS`);
  console.log('='.repeat(50));
  console.log(`📈 Total medicines: ${medicines.length}`);
  console.log(`✅ Active medicines: ${medicines.filter(m => m.inStock).length}`);
  console.log(`🔵 UPP Scope: ${medicines.filter(m => m.uppScope).length}`);
  console.log(`🟢 Thiqa Formulary: ${medicines.filter(m => m.thiqa).length}`);
  console.log(`🟡 Basic Formulary: ${medicines.filter(m => m.basic).length}`);
  console.log(`🔴 ABM 1 Formulary: ${medicines.filter(m => m.abm1Formulary).length}`);
  console.log(`🟣 ABM 7 Formulary: ${medicines.filter(m => m.abm7Formulary).length}`);
  
  // Test specific medicine
  const panalife = medicines.find(m => m.name === 'PANALIFE' && m.strength === '500 mg' && m.packageSize === "96's (12's Blister x 8)");
  if (panalife) {
    console.log(`\n🧪 TEST CASE - PANALIFE 500 mg 96's:`);
    console.log(`   UPP Scope: ${panalife.uppScope}`);
    console.log(`   Thiqa: ${panalife.thiqa}`);
    console.log(`   Basic: ${panalife.basic}`);
    console.log(`   Package Markup: ${panalife.packageMarkup}`);
    console.log(`   Priority Score: ${panalife.priorityScore}`);
  }

  // Category breakdown
  const categories = {};
  medicines.forEach(m => {
    categories[m.category] = (categories[m.category] || 0) + 1;
  });
  
  console.log(`\n📋 Categories:`);
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });

  // Price statistics
  const prices = medicines.map(m => m.price).filter(p => p > 0);
  if (prices.length > 0) {
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    
    console.log(`\n💰 Price Statistics:`);
    console.log(`   Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} AED`);
    console.log(`   Average: ${avgPrice.toFixed(2)} AED`);
  }
}

// Run the fixed conversion
convertExcelToJsonFixed();
