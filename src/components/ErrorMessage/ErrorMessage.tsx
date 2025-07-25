import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className={styles.errorContainer}>
    <div className={styles.errorIcon}>⚠️</div>
    <h2>Error Loading Data</h2>
    <p>{error}</p>
    <button 
      className={styles.retryButton}
      onClick={onRetry}
    >
      Retry
    </button>
  </div>
);

export default ErrorMessage;
