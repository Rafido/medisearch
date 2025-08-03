import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, X, FileText } from 'lucide-react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  const openModal = (modalType: 'privacy' | 'terms' | 'cookies') => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Main Footer Content */}
        <div className={styles.footerMain}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoSection}>
              <img 
                src="/medsearch logo.png" 
                alt="MedSearch" 
                className={styles.logoIcon}
              />
              <div className={styles.logoText}>
                <p className={styles.brandTagline}>UAE Pharmaceutical Database</p>
              </div>
            </div>
            <p className={styles.brandDescription}>
              Your trusted platform for accessing comprehensive pharmaceutical information 
              in the United Arab Emirates. Empowering healthcare professionals with accurate, 
              up-to-date medicine data.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li><a href="/" className={styles.footerLink}>Search Medicines</a></li>
              <li><a href="/database" className={styles.footerLink}>Full Database</a></li>
              <li><a href="/reports" className={styles.footerLink}>Reports</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Resources</h4>
            <ul className={styles.linksList}>
              <li><a href="#" className={styles.footerLink}>Data Sources</a></li>
              <li><a href="#" className={styles.footerLink}>Updates</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.contactSection}>
            <h4 className={styles.sectionTitle}>Contact</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>support@medsearch.me</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>+971 – 50 127 2921</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>Dubai, UAE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <Calendar size={16} />
              <span>© {currentYear} MedSearch. All rights reserved.</span>
            </div>
            <div className={styles.legalLinks}>
              <button onClick={() => openModal('privacy')} className={styles.legalLink}>Privacy Policy</button>
              <span className={styles.separator}>•</span>
              <button onClick={() => openModal('terms')} className={styles.legalLink}>Terms of Service</button>
              <span className={styles.separator}>•</span>
              <button onClick={() => openModal('cookies')} className={styles.legalLink}>Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlays */}
      {activeModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FileText size={24} />
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'cookies' && 'Cookie Policy'}
              </h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {activeModal === 'privacy' && (
                <div>
                  <h3>Information We Collect</h3>
                  <p>
                    MedSearch is committed to protecting your privacy. We collect only the essential information 
                    required to provide our pharmaceutical database services.
                  </p>
                  
                  <h3>User Account Information</h3>
                  <p>
                    When you create an account, we store your login credentials (username/email and encrypted password) 
                    and professional verification details. We do not collect or store personal health information, 
                    browsing habits, or any sensitive personal data.
                  </p>
                  
                  <h3>Access Restrictions</h3>
                  <p>
                    <strong>App credentials cannot be shared between users.</strong> Each account is strictly personal 
                    and tied to individual verification. Unauthorized sharing or distribution of access credentials 
                    is prohibited and may result in account termination.
                  </p>
                  
                  <h3>Subscription-Based Access</h3>
                  <p>
                    Access to the MedSearch database requires an active subscription. The app cannot be used 
                    without proper subscription verification. All features are disabled for unsubscribed users.
                  </p>
                  
                  <h3>Data Security</h3>
                  <p>
                    We implement industry-standard security measures to protect your account information. 
                    All data is encrypted in transit and at rest. We do not sell, rent, or share your 
                    information with third parties.
                  </p>
                  
                  <h3>Session Management</h3>
                  <p>
                    We store session information only to maintain your logged-in status and provide seamless 
                    access to the database. Sessions expire automatically after a period of inactivity.
                  </p>
                </div>
              )}
              
              {activeModal === 'terms' && (
                <div>
                  <h3>Acceptance of Terms</h3>
                  <p>
                    By accessing and using MedSearch, you accept and agree to be bound by the terms 
                    and provision of this agreement.
                  </p>
                  
                  <h3>Subscription Requirements</h3>
                  <p>
                    <strong>Access to MedSearch requires an active subscription.</strong> The application 
                    cannot be used without a valid subscription plan. All features and database access 
                    are disabled for non-subscribers.
                  </p>
                  
                  <h3>Account Security and Restrictions</h3>
                  <p>
                    <strong>Account credentials are strictly personal and non-transferable.</strong> 
                    You are prohibited from:
                  </p>
                  <ul>
                    <li>Sharing your login credentials with other individuals</li>
                    <li>Creating multiple accounts for the same user</li>
                    <li>Allowing unauthorized access to your account</li>
                    <li>Using automated tools to access the database</li>
                  </ul>
                  
                  <h3>Professional Use Only</h3>
                  <p>
                    MedSearch is intended for healthcare professionals and authorized personnel only. 
                    Users must maintain valid professional credentials and use the service responsibly.
                  </p>
                  
                  <h3>Data Usage</h3>
                  <p>
                    The pharmaceutical data provided is for informational purposes only. Users are 
                    responsible for verifying information before making clinical decisions.
                  </p>
                  
                  <h3>Termination</h3>
                  <p>
                    We reserve the right to terminate accounts that violate these terms, share credentials, 
                    or attempt unauthorized access. Terminated accounts will lose all access immediately.
                  </p>
                </div>
              )}
              
              {activeModal === 'cookies' && (
                <div>
                  <h3>How We Use Cookies</h3>
                  <p>
                    MedSearch uses cookies and similar technologies to enhance your user experience 
                    and maintain session security.
                  </p>
                  
                  <h3>Essential Cookies</h3>
                  <p>
                    We use essential cookies to:
                  </p>
                  <ul>
                    <li>Keep you logged in during your session</li>
                    <li>Remember your authentication status</li>
                    <li>Maintain application security</li>
                    <li>Store temporary session data</li>
                  </ul>
                  
                  <h3>What We Don't Store</h3>
                  <p>
                    <strong>We do not store or track:</strong>
                  </p>
                  <ul>
                    <li>Personal browsing habits outside our application</li>
                    <li>Third-party website visits</li>
                    <li>Personal health information</li>
                    <li>Marketing or advertising data</li>
                    <li>Location data beyond what you voluntarily provide</li>
                  </ul>
                  
                  <h3>Session Cookies Only</h3>
                  <p>
                    We primarily use session cookies that are automatically deleted when you close 
                    your browser. These cookies contain no personally identifiable information 
                    beyond your login status.
                  </p>
                  
                  <h3>Cookie Management</h3>
                  <p>
                    You can disable cookies in your browser settings, but this may affect the 
                    functionality of the application. Essential cookies are required for the 
                    app to function properly.
                  </p>
                  
                  <h3>Third-Party Cookies</h3>
                  <p>
                    MedSearch does not use third-party tracking cookies or analytics tools 
                    that collect personal information.
                  </p>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCloseButton} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
