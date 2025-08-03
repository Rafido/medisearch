import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert Excel to JSON
function convertExcelToJson() {
  try {
    const excelPath = path.join(__dirname, '..', 'public', 'Drugs_latest.xlsx');
    const jsonPath = path.join(__dirname, '..', 'public', 'medicines.json');
    
    // Check if Excel file exists
    if (!fs.existsSync(excelPath)) {
      console.error('❌ Drugs_latest.xlsx file not found in public directory');
      return;
    }

    console.log('📊 Converting Excel to JSON...');
    
    // Read the Excel file
    const workbook = XLSX.readFile(excelPath);
    
    // Find the Drugs sheet
    const drugsSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('drug')
    );
    
    if (!drugsSheetName) {
      console.error('❌ Could not find Drugs sheet in the Excel file');
      return;
    }
    
    console.log(`📄 Processing sheet: "${drugsSheetName}"`);
    
    // Convert sheet to JSON
    const worksheet = workbook.Sheets[drugsSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 Found ${jsonData.length} records`);
    
    // Process the data to match our Medicine interface
    const processedData = jsonData.map((row, index) => {
      // Determine category based on dosage form or generic name
      const dosageForm = (row['Dosage Form'] || '').trim();
      const genericName = row['Generic Name'] || '';
      
      let category = 'General';
      if (dosageForm.toLowerCase().includes('tablet')) category = 'Tablets';
      else if (dosageForm.toLowerCase().includes('capsule')) category = 'Capsules';
      else if (dosageForm.toLowerCase().includes('injection') || dosageForm.toLowerCase().includes('vial')) category = 'Injections';
      else if (dosageForm.toLowerCase().includes('cream') || dosageForm.toLowerCase().includes('ointment') || dosageForm.toLowerCase().includes('gel')) category = 'Topical';
      else if (dosageForm.toLowerCase().includes('syrup') || dosageForm.toLowerCase().includes('suspension') || dosageForm.toLowerCase().includes('solution')) category = 'Liquids';
      else if (genericName.toLowerCase().includes('insulin')) category = 'Diabetes';
      else if (genericName.toLowerCase().includes('antibiotic')) category = 'Antibiotics';
      
      // Parse boolean fields from Yes/No strings
      const uppScope = (row['UPP Scope'] || '').toLowerCase() === 'yes';
      const thiqaFormulary = (row['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] || '').toLowerCase() === 'yes';
      const basicFormulary = (row['Included In Basic Drug Formulary'] || '').toLowerCase() === 'yes';
      const abm1Formulary = (row['Included In ABM 1 Drug Formulary'] || '').toLowerCase() === 'yes';
      const abm7Formulary = (row['Included In ABM 7 Drug Formulary'] || '').toLowerCase() === 'yes';
      
      // Legacy compatibility - use formulary inclusion for thiqa and basic
      const thiqa = thiqaFormulary || abm1Formulary || abm7Formulary;
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
      const packageMarkup = parseFloat(row['Package Markup'] || '0') || 0;
      const unitMarkup = parseFloat(row['Unit Markup'] || '0') || 0;
      
      // Parse reimbursement and copay amounts
      const thiqaMaxReimbursement = parseFloat(row['Thiqa Max. Reimbursement Price (Package)'] || '0') || 0;
      const thiqaCopay = parseFloat(row['Thiqa co-pay amount (package)'] || '0') || 0;
      const basicCopay = parseFloat(row['Basic co-pay amount (package)'] || '0') || 0;
      
      // Use Package Markup as the main price, fallback to Package Price to Public
      const mainPrice = packageMarkup > 0 ? packageMarkup : packagePriceToPublic;

      return {
        // Core fields
        id: row['Drug Code'] || `drug-${index}`,
        name: row['Package Name'] || '',
        genericName: row['Generic Name'] || '',
        strength: row['Strength'] || '',
        dosageForm: dosageForm,
        packageSize: row['Package Size'] || '',
        price: mainPrice, // Use Package Markup as requested
        category,
        dosage: `${row['Strength'] || ''} ${dosageForm}`.trim(),
        inStock,
        manufacturer: row['Manufacturer Name'] || 'Unknown',
        
        // Insurance/formulary fields
        uppScope,
        thiqa,
        basic,
        priorityScore,
        
        // Excel-specific fields
        drugCode: row['Drug Code'] || '',
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
        lastChangeDate: parseFloat(row['Last Change Date'] || '0') || 0,
        agentName: row['Agent Name'] || '',
        manufacturerName: row['Manufacturer Name'] || '',
        
        // Insurance/Formulary coverage details
        insuranceCoverage: row['Insurance Coverage For Government Funded Program'] || '',
        thiqaFormulary,
        basicFormulary,
        abm1Formulary,
        abm7Formulary,
        
        // Reimbursement details
        thiqaMaxReimbursement,
        thiqaCopay,
        basicCopay,
        
        // UPP details
        uppEffectiveDate: parseFloat(row['UPP Effective Date'] || '0') || 0,
        uppUpdatedDate: parseFloat(row['UPP Updated Date'] || '0') || 0,
        uppExpiryDate: parseFloat(row['UPP Expiry Date'] || '0') || 0,
      };
    });

    // Sort medicines by priority score (highest first), then by name
    const sortedData = processedData.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return a.name.localeCompare(b.name);
    });

    // Write to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(sortedData, null, 2));
    
    console.log('✅ Successfully converted Excel file to JSON');
    console.log(`📁 Output: ${jsonPath}`);
    console.log(`📊 Total records: ${sortedData.length}`);
    
    // Show some statistics
    const categories = [...new Set(sortedData.map(item => item.category))];
    const manufacturers = [...new Set(sortedData.map(item => item.manufacturer))];
    const activeCount = sortedData.filter(item => item.inStock).length;
    
    console.log(`📊 Categories: ${categories.length}`);
    console.log(`🏭 Manufacturers: ${manufacturers.length}`);
    console.log(`✅ Active medicines: ${activeCount}`);
    console.log(`📋 Sample categories: ${categories.slice(0, 5).join(', ')}`);

  } catch (error) {
    console.error('❌ Error converting Excel to JSON:', error);
  }
}

// Run the conversion
convertExcelToJson();
