import { useState, useEffect } from 'react';
import { parseCSV, sortMedicines } from '../utils/csvParser';
import type { Medicine } from '../utils/csvParser';

export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the CSV file
        const response = await fetch('/skus.csv');
        if (!response.ok) {
          throw new Error(`Failed to load medicines: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const parsedMedicines = await parseCSV(csvText);
        const sortedMedicines = sortMedicines(parsedMedicines);
        
        setMedicines(sortedMedicines);
      } catch (err) {
        console.error('Error loading medicines:', err);
        setError(err instanceof Error ? err : new Error('Failed to load medicines'));
      } finally {
        setIsLoading(false);
      }
    };

    loadMedicines();
  }, []);

  return { medicines, isLoading, error };
};
