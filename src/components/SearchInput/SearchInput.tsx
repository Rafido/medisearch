import React, { useState, useEffect, useRef } from 'react'
import type { Medicine } from '../../data/medicines';
import styles from './SearchInput.module.css'

interface SearchInputProps {
  medicines: Medicine[]
  onSearch: (query: string, isSearching: boolean) => void
  onSelect: (medicine: Medicine) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ medicines, onSearch, onSelect }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Medicine[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSearchTriggered, setIsSearchTriggered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = () => {
    if (query.trim()) {
      setIsSearchTriggered(true);
      onSearch(query.trim(), true);
      setShowDropdown(false);
    }
  }

  const handleSelectSuggestion = (medicine: Medicine) => {
    setQuery(medicine.name);
    onSelect(medicine);
    setShowDropdown(false);
    inputRef.current?.focus();
    setIsSearchTriggered(true);
    onSearch(medicine.name, true);  // Trigger search when selecting a suggestion
  }

  // Update suggestions when query changes
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    const searchQuery = query.toLowerCase().trim()
    const filtered = medicines
      .filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery) ||
        medicine.genericName.toLowerCase().includes(searchQuery) ||
        (medicine.category && medicine.category.toLowerCase().includes(searchQuery))
      )
      .slice(0, 5)  // Limit to 5 suggestions

    setSuggestions(filtered)
    setShowDropdown(filtered.length > 0)
  }, [query, medicines])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  }

  useEffect(() => {
    if (query.length > 0) {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(query.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(query.toLowerCase()) ||
        medicine.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8) // Limit to 8 suggestions
      
      setSuggestions(filtered)
      setShowDropdown(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
    setSelectedIndex(-1)
  }, [query, medicines])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    setIsSearchTriggered(false)
    onSearch(newValue, false) // Update query without triggering search state
  }

  return (
    <div className={styles.searchContainer} ref={dropdownRef}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowDropdown(true)}
          placeholder="Search for medicines..."
          className={styles.searchInput}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showDropdown}
        />
        <button 
          className={styles.searchButton}
          onClick={handleSearch}
          aria-label="Search"
        >
          <svg
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      
      {showDropdown && suggestions.length > 0 && (
        <div 
          id="search-suggestions"
          className={styles.suggestionsDropdown}
          role="listbox"
        >
          {suggestions.map((medicine, index) => (
            <div
              key={medicine.id}
              className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ''}`}
              onClick={() => handleSelectSuggestion(medicine)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className={styles.medicineName}>{medicine.name}</div>
              <div className={styles.medicineDetails}>
                <span className={styles.genericName}>{medicine.genericName}</span>
                <span className={styles.category}>{medicine.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchInput