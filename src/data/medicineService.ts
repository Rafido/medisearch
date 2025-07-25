export interface Medicine {
  drugCode: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  packageSize: string;
  uppScope: boolean;
  includedInThiqa: boolean;
  includedInBasic: boolean;
  packageMarkup: number;
}

export const getMedicinePriority = (medicine: Medicine): number => {
  if (medicine.uppScope && medicine.includedInThiqa) return 3; // Highest priority
  if (medicine.uppScope) return 2; // Second highest priority
  if (medicine.includedInThiqa) return 1; // Third priority
  return 0; // Lowest priority
};

export const fetchAndSortMedicines = async (): Promise<Medicine[]> => {
  try {
    const response = await fetch('/skus.csv');
    const csvText = await response.text();
    
    // Skip header row and parse CSV
    const rows = csvText.split('\n').slice(1);
    const medicines: Medicine[] = rows
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
          uppScope: uppScope.toLowerCase() === 'yes',
          includedInThiqa: includedInThiqa.toLowerCase() === 'yes',
          includedInBasic: includedInBasic.toLowerCase() === 'yes',
          packageMarkup: parseFloat(packageMarkup) || 0
        };
      });

    // Sort medicines based on priority
    return medicines.sort((a, b) => {
      const priorityA = getMedicinePriority(a);
      const priorityB = getMedicinePriority(b);
      
      if (priorityB !== priorityA) {
        return priorityB - priorityA;
      }
      
      // If priorities are equal, sort by name
      return a.brandName.localeCompare(b.brandName);
    });
  } catch (error) {
    console.error('Error loading medicines:', error);
    return [];
  }
};
