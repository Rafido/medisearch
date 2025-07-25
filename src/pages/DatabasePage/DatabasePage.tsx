import { useState, useEffect } from 'react';
import { Search, Download, Filter, RefreshCw, Database, Eye, ChevronRight } from 'lucide-react';
import styles from './DatabasePage.module.css';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
}

const DatabasePage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);

  // Load medicines data
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch('/skus.csv');
        const csvText = await response.text();
        
        const lines = csvText.split('\n');
        // Skip headers for processing
        lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const medicineData: Medicine[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            
            if (values.length >= 3) {
              medicineData.push({
                id: values[0] || `med-${i}`,
                name: values[1] || 'Unknown Medicine',
                genericName: values[2] || 'Unknown Generic'
              });
            }
          }
        }
        
        setMedicines(medicineData);
        setFilteredMedicines(medicineData);
        setTotalRecords(medicineData.length);
      } catch (error) {
        console.error('Error loading medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

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
              <span>MediSearch</span>
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
              <tr>
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
    </div>
  );
};

export default DatabasePage;
