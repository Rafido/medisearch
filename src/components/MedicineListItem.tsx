import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Medicine } from '../utils/csvParser';
import styles from './MedicineListItem.module.css';

interface MedicineListItemProps {
  medicine: Medicine;
  onExpand?: (medicine: Medicine) => void;
}

export const MedicineListItem: React.FC<MedicineListItemProps> = ({
  medicine,
  onExpand,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const truncateManufacturer = (name: string) => {
    if (!name || name === 'Unknown Manufacturer') return name;
    
    // Common abbreviations for pharmaceutical companies
    const abbreviations: { [key: string]: string } = {
      'Corporation': 'Corp.',
      'Pharmaceuticals': 'Pharma',
      'International': 'Intl.',
      'Limited': 'Ltd.',
      'Company': 'Co.',
      'Healthcare': 'Health',
      'Laboratories': 'Labs',
      'Manufacturing': 'Mfg.'
    };
    
    let shortened = name;
    Object.entries(abbreviations).forEach(([full, abbrev]) => {
      shortened = shortened.replace(new RegExp(full, 'gi'), abbrev);
    });
    
    // If still too long, take first part
    if (shortened.length > 15) {
      const parts = shortened.split(' ');
      if (parts.length > 1) {
        return parts[0] + (parts[1] ? ` ${parts[1]}` : '');
      }
      return shortened.substring(0, 15) + '...';
    }
    
    return shortened;
  };

  return (
    <div 
      className={styles.medicineListItem}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Item clicked:', medicine.name, 'onExpand:', !!onExpand);
        if (onExpand) {
          onExpand(medicine);
        }
      }}
      style={{ 
        cursor: onExpand ? 'pointer' : 'default',
        pointerEvents: 'auto' 
      }}
    >
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
              <span 
                className={`${styles.detailValue} ${styles.manufacturerName}`}
                title={medicine.manufacturer || medicine.manufacturerName || 'Unknown Manufacturer'}
              >
                {truncateManufacturer(medicine.manufacturer || medicine.manufacturerName || 'Unknown Manufacturer')}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Distributor:</span>
              <span 
                className={`${styles.detailValue} ${styles.distributorName}`}
                title={medicine.agentName || 'Unknown Distributor'}
              >
                {truncateManufacturer(medicine.agentName || 'Unknown Distributor')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Status */}
      <div className={styles.actionSection}>
        <div className={styles.priceContainer}>
          <div className={styles.mainPriceRow}>
            <span className={styles.aedLabel}>AED</span>
            <span className={styles.price}>
              {medicine.packageMarkup && medicine.packageMarkup > 0 
                ? formatPrice(medicine.packageMarkup) 
                : (medicine.price && medicine.price > 0 
                  ? formatPrice(medicine.price)
                  : ""
                )
              }
            </span>
            <span className={styles.priceLabel}>Package Markup</span>
          </div>
          {medicine.packagePriceToPublic && medicine.packagePriceToPublic > 0 && (
            <div className={styles.publicPriceRow}>
              <span className={styles.publicPriceLabel}>Price to Public:</span>
              <span className={styles.publicPrice}>{formatPrice(medicine.packagePriceToPublic)}</span>
            </div>
          )}
        </div>
        
        {/* {medicine.inStock && (
          <span className={styles.inStock}>In Stock</span>
        )} */}
        
        {/* Expand Button */}
        {onExpand && (
          <button 
            className={styles.expandButton}
            onClick={() => onExpand(medicine)}
            aria-label="View medicine details"
          >
            <ChevronRight className={styles.expandIcon} />
          </button>
        )}
      </div>
    </div>
  );
};
