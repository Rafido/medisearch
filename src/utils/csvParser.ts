export interface Medicine {
  id: string;                    // Drug Code
  name: string;                  // Package Name (Brand Name)
  genericName: string;           // Generic Name
  strength: string;              // Strength
  dosageForm: string;            // Dosage Form
  packageSize: string;           // Package Size
  price: number;                 // Package Price to Public
  category?: string;             // Derived from dosage form or generic name
  description?: string;          // Generated from drug info
  sideEffects?: string[];        // Not available in Excel - placeholder
  inStock?: boolean;             // Derived from Status field
  manufacturer?: string;         // Manufacturer Name
  dosage?: string;               // Combining strength and dosageForm
  
  // Original fields for compatibility
  uppScope: boolean;             // Will be derived from Insurance Plan or other logic
  thiqa: boolean;                // Will be derived from Insurance Plan or other logic  
  basic: boolean;                // Will be derived from Insurance Plan or other logic
  priorityScore: number;         // Calculated priority score
  
  // New fields from Excel data
  drugCode: string;              // Drug Code (same as id but explicit)
  greenrainCode?: string;        // Greenrain Code
  insurancePlan?: string;        // Insurance Plan
  genericCode?: string;          // Generic Code
  dispenseMode?: string;         // Dispense Mode
  packagePriceToPublic?: number; // Package Price to Public
  packagePriceToPharmacy?: number; // Package Price to Pharmacy
  unitPriceToPublic?: number;    // Unit Price to Public
  unitPriceToPharmacy?: number;  // Unit Price to Pharmacy
  status?: string;               // Status (Active/Inactive)
  deleteEffectiveDate?: string;  // Delete Effective Date
  lastChangeDate?: number;       // Last Change Date
  agentName?: string;            // Agent Name
  manufacturerName?: string;     // Manufacturer Name (more detailed than manufacturer)
}

// Excel parser for Drugs.xlsx
export const parseExcel = async (excelData: any[]): Promise<Medicine[]> => {
  return excelData.map(row => {
    // Determine category based on dosage form or generic name
    const category = determineDrugCategory(row['Dosage Form'], row['Generic Name']);
    
    // Determine insurance coverage (placeholder logic - adjust based on your business rules)
    const insurancePlan = row['Insurance Plan'] || '';
    const uppScope = insurancePlan.toLowerCase().includes('upp') || Math.random() > 0.7; // Placeholder logic
    const thiqa = insurancePlan.toLowerCase().includes('thiqa') || Math.random() > 0.6; // Placeholder logic
    const basic = insurancePlan.toLowerCase().includes('basic') || Math.random() > 0.8; // Placeholder logic
    
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

    const medicine: Medicine = {
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
      status: row['Status'] || '',
      deleteEffectiveDate: row['Delete Effective Date'] || '',
      lastChangeDate: row['Last Change Date'] || 0,
      agentName: row['Agent Name'] || '',
      manufacturerName: row['Manufacturer Name'] || '',
    };
    
    return medicine;
  }).filter(medicine => medicine.id && medicine.name); // Filter out invalid records
};

// Helper function to determine drug category
const determineDrugCategory = (dosageForm: string, genericName: string): string => {
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
};

// Original CSV parser (kept for backward compatibility)
// Original CSV parser (kept for backward compatibility)
export const parseCSV = async (csvText: string): Promise<Medicine[]> => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    // Handle cases where values might contain commas (in quotes)
    const row: Record<string, string> = {};
    let currentValue = '';
    let currentIndex = 0;
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row[headers[currentIndex]] = currentValue.trim();
        currentIndex++;
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    if (currentValue) {
      row[headers[currentIndex]] = currentValue.trim();
    }

    // Extract UPP, Thiqa, Basic information
    const uppScope = (row['UPP Scope'] || '').toLowerCase() === 'yes';
    const thiqa = (row['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] || '').toLowerCase() === 'yes';
    const basic = (row['Included In Basic Drug Formulary'] || '').toLowerCase() === 'yes';
    
    // Calculate priority score for sorting (higher score = higher priority)
    let priorityScore = 0;
    if (uppScope) priorityScore += 4;
    if (thiqa) priorityScore += 2;
    if (basic) priorityScore += 1;

    const medicine: Medicine = {
      id: row['DOH Drug Code'] || '',
      name: row['Brand Name'] || '',
      genericName: row['Generic Name'] || '',
      strength: row['Strength'] || '',
      dosageForm: row['Dosage Form'] || '',
      packageSize: row['Package Size'] || '',
      price: parseFloat((row['Package Markup'] || '0').replace(/,/g, '')),
      category: 'Prescription', // Default category
      dosage: `${row['Strength']} ${row['Dosage Form']}`.trim(),
      inStock: true, // Default to true
      manufacturer: 'UAE Pharmacy', // Default manufacturer
      uppScope,
      thiqa,
      basic,
      priorityScore,
      // Excel fields set to defaults for CSV
      drugCode: row['DOH Drug Code'] || '',
      greenrainCode: '',
      insurancePlan: '',
      genericCode: '',
      dispenseMode: '',
      packagePriceToPublic: parseFloat((row['Package Markup'] || '0').replace(/,/g, '')),
      packagePriceToPharmacy: 0,
      unitPriceToPublic: 0,
      unitPriceToPharmacy: 0,
      status: 'Active',
      deleteEffectiveDate: '',
      lastChangeDate: 0,
      agentName: '',
      manufacturerName: 'UAE Pharmacy',
    };
    
    return medicine;
  }).filter(medicine => medicine.id); // Filter out any empty rows
};

export const sortMedicines = (medicines: Medicine[]): Medicine[] => {
  return [...medicines].sort((a, b) => {
    // First sort by priority score (higher score first)
    if (a.priorityScore !== b.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    // Then sort by price (higher price first)
    if (a.price !== b.price) {
      return b.price - a.price;
    }
    // Then sort by name
    if (a.name !== b.name) {
      return a.name.localeCompare(b.name);
    }
    // Finally by generic name
    return a.genericName.localeCompare(b.genericName);
  });
};
