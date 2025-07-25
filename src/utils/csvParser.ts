export interface Medicine {
  id: string;          // Using DOH Drug Code as id
  name: string;        // Using Brand Name
  genericName: string; // Using Generic Name
  strength: string;
  dosageForm: string;
  packageSize: string;
  category?: string;   // New field for UI
  price: number;       // Using Package Markup as price
  description?: string;
  sideEffects?: string[];
  inStock?: boolean;   // Derived from various fields
  manufacturer?: string;
  dosage?: string;     // Combining strength and dosageForm
  // New fields for enhanced display
  uppScope: boolean;   // UPP Scope
  thiqa: boolean;      // Included in Thiqa/ ABM - other than 1&7- Drug Formulary
  basic: boolean;      // Included In Basic Drug Formulary
  priorityScore: number; // For sorting based on UPP, Thiqa, Basic
}

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
    // Then sort by name
    if (a.name !== b.name) {
      return a.name.localeCompare(b.name);
    }
    // Then by generic name
    if (a.genericName !== b.genericName) {
      return a.genericName.localeCompare(b.genericName);
    }
    // Finally by price (lower price first)
    return a.price - b.price;
  });
};
