import { useState } from 'react';
import { Eye, EyeOff, Lock, User, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { AUTH_STORAGE, validateCredentials } from '../../utils/auth';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (validateCredentials(username.trim(), password)) {
      try {
        // Store authentication data using AUTH_STORAGE
        AUTH_STORAGE.setAuthData(true, {
          username: 'admin',
          name: 'Administrator',
          email: 'admin@smartmedicine.ae',
          role: 'administrator',
          loginTime: new Date().toISOString()
        });
        
        onLogin();
      } catch (error) {
        console.error('Failed to store authentication data:', error);
        setError('Login failed. Please try again.');
      }
    } else {
      setError('Invalid username or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundPattern}></div>
      
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <Shield size={32} />
          </div>
          <h1 className={styles.title}>Smart Medicine Finder</h1>
          <p className={styles.subtitle}>Secure Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={20} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className={styles.submitButton}
          >
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <div className={styles.helpText}>
            <p>Demo Credentials:</p>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
