import { useState, useEffect } from 'react';
import { Search, Download, Filter, RefreshCw, Database, Eye, ChevronRight } from 'lucide-react';
import { useMedicines } from '../../hooks/useMedicines';
import type { Medicine } from '../../utils/csvParser';
import styles from './DatabasePage.module.css';

const DatabasePage = () => {
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const { medicines, isLoading: loading } = useMedicines();

  // Filter medicines based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedicines(medicines);
      setTotalRecords(medicines.length);
    } else {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicines(filtered);
      setTotalRecords(filtered.length);
    }
    setCurrentPage(1);
  }, [searchTerm, medicines]);

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  // Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    const csvContent = [
      ['DOH Drug Code', 'Brand Name', 'Generic Name'],
      ...filteredMedicines.map(med => [med.id, med.name, med.genericName])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medicines-database-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <RefreshCw className={styles.spinIcon} size={32} />
          </div>
          <h2>Loading Database...</h2>
          <p>Fetching medicine records from UAE database</p>
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
              <span className={styles.currentPage}>Database</span>
            </div>
            <h1 className={styles.pageTitle}>
              <Database className={styles.titleIcon} size={32} />
              UAE Pharmaceutical Database
            </h1>
            <p className={styles.pageDescription}>
              Complete database of medicines registered in the United Arab Emirates. 
              Browse, search, and export pharmaceutical data.
            </p>
          </div>
          
          <div className={styles.headerStats}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{totalRecords.toLocaleString()}</div>
              <div className={styles.statLabel}>Total Records</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{filteredMedicines.length.toLocaleString()}</div>
              <div className={styles.statLabel}>Filtered Results</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{totalPages}</div>
              <div className={styles.statLabel}>Total Pages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search by medicine name, generic name, or DOH code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            onClick={handleRefresh}
            className={styles.actionButton}
            title="Refresh Database"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className={styles.actionButton}
            title="Export to CSV"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeader}>
                  <div className={styles.headerContent}>
                    DOH Drug Code
                    <Filter size={14} />
                  </div>
                </th>
                <th className={styles.tableHeader}>
                  <div className={styles.headerContent}>
                    Brand Name
                    <Filter size={14} />
                  </div>
                </th>
                <th className={styles.tableHeader}>
                  <div className={styles.headerContent}>
                    Generic Name
                    <Filter size={14} />
                  </div>
                </th>
                <th className={styles.tableHeader}>
                  <div className={styles.headerContent}>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentMedicines.map((medicine) => (
                <tr key={medicine.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.codeCell}>
                      <span className={styles.drugCode}>{medicine.id}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.nameCell}>
                      <span className={styles.brandName}>{medicine.name}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.genericCell}>
                      <span className={styles.genericName}>{medicine.genericName}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionCell}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => setSelectedMedicine(medicine)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMedicines.length)} of {filteredMedicines.length} records
          </div>
          
          <div className={styles.pagination}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`${styles.pageButton} ${currentPage === pageNumber ? styles.activePage : ''}`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMedicine(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Medicine Details</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedMedicine(null)}
                title="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.medicineDetails}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>DOH Drug Code</div>
                    <div className={styles.detailValue}>{selectedMedicine.id}</div>
                  </div>
                  
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Brand Name</div>
                    <div className={styles.detailValue}>{selectedMedicine.name}</div>
                  </div>
                  
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Generic Name</div>
                    <div className={styles.detailValue}>{selectedMedicine.genericName}</div>
                  </div>
                  
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Strength</div>
                    <div className={styles.detailValue}>{selectedMedicine.strength || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Dosage Form</div>
                    <div className={styles.detailValue}>{selectedMedicine.dosageForm || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Package Size</div>
                    <div className={styles.detailValue}>{selectedMedicine.packageSize || 'N/A'}</div>
                  </div>
                  
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Price</div>
                    <div className={styles.detailValue}>AED {selectedMedicine.price?.toFixed(2) || '0.00'}</div>
                  </div>
                  
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Manufacturer</div>
                    <div className={styles.detailValue}>{selectedMedicine.manufacturer || 'UAE Pharmacy'}</div>
                  </div>
                </div>
                
                <div className={styles.statusSection}>
                  <h3 className={styles.statusTitle}>Coverage Status</h3>
                  <div className={styles.statusGrid}>
                    <div className={`${styles.statusCard} ${selectedMedicine.uppScope ? styles.active : styles.inactive}`}>
                      <div className={styles.statusLabel}>UPP Scope</div>
                      <div className={styles.statusValue}>{selectedMedicine.uppScope ? 'Yes' : 'No'}</div>
                    </div>
                    
                    <div className={`${styles.statusCard} ${selectedMedicine.thiqa ? styles.active : styles.inactive}`}>
                      <div className={styles.statusLabel}>Thiqa Formulary</div>
                      <div className={styles.statusValue}>{selectedMedicine.thiqa ? 'Yes' : 'No'}</div>
                    </div>
                    
                    <div className={`${styles.statusCard} ${selectedMedicine.basic ? styles.active : styles.inactive}`}>
                      <div className={styles.statusLabel}>Basic Formulary</div>
                      <div className={styles.statusValue}>{selectedMedicine.basic ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.additionalInfo}>
                  <h3 className={styles.infoTitle}>Additional Information</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Category:</span>
                      <span className={styles.infoValue}>{selectedMedicine.category || 'Prescription'}</span>
                    </div>
                    {/* <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>In Stock:</span>
                      <span className={styles.infoValue}>{selectedMedicine.inStock ? 'Yes' : 'No'}</span>
                    </div> */}
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Priority Score:</span>
                      <span className={styles.infoValue}>{selectedMedicine.priorityScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePage;
