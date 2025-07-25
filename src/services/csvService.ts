// import type { Medicine } from '../data/medicines';

// export interface CsvMedicine {
//   'DOH Drug Code': string;
//   'Brand Name': string;
//   'Generic Name': string;
//   'Strength': string;
//   'Dosage Form': string;
//   'Package Size': string;
//   'UPP Scope': 'Yes' | 'No';
//   'Included in Thiqa/ ABM - other than 1&7- Drug Formulary': 'Yes' | 'No';
//   'Included In Basic Drug Formulary': 'Yes' | 'No';
//   'Package Markup': string;
// }

// export const loadCsvData = async (): Promise<Medicine[]> => {
//   try {
//     const response = await fetch('/skus.csv');
//     const csvText = await response.text();
    
//     // Parse CSV text
//     const lines = csvText.split('\n');
//     const headers = lines[0].split(',').map(h => h.trim());
    
//     const medicines: Medicine[] = [];
    
//     for (let i = 1; i < lines.length; i++) {
//       if (!lines[i].trim()) continue; // Skip empty lines
      
//       // Handle quoted fields that might contain commas
//       const values = lines[i].match(/\s*("[^"]*"|[^,]*)\s*/g)?.map(v => v.trim().replace(/^"|"$/g, '')) || [];
      
//       if (values.length < 10) continue; // Skip invalid lines
      
//       const medicine: Record<string, string> = {};
//       headers.forEach((header, index) => {
//         medicine[header] = values[index]?.trim() || '';
//       });
      
//       // Transform to our Medicine type
//       medicines.push({
//         id: i,
//         name: medicine['Brand Name'] || 'Unknown Brand',
//         genericName: medicine['Generic Name'] || 'Unknown Generic',
//         strength: medicine['Strength'] || '',
//         dosageForm: medicine['Dosage Form'] || '',
//         packageSize: medicine['Package Size'] || '',
//         uppScope: medicine['UPP Scope'] === 'Yes',
//         includedInThiqa: medicine['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
//         includedInBasic: medicine['Included In Basic Drug Formulary'] === 'Yes',
//         price: parseFloat(medicine['Package Markup'].replace(/[^0-9.-]+/g, '')) || 0,
//         inStock: true, // Assuming all are in stock
//         description: `DOH Drug Code: ${medicine['DOH Drug Code']} | Package Size: ${medicine['Package Size']}`
//       });
//     }
    
//     return medicines;
//   } catch (error) {
//     console.error('Error loading CSV data:', error);
//     return [];
//   }
// };
