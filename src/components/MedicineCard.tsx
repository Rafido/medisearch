import React from 'react';
import { DollarSign } from 'lucide-react';
import type { Medicine } from '../utils/csvParser';
import styles from './MedicineCard.module.css';

interface MedicineCardProps {
  medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
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
    <div className={styles.medicineCard}>
      {/* Priority Labels - Single line */}
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

      {/* Medicine Details */}
      <div className={styles.cardContent}>
        <h3 className={styles.medicineName} title={medicine.name}>
          {medicine.name}
        </h3>
        
        <p className={styles.genericName} title={medicine.genericName}>
          {medicine.genericName}
        </p>

        <div className={styles.medicineDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Strength:</span>
            <span className={styles.detailValue}>{medicine.strength}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Form:</span>
            <span className={`${styles.detailValue} ${styles.dosageForm}`}>
              {medicine.dosageForm}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Package:</span>
            <span className={styles.detailValue}>{medicine.packageSize}</span>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceContainer}>
            <DollarSign size={12} />
            <span className={styles.price}>{formatPrice(medicine.price)}</span>
          </div>
          {medicine.inStock && (
            <span className={styles.inStock}>In Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};
