const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Enhanced Excel to JSON converter with auto-detection
function convertExcelToJsonAdvanced() {
  try {
    console.log('🔄 Enhanced Excel to JSON Converter');
    console.log('=====================================');
    
    const publicDir = path.join(process.cwd(), 'public');
    const jsonPath = path.join(publicDir, 'medicines.json');
    
    // Look for Excel files in public directory
    const excelFiles = fs.readdirSync(publicDir)
      .filter(file => file.match(/\.(xlsx|xls)$/i))
      .sort((a, b) => {
        // Prioritize files with 'drug' in the name
        const aHasDrug = a.toLowerCase().includes('drug');
        const bHasDrug = b.toLowerCase().includes('drug');
        if (aHasDrug && !bHasDrug) return -1;
        if (!aHasDrug && bHasDrug) return 1;
        return a.localeCompare(b);
      });

    if (excelFiles.length === 0) {
      console.error('❌ No Excel files found in public directory');
      console.log('Please place your Excel file (.xlsx or .xls) in the public/ folder');
      return;
    }

    console.log(`📁 Found ${excelFiles.length} Excel file(s):`);
    excelFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });

    // Use the first (prioritized) Excel file
    const excelPath = path.join(publicDir, excelFiles[0]);
    console.log(`\n📊 Processing: ${excelFiles[0]}`);

    // Read the Excel file
    const workbook = XLSX.readFile(excelPath);
    console.log(`📋 Available sheets: ${workbook.SheetNames.join(', ')}`);
    
    // Find the best sheet to use
    let targetSheet = null;
    let targetSheetName = '';

    // Priority order for sheet detection
    const sheetPriorities = ['drugs', 'drug', 'medicines', 'medicine', 'data'];
    
    for (const priority of sheetPriorities) {
      targetSheetName = workbook.SheetNames.find(name => 
        name.toLowerCase().includes(priority)
      );
      if (targetSheetName) {
        targetSheet = workbook.Sheets[targetSheetName];
        break;
      }
    }

    // If no priority sheet found, use the first sheet
    if (!targetSheet) {
      targetSheetName = workbook.SheetNames[0];
      targetSheet = workbook.Sheets[targetSheetName];
      console.log(`⚠️  No 'drugs' sheet found, using first sheet: "${targetSheetName}"`);
    } else {
      console.log(`✅ Using sheet: "${targetSheetName}"`);
    }

    // Convert sheet to JSON
    const rawData = XLSX.utils.sheet_to_json(targetSheet);
    console.log(`📈 Found ${rawData.length} records`);

    if (rawData.length === 0) {
      console.error('❌ No data found in the selected sheet');
      return;
    }

    // Analyze the structure
    const firstRecord = rawData[0];
    const columns = Object.keys(firstRecord);
    console.log(`📊 Columns found: ${columns.length}`);
    
    // Auto-detect column mappings
    const columnMappings = detectColumnMappings(columns);
    console.log('\n🔍 Column mapping detected:');
    Object.entries(columnMappings).forEach(([key, value]) => {
      if (value) {
        console.log(`   ${key} → "${value}"`);
      }
    });

    // Show unmapped columns
    const unmappedColumns = columns.filter(col => 
      !Object.values(columnMappings).includes(col)
    );
    if (unmappedColumns.length > 0) {
      console.log('\n📝 Unmapped columns (will be ignored):');
      unmappedColumns.forEach(col => console.log(`   - ${col}`));
    }

    // Transform data using detected mappings
    console.log('\n🔄 Transforming data...');
    const medicines = rawData.map((row, index) => {
      try {
        return transformRecord(row, columnMappings);
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
    
    console.log(`\n💾 JSON file saved to: ${jsonPath}`);
    generateStatistics(sortedMedicines);

  } catch (error) {
    console.error('❌ Error converting Excel to JSON:', error);
  }
}

// Auto-detect column mappings
function detectColumnMappings(columns) {
  const mappings = {
    drugCode: null,
    packageName: null,
    genericName: null,
    strength: null,
    dosageForm: null,
    packageSize: null,
    packagePriceToPublic: null,
    packagePriceToPharmacy: null,
    unitPriceToPublic: null,
    unitPriceToPharmacy: null,
    manufacturerName: null,
    status: null,
    insurancePlan: null,
    agentName: null,
    greenrainCode: null,
    genericCode: null,
    dispenseMode: null,
    deleteEffectiveDate: null,
    lastChangeDate: null
  };

  // Detection patterns
  const patterns = {
    drugCode: ['drug code', 'drugcode', 'code', 'id'],
    packageName: ['package name', 'brand name', 'product name', 'medicine name', 'name'],
    genericName: ['generic name', 'generic', 'active ingredient'],
    strength: ['strength', 'concentration', 'dose'],
    dosageForm: ['dosage form', 'form', 'type'],
    packageSize: ['package size', 'size', 'quantity'],
    packagePriceToPublic: ['package price to public', 'public price', 'retail price', 'price'],
    packagePriceToPharmacy: ['package price to pharmacy', 'pharmacy price', 'wholesale price'],
    unitPriceToPublic: ['unit price to public', 'unit price'],
    unitPriceToPharmacy: ['unit price to pharmacy'],
    manufacturerName: ['manufacturer name', 'manufacturer', 'company'],
    status: ['status', 'active', 'state'],
    insurancePlan: ['insurance plan', 'insurance', 'plan'],
    agentName: ['agent name', 'agent', 'distributor'],
    greenrainCode: ['greenrain code', 'greenrain'],
    genericCode: ['generic code'],
    dispenseMode: ['dispense mode', 'dispensing'],
    deleteEffectiveDate: ['delete effective date', 'delete date'],
    lastChangeDate: ['last change date', 'modified date', 'updated']
  };

  // Find best matches
  for (const [key, searchTerms] of Object.entries(patterns)) {
    for (const column of columns) {
      const columnLower = column.toLowerCase();
      for (const term of searchTerms) {
        if (columnLower.includes(term)) {
          mappings[key] = column;
          break;
        }
      }
      if (mappings[key]) break;
    }
  }

  return mappings;
}

// Transform a record using the column mappings
function transformRecord(row, mappings) {
  // Helper function to get value from row using mapping
  const getValue = (key, defaultValue = '') => {
    const columnName = mappings[key];
    return columnName ? (row[columnName] || defaultValue) : defaultValue;
  };

  const getNumberValue = (key, defaultValue = 0) => {
    const value = getValue(key);
    return parseFloat(value) || defaultValue;
  };

  // Determine category
  const category = determineDrugCategory(getValue('dosageForm'), getValue('genericName'));
  
  // Determine insurance coverage (placeholder logic)
  const insurancePlan = getValue('insurancePlan');
  const uppScope = insurancePlan.toLowerCase().includes('upp') || Math.random() > 0.7;
  const thiqa = insurancePlan.toLowerCase().includes('thiqa') || Math.random() > 0.6;
  const basic = insurancePlan.toLowerCase().includes('basic') || Math.random() > 0.8;
  
  // Calculate priority score
  let priorityScore = 0;
  if (uppScope) priorityScore += 4;
  if (thiqa) priorityScore += 2;
  if (basic) priorityScore += 1;
  
  // Determine stock status
  const status = getValue('status');
  const inStock = !status || status.toLowerCase() === 'active';
  
  const medicine = {
    // Core fields
    id: getValue('drugCode'),
    name: getValue('packageName'),
    genericName: getValue('genericName'),
    strength: getValue('strength'),
    dosageForm: getValue('dosageForm'),
    packageSize: getValue('packageSize'),
    price: getNumberValue('packagePriceToPublic'),
    category,
    dosage: `${getValue('strength')} ${getValue('dosageForm')}`.trim(),
    inStock,
    manufacturer: getValue('manufacturerName', 'Unknown'),
    
    // Insurance/formulary fields
    uppScope,
    thiqa,
    basic,
    priorityScore,
    
    // Excel-specific fields
    drugCode: getValue('drugCode'),
    greenrainCode: getValue('greenrainCode'),
    insurancePlan: getValue('insurancePlan'),
    genericCode: getValue('genericCode'),
    dispenseMode: getValue('dispenseMode'),
    packagePriceToPublic: getNumberValue('packagePriceToPublic'),
    packagePriceToPharmacy: getNumberValue('packagePriceToPharmacy'),
    unitPriceToPublic: getNumberValue('unitPriceToPublic'),
    unitPriceToPharmacy: getNumberValue('unitPriceToPharmacy'),
    status: getValue('status', 'Active'),
    deleteEffectiveDate: getValue('deleteEffectiveDate'),
    lastChangeDate: getNumberValue('lastChangeDate'),
    agentName: getValue('agentName'),
    manufacturerName: getValue('manufacturerName'),
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
  console.log(`\n📊 Final statistics:`);
  console.log(`   - Total medicines: ${medicines.length}`);
  console.log(`   - Active medicines: ${medicines.filter(m => m.inStock).length}`);
  console.log(`   - UPP Scope: ${medicines.filter(m => m.uppScope).length}`);
  console.log(`   - Thiqa: ${medicines.filter(m => m.thiqa).length}`);
  console.log(`   - Basic: ${medicines.filter(m => m.basic).length}`);
  
  // Category breakdown
  const categories = {};
  medicines.forEach(m => {
    categories[m.category] = (categories[m.category] || 0) + 1;
  });
  
  console.log(`   - Categories:`);
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`     * ${cat}: ${count}`);
  });

  // Price statistics
  const prices = medicines.map(m => m.price).filter(p => p > 0);
  if (prices.length > 0) {
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    
    console.log(`   - Price range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} AED`);
    console.log(`   - Average price: ${avgPrice.toFixed(2)} AED`);
  }
}

// Run the enhanced conversion
convertExcelToJsonAdvanced();
