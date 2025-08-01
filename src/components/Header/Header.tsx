import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Database, HelpCircle } from 'lucide-react';
import styles from './Header.module.css';
import medicineIcon from '../../assets/medicine-icon.svg';

const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLoginLogout = () => {
    setLoggedIn(!loggedIn);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src={medicineIcon} alt="Medicine Database Logo" className={styles.logo} />
        <span className={styles.appName}>UPP Medicine Database</span>
      </div>
      
      <div className={styles.center}>
        <span className={styles.tagline}>Universal Prescription Program</span>
      </div>
      
      {/* Desktop Navigation */}
      <nav className={styles.navigation}>
        <a href="/" className={styles.navLink}>
          <Search size={18} />
          Search
        </a>
        <a href="/database" className={styles.navLink}>
          <Database size={18} />
          Database
        </a>
        <a href="/help" className={styles.navLink}>
          <HelpCircle size={18} />
          Help
        </a>
      </nav>
      
      <div className={styles.right}>
        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className={styles.avatar} />
        <button className={styles.loginBtn} onClick={handleLoginLogout}>
          {loggedIn ? 'Logout' : 'Login'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
      >
        <ul className={styles.mobileMenuList}>
          <li className={styles.mobileMenuItem}>
            <a 
              href="/" 
              className={styles.mobileMenuLink}
              onClick={closeMobileMenu}
            >
              <Search size={20} />
              Search
            </a>
          </li>
          <li className={styles.mobileMenuItem}>
            <a 
              href="/database" 
              className={styles.mobileMenuLink}
              onClick={closeMobileMenu}
            >
              <Database size={20} />
              Database
            </a>
          </li>
          <li className={styles.mobileMenuItem}>
            <a 
              href="/help" 
              className={styles.mobileMenuLink}
              onClick={closeMobileMenu}
            >
              <HelpCircle size={20} />
              Help
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
