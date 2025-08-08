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
                <span className={styles.detailLabel}>Dispense Mode</span>
                <span className={styles.detailValue}>{medicine.dispenseMode || 'N/A'}</span>
              </div>
            </div>

            {/* Pricing Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Pricing Information</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Package Markup</span>
                <span className={styles.priceValue}>
                  {(() => {
                    const publicPrice = medicine.packagePriceToPublic || 0;
                    const pharmacyPrice = medicine.packagePriceToPharmacy || 0;
                    const markup = publicPrice - pharmacyPrice;
                    return markup > 0 ? `AED ${markup.toFixed(2)}` : 'None';
                  })()}
                </span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Package Price (Public)</span>
                <span className={styles.priceValue}>AED {(medicine.packagePriceToPublic || 0).toFixed(2)}</span>
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

              {medicine.unitMarkup && medicine.unitMarkup > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Unit Markup</span>
                  <span className={styles.priceValue}>AED {medicine.unitMarkup.toFixed(2)}</span>
                </div>
              )}
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
              
              {/* <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Stock Status</span>
                <span className={`${styles.detailValue} ${medicine.inStock ? styles.inStock : styles.outOfStock}`}>
                  {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div> */}

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
                <span className={styles.detailLabel}>UPP Scope</span>
                <span className={`${styles.detailValue} ${medicine.uppScope ? styles.covered : styles.notCovered}`}>
                  {medicine.uppScope ? 'Yes' : 'No'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Insurance Coverage</span>
                <span className={styles.detailValue}>{medicine.insuranceCoverage || 'N/A'}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Coverage Badges</span>
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

            {/* Formulary Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Drug Formulary Inclusion</h3>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Thiqa/ABM Formulary</span>
                <span className={`${styles.detailValue} ${medicine.thiqaFormulary ? styles.included : styles.notIncluded}`}>
                  {medicine.thiqaFormulary ? 'Included' : 'Not Included'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Basic Drug Formulary</span>
                <span className={`${styles.detailValue} ${medicine.basicFormulary ? styles.included : styles.notIncluded}`}>
                  {medicine.basicFormulary ? 'Included' : 'Not Included'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ABM 1 Formulary</span>
                <span className={`${styles.detailValue} ${medicine.abm1Formulary ? styles.included : styles.notIncluded}`}>
                  {medicine.abm1Formulary ? 'Included' : 'Not Included'}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ABM 7 Formulary</span>
                <span className={`${styles.detailValue} ${medicine.abm7Formulary ? styles.included : styles.notIncluded}`}>
                  {medicine.abm7Formulary ? 'Included' : 'Not Included'}
                </span>
              </div>
            </div>

            {/* Reimbursement Information */}
            {(medicine.thiqaMaxReimbursement || medicine.thiqaCopay || medicine.basicCopay) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Reimbursement & Co-pay</h3>
                
                {medicine.thiqaMaxReimbursement && medicine.thiqaMaxReimbursement > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Thiqa Max Reimbursement</span>
                    <span className={styles.priceValue}>AED {medicine.thiqaMaxReimbursement.toFixed(2)}</span>
                  </div>
                )}

                {medicine.thiqaCopay && medicine.thiqaCopay > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Thiqa Co-pay</span>
                    <span className={styles.priceValue}>AED {medicine.thiqaCopay.toFixed(2)}</span>
                  </div>
                )}

                {medicine.basicCopay && medicine.basicCopay > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Basic Co-pay</span>
                    <span className={styles.priceValue}>AED {medicine.basicCopay.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* UPP Information */}
            {(medicine.uppEffectiveDate || medicine.uppUpdatedDate || medicine.uppExpiryDate) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>UPP Dates</h3>
                
                {medicine.uppEffectiveDate && medicine.uppEffectiveDate > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>UPP Effective Date</span>
                    <span className={styles.detailValue}>
                      {new Date((medicine.uppEffectiveDate - 25569) * 86400 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {medicine.uppUpdatedDate && medicine.uppUpdatedDate > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>UPP Updated Date</span>
                    <span className={styles.detailValue}>
                      {new Date((medicine.uppUpdatedDate - 25569) * 86400 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {medicine.uppExpiryDate && medicine.uppExpiryDate > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>UPP Expiry Date</span>
                    <span className={styles.detailValue}>
                      {new Date((medicine.uppExpiryDate - 25569) * 86400 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;
