import React, { useCallback } from 'react';
import type { Medicine } from '../../data/medicines';
import styles from './MedicineDetails.module.css';

interface MedicineDetailsProps {
  medicine: Medicine;
  onBack: () => void;
}

const MedicineDetails: React.FC<MedicineDetailsProps> = ({ medicine, onBack }) => {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className={styles.medicineDetails}>
      <div className={styles.medicineHeader}>
        <h2>{medicine.name}</h2>
        <button
          className={styles.closeButton}
          onClick={onBack}
          aria-label="Close details"
        >
          ✕
        </button>
      </div>
      
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Generic Name</span>
          <span className={styles.detailValue}>{medicine.genericName}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Strength</span>
          <span className={styles.detailValue}>{medicine.strength || 'N/A'}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Dosage Form</span>
          <span className={styles.detailValue}>{medicine.dosageForm || 'N/A'}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Package Size</span>
          <span className={styles.detailValue}>{medicine.packageSize || 'N/A'}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Price</span>
          <span className={styles.priceValue}>AED {medicine.price.toFixed(2)}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Coverage</span>
          <div className={styles.coverageBadges}>
            {medicine.uppScope && <span className={styles.uppBadge}>UPP</span>}
            {medicine.includedInThiqa && <span className={styles.thiqaBadge}>Thiqa</span>}
            {medicine.includedInBasic && <span className={styles.basicBadge}>Basic</span>}
            {!medicine.uppScope && !medicine.includedInThiqa && !medicine.includedInBasic && (
              <span className={styles.noCoverage}>No coverage information</span>
            )}
          </div>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Availability</span>
          <span className={`${styles.availabilityBadge} ${
            medicine.inStock ? styles.inStock : styles.outOfStock
          }`}>
            {medicine.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      
      {medicine.description && (
        <div className={styles.descriptionSection}>
          <h3>Additional Information</h3>
          <div className={styles.descriptionContent}>
            {medicine.description.split('|').map((part, i) => (
              <p key={i} className={styles.descriptionText}>{part.trim()}</p>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.actionButtons}>
        <button
          className={styles.backButton}
          onClick={onBack}
        >
          ← Back to Results
        </button>
        
        <button
          className={styles.printButton}
          onClick={handlePrint}
        >
          Print Details
        </button>
      </div>
    </div>
  );
};

export default MedicineDetails;
