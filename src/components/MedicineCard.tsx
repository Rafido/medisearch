import React from 'react';
import type { Medicine } from '../utils/csvParser';
import styles from './MedicineCard.module.css';

interface MedicineCardProps {
  medicine: Medicine;
  onExpand?: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onExpand,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div 
      className={styles.medicineCard}
      onClick={() => onExpand?.(medicine)}
      style={{ cursor: onExpand ? 'pointer' : 'default' }}
    >
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
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Manufacturer:</span>
            <span 
              className={`${styles.detailValue} ${styles.manufacturerName}`}
              title={medicine.manufacturer || medicine.manufacturerName || 'Unknown Manufacturer'}
            >
              {(medicine.manufacturer || medicine.manufacturerName || 'Unknown Manufacturer').length > 20 
                ? `${(medicine.manufacturer || medicine.manufacturerName || 'Unknown Manufacturer').substring(0, 20)}...` 
                : (medicine.manufacturer || medicine.manufacturerName || 'Unknown Manufacturer')}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Distributor:</span>
            <span 
              className={`${styles.detailValue} ${styles.distributorName}`}
              title={medicine.agentName || 'Unknown Distributor'}
            >
              {(medicine.agentName || 'Unknown Distributor').length > 20 
                ? `${(medicine.agentName || 'Unknown Distributor').substring(0, 20)}...` 
                : (medicine.agentName || 'Unknown Distributor')}
            </span>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceContainer}>
            {/* Package Markup (Shop Margin) - Left */}
            <div className={styles.mainPriceRow}>
              <span className={styles.aedLabel}>Package Markup</span>
              <span className={styles.price}>
                {(() => {
                  const publicPrice = medicine.packagePriceToPublic || 0;
                  const pharmacyPrice = medicine.packagePriceToPharmacy || 0;
                  const markup = publicPrice - pharmacyPrice;
                  return markup > 0 ? formatPrice(markup) : 'None';
                })()}
              </span>
            </div>
            
            {/* Price to Public - Right */}
            <div className={styles.publicPriceRow}>
              <span className={styles.publicPriceLabel}>Price to Public:</span>
              <span className={styles.publicPrice}>{formatPrice(medicine.packagePriceToPublic || medicine.price || 0)}</span>
            </div>
          </div>
          {/* {medicine.inStock && (
            <span className={styles.inStock}>In Stock</span>
          )} */}
        </div>
      </div>
    </div>
  );
};
