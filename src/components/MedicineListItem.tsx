import React from 'react';
import { DollarSign, Info } from 'lucide-react';
import type { Medicine } from '../utils/csvParser';
import styles from './MedicineListItem.module.css';

interface MedicineListItemProps {
  medicine: Medicine;
}

export const MedicineListItem: React.FC<MedicineListItemProps> = ({
  medicine,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className={styles.medicineListItem}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.headerSection}>
          <div className={styles.nameSection}>
            <h3 className={styles.medicineName}>{medicine.name}</h3>
            <p className={styles.genericName}>{medicine.genericName}</p>
          </div>
          
          {/* Priority Labels */}
          <div className={styles.labelsContainer}>
            {medicine.uppScope && (
              <span className={`${styles.label} ${styles.uppLabel}`}>UPP</span>
            )}
            {medicine.thiqa && (
              <span className={`${styles.label} ${styles.thiqaLabel}`}>Thiqa</span>
            )}
            {medicine.basic && (
              <span className={`${styles.label} ${styles.basicLabel}`}>Basic</span>
            )}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Strength:</span>
              <span className={styles.detailValue}>{medicine.strength}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Form:</span>
              <span className={`${styles.detailValue} ${styles.dosageForm}`}>
                {medicine.dosageForm}
              </span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Package:</span>
              <span className={styles.detailValue}>{medicine.packageSize}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Manufacturer:</span>
              <span className={styles.detailValue}>{medicine.manufacturer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Status */}
      <div className={styles.actionSection}>
        <div className={styles.priceContainer}>
          <DollarSign size={14} />
          <span className={styles.price}>{formatPrice(medicine.price)}</span>
        </div>
        
        {medicine.inStock && (
          <span className={styles.inStock}>In Stock</span>
        )}
      </div>
    </div>
  );
};
