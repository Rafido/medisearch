const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to convert Excel to JSON
function convertExcelToJson() {
  try {
    console.log('🔄 Converting Drugs.xlsx to JSON...');
    
    const excelPath = path.join(process.cwd(), 'public', 'Drugs_latest.xlsx');
    const jsonPath = path.join(process.cwd(), 'public', 'medicines.json');
    
    // Check if Excel file exists
    if (!fs.existsSync(excelPath)) {
      console.error('❌ Drugs_latest.xlsx file not found in public directory');
      return;
    }

    // Read the Excel file
    const workbook = XLSX.readFile(excelPath);
    
    // Find the Drugs sheet
    const drugsSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('drug') || name.toLowerCase() === 'drugs'
    );
    
    if (!drugsSheetName) {
      console.error('❌ No "Drugs" sheet found in Excel file');
      return;
    }

    console.log(`📊 Processing sheet: "${drugsSheetName}"`);
    
    // Convert sheet to JSON
    const worksheet = workbook.Sheets[drugsSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📈 Found ${rawData.length} records`);

    // Transform data to match Medicine interface
    const medicines = rawData.map((row, index) => {
      try {
        // Determine category based on dosage form or generic name
        const category = determineDrugCategory(row['Dosage Form'], row['Generic Name']);
        
        // Determine insurance coverage using actual Excel columns
        const insurancePlan = row['Insurance Plan'] || '';
        const uppScope = (row['UPP Scope'] || '').toLowerCase() === 'yes';
        const thiqaFormulary = (row['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] || '').toLowerCase() === 'yes';
        const basicFormulary = (row['Included In Basic Drug Formulary'] || '').toLowerCase() === 'yes';
        const abm1Formulary = (row['Included In ABM 1 Drug Formulary'] || '').toLowerCase() === 'yes';
        const abm7Formulary = (row['Included In ABM 7 Drug Formulary'] || '').toLowerCase() === 'yes';
        
        // Set thiqa and basic flags based on formulary inclusion
        const thiqa = thiqaFormulary;
        const basic = basicFormulary;
        
        // Calculate priority score
        let priorityScore = 0;
        if (uppScope) priorityScore += 4;
        if (thiqa) priorityScore += 2;
        if (basic) priorityScore += 1;
        
        // Determine if in stock based on status
        const inStock = (row['Status'] || '').toLowerCase() === 'active';
        
        // Parse prices safely
        const packagePriceToPublic = parseFloat(row['Package Price to Public'] || '0') || 0;
        const packagePriceToPharmacy = parseFloat(row['Package Price to Pharmacy'] || '0') || 0;
        const unitPriceToPublic = parseFloat(row['Unit Price to Public'] || '0') || 0;
        const unitPriceToPharmacy = parseFloat(row['Unit Price to Pharmacy'] || '0') || 0;
        
        // Use actual Package Markup from Excel only - don't calculate if blank
        let packageMarkup = parseFloat(row['Package Markup'] || '0') || 0;
        
        // Use actual Unit Markup from Excel only - don't calculate if blank
        let unitMarkup = parseFloat(row['Unit Markup'] || '0') || 0;

        const medicine = {
          // Core fields
          id: row['Drug Code'] || '',
          name: row['Package Name'] || '',
          genericName: row['Generic Name'] || '',
          strength: row['Strength'] || '',
          dosageForm: row['Dosage Form'] || '',
          packageSize: row['Package Size'] || '',
          price: packagePriceToPublic,
          category,
          dosage: `${row['Strength'] || ''} ${row['Dosage Form'] || ''}`.trim(),
          inStock,
          manufacturer: row['Manufacturer Name'] || 'Unknown',
          
          // Insurance/formulary fields
          uppScope,
          thiqa,
          basic,
          priorityScore,
          
          // Excel-specific fields
          drugCode: row['Drug Code'] || '',
          greenrainCode: row['Greenrain Code'] || '',
          insurancePlan: row['Insurance Plan'] || '',
          genericCode: row['Generic Code'] || '',
          dispenseMode: row['Dispense Mode'] || '',
          packagePriceToPublic,
          packagePriceToPharmacy,
          unitPriceToPublic,
          unitPriceToPharmacy,
          packageMarkup,
          unitMarkup,
          status: row['Status'] || '',
          deleteEffectiveDate: row['Delete Effective Date'] || '',
          lastChangeDate: row['Last Change Date'] || 0,
          agentName: row['Agent Name'] || '',
          manufacturerName: row['Manufacturer Name'] || '',
          
          // Formulary details
          thiqaFormulary,
          basicFormulary,
          abm1Formulary,
          abm7Formulary,
        };
        
        return medicine;
      } catch (error) {
        console.warn(`⚠️  Error processing row ${index + 1}:`, error.message);
        return null;
      }
    }).filter(medicine => medicine && medicine.id && medicine.name); // Filter out invalid records

    console.log(`✅ Successfully processed ${medicines.length} valid medicines`);

    // Sort medicines by priority score and price
    const sortedMedicines = medicines.sort((a, b) => {
      // First sort by priority score (higher score first)
      if (a.priorityScore !== b.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      // Then sort by price (higher price first)
      if (a.price !== b.price) {
        return b.price - a.price;
      }
      // Then sort by name
      return a.name.localeCompare(b.name);
    });

    // Write to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(sortedMedicines, null, 2));
    
    console.log(`💾 JSON file saved to: ${jsonPath}`);
    console.log(`📊 Final statistics:`);
    console.log(`   - Total medicines: ${sortedMedicines.length}`);
    console.log(`   - Active medicines: ${sortedMedicines.filter(m => m.inStock).length}`);
    console.log(`   - UPP Scope: ${sortedMedicines.filter(m => m.uppScope).length}`);
    console.log(`   - Thiqa: ${sortedMedicines.filter(m => m.thiqa).length}`);
    console.log(`   - Basic: ${sortedMedicines.filter(m => m.basic).length}`);
    
    // Show category breakdown
    const categories = {};
    sortedMedicines.forEach(m => {
      categories[m.category] = (categories[m.category] || 0) + 1;
    });
    
    console.log(`   - Categories:`);
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`     * ${cat}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error converting Excel to JSON:', error);
  }
}

// Helper function to determine drug category
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

// Run the conversion
convertExcelToJson();
