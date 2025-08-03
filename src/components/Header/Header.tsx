import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, ChevronDown, Bell, Search, Menu, X, Database, FileText } from 'lucide-react';
import styles from './Header.module.css';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface HeaderProps {
  user?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

const Header = ({ user, onSignIn, onSignOut }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    onSignOut?.();
  };

  const handleSignIn = () => {
    setIsDropdownOpen(false);
    onSignIn?.();
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Professional Logo Section */}
                                            <div className={styles.logoSection}>
            <img 
              src="/medsearch logo.png" 
              alt="MedSearch" 
              className={styles.logoIcon}
            />
          </div>        {/* Navigation Menu */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link 
                to="/" 
                className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
              >
                <Search size={16} />
                Search
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/database" 
                className={`${styles.navLink} ${location.pathname === '/database' ? styles.active : ''}`}
              >
                <Database size={16} />
                Database
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/reports" 
                className={`${styles.navLink} ${location.pathname === '/reports' ? styles.active : ''}`}
              >
                <FileText size={16} />
                Reports
              </Link>
            </li>
            {/* <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                <HelpCircle size={16} />
                Help
              </a>
            </li> */}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* User Section */}
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userActions}>
              {/* Notifications */}
              <div className={styles.notificationContainer}>
                <button
                  className={`${styles.notificationButton} ${styles.disabled}`}
                  disabled
                  aria-label="Notifications (disabled)"
                >
                  <Bell size={20} />
                </button>

                {/* Notification dropdown disabled */}
              </div>

              {/* User Menu */}
              <div className={styles.userMenu} ref={dropdownRef}>
                <button
                  className={styles.userButton}
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <div className={styles.userAvatar}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
                    ) : (
                      <span className={styles.avatarText}>
                        {getInitials(user.name)}
                      </span>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userRole}>Healthcare Professional</span>
                  </div>
                  <ChevronDown 
                    className={`${styles.chevronIcon} ${isDropdownOpen ? styles.rotated : ''}`}
                    size={16}
                  />
                </button>

                {isDropdownOpen && (
                  <div className={styles.userDropdown}>
                    <div className={styles.dropdownSection}>
                      <div className={styles.userProfile}>
                        <div className={styles.profileAvatar}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            <span>{getInitials(user.name)}</span>
                          )}
                        </div>
                        <div className={styles.profileInfo}>
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                          <span className={styles.profileBadge}>Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.dropdownDivider}></div>

                    <div className={styles.dropdownSection}>
                      <button className={styles.dropdownItem} onClick={handleSignOut}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button className={styles.signInButton} onClick={handleSignIn}>
                <User size={16} />
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          <div className={styles.mobileMenuContent}>
            <nav className={styles.mobileNavigation}>
              <ul className={styles.mobileNavList}>
                <li className={styles.mobileNavItem}>
                  <Link 
                    to="/" 
                    className={`${styles.mobileNavLink} ${location.pathname === '/' ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search size={20} />
                    <span>Search Medicines</span>
                  </Link>
                </li>
                <li className={styles.mobileNavItem}>
                  <Link 
                    to="/database" 
                    className={`${styles.mobileNavLink} ${location.pathname === '/database' ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Database size={20} />
                    <span>Database</span>
                  </Link>
                </li>
                <li className={styles.mobileNavItem}>
                  <Link 
                    to="/reports" 
                    className={`${styles.mobileNavLink} ${location.pathname === '/reports' ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText size={20} />
                    <span>Reports</span>
                  </Link>
                </li>
                {/* <li className={styles.mobileNavItem}>
                  <a 
                    href="#" 
                    className={styles.mobileNavLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HelpCircle size={20} />
                    <span>Help & Support</span>
                  </a>
                </li> */}
              </ul>
            </nav>

            {/* Mobile User Section */}
            {/* {user ? (
              <div className={styles.mobileUserSection}>
                <div className={styles.mobileUserInfo}>
                  <div className={styles.mobileUserAvatar}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{getInitials(user.name)}</span>
                    )}
                  </div>
                  <div className={styles.mobileUserDetails}>
                    <div className={styles.mobileUserName}>{user.name}</div>
                    <div className={styles.mobileUserEmail}>{user.email}</div>
                  </div>
                </div>
                <div className={styles.mobileUserActions}>
                  <button className={styles.mobileActionButton} onClick={handleSignOut}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.mobileAuthSection}>
                <button className={styles.mobileSignInButton} onClick={handleSignIn}>
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              </div>
            )} */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
