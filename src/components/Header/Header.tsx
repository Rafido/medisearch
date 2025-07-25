import React, { useState } from 'react';
import styles from './Header.module.css';
import medicineIcon from '../../assets/medicine-icon.svg';

const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginLogout = () => {
    setLoggedIn(!loggedIn);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img src={medicineIcon} alt="Medicine Database Logo" className={styles.logo} />
        <span className={styles.appName}>UPP Medicine Database</span>
      </div>
      <div className={styles.center}>
        <span className={styles.tagline}>Universal Prescription Program</span>
      </div>
      <div className={styles.right}>
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className={styles.avatar} />
        <button className={styles.loginBtn} onClick={handleLoginLogout}>
          {loggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
};

export default Header;
