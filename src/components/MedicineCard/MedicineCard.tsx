import React from 'react';
import { Package, DollarSign } from 'lucide-react';
import type { Medicine } from '../../utils/csvParser';
import styles from './MedicineCard.module.css';

export type ViewMode = 'grid' | 'list';

interface MedicineCardProps {
  medicine: Medicine;
  onSelect: (medicine: Medicine) => void;
  viewMode: ViewMode;
  isLoading?: boolean;
  className?: string;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onSelect,
  viewMode,
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`${styles.medicineCard} ${styles[viewMode]} ${styles.skeleton} ${className}`}>
        <div className={styles.cardHeader}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonBadge} />
        </div>
        <div className={styles.cardContent}>
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonBadges}>
            <div className={styles.skeletonBadge} />
            <div className={styles.skeletonBadge} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.medicineCard} ${styles[viewMode]} ${className}`}
      onClick={() => onSelect(medicine)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <h3 className={styles.medicineName}>{medicine.name}</h3>
          <span className={styles.drugCode}>{medicine.id}</span>
        </div>
        {viewMode === 'grid' && medicine.category && (
          <div className={styles.coverage}>
            <span className={`${styles.badge} ${styles.categoryBadge}`}>
              <Package size={14} /> {medicine.category}
            </span>
          </div>
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.mainInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Generic Name:</span>
            <span className={styles.value}>{medicine.genericName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Strength:</span>
            <span className={styles.value}>{medicine.strength}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Form:</span>
            <span className={styles.value}>{medicine.dosageForm}</span>
          </div>
          {viewMode === 'grid' && (
            <div className={styles.infoRow}>
              <span className={styles.label}>Package:</span>
              <span className={styles.value}>{medicine.packageSize}</span>
            </div>
          )}
        </div>

        {viewMode === 'list' && medicine.category && (
          <div className={styles.coverage}>
            <span className={`${styles.badge} ${styles.categoryBadge}`}>
              <Package size={14} /> {medicine.category}
            </span>
          </div>
        )}

        <div className={styles.priceSection}>
          <span className={styles.price}>
            <DollarSign size={14} className={styles.priceIcon} />
            AED {medicine.price.toFixed(2)}
          </span>
          <button
            className={styles.viewDetailsBtn}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(medicine);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
