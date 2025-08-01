import React from 'react';
import type { Medicine } from '../../utils/csvParser';
import styles from './MedicineDetails.module.css';

interface MedicineDetailsProps {
  medicine: Medicine;
  onBack: () => void;
}

const MedicineDetails: React.FC<MedicineDetailsProps> = ({ medicine, onBack }) => {
  return (
    <div className={styles.medicineDetails} onClick={onBack}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
          <div className={styles.leftColumn}>
            {/* Basic Medicine Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Generic Name</span>
                <span className={styles.detailValue}>{medicine.genericName || 'N/A'}</span>
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
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{medicine.category || 'N/A'}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dosage</span>
                <span className={styles.detailValue}>{medicine.dosage || 'N/A'}</span>
              </div>
            </div>

            {/* Codes and Identification */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Codes & Identification</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Drug Code</span>
                <span className={styles.detailValue}>{medicine.drugCode || medicine.id || 'N/A'}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Generic Code</span>
                <span className={styles.detailValue}>{medicine.genericCode || 'N/A'}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Greenrain Code</span>
                <span className={styles.detailValue}>{medicine.greenrainCode || 'N/A'}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dispense Mode</span>
                <span className={styles.detailValue}>{medicine.dispenseMode || 'N/A'}</span>
              </div>
            </div>

            {/* Pricing Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Pricing Information</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Package Price (Public)</span>
                <span className={styles.priceValue}>AED {(medicine.packagePriceToPublic || medicine.price || 0).toFixed(2)}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Package Price (Pharmacy)</span>
                <span className={styles.priceValue}>AED {(medicine.packagePriceToPharmacy || 0).toFixed(2)}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Unit Price (Public)</span>
                <span className={styles.priceValue}>AED {(medicine.unitPriceToPublic || 0).toFixed(2)}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Unit Price (Pharmacy)</span>
                <span className={styles.priceValue}>AED {(medicine.unitPriceToPharmacy || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            {/* Manufacturer & Distribution */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Manufacturer & Distribution</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Manufacturer</span>
                <span className={styles.detailValue}>{medicine.manufacturer || medicine.manufacturerName || 'N/A'}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Distributor/Agent</span>
                <span className={styles.detailValue}>{medicine.agentName || 'N/A'}</span>
              </div>
            </div>

            {/* Status & Availability */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Status & Availability</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Stock Status</span>
                <span className={`${styles.detailValue} ${medicine.inStock ? styles.inStock : styles.outOfStock}`}>
                  {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>{medicine.status || 'N/A'}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Insurance Plan</span>
                <span className={styles.detailValue}>{medicine.insurancePlan || 'N/A'}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Priority Score</span>
                <span className={styles.detailValue}>{medicine.priorityScore || 'N/A'}</span>
              </div>
            </div>

            {/* Important Dates */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Important Dates</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Change Date</span>
                <span className={styles.detailValue}>
                  {medicine.lastChangeDate ? new Date(medicine.lastChangeDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Delete Effective Date</span>
                <span className={styles.detailValue}>
                  {medicine.deleteEffectiveDate ? new Date(medicine.deleteEffectiveDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Coverage Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Insurance Coverage</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Coverage</span>
                <div className={styles.coverageBadges}>
                  {medicine.uppScope && <span className={styles.uppBadge}>UPP</span>}
                  {medicine.thiqa && <span className={styles.thiqaBadge}>Thiqa</span>}
                  {medicine.basic && <span className={styles.basicBadge}>Basic</span>}
                  {!medicine.uppScope && !medicine.thiqa && !medicine.basic && (
                    <span className={styles.noCoverage}>No Coverage</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;
