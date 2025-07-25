interface RawMedicineData {
  drugCode: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  packageSize: string;
  uppScope: 'Yes' | 'No';
  includedInThiqa: 'Yes' | 'No';
  includedInBasic: 'Yes' | 'No';
  packageMarkup: number;
}

export interface Medicine {
  drugCode: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  price: number;
  isUpp: boolean;
  isThiqa: boolean;
  description?: string;
  inStock: boolean;
  category: string;
  sideEffects?: string[];
}

const transformRawToMedicine = (raw: RawMedicineData): Medicine => {
  // Calculate estimated price based on markup
  const basePrice = 100; // This would come from actual price data
  const price = basePrice * (1 + raw.packageMarkup / 100);

  // Determine category based on generic name
  const getCategory = (genericName: string): string => {
    const categories = {
      'paracetamol': 'Pain Relief',
      'amoxicillin': 'Antibiotics',
      'salbutamol': 'Respiratory',
      'metformin': 'Diabetes',
      // Add more mappings as needed
    };

    const match = Object.entries(categories).find(([key]) => 
      genericName.toLowerCase().includes(key)
    );

    return match ? match[1] : 'General';
  };

  return {
    drugCode: raw.drugCode,
    brandName: raw.brandName,
    genericName: raw.genericName,
    strength: raw.strength,
    dosageForm: raw.dosageForm,
    manufacturer: 'Manufacturer', // This would come from actual data
    price: parseFloat(price.toFixed(2)),
    isUpp: raw.uppScope === 'Yes',
    isThiqa: raw.includedInThiqa === 'Yes',
    description: `${raw.genericName} ${raw.strength} ${raw.dosageForm}`,
    inStock: true, // This would come from actual inventory data
    category: getCategory(raw.genericName),
    sideEffects: [] // This would come from actual medical data
  };
};

const getPriorityScore = (medicine: Medicine): number => {
  if (medicine.isUpp && medicine.isThiqa) return 3;
  if (medicine.isUpp) return 2;
  if (medicine.isThiqa) return 1;
  return 0;
};

export const loadMedicines = async (): Promise<Medicine[]> => {
  try {
    const response = await fetch('/skus.csv');
    const text = await response.text();
    
    // Parse CSV and convert to array of medicines
    const rows = text.split('\n').slice(1); // Skip header row
    
    const rawMedicines = rows
      .filter(row => row.trim()) // Remove empty rows
      .map(row => {
        const [
          drugCode,
          brandName,
          genericName,
          strength,
          dosageForm,
          packageSize,
          uppScope,
          includedInThiqa,
          includedInBasic,
          packageMarkup
        ] = row.split(',').map(field => field.trim());

        return {
          drugCode,
          brandName,
          genericName,
          strength,
          dosageForm,
          packageSize,
          uppScope: uppScope as 'Yes' | 'No',
          includedInThiqa: includedInThiqa as 'Yes' | 'No',
          includedInBasic: includedInBasic as 'Yes' | 'No',
          packageMarkup: parseFloat(packageMarkup) || 0,
        };
      });

    const medicines = rawMedicines.map(transformRawToMedicine);

    // Sort medicines by priority
    return medicines.sort((a, b) => {
      const priorityA = getPriorityScore(a);
      const priorityB = getPriorityScore(b);
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
      
      // If same priority, sort alphabetically by brand name
      return a.brandName.localeCompare(b.brandName);
    });
  } catch (error) {
    console.error('Error loading medicines:', error);
    throw new Error('Failed to load medicines data');
  }
};
