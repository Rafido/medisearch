import { useState, useEffect, useCallback, useRef } from 'react';
import { useMedicines } from '../../hooks/useMedicines';
import type { Medicine } from '../../utils/csvParser';
import { sortMedicines } from '../../utils/csvParser';
import { 
  Database, 
  Keyboard, 
  Search, 
  Pill, 
  Shield, 
  Clock, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Target,
  Zap,
  Eye,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X,
  Grid,
  List
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { MedicineCard } from '../../components/MedicineCard';
import { MedicineListItem } from '../../components/MedicineListItem';
import styles from './SearchPage.module.css';

export type ViewMode = 'grid' | 'list';

type SuggestionMedicine = Medicine & {
  _isGenericSuggestion?: boolean;
  _genericName?: string;
  _medicineCount?: number;
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [showSearchTips, setShowSearchTips] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionMedicine[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const searchTimeout = useRef<number | undefined>(undefined);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { medicines, isLoading, error } = useMedicines() as {
    medicines: Medicine[];
    isLoading: boolean;
    error: Error | null;
  };

  useEffect(() => {
    if (medicines.length > 0) {
      console.log('Medicines loaded successfully:', medicines.length);
    }
  }, [medicines]);

  const generateSuggestions = useCallback((query: string) => {
    if (!query.trim() || medicines.length === 0) {
      setSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    
    // Find medicines that match the query
    const matchingMedicines = medicines.filter(medicine => {
      const nameMatch = medicine.name?.toLowerCase().includes(lowerQuery);
      const genericMatch = medicine.genericName?.toLowerCase().includes(lowerQuery);
      const codeMatch = medicine.id?.toLowerCase().includes(lowerQuery);
      
      return nameMatch || genericMatch || codeMatch;
    });

    // Group by generic names and get unique generic names
    const genericNamesMap = new Map<string, Medicine[]>();
    
    matchingMedicines.forEach(medicine => {
      const genericName = medicine.genericName || 'Unknown Generic';
      if (!genericNamesMap.has(genericName)) {
        genericNamesMap.set(genericName, []);
      }
      genericNamesMap.get(genericName)!.push(medicine);
    });

    // Convert to array and sort by relevance
    const genericSuggestions: SuggestionMedicine[] = [];
    
    Array.from(genericNamesMap.entries())
      .sort((a, b) => {
        // Prioritize exact matches in generic name
        const aExactMatch = a[0].toLowerCase() === lowerQuery;
        const bExactMatch = b[0].toLowerCase() === lowerQuery;
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // Then prioritize generic names that start with the query
        const aStartsWith = a[0].toLowerCase().startsWith(lowerQuery);
        const bStartsWith = b[0].toLowerCase().startsWith(lowerQuery);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Finally sort by number of medicines with that generic name (more = more relevant)
        return b[1].length - a[1].length;
      })
      .slice(0, 8)
      .forEach(([genericName, medicinesWithGeneric]) => {
        // Use the first medicine as representative, but mark it as a generic suggestion
        const representative = medicinesWithGeneric[0];
        genericSuggestions.push({
          ...representative,
          _isGenericSuggestion: true,
          _genericName: genericName,
          _medicineCount: medicinesWithGeneric.length
        });
      });

    setSuggestions(genericSuggestions);
    
    // Automatically show suggestions if there are any and query is not empty
    if (query.trim() && genericSuggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [medicines]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setSearchTriggered(false);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Show suggestions immediately if query is not empty
    if (newQuery.trim()) {
      generateSuggestions(newQuery);
      
      searchTimeout.current = window.setTimeout(() => {
        generateSuggestions(newQuery);
      }, 150); // Reduced from 300ms to 150ms for faster response
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (medicine: SuggestionMedicine, displayText: string) => {
    if (medicine._isGenericSuggestion && medicine._genericName) {
      // If it's a generic suggestion, search for all medicines with that generic name
      setSearchQuery(medicine._genericName);
      setShowSuggestions(false);
      
      // Filter medicines by the selected generic name
      const genericResults = medicines.filter(med => 
        med.genericName?.toLowerCase() === medicine._genericName?.toLowerCase()
      );
      
      const sortedResults = sortMedicines(genericResults);
      setFilteredMedicines(sortedResults);
      setSearchTriggered(true);
    } else {
      // Original behavior for individual medicine selection
      setSearchQuery(displayText);
      setShowSuggestions(false);
      setSelectedMedicine(medicine);
      setFilteredMedicines([medicine]);
      setSearchTriggered(true);
    }
  };

  const executeSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredMedicines([]);
      setSearchTriggered(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();
    
    const results = medicines.filter(medicine => {
      const nameMatch = medicine.name?.toLowerCase().includes(lowerQuery);
      const genericMatch = medicine.genericName?.toLowerCase().includes(lowerQuery);
      const codeMatch = medicine.id?.toLowerCase().includes(lowerQuery);
      
      return nameMatch || genericMatch || codeMatch;
    });

    // Sort results using the enhanced sorting logic
    const sortedResults = sortMedicines(results);
    setFilteredMedicines(sortedResults);
    setSearchTriggered(true);
    setShowSuggestions(false);
  }, [searchQuery, medicines]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setFilteredMedicines([]);
    setSearchTriggered(false);
    setSelectedMedicine(null);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchQuery) {
        e.preventDefault();
        handleClearSearch();
      }
      
      if (e.key === 'Escape' && selectedMedicine) {
        setSelectedMedicine(null);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClearSearch, searchQuery, selectedMedicine]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <RefreshCw className="animate-spin" size={48} />
        </div>
        <h2 className={styles.loadingText}>Loading Medicine Database...</h2>
        <p className={styles.loadingSubtext}>Please wait while we fetch the latest data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <AlertCircle size={48} />
        </div>
        <h2 className={styles.errorTitle}>Unable to Load Data</h2>
        <p className={styles.errorMessage}>
          We're having trouble loading the medicine database. Please check your connection and try again.
        </p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={20} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Full-screen search results overlay */}
      {searchTriggered && (
        <div className={styles.searchResultsOverlay}>
          {/* Fixed header with close and view controls */}
          <div className={styles.searchResultsHeader}>
            <div className={styles.headerLeft}>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setSearchTriggered(false);
                  setFilteredMedicines([]);
                  setSearchQuery('');
                }}
                aria-label="Close search results"
              >
                <X size={24} />
              </button>
              <div className={styles.searchResultsTitle}>
                <h2>Search Results for "{searchQuery}"</h2>
                <span className={styles.resultsCount}>
                  {filteredMedicines.length > 0 ? (
                    <>
                      <CheckCircle size={16} />
                      {filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''} found
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      No medicines found
                    </>
                  )}
                </span>
              </div>
            </div>
            
            <div className={styles.headerRight}>
              <div className={styles.viewModeSelector}>
                <button
                  className={`${styles.viewModeButton} ${
                    viewMode === 'grid' ? styles.active : ''
                  }`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Switch to grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`${styles.viewModeButton} ${
                    viewMode === 'list' ? styles.active : ''
                  }`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="Switch to list view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Search results content */}
          <div className={styles.searchResultsContent}>
            {filteredMedicines.length > 0 ? (
              <div className={`${styles.medicineContainer} ${styles[`${viewMode}View`]}`}>
                {viewMode === 'grid' ? (
                  <div className={styles.medicineGrid}>
                    {filteredMedicines.map((medicine) => (
                      <MedicineCard 
                        key={medicine.id} 
                        medicine={medicine}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.medicineList}>
                    {filteredMedicines.map((medicine) => (
                      <MedicineListItem 
                        key={medicine.id} 
                        medicine={medicine}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noResultsContainer}>
                <div className={styles.noResultsIcon}>
                  <Search size={64} />
                </div>
                <h3 className={styles.noResultsTitle}>No medicines found</h3>
                <p className={styles.noResultsDescription}>
                  We couldn't find any medicines matching "{searchQuery}". 
                  Try adjusting your search terms or check for typos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content - hidden when search is active */}
      <div className={`${styles.mainContent} ${searchTriggered ? styles.hidden : ''}`}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>
            <Sparkles size={48} className={styles.heroIcon} />
            UAE Medicine Search
          </h1>
          <p className={styles.heroSubtitle}>
            Discover comprehensive pharmaceutical information with our advanced search system. 
            Find medicines, check availability, and access detailed drug information instantly.
          </p>
          
          <div className={styles.heroFeatures}>
            <div className={styles.heroFeature}>
              <Database size={20} />
              <span>21,000+ Medicines</span>
            </div>
            <div className={styles.heroFeature}>
              <Shield size={20} />
              <span>UAE Approved</span>
            </div>
            <div className={styles.heroFeature}>
              <Zap size={20} />
              <span>Real-time Search</span>
            </div>
            <div className={styles.heroFeature}>
              <CheckCircle size={20} />
              <span>Verified Data</span>
            </div>
          </div>
        </section>

        {/* Enhanced Search Section */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <h2 className={styles.searchTitle}>Smart Medicine Finder</h2>
            <p className={styles.searchDescription}>
              Search by medicine name, generic name, or DOH drug code for instant results
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              executeSearch();
            }}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={24} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      executeSearch();
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchQuery.trim() && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Search medicines... (e.g., Paracetamol)"
                  className={styles.searchInput}
                  autoComplete="off"
                />
                
                <div className={styles.searchButtonsContainer}>
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={handleClearSearch}
                      className={styles.clearButton}
                    >
                      <AlertCircle size={18} />
                      Clear
                    </button>
                  )}
                  
                  <button type="submit" className={styles.searchButton} disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <Search size={20} />
                    )}
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className={styles.suggestionsDropdown} ref={suggestionsRef}>
                    {suggestions.slice(0, 8).map((medicine, index) => {
                      return (
                        <div
                          key={`${medicine.id}-${index}`}
                          className={styles.suggestionItem}
                          onClick={() => handleSuggestionClick(
                            medicine, 
                            medicine._isGenericSuggestion ? medicine._genericName || '' : (medicine.name || medicine.genericName || medicine.id || 'Unknown')
                          )}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Pill className={styles.suggestionIcon} size={20} />
                          <div className={styles.suggestionContent}>
                            {medicine._isGenericSuggestion ? (
                              <>
                                <div className={styles.suggestionName}>
                                  {medicine._genericName}
                                  <span className={styles.medicineCount}>
                                    ({medicine._medicineCount} medicine{medicine._medicineCount !== 1 ? 's' : ''})
                                  </span>
                                </div>
                                <div className={styles.suggestionGeneric}>Generic Name Group</div>
                              </>
                            ) : (
                              <>
                                <div className={styles.suggestionName}>{medicine.name}</div>
                                <div className={styles.suggestionGeneric}>{medicine.genericName}</div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Enhanced Search Tips */}
        <section className={styles.searchTips}>
          <div 
            className={styles.tipsHeader}
            onClick={() => setShowSearchTips(!showSearchTips)}
          >
            <Target size={24} />
            <h3 className={styles.tipsTitle}>Search Tips & Guidelines</h3>
            {showSearchTips ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {showSearchTips && (
            <div className={styles.tipsContent}>
              <div className={styles.tipsGrid}>
                <div className={styles.tipCard}>
                  <div className={styles.tipHeader}>
                    <div className={styles.tipIcon}>
                      <Pill size={20} />
                    </div>
                    <h4 className={styles.tipTitle}>Medicine Names</h4>
                  </div>
                  <p className={styles.tipDescription}>
                    Search using brand names or generic names for comprehensive results.
                  </p>
                  <div className={styles.tipExample}>Example: "Paracetamol" or "Panadol"</div>
                </div>
                
                <div className={styles.tipCard}>
                  <div className={styles.tipHeader}>
                    <div className={styles.tipIcon}>
                      <FileText size={20} />
                    </div>
                    <h4 className={styles.tipTitle}>DOH Drug Codes</h4>
                  </div>
                  <p className={styles.tipDescription}>
                    Use official DOH drug codes for precise identification.
                  </p>
                  <div className={styles.tipExample}>Example: "20001" or "DR-2023-001"</div>
                </div>
                
                <div className={styles.tipCard}>
                  <div className={styles.tipHeader}>
                    <div className={styles.tipIcon}>
                      <Search size={20} />
                    </div>
                    <h4 className={styles.tipTitle}>Smart Search</h4>
                  </div>
                  <p className={styles.tipDescription}>
                    Our intelligent search works with partial matches and typos.
                  </p>
                  <div className={styles.tipExample}>Try: "paracet" or "asprin"</div>
                </div>
                
                {/* <div className={styles.tipCard}>
                  <div className={styles.tipHeader}>
                    <div className={styles.tipIcon}>
                      <Keyboard size={20} />
                    </div>
                    <h4 className={styles.tipTitle}>Keyboard Shortcuts</h4>
                  </div>
                  <p className={styles.tipDescription}>
                    Use keyboard shortcuts for faster navigation and search.
                  </p>
                  <div className={styles.tipExample}>Ctrl+K to focus, Esc to clear</div>
                </div> */}
              </div>
            </div>
          )}
        </section>

        {/* Welcome Screen - Show when no search is triggered */}
        {!searchTriggered && (
          <section className={styles.resultsSection}>
            <div className={styles.welcomeScreen}>
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeIcon}>
                  <Eye size={64} />
                </div>
                <h3 className={styles.welcomeTitle}>Ready to Search</h3>
                <p className={styles.welcomeDescription}>
                  Enter a medicine name, generic name, or DOH drug code above to begin your search.
                  Our database contains comprehensive information about UAE-approved medications.
                </p>
                
                <div className={styles.quickStats}>
                  <div className={styles.statItem}>
                    <Database size={24} />
                    <div className={styles.statContent}>
                      <div className={styles.statNumber}>{medicines.length.toLocaleString()}</div>
                      <div className={styles.statLabel}>Total Medicines</div>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <Shield size={24} />
                    <div className={styles.statContent}>
                      <div className={styles.statNumber}>100%</div>
                      <div className={styles.statLabel}>UAE Approved</div>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <Clock size={24} />
                    <div className={styles.statContent}>
                      <div className={styles.statNumber}>Real-time</div>
                      <div className={styles.statLabel}>Data Updates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Keyboard Shortcuts Tooltip Icon */}
      <div 
        className={styles.keyboardShortcutsIcon}
        data-tooltip-id="keyboard-shortcuts-tooltip"
        data-tooltip-html="
          <div style='text-align: left;'>
            <h4 style='margin: 0 0 8px 0; color: #ffffff;'>⌨️ Keyboard Shortcuts</h4>
            <div style='font-size: 0.85rem; line-height: 1.4;'>
              <div style='margin-bottom: 4px;'><strong>Ctrl + K</strong> - Focus Search</div>
              <div style='margin-bottom: 4px;'><strong>Esc</strong> - Clear Search</div>
              <div style='margin-bottom: 4px;'><strong>↑ ↓</strong> - Navigate Results</div>
              <div style='margin-bottom: 4px;'><strong>Enter</strong> - Select Medicine</div>
              <div><strong>Esc</strong> - Close Modal</div>
            </div>
          </div>
        "
      >
        <Keyboard size={20} />
      </div>
      
      <Tooltip 
        id="keyboard-shortcuts-tooltip" 
        place="left" 
        style={{ 
          backgroundColor: '#0f4c75', 
          color: '#ffffff',
          borderRadius: '12px',
          fontSize: '0.875rem',
          maxWidth: '280px',
          padding: '12px 16px'
        }} 
      />
    </div>
  );
};

export default SearchPage;
