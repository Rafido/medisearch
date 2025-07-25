import React from 'react';
import { Heart, Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Main Footer Content */}
        <div className={styles.footerMain}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoSection}>
              <div className={styles.logoIcon}>
                <Heart className={styles.heartIcon} size={20} />
                <Shield className={styles.shieldIcon} size={12} />
              </div>
              <div className={styles.logoText}>
                <h3 className={styles.brandName}>MediSearch</h3>
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
              <li><a href="#" className={styles.footerLink}>Analytics</a></li>
              <li><a href="#" className={styles.footerLink}>Help & Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Resources</h4>
            <ul className={styles.linksList}>
              <li><a href="#" className={styles.footerLink}>API Documentation</a></li>
              <li><a href="#" className={styles.footerLink}>Developer Guide</a></li>
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
                <span>support@medisearch.ae</span>
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
              <span>© {currentYear} MediSearch. All rights reserved.</span>
            </div>
            <div className={styles.legalLinks}>
              <a href="#" className={styles.legalLink}>Privacy Policy</a>
              <span className={styles.separator}>•</span>
              <a href="#" className={styles.legalLink}>Terms of Service</a>
              <span className={styles.separator}>•</span>
              <a href="#" className={styles.legalLink}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
