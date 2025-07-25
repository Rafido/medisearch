import { useState, useRef, useEffect } from 'react';
import { Heart, Shield, User, Settings, LogOut, ChevronDown, Bell, Search } from 'lucide-react';
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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
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
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
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
          <div className={styles.logoIcon}>
            <div className={styles.iconContainer}>
              <Heart className={styles.heartIcon} size={24} />
              <Shield className={styles.shieldIcon} size={16} />
            </div>
          </div>
          <div className={styles.logoText}>
            <h1 className={styles.brandName}>MediSearch</h1>
            <span className={styles.brandTagline}>UAE Pharmaceutical Database</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#" className={`${styles.navLink} ${styles.active}`}>
                <Search size={16} />
                Search
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Database
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Analytics
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Help
              </a>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userActions}>
              {/* Notifications */}
              <div className={styles.notificationContainer} ref={notificationRef}>
                <button
                  className={styles.notificationButton}
                  onClick={toggleNotification}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className={styles.notificationBadge}>3</span>
                </button>

                {isNotificationOpen && (
                  <div className={styles.notificationDropdown}>
                    <div className={styles.notificationHeader}>
                      <h3>Notifications</h3>
                      <span className={styles.notificationCount}>3 new</span>
                    </div>
                    <div className={styles.notificationList}>
                      <div className={styles.notificationItem}>
                        <div className={styles.notificationDot}></div>
                        <div className={styles.notificationContent}>
                          <p className={styles.notificationTitle}>Database Updated</p>
                          <p className={styles.notificationTime}>2 minutes ago</p>
                        </div>
                      </div>
                      <div className={styles.notificationItem}>
                        <div className={styles.notificationDot}></div>
                        <div className={styles.notificationContent}>
                          <p className={styles.notificationTitle}>New Medicine Added</p>
                          <p className={styles.notificationTime}>1 hour ago</p>
                        </div>
                      </div>
                      <div className={styles.notificationItem}>
                        <div className={styles.notificationDot}></div>
                        <div className={styles.notificationContent}>
                          <p className={styles.notificationTitle}>System Maintenance</p>
                          <p className={styles.notificationTime}>3 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.notificationFooter}>
                      <button className={styles.viewAllButton}>View All</button>
                    </div>
                  </div>
                )}
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
                      <button className={styles.dropdownItem}>
                        <User size={16} />
                        <span>My Profile</span>
                      </button>
                      <button className={styles.dropdownItem}>
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                      <button className={styles.dropdownItem}>
                        <Shield size={16} />
                        <span>Privacy</span>
                      </button>
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
    </header>
  );
};

export default Header;
