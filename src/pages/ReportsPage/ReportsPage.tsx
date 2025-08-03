import { FileText, ChevronRight } from 'lucide-react';
import { useMedicines } from '../../hooks/useMedicines';
import { ReportGenerator } from '../../components/ReportGenerator';
import styles from './ReportsPage.module.css';

const ReportsPage = () => {
  const { medicines, isLoading } = useMedicines();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <FileText className={styles.spinIcon} size={32} />
          </div>
          <h2>Loading Reports...</h2>
          <p>Preparing report generation tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <div className={styles.breadcrumb}>
              <span>MedSearch</span>
              <ChevronRight size={16} />
              <span className={styles.currentPage}>Reports</span>
            </div>
            <h1 className={styles.pageTitle}>
              <FileText className={styles.titleIcon} size={32} />
              PDF Report Generator
            </h1>
            <p className={styles.pageDescription}>
              Generate comprehensive PDF reports from the UAE pharmaceutical database. 
              Create custom reports with filtered data and detailed medicine information.
            </p>
          </div>
          
          <div className={styles.headerStats}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{medicines.length.toLocaleString()}</div>
              <div className={styles.statLabel}>Available Records</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>PDF</div>
              <div className={styles.statLabel}>Export Format</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>Custom</div>
              <div className={styles.statLabel}>Report Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generator Section */}
      <div className={styles.reportSection}>
        <div className={styles.reportContainer}>
          <ReportGenerator medicines={medicines} onClose={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
